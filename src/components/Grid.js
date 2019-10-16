import React, {useState, useEffect} from "react"

import Node from "./Node.js"
import {NODE_SIZE} from "../config/constants.js"

export default class Grid extends React.Component{
    state = {grid: Array(this.props.rows).fill(0).map(() => Array(this.props.columns).fill(0))}
    isMouseDown = false

    handleMouseEnter = (index, isMouseDown = this.isMouseDown) => {
        if(isMouseDown){
            const newGrid = this.state.grid
            newGrid[Math.floor(index/this.props.columns)][index%this.props.columns] = 1
            this.setState({grid: newGrid})
        }
    }

    componentDidMount(){
        this.grid.addEventListener("mousedown", () => this.isMouseDown = true)
        this.grid.addEventListener("mouseup", () => this.isMouseDown = false)
    }

    componentDidUpdate(){
        console.log("[Grid]", this.state.grid)
    }

    render(){
        return(
            <div className="grid" style={{width: this.props.columns*NODE_SIZE}} ref={ref => this.grid = ref}>
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
