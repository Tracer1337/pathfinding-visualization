import Emitter from "./Emitter.js"
import {MAX_WIDTH_FOR_LAYOUT_CHANGE} from "../config/constants.js"

class ScreenSizeTracker extends Emitter{
    constructor(maxWidth){
        super()
        this.maxWidth = maxWidth
        this.isSmall = window.innerWidth<this.maxWidth
        window.addEventListener("resize", this.handleResize)
    }

    handleResize = () => {
        if(window.innerWidth < MAX_WIDTH_FOR_LAYOUT_CHANGE && !this.isSmall){
            this.isSmall = true
            this.dispatchEvent(new CustomEvent("onBoundaryPass", {detail: {isSmall: this.isSmall}}))
        }else if(window.innerWidth > MAX_WIDTH_FOR_LAYOUT_CHANGE && this.isSmall){
            this.isSmall = false
            this.dispatchEvent(new CustomEvent("onBoundaryPass", {detail: {isSmall: this.isSmall}}))
        }
    }
}

export default new ScreenSizeTracker(MAX_WIDTH_FOR_LAYOUT_CHANGE)
