import SettingsProvider from "../../../utils/SettingsProvider.js"
import Node from "./Node.js"

export default class Grid{
    constructor(columns, rows){
        this.nodes = []
        for(let j = 0; j < rows; j++){
            for(let i = 0; i < columns; i++){
                const index = j*columns+i
                const x = i - columns/2
                const z = j - rows/2
                const node = new Node(x, z, index)
                this.nodes[index] = node
            }
        }
        SettingsProvider.addEventListener("gridPositionChange", this.move)
    }

    move = () => {
        this.y = SettingsProvider.settings.gridPosition.value
        this.nodes.forEach(node => node.getMesh().position.y = this.y*SettingsProvider.settings.nodeSize.value)
    }

    render = renderer => {
        this.nodes.forEach(node => renderer.add(node.getMesh()))
    }

    getNodes = () => this.nodes
}
