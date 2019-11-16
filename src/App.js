import React from "react"

import {STATES} from "./config/constants.js"
import Sidebar from "./components/Sidebar.js"
import Settings from "./components/Settings.js"
import SettingsProvider from "./utils/SettingsProvider.js"
import ScreenSizeTracker from "./utils/ScreenSizeTracker.js"
import sleep from "./utils/sleep.js"
import algorithms from "./algorithms"
import Grid from "./components/Grid.js"
import GridAdapters from "./components/GridAdapters"
import Alert from "./components/Alert.js"

export default class App extends React.Component{
    state = {isSmall: ScreenSizeTracker.isSmall}
    grid = React.createRef()

    resetNodeSize = () => this.setState({
        columns: Math.floor(this.gridWrapper.clientWidth / SettingsProvider.settings.nodeSize.value),
        rows: Math.floor(this.gridWrapper.clientHeight / SettingsProvider.settings.nodeSize.value)
    })

    indexToCoords = index => [index%this.state.columns, Math.floor(index/this.state.columns)]
    coordsToIndex = ({x,y}) => y*this.state.columns+x

    calculatePath = (instant = false) => {
        if(instant) this.grid.current.clearPath()
        else {
            this.grid.current.initNewPath()
            SettingsProvider.hide("searchPath")
            SettingsProvider.show("pauseSearch")
        }

        const grid = this.grid.current.grid
        const startingPoint = this.indexToCoords(this.grid.current.startingPoint)
        const endingPoint = this.indexToCoords(this.grid.current.endingPoint)

        let pathFinder = new algorithms[SettingsProvider.settings.algorithm.value](startingPoint, endingPoint, grid, instant)

        if(pathFinder.setHeuristic)
            pathFinder.setHeuristic(SettingsProvider.settings.heuristic.value)
        pathFinder.setDirections(SettingsProvider.settings.directions.value)
        const iterations = []
        const handleNextIteration = ({detail}) => iterations.push(detail)
        pathFinder.addEventListener("nextIteration", handleNextIteration)

        pathFinder.findPath().then(async path => {
            pathFinder.removeEventListener("nextIteration", handleNextIteration)
            for(let iteration of iterations){
                this.handleNextIteration(iteration)
                await sleep(1/SettingsProvider.settings.framerate.value*1000)
            }

            SettingsProvider.show("searchPath")
            SettingsProvider.hide("pauseSearch")
            if(path){
                // Show final path
                this.grid.current.showPath(path)
            }else{
                // No path found
                this.alert.error("No path found")
            }
        })
    }

    handlePauseSearch = () => {
        SettingsProvider.hide("pauseSearch")
        SettingsProvider.show("continueSearch")
    }

    handleContinueSearch = () => {
        SettingsProvider.hide("continueSearch")
        SettingsProvider.show("pauseSearch")
    }

    handleRequestPath = () => {
        this.calculatePath(true)
    }

    handleNextIteration = ({newOpenListNodes, newClosedListNode}) => {
        // Show new openlist nodes
        if(newOpenListNodes){
            for(let openNode of newOpenListNodes){
                if(Grid.protectedStates.includes(this.grid.current.grid[openNode.y][openNode.x])) continue
                const openNodeIndex = this.coordsToIndex(openNode)
                this.grid.current.setGridAtIndex(openNodeIndex, STATES.OPEN)
            }
        }

        // Show new closed list node
        if(newClosedListNode && !Grid.protectedStates.includes(this.grid.current.grid[newClosedListNode.y][newClosedListNode.x])){
            const closedNodeIndex = this.coordsToIndex(newClosedListNode)
            this.grid.current.setGridAtIndex(closedNodeIndex, STATES.CLOSED)
        }
    }

    componentDidMount(){
        this.resetNodeSize()
        SettingsProvider.addEventListener("nodeSizeChange", this.resetNodeSize)
        SettingsProvider.addEventListener("searchPath", () => this.calculatePath())
        SettingsProvider.addEventListener("pauseSearch", this.handlePauseSearch)
        SettingsProvider.addEventListener("continueSearch", this.handleContinueSearch)
        SettingsProvider.addEventListener("visualizationChange", () => this.forceUpdate())
        ScreenSizeTracker.addEventListener("onBoundaryPass", ({detail}) => this.setState({isSmall: detail.isSmall}))
    }

    render(){
        return(
            <div className="app" style={{display: this.state.isSmall ? "block" : ""}}>
                <Sidebar>
                    <Settings/>
                </Sidebar>
                <Alert ref={ref => this.alert = ref}/>
                <main className="stage">
                    <div className="grid-wrapper" ref={ref => this.gridWrapper = ref}>
                        {this.state.columns && this.state.rows ? React.createElement(GridAdapters[SettingsProvider.settings.visualization.value],{
                            columns: this.state.columns,
                            rows: this.state.rows,
                            ref: this.grid,
                            onRequestPath: this.handleRequestPath
                        }) : null}
                    </div>
                </main>
            </div>
        )
    }
}
