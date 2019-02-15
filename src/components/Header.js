import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from '../axios'

import UserPicture from './UserPicture'
import EditUserProfile from  './EditUserProfile'

class Header extends React.Component {
    constructor() {
        super()
        this.state= {
            showUserEditor: false
        }
        this.toggleEditor = this.toggleEditor.bind(this)
    }

    toggleEditor() {
        this.setState(prevstate => ({
            showUserEditor: !prevstate.showUserEditor
        }))
    }

    render() {
        const {user} = this.props

        if (!user) {
            return null
        }
        return (
            <div className="header__container">
                <div className="title__header">
                    <p className="title__t__header">T</p> 
                    <p className="title__e__header">E</p> 
                    <p className="title__a__header">A</p> 
                    <p className="title__m__header">M</p> 
                </div>
                <div className="header__right">
                    <div className="greeting__user">hi {user['first_name']} !</div>
                    <div onClick={this.toggleEditor} className="userpicture__container">
                        <UserPicture />
                    </div>
                    <svg className="user__icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" version="1.1" x="0px" y="0px">
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g fill="#FFF">
                        <rect x="16" y="25" width="80" height="6.2072333"/>
                        <rect x="16" y="50" width="80" height="6.2072333"/>
                        <rect x="16" y="75" width="80" height="6.2072333"/></g></g>
                    </svg>
                </div>
                {this.state.showUserEditor && <EditUserProfile showEditor={this.toggleEditor} />}
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(Header)
