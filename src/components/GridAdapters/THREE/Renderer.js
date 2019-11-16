import {THREE} from "./THREEAdapter.js"
import SettingsProvider from "../../../utils/SettingsProvider.js"

const eventEmitter = new EventTarget()
export {eventEmitter}

export default class Renderer{
    constructor(container, dimensions){
        this.container = container
        this.width = dimensions.width
        this.height = dimensions.height
        this.inputHandler = null
        this.objects = []
        this.running = true
    }

    /*
    * Create the THREE.JS scene
    */
    init = () => {
        /*
        * Create the renderer
        */
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(this.width, this.height)
        this.container.appendChild(this.renderer.domElement)

        /*
        * Create the scene
        */
        this.scene = new THREE.Scene()

        /*
        * Create the camera and add it to the scene
        */
        this.viewAngle = 45
        this.aspectRatio = this.width / this.height
        this.near = .1
        this.far = 1e4

        this.camera = new THREE.PerspectiveCamera(
            this.viewAngle,
            this.aspectRatio,
            this.near,
            this.far
        )
        this.camera.position.x = -1000
        this.camera.position.z = 1000

        this.alignCamera()

        this.add(this.camera)

        /*
        * Initialize a clock and begin to animate
        */
        this.clock = new THREE.Clock()
        this.animate()

        /*
        * Add controls to the scene
        */
        import("three-orbitcontrols").then(module => {
            const OrbitControls = module.default
            this.controls = new OrbitControls(new THREE.PerspectiveCamera(), this.renderer.domElement)
            this.controls.target = new THREE.Vector3(0,0,0)
        })

        SettingsProvider.addEventListener("gridPositionChange", this.alignCamera)
    }

    alignCamera = () => this.camera.lookAt(new THREE.Vector3(0, SettingsProvider.settings.gridPosition.value*SettingsProvider.settings.nodeSize.value, 0))

    /*
    * Add element to the scene
    */
    add = mesh => {
        this.scene.add(mesh)
        this.objects.push(mesh)
    }

    /*
    * Enable controls
    */
    enableControls = () => this.controls.enabled = true

    /*
    * Diable controls
    */
    disableControls = () => this.controls.enabled = false

    /*
    * Set input handler and add a camera to it
    */
    setInputHandler = object => {
        this.inputHandler = object
        this.inputHandler.setCamera(this.camera)
    }

    getDomElement = () => this.renderer.domElement

    /*
    * Destroy the renderer and all of its dependencies
    */
    destroy = () => {
        this.running = false
        this.renderer = null
        this.scene = null
        this.clock = null
        for(let object of this.objects){
            object = null
        }
    }

    /*
    * Animation loop
    */
    animate = () => {
        if(!this.running) return
        this.animationRequestId = requestAnimationFrame(this.animate)
        const delta = this.clock.getDelta()
        eventEmitter.dispatchEvent(new CustomEvent("update", {detail: {
            delta
        }}))

        this.renderer.render(this.scene, this.camera)
    }
}
