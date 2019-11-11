import {THREE} from "./THREEAdapter.js"

export default class InputHandler{
    constructor(domElement){
        domElement.addEventListener("mousemove", this.handleMouseMove, false)
        this.mouse = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
    }

    handleMouseMove = e => {
        this.mouse.x = (e.clientX/window.innerWidth)*2-1
        this.mouse.y = (e.clientY/window.innerHeight)*2+1
    }

    update = () => {
        if(!this.camera) throw new Error("No camera defined")
        this.raycaster.setFromCamera(this.mouse, this.camera)
    }

    getIntersections = objects => this.raycaster.intersectObjects(objects)

    setCamera = camera => this.camera = camera
}
