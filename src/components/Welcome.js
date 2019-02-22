import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import Registration from './Registration'
import Login from './Login'

export default function Welcome() {
    return (
        <div className='welcome'>
            <div className="welcome__left">
            <div className="title">
                <p className="title__t">T</p> 
                <p className="title__e">E</p> 
                <p className="title__a">A</p> 
                <p className="title__m">M</p> 
            </div>
                
                <div className="subtitle">Work and Share your Work with Others</div>
            </div>
            <HashRouter>
                <div className="welcome__right">
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    )
}