import React from 'react' 
import {connect} from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension';


class VideoNote extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            recording: false,
            recordDone: false,
            video: ''
        }
        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.recordingRef = React.createRef()
    }

    componentDidMount() {
        this.preview = document.getElementById("video-preview")
        this.recordingTimeMS = 60000
    }

    wait(delay) {
        return new Promise(resolve => setTimeout(resolve, delay))
    }

    start() {
        this.recorder = new MediaRecorder(this.stream)
        this.data = []
        
        this.recorder.ondataavailable = event => this.data.push(event.data)
        this.recorder.start()
        
        let stopped = new Promise((resolve, reject) => {
            this.recorder.onstop = resolve
            this.recorder.onerror = event => reject(event.name)
        })

        // let recorded = this.wait(this.recordingTimeMS)
        //     .then(() => this.recorder.state == "recording" && this.recorder.stop()
        // )
        
        return Promise.all([
            stopped
        ])
        .then(() => this.data)
    }

    startRecording() {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        .then(stream => {
            this.stream= stream
            this.preview.srcObject = stream
            this.preview.captureStream = this.preview.captureStream || this.preview.mozCaptureStream
            return new Promise(resolve => this.preview.onplaying = resolve)
        })
        .then(() => this.start(this.preview.captureStream(), this.recordingTimeMS))
        .then (recordedChunks => {
            this.recordedBlob = new Blob(recordedChunks, { type: "video/webm" })
            this.setState({video: URL.createObjectURL(this.recordedBlob)}) 
            this.props.setVideo(this.recordedBlob)
        })
        .catch(err => console.log(err.message))
    }

    stopRecording() {
        if(this.state.recordDone){
            return
        }
        this.stream.getTracks().forEach(track => track.stop())
        this.recorder.stop()
        this.setState({recordDone: true}) 
    }

    componentDidUpdate() {
        this.recording.src = this.state.video
    }

    render() {
        return (
            <div>
                {!this.state.recordDone && <video id="video-preview" className="addNote-videoPreview" width="200" height="140" autoPlay muted></video>}
                {this.state.recordDone && <video ref={element => this.recording = element} controls id="video-view" className="addNote-videoPreview" width="200" height="140" autoPlay></video>}
                <div className="addNote-btn__container">
                    <button onClick={this.startRecording} className="btn addNote__btn">Record</button>
                    <button onClick={this.stopRecording} className="btn addNote__btn">Stop</button>
                </div>
            </div>
        )
    }
}



const mapStateToProps = function(state) {
    return {notes: state.notes}
}

export default connect(mapStateToProps)(VideoNote)
