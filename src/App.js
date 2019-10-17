import React, {useRef} from "react"

import Grid from "./components/Grid.js"
import {NODE_SIZE, GRID_PADDING} from "./config/constants.js"

const App = () => {
    const grid = useRef()

    return(
        <div className="app">
            <div className="controlls">
                <button onClick={() => grid.current.setWall()}>Set Wall</button>
                <button onClick={() => grid.current.setStart()}>Set Start</button>
                <button onClick={() => grid.current.setEnd()}>Set End</button>
                <button onClick={() => grid.current.calculatePath()}>Search Path</button>
            </div>
            <Grid
                rows={Math.floor((window.innerHeight - GRID_PADDING * 2) / NODE_SIZE)}
                columns={Math.floor((window.innerWidth - GRID_PADDING * 2) / NODE_SIZE)}
                ref={grid}
            />
        </div>
    )
}

export default App
