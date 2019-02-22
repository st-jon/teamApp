import React from 'react'
import { connect } from 'react-redux'
import axios from '../axios'
import moment from 'moment'

import {initSocket} from '../socket'
import {getMessages} from '../redux/actions'

import UserPicture from './UserPicture'


class Chat extends React.Component {
    constructor() {
        super()
        this.state= {}
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    handleChange(e) {
        this.chatInput = e.target.value
    }

    submit() {
        const io = initSocket()
        io.emit('new chat message from user', {
            message: this.chatInput,
            username: this.props.user.username,
            first: this.props.user['first_name'],
            last: this.props.user['last_name'],
            genre: this.props.user.genre,
            picture: this.props.user['user_picture']
        })
        document.querySelector('.input__chat').value = ""
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.submit()
        }
    }

    componentDidUpdate() {
        if (!this.elem) {
            return null
        }
        this.elem.scrollTop = this.elem.scrollHeight
    }

    render() {
        const {messages} = this.props

        if (!messages) {
            return null
        }
        if (!this.props.user['current_teamid']) {
            this.props.history.push('/')
        } else{
            let userStatus = this.props.userTeams.find(user => {
                return user['team_id'] === this.props.user['current_teamid']
            })
            if(!userStatus.accepted) {
                return (
                    <div className="chat__container">
                        <img className="team__sad" src='/assets/private.png' />
                        <div className="team__message">to access here you need first to join the group</div>
                    </div> 
                )
            }
        }
        
        
        return (
            <div className="chat__container">
                <div className="screen__container" ref={elem => (this.elem = elem)}>
                {messages.map(message => (
                        <div 
                            key={message.id} 
                            className={message['last_name'] === this.props.user['last_name'] && message['first_name'] === this.props.user['first_name'] ? "messages__container yours": "messages__container other" }>
                            <span className="message__date">{moment(message['created_at']).fromNow()}</span>
                            <div className={message['last_name'] === this.props.user['last_name'] && message['first_name'] === this.props.user['first_name'] ? "message__container blue": "message__container green" }>
                                <UserPicture otherUser={message} />
                                <div className="message__content">
                                    <div>
                                        <span className="message__name">{message['first_name']}</span> say: 
                                    </div>
                                    <div className="message__text">{message.messages}</div>
                                </div> 
                            </div>  
                        </div>
                    )
                )}
                </div>
            <div className="chat__messagearea" onKeyPress={this.handleKeyPress}>
                <textarea className="input__chat" onChange={this.handleChange} type="text" name="chatInput" rows="5" cols="35" autoComplete="off" placeholder="type your message here..." autoFocus/>
                <div className="btn__chat__container">
                    <div onClick={this.submit} className="btn__chat">SEND</div>
                </div>
            </div>
            </div>
        )
    }
}


const mapStateToProps = function(state) {
    return {user: state.user, userTeams: state.userTeams, currentTeam: state.currentTeam, messages: state.messages}
}

export default connect(mapStateToProps)(Chat)


