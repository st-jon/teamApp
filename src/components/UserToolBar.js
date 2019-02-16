import React from 'react'
import {connect} from 'react-redux'

import UserPicture from './UserPicture'
import ToolBarNotes from './ToolBarNotes'

class UserToolBar extends React.Component {
    constructor() {
        super()
        this.state = {
            notesAreVisible: false
        }
        this.showNotes = this.showNotes.bind(this)
    }

    showNotes() {
        this.setState(prevState => ({
            notesAreVisible: !prevState.notesAreVisible
        }))
    }

    render() {
        const {user} = this.props

        if (!user) {
            return null
        }
        return (
            <div className="userToolBar__container">
                <div className="user-header toolBar-menu">
                    <UserPicture />
                    <div className="user-header__name">{user.username}</div>
                </div>
                <div className="user-folders toolBar-menu" onClick={this.showNotes}>
                    <img className="toolBar__icon" src='./assets/notes.png' />
                    <div className="toolBar__title"> Notes</div>
                </div>
                {this.state.notesAreVisible && <ToolBarNotes />}
                <div className="user-chat toolBar-menu">
                    <img className="toolBar__icon" src='./assets/chat.png' />
                    <div className="toolBar__title"> Chat</div>
                </div>
                <div className="user-mailbox toolBar-menu">
                    <img className="toolBar__icon" src='./assets/mailbox.png' />
                    <div className="toolBar__title"> Mailbox</div>
                </div>
                <div className="user-trash toolBar-menu">
                    <img className="toolBar__icon" src='./assets/trash.png' />
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