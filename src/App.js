import React from "react"

import {NODE_SIZE, STATES, GRID_PADDING} from "./config/constants.js"
import Grid from "./components/Grid.js"
import Settings from "./components/Settings.js"
import SettingsProvider from "./utils/SettingsProvider.js"
import algorithms from "./algorithms/AlgorithmProvider.js"

export default class App extends React.Component{
    state = {
        columns: Math.floor((window.innerWidth - GRID_PADDING * 2) / NODE_SIZE),
        rows: Math.floor((window.innerHeight - GRID_PADDING * 2) / NODE_SIZE)
    }

    grid = React.createRef()

    indexToCoords = index => [index%this.state.columns, Math.floor(index/this.state.columns)]
    coordsToIndex = ({x,y}) => y*this.state.columns+x

    handleNextIteration = ({detail}) => {
        const {newOpenListNodes, newClosedListNode} = detail

        // Show currentNode
        // if(detail.currentNode){
        //     const currentNodeIndex = this.coordsToIndex(detail.currentNode)
        //     this.grid.current.nodes[currentNodeIndex].set("CURRENT")
        // }

        // Show new openlist nodes
        if(newOpenListNodes){
            for(let openNode of newOpenListNodes){
                const openNodeIndex = this.coordsToIndex(openNode)
                this.grid.current.nodes[openNodeIndex].set(STATES.OPEN)
            }
        }

        // Show new closed list node
        if(newClosedListNode){
            const closedNodeIndex = this.coordsToIndex(newClosedListNode)
            this.grid.current.nodes[closedNodeIndex].set(STATES.CLOSED)
        }
    }

    calculatePath = () => {
        const grid = this.grid.current.grid
        const startingPoint = this.indexToCoords(this.grid.current.startingPoint)
        const endingPoint = this.indexToCoords(this.grid.current.endingPoint)

        let pathFinder = new algorithms[SettingsProvider.settings.algorithm.value](startingPoint, endingPoint, grid)

        if(pathFinder.setHeuristic)
            pathFinder.setHeuristic(SettingsProvider.settings.heuristic.value)
        pathFinder.setDirections(SettingsProvider.settings.directions.value)
        pathFinder.setFramerate(50)
        pathFinder.addEventListener("nextIteration", this.handleNextIteration)

        pathFinder.findPath().then(path => {
            pathFinder.removeEventListener("nextIteration", this.handleNextIteration)
            if(path){
                // Show final path
                this.grid.current.showPath(path)
            }else{
                // No path found
                alert("There is no path")
            }
        })
    }

    componentDidMount(){
        SettingsProvider.addEventListener("searchPath", this.calculatePath)
    }

    render(){
        return(
            <div className="app">
                <Settings/>
                <Grid
                    columns={this.state.columns}
                    rows={this.state.rows}
                    ref={this.grid}
                />
            </div>
        )
    }
}
