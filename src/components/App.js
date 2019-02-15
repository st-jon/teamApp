import React from 'react'
import axios from '../axios'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {AddloggedinUser} from '../redux/actions'

import Header from './Header'
import UserTooBar from './UserToolBar'

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
                <div className="app__container">
                    <Header />
                    <UserTooBar />
                    <div onClick={this.logout} className="logout">Logout</div>
                </div>  
            </BrowserRouter>      
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(App)