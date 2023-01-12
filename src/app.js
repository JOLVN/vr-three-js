

import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';


class App {

    constructor() {

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
        this.camera.position.set(0, 1.6, 3)

        this.scene = new THREE.Scene()

        this.setLight()
        this.setRenderer()
        this.setControls()
        this.initSpheres()

        this.setupXR()

        window.addEventListener('resize', this.resize())
    }

    setLight() {
        this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040))
        const light = new THREE.DirectionalLight(0xffffff)
        light.position.set(1, 1, 1).normalize();
        this.scene.add(light);

    }

    setControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1.6, 0);
        this.controls.update()
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        document.body.appendChild(this.renderer.domElement)
        this.renderer.setAnimationLoop(this.render.bind(this))
    }

    initSpheres() {
        this.radius = 0.08

        const geometry = new THREE.IcosahedronBufferGeometry(this.radius, 2)

        for (let i = 0; i < 200; i++) {
            const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                color: Math.random() * 0xFFFFFF
            }))
            const size = 10
            object.position.x = Math.random() * size - size / 2
            object.position.y = Math.random() * size
            object.position.z = Math.random() * size - size / 2

            this.scene.add(object)
        }
    }

    setupXR() {
        this.renderer.xr.enabled = true
        const button = VRButton.createButton(this.renderer)
        setTimeout(() => {
            this.setupControllers()
            this.createHands()
        }, 2000);
        document.body.appendChild(button)
    }


    setupControllers() {
        this.controller1 = this.renderer.xr.getController(0)
        this.controller1.addEventListener('selectstart', this.handleControls('onSelectStart'))
        this.controller1.addEventListener('selectend', this.handleControls('onSelectEnd'))
        this.controller1.addEventListener('squeezestart', this.handleControls('onSqueezeStart'))
        this.controller1.addEventListener('squeezeend', this.handleControls('onSqueezeEnd'))

        this.controller2 = this.renderer.xr.getController(1)
        this.controller2.addEventListener('selectstart', this.handleControls('onSelectStart'))
        this.controller2.addEventListener('selectend', this.handleControls('onSelectEnd'))
        this.controller2.addEventListener('squeezestart', this.handleControls('onSqueezeStart'))
        this.controller2.addEventListener('squeezeend', this.handleControls('onSqueezeEnd'))

        this.painter1 = new TubePainter()
        this.scene.add(this.painter1.mesh)
        this.controller1.userData.painter = this.painter1

        this.painter2 = new TubePainter()
        this.scene.add(this.painter2.mesh)
        this.controller2.userData.painter = this.painter2

        this.scene.add(this.controller1)
        this.scene.add(this.controller2)
    }

    createHands() {
        const geometry = new THREE.BoxGeometry(0.3, 0.3)
        geometry.rotateX(- Math.PI / 2)
        const material = new THREE.MeshStandardMaterial({ flatShading: true })
        const mesh = new THREE.Mesh(geometry, material)

        pivot = new THREE.Mesh(new THREE.IcosahedronGeometry(0.01, 3))
        pivot.name = 'pivot'
        pivot.position.z = - 0.05
        mesh.add(pivot)

        this.controller1.add(mesh.clone())
        this.controller2.add(mesh.clone())
    }

    handleController(controller) {
        this.userData = controller.userData
        const painter = controller.userData
        const pivot = controller.getObjectByName('pivot')

        if (this.userData.isSqueezing === true) {

            const delta = (controller.position.y - userData.positionAtSqueezeStart) * 5
            const scale = Math.max(0.1, userData.scaleAtSqueezeStart + delta)

            pivot.scale.setScalar(scale)
            painter.setSize(scale)
        }

        cursor.setFromMatrixPosition(pivot.matrixWorld)

        if (this.userData.isSelecting === true) {
            painter.lineTo(cursor)
            painter.update()
        } else {
            painter.moveTo(cursor)
        }
    }

    handleControls(event) {
        if (event === 'onSelectStart') this.userData.isSelecting = true
        if (event === 'onSelectEnd') this.userData.isSelecting = false
        if (event === 'onSqueezeStart') {
            this.userData.isSqueezing = true
            this.userData.positionAtSqueezeStart = this.position.y
            this.userData.scaleAtSqueezeStart = this.scale.x
        }
        if (event === 'onSqueezeEnd') {
            this.userData.isSqueezing = false
        }
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    render() {
        setTimeout(() => {
            handleController(this.controller1)
            handleController(this.controller2)

        }, 2000);
        this.renderer.render(this.scene, this.camera)
    }
}

export { App };