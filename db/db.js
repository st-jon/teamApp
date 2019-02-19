const spicedPg = require("spiced-pg");

let db

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("../secrets.json")
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/teamApp`)
}


// ADD USER
module.exports.addUser = (username, firstName, lastName, email, password) => {
    return db.query(`
        INSERT INTO users (username, first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [username, firstName, lastName, email, password]
    )
}

// GET USER BY EMAIL
module.exports.getUserByEmail = (email) => {
    return db.query(`
        SELECT * FROM users
        WHERE email = $1`,
        [email]
    )
}

// GET USER BY ID
module.exports.getUserById = (id) => {
    return db.query(`
        SELECT id, username, first_name, last_name, email, genre, user_picture, user_status, current_teamid 
        FROM users
        WHERE id = $1`,
        [id]
    )
}

// UPDATE USER
module.exports.updateUserById = (id, username, firstName, lastName, email, genre, picture ) => {
    return db.query(`
        UPDATE users
        SET username = $2, first_name = $3, last_name = $4, email = $5, genre = $6, user_picture = $7
        WHERE id = $1
        RETURNING *`, 
        [id, username, firstName, lastName, email, genre, picture ]
    )
}

// GET USERS BY ID
module.exports.getUsersById = (arrayOfId) => {
    return db.query(`
        SELECT id, username, first_name, last_name, profil_pic 
        FROM users 
        WHERE id = ANY($1)`, 
        [arrayOfId]
    )
}

// ADD CURRENT TEAM TO USER
module.exports.updateUserWithCurrentTeam = (id, teamID) => {
    return db.query(`
        UPDATE users
        SET current_teamID = $2
        WHERE id = $1`, 
        [id, teamID]
    )
}

// GET NOTES BY AUTHOR ID
module.exports.getNotesByAuthor = (id) => {
    return db.query(`
        SELECT * FROM notes
        WHERE author_id = $1`, 
        [id]
    )
}

module.exports.getNotesTypesByAuthor = (id) => {
    return db.query(`
        SELECT note_type FROM notes
        WHERE author_id = $1`, 
        [id]
    )
}

module.exports.getFilesByNotesType = (id, type) => {
    return db.query(`
        SELECT * FROM notes
        WHERE note_type = $2 AND author_id = $1`, 
        [id, type]
    )
}

// SEARCH FOR FRIENDS
module.exports.searchFriendByName = (text) => {
    return db.query(`
        SELECT id, username, first_name, last_name,  genre, user_picture, user_status 
        FROM users
        WHERE first_name LIKE $1
        OR last_name LIKE $1`,
        [text]
    )
}

// INSERT DEFAULT VALUES IN NOTES
module.exports.insertDefaultIntoNotes = (id) => {
    return db.query(`
        INSERT INTO notes (author_id, note_type, note, title, editable)
        VALUES 
        ($1, 'To Do', 'My first note to do', 'my first note to do', true),
        ($1, 'To read', 'My first note to read', 'my first note to read', true),
        ($1, 'Idea', 'My first idea', 'my first idea is ...', true),
        ($1, 'Various', 'My first note', 'my first note', true)
        RETURNING *`, 
        [id]
    )
}

module.exports.addNotesWithPicture = (id, text, folder, title, editable, picture) => {
    return db.query(`
        INSERT INTO notes (author_id, note, note_type, title, editable, picture)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`, 
        [id, text, folder, title, editable, picture]
    )
}

module.exports.addNotesWithLink = (id, folder, title, link, description, publisher, picture) => {
    return db.query(`
        INSERT INTO notes (author_id, note_type, title, link, link_content, publisher, picture)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`, 
        [id, folder, title, link, description, publisher, picture]
    )
}

module.exports.addNotesWithAudio = (id, folder, title, audio) => {
    return db.query(`
        INSERT INTO notes (author_id, note_type, title, sound)
        VALUES ($1, $2, $3, $4)
        RETURNING *`, 
        [id, folder, title, audio]
    )
}

module.exports.addNotesWithVideo = (id, folder, title, video) => {
    return db.query(`
        INSERT INTO notes (author_id, note_type, title, video)
        VALUES ($1, $2, $3, $4)
        RETURNING *`, 
        [id, folder, title, video]
    )
}

module.exports.addTeam = (id, team) => {
    return db.query(`
        INSERT INTO teams (team_admin, team)
        VALUES ($1, $2)
        RETURNING *`, 
        [id, team]
    )
}

module.exports.addTeamMate = (teamID, teamName, memberID, isAdmin, accepted) => {
    return db.query(`
        INSERT INTO teammates (team_id, team_name, member_id, is_admin, accepted)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`, 
        [teamID, teamName, memberID, isAdmin, accepted]
    )
}

module.exports.getCurrentTeam = (teamID) => {
    return db.query(`
        SELECT * FROM teammates
        WHERE team_id = $1`,
        [teamID]
    )
}

module.exports.getCurrentTeamAndMembers = (teamID) => {
    return db.query(`
        SELECT username, first_name, last_name, user_picture, member_id, team_name, accepted, is_admin, team_id
        FROM teammates
        JOIN users 
        ON member_id = users.id
        WHERE team_id = $1`,
        [teamID]
    )
}

module.exports.getTeams = (id) => {
    return db.query(`
        SELECT * FROM teammates
        WHERE member_id = $1
        AND accepted = true`,
        [id]
    )
}

module.exports.getMemberByTeam = (id, team) => {
    return db.query(`
        SELECT * FROM teammates
        WHERE member_id = ($1)
        AND team_id = ($2)`,
        [id, team]
    )
}

// ADD MEMBER REQUEST
module.exports.addMemberRequest = (memberID, teamID, name) => {
    return db.query(`
        INSERT INTO teammates (member_id, team_id, team_name)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [memberID, teamID, name]
    )
}

 // DELETE MEMBER REQUEST
module.exports.cancelMemberRequest = (memberID, teamID) => {
    return db.query(`
        DELETE FROM teammates
        WHERE (member_id = $1 AND team_id = $2)`, 
        [memberID, teamID]
    )
}

module.exports.acceptMemberRequest = (memberID, teamID) => {
    return db.query(`
        UPDATE teammates
        SET accepted = true
        WHERE member_id = $1 AND team_id = $2`, 
        [memberID, teamID]
    )
}


// // ADD PROFILE_PIC
// module.exports.addProfilePic = (id, profilePic) => {
//     return db.query(`
//         UPDATE users
//         SET profil_pic = $2
//         WHERE id = $1
//         RETURNING *`,
//         [id, profilePic]
//     )
// }

// // ADD BIO
// module.exports.addBio = (id, bio) => {
//     return db.query(`
//         UPDATE users
//         SET bio = $2
//         WHERE id = $1
//         RETURNING *`,
//         [id, bio] 
//     )
// }

// // GET FRIENDS STATUS
// module.exports.getFriendStatus = (senderID, recipientID) => {
//     return db.query(`
//         SELECT * FROM friends
//         WHERE (sender_id = $1 AND recipient_id = $2)
//         OR (sender_id = $2 AND recipient_id = $1)`,
//         [senderID, recipientID]
//     )
// }

// // ADD FRIENDS REQUEST
// module.exports.addFriendRequest = (senderID, recipientID) => {
//     return db.query(`
//         INSERT INTO friends (sender_id, recipient_id)
//         VALUES ($1, $2)
//         RETURNING *`,
//         [senderID, recipientID]
//     )
// }

// // ACCEPT FRIENDS REQUEST
// module.exports.acceptFriendRequest = (senderID, recipientID) => {
//     return db.query(`
//         UPDATE friends
//         SET accepted = true
//         WHERE sender_id = $1 AND recipient_id = $2`, 
//         [senderID, recipientID]
//     )
// }

// // DELETE FRIENDSHIP
// module.exports.cancelFriendRequest = (senderID, recipientID) => {
//     return db.query(`
//         DELETE FROM friends
//         WHERE (sender_id = $1 AND recipient_id = $2)
//         OR (sender_id = $2 AND recipient_id = $1)`, 
//         [senderID, recipientID]
//     )
// }

// // GET ALL FRIENDS AND FRIENDS REQUEST
// module.exports.getFriendsAndWanabee = (recipientID) => {
//     return db.query(`
//         SELECT users.id, first_name, last_name, profil_pic, accepted
//         FROM friends
//         JOIN users
//         ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
//         OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
//         OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`,
//         [recipientID]
//     )
// }



// // GET LAST 10 MESSAGES
// module.exports.getMessages = () => {
//     return db.query(`
//         SELECT messages.messages, messages.id, messages.created_at, users.first_name, users.last_name, users.profil_pic
//         FROM messages
//         JOIN users
//         ON users.id = messages.sender_id
//         ORDER BY messages.id DESC
//         LIMIT 10
//     `)
// }

// // ADD NEW MESSAGES
// module.exports.addMessage = (id, message) => {
//     return db.query(`
//         INSERT INTO messages (sender_id, messages)
//         VALUES ($1, $2)
//         RETURNING *`,
//         [id, message]
//     )
// }