import React from 'react'
import axios from '../axios'

import {Link} from 'react-router-dom'

import UserPicture from './UserPicture'

export default class Search extends React.Component {
    constructor() {
        super()
        this.state = {
            searchedMembers: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.resetSearch = this.resetSearch.bind(this)
    }

    handleChange(e) {
        this[e.target.name] = e.target.value
        axios.get(`/search/${this.searchbar}`)
            .then(data => this.setState({searchedMembers: data.data.rows}))
            .catch(err => console.log(err.message))
    }

    resetSearch() {
        this.setState({searchedMembers: []})
        document.querySelector('.searchBar').value = ""
    }

    render() {
        return (
            <div className="search__container">
                <img className="user__icon" src="/assets/find-member.png" />
                <input type="text" name="searchbar" className="searchBar" onChange={this.handleChange} autoComplete="off" placeholder="Search Team Member" autoFocus/>
                <div className="result__container">
                    {this.state.searchedMembers &&
                    this.state.searchedMembers.map(member => {
                        return (
                            <Link to={`/user/${member.id}`} key={member.id}>
                                <div onClick={this.resetSearch} className="result">
                                    <UserPicture otherUser={member}/>
                                    <div className="result__name" >
                                        {member['first_name']}  {member['last_name']} 
                                    </div>
                                </div>    
                            </Link>
                        )  
                    })}    
                </div>
            </div>
        )
    }
}