import React from 'react'
import { connect } from 'react-redux'

class MemberPage extends React.Component {
    constructor() {
        super()
    }

    render() {
        return(
            <div>member page is here</div>
        )
    }
}

const mapStateToProps = function(state) {
    return {user: state.user}
}

export default connect(mapStateToProps)(MemberPage)