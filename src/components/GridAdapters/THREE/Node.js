import {THREE} from "./THREEAdapter.js"
import {STATES, BACKGROUNDS} from "../../../config/constants.js"

export default class Node{
    constructor(x, y){
        this.state = STATES.WALKABLE

        this.x = x
        this.y = y

        this.geometry = new THREE.BoxBufferGeometry(1,1,1)
        this.material = new THREE.MeshBasicMaterial({color: 0x0000FF})
        this.box = new THREE.Mesh(this.geometry, this.material)

        // Add border to the box
        const borderGeo = new THREE.EdgesGeometry(this.geometry)
        const borderMat = new THREE.LineBasicMaterial({color: 0xffffff, lineWidth: 4})
        const wireframe = new THREE.LineSegments(borderGeo, borderMat)
        wireframe.renderOrder = 1
        this.box.add(wireframe)

        this.box.position.x = this.x
        this.box.position.y = this.y
    }

    setColor = color => {
        const converter = new THREE.Color()
        converter.set(color)
        this.box.material.color.setHex(converter.getHexString)
    }

    toggle = (state) => {
        this.set(state)
    }

    set = (state) => {
        this.state = state
        this.setColor(BACKGROUNDS[this.state][0] === "COLOR" ? BACKGROUNDS[this.state] : BACKGROUNDS[STATES.BLOCKED])
    }

    reset = () => {
        this.set(STATES.WALKABLE)
    }

    force = (state) => {
        this.set(state)
    }

    getMesh = () => this.box
}
