import React from 'react'
import { connect } from 'react-redux'

import {initSocket} from '../socket'
import {hideFileInBoard, deleteNote} from '../redux/actions'


class Board extends React.Component {
    constructor() {
        super()
        this.state = {
            showMailModal: false,
            currentNote: ""
        }
        this.closeNote = this.closeNote.bind(this)
        this.sendMails = this.sendMails.bind(this)
        this.toggleMailModal = this.toggleMailModal.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteNote = this.deleteNote.bind(this)
    }

    handleChange(e) {
        this[e.target.name] = e.target.value
    }

    closeNote(id) {
        this.props.dispatch(hideFileInBoard(id))
    }

    sendMails() {
        let mail = {
            sender: this.props.user.id,
            recipient: this.recipient,
            team: this.team,
            note: this.state.currentNote
        }
        initSocket().emit('new mail sent', mail)
        this.toggleMailModal('')
    }

    toggleMailModal(id) {
        this.setState(prevState => ({
            showMailModal: !prevState.showMailModal,
            currentNote: id
        }))
    }

    deleteNote(id, noteType) {
        this.props.dispatch(hideFileInBoard(id))
        this.props.dispatch(deleteNote(id, noteType))
    }

    render() {
        const {notes} = this.props

        return (
            <div className="board__container">
            <div className="board__title">My Board</div>
            {notes && notes.map(note => {

                if(note.note) {
                    return (
                        <div className="noteBoard__container noteBoard" key={note.id}>
                            <div className="noteBoard__header">
                                <div className="header__left__noteBoard">
                                    <img onClick={() => this.toggleMailModal(note.id)} className="noteBoard__icon" src='/assets/mailbox.png'></img>
                                    <img className="noteBoard__icon" src="/assets/edit.png"></img>
                                </div> 
                                <div className="header__right__noteBoard">
                                    <img className="noteBoard__icon" src='/assets/close.png' onClick={() => this.closeNote(note.id)}></img>
                                </div>
                            </div>

                            <div className="noteBoard__content">
                                <div className="noteBoard__note__title">{note.title}</div>
                                {note.picture && 
                                    <img className="noteBoard__note__image" src={note.picture}/>
                                }
                                <div className="noteBoard__note__text">{note.note}</div>
                            </div>

                            <div className="noteBoard__footer">
                                <img className="noteBoard__icon" onClick={() => this.deleteNote(note.id, note['note_type'])} src='/assets/remove.png'></img>
                            </div>
                        </div>
                    )
                }

                if(note.link) {
                    return (
                        <div className="noteBoard__container linkBoard" key={note.id}>
                            <div className="noteBoard__header">
                                <div className="header__left__noteBoard">
                                    <img onClick={() => this.toggleMailModal(note.id)} className="noteBoard__icon" src='/assets/mailbox.png'></img>
                                </div> 
                                <div className="header__right__noteBoard">
                                    <img className="noteBoard__icon" src='/assets/close.png' onClick={() => this.closeNote(note.id)}></img>
                                </div>
                            </div>

                            <a className="linkBoard__content" href={note.link} target="_blank" rel="noopener noreferrer" >
                                <div className="linkBoard__note__title">{note.title}</div>
                                {note.picture && 
                                    <img className="linkBoard__note__image" src={note.picture}/>
                                }
                                <div className="linkBoard__note__publisher">{note.publisher}</div>
                                <div className="linkBoard__note__text">{note['link_content']}</div>
                            </a>

                            <div className="noteBoard__footer">
                                <img className="noteBoard__icon" src='/assets/remove.png'></img>
                            </div>
                        </div>
                    )
                }

                if(note.sound) {
                    return (
                        <div className="noteBoard__container soundBoard" key={note.id}>
                            <div className="noteBoard__header">
                                <div className="header__left__noteBoard">
                                    <img onClick={() => this.toggleMailModal(note.id)} className="noteBoard__icon" src='/assets/mailbox.png'></img>
                                </div> 
                                <div className="header__right__noteBoard">
                                    <img className="noteBoard__icon" src='/assets/close.png' onClick={() => this.closeNote(note.id)}></img>
                                </div>
                            </div>

                            <div className="soundBoard__content">
                                <div className="soundBoard__note__title">{note.title}</div>
                                <audio className="soundBoard__note__player" src={note.sound} controls></audio>
                            </div>

                            <div className="noteBoard__footer">
                                <img className="noteBoard__icon" src='/assets/remove.png'></img>
                            </div>
                        </div>
                    )
                }

                if(note.video) {
                    return (
                        <div className="noteBoard__container videoBoard" key={note.id}>
                            <div className="noteBoard__header">
                                <div className="header__left__noteBoard">
                                    <img onClick={() => this.toggleMailModal(note.id)} className="noteBoard__icon" src='/assets/mailbox.png'></img>
                                </div> 
                                <div className="header__right__noteBoard">
                                    <img className="noteBoard__icon" src='/assets/close.png' onClick={() => this.closeNote(note.id)}></img>
                                </div>
                            </div>

                            <div className="videoBoard__content">
                                <div className="videoBoard__note__title">{note.title}</div>
                                <video className="videoBoard__note__videoPlayer" src={note.video} controls ></video>
                            </div>

                            <div className="noteBoard__footer">
                                <img className="noteBoard__icon" src='/assets/remove.png'></img>
                            </div>
                        </div>
                    )
                }

            })}
            {this.state.showMailModal && 
                <div className="modal__container">
                    <div className="black__Sreen"></div>
                        <div className="modal">
                            <div>
                                <img className="closeModal__icon" onClick={() => this.toggleMailModal("")} src="/assets/close.png" />
                            </div>
                            <div className="modal__title">Send this Note</div>
                            <div className="form-group__edit">
                                <input className="input-modal" type="text" name="recipient" onChange={this.handleChange} placeholder="to: (username)" autoComplete="off" autoFocus/>
                            </div>
                            <input className="input-modal" onChange={this.handleChange} type="text" name="team" list="teams" placeholder="choose a team"/>
                                <datalist id="teams">
                                {this.props.userTeams.length >= 1 && this.props.userTeams.map((team, i)=> (
                                    <option key={i}>{team['team_name']}</option>
                                ))}     
                                </datalist>
                            <div className="btn__container">
                                <button className="btn" onClick={this.sendMails}>Send</button>
                            </div>
                        </div>
                    
                </div>
            }
        </div>
            
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user, notes: state.board, currentTeam: state.currentTeam, userTeams: state.userTeams}
}

export default connect(mapStateToProps)(Board)