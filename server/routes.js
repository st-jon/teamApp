const express = require('express')
const path = require('path')
const util = require('util')
const multer = require('multer')
const uidSafe = require('uid-safe')
const request = require('request')
var rp = require('request-promise-native')
const cheerio = require('cheerio')
const _ = require('lodash')


const publicPath = path.join(__dirname, '..', '/index.html')

const app = express.Router()

const {addUser, getUserByEmail, getUserById, updateUserById, updateUserWithCurrentTeam, getCurrentTeam, getNotesTypesByAuthor, getFilesByNotesType, insertDefaultIntoNotes, addNotesWithPicture, addNotesWithLink, addNotesWithAudio, addNotesWithVideo, searchFriendByName, addTeam, addTeamMate, getTeams, getTeamsAndStatus, getMemberByTeam, addMemberRequest, acceptMemberRequest, cancelMemberRequest, getCurrentTeamAndMembers} = require('../db/db')
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

app.post('/addCurrentTeamToUser', (req, res) => {
    updateUserWithCurrentTeam(req.session.userID, req.body.teamID)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})

app.post('/currentTeamMembers', (req, res) => {
    getCurrentTeam(req.body.teamID)
        .then(teams => res.json(teams))
        .catch(err => console.log('error here',err.message))
})

// NAVIGATE TO OTHER PROFILE
app.get('/api/user/:id', (req, res) => {
    if(req.session.userID == req.params.id) {
        res.json({ redirectTo: '/'})
    } else {
        getUserById(req.params.id)
        .then(data => res.json(data))
        .catch(err => {
            console.log(err.message)
            res.json({redirectTo: '/'})
        })
    } 
})

app.get('/notes', async(req, res) => {
    const data = await getNotesTypesByAuthor(req.session.userID)
    if (data.rowCount === 0) {
        const {defaultData} = await insertDefaultIntoNotes(req.session.userID)
        const noteType = await getNotesTypesByAuthor(req.session.userID)
        res.json(noteType)
    } else {
        res.json(data)
    }
})

app.post('/files', async(req, res) => {
    const files = await getFilesByNotesType(req.session.userID, req.body.type)
    res.json(files)
})

// SEARCH FRIENDS
app.get('/search/:text', (req, res) => {
    searchFriendByName(`${req.params.text}%`)
        .then(data => res.json(data))  
        .catch(err => console.log(err.message))
})

// ADD NOTE WITH PICTURE
app.post('/notesWithPicture', uploader.single('file'), upload, (req, res) => {
    let url = `${s3Url}${req.file.filename}` 
    addNotesWithPicture(req.session.userID, req.body.text, req.body.folder, req.body.title, true, url)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})

// ADD NOTE WITH LINK
app.post('/getBodyLink', (req, res) => {
    rp(req.body.url)
        .then(data => {
            const $ = cheerio.load(data)
            const picture = $('meta[property="og:image"]').attr('content')
            const publisher = $('meta[property="og:site_name"]').attr('content')
            const description = $('meta[property="og:description"]').attr('content')
            return addNotesWithLink(req.session.userID, req.body.folder, req.body.noteTitle, req.body.url, description, publisher, picture)       
        })
        .then(note => res.json(note))
        .catch(err => err.message)
})

// ADD NOTE WITH SOUND
app.post('/notesWithAudio', uploader.single('file'), upload, (req, res) => {
    let url = `${s3Url}${req.file.filename}` 
    addNotesWithAudio(req.session.userID, req.body.folder, req.body.title, url)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})

// ADD NOTE WITH VIDEO
app.post('/notesWithVideo', uploader.single('file'), upload, (req, res) => {
    let url = `${s3Url}${req.file.filename}` 
    addNotesWithVideo(req.session.userID, req.body.folder, req.body.title, url)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})


// CREATE TEAM
app.post('/teamCreate', (req, res) => {
    addTeam(req.session.userID, req.body.team)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})

// ADD TEAMMATE
app.post('/teamMateCreate', (req, res) => {
    addTeamMate(req.body.teamID, req.body.teamName, req.body.memberID, req.body.isAdmin, req.body.accepted)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})

// GET TEAMS
app.get('/teams', (req, res) => {
    getTeams(req.session.userID)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})

// // GET TEAMS AND STATUS
app.post('/status/:id', (req, res) => {
    getMemberByTeam(req.params.id, req.body.teamID)
        .then(data => {res.json(data)})
        .catch(err => console.log(err.message))
})

// GET MEMBERS FROM TEAM
app.post('/getMembersFromTeam', (req, res) => {
    getCurrentTeamAndMembers(req.body.id)
        .then(data => res.json(data))
        .catch(err => console.log(err.message))
})

// // UPDATE MEMBER STATUS
app.post('/updateMemberStatus', (req, res) => {
    if (req.body.status === 'Add Member') {
        addMemberRequest(req.body.memberID, req.body.team, req.body.name)
            .then(data => res.json(data))
            .catch(err => console.log(err.message))
    }
    else if (req.body.status === 'Join this team') {
        acceptMemberRequest(req.body.memberID, req.body.team)
            .then(data => res.json(data))
            .catch(err => console.log(err.message))
    }
    else if (req.body.status === 'Pending... Cancel?' || 'leave this team') {
        cancelMemberRequest(req.body.memberID, req.body.team)
            .then(data => res.json(data))
            .catch(err => console.log(err.message))
    }
})

// // UPLOAD PROFILE PICTURE
// app.post('/upload', uploader.single('file'), upload, (req, res) => {
//     let url = `${s3Url}${req.file.filename}` 
//     addProfilePic(req.session.userID, url)
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