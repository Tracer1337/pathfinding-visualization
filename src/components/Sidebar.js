import React from "react"
import {ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography} from "@material-ui/core"

import ScreenSizeTracker from "../utils/ScreenSizeTracker.js"
import {TITLE} from "../config/constants.js"

export default class Sidebar extends React.Component{
    state = {isSmall: ScreenSizeTracker.isSmall}

    loadImage = () => {
        // Load dropdown icon
        if(this.state.isSmall){
            import("../assets/icons/arrow_drop_down-24px.svg").then(module => this.img.src = module.default)
        }
    }

    componentDidUpdate(){this.loadImage()}

    componentDidMount(){
        ScreenSizeTracker.addEventListener("onBoundaryPass", ({detail}) => this.setState({isSmall: detail.isSmall}))
        this.loadImage()
    }

    render(){
        if(!this.state.isSmall){
            return (
                <aside className="sidebar">
                    <Typography variant="subtitle1" className="title">{TITLE}</Typography>
                    {this.props.children}
                </aside>
            )
        }else{
            return(
                <ExpansionPanel className="expansion-panel">
                    <ExpansionPanelSummary>
                        <img ref={img => this.img = img} alt="Expand" className="drop-down"/>
                        <Typography>{TITLE}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {this.props.children}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        }
    }
}
