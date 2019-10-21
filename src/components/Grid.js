import React from "react"

import Node from "./Node.js"
import {NODE_SIZE, STATES, DEBUG_MODE} from "../config/constants.js"
import SettingsProvider from "../utils/SettingsProvider.js"

export default class Grid extends React.Component{
    grid = Array(this.props.rows).fill(0).map(() => Array(this.props.columns).fill(STATES.WALKABLE))
    mode = STATES.BLOCKED
    nodes = []

    clearGrid = () => {
        this.nodes.forEach(node => node.reset())
        this.grid = this.grid.map(column => column.map(cell => cell = STATES.WALKABLE))
    }

    indexToCoords = index => [index%this.props.columns, Math.floor(index/this.props.columns)]
    coordsToIndex = ({x,y}) => y*this.props.columns+x

    setGridAtIndex(index, value){
        const coords = this.indexToCoords(index)
        this.nodes[index].set(value)
        this.grid[coords[1]][coords[0]] = parseInt(value)
    }

    handleClick = (index) => {
        this.setGridAtIndex(index, this.mode)
        if(this.mode === STATES.START){
            this.startingPoint = index
        } else if(this.mode === STATES.END){
            this.endingPoint = index
        }
    }

    showPath = path => {
        for(let point of path){
            this.grid[point[1]][point[0]] = 4
            this.nodes[this.coordsToIndex({x:point[0], y:point[1]})].set(STATES.PATH)
        }
    }

    componentDidMount(){
        SettingsProvider.addEventListener("gridSetterStateChange", ({detail}) => this.mode = parseInt(detail))
        SettingsProvider.addEventListener("clearGrid", this.clearGrid)
    }

    render(){
        return(
            <div className="grid" style={{width: this.props.columns*NODE_SIZE}}>
                {this.grid.flat().map((state, i) => (
                    <Node
                        state={state}
                        key={i}
                        onClick={() => this.handleClick(i)}
                        ref={ref => this.nodes[i] = ref}
                    >{DEBUG_MODE && `(${this.indexToCoords(i).join("|")})`}</Node>
                ))}
            </div>
        )
    }
}
