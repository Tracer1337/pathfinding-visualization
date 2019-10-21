import React from "react"

import Node from "./Node.js"
import {NODE_SIZE, STATES} from "../config/constants.js"
import SettingsProvider from "../utils/SettingsProvider.js"

export default class Grid extends React.Component{
    state = {grid: Array(this.props.rows).fill(0).map(() => Array(this.props.columns).fill(STATES.WALKABLE))}
    mode = STATES.BLOCKED
    nodes = []

    getGrid = () => this.state.grid
    setGrid = grid => this.setState({grid})
    clearGrid = () => this.setState({grid: this.state.grid.map(column => column.map(cell => cell = STATES.WALKABLE))})

    indexToCoords(index){
        return [index%this.props.columns, Math.floor(index/this.props.columns)]
    }

    setGridAtIndex(index, value){
        const newGrid = this.state.grid
        const coords = this.indexToCoords(index)
        newGrid[coords[1]][coords[0]] = value
        this.setState({grid: newGrid})
    }

    handleClick = (index) => {
        this.setGridAtIndex(index, this.mode)
        if(this.mode === STATES.START){
            this.startingPoint = index
        } else if(this.mode === STATES.END){
            this.endingPoint = index
        }
    }

    componentDidMount(){
        SettingsProvider.addEventListener("gridSetterStateChange", ({detail}) => this.mode = parseInt(detail))
        SettingsProvider.addEventListener("clearGrid", this.clearGrid)
    }

    render(){
        return(
            <div className="grid" style={{width: this.props.columns*NODE_SIZE}} ref={ref => this.grid = ref}>
                {this.state.grid.flat().map((state, i) => (
                    <Node
                        state={state}
                        key={i}
                        onClick={() => this.handleClick(i)}
                        ref={ref => this.nodes[i] = ref}
                    >({this.indexToCoords(i).join("|")})</Node>
                ))}
            </div>
        )
    }
}
