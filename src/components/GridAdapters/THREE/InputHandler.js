import {THREE} from "./THREEAdapter.js"

export default class InputHandler{
    static EVENTS = {CLICK: "click", MOUSE_UP: "mouseup", MOUSE_ENTER: "mouseenter"}

    constructor(renderer){
        this.domElement = renderer.getDomElement()
        this.objects = renderer.objects
        this.mouse = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        this.currentObject = {uuid: null}

        this.domElement.addEventListener("mousemove", this.handleMouseMove)
        this.domElement.addEventListener("mousedown", this.handleMouseDown)
        this.domElement.addEventListener("mouseup", this.handleMouseUp)

        const callAsMouseEvent = (e, callback) => {
            const domElementRect = this.domElement.getBoundingClientRect()
            callback({
                offsetX: e.touches[0].clientX - domElementRect.x,
                offsetY: e.touches[0].clientY - domElementRect.y
            })
        }
        this.domElement.addEventListener("touchmove", e => callAsMouseEvent(e, this.handleMouseMove))
        this.domElement.addEventListener("touchstart", e => callAsMouseEvent(e, this.handleMouseDown))
        this.domElement.addEventListener("touchend", this.handleMouseUp)

        this.listeners = {}
        for(let event in InputHandler.EVENTS)
            this.listeners[InputHandler.EVENTS[event]] = []
    }

    addEventListener = (eventName, callback) => {
        this.listeners[eventName].push(callback)
    }

    emit = (eventName, data) => this.listeners[eventName].forEach(callback => callback(data))

    handleMouseMove = e => {
        this.setMouse(e.offsetX, e.offsetY)

        const intersection = this.getIntersections(this.objects)[0]
        if(intersection && intersection.object.isNode && this.currentObject.uuid !== intersection.object.uuid){
            this.emit(InputHandler.EVENTS.MOUSE_ENTER, intersection.object.index)
            this.currentObject = intersection.object
        }
    }

    handleMouseDown = e => {
        if(e.offsetX && e.offsetY){
            this.setMouse(e.offsetX, e.offsetY)
        }
        const intersection = this.getIntersections(this.objects)[0]
        if(intersection && intersection.object.isNode)
            this.emit(InputHandler.EVENTS.CLICK, intersection.object.index)
    }

    handleMouseUp = () => this.emit(InputHandler.EVENTS.MOUSE_UP)

    setMouse = (x, y) => {
        this.mouse.x = (x/this.domElement.clientWidth)*2-1
        this.mouse.y = (y/this.domElement.clientHeight)*-2+1
        this.raycaster.setFromCamera(this.mouse, this.camera)
    }

    getIntersections = objects => this.raycaster.intersectObjects(objects)

    setCamera = camera => this.camera = camera
}
