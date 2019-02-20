import React from 'react'
import { connect } from 'react-redux'
import axios from '../axios'

import UserPicture from './UserPicture'
import AddMemberButton from './AddMemberButton'

class MemberPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        axios.get(`/api/user/${this.props.match.params.id}`)
            .then(data => {
                if(data.data.redirectTo) {
                    this.props.history.push(data.data.redirectTo)
                } else {
                    this.setState({ ...data.data.rows[0]})
                }  
        })
    }

    render() {
        return(
            <div className="memberPage__container">
                <div className="member__card">
                    <div className="card__header">
                        <div className="member__title">
                            {this.state.username  && <UserPicture  otherUser={this.state}/>}
                            <div className="card__status capitalize username__title">{this.state.username}</div>
                        </div>
                        {this.props.currentTeam && <AddMemberButton memberID={Number(this.props.match.params.id)} memberGenre={this.state.genre} />}
                    </div>
                    <div className="card__infos">
                        <div className="card__status capitalize"><b>First Name:</b> {this.state['first_name']}</div>
                        <div className="card__status capitalize"><b>Last Name:</b> {this.state['last_name']}</div>
                        <div className="card__status"><b>Email:</b> {this.state.email}</div>
                        <div className="card__status"><b>Age:</b> {this.state.age ? this.state.age : <em className="default__message">"this user hasn't filled this yet"</em>}</div>
                        <div className="card__status"><b>Company:</b> {this.state.company ? this.state.company : <em className="default__message">"this user hasn't filled this yet"</em>}</div>
                        <div className="card__status"><b>Position:</b> {this.state.position ? this.state.position : <em className="default__message">"this user hasn't filled this yet"</em>}</div>
                        <div className="card__status"><b>Favorite Food:</b> {this.state['favorite_food'] ? this.state['favorite_food'] : <em className="default__message">"this user hasn't filled this yet"</em>}</div>
                        <div className="card__status"><b>Interest:</b> {this.state.interest ? this.state.interest : <em className="default__message">"this user hasn't filled this yet"</em>}</div>
                        <div className="card__status"><b>Favorite Music:</b> {this.state.music ? this.state.music : <em className="default__message">"this user hasn't filled this yet"</em>}</div>
                    </div>
                </div> 
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user, currentTeam: state.currentTeam}
}

export default connect(mapStateToProps)(MemberPage)


// <UserPicture  otherUser={this.state}/>