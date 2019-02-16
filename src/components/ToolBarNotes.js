import React from 'react'
import {connect} from 'react-redux'

import {getFiles} from '../redux/actions'

import ToolBarFiles from './ToolBarFiles'

class ToolBarNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filesAreVisible: false,
            index: null
        }
    }

    componentDidMount() {
        const {notes} = this.props
        if (!notes) {
            return null
        }
        notes.forEach(note => {
            this.props.dispatch(getFiles(note['note_type']))
        })
    }

    showFiles(i) {
        this.setState(prevState => ({
            filesAreVisible: !prevState.filesAreVisible,
            index: prevState.index !== null ? null : i
        }))
    }


    render() {
        const {notes} = this.props
        if (!notes) {
            return null
        }
        console.log(notes)
        
        return (
            <div className="toolBarNotes__container">
            {notes.map((noteType, i) => (
                <div key={i}>
                    <div className="toolBarNotes__folder" onClick={this.showFiles.bind(this, i)} >
                        <img className="toolBarNotes__icon" src="./assets/notes.png"/>
                        <div className="toolBarNotes__title">{noteType['note_type']}</div>
                    </div> 
                    {this.state.filesAreVisible && this.state.index === i && <ToolBarFiles index={i}/>}
                </div>
            ))}
            </div> 
        )
    }

}
const mapStateToProps = function(state) {
    return {notes: state.notes}
}

export default connect(mapStateToProps)(ToolBarNotes)


