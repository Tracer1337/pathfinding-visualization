import Algorithm from "./Algorithm.js"

export default class AStar extends Algorithm{
    async findPath(){
        while(this.openList.length){
            // Get the node with the least f value
            let currentNode = this.openList[0]
            let currentNodeIndex = 0
            for(let i = 1; i < this.openList.length; i++){
                if(this.openList[i].f < currentNode.f){
                    currentNode = this.openList[i]
                    currentNodeIndex = i
                }
            }

            // Move the currentNode from open to closed
            this.closedList.push(currentNode)
            this.openList.splice(currentNodeIndex, 1)

            if(this.checkForGoal(currentNode)){
                return Promise.resolve(this.getPath(currentNode))
            }

            // Get the adjacent nodes of currentNode
            let newOpenListNodes = []
            this.getAdjacentNodes(currentNode).forEach(adjacentNode => {
                // Calculate g, h and f values
                adjacentNode.g = currentNode.g + 1
                adjacentNode.h = this.heuristic(adjacentNode, this.endNode)
                adjacentNode.f = adjacentNode.g + adjacentNode.h

                // Filter node if it's already in the openList and it's g value is lower
                let nodeInOpenList = this.getNodeInList(this.openList, adjacentNode)
                if(nodeInOpenList && adjacentNode.g >= nodeInOpenList.g)
                    return

                this.openList.push(adjacentNode)
                newOpenListNodes.push(adjacentNode)
            })

            await this.visualization({currentNode, newOpenListNodes})
        }
    }
}
