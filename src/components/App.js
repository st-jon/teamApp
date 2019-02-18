import React from 'react'
import axios from '../axios'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {AddloggedinUser, getNotes} from '../redux/actions'

import Header from './Header'
import UserTooBar from './UserToolBar'
import Board from './Board'
import MemberPage from './MemberPage'

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
                            <UserTooBar 
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                            <MemberPage />
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

