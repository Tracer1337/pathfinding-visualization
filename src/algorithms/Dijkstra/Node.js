export default class Node{
    constructor(x, y, parentNode){
        this.x = x
        this.y = y
        this.parentNode = parentNode
        this.distance = Infinity
    }

    setDistance = distance => this.distance = distance

    equal = node => this.x === node.x && this.y === node.y
}
