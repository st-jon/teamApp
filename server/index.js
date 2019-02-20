const bodyParser = require('body-parser')
const compression = require('compression')
const cookieSession = require('cookie-session')
const csurf = require('csurf')
const express = require('express')
const path = require('path')

const {cookieSecret} = require("../secrets.json")
const routes = require('./routes')

const {getUsersById, getMessages, addMessage} = require('../db/db')

const app = new express()
const publicPath = path.join(__dirname, '..', 'public')

const server = require('http').Server(app)
const io = require('socket.io')(server, { origins: 'localhost:8080', pingTimeout: 60000})

app.use(compression())

app.use(bodyParser.json())

const cookieSessionMiddleware = cookieSession({
    secret: cookieSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
})
app.use(cookieSessionMiddleware)
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next)
})

app.use(express.static(publicPath))

app.use(csurf())

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken())
    next()
})

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`))
}

app.use('/', routes)


server.listen(8080, function() {
    console.log("Server listen on port 8080")
})



let onlineUsers = {}
let currentRoom

io.on('connection', (socket) => {
    console.log('server connected to socket', socket.id)

    onlineUsers[socket.id] = socket.request.session.userID

    let usersID = [... new Set(Object.values(onlineUsers))]
    socket.on('subscribe', room => {
        socket.join(room)



    // ONLINE USERS
    getUsersById(usersID, room)
        .then(data => {
            socket.emit('users online', {
                onlineUsers: data.rows
            })
            socket.to(room).broadcast.emit('new user', {
                newUser: data.rows.filter(user => {
                    return user.id === socket.request.session.userID
                })
            })
        })
        .catch(err => console.log(err.message))


    // CHAT ROOM MESSAGES
    getMessages(room)
        .then(data => {
            socket.emit('chat messages', {
                messages: data.rows.reverse()
            })
        })
        .catch(err => console.log('here', err.message))

    socket.on('new chat message from user', message => {
        addMessage(socket.request.session.userID, room, message.message)
            .then(data => {
                data.rows[0].username = message.username
                data.rows[0]['first_name'] = message.first
                data.rows[0]['last_name'] = message.last
                data.rows[0]['user_picture'] = message.picture
                data.rows[0].genre = message.genre
                io.in(room).emit('chat message', {
                    message: data.rows[0]
                })
            })
            .catch(err => console.log(err.message))
    })
})

    socket.on('disconnect', () => {
        let userToDelete =  onlineUsers[socket.id]
        delete onlineUsers[socket.id]

        io.sockets.emit('user left', {
            id: userToDelete
        })
    })
})