import React from "react"

import Node from "./Node.js"
import {NODE_SIZE, STATES} from "../config/constants.js"
import AStar from "../algorithms/a-star.js"

export default class Grid extends React.Component{
    state = {grid: Array(this.props.rows).fill(0).map(() => Array(this.props.columns).fill(0))}
    mode = STATES.BLOCKED
    nodes = []

    indexToCoords(index){
        return [Math.floor(index/this.props.columns), index%this.props.columns]
    }

    coordsToIndex({x,y}){
        return x*this.props.columns+y
    }

    setGridAtIndex(index, value){
        const newGrid = this.state.grid
        const coords = this.indexToCoords(index)
        newGrid[coords[0]][coords[1]] = value
        this.setState({grid: newGrid})
    }

    handleNextIteration =  ({detail}) => {
        const {currentNode, newOpenListNodes, newClosedListNode} = detail

        // Show currentNode
        const currentNodeIndex = this.coordsToIndex(currentNode)
        this.nodes[currentNodeIndex].set("CURRENT")
        this.lastCurrentNode = this.nodes[currentNodeIndex]

        // Show new openlist nodes
        for(let openNode of newOpenListNodes){
            const openNodeIndex = this.coordsToIndex(openNode)
            // // Exclude the current node
            // if(openNodeIndex === currentNodeIndex)
            //     continue
            this.nodes[openNodeIndex].set("OPEN")
        }

        // Show new closed list node
        if(newClosedListNode){
            const closedNodeIndex = this.coordsToIndex(newClosedListNode)
            this.nodes[closedNodeIndex].set("CLOSED")
        }
    }

    calculatePath = () => {
        const newGrid = this.state.grid
        const pathFinder = new AStar(this.indexToCoords(this.startingPoint), this.indexToCoords(this.endingPoint), this.state.grid)

        pathFinder.setFrameRate(5)
        pathFinder.setHeuristic(2)
        pathFinder.addEventListener("nextIteration", this.handleNextIteration)

        const path = pathFinder.findPath().then(path => {
            pathFinder.removeEventListener("nextIteration", this.handleNextIteration)
            if(path){
                // Show final path
                for(let point of path){
                    newGrid[point[0]][point[1]] = 4
                    this.nodes[this.coordsToIndex({x:point[0], y:point[1]})].set("PATH")
                }
                this.setState({grid: newGrid})
            }else{
                alert("There is no path")
            }
        })
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

    render(){
        return(
            <div className="grid" style={{width: this.props.columns*NODE_SIZE}} ref={ref => this.grid = ref}>
                {this.state.grid.flat().map((state, i) => (
                    <Node
                        state={state}
                        key={i}
                        onClick={() => this.handleClick(i)}
                        ref={ref => this.nodes[i] = ref}
                    />
                ))}
            </div>
        )
    }
}
