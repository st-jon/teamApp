import React from 'react'
import {connect} from 'react-redux'

import {showEmailInBoard} from '../redux/actions'

class ToolBarMailsFiles extends React.Component {
    constructor(props) {
        super(props)
    }

    showFile(id, type) {
       this.props.dispatch(showEmailInBoard(id, type))
    }

    render() {
        const {mailsContent} = this.props
        if (!mailsContent) {
            return null
        }
        console.log(this.props.index)
        
        return (
            <div className="toolBarFiles__container">
            {mailsContent[this.props.index].files.map(file => (
                <div key={file.id} className="toolBarFiles__folder" onClick={this.showFile.bind(this, file.id, this.props.folder)}>
                    <img className="toolBarFiles__icon" src="/assets/file.png"/>
                    <div className="toolBarFiles__title">{file.title}</div>
                </div> 
            ))}
            </div>
        )
    }
}
const mapStateToProps = function(state) {
    return {mailsContent: state.mailsContent}
}

export default connect(mapStateToProps)(ToolBarMailsFiles)