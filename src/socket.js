import * as io from 'socket.io-client'
import {getOnlineUsers, UpdateOnlineUsers, deleteOnlineUser, getMessages, addMessage, updateMessage} from './redux/actions'

let socket

export function initSocket(store) {
    if(!socket) {
        socket = io.connect()

        socket.on('users online', users => {
            store.dispatch(getOnlineUsers(users.onlineUsers))
        })

        socket.on('new user', users => {
            store.dispatch(UpdateOnlineUsers(users.newUser[0]))
        })

        socket.on('user left', users => {
            store.dispatch(deleteOnlineUser(users.id))
        })

        socket.on('chat messages', messages => {
            store.dispatch(getMessages(messages.messages))
        })

        socket.on('chat message', message => {
            store.dispatch(addMessage(message.message))
        })

        socket.on('user joined', id => {
            console.log(id)
        })

        socket.on('user left the room', id => {
            console.log(id)
        })

    }
    return socket
}