import React from 'react'
import axios from '../axios.js'
import { Link } from 'react-router-dom'


export default class Registration extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            error: ''
        };
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    handleChange(e) {
        this[e.target.name] = e.target.value
    }

    submit() {
        if (this.password !== this.confirmation || !this.password || !this.confirmation) {
            this.setState({error: 'password does not match confirmation'})
            return
        }
        axios.post('/register', {
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        }).then(({data}) => {
            if (data.success) {
                location.replace('/')
            } else if (data.error){
                this.setState({error: data.error})
            }
        })
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.submit()
        }
    }

    render() {
        console.log('something')
        return (
            <div onKeyPress={this.handleKeyPress} className="form">
                <div className="registration__container">
                    {this.state.error && <div className="alert error">{this.state.error}</div>}
                    <div className="form-group">
                        <input className="input" type="text" name="username" onChange={this.handleChange} placeholder="Username" autoComplete="off" autoFocus/>
                        <label htmlFor="username" className="animated-label">Username</label>
                    </div>
                    <div className="form-group">
                        <input className="input" type="text" name="firstName" onChange={this.handleChange} autoComplete="off" placeholder="First Name"/>
                        <label htmlFor="firstName" className="animated-label">First Name</label>
                    </div>
                    <div className="form-group">
                        <input className="input" type="text" name="lastName" onChange={this.handleChange} autoComplete="off" placeholder="Last Name" />
                        <label htmlFor="lastName" className="animated-label">Last Name</label>
                    </div> 
                    <div className="form-group">
                        <input className="input" type="text" name="email" onChange={this.handleChange} autoComplete="off" placeholder="Email" />
                        <label htmlFor="email" className="animated-label">Email</label>
                    </div>
                    <div className="form-group">
                        <input className="input" type="password" name="password" onChange={this.handleChange} autoComplete="off" placeholder="Password" />
                        <label htmlFor="password" className="animated-label">Password</label>
                    </div>
                    <div className="form-group">
                        <input className="input" type="password" name="confirmation" onChange={this.handleChange} autoComplete="off" placeholder="Confirm Password" />
                        <label htmlFor="password" className="animated-label">Confirm Password</label>
                    </div>
                    <div className="btn__container">
                        <button className="btn" onClick={this.submit}>Register</button>
                    </div>
                    <p className="login__link">Already a member ? please <Link to="/login">login</Link></p>
                </div>
                
                
            </div>
        )
    }
}