import React from 'react'
import { connect } from 'react-redux'
import axios from '../axios'

import UserPicture from './UserPicture' 
import AddMemberButton from './AddMemberButton'

import {getTeams, addCurrentTeam} from '../redux/actions'

class MyTeams extends React.Component {
    constructor() {
        super()
        this.state = {
            visible: ''
        }
        this.showTeam = this.showTeam.bind(this)
        this.getTeamMember = this.getTeamMember.bind(this)
    }

    componentDidMount() {
        this.props.dispatch(getTeams())
    }

    showTeam(id) {
        this.props.dispatch(addCurrentTeam(id))
        this.setState({
            visible: id
        })
        setTimeout(() => {
            this.getTeamMember(id)
        }, 1000)

    }

    getTeamMember(id) {
        axios.post('/getMembersFromTeam', {id})
        .then(({data}) => {
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
            <div className="teams__container">
                {userTeams.length < 1 && 
                    <div className="teams__message">
                        <img className='team__sad' src='/assets/sad.png' />
                        <div className="teams__info">You have no teams yet...<br></br><br></br>You can create one and start inviting people to work with you by clicking the top right menu button</div>
                    </div>
                }
               {userTeams.map(team => {
                   return (
                        <div key={team.id} onClick={() =>this.showTeam(team['team_id'])} className="team__container">
                            <div className="team__name">{team['team_name']}
                                {team['is_admin'] && <img className="admin__icon__notification" src="/assets/admin.png"/>}
                                <img className="myTeam__icon" src="/assets/expend.png" />
                            </div> 
                            {this.state[team['team_id']] && this.state.visible === team['team_id'] &&
                                <div className="teamMember__container">
                                    {this.state[team['team_id']].map(member => {
                                        return (
                                            <div key={member['member_id']} className="teamMember__card">
                                                <div className="teamMember__header">
                                                    <div className="teamMember__picture">
                                                        <UserPicture otherUser={member}/>
                                                    </div>
                                                    <div className="teamMember__infos">
                                                        <div className="teamMember__username">
                                                            {member.username}
                                                        </div>
                                                        <div className="teamMember__name">
                                                            {`${member['first_name']} ${member['last_name']}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                {!member['is_admin'] && <AddMemberButton memberID={member['member_id']} memberGenre={member.genre} memberTeam={member['team_id']} />}
                                            </div>    
                                        )
                                    })}
                                </div>} 
                        </div>
                   )
               })}
            </div>
        )
    } 
}

const mapStateToProps = function(state) {
    return {user: state.user, userTeams: state.userTeams, currentTeam : state.currentTeam}
}

export default connect(mapStateToProps)(MyTeams)