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

export async function addCurrentTeam(team) {
    await axios.post('/addCurrentTeamToUser', {teamID: team})
    const teams = await axios.post('/currentTeamMembers', {teamID: team})
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
    const teams = await axios.post('/currentTeamMembers', {teamID: id})
    return {
        type: 'ADD_MEMBER_TO_CURRENT_TEAM',
        teams: teams.data.rows
    }
}


// export async function receiveFriends() {
//     const {data} = await axios.get('/getfriends')
//     return {
//         type: 'RECEIVE_FRIENDS',
//         friends: data.data.rows
//     };
// }

// export const deleteFriend = async (id) => {
//     const {data} = await axios.post('/status/update', {
//         status: 'Delete Friend',
//         otherID: id
//     })
//     return {
//         type: 'DELETE_FRIEND',
//         data,
//         id
//     }
// }

// export const addFriend = async(id) => {
//     const {data} = await axios.post('/status/update', {
//         status: 'Accept Invitation',
//         otherID: id
//     })
//     return {
//         type: 'ADD_FRIEND',
//         data,
//         id
//     }
// }

// export const getOnlineUsers = (onlineUsers) => {
//     return {
//         type: 'GET_ONLINE_USERS',
//         onlineUsers
//     }
// }

// export const UpdateOnlineUsers = (newOnlineUsers) => {
//     return {
//         type: 'UPDATE_ONLINE_USERS',
//         newOnlineUsers
//     }
// }

// export const deleteOnlineUser = (id) => {
//     return {
//         type: 'DELETE_ONLINE_USER',
//         id
//     }
// }

// export const getMessages = (messages) => {
//     return {
//         type: 'GET_MESSAGES',
//         messages
//     }
// }

// export const addMessage = (message) => {
//     return {
//         type: 'ADD_MESSAGE',
//         message
//     }
// }

// export const getWallMessages = (posts) => {
//     return {
//         type: 'GET_WALL_POSTS',
//         posts
//     }
// }

// export const addWallMessage = (post) => {
//     console.log(post)
//     return {
//         type: 'ADD_WALL_POST',
//         post
//     }
// }