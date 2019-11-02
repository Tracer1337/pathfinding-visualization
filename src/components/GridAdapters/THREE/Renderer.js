import {THREE} from "./THREEAdapter.js"

export default class Renderer{
    constructor(container, dimensions){
        this.container = container
        this.width = dimensions.width
        this.height = dimensions.height
    }

    /*
    * Create the THREE.JS scene
    */
    init = (grid) => {
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
        this.scene.add(new THREE.AxesHelper(5))

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

        this.scene.add(this.camera)

        this.animate()
    }

    /*
    * Add element to the scene
    */
    add = mesh => this.scene.add(mesh)

    /*
    * Animation loop
    */
    animate = () => {
        requestAnimationFrame(this.animate)

        this.renderer.render(this.scene, this.camera)
    }
}
