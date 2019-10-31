import PathfindingAlgorithm from "../PathfindingAlgorithm.js"

export default class DepthFirst extends PathfindingAlgorithm{
    getNodeInOpenList = node => {
        for(let i = 0; i < this.openList.length; i++){
            if(this.openList[i].equal(node)){
                return [this.openList[i], i]
            }
        }
    }

    async findPath(){
        while(this.openList.length){
            // Get and remove the node at the top of the openList
            let currentNode = this.openList[0]
            this.openList.shift()
            this.closedList.push(currentNode)

            // Found the goal
            if(this.checkForGoal(currentNode)){
                return Promise.resolve(this.getPath(currentNode))
            }

            // Get the neighbours of the current node
            let newOpenListNodes = []
            console.log({currentNode, adjacent: this.getAdjacentNodes(currentNode)})
            this.getAdjacentNodes(currentNode).forEach(adjacentNode => {
                // Calculate distance between node and currentNode
                let dx = Math.abs(currentNode.x - adjacentNode.x)
                let dy = Math.abs(currentNode.y - adjacentNode.y)
                let relativeDistance =  (dx+dy)**(1/2)
                adjacentNode.setDistance(relativeDistance + currentNode.distance)

                // Replace node in open list if the distance of adjacentNode is lower
                let nodeInOpenList = this.getNodeInList(this.openList, adjacentNode)
                if(nodeInOpenList){
                    let [nodeInOpenList, nodeInOpenListIndex] = this.getNodeInOpenList(adjacentNode)
                    if(adjacentNode.distance < nodeInOpenList.distance){
                        this.openList.splice(nodeInOpenListIndex)
                        this.openList.push(adjacentNode)
                    }
                }else{
                    this.openList.push(adjacentNode)
                    newOpenListNodes.push(adjacentNode)
                }
            })

            /*
            * Sort the openList by distance so that the currentNode of the next
            * iteration will be the node with lowest distance in openList
            */
            this.openList.sort((nodeA, nodeB) => nodeA.distance-nodeB.distance)

            await this.visualization({currentNode, newOpenListNodes})
        }
    }
}
