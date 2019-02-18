import React from 'react'
import { connect } from 'react-redux'

class UserPicture extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {user} = this.props
        if (!user) {
            return null
        }
        let member
        if (this.props.otherUser) {
            member = this.props.otherUser
            
        } 
        return (
            <div className="user-picture">
                {!member && 
                    <div>
                        {!user['user_picture'] && (!user.genre || user.genre === 'intersex')&& 
                        <div className="default__picture">{user['first_name'].charAt(0)}{user['last_name'].charAt(0)}</div>}
                        {!user['user_picture'] && user.genre === 'man' &&
                        <img className="user__icon" src="/assets/icons8-user-male-100.png" />}
                        {!user['user_picture'] && user.genre === 'woman' &&
                        <img className="user__icon" src="/assets/icons8-female-user-100.png" />}
                        {user['user_picture'] &&
                        <img className="userPicture" src={user['user_picture']} />}
                    </div>}
                {member && 
                    <div>
                        {!member['user_picture'] && (!member.genre || member.genre === 'intersex')&& 
                        <div className="default__picture">{member['first_name'].charAt(0)}{member['last_name'].charAt(0)}</div>}
                        {!member['user_picture'] && member.genre === 'man' &&
                        <img className="user__icon" src="/assets/icons8-user-male-100.png" />}
                        {!member['user_picture'] && member.genre === 'woman' &&
                        <img className="user__icon" src="/assets/icons8-female-user-100.png" />}
                        {member['user_picture'] &&
                        <img className="userPicture" src={member['user_picture']} />}
                    </div>}
            </div>
        )
    } 
}

const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(UserPicture)