import React from 'react'
import { connect } from 'react-redux'
import axios from '../axios'

import UserPicture from './UserPicture'

import {getTeams} from '../redux/actions'

class MyTeams extends React.Component {
    constructor() {
        super()
        this.state = {}
        this.showTeam = this.showTeam.bind(this)
    }

    showTeam(id) {
        axios.post('/getMembersFromTeam', {id})
            .then(({data}) => {
                console.log(data)
                let teamMember = []
                data.rows.map(team => {
                    teamMember.push(team)
                    this.setState({[team['team_id']]: teamMember})
                })   
            })
            .catch(err => console.log(err.message))
    }

    render(){
        const {userTeams} = this.props
        if (!userTeams) {
            return null
        }

        return (
            <div className="myTeams__container">
               {userTeams.map(team => {
                   return (
                        <div key={team.id} onClick={() =>this.showTeam(team['team_id'])} className="team__container">
                            <div>{team['team_name']}</div>
                            {team['is_admin'] && <img src="/assets/admin.png"/>}
                        </div>
                   )
               })}
            </div>
        )
    } 
}

const mapStateToProps = function(state) {
    return {userTeams: state.userTeams, currentTeam : state.currentTeam}
}

export default connect(mapStateToProps)(MyTeams)