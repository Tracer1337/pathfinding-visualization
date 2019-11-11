import {THREE} from "./THREEAdapter.js"

export default class InputHandler{
    static EVENTS = {CLICK: "click", MOUSE_UP: "mouseup", MOUSE_ENTER: "mouseenter"}

    constructor(renderer){
        this.domElement = renderer.getDomElement()
        this.objects = renderer.objects
        this.mouse = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()

        this.domElement.addEventListener("mousemove", this.handleMouseMove)
        this.domElement.addEventListener("mousedown", this.handleMouseDown)
        this.domElement.addEventListener("mouseup", this.handleMouseUp)

        this.listeners = {}
        for(let event in InputHandler.EVENTS)
            this.listeners[InputHandler.EVENTS[event]] = []
    }

    addEventListener = (eventName, callback) => {
        this.listeners[eventName].push(callback)
    }

    emit = (eventName, data) => this.listeners[eventName].forEach(callback => callback(data))

    handleMouseMove = e => {
        this.mouse.x = (e.offsetX/this.domElement.clientWidth)*2-1
        this.mouse.y = (e.offsetY/this.domElement.clientHeight)*-2+1
        this.raycaster.setFromCamera(this.mouse, this.camera)

        const intersection = this.getIntersections(this.objects)[0]
        if(intersection)
            this.emit(InputHandler.EVENTS.MOUSE_ENTER, intersection.object.index)
    }

    handleMouseDown = e => {
        const intersection = this.getIntersections(this.objects)[0]
        console.log(intersection)
        if(intersection)
            this.emit(InputHandler.EVENTS.CLICK, intersection.object.index)
    }

    handleMouseUp = () => this.emit(InputHandler.EVENTS.MOUSE_UP)

    getIntersections = objects => this.raycaster.intersectObjects(objects)

    setCamera = camera => this.camera = camera
}
