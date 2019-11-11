import {THREE} from "./THREEAdapter.js"

export default class InputHandler{
    static EVENTS = {CLICK: "click"}

    constructor(renderer){
        this.domElement = renderer.getDomElement()
        this.objects = renderer.objects
        this.mouse = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()

        this.domElement.addEventListener("mousemove", this.handleMouseMove)
        this.domElement.addEventListener("mousedown", this.handleMouseDown)

        this.listeners = {}
        for(let event in InputHandler.EVENTS)
            this.listeners[InputHandler.EVENTS[event]] = []
    }

    addEventListener = (eventName, callback) => {
        this.listeners[eventName].push(callback)
    }

    handleMouseMove = e => {
        this.mouse.x = (e.offsetX/this.domElement.clientWidth)*2-1
        this.mouse.y = (e.offsetY/this.domElement.clientHeight)*-2+1
        this.raycaster.setFromCamera(this.mouse, this.camera)
    }

    handleMouseDown = e => {
        const clickedObject = this.getIntersections(this.objects)[0]
        if(clickedObject)
            this.listeners[InputHandler.EVENTS.CLICK].forEach(callback => callback(clickedObject.object.index))
    }

    getIntersections = objects => this.raycaster.intersectObjects(objects)

    setCamera = camera => this.camera = camera
}
