import React from "react"
import * as PIXI from "pixi.js"

import Grid from "../../Grid.js"
import GridRenderer from "./Grid.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import {BACKGROUNDS} from "../../../config/constants.js"

export default class PixiAdapter extends Grid{
    currentTouchingNodeIndex = -1
    dragStartIndex = -1

    renderGrid = () => {
        this.gridRenderer = new GridRenderer(this.props.columns, this.props.rows, this.app)
        this.nodes = this.gridRenderer.getNodes()
        this.nodes.forEach(node => {
            node.addEventListener("mouseover", this.handleMouseOver)
            node.addEventListener("mousedown", event => {
                this.dragStartIndex = event.detail
                this.handleMouseDown(event)
            })
            this.app.stage.addChild(node.getSprite())
        })
    }

    setup(){
        const width = this.props.columns * SettingsProvider.settings.nodeSize.value
        const height = this.props.rows * SettingsProvider.settings.nodeSize.value

        this.app = new PIXI.Application({
            width,
            height,
            antialias: true
        })
        this.app.renderer.backgroundColor = 0xFFFFFF

        this.renderGrid()

        // Add -drag for setting walls- support for touch devices
        this.sceneContainer.addEventListener("touchmove", event => {
            const {clientX, clientY} = event.touches[0]
            const sceneContainerRect = this.sceneContainer.getBoundingClientRect()

            // Calculate index of touched node
            const x = Math.floor((clientX - sceneContainerRect.x) / SettingsProvider.settings.nodeSize.value)
            const y = Math.floor((clientY - sceneContainerRect.y) / SettingsProvider.settings.nodeSize.value)
            const index = this.coordsToIndex({x,y})

            // Only trigger handleMouseOver when the touch enters the node
            if(this.currentTouchingNodeIndex !== index && index !== this.dragStartIndex){
                this.handleMouseOver({detail: index})
                this.currentTouchingNodeIndex = index
            }
        })

        this.sceneContainer.appendChild(this.app.view)
        this.init()
    }

    handleMouseOver = ({detail}) => this.handleMouseEnter(detail)

    handleMouseDown = ({detail}) => this.handleClick(detail)

    componentDidMount(){
        for(let key in BACKGROUNDS){
            const background = BACKGROUNDS[key]
            if(background[0] === "Image" && !PIXI.Loader.shared.resources[background[2]]){
                PIXI.Loader.shared.add(background[2])
            }
        }
        PIXI.Loader.shared.load(this.setup.bind(this))
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
