import Emitter from "../../utils/Emitter.js"
import sleep from "../../utils/sleep.js"
import SettingsProvider from "../../utils/SettingsProvider.js"
import {Directions} from "../../config/constants.js"
import Node from "./Node.js"

export default class DepthFirst extends Emitter{
    constructor(start, end, grid){
        super()
        this.startingPoint = new Node(...start)
        this.grid = JSON.parse(JSON.stringify(grid))
        this.stack = [this.startingPoint]
        this.discoveredList = [this.startingPoint]
        this.closedList = []
        this.setDirections(0)
    }

    setDirections = directionsNr => this.directions = Directions[directionsNr]

    isDiscovered = node => this.discoveredList.some(e => e.equal(node))

    async findPath(){
        while(this.stack.length){
            // Get and remove the node at the top of the queue
            let currentNode = this.stack.pop()
            this.closedList.push(currentNode)

            // Found the goal
            if(this.grid[currentNode.y][currentNode.x] === 3){
                let path = []
                while(currentNode){
                    path.push([currentNode.x, currentNode.y])
                    currentNode = currentNode.parent
                }
                return Promise.resolve(path)
            }

            // Get the neighbours of the current node
            let newDiscoveredNodes = []
            for(let dir of this.directions){
                // Apply dir to currentNodes position to get the new x, y
                let x = currentNode.x+dir[0]
                let y = currentNode.y+dir[1]

                // Do not proceed if the node is not valid
                if(x < 0 || y < 0 ||
                   x >= this.grid[0].length || y >= this.grid.length ||
                   this.grid[y][x] === 1)
                   continue

                const newNode = new Node(x, y)
                // Only proceed if the new node is not discovered already
                if(!this.isDiscovered(newNode)){
                    newNode.parent = currentNode
                    newDiscoveredNodes.push(newNode)
                    this.discoveredList.push(newNode)
                    this.stack.push(newNode)
                }
            }

            // Visualization bridge
            this.dispatchEvent(new CustomEvent("nextIteration", {detail: {
                newClosedListNode: currentNode,
                newOpenListNodes: newDiscoveredNodes
            }}))

            await sleep(1/SettingsProvider.settings.framerate.value*1000)
        }
    }
}
