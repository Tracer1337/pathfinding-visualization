import React from "react"

import Node from "./Node.js"
import {STATES, DEBUG_MODE, ROWS_CONSTRAINT, COLUMNS_CONSTRAINT} from "../config/constants.js"
import SettingsProvider from "../utils/SettingsProvider.js"
import sleep from "../utils/sleep.js"

export default class Grid extends React.Component{
    static draggableStates = [STATES.WALKABLE, STATES.BLOCKED]
    static protectedStates = [STATES.START, STATES.END]

    constructor(props){
        super(props)
        this.createNewGrid()
        this.setterState = STATES.BLOCKED
        this.nodes = []
        this.isMouseDown = false
        this.firstSetterState = null
        this.isMovingPoint = false
        this.isSettingPoints = false
        this.isPathAvailable = false
    }

    /*
    * Convert index of node to coordinates on the grid
    */
    indexToCoords = index => [index%this.props.columns, Math.floor(index/this.props.columns)]

    /*
    * Convert coordinates on the grid to index of node
    */
    coordsToIndex = ({x,y}) => y*this.props.columns+x

    /*
    * Create a new grid with all nodes set to walkable
    */
    createNewGrid = () => {
        if(this.nodes)
            this.nodes.forEach(node => node && node.reset())
        this.isPathAvailable = false
        const rows = Math.min(this.props.rows, ROWS_CONSTRAINT)
        const columns = Math.min(this.props.columns, COLUMNS_CONSTRAINT)
        this.grid = Array(rows).fill(0).map(() => Array(columns).fill(STATES.WALKABLE))
    }

    /*
    * Set all nodes to walkable and remove the start & end point
    */
    clearGrid = () => {
        if(this.nodes){
            this.nodes.forEach(node => node && !Grid.protectedStates.includes(node.state.state) && node.reset())
            this.grid = this.grid.map(column => column.map(cell => !Grid.protectedStates.includes(cell) ? cell = STATES.WALKABLE : cell))
            this.isPathAvailable = false
        }
    }

    /*
    * Reset all nodes which were modified during the pathfinding
    */
    clearPath = () => {
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

    /*
    * Reset isPathAvailable => New path should be animated
    */
    initNewPath = () => {
        this.isPathAvailable = false
        this.clearPath()
    }

    /*
    * Set the starting point to be at y: middle and x: 20%
    */
    generateStartingPoint = () => {
        if(this.props.columns > COLUMNS_CONSTRAINT || this.props.rows > ROWS_CONSTRAINT) return
        const x = Math.floor(this.props.columns*.2)
        const y = Math.floor(this.props.rows/2)
        this.startingPoint = this.coordsToIndex({x, y})
        this.toggleGridAtIndex(this.startingPoint, STATES.START)
    }

    /*
    * Set the ending point to be at y: middle and x: 80%
    */
    generateEndingPoint = () => {
        if(this.props.columns > COLUMNS_CONSTRAINT || this.props.rows > ROWS_CONSTRAINT) return
        const x = Math.floor(this.props.columns*.8)
        const y = Math.floor(this.props.rows/2)
        this.endingPoint = this.coordsToIndex({x, y})
        this.toggleGridAtIndex(this.endingPoint, STATES.END)
    }

    /*
    * Set the node at index to the given state if it's not already, otherwise
    * set it to walkable
    */
    toggleGridAtIndex(index, value){
        const coords = this.indexToCoords(index)
        this.nodes[index].toggle(value)
        if(this.grid[coords[1]][coords[0]] === parseInt(value)){
            this.grid[coords[1]][coords[0]] = STATES.WALKABLE
        }else{
            this.grid[coords[1]][coords[0]] = parseInt(value)
        }
    }

    /*
    * Set the grid at index to the given state
    */
    setGridAtIndex(index, value){
        const coords = this.indexToCoords(index)
        this.grid[coords[1]][coords[0]] = value
        this.nodes[index].set(value)
    }

    /*
    * Force the grid at index to apply state
    */
    forceGridAtIndex(index, state){
        const coords = this.indexToCoords(index)
        this.grid[coords[1]][coords[0]] = state
        this.nodes[index].force(state)
    }

    /*
    * Animate the provided path
    */
    showPath = async path => {
        for(let point of path){
            if(Grid.protectedStates.includes(this.grid[point[1]][point[0]])) continue
            this.grid[point[1]][point[0]] = 4
            this.nodes[this.coordsToIndex({x:point[0], y:point[1]})].set(STATES.PATH)
            // If there is already an path, show the new one instantly
            if(!this.isPathAvailable){
                await sleep(1/SettingsProvider.settings.framerate.value*1000)
            }
        }
        this.isPathAvailable = true
    }

    /*
    * Handle click / mouseenter event from nodes
    * Move the starting / ending node or set walls etc.
    */
    handleClick = (index, isMouseEnter = false) => {
        const set = (index, state) => {
            if(!isMouseEnter){
                this.toggleGridAtIndex(index, state)
            }else if(Grid.draggableStates.includes(state) && !Grid.protectedStates.includes(gridState)){
                if(this.firstSetterState === null){
                    this.firstSetterState = this.nodes[index].state.state !== STATES.BLOCKED
                }
                if(this.firstSetterState){
                    this.setGridAtIndex(index, state)
                }else{
                    this.setGridAtIndex(index, STATES.WALKABLE)
                }
            }
        }

        const move = (fromIndex, toIndex, state) => {
            if(fromIndex === toIndex) return
            this.forceGridAtIndex(fromIndex, STATES.WALKABLE)
            this.forceGridAtIndex(toIndex, state)
        }

        const coords = this.indexToCoords(index)
        const gridState = this.grid[coords[1]][coords[0]]
        if(!this.isSettingPoints){
            if(gridState === STATES.START || gridState === STATES.END || this.isMovingPoint){
                if(!this.isMovingPoint){
                    this.isMovingPoint = true
                    this.movingState = gridState
                    this.lastIndex = index
                }

                // Only move node if it won't override an other important node
                if(
                    this.lastIndex &&
                    !Grid.protectedStates.includes(gridState) &&
                    !(this.isPathAvailable && gridState === STATES.BLOCKED)
                ){
                    if(this.movingState === STATES.START) this.startingPoint = index
                    else if(this.movingState === STATES.END) this.endingPoint = index

                    /*
                    * Change the path, when the user moves the start / end node
                    * and there is already a path
                    */
                    if(this.isPathAvailable){
                        this.props.onRequestPath()
                    }
                    move(this.lastIndex, index, this.movingState)
                    this.lastIndex = index
                }
            }
        }

        if(!this.isMovingPoint){
            this.isSettingPoints = true
            set(index, this.setterState)
        }
    }

    /*
    * Treat the mouseenter event from node as an click event
    */
    handleMouseEnter = index => {
        if(this.isMouseDown){
            this.handleClick(index, true)
        }
    }

    componentDidUpdate(){
        this.generateStartingPoint()
        this.generateEndingPoint()
    }

    componentDidMount(){
        document.addEventListener("mousedown", () => this.isMouseDown = true, true)
        document.addEventListener("mouseup", () => {
            this.firstSetterState = null
            this.movingState = null
            this.lastIndex = null
            this.isMouseDown = false
            this.isMovingPoint = false
            this.isSettingPoints = false
        })

        SettingsProvider.addEventListener("nodeSizeChange", () => this.forceUpdate())
        SettingsProvider.addEventListener("clearGrid", this.clearGrid)

        this.generateStartingPoint()
        this.generateEndingPoint()
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
