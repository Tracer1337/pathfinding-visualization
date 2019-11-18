import Node from "./Node.js"

export default class Grid{
    constructor(columns, rows, app){
        this.nodes = []

        for(let i = 0; i < rows; i++){
            for(let j = 0; j < columns; j++){
                const index = i*columns+j
                const node = new Node(j, i, index, app)
                this.nodes.push(node)
            }
        }
    }

    getNodes = () => this.nodes
}
