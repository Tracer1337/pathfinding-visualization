import Emitter from "./Emitter.js"
import settings from "../config/settings.json"

class SettingsProvider extends Emitter{
    settings = settings

    set = (key, value) => {
        if(this.settings[key].value === value) return
        this.settings[key].value = value
        this.dispatchEvent(new CustomEvent(key+"Change", {detail: this.settings[key].value}))
    }

    invoke = key => this.dispatchEvent(new CustomEvent(key))

    hide = key => {
        this.settings[key].hidden = true
        this.dispatchEvent(new CustomEvent("change"))
    }

    show = key => {
        this.settings[key].hidden = false
        this.dispatchEvent(new CustomEvent("change"))
    }
}

export default new SettingsProvider()
