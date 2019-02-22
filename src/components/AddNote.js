import React from 'react'
import {connect} from 'react-redux'
import axios from '../axios'
import { ReactMic } from 'react-mic'

import {addNote} from '../redux/actions'

import VideoNote from './VideoNote'

class AddNote extends React.Component {
    constructor() {
        super() 
        this.state = {
            addNoteMenuIsVisible: false,
            noteTypeIsVisible: 'note',
            record: false,
            audio: '',
            video: ''
        }
        this.showAddNoteMenu = this.showAddNoteMenu.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.chooseFile = this.chooseFile.bind(this)
        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.onStop = this.onStop.bind(this)
        this.submitNote = this.submitNote.bind(this)
        this.setVideo = this.setVideo.bind(this)
    }

    handleChange(e) {
        this[e.target.name] = e.target.value
    }

    showAddNoteMenu() {
        this.setState(prevState => ({
            addNoteMenuIsVisible: !prevState.addNoteMenuIsVisible
        }))
    }

    toggleNoteType(type) {
        console.log(type)
        this.setState({
            noteTypeIsVisible: type
        })
    }

    chooseFile() {
        let input = document.getElementById('addNote-pics__input')
        input.click()
        let fakeInput = document.getElementById('addNote-pics__input__fake')
        input.addEventListener('change', function() {
             let file = input.value.split("\\")
             let fileName = file[file.length-1]
             if (fileName.length > 0) {
                 fakeInput.innerHTML = `file: ${fileName}`
             } else if (fileName === "") {
                 fakeInput.innerHTML = 'choose a file'
             }  
         })
     }

    startRecording() {
        this.setState({record: true})
    }
     
    stopRecording() {
        this.setState({record: false})
    }
     
    onStop(recordedBlob) {
        this.setState({audio: recordedBlob})
    }

    setVideo(video) {
        this.setState({video})
    }

    submitNote() {

        if (!this.noteFolder || !this.newNoteTitle) {
            return
        }

        let picture 
        if (this.state.noteTypeIsVisible === 'note') {
            picture = document.getElementById('addNote-pics__input').files[0] ? document.getElementById('addNote-pics__input').files[0] : null
        }
        
        if (this.state.noteTypeIsVisible === 'sound' && this.state.audio) {
            let formData = new FormData()
            formData.append('file', this.state.audio.blob)  
            formData.append('folder', this.noteFolder)
            formData.append('title', this.newNoteTitle)
            axios.post('/notesWithAudio', formData)
                .then(({data}) => this.props.dispatch(addNote(data.rows[0], data.rows[0]['note_type'])))
                .catch(err => err.message)
        } 

        if (this.state.noteTypeIsVisible === 'video' && this.state.video) {
            let formData = new FormData()
            formData.append('file', this.state.video)
            formData.append('folder', this.noteFolder)
            formData.append('title', this.newNoteTitle)
            axios.post('/notesWithVideo', formData)
                .then(({data}) => this.props.dispatch(addNote(data.rows[0], data.rows[0]['note_type'])))
                .catch(err => err.message)
        } 
        

        if(picture) {
            let formData = new FormData()
            formData.append('file', picture)
            formData.append('text', this.newNote)
            formData.append('folder', this.noteFolder)
            formData.append('title', this.newNoteTitle)
            axios.post('/notesWithPicture', formData)
                .then(({data}) => this.props.dispatch(addNote(data.rows[0], data.rows[0]['note_type'])))
                .catch(err => err.message)
        } 

        if (!picture && this.state.noteTypeIsVisible === 'note') {
            // let formData = new FormData()
            // formData.append('text', this.newNote)
            // formData.append('folder', this.noteFolder)
            // formData.append('title', this.newNoteTitle)
            axios.post('/notesWithoutPicture', {text: this.newNote, folder: this.noteFolder, title: this.newNoteTitle})
                .then(({data}) => this.props.dispatch(addNote(data.rows[0], data.rows[0]['note_type'])))
                .catch(err => err.message)
        }



        else if (this.state.noteTypeIsVisible === 'link' && this.newNote.trim().indexOf("http") === 0 ) {
           axios.post('/getBodyLink', {
               url: this.newNote,
               noteTitle: this.newNoteTitle,
               folder: this.noteFolder
            })
            .then(({data}) => this.props.dispatch(addNote(data.rows[0], data.rows[0]['note_type'])))
            .catch(err => err.message)
        }
        this.setState({addNoteMenuIsVisible: false})
    }

    render() {
        const {notes} = this.props
        if (!notes) {
            return null
        }
        return (
            <div className="addNote__container">
                <div className="addNote__container__menu" onClick={this.showAddNoteMenu}>
                    <img className="addNote__icon" src="/assets/plus.png" />
                    <div className="addNote__title">Create New Note</div>
                </div>
               {this.state.addNoteMenuIsVisible &&
                <div className="addNote-menu__container">
                    <div className="addNote-menu__header__container" onClick={this.toggleNoteType.bind(this, 'note')}>
                        <img className="addNote-menu__icon" src="/assets/take-notes.png" />
                        <div className="addNote-menu__title">Note</div>
                    </div>
                    <div className="addNote-menu__header__container" onClick={this.toggleNoteType.bind(this, 'link')}>
                        <img className="addNote-menu__icon" src="/assets/link.png"/>
                        <div className="addNote-menu__title">Link</div>
                    </div>
                    <div className="addNote-menu__header__container" onClick={this.toggleNoteType.bind(this, 'video')}>
                        <img className="addNote-menu__icon" src="/assets/movie.png"/>
                        <div className="addNote-menu__title">Video</div>
                    </div>
                    <div className="addNote-menu__header__container" onClick={this.toggleNoteType.bind(this, 'sound')}>
                        <img className="addNote-menu__icon" src="/assets/mic1.png"/>
                        <div className="addNote-menu__title">Sound</div>
                    </div>
                

                    {this.state.noteTypeIsVisible === 'note' && 
                        <div className="addNote-content">
                            <input className="addNote-input__title" onChange={this.handleChange} type="text" name="newNoteTitle" placeholder="title" autoFocus></input>
                            <textarea className="addNote-input" onChange={this.handleChange} type="text" name="newNote" rows="8" cols="40" autoComplete="off" placeholder="type here..." />
                            <div className="addNote-chooseFile__container">
                                <img className="addNote-menu__icon" src="/assets/addpicture.png" />
                                <input ref={this.input} id="addNote-pics__input" className="addNote-pics__input" type="file" />
                                <span ref={this.fakeInput} onClick={this.chooseFile} title="choose a file to upload" id="addNote-pics__input__fake">choose an image</span>
                            </div>
                            <input className="addNote-input__folder" onChange={this.handleChange} type="text" name="noteFolder" list="folders" placeholder="choose a folder"/>
                                <datalist id="folders">
                                {notes.map((note, i)=> (
                                    <option key={i}>{note['note_type']}</option>
                                ))}     
                                </datalist>
                            <button onClick={this.submitNote} className="btn addNote__btn">Create</button>
                        </div>}
                    

                    {this.state.noteTypeIsVisible === 'link' && 
                        <div className="addNote-content">
                            <input className="addNote-input__title" onChange={this.handleChange} type="text" name="newNoteTitle" placeholder="title" autoFocus></input>
                            <textarea className="addNote-input" onChange={this.handleChange} type="text" name="newNote" rows="8" cols="40" autoComplete="off" placeholder="type your link here..." autoFocus/>
                            <input className="addNote-input__folder" onChange={this.handleChange} type="text" name="noteFolder" list="folders" placeholder="choose a folder"/>
                                <datalist id="folders">
                                {notes.map((note, i)=> (
                                    <option key={i}>{note['note_type']}</option>
                                ))}     
                                </datalist>
                            <button onClick={this.submitNote} className="btn addNote__btn">Create</button>
                        </div>}
                    

                    {this.state.noteTypeIsVisible === 'sound' && 
                        <div className="addNote-content">
                            <input className="addNote-input__title" onChange={this.handleChange} type="text" name="newNoteTitle" placeholder="title" autoFocus></input>
                            <ReactMic
                                record={this.state.record}
                                className="sound-wave"
                                onStop={this.onStop}
                                onData={this.onData}
                                strokeColor="#000000"
                                backgroundColor="#E9EBEE"
                                width={320}
                                height={80}
                            />
                            <div className="addNote-btn__container">
                                <button onClick={this.startRecording} className="btn addNote__btn">Record</button>
                                <button onClick={this.stopRecording} className="btn addNote__btn">Stop</button>
                            </div>
                            <input className="addNote-input__folder" onChange={this.handleChange} type="text" name="noteFolder" list="folders" placeholder="choose a folder"/>
                                <datalist id="folders">
                                {notes.map((note, i)=> (
                                    <option key={i}>{note['note_type']}</option>
                                ))}     
                                </datalist>
                            <button onClick={this.submitNote} className="btn addNote__btn">Create</button>
                        </div>}
                    

                    {this.state.noteTypeIsVisible === 'video' && 
                        <div className="addNote-content">
                            <input className="addNote-input__title" onChange={this.handleChange} type="text" name="newNoteTitle" placeholder="title" autoFocus></input>
                            <VideoNote setVideo={this.setVideo}/>
                            <input className="addNote-input__folder" onChange={this.handleChange} type="text" name="noteFolder" list="folders" placeholder="choose a folder"/>
                                <datalist id="folders">
                                {notes.map((note, i)=> (
                                    <option key={i}>{note['note_type']}</option>
                                ))}     
                                </datalist>
                            <button onClick={this.submitNote} className="btn addNote__btn">Create</button>
                        </div>}
                </div>}
            </div> 
        )
    }
}

const mapStateToProps = function(state) {
    return {notes: state.notes}
}

export default connect(mapStateToProps)(AddNote)