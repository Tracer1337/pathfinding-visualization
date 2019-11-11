import {THREE} from "./THREEAdapter.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import Node from "./Node.js"

export default class Grid{
    constructor(columns, rows){
        this.nodes = []
        const y = -50
        for(let j = 0; j < rows; j++){
            for(let i = 0; i < columns; i++){
                const index = j*columns+i
                const x = i - columns/2
                const z = j - rows/2
                const node = new Node(x, y, z, index)
                this.nodes[index] = node
            }
        }
    }

    render = renderer => {
        this.nodes.forEach(node => renderer.add(node.getMesh()))
    }

    getNodes = () => this.nodes
}
