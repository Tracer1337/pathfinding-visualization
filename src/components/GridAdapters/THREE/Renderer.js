import {THREE} from "./THREEAdapter.js"

export default class Renderer{
    constructor(container, dimensions){
        this.container = container
        this.width = dimensions.width
        this.height = dimensions.height
        this.inputHandler = null
        this.objects = []
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
        this.add(new THREE.AxesHelper(5))

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
        this.camera.position.z = 100
        this.camera.position.x = 5
        this.camera.position.y = 5

        this.add(this.camera)

        this.animate()

        /*
        * Add controls to the scene
        */
        import("three-orbitcontrols").then(module => {
            const OrbitControls = module.default
            const controls = new OrbitControls(this.camera, this.renderer.domElement)
            controls.target = new THREE.Vector3(0,0,0)
        })
    }

    /*
    * Add element to the scene
    */
    add = mesh => {
        this.scene.add(mesh)
        this.objects.push(mesh)
    }

    /*
    * Set input handler and add a camera to it
    */
    setInputHandler = object => {
        this.inputHandler = object
        this.inputHandler.setCamera(this.camera)
    }

    getDomElement = () => this.renderer.domElement

    /*
    * Animation loop
    */
    animate = () => {
        requestAnimationFrame(this.animate)

        this.renderer.render(this.scene, this.camera)
    }
}
