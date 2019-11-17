import React from "react"
import * as PIXI from "pixi.js"

import Grid from "../../Grid.js"
import GridRenderer from "./Grid.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"

export default class PixiAdapter extends Grid{
    renderGrid = () => {
        this.gridRenderer = new GridRenderer(this.props.columns, this.props.rows)
        this.nodes = this.gridRenderer.getNodes()
        this.nodes.forEach(node => {
            node.addEventListener("mouseover", this.handleMouseOver)
            node.addEventListener("mousedown", this.handleMouseDown)
            this.app.stage.addChild(node.graphics)
        })
    }

    handleMouseOver = ({detail}) => this.handleMouseEnter(detail)

    handleMouseDown = ({detail}) => this.handleClick(detail)

    componentDidMount(){
        const width = this.props.columns * SettingsProvider.settings.nodeSize.value
        const height = this.props.rows * SettingsProvider.settings.nodeSize.value

        this.app = new PIXI.Application({
            width,
            height,
            antialias: true
        })
        this.app.renderer.backgroundColor = 0xFFFFFF

        this.renderGrid()

        this.sceneContainer.appendChild(this.app.view)
        this.init()
    }

    componentWillUnmount(){
        this.sceneContainer.removeChild(this.app.view)
        this.app.stage.destroy(true)
        this.app.stage = null
        this.app.renderer.destroy(true)
        this.app.renderer = null
    }

    render(){
        this.createNewGrid()
        return (
            <div className="scene-container" ref={ref => this.sceneContainer = ref}/>
        )
    }
}
