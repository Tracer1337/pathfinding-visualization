import React from "react"

import Grid from "../../../utils/Grid.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import Renderer from "./Renderer.js"

/*
* https://aerotwist.com/tutorials/getting-started-with-three-js/
*/
export default class THREEAdapter extends Grid{
    componentDidMount(){
        import("three").then(module => {
            const width = this.props.columns*SettingsProvider.settings.nodeSize.value
            const height = this.props.rows*SettingsProvider.settings.nodeSize.value
            this.renderer = new Renderer(module, this.sceneContainer, {width, height})
            this.renderer.init()
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
