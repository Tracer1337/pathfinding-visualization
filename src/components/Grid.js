import React from "react"

import Node from "./Node.js"
import {NODE_SIZE, STATES} from "../config/constants.js"
import AStar from "../algorithms/a-star.js"

export default class Grid extends React.Component{
    state = {grid: Array(this.props.rows).fill(0).map(() => Array(this.props.columns).fill(0))}
    mode = STATES.BLOCKED

    indexToCoords(index){
        return [Math.floor(index/this.props.columns), index%this.props.columns]
    }

    setGridAtIndex(index, value){
        const newGrid = this.state.grid
        const coords = this.indexToCoords(index)
        newGrid[coords[0]][coords[1]] = value
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

    setWall = () => this.mode = STATES.BLOCKED
    setStart = () => this.mode = STATES.START
    setEnd = () => this.mode = STATES.END

    calculatePath = () => {
        const newGrid = this.state.grid
        const path = new AStar(this.indexToCoords(this.startingPoint), this.indexToCoords(this.endingPoint), this.state.grid).findPath()
        if(path){
            for(let point of path){
                newGrid[point[0]][point[1]] = 4
            }
            this.setState({grid: newGrid})
        }else{
            alert("There is no path")
        }
    }

    render(){
        return(
            <div className="grid" style={{width: this.props.columns*NODE_SIZE}} ref={ref => this.grid = ref}>
                {this.state.grid.flat().map((state, i) => (
                    <Node
                        state={state}
                        key={i}
                        onClick={() => this.handleClick(i)}
                    />
                ))}
            </div>
        )
    }
}
