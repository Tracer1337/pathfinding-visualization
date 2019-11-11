import {THREE} from "./THREEAdapter.js"
import {STATES, BACKGROUNDS} from "../../../config/constants.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"
import scale from "../../../utils/scale.js"
import {eventEmitter} from "./Renderer.js"

export default class Node{
    constructor(x, z, index){
        this.state = STATES.WALKABLE
        this.totalAnimationTime = 0

        this.x = x*SettingsProvider.settings.nodeSize.value
        this.y = SettingsProvider.settings.gridPosition.value*SettingsProvider.settings.nodeSize.value
        this.z = z*SettingsProvider.settings.nodeSize.value

        this.geometry = new THREE.BoxBufferGeometry(
            SettingsProvider.settings.nodeSize.value,
            SettingsProvider.settings.nodeSize.value,
            SettingsProvider.settings.nodeSize.value
        )
        this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF})
        this.box = new THREE.Mesh(this.geometry, this.material)
        this.box.index = index
        this.box.isNode = true
        this.box.position.x = this.x
        this.box.position.y = this.y
        this.box.position.z = this.z

        // Add border to the box
        const borderGeo = new THREE.EdgesGeometry(this.geometry)
        const borderMat = new THREE.LineBasicMaterial({color: new THREE.Color(BACKGROUNDS[STATES.CLOSED][1])})
        this.wireframe = new THREE.LineSegments(borderGeo, borderMat)
        this.wireframe.renderOrder = 1
        this.box.add(this.wireframe)
    }

    setY = y => {
        this.y = y
        this.box.position.y = y
    }

    setState = state => {
        this.state = state
        this.setColor(BACKGROUNDS[this.state][0] === "Color" ? BACKGROUNDS[this.state][1] : BACKGROUNDS[STATES.PATH][1])
    }

    setColor = color => {
        eventEmitter.addEventListener("update", this.handleUpdate)
        this.box.material.color.set(new THREE.Color(color))
        if(color === BACKGROUNDS[STATES.CLOSED][1])
            this.wireframe.material.color.set(new THREE.Color(BACKGROUNDS[STATES.PATH][1]))
        else
            this.wireframe.material.color.set(new THREE.Color(BACKGROUNDS[STATES.CLOSED][1]))
    }

    handleUpdate = ({detail}) => {
        const {delta} = detail
        if((this.totalAnimationTime+=delta) >= SettingsProvider.settings.animationDuration.value){
            eventEmitter.removeEventListener("update", this.handleUpdate)
            this.totalAnimationTime = 0
        }
        const factor = Math.sin(scale(this.totalAnimationTime, 0, SettingsProvider.settings.animationDuration.value, 0, Math.PI))
        this.box.position.y = this.y+SettingsProvider.settings.nodeSize.value*factor
    }

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
