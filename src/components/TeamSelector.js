import React from 'react'
import axios from '../axios'
import { connect } from 'react-redux'

import {addCurrentTeam} from '../redux/actions'

class TeamSelector extends React.Component {
    constructor() {
        super()
        this.state = {
            home: true,
            menuIsVisible: false
        }
        this.showMenu = this.showMenu.bind(this)
        this.setCurrentTeam = this.setCurrentTeam.bind(this)
    }
    componentDidMount() {
        if (this.props.user['current_teamid']) {
            this.props.dispatch(addCurrentTeam(this.props.user['current_teamid']))
            if(this.props.user['current_teamid'])
            this.setState({home:false})
            else {
                this.setState({home:true})
            }
        } 
    }
 
    setCurrentTeam(teamID) {
        this.props.dispatch(addCurrentTeam(teamID))
        this.showMenu
        if (teamID === null) {
            this.setState({home: true})
        }
        else if (teamID) {
            this.setState({home: false})
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
                            <div onClick={() => this.setCurrentTeam(null)} className="teamSelector__item">
                                <img className="space__icon" src="/assets/home-space.png" />
                                Home
                            </div>}
                        {userTeams.map(team => {
                            return (
                                <div key={team.id} onClick={() => this.setCurrentTeam(team.id)} className="teamSelector__item">
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