import React, {useState, useEffect} from "react"

import Node from "./Node.js"
import {NODE_SIZE} from "../config/constants.js"
import AStar from "../algorithms/a-star.js"

export default class Grid extends React.Component{
    state = {grid: Array(this.props.rows).fill(0).map(() => Array(this.props.columns).fill(0))}
    isMouseDown = false

    indexToCoords(index){
        return [Math.floor(index/this.props.columns), index%this.props.columns]
    }

    setGridAtIndex(index, value){
        const newGrid = this.state.grid
        const coords = this.indexToCoords(index)
        newGrid[coords[0]][coords[1]] = value
        this.setState({grid: newGrid})
    }

    handleMouseEnter = (index, isMouseDown = this.isMouseDown) => {
        if(isMouseDown){
            this.setGridAtIndex(index, 1)
        }
    }

    componentDidMount(){
        this.grid.addEventListener("mousedown", () => this.isMouseDown = true)
        this.grid.addEventListener("mouseup", () => this.isMouseDown = false)

        this.startingPoint = Math.floor(Math.random()*this.props.columns*this.props.rows)
        this.endingPoint = Math.floor(Math.random()*this.props.columns*this.props.rows)

        this.setGridAtIndex(this.startingPoint, 2)
        this.setGridAtIndex(this.endingPoint, 3)
    }

    calculatePath = () => {
        const newGrid = this.state.grid
        const path = new AStar(this.indexToCoords(this.startingPoint), this.indexToCoords(this.endingPoint), this.state.grid).findPath()
        for(let point of path){
            newGrid[point[0]][point[1]] = 4
        }
        this.setState({grid: newGrid})
    }

    render(){
        return(
            <div className="grid" style={{width: this.props.columns*NODE_SIZE}} ref={ref => this.grid = ref}>
                <button style={{position: "absolute", width: 50, top: 0}}onClick={this.calculatePath}>Calc Path</button>
                {this.state.grid.flat().map((state, i) => (
                    <Node
                        state={state}
                        key={i}
                        onMouseEnter={() => this.handleMouseEnter(i)}
                        onMouseDown={() => this.handleMouseEnter(i, true)}
                    />
                ))}
            </div>
        )
    }
}
