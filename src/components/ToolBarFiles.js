import React from 'react'
import {connect} from 'react-redux'

import {showFileInBoard} from '../redux/actions'

class ToolBarFiles extends React.Component {
    constructor(props) {
        super(props)
    }

    showFile(id, type) {
       this.props.dispatch(showFileInBoard(id, type))
    }

    render() {
        const {notes} = this.props
        if (!notes) {
            return null
        }
       
        return (
            <div className="toolBarFiles__container">
            {notes[this.props.index].files.map(file => (
                <div key={file.id} className="toolBarFiles__folder" onClick={this.showFile.bind(this, file.id, file['note_type'])}>
                    <img className="toolBarFiles__icon" src="./assets/file.png"/>
                    <div className="toolBarFiles__title">{file.title}</div>
                </div> 
            ))}
            </div>
        )
    }
}
const mapStateToProps = function(state) {
    return {notes: state.notes}
}

export default connect(mapStateToProps)(ToolBarFiles)

