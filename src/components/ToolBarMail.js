import React from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

import axios from '../axios'

import ToolBarMailsFiles from './ToolBarMailsFiles'

import {addEmailContent, addEmailCategory, getEmailContent} from '../redux/actions'

class ToolBarMail extends React.Component {
    constructor() {
        super()
        this.state= {
            visible: []
        }
    }
    
    componentDidMount() {
        let temp = []
        this.props.mails.forEach(mail => {
            temp.push({folder: mail['team_id']})
        })
        const folders = _.uniqBy(temp, 'folder')
        this.props.dispatch(addEmailCategory(folders))
        let array = []
  
        folders.forEach(folder => {
            let infos = this.props.mails.filter(mail => {
                return mail['team_id'] === folder.folder
            })
            array.push({folder: folder, infos})
        })
        array.forEach(mails => {
            mails.infos.forEach((info) => {
                axios.post('/getMailsContent', {
                    senderID: info['sender_id'],
                    noteID: info['note_id']
                })
                .then(notes => {
                    this.props.dispatch(addEmailContent(notes.data.rows[0], info['team_id']))
                })
                .catch(err => console.log(err.message))
            })
            
        })  
    }

    showFiles(i, folder) {
        if(!this.state.visible.includes(folder)) {
            let newArray = this.state.visible
            newArray[i] = folder
            this.setState({
                visible: newArray
            })
        } else {
            let newArray = this.state.visible
            newArray[i] = null
            this.setState({
                visible: newArray
            })
        }        
    }

    render() {
        const {mailsContent} = this.props 
        if (!mailsContent) {
            return null
        }

        return (
            <div className="mailsFolders__container">
                {mailsContent.map((folder, i) => (
                    <div key={i}>
                        <div className="toolBarNotes__folder" onClick={this.showFiles.bind(this, i, folder.folder)} >
                            <img className="toolBarNotes__icon" src="/assets/notes.png"/>
                            <div className="toolBarNotes__title">{folder.folder}</div>
                        </div> 
                        {this.state.visible[i] === folder.folder  && <ToolBarMailsFiles folder={folder.folder} index={i}/>}
                    </div>
                ))}
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {mails: state.mails, mailsContent: state.mailsContent}
}

export default connect(mapStateToProps)(ToolBarMail)