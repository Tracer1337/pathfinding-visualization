import {THREE} from "./THREEAdapter.js"
import {STATES, BACKGROUNDS} from "../../../config/constants.js"

export default class Node{
    constructor(x, y, index){
        this.state = STATES.WALKABLE

        this.x = x
        this.y = y

        this.geometry = new THREE.BoxBufferGeometry(1,1,1)
        this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
        this.box = new THREE.Mesh(this.geometry, this.material)
        this.box.index = index

        // Add border to the box
        // const borderGeo = new THREE.EdgesGeometry(this.geometry)
        // const borderMat = new THREE.LineBasicMaterial({color: 0xffffff, lineWidth: 4})
        // const wireframe = new THREE.LineSegments(borderGeo, borderMat)
        // wireframe.renderOrder = 1
        // this.box.add(wireframe)

        this.box.position.x = this.x
        this.box.position.y = this.y
    }

    setState = state => {
        this.state = state
        this.setColor(BACKGROUNDS[this.state][0] === "Color" ? BACKGROUNDS[this.state][1] : BACKGROUNDS[STATES.PATH][1])
    }

    setColor = color => this.box.material.color.set(new THREE.Color(color))

    toggle = (state) => {
        if(this.state === state){
            this.setState(STATES.WALKABLE)
        }else{
            this.setState(state)
        }
    }

    set = state => {
        if(this.state !== STATES.START && this.state !== STATES.END){
            this.setState(state)
        }
    }

    reset = () => {
        this.setState(STATES.WALKABLE)
    }

    force = state => {
        this.setState(state)
    }

    getMesh = () => this.box
}
