import {THREE} from "./THREEAdapter.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"

export default class Ground{
    constructor(y){
        this.offset = 1.1
        this.y = SettingsProvider.settings.gridPosition.value-this.offset

        this.geometry = new THREE.PlaneBufferGeometry(2000, 2000, 32)
        this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide})
        this.plane = new THREE.Mesh(this.geometry, this.material)

        this.plane.position.y = this.y*SettingsProvider.settings.nodeSize.value
        this.plane.rotation.x = Math.PI/2

        SettingsProvider.addEventListener("gridPositionChange", this.move)
    }

    move = () => {
        this.y = SettingsProvider.settings.gridPosition.value-this.offset
        this.plane.position.y = this.y*SettingsProvider.settings.nodeSize.value
    }

    getMesh = () => this.plane
}
