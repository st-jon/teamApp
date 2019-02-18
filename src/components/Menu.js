import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import axios from '../axios'


class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.logout = this.logout.bind(this)
    }

    logout() {
        axios.get('/logout')
            .then(() => window.location.reload())
    }

    render() {
        return(
            <div className="menu__container" onMouseLeave={this.props.toggleMenu}>
                <Link to='/createTeam'>
                    <div className="menu-item link">
                    <img className="user__icon" src="/assets/team-folder.png" />
                    Create a Team
                    </div>
                </Link>
                <Link to='/Teams'>
                    <div className="menu-item link">
                    <img className="user__icon" src="/assets/team.png" />
                    Teams
                    </div>
                </Link>
                <Link to='/setup'>
                    <div className="menu-item link">
                    <img className="user__icon" src="/assets/setting.png" />
                    Settings
                    </div>
                </Link>
                <div onClick={this.logout} className="menu-item logout">
                    <img className="user__icon" src="/assets/logout.png" />
                    Logout
                </div>
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(Menu)