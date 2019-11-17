import React from "react"

import Grid from "../../Grid.js"
import Node from "./Node.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import {DEBUG_MODE} from "../../../config/constants.js"

export default class ReactAdapter extends Grid{
    nodes = []

    componentDidUpdate(){
        this.generateStartingPoint()
        this.generateEndingPoint()
    }

    componentDidMount(){
        this.init()
    }

    render(){
        this.createNewGrid()
        return(
            <div
                className="grid"
                ref={ref => this.gridRef = ref}
                style={{width: this.props.columns*SettingsProvider.settings.nodeSize.value}}
            >
                {this.grid.flat().map((state, i) => (
                    <Node
                        state={state}
                        key={i}
                        onClick={() => this.handleClick(i)}
                        ref={ref => this.nodes[i] = ref}
                        onMouseEnter={() => this.handleMouseEnter(i)}
                    >{DEBUG_MODE && `(${this.indexToCoords(i).join("|")})`}</Node>
                ))}
            </div>
        )
    }
}
