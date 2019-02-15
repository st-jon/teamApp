import React from 'react'
import axios from '../axios'
import { Link } from 'react-router-dom'

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    handleChange(e) {
        this[e.target.name] = e.target.value
    }

    submit() {
        axios.post('/login', {
            email: this.email,
            password: this.password
        })
            .then(({data}) => {
                if (data.success) {
                    location.replace('/')
                } else {
                    this.setState({
                        error: data.error
                    });
                }
            })
            .catch(err => console.log(err.message))
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.submit()
        }
    }

    render() {
        return (
            <div onKeyPress={this.handleKeyPress} className="form">
                <div className="registration__container">
                    {this.state.error && <div className="alert error">{this.state.error}</div>}
                    <div className="form-group">
                        <input className="input" type="text" name="email" onChange={this.handleChange} autoComplete="off" placeholder="Email" autoFocus/>
                        <label htmlFor="email" className="animated-label">Email</label>
                    </div>
                    <div className="form-group">
                        <input className="input" type="password" name="password" onChange={this.handleChange} autoComplete="off" placeholder="Password" />
                        <label htmlFor="password" className="animated-label">Password</label>
                    </div>                
                    <div className="btn__container">
                        <button className="btn" onClick={this.submit}>Login</button>
                    </div>
                    <p className="login__link">Not yet registered ? <Link to="/">register</Link></p>
                </div>
            </div>
        )
    }
}