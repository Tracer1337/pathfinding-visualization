import React from "react"

import Grid from "../../Grid.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import Renderer from "./Renderer.js"
import THREEGrid from "./Grid.js"
import InputHandler from "./InputHandler.js"
import Ground from "./Ground.js"

let THREE
export {THREE}

/*
* https://aerotwist.com/tutorials/getting-started-with-three-js/
*/
export default class THREEAdapter extends Grid{
    // Triggers whether or not the grid should be infected by mouse movements
    shouldTriggerGrid = false

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

            // Create the ground
            this.ground = new Ground()
            // this.renderer.add(this.ground.getMesh())

            // Create InputHandler and listen to events
            this.inputHandler = new InputHandler(this.renderer)
            this.inputHandler.addEventListener("click", index => {
                this.shouldTriggerGrid = true
                this.renderer.disableControls()
                this.handleClick(index)
            })
            this.inputHandler.addEventListener("mouseup", () => {
                this.renderer.enableControls()
                this.shouldTriggerGrid = false
            })
            this.inputHandler.addEventListener("mouseenter", index => {
                if(this.shouldTriggerGrid)
                    this.handleMouseEnter(index)
            })

            this.renderer.setInputHandler(this.inputHandler)

            this.init()
            this.renderer.animate()
        })
    }

    componentWillUnmount(){
        this.renderer.destroy()
    }

    render(){
        this.createNewGrid()
        return(
            <div className="scene-container" ref={ref => this.sceneContainer = ref}/>
        )
    }
}
