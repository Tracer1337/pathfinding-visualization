import {THREE} from "./THREEAdapter.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import Node from "./Node.js"

export default class Grid{
    constructor(columns, rows){
        this.nodes = []
        for(let y = 0; y < rows; y++){
            for(let x = 0; x < columns; x++){
                const index = y*columns+x
                const node = new Node(x, y, index)
                this.nodes[index] = node
            }
        }
    }

    render = renderer => {
        this.nodes.forEach(node => renderer.add(node.getMesh()))
    }

    getNodes = () => this.nodes
}
