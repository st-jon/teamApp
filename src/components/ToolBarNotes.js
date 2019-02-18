import React from 'react'
import {connect} from 'react-redux'

import {getFiles} from '../redux/actions'

import ToolBarFiles from './ToolBarFiles'

class ToolBarNotes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: []
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
        const {notes} = this.props
        if (!notes) {
            return null
        }
        return (
            <div className="toolBarNotes__container">
            {notes.map((noteType, i) => (
                <div key={i}>
                    <div className="toolBarNotes__folder" onClick={this.showFiles.bind(this, i, noteType['note_type'])} >
                        <img className="toolBarNotes__icon" src="./assets/notes.png"/>
                        <div className="toolBarNotes__title">{noteType['note_type']}</div>
                    </div> 
                    {this.state.visible[i] === noteType['note_type'] && <ToolBarFiles index={i}/>}
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


