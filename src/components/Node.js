import React from "react"
import {NODE_SIZE, STATES, COLORS} from "../config/constants.js"

export default class Node extends React.Component{
    state = {backgroundColor: null}

    set = key => {
        this.setState({backgroundColor: COLORS[key]})
    }

    reset = () => {
        this.setState({backgroundColor: null})
    }

    getBackgroundColor = () => {
        switch(this.props.state){
            case STATES.WALKABLE:
                return COLORS.WALKABLE
            case STATES.BLOCKED:
                return COLORS.BLOCKED
            case STATES.START:
                return COLORS.START
            case STATES.END:
                return COLORS.END
            case STATES.PATH:
                return COLORS.PATH
            default:
                return COLORS.WALKABLE
        }
    }

    render(){
        return(
            <div
                className="node"
                style={{width: NODE_SIZE, height: NODE_SIZE, backgroundColor: this.state.backgroundColor || this.getBackgroundColor()}}
                onClick={this.props.onClick}
            />
        )
    }
}
