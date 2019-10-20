import React from "react"

import {NODE_SIZE, GRID_PADDING} from "./config/constants.js"
import Grid from "./components/Grid.js"
import Settings from "./components/Settings.js"
import SettingsHandler from "./utils/SettingsHandler.js"

import AStar from "./algorithms/AStar/AStar.js"
import Dijkstra from "./algorithms/Dijkstra/Dijkstra.js"

export default class App extends React.Component{
    state = {
        columns: Math.floor((window.innerWidth - GRID_PADDING * 2) / NODE_SIZE),
        rows: Math.floor((window.innerHeight - GRID_PADDING * 2) / NODE_SIZE)
    }

    grid = React.createRef()

    coordsToIndex({x,y}){
        return y*this.state.columns+x
    }

    indexToCoords(index){
        return [index%this.state.columns, Math.floor(index/this.state.columns)]
    }

    handleNextIteration = ({detail}) => {
        const {newOpenListNodes, newClosedListNode} = detail

        // Show currentNode
        // const currentNodeIndex = this.coordsToIndex(detail.currentNode)
        // this.nodes[currentNodeIndex].set("CURRENT")
        // this.lastCurrentNode = this.nodes[currentNodeIndex]

        // Show new openlist nodes
        for(let openNode of newOpenListNodes){
            const openNodeIndex = this.coordsToIndex(openNode)
            this.grid.current.nodes[openNodeIndex].set("OPEN")
        }

        // Show new closed list node
        if(newClosedListNode){
            const closedNodeIndex = this.coordsToIndex(newClosedListNode)
            this.grid.current.nodes[closedNodeIndex].set("CLOSED")
        }
    }

    calculatePath = () => {
        const grid = this.grid.current.getGrid()
        const startingPoint = this.indexToCoords(this.grid.current.startingPoint)
        const endingPoint = this.indexToCoords(this.grid.current.endingPoint)

        let pathFinder
        switch(parseInt(SettingsHandler.settings.algorithm.value)){
            case 0:
                pathFinder = new AStar(startingPoint, endingPoint, grid)
                pathFinder.setHeuristic(2)
                break

            case 1:
                pathFinder = new Dijkstra(startingPoint, grid)
                break

            default:
                console.error("[App] Missing algorithm-id")
                break
        }

        pathFinder.setDirections(1)
        pathFinder.setFramerate(50)
        pathFinder.addEventListener("nextIteration", this.handleNextIteration)

        pathFinder.findPath().then(path => {
            pathFinder.removeEventListener("nextIteration", this.handleNextIteration)
            if(path){
                // Show final path
                for(let point of path){
                    grid[point[1]][point[0]] = 4
                    this.grid.current.nodes[this.coordsToIndex({x:point[0], y:point[1]})].set("PATH")
                }
                this.grid.current.setGrid(grid)
            }else{
                // No path found
                alert("There is no path")
            }
        })
    }

    componentDidMount(){
        SettingsHandler.addEventListener("searchPath", this.calculatePath)
    }

    render(){
        return(
            <div className="app">
                <Settings
                    grid={this.grid}
                    setWall={() => this.grid.current.setWall()}
                    setStart={() => this.grid.current.setStart()}
                    setEnd={() => this.grid.current.setEnd()}
                    calculatePath={this.calculatePath}
                    onAlgorithmChange={e => this.setState({algorithm: e.target.value})}
                />
                <Grid
                    columns={this.state.columns}
                    rows={this.state.rows}
                    ref={this.grid}
                />
            </div>
        )
    }
}
