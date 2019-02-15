import React from 'react'

export default function UserPicture(props) {
    return (
        <div className="user-picture">
            <img src="./assets/icons8-user-male-100.png" />
        </div>
    )

}

// {props.picture ? <img className="user__profilPic" onClick={props.uploader} src={props.picture} /> :
//             <div onClick={props.uploader} className="default__profilPic"><span className="initial">{props.name.charAt(0)}{props.last.charAt(0)}</span></div>
//             }
//             <div className="edit__profile"></div>