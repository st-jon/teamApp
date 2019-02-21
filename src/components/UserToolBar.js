import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'

import {getEmails} from '../redux/actions'

import UserPicture from './UserPicture'
import ToolBarNotes from './ToolBarNotes'
import ToolBarMail from './ToolBarMail'
import AddNote from './AddNote'

class UserToolBar extends React.Component {
    constructor() {
        super()
        this.state = {
            notesAreVisible: false,
            mailsAreVisible: false
        }
        this.showNotes = this.showNotes.bind(this)
        this.showMails = this.showMails.bind(this)
    }

    componentDidMount() {
        this.props.dispatch(getEmails(this.props.user.id))
    }

    showNotes() {
        this.setState(prevState => ({
            notesAreVisible: !prevState.notesAreVisible
        }))
    }

    showMails() {
        // this.props.dispatch(getEmails(this.props.user.id))
        this.setState(prevState => ({
            mailsAreVisible: !prevState.mailsAreVisible
        }))
    }

    render() {
        const {user} = this.props

        if (!user) {
            return null
        }
        return (
            <div className="userToolBar__container">
                <Link to='/' className="user-header toolBar-menu">
                    <UserPicture />
                    <div className="user-header__name">{user.username}  Board</div>
                </Link>
                <div className="user-header toolBar-menu">
                    <AddNote />
                </div>
                <div className="user-folders toolBar-menu" onClick={this.showNotes}>
                    <img className="toolBar__icon" src='/assets/notes.png' />
                    <div className="toolBar__title"> Notes</div>
                </div>
                {this.state.notesAreVisible && <ToolBarNotes />}
                <Link to='/chat' className="user-chat toolBar-menu">
                    <img className="toolBar__icon" src='/assets/chat.png' />
                    <div className="toolBar__title"> Chat</div>
                </Link>
                <div className="user-mailbox toolBar-menu" onClick={this.showMails}>
                    <img className="toolBar__icon" src='/assets/mailbox.png' />
                    <div className="toolBar__title"> Mailbox</div>
                </div>
                {this.state.mailsAreVisible && <ToolBarMail />}
                <div className="user-trash toolBar-menu">
                    <img className="toolBar__icon" src='/assets/trash.png' />
                    <div className="toolBar__title"> Trash</div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(UserToolBar)