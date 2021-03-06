import PathfindingAlgorithm from "../PathfindingAlgorithm.js"

export default class BreadthFirst extends PathfindingAlgorithm{
    async findPath(){
        while(this.openList.length){
            // Get and remove the node at the top of the openList
            let currentNode = this.openList.shift()
            this.closedList.push(currentNode)

            // Found the goal
            if(this.checkForGoal(currentNode)){
                return Promise.resolve(this.getPath(currentNode))
            }

            // Get the neighbours of the current node
            let newOpenListNodes = []
            this.getAdjacentNodes(currentNode).forEach(node => {
                if(!this.getNodeInList(this.openList, node)){
                    this.openList.push(node)
                    newOpenListNodes.push(node)
                }
            })

            await this.visualization({currentNode, newOpenListNodes})
        }
    }
}
