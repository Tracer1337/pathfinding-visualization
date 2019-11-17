import React from "react"
import * as PIXI from "pixi.js"

import Grid from "../../Grid.js"
import GridRenderer from "./Grid.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"

export default class PixiAdapter extends Grid{
    componentDidMount(){
        const width = this.props.columns * SettingsProvider.settings.nodeSize.value
        const height = this.props.rows * SettingsProvider.settings.nodeSize.value

        this.app = new PIXI.Application({
            width,
            height,
            antialias: true
        })
        this.app.renderer.backgroundColor = 0xFFFFFF

        this.gridRenderer = new GridRenderer(this.props.columns, this.props.rows)
        this.nodes = this.gridRenderer.getNodes()
        this.nodes.forEach(node => {
            node.addEventListener("mouseover", () => this.handleMouseEnter(node.index))
            node.addEventListener("mousedown", () => this.handleClick(node.index))
            this.app.stage.addChild(node.graphics)
        })

        this.sceneContainer.appendChild(this.app.view)
        this.init()
    }

    componentWillUnmount(){
        this.app.destroy({children: true, texture: true, baseTexture: true})
    }

    render(){
        this.createNewGrid()
        return (
            <div className="scene-container" ref={ref => this.sceneContainer = ref}/>
        )
    }
}
