import * as PIXI from "pixi.js"

import {STATES, BACKGROUNDS} from "../../../config/constants.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import Emitter from "../../../utils/Emitter.js"

export default class Node extends Emitter{
    constructor(x, y, index, renderer){
        super()
        const size = SettingsProvider.settings.nodeSize.value

        this.state = STATES.WALKABLE
        this.hasBasicTexture = true

        this.x = x * size
        this.y = y * size
        this.index = index

        this.renderer = renderer

        this.createSprite()
    }

    createTexture = () => {
        const size = SettingsProvider.settings.nodeSize.value
        this.graphics = new PIXI.Graphics()
        this.graphics.beginFill(0xFFFFFF)
        this.graphics.lineStyle(1, PIXI.utils.string2hex(BACKGROUNDS[STATES.CLOSED][1]))
        this.graphics.drawRoundedRect(this.x, this.y, size, size, size*0.15)
        this.graphics.endFill()

        return this.renderer.generateTexture(this.graphics)
    }

    createSprite = () => {
        const size = SettingsProvider.settings.nodeSize.value
        this.sprite = new PIXI.Sprite(this.createTexture())
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.sprite.width = size
        this.sprite.height = size

        this.sprite.interactive = true
        this.sprite.on("mouseover", () => this.dispatchEvent(new CustomEvent("mouseover", {detail: this.index})))
        this.sprite.on("mousedown", () => this.dispatchEvent(new CustomEvent("mousedown", {detail: this.index})))
    }

    getSprite = () => this.sprite

    setState = state => {
        this.state = state
        this.sprite.tint = PIXI.utils.string2hex(BACKGROUNDS[state][1])

        // Add / Remove image from sprite if it should have / has one
        if(BACKGROUNDS[this.state][0] === "Image"){
            this.sprite.texture = PIXI.Texture.from(BACKGROUNDS[this.state][2])
            this.hasBasicTexture = false
        }else if(!this.hasBasicTexture){
            this.sprite.texture = this.createTexture()
            this.hasBasicTexture = true
        }

        if(this.state === STATES.START || this.state === STATES.END){
            this.sprite.buttonMode = true
        }else if(this.sprite.buttonMode){
            this.sprite.buttonMode = false
        }
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
