import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from '../axios'

import {addCurrentTeam, getTeams} from '../redux/actions'


class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teamCreatorIsVisible: false
        }
        this.logout = this.logout.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.showTeamCreator = this.showTeamCreator.bind(this)
        this.submit = this.submit.bind(this)
    }

    handleChange(e) {
        this[e.target.name] = e.target.value
    }

    showTeamCreator() {
        this.setState({teamCreatorIsVisible: true})
    }

    submit() {
        axios.post('/teamCreate', {team: this.team})
            .then(({data}) => {
                console.log(data)
                return axios.post('/teamMateCreate', {
                    teamID: data.rows[0].id,
                    teamName: data.rows[0].team,
                    memberID: data.rows[0]['team_admin'],
                    isAdmin: true,
                    accepted: true
                })
            })
            .then((data) => {
                console.log(data)
                this.props.dispatch(getTeams(this.props.id))
                this.props.dispatch(addCurrentTeam(data.data.rows[0]['team_id']))
            })
            .catch(err => err.message)
        this.setState({teamCreatorIsVisible: false})
        this.props.showMenu()
    }

    logout() {
        axios.get('/logout')
            .then(() => window.location.reload())
    }

    render() {
        return(
            <div className="menu__container" >
                <div>
                    <div onClick={this.showTeamCreator} className="menu-item link">
                        <img className="user__icon" src="/assets/team-folder.png" />
                        Create a Team
                    </div>
                </div>
                <Link to='/myTeams'>
                    <div className="menu-item link">
                        <img className="user__icon" src="/assets/team.png" />
                        Teams & Members
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
                {this.state.teamCreatorIsVisible && <div className="teamCreate__container">
                    <div className="form-group__edit">
                        <input className="input-teamCreate" type="text" name="team" onChange={this.handleChange} placeholder="team name" autoComplete="off" autoFocus/>
                    </div>
                    <div className="btn__container">
                        <button className="btn" onClick={this.submit}>Create</button>
                    </div>
                </div>}
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(Menu)