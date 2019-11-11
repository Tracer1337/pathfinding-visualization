import React from "react"

import Grid from "../../../utils/Grid.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import Renderer from "./Renderer.js"
import THREEGrid from "./Grid.js"
import InputHandler from "./InputHandler.js"

let THREE
export {THREE}

/*
* https://aerotwist.com/tutorials/getting-started-with-three-js/
*/
export default class THREEAdapter extends Grid{
    componentDidMount(){
        import("three").then(module => {
            THREE = module
            const width = this.props.columns*SettingsProvider.settings.nodeSize.value
            const height = this.props.rows*SettingsProvider.settings.nodeSize.value

            // Create renderer
            this.renderer = new Renderer(this.sceneContainer, {width, height})
            this.renderer.init(this.grid)

            // Create grid
            this.THREEGrid = new THREEGrid(this.props.columns, this.props.rows)
            this.THREEGrid.render(this.renderer)

            this.nodes = this.THREEGrid.getNodes()

            // Create InputHandler
            this.inputHandler = new InputHandler(this.renderer)
            this.inputHandler.addEventListener("click", index => {
                this.renderer.disableControls()
                this.handleClick(index)
            })
            this.inputHandler.addEventListener("mouseup", this.renderer.enableControls)

            this.renderer.setInputHandler(this.inputHandler)

            this.init()
            this.renderer.animate()
        })
    }

    render(){
        this.createNewGrid()
        return(
            <div className="scene-container" ref={ref => this.sceneContainer = ref}/>
        )
    }
}
