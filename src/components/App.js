import React from 'react'
import axios from '../axios'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {AddloggedinUser, getNotes, getTeams} from '../redux/actions'

import Header from './Header'
import UserTooBar from './UserToolBar'
import Board from './Board'
import MemberPage from './MemberPage'
import MyTeams from './MyTeams'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            username: '',
            firstname: '',
            lastname: '',
            userPicture: ''
        }
        this.logout = this.logout.bind(this)

    }

    componentDidMount() {
        this.props.dispatch(AddloggedinUser())
        this.props.dispatch(getNotes())
        this.props.dispatch(getTeams())
    }

    logout() {
        axios.get('/logout')
            .then(() => window.location.reload())
    }

    render() {
        const {user} = this.props

        if (!user) {
            return null
        }
        return (
            <BrowserRouter>
                <div>
                <Route 
                    exact path="/"
                    render={() => (
                    <div className="app__container">
                        <Header />
                        <div className="content__container">
                            <UserTooBar />
                            <Board />
                        </div>
                        
                    </div>
                    )}
                />  
                <Route 
                    exact path="/user/:id"
                    render={props => (
                    <div className="app__container">
                        <Header />
                        <div className="content__container">
                            <UserTooBar/>
                            <MemberPage 
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        </div>
                    </div>
                    )}
                />
                <Route 
                    exact path="/myTeams"
                    render={props => (
                    <div className="app__container">
                        <Header />
                        <div className="content__container">
                            <UserTooBar/>
                            <MyTeams 
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        </div>
                    </div>
                    )}
                />
                </div>
            </BrowserRouter>      
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(App)

