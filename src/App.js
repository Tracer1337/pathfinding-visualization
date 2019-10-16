import React from "react"

import Grid from "./components/Grid.js"
import {NODE_SIZE, GRID_PADDING} from "./config/constants.js"

const App = () => {
    return(
        <Grid
            rows={Math.floor((window.innerHeight - GRID_PADDING * 2) / NODE_SIZE)}
            columns={Math.floor((window.innerWidth - GRID_PADDING * 2) / NODE_SIZE)}
        />
    )
}

export default App
