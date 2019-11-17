import * as PIXI from "pixi.js"

import {STATES, BACKGROUNDS} from "../../../config/constants.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import Emitter from "../../../utils/Emitter.js"

export default class Node extends Emitter{
    constructor(x, y, index){
        super()
        const size = SettingsProvider.settings.nodeSize.value
        this.state = STATES.WALKABLE

        this.x = x * size
        this.y = y * size
        this.index = index

        this.createGraphics()
    }

    createGraphics = () => {
        const size = SettingsProvider.settings.nodeSize.value
        this.graphics = new PIXI.Graphics()
        this.graphics.beginFill(0xFFFFFF)
        this.graphics.lineStyle(1, PIXI.utils.string2hex(BACKGROUNDS[STATES.CLOSED][1]))
        this.graphics.drawRoundedRect(this.x, this.y, size, size, size*0.15)
        this.graphics.endFill()

        this.graphics.interactive = true
        this.graphics.hitArea = new PIXI.RoundedRectangle(this.x, this.y, size, size, size*0.15)
        this.graphics.on("mouseover", () => this.dispatchEvent(new CustomEvent("mouseover")))
        this.graphics.on("mousedown", () => this.dispatchEvent(new CustomEvent("mousedown")))
    }

    setState = state => {
        this.state = state
        this.graphics.tint = PIXI.utils.string2hex(BACKGROUNDS[state][1])
    }

    set = state => {
        if(this.state !== STATES.START && this.state !== STATES.END){
            this.setState(state)
        }
    }

    toggle = state => {
        if(this.state === state){
            this.setState(STATES.WALKABLE)
        }else{
            this.setState(state)
        }
    }

    force = state => this.setState(state)

    reset = () => {
        if(this.state !== STATES.START && this.state !== STATES.END){
            this.setState(STATES.WALKABLE)
        }
    }

    getState = () => this.state
}
