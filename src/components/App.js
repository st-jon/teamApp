import React from 'react'
import axios from '../axios'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import Header from './Header'

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
        axios.get('/user')
            .then(({data}) => {
                this.setState({
                    username: data.rows[0].username,
                    firstname: data.rows[0]['first_name'],
                    lastname: data.rows[0]['last_name'],
                    userPicture: data.rows[0]['user_picture']
                })
            })
            .catch(err => console.log(err.message))
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