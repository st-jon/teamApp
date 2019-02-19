import React from 'react' 
import { connect } from 'react-redux'
import axios from '../axios'

import {addNewMemberToCurrentTeam} from '../redux/actions'


class AddMemberButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 'Add Member'
        }
        this.updateMemberStatus = this.updateMemberStatus.bind(this)
    }

    componentDidMount() {
        axios.post(`/status/${this.props.memberID}`, {teamID: this.props.user['current_teamid']})
        .then(res => {
            if (res.data.rows.length < 1) {
                this.setState({status: 'Add Member'})
            }
            else if (res.data.rows[0].accepted === false && this.props.user['is_admin'] === false) {
                this.setState({status: 'Join this team'})
            }
            else if (res.data.rows[0].accepted === false && this.props.user['is_admin'] === true) {
                this.setState({status: 'Pending... Cancel?'})
            }
            else if (res.data.rows[0].accepted === true) {
                this.setState({status: 'leave this team'})
            }
        })
        .catch(err => console.log(err.message))
    } 

    updateMemberStatus() {
        console.log('memberID',  this.props.memberID)
        console.log('team', this.props.user['current_teamid'])
        console.log('name', this.props.user['team_name'])
        axios.post('/updateMemberStatus', {
            status: this.state.status,
            memberID:  this.props.memberID,
            team: this.props.user['current_teamid'],
            name: this.props.user['team_name']
        })
        .then((res) => {
            if (res.data.command === "INSERT") {
                this.setState({
                    status: 'Pending... Cancel?'
                })
                this.props.dispatch(addNewMemberToCurrentTeam(this.props.user['current_teamid']))
            }
            else if (res.data.command === "UPDATE")  {
                this.setState({
                    status: 'leave this team'
                })
                this.props.dispatch(addNewMemberToCurrentTeam(this.props.user['current_teamid']))
            }
            else if (res.data.command === "DELETE") {
                this.setState({
                    status: 'Add Member'
                })
                this.props.dispatch(addNewMemberToCurrentTeam(this.props.user['current_teamid']))
            }
        })
        .catch(err => console.log(err.message))
    }

    render() {
        const {currentTeam} = this.props
        if(!currentTeam) {
            return null
        }
        console.log(currentTeam)
        return (
        <div onClick={this.updateMemberStatus} className="addMemberButton__container">
            {this.props.user['is_admin'] && this.state.status === 'Add Member' && <img className="member__icon" src="/assets/add-member.png" />}
            {this.state.status === 'Pending... Cancel?' && this.props.user['is_admin'] && <img className="member__icon" src="/assets/pending.png" />}
            {<img className="member__icon" src="/assets/member-accepted.png" />}
        </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user, userTeams: state.userTeams, currentTeam : state.currentTeam}
}

export default connect(mapStateToProps)(AddMemberButton)