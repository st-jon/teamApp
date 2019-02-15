const bodyParser = require('body-parser')
const compression = require('compression')
const cookieSession = require('cookie-session')
const csurf = require('csurf')
const express = require('express')
const path = require('path')

const {cookieSecret} = require("../secrets.json")
const routes = require('./routes')

const app = new express()
const publicPath = path.join(__dirname, '..', 'public')

const server = require('http').Server(app)
const io = require('socket.io')(server, { origins: 'localhost:8080', pingTimeout: 60000})

app.use('/favicon.ico', (req, res) => {
    res.send()
})
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


// io.on('connection', (socket) => {
//     console.log('server connected to socket', socket.id)

//     socket.on('disconnect', () => {

//     })
// })