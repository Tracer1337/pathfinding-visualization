import React from "react"
import {ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography} from "@material-ui/core"

import ScreenSizeTracker from "../utils/ScreenSizeTracker.js"

export default class Sidebar extends React.Component{
    state = {isSmall: ScreenSizeTracker.isSmall}

    componentDidMount(){
        ScreenSizeTracker.addEventListener("onBoundaryPass", ({detail}) => this.setState({isSmall: detail.isSmall}))
    }

    render(){
        if(!this.state.isSmall){
            return (
                <aside className="sidebar">
                    {this.props.children}
                </aside>
            )
        }else{
            return(
                <ExpansionPanel className="expansion-panel">
                    <ExpansionPanelSummary>
                        <Typography>Settings</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {this.props.children}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        }
    }
}
