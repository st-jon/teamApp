import axios from '../axios';

export async function AddloggedinUser() {
    const {data} = await axios.get('/user')
    return {
        type: 'ADD_LOGGEDIN_USER',
        user: data.rows[0]
    }
}

export async function updateUser(userData) {
    const {data} = await axios.post('/updateUser', userData)
    return {
        type: 'UPDATE_USER',
        user: data.rows[0]
    }
}

export async function updateUserWithPicture(userData) {
    const {data} = await axios.post('/updateUserWithPicture', userData)
    return {
        type: 'UPDATE_USER',
        user: data.rows[0]
    }
}

export async function getNotes() {
    const {data} = await axios.get('/notes')
    return {
        type: 'GET_NOTES_TYPE',
        notes: data.rows
    }
}

export async function getFiles(type) {
    const {data} = await axios.post('/files', {type})
    return {
        type: 'GET_FILES',
        files: data.rows,
        noteType: type
    }
} 

export function showFileInBoard(id, type) {
    return {
        type: 'SHOW_FILE_IN_BOARD',
        noteType: type,
        id
    }
}

export function hideFileInBoard(id) {
    return {
        type: 'HIDE_FILE_IN_BOARD',
        id
    }
}

export function addNote(file, noteType) {
    return {
        type: 'ADD_NOTE',
        noteType,
        file
    }
}

export async function deleteNote(id, noteType) {
    const data = await axios.post('/deleteNoteById', {id})
    return {
        type: 'DELETE NOTE',
        noteType,
        id
    }
}

export async function addCurrentTeam(team) {
    await axios.post('/addCurrentTeamToUser', {teamID: team})
    const teams = await axios.post('/getMembersFromTeam', {id: team})
    // console.log(teams)
    return {
        type: 'ADD_CURRENT_TEAM',
        id: team,
        teams: teams.data.rows
    }
}

export async function getTeams() {
    const {data} = await axios.get('/teams')
    return {
        type: 'GET_TEAMS',
        teams: data.rows
    }
}

export async function addNewMemberToCurrentTeam(id) {
    const teams = await axios.post('/getMembersFromTeam', {id})
    console.log(teams)
    return {
        type: 'ADD_MEMBER_TO_CURRENT_TEAM',
        teams: teams.data.rows
    }
}

// CHAT MESSAGES

export const getOnlineUsers = (onlineUsers) => {
    return {
        type: 'GET_ONLINE_USERS',
        onlineUsers
    }
}

export const UpdateOnlineUsers = (newOnlineUsers) => {
    return {
        type: 'UPDATE_ONLINE_USERS',
        newOnlineUsers
    }
}

export const deleteOnlineUser = (id) => {
    console.log(id)
    return {
        type: 'DELETE_ONLINE_USER',
        id
    }
}

export const getMessages = (messages) => {
    return {
        type: 'GET_MESSAGES',
        messages
    }
}

export const addMessage = (message) => {
    return {
        type: 'ADD_MESSAGE',
        message
    }
}

// EMAIL

export async function getEmails(id) {
    const mails = await axios.post('/getMailsFromUser', {id})
    return {
        type: 'GET_EMAILS',
        mails: mails.data.rows
    }
}

export const addEmail = (mail) => {
    return {
        type: 'ADD_EMAIL',
        mail
    }
}


export const addEmailCategory = (title) => {
    return {
        type: 'GET_EMAIL_CONTENT_TITLE',
        title
    }
}

export const addEmailContent = (emails, folder) => {
    return {
        type: 'ADD_EMAIL_CONTENT',
        emails,
        folder
    }   
}

export function showEmailInBoard(id, folder) {
    return {
        type: 'SHOW_EMAIL_IN_BOARD',
        folder,
        id
    }
}
