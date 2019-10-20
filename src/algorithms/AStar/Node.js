export default class Node{
    constructor(x, y, parentNode = null){
        this.x = x
        this.y = y

        this.g = 0
        this.h = 0
        this.f = 0

        this.parentNode = parentNode
    }

    equal = node => this.x === node.x && this.y === node.y
}
