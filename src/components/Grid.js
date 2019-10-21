import React from "react"

import Node from "./Node.js"
import {STATES, DEBUG_MODE, ROWS_CONSTRAINT, COLUMNS_CONSTRAINT} from "../config/constants.js"
import SettingsProvider from "../utils/SettingsProvider.js"

export default class Grid extends React.Component{
    constructor(props){
        super(props)
        this.createNewGrid()
        this.mode = STATES.BLOCKED
        this.nodes = []
    }

    createNewGrid = () => {
        const rows = Math.min(this.props.rows, ROWS_CONSTRAINT)
        const columns = Math.min(this.props.columns, COLUMNS_CONSTRAINT)
        this.grid = Array(rows).fill(0).map(() => Array(columns).fill(STATES.WALKABLE))
    }

    clearGrid = () => {
        this.nodes.forEach(node => node.reset())
        this.grid = this.grid.map(column => column.map(cell => cell = STATES.WALKABLE))
        this.startingPoint = null
        this.endingPoint = null
    }

    indexToCoords = index => [index%this.props.columns, Math.floor(index/this.props.columns)]
    coordsToIndex = ({x,y}) => y*this.props.columns+x

    toggleGridAtIndex(index, value){
        const coords = this.indexToCoords(index)
        this.nodes[index].toggle(value)
        if(this.grid[coords[1]][coords[0]] === parseInt(value)){
            this.grid[coords[1]][coords[0]] = STATES.WALKABLE
        }else{
            this.grid[coords[1]][coords[0]] = parseInt(value)
        }
    }

    handleClick = (index) => {
        this.toggleGridAtIndex(index, this.mode)
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
        SettingsProvider.addEventListener("nodeSizeChange", () => this.forceUpdate())
        SettingsProvider.addEventListener("clearGrid", this.clearGrid)
    }

    render(){
        this.createNewGrid()
        return(
            <div className="grid" style={{width: this.props.columns*SettingsProvider.settings.nodeSize.value}}>
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
