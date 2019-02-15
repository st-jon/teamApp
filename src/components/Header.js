import React from 'react'
import { Link } from 'react-router-dom'
import axios from '../axios'

import UserPicture from './UserPicture'

export default class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="header__container">
                <div className="title__header">
                    <p className="title__t__header">T</p> 
                    <p className="title__e__header">E</p> 
                    <p className="title__a__header">A</p> 
                    <p className="title__m__header">M</p> 
                </div>
                <div className="header__right">
                    <UserPicture />
                    <img src="./assets/icons8-menu-100.png" />
                </div>  
            </div>
        )
    }
}
