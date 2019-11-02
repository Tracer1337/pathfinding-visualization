import Emitter from "../utils/Emitter.js"
import SettingsProvider from "../utils/SettingsProvider.js"
import {Directions, Heuristics} from "../config/constants.js"

class Node{
    constructor(x, y, parentNode = null){
        this.x = x
        this.y = y

        this.g = 0
        this.h = 0
        this.f = 0

        this.distance = Infinity

        this.parentNode = parentNode
    }

    equal = node => this.x === node.x && this.y === node.y

    setDistance = distance => this.distance = distance
}

export default class PathfindingAlgorithm extends Emitter{
    constructor(start, end, grid, instant){
        super()

        this.startNode = new Node(...start)
        this.endNode = new Node(...end)

        this.closedList = []
        this.openList = [this.startNode]
        this.grid = grid

        this.instant = instant
        this.playing = true

        this.setHeuristic(0)
        this.setDirections(0)
        this.startNode.setDistance(0)

        SettingsProvider.addEventListener("pauseSearch", () => this.playing = false)

        if(!this.findPath){
            throw new Error("Missing method: findPath")
        }
    }

    setHeuristic = heuristicNr => this.heuristic = Heuristics[heuristicNr]
    setDirections = directionsNr => this.directions = Directions[directionsNr]

    getNodeInList = (list, node) => list.find(nodeInList => nodeInList.equal(node))

    checkForGoal = (currentNode) => currentNode.equal(this.endNode)

    getPath = (currentNode) => {
        // Follow the path to the starting node, beginning from the end node
        let path = []
        let current = currentNode
        while(current){
            path.push([current.x, current.y])
            current = current.parentNode
        }
        return path
    }

    /*
    * Generate currentNode's adjacent nodes and set their parents to currentNode
    */
    getAdjacentNodes = (currentNode) => {
        let adjacentNodes = []
        // Check allowed nodes
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

            const newNode = new Node(x, y, currentNode)

            // New Node is already in the closed list
            if(this.getNodeInList(this.closedList, newNode))
                continue

            // Add new node to the adjacent nodes
            adjacentNodes.push(newNode)
        }
        return adjacentNodes
    }

    /*
    * Dispatch iteration information
    * Wait 1/framerate seconds or wait until continue button clicked
    */
    visualization = async ({currentNode, newOpenListNodes}) => {
        if(!this.instant){
            this.dispatchEvent(new CustomEvent("nextIteration", {detail: {
                currentNode,
                newOpenListNodes,
                newClosedListNode: this.closedList.length>1 && this.closedList[this.closedList.length-2]
            }}))
        }
        return Promise.resolve()
    }
}
