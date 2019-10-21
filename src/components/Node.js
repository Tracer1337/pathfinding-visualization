import React from "react"
import {STATES, COLORS} from "../config/constants.js"
import SettingsProvider from "../utils/SettingsProvider.js"

export default class Node extends React.Component{
    state = {backgroundColor: COLORS[this.props.state]}

    set = key => {
        this.setState({backgroundColor: COLORS[key]})
    }

    reset = () => {
        this.setState({backgroundColor: STATES.WALKABLE})
    }

    componentDidMount(){
        SettingsProvider.addEventListener("nodeSizeChange", () => this.forceUpdate())
    }

    render(){
        return(
            <div
                className="node"
                style={{
                    width: SettingsProvider.settings.nodeSize.value+"px",
                    height: SettingsProvider.settings.nodeSize.value+"px",
                    backgroundColor: this.state.backgroundColor
                }}
                onClick={this.props.onClick}
            >{this.props.children}</div>
        )
    }
}
