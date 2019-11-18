import * as PIXI from "pixi.js"

import {STATES, BACKGROUNDS, ANIMATION_OFFSET, DEBUG_MODE} from "../../../config/constants.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import Emitter from "../../../utils/Emitter.js"
import scale from "../../../utils/scale.js"

export default class Node extends Emitter{
    constructor(x, y, index, app){
        super()
        const size = SettingsProvider.settings.nodeSize.value

        this.state = STATES.WALKABLE
        this.hasBasicTexture = true
        this.totalAnimationTime = 0

        this.x = x * size
        this.y = y * size
        this.index = index

        this.ticker = app.ticker
        this.renderer = app.renderer

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

    createText = () => {
        const size = SettingsProvider.settings.nodeSize.value
        const x = Math.floor(this.x/size)
        const y = Math.floor(this.y/size)
        const text = new PIXI.Text(`(${x};${y})\n${this.index}`, {
            fontSize: 14,
            align: "center",
            cacheAsBitmap: true,
        })
        text.anchor.set(.5, .5)
        return text
    }

    createSprite = () => {
        const size = SettingsProvider.settings.nodeSize.value
        this.sprite = new PIXI.Sprite(this.createTexture())
        this.sprite.x = this.x + size / 2
        this.sprite.y = this.y + size / 2
        this.sprite.width = size
        this.sprite.height = size

        if(DEBUG_MODE){
            this.sprite.addChild(this.createText())
        }

        this.sprite.anchor.set(.5, .5)

        this.sprite.interactive = true
        this.sprite.on("pointerover", () => this.dispatchEvent(new CustomEvent("mouseover", {detail: this.index})))
        this.sprite.on("pointerdown", () => this.dispatchEvent(new CustomEvent("mousedown", {detail: this.index})))
    }

    handleTicker = delta => {
        const size = SettingsProvider.settings.nodeSize.value
        if(this.totalAnimationTime >= SettingsProvider.settings.animationDuration.value){
            this.sprite.width = size
            this.sprite.height = size
            this.ticker.remove(this.handleTicker)
            this.totalAnimationTime = 0
            return
        }
        this.totalAnimationTime += this.ticker.deltaMS/1000
        const scaling = Math.sin(scale(this.totalAnimationTime, 0, SettingsProvider.settings.animationDuration.value, 0, Math.PI))
        this.sprite.width = size+ANIMATION_OFFSET*scaling
        this.sprite.height = size+ANIMATION_OFFSET*scaling
    }

    getSprite = () => this.sprite

    setState = state => {
        this.state = state
        this.sprite.tint = PIXI.utils.string2hex(BACKGROUNDS[state][1])

        // Start animation if the new state is not "walkable"
        if(state !== STATES.WALKABLE){
            this.ticker.add(this.handleTicker)
        }

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
