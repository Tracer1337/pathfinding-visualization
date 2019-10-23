import React from "react"

import Node from "./Node.js"
import {STATES, DEBUG_MODE, ROWS_CONSTRAINT, COLUMNS_CONSTRAINT} from "../config/constants.js"
import SettingsProvider from "../utils/SettingsProvider.js"
import sleep from "../utils/sleep.js"

export default class Grid extends React.Component{
    constructor(props){
        super(props)
        this.createNewGrid()
        this.mode = STATES.BLOCKED
        this.nodes = []
    }

    indexToCoords = index => [index%this.props.columns, Math.floor(index/this.props.columns)]
    coordsToIndex = ({x,y}) => y*this.props.columns+x

    createNewGrid = () => {
        this.clearGrid()
        const rows = Math.min(this.props.rows, ROWS_CONSTRAINT)
        const columns = Math.min(this.props.columns, COLUMNS_CONSTRAINT)
        this.grid = Array(rows).fill(0).map(() => Array(columns).fill(STATES.WALKABLE))
    }

    clearGrid = () => {
        if(this.nodes){
            this.nodes.forEach(node => node && node.reset())
            this.grid = this.grid.map(column => column.map(cell => cell = STATES.WALKABLE))
            this.startingPoint = null
            this.endingPoint = null
        }
    }

    initNewPath = () => {
        const shouldReset = [STATES.PATH, STATES.CURRENT, STATES.OPEN, STATES.CLOSED]
        this.grid = this.grid.map((column, y) => column.map(((cell, x) => {
            const index = this.coordsToIndex({x,y})
            if(index === this.startingPoint)
                return STATES.START
            if(index === this.endingPoint)
                return STATES.END
            if(shouldReset.includes(cell)){
                this.nodes[index].reset()
                return STATES.WALKABLE
            }
            return cell
        })))
    }

    generateStartingPoint = () => {
        if(this.props.columns > COLUMNS_CONSTRAINT || this.props.rows > ROWS_CONSTRAINT) return
        const x = Math.floor(this.props.columns*.2)
        const y = Math.floor(this.props.rows/2)
        this.startingPoint = this.coordsToIndex({x, y})
        this.toggleGridAtIndex(this.startingPoint, STATES.START)
    }

    generateEndingPoint = () => {
        if(this.props.columns > COLUMNS_CONSTRAINT || this.props.rows > ROWS_CONSTRAINT) return
        const x = Math.floor(this.props.columns*.8)
        const y = Math.floor(this.props.rows/2)
        this.endingPoint = this.coordsToIndex({x, y})
        this.toggleGridAtIndex(this.endingPoint, STATES.END)
    }

    toggleGridAtIndex(index, value){
        const coords = this.indexToCoords(index)
        this.nodes[index].toggle(value)
        if(this.grid[coords[1]][coords[0]] === parseInt(value)){
            this.grid[coords[1]][coords[0]] = STATES.WALKABLE
        }else{
            this.grid[coords[1]][coords[0]] = parseInt(value)
        }
    }

    setGridAtIndex(index, value){
        const coords = this.indexToCoords(index)
        this.grid[coords[1]][coords[0]] = value
    }

    showPath = async path => {
        for(let point of path){
            this.grid[point[1]][point[0]] = 4
            this.nodes[this.coordsToIndex({x:point[0], y:point[1]})].set(STATES.PATH)
            await sleep(1/SettingsProvider.settings.framerate.value*1000)
        }
    }

    handleClick = (index) => {
        if(this.mode === STATES.START){
            if(this.startingPoint){
                this.toggleGridAtIndex(this.startingPoint, STATES.START)
            }
            this.startingPoint = index
        } else if(this.mode === STATES.END){
            if(this.endingPoint){
                this.toggleGridAtIndex(this.endingPoint, STATES.END)
            }
            this.endingPoint = index
        }
        this.toggleGridAtIndex(index, this.mode)
    }

    componentDidUpdate(){
        this.generateStartingPoint()
        this.generateEndingPoint()
    }

    componentDidMount(){
        SettingsProvider.addEventListener("gridSetterStateChange", ({detail}) => this.mode = parseInt(detail))
        SettingsProvider.addEventListener("nodeSizeChange", () => this.forceUpdate())
        SettingsProvider.addEventListener("clearGrid", this.clearGrid)

        this.generateStartingPoint()
        this.generateEndingPoint()
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
