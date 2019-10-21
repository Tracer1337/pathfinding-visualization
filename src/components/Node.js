import React from "react"
import {STATES, BACKGROUNDS, NODE_BORDER_WIDTH} from "../config/constants.js"
import SettingsProvider from "../utils/SettingsProvider.js"

export default class Node extends React.Component{
    state = {state: this.props.state}

    toggle = key => {
        if(this.state.state === key){
            this.setState({state: STATES.WALKABLE})
        }else{
            this.setState({state: key})
        }
    }

    set = key => {
        if(this.state.state !== STATES.START && this.state.state !== STATES.END){
            this.setState({state: key})
        }
    }

    reset = () => this.setState({state: STATES.WALKABLE})

    setState(newState){
        super.setState(newState)
        if(newState.state !== STATES.WALKABLE){
            this.node.classList.add("animate")
            setTimeout(() => this.node.classList.remove("animate"), 200)
        }
    }

    componentDidMount(){
        SettingsProvider.addEventListener("nodeSizeChange", () => this.forceUpdate())
    }

    render(){
        let background = BACKGROUNDS[this.state.state], backgroundImage, backgroundColor

        if(background[0] === "Image"){
            backgroundImage = background[1]
            backgroundColor = BACKGROUNDS[STATES.PATH][1]
        }else if(background[0] === "Color"){
            backgroundColor = background[1]
        }

        return(
            <div
                className="node"
                style={{
                    width: SettingsProvider.settings.nodeSize.value-NODE_BORDER_WIDTH*2+"px",
                    height: SettingsProvider.settings.nodeSize.value-NODE_BORDER_WIDTH*2+"px",
                    backgroundImage,
                    backgroundColor // BG == BORDER
                }}
                onClick={this.props.onClick}
                ref={ref => this.node = ref}
            >{this.props.children}</div>
        )
    }
}
