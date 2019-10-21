import Emitter from "./Emitter.js"
import {STATES} from "../config/constants.js"

class SettingsProvider extends Emitter{
    settings = {
        algorithm: {
            type: "select",
            value: 0,
            options: [
                {
                    label: "A*",
                    value: 0
                },
                {
                    label: "Dijkstra",
                    value: 1
                },
                {
                    label: "Breadth First",
                    value: 2
                },
                {
                    label: "Depth First",
                    value: 3
                }
            ]
        },
        gridSetterState: {
            type: "select",
            value: STATES.BLOCKED,
            options: [
                {
                    label: "Set Wall",
                    value: STATES.BLOCKED
                },
                {
                    label: "Set Start",
                    value: STATES.START
                },
                {
                    label: "Set End",
                    value: STATES.END
                }
            ]
        },
        searchPath: {
            type: "action",
            label: "Search Path"
        },
        clearGrid: {
            type: "action",
            label: "Clear Grid"
        }
    }

    set = (key, value) => {
        this.settings[key].value = value
        this.dispatchEvent(new CustomEvent(key+"Change", {detail: this.settings[key].value}))
    }

    invoke = key => this.dispatchEvent(new CustomEvent(key))
}

export default new SettingsProvider()
