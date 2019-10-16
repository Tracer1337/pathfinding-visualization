class Node{
    constructor(x, y, parentNode = null){
        this.x = x
        this.y = y

        this.g = 0
        this.h = 0
        this.f = 0

        this.parentNode = parentNode
    }

    equal(node){ return this.x == node.x && this.y == node.y }

    distanceTo(node){ return ((node.x-this.x)**2+(node.y-this.y)**2)**(1/2)}
}

class AStar{
    constructor(start, end, grid){
        this.startNode = new Node(...start)
        this.endNode = new Node(...end)
        this.grid = grid
        this.openList = [this.startNode]
        this.closedList = []
    }

    getNodeInList(list, node){
        return list.find(closedNode => closedNode.equal(node))
    }

    findPath(){
        while(this.openList.length){
            // Find the node with least f in the open list
            let currentNode = this.openList[0]
            let currentNodeIndex = 0
            for(let i = 0; i < this.openList.length; i++){
                if(this.openList[i].f < currentNode.f){
                    currentNode = this.openList[i]
                    currentNodeIndex = i
                }
            }

            // Remove currentNode from the open list and add it to the closed list
            this.openList.splice(currentNodeIndex, 1)
            this.closedList.push(currentNode)

            // Found the goal
            if(currentNode.equal(this.endNode)){
                // Follow the path to the starting node, beginning from the end node
                let path = []
                let current = currentNode
                while(current){
                    path.push([current.x, current.y])
                    current = current.parentNode
                }
                return path.reverse()
            }

            // Generate currentNode's adjacent nodes and set their parents to currentNode
            let children = []
            for(let x = currentNode.x - 1; x <= currentNode.x + 1; x++){
                for(let y = currentNode.y - 1; y <= currentNode.y + 1; y++){
                    // Do not proceed if the position is the positon of the currentNode
                    if(x == 0 && y == 0)
                        continue

                    // Do not proceed it the node is not inside the grid
                    if(x < 0 || y < 0 ||
                       x > this.grid.length || y > this.grid[0].length)
                       continue

                    // Do not proceed if the node is not walkable
                    if(this.grid[x][y] === 1)
                        continue

                    // Add new node to the children
                    children.push(new Node(x, y, currentNode))
                }
            }

            for(let child of children){
                // Child is already on the closed list
                if(this.getNodeInList(this.closedList, child)){
                    continue
                }

                // Create the g, h and f values
                child.g = currentNode.g + 1
                child.h = child.distanceTo(this.endNode)
                child.f = child.g + child.h

                // Child is already in the open list
                let nodeInOpenList = this.getNodeInList(this.openList, child)
                if(nodeInOpenList && child.g > nodeInOpenList.g){
                    continue
                }

                // Add child to the open list
                this.openList.push(child)
            }
        }
    }
}

// let path = new AStar([1, 1], [0, 4], grid).findPath()
export default AStar
