import React from 'react'
import axios from '../axios'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'

import {initSocket} from '../socket'
import {addCurrentTeam} from '../redux/actions'

class TeamSelector extends React.Component {
    constructor() {
        super()
        this.state = {
            home: true,
            menuIsVisible: false,
            currentTeam: null
        }
        this.showMenu = this.showMenu.bind(this)
        this.setCurrentTeam = this.setCurrentTeam.bind(this)
    }
    componentDidMount() {
        if (this.props.user['current_teamid']) {
            this.props.dispatch(addCurrentTeam(this.props.user['current_teamid']))

            if(this.props.user['current_teamid']){
                this.setState({home:false, currentTeam: this.props.user['current_teamid']})
                initSocket().emit('subscribe', this.props.user['current_teamid'])
            }     
            else {
                this.setState({home:true, currenTeam: null})
                initSocket().emit('unsubscribe', null)
            }
        } 
    }
 
    setCurrentTeam(teamID) {
        this.props.dispatch(addCurrentTeam(teamID))
        this.showMenu
        initSocket().emit('subscribe', teamID)
        if (teamID === null) {
            initSocket().emit('unsubscribe', this.state.currentTeam)
            this.setState({home: true, currentTeam: null})
        }
        else if (teamID) {
            initSocket().emit('subscribe', teamID)
             this.setState({home: false, currentTeam: teamID})
        }
    }

    showMenu() {
        this.setState(prevState => ({
            menuIsVisible: !prevState.menuIsVisible
        }))
    }

    render() {
        const {userTeams} = this.props
        if (!userTeams) {
            return null
        }
        return (
            <div onClick={this.showMenu} className="teamSelector__container">
                {this.props.user['current_teamid'] && this.props.currentTeam && <div className="greeting__user">{this.props.currentTeam[0]['team_name']}</div>}
                {this.state.home && <img className="space__icon" src="/assets/home-space.png" />}
                {!this.state.home && <img className="space__icon" src="/assets/team-space.png" />}
                {this.state.menuIsVisible && 
                    <div className="teamSelectorResult__container">
                        {!this.state.home && 
                            <div to='/' onClick={() => this.setCurrentTeam(null)} className="teamSelector__item">
                                <img className="space__icon" src="/assets/home-space.png" />
                                Home
                            </div>}
                        {userTeams.map(team => {
                            return (
                                <div key={team.id} onClick={() => this.setCurrentTeam(team['team_id'])} className="teamSelector__item">
                                    <img className="space__icon" src="/assets/team-space.png" />
                                    {team['team_name']}
                                </div>
                            )
                        })}
                    </div>
                }
            </div> 
           
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user, userTeams: state.userTeams, currentTeam : state.currentTeam}
}

export default connect(mapStateToProps)(TeamSelector)