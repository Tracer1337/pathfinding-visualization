import React from "react"

import Grid from "../../../utils/Grid.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import Renderer from "./Renderer.js"
import Node from "./Node.js"

let THREE
export {THREE}

/*
* https://aerotwist.com/tutorials/getting-started-with-three-js/
*/
export default class THREEAdapter extends Grid{
    nodes = []

    componentDidMount(){
        import("three").then(module => {
            THREE = module
            const width = this.props.columns*SettingsProvider.settings.nodeSize.value
            const height = this.props.rows*SettingsProvider.settings.nodeSize.value
            this.renderer = new Renderer(this.sceneContainer, {width, height})
            this.renderer.init(this.grid)

            // Create the grid
            const columns = this.props.columns
            this.grid.forEach((column, y) => column.forEach((cell, x) => {
                const node = new Node(x,y)
                this.nodes[y*columns+x] = node
                this.renderer.add(node.getMesh())
            }))

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
