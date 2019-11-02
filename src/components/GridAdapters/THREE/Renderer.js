let THREE

export default class Renderer{
    constructor(module, container, dimensions){
        THREE = module
        this.container = container
        this.width = dimensions.width
        this.height = dimensions.height
    }

    /*
    * Create the THREE.JS scene
    */
    init = () => {
        this.viewAngle = 45
        this.aspectRatio = this.width / this.height
        this.near = .1
        this.far = 1e4

        this.renderer = new THREE.WebGLRenderer()
        this.camera = new THREE.PerspectiveCamera(
            this.viewAngle,
            this.aspectRatio,
            this.near,
            this.far
        )
        this.scene = new THREE.Scene()

        this.scene.add(this.camera)
        this.renderer.setSize(this.width, this.height)
        this.container.appendChild(this.renderer.domElement)

        this.box = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color: 0xCC0000})
        )

        this.scene.add(this.box)

        this.camera.position.z = 5

        this.animate()
    }

    /*
    * Animation loop
    */
    animate = () => {
        requestAnimationFrame(this.animate)

        this.box.rotation.x += .01
        this.box.rotation.y += .01

        this.renderer.render(this.scene, this.camera)
    }
}
