import {THREE} from "./THREEAdapter.js"

export default class InputHandler{
    throttle = 0
    constructor(domElement){
        this.domElement = domElement
        this.mouse = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()

        this.domElement.addEventListener("mousemove", this.handleMouseMove, false)
    }

    handleMouseMove = e => {
        this.mouse.x = (e.offsetX/this.domElement.clientWidth)*2-1
        this.mouse.y = (e.offsetY/this.domElement.clientHeight)*-2+1
    }

    update = children => {
        if(!this.camera) throw new Error("No camera defined")
        this.raycaster.setFromCamera(this.mouse, this.camera)
        this.getIntersections(children)
            .forEach(intersection => intersection.object.material.color.set(0xff0000))
    }

    getIntersections = objects => this.raycaster.intersectObjects(objects)

    setCamera = camera => this.camera = camera
}
