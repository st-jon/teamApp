import React from 'react' 
import { connect } from 'react-redux'
import axios from '../axios'

import {addNewMemberToCurrentTeam} from '../redux/actions'


class AddMemberButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: ''
        }
        this.updateMemberStatus = this.updateMemberStatus.bind(this)
    }

    componentDidMount() {
        if (this.props.user['is_admin']) {
            axios.post(`/status/${this.props.memberID}`, {teamID: this.props.user['current_teamid']})
            .then(res => {
                if (res.data.rows.length < 1) {
                    this.setState({status: 'Add Member'})
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
        else {
            axios.post(`/status/${this.props.memberID}`, {teamID: this.props.memberTeam})
            .then(res => {
                if (res.data.rows[0].accepted === false && this.props.user['is_admin'] === false) {
                    this.setState({status: 'Join this team'})
                }
                else if (res.data.rows[0].accepted === true) {
                    this.setState({status: 'leave this team'})
                }
            })
            .catch(err => console.log(err.message))
        }
       
    } 

    updateMemberStatus() {
        if (this.props.user['is_admin']) {
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
        else {
            axios.post('/updateMemberStatus', {
                status: this.state.status,
                memberID:  this.props.memberID,
                team: this.props.memberTeam,
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
                        status: ''
                    })
                    this.props.dispatch(addNewMemberToCurrentTeam(this.props.user['current_teamid']))
                }
            })
            .catch(err => console.log(err.message))
        }  
    }

    render() {
        return (
        <div>
            {this.props.user['is_admin'] && <div onClick={this.updateMemberStatus} className="addMemberButton__container">
                    <div className="addMemberButton">

                        {this.state.status === 'Add Member' && this.props.memberID != this.props.user['is_admin'] && this.props.memberGenre === "woman" && <img className="member__icon" src="/assets/add-user-female.png" />}
                        {this.state.status === 'Add Member' && this.props.memberID != this.props.user['is_admin'] && this.props.memberGenre !== "woman" && <img className="member__icon" src="/assets/add-user-male.png" />}

                        {this.state.status === 'Pending... Cancel?' && this.props.memberGenre === "woman" && <img className="member__icon" src="/assets/invited-member-female.png" />}
                        {this.state.status === 'Pending... Cancel?' &&  this.props.memberGenre !== "woman" && <img className="member__icon" src="/assets/invited-member-male.png" />}

                        {this.state.status === 'leave this team' && this.props.memberGenre === "woman" && <img className="member__icon" src="/assets/delete-member-female.png" />}
                        {this.state.status === 'leave this team' && this.props.memberGenre !== "woman" && <img className="member__icon" src="/assets/delete-member-male.png" />}

                        <div className="addMemberButton__message">{this.state.status}</div>
                    </div>
                </div>}
                {!this.props.user['is_admin'] && this.props.memberID === this.props.user.id && <div onClick={this.updateMemberStatus} className="addMemberButton__container">
                    <div className="addMemberButton">
                        {this.state.status === 'Join this team'  && this.props.memberGenre === "woman" && <img className="member__icon" src="/assets/accepted-member-female.png" />}
                        {this.state.status === 'Join this team'  && this.props.memberGenre !== "woman" && <img className="member__icon" src="/assets/accepted-member-male.png" />}

                        {this.state.status === 'leave this team' && this.props.memberGenre === "woman" && <img className="member__icon" src="/assets/delete-member-female.png" />}
                        {this.state.status === 'leave this team' && this.props.memberGenre !== "woman" && <img className="member__icon" src="/assets/delete-member-male.png" />}

                        <div className="addMemberButton__message">{this.state.status}</div>
                    </div>
                </div>}
        </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user, userTeams: state.userTeams, currentTeam : state.currentTeam}
}

export default connect(mapStateToProps)(AddMemberButton)