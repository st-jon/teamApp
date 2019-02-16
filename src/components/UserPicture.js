import React from 'react'
import { connect } from 'react-redux'

class UserPicture extends React.Component {
    render() {
        const {user} = this.props
        if (!user) {
            return null
        }
        return (
            <div className="user-picture">
                {!user['user_picture'] && (!user.genre || user.genre === 'intersex')&& 
                <div className="defaut_picture">{user['first_name'].charAt(0)}{user['last_name'].charAt(0)}</div>}
                {!user['user_picture'] && user.genre === 'man' &&
                <img className="user__icon" src="./assets/icons8-user-male-100.png" />}
                {!user['user_picture'] && user.genre === 'woman' &&
                <img className="user__icon" src="./assets/icons8-female-user-100.png" />}
                {user['user_picture'] &&
                <img className="userPicture" src={user['user_picture']} />}
            </div>
        )
    } 
}

const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(UserPicture)