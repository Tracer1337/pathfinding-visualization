import React from "react"
import {NODE_SIZE, STATES, COLORS} from "../config/constants.js"

export default class Node extends React.Component{
    state = {backgroundColor: COLORS[this.props.state]}

    set = key => {
        this.setState({backgroundColor: COLORS[key]})
    }

    reset = () => {
        this.setState({backgroundColor: STATES.WALKABLE})
    }

    render(){
        return(
            <div
                className="node"
                style={{width: NODE_SIZE, height: NODE_SIZE, backgroundColor: this.state.backgroundColor}}
                onClick={this.props.onClick}
            >{this.props.children}</div>
        )
    }
}
