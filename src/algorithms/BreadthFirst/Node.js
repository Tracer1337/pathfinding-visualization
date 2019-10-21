export default class Node{
    constructor(x, y){
        this.x = x
        this.y = y
        this.parent = null
    }

    equal = node => node.x === this.x && node.y === this.y
}
