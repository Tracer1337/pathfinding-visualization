import React from "react"

import {STATES} from "./config/constants.js"
import Sidebar from "./components/Sidebar.js"
import Grid from "./components/Grid.js"
import Settings from "./components/Settings.js"
import SettingsProvider from "./utils/SettingsProvider.js"
import ScreenSizeTracker from "./utils/ScreenSizeTracker.js"
import algorithms from "./algorithms/AlgorithmProvider.js"

export default class App extends React.Component{
    state = {isSmall: ScreenSizeTracker.isSmall}
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
                this.grid.current.setGridAtIndex(openNodeIndex, STATES.OPEN)
            }
        }

        // Show new closed list node
        if(newClosedListNode){
            const closedNodeIndex = this.coordsToIndex(newClosedListNode)
            this.grid.current.nodes[closedNodeIndex].set(STATES.CLOSED)
            this.grid.current.setGridAtIndex(closedNodeIndex, STATES.CLOSED)
        }
    }

    calculatePath = () => {
        this.grid.current.initNewPath()

        const grid = this.grid.current.grid
        const startingPoint = this.indexToCoords(this.grid.current.startingPoint)
        const endingPoint = this.indexToCoords(this.grid.current.endingPoint)

        let pathFinder = new algorithms[SettingsProvider.settings.algorithm.value](startingPoint, endingPoint, grid)

        if(pathFinder.setHeuristic)
            pathFinder.setHeuristic(SettingsProvider.settings.heuristic.value)
        pathFinder.setDirections(SettingsProvider.settings.directions.value)
        pathFinder.setFramerate(SettingsProvider.settings.framerate.value)
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
        this.setState({
            columns: Math.floor(this.gridWrapper.clientWidth / SettingsProvider.settings.nodeSize.value),
            rows: Math.floor(this.gridWrapper.clientHeight / SettingsProvider.settings.nodeSize.value)
        })
        SettingsProvider.addEventListener("nodeSizeChange", () => this.setState({
            columns: Math.floor(this.gridWrapper.clientWidth / SettingsProvider.settings.nodeSize.value),
            rows: Math.floor(this.gridWrapper.clientHeight / SettingsProvider.settings.nodeSize.value)
        }))
        SettingsProvider.addEventListener("searchPath", this.calculatePath)
        ScreenSizeTracker.addEventListener("onBoundaryPass", ({detail}) => this.setState({isSmall: detail.isSmall}))
    }

    render(){
        return(
            <div className="app" style={{display: this.state.isSmall ? "block" : ""}}>
                <Sidebar>
                    <Settings/>
                </Sidebar>
                <main className="stage">
                    <div className="grid-wrapper" ref={ref => this.gridWrapper = ref}>
                        {this.state.columns && this.state.rows ? <Grid
                            columns={this.state.columns}
                            rows={this.state.rows}
                            ref={this.grid}
                        /> : null}
                    </div>
                </main>
            </div>
        )
    }
}
