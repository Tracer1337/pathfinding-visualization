import Emitter from "./Emitter.js"
import {STATES} from "../config/constants.js"

class SettingsProvider extends Emitter{
    settings = {
        algorithm: {
            type: "select",
            label: "Algorithm",
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
            label: "Element to deploy",
            value: STATES.BLOCKED,
            options: [
                {
                    label: "Wall",
                    value: STATES.BLOCKED
                },
                {
                    label: "Start",
                    value: STATES.START
                },
                {
                    label: "End",
                    value: STATES.END
                }
            ]
        },

        heuristic: {
            type: "select",
            label: "Heuristic",
            value: 0,
            options: [
                {
                    label: "Manhattan",
                    value: 0
                },
                {
                    label: "Diagonal",
                    value: 1
                },
                {
                    label: "Euclidean",
                    value: 2
                },
            ]
        },

        directions: {
            type: "select",
            label: "Allowed directions",
            value: 0,
            options: [
                {
                    label: "Up | Down | Left | Right",
                    value: 0
                },
                {
                    label: "Allow Diagonal",
                    value: 1
                }
            ]
        },

        framerate: {
            type: "slider",
            value: 50,
            label: "Framerate"
        },

        nodeSize: {
            type: "slider",
            value: 50,
            min: 10,
            max: 150,
            step: 10,
            label: "Node Size"
        },

        clearGrid: {
            type: "action",
            color: "secondary",
            variant: "outlined",
            label: "Clear Grid"
        },

        searchPath: {
            type: "action",
            color: "primary",
            variant: "contained",
            label: "Search Path"
        },
    }

    set = (key, value) => {
        this.settings[key].value = value
        this.dispatchEvent(new CustomEvent(key+"Change", {detail: this.settings[key].value}))
    }

    invoke = key => this.dispatchEvent(new CustomEvent(key))
}

export default new SettingsProvider()
