import React from 'react'
import { connect } from 'react-redux'
import axios from '../axios'

import {addNewMemberToCurrentTeam} from '../redux/actions'

import UserPicture from './UserPicture'

class TeamMemberToolBar extends React.Component {

    render() {
        const {currentTeam} = this.props
        if (!currentTeam) {
            return null
        }
        let array = []

        if (this.props.onlineUsers) {
            this.props.onlineUsers.forEach(item => {
                array.push(item.id) 
            }) 
        }
       
        return (
            <div className="teamMemberToolBar__container">
                <div className="teamMemberToolBar__title">{this.props.user['team_name']}</div>
                    <div className="teamMemberToolBar__member__container">
                    {currentTeam.map(member => {
                        return (
                            <div className="online__alert__container" key={member['member_id']}>
                            {member.accepted && <div className="teamMemberToolBar__member">
                                <UserPicture otherUser={member}/>
                                <div className="teamMemberToolBar__member__username">
                                    {member.username}
                                </div>
                                {array.includes(member['member_id']) && <div className="online__alert"></div>}
                            </div>}
                        </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user, currentTeam : state.currentTeam, onlineUsers: state.onlineUsers}
}

export default connect(mapStateToProps)(TeamMemberToolBar)