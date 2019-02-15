import React from 'react' 
import { connect } from 'react-redux'
import {updateUser, updateUserWithPicture} from '../redux/actions'

class EditUserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
    }

    handleChange(e) {
        this[e.target.name] = e.target.value
    }

    submit(e) {
        const username = this.username ? this.username : this.props.user.username
        const firstname = this.firstName ? this.firstName : this.props.user['first_name']
        const lastname = this.lastName ? this.lastName : this.props.user['last_name']
        const email = this.email ? this.email : this.props.user.email
        const genre = this.genre ? this.genre : this.props.user.genre
        const userPicture = document.getElementById('file__input').files[0] ? document.getElementById('file__input').files[0] : this.props.user['user_picture']
        if (!userPicture) {
            this.props.dispatch(updateUser({
                username, firstname, lastname, email, genre
            }))
            this.props.showEditor()
        } else {
            let formdata = new FormData()
            formdata.append('file', userPicture)
            formdata.append('username', username)
            formdata.append('firstname', firstname)
            formdata.append('lastname', lastname)
            formdata.append('email', email)
            formdata.append('genre', genre)
            this.props.dispatch(updateUserWithPicture(formdata))
            this.props.showEditor()
        }
        
    }

    componentDidMount() {
        console.log(this.props)
        let input = document.getElementById('file__input')
        let fakeInput = document.getElementById('file__input__fake')
        

        fakeInput.addEventListener('click', function(){
            input.click()
        })

        input.addEventListener('change', function() {
            let file = input.value.split("\\")
            let fileName = file[file.length-1]
            if (fileName.length > 0) {
                fakeInput.innerHTML = `${fileName}`
            } else if (fileName === "") {
                fakeInput.innerHTML = 'choose a file'
            }  
        })
    }

    render() {
        const {user} = this.props

        if (!user) {
            return null
        }
        return (
            <div className="userEditor__container">
                <div className="form-group__edit">
                    <input className="input-edit" defaultValue={user['username']} type="text" name="username" onChange={this.handleChange} placeholder="Username" autoComplete="off" autoFocus/>
                </div>
                <div className="form-group__edit">
                    <input className="input-edit" defaultValue={user['first_name']} type="text" name="firstName" onChange={this.handleChange} autoComplete="off" placeholder="First Name"/>
                </div>
                <div className="form-group__edit">
                    <input className="input-edit" defaultValue={user['last_name']} type="text" name="lastName" onChange={this.handleChange} autoComplete="off" placeholder="Last Name" />
                </div> 
                <div className="form-group__edit">
                    <input className="input-edit" defaultValue={user['email']} type="text" name="email" onChange={this.handleChange} autoComplete="off" placeholder="Email" />
                </div>
                <div className="form-group__edit">
                    <input className="input-edit__radio" type="radio" id="man" name="genre" value="man" onChange={this.handleChange} />
                    <label className="input-edit__label" htmlFor="man">Man</label>
                </div>
                <div className="form-group__edit">
                    <input className="input-edit__radio" type="radio" id="woman" name="genre" value="woman" onChange={this.handleChange} />
                    <label className="input-edit__label" htmlFor="woman">Woman</label>
                </div>
                <div className="form-group__edit">
                    <input id="file__input" className="image-upload__input" type="file"/>
                    <span title="choose a file to upload" className="image-upload__show" id="file__input__fake">Choose a picture</span>
                </div>
                <div className="btn__container">
                    <button className="btn" onClick={this.submit}>Edit</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(EditUserProfile)