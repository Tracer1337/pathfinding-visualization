import Emitter from "../../utils/Emitter.js"
import sleep from "../../utils/sleep.js"
import SettingsProvider from "../../utils/SettingsProvider.js"
import {Directions} from "../../config/constants.js"
import Node from "./Node.js"

export default class Dijkstra extends Emitter{
    constructor(start, end, grid){
        super()
        this.startNode = new Node(...start)
        this.startNode.setDistance(0)

        this.priorityQueue = []
        this.openList = [this.startNode]
        this.closedList = []
        this.grid = JSON.parse(JSON.stringify(grid))
        console.log(this.grid)

        this.setDirections(1)
    }
    
    setDirections = directionsNr => this.directions = Directions[directionsNr]

    // Find the same node in the open list and return it and its index
    isInList = (list, node) => {
        for(let indexOfNodeInList in list){
            let nodeInList = list[indexOfNodeInList]
            if(nodeInList.equal(node)){
                return [nodeInList, indexOfNodeInList]
            }
        }
        return false
    }

    async findPath(){
        while(this.openList.length){
            // Set the current node to the node with lowest distance in open list
            let currentNode = this.openList[0]

            // Move current node from openList to closedList
            this.openList.shift()
            this.closedList.push(currentNode)
            console.log(currentNode, this.grid[currentNode.y][currentNode.x])
            // Found the end node
            if(this.grid[currentNode.y][currentNode.x] === 3){
                let path = []
                while(currentNode){
                    path.push([currentNode.x, currentNode.y])
                    currentNode = currentNode.parentNode
                }
                return Promise.resolve(path)
            }

            // Get the neighbours of the current node and put them into the open list if neccessary
            let newOpenListNodes = []
            for(let dir of this.directions){
                // Apply dir to currentNodes position to get the new x, y
                let x = currentNode.x+dir[0]
                let y = currentNode.y+dir[1]

                // Do not proceed if the node is not inside the grid
                if(x < 0 || y < 0 ||
                   x >= this.grid[0].length || y >= this.grid.length)
                   continue

                // Do not proceed if the node is not walkable
                if(this.grid[y][x] === 1)
                    continue

                // Create the new node
                let node = new Node(x, y, currentNode)
                let relativeDistance = dir[0] && dir[1] ? Math.sqrt(2) : 1
                node.setDistance(relativeDistance + currentNode.distance)

                // Check if node is already in the closed list
                let isInClosedList = this.isInList(this.closedList, node)
                if(isInClosedList)
                    continue

                // Check if node is already in the open list
                let isInOpenList = this.isInList(this.openList, node)
                if(isInOpenList){
                    // Replace same node in open list if distance is lower
                    let [nodeInOpenList, indexOfNodeInOpenList] = isInOpenList
                    if(node.distance < nodeInOpenList.distance){
                        this.openList.splice(indexOfNodeInOpenList, 1)
                        this.openList.push(node)
                    }
                }else{
                    // Add node to the open list
                    newOpenListNodes.push(node)
                    this.openList.push(node)
                }
            }

            // Sort the openList by distance
            this.openList.sort((nodeA, nodeB) => nodeA.distance-nodeB.distance)

            // Visualization bridge
            this.dispatchEvent(new CustomEvent("nextIteration", {detail: {
                currentNode,
                newOpenListNodes,
                newClosedListNode: this.closedList.length>1 && this.closedList[this.closedList.length-2]
            }}))

            await sleep(1/SettingsProvider.settings.framerate.value*1000)
        }
    }
}
