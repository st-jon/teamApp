const express = require('express')
const path = require('path')
const multer = require('multer')
const uidSafe = require('uid-safe')
const publicPath = path.join(__dirname, '..', '/index.html')

const app = express.Router()

const {addUser, getUserByEmail, getUserById, updateUserById} = require('../db/db')
const {hashPassword, checkPassword} = require('../utils/crypt')
const {validateForm} = require('../utils/utils')
const {upload} = require('./s3')
const {s3Url} = require('../config') 

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '..', '/uploads'))
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname))
      })
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 20097152
    }
})




// FIRST WELCOME PAGE 
app.get('/welcome', (req, res) => {
    if (req.session.userID) {
        res.redirect('/')
    } else {
        res.sendFile(publicPath)
    }
})

// GET USER BY ID
app.get('/user', (req, res) => {
    getUserById(req.session.userID)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})

app.post('/updateUser', (req, res) => {
    updateUserById(req.session.userID, req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.genre)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})

app.post('/updateUserWithPicture', uploader.single('file'), upload, (req, res) => {
    let url = `${s3Url}${req.file.filename}`
    updateUserById(req.session.userID, req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.genre, url)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})


// // UPLOAD PROFILE PICTURE
// app.post('/upload', uploader.single('file'), upload, (req, res) => {
//     let url = `${s3Url}${req.file.filename}` 
//     addProfilePic(req.session.userID, url)
//         .then(data => res.json(data))
//         .catch(err => console.log(err.message))
// })

// // UPLOAD WALL WITH PICTURE
// app.post('/wallWithPicture', uploader.single('file'), upload, (req, res) => {
//     let url = `${s3Url}${req.file.filename}` 
//     addWallPosts(req.session.userID, req.body.first, req.body.last, req.body.picture, req.body.message, url)
//         .then(data => res.json(data))
//         .catch(err => console.log(err.message))
// })

// // UPLOAD WALL NO PICTURE
// app.post('/wallNoPicture', (req, res) => {
//     addWallPosts(req.session.userID, req.body.first, req.body.last, req.body.picture, req.body.message)
//         .then(data => res.json(data))
//         .catch(err => console.log(err.message))
// })

// // EDIT USER BIO
// app.post('/edit/bio', (req, res) => {
//     addBio(req.session.userID, req.body.bio)
//         .then(data => res.json(data))
//         .catch(err => console.log(err.message))
// })

// // NAVIGATE TO OTHER PROFILE
// app.get('/api/user/:id', (req, res) => {
//     if(req.session.userID == req.params.id) {
//         res.json({ redirectTo: '/'})
//     } else {
//         getUserById(req.params.id)
//         .then(data => res.json(data))
//         .catch(err => {
//             console.log(err.message)
//             res.json({redirectTo: '/'})
//         })
//     } 
// })

// // SEARCH FRIENDS
// app.get('/search/:text', (req, res) => {
//     searchFriendByName(`${req.params.text}%`)
//         .then(data => res.json(data))
//         .catch(err => console.log(err.message))
// })

// // GET FRIEND STATUS
// app.get('/status/:id', (req, res) => {
//     getFriendStatus(req.session.userID, req.params.id)
//         .then(data => res.json(data))
//         .catch(err => console.log(err.message))
// })

// // UPDATE FRIEND STATUS
// app.post('/status/update', (req, res) => {
//     if (req.body.status === 'Add Friend') {
//         addFriendRequest(req.session.userID, req.body.otherID)
//             .then(data => res.json(data))
//             .catch(err => console.log(err.message))
//     }
//     else if (req.body.status === 'Accept Invitation') {
//         acceptFriendRequest(req.body.otherID, req.session.userID)
//             .then(data => res.json(data))
//             .catch(err => console.log(err.message))
//     }
//     else if (req.body.status === 'Cancel Invitation' || 'Delete Friend') {
//         cancelFriendRequest(req.session.userID, req.body.otherID)
//             .then(data => res.json(data))
//             .catch(err => console.log(err.message))
//     }
// })

// // GET FRIENDS AND WANABEE
// app.get('/getfriends', (req, res) => {
//     getFriendsAndWanabee(req.session.userID)
//         .then(data => res.json({data}))
//         .catch(err => console.log(err.message))
// })

// // GET ONLINE USERS 
// app.post('/chat', (req, res) => {
//     getUsersById(req.body.arraysOfId)
//         .then(data => res.json(data))
//         .catch(err => console.log(err.message))
// })

// SEND REGISTRATION
app.post('/register', (req, res) => {

    let validation = validateForm(req.body)

    if (validation) {
        res.json({error: validation })
        return
    }
    if (!req.body.password) {
        res.json({error: 'Please provide a password' })
        return
    }


    hashPassword(req.body.password)
        .then(hash => {
            return addUser(req.body.username, req.body.firstName, req.body.lastName, req.body.email, hash);
        })
        .then(({rows}) => {
            req.session.userID = rows[0].id
            res.json({success: true })
        })
        .catch(err => {
            if (err.code === '23505' && err.constraint === 'users_username_key') {
                let error = 'Username Already in use please choose another one'
                res.json({error})
                return
            }
            else if (err.code === '23505' && err.constraint === 'users_email_key') {
                let error = 'Email Already registered maybe try to login'
                res.json({error})
                return
            }
            else {
                let error = 'something went wrong please try again'
                res.json({error})
                return
            }
            
        })
})

// LOGIN
app.post('/login', (req, res) => {
    getUserByEmail(req.body.email)
        .then(({rows}) => {
            if (rows.length < 1) {
                res.json({
                    error: 'this user is not registered'
                })
                return
            }
            req.session.userID = rows[0].id
            return checkPassword(req.body.password, rows[0].password)
        })
        .then(bool => {
            if(bool === true) {
                res.json({success: true})
            } else {
                req.session.userID = null
                res.json({error: 'this password is incorrect'})
                return
            }
        })
        .catch(err => {
            console.log(err)
            res.json({ error: 'something went wrong...'})
        })
})

// LOGOUT
app.get('/logout', (req, res) => {
    req.session.userID = null
    res.redirect('/welcome')
})

// ALL OTHER ROUTES
app.get('*', function(req, res) {
    if (!req.session.userID) {        
        res.redirect('/welcome')
    } else {
        res.sendFile(publicPath)
    }
})

module.exports = app