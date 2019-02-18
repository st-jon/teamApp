import React from 'react'
import { connect } from 'react-redux'

import {hideFileInBoard} from '../redux/actions'


class Board extends React.Component {
    constructor() {
        super()
        this.state = {}
        this.closeNote = this.closeNote.bind(this)
    }

    closeNote(id) {
        console.log(id)
        this.props.dispatch(hideFileInBoard(id))
    }

    render() {
        const {notes} = this.props

        if (!notes) {
            return null
        }
        return (
            <div className="board__container">
            {notes.map(note => {

                if(note.note) {
                    return (
                        <div className="noteBoard__container noteBoard" key={note.id}>
                            <div className="noteBoard__header">
                                <div className="header__left__noteBoard">
                                    <img className="noteBoard__icon" src='/assets/mailbox.png'></img>
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
                                <img className="noteBoard__icon" src='/assets/remove.png'></img>
                            </div>
                        </div>
                    )
                }

                if(note.link) {
                    return (
                        <div className="noteBoard__container linkBoard" key={note.id}>
                            <div className="noteBoard__header">
                                <div className="header__left__noteBoard">
                                    <img className="noteBoard__icon" src='/assets/mailbox.png'></img>
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
                                    <img className="noteBoard__icon" src='/assets/mailbox.png'></img>
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
                                    <img className="noteBoard__icon" src='/assets/mailbox.png'></img>
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
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {notes: state.board}
}

export default connect(mapStateToProps)(Board)