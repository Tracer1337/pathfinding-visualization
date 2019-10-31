import Emitter from "./Emitter.js"
import settings from "../config/settings.json"

class SettingsProvider extends Emitter{
    settings = settings

    set = (key, value) => {
        this.settings[key].value = value
        this.dispatchEvent(new CustomEvent(key+"Change", {detail: this.settings[key].value}))
    }

    invoke = key => this.dispatchEvent(new CustomEvent(key))
}

export default new SettingsProvider()
