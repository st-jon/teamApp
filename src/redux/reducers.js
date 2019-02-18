import _ from 'lodash'

export default function(state = {}, action) {

    // USER LOGIN
    if (action.type === 'ADD_LOGGEDIN_USER') {
        state = {...state, user: action.user}
    }

    // UPDATE USER
    if (action.type === 'UPDATE_USER') {
        state = {...state, user: action.user}
    }

    if (action.type === 'UPDATE_USER_WITH_PICTURE') {
        state = {...state, user: action.user}
    }

    // NOTES
    if (action.type === 'GET_NOTES_TYPE') {
       const filteredNotes =  _.uniqBy(action.notes, 'note_type')

        state = {...state, notes: filteredNotes}
    }

    if (action.type === 'GET_FILES') {
        const index = state.notes.findIndex(note => note['note_type'] === action.noteType)
        state.notes[index].files = action.files
    }

    // FILES
    if (action.type === 'SHOW_FILE_IN_BOARD') {
        const folder = state.notes.filter(note => note['note_type'] === action.noteType)
        const file = folder[0].files.filter(file => file.id === action.id)
        const board = state.board ? [...state.board , ...file] : [...file]
        const filteredBoard = [...new Set(board)]
        state = {...state, board: filteredBoard}
    }

    if (action.type === 'HIDE_FILE_IN_BOARD') {
        state = {
            ...state,
            board: state.board.filter(file => file.id !== action.id)      
        }
    }

    if (action.type === "ADD_NOTE") {
        const index = state.notes.findIndex(note => note['note_type'] === action.noteType)
        const newArray = [...state.notes[index].files, action.file]
        state = {
            ...state,
            notes: state.notes.map(
                (note, i) => {
                    if (i === index) {
                        return {
                            ...note,
                            files: newArray
                        }
                    } else {
                        return note
                    }
                  
                }
            )
        }
    }

    // if (action.type === 'RECEIVE_FRIENDS') {
    //     state = {...state, friends: action.friends}
    // }

    // if (action.type === 'DELETE_FRIEND') {
    //     state = {
    //         ...state,
    //         friends: state.friends.filter(friend => {
    //             return friend.id !== action.id
    //         })
    //     }
    // }

    // if (action.type === 'ADD_FRIEND') {
    //     state = {
    //         ...state,
    //         friends: state.friends.map(friend => {
    //             if (friend.id === action.id) {
    //                 return {...friend, accepted: true}
    //             } else {
    //                 return friend
    //             }
    //         })
    //     }
    // }

    // if (action.type === 'GET_ONLINE_USERS') {
    //     state = {...state, onlineUsers: action.onlineUsers}
    // }

    // if (action.type === 'UPDATE_ONLINE_USERS') {
    //     state = {
    //         ...state, 
    //         onlineUsers: [...state.onlineUsers, action.newOnlineUsers]
    //     }
    // }

    // if (action.type === 'DELETE_ONLINE_USER') {
    //     state = {
    //         ...state,
    //         onlineUsers: state.onlineUsers.filter(user => {
    //             return user.id !== action.id
    //         })      
    //     }
    // }

    // if (action.type === 'GET_MESSAGES') {
    //     state = {
    //         ...state,
    //         messages: action.messages
    //     }
    // }

    // if (action.type === 'ADD_MESSAGE') {
    //     state = {
    //         ...state,
    //         messages: [...state.messages, action.message]
    //     }
    // }

    // if (action.type === 'GET_WALL_POSTS') {
    //     state = {
    //         ...state,
    //         posts: action.posts
    //     }
    // }

    // if (action.type === 'ADD_WALL_POST') {
    //     state.posts.unshift(action.post)
    //     state = {
    //         ...state,
    //         posts: [...state.posts]
    //     }
    // }

    return state
}