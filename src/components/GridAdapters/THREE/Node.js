import {THREE} from "./THREEAdapter.js"
import {STATES, BACKGROUNDS} from "../../../config/constants.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"

export default class Node{
    constructor(x, y, z, index){
        this.state = STATES.WALKABLE

        this.x = x*SettingsProvider.settings.nodeSize.value
        this.y = y*SettingsProvider.settings.nodeSize.value
        this.z = z*SettingsProvider.settings.nodeSize.value

        this.geometry = new THREE.BoxBufferGeometry(
            SettingsProvider.settings.nodeSize.value,
            1,
            SettingsProvider.settings.nodeSize.value
        )
        this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
        this.box = new THREE.Mesh(this.geometry, this.material)
        this.box.index = index
        this.box.position.x = this.x
        this.box.position.y = this.y
        this.box.position.z = this.z

        // Add border to the box
        const borderGeo = new THREE.EdgesGeometry(this.geometry)
        const borderMat = new THREE.LineBasicMaterial({color: new THREE.Color(BACKGROUNDS[STATES.CLOSED][1])})
        const wireframe = new THREE.LineSegments(borderGeo, borderMat)
        wireframe.renderOrder = 1
        this.box.add(wireframe)
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
