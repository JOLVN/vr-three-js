

import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


class App {

    constructor() {

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
        this.camera.position.set(0, 1.6, 3)

        this.scene = new THREE.Scene()
        this.room = new THREE.Group()
        this.clock = new THREE.Clock()

        this.setLight()
        this.setRenderer()
        this.setControls()
        this.initSpheres()

        this.setupControllers()
        this.setupXR()

        this.renderer.setAnimationLoop(this.render.bind(this))
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

            this.room.add(object)
        }
        this.scene.add(this.room)
    }

    setupXR() {
        this.renderer.xr.enabled = true
        const button = VRButton.createButton(this.renderer)
        document.body.appendChild(button)
    }


    setupControllers() {

        this.controller = this.renderer.xr.getController(0)
        this.controller.addEventListener('selectstart', () => {
            this.userData.isSelecting = true
        })
        this.controller.addEventListener('selectend', () => {
            this.userData.isSelecting = true
        })
        this.controller.addEventListener('connected', (event) => {
            this.add(buildController(event.data))
        })
        this.controller.addEventListener('disconnected', () => {
            this.remove(this.children[0])
        })

        this.scene.add(this.controller

        )

        // TODO: Check that
        const controllerModelFactory = new XRControllerModelFactory();

        this.controllerGrip = this.renderer.xr.getControllerGrip(0);
        this.controllerGrip.add(controllerModelFactory.createControllerModel(this.controllerGrip));
        this.scene.add(this.controllerGrip);
    }

    buildController(data) {
        let geometry, material;
        switch (data.targetRayMode) {
            case 'tracked-pointer':
                geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

                material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

                return new THREE.Line(geometry, material);
            case 'gaze':
                geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
                material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
                return new THREE.Mesh(geometry, material);
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

        const delta = this.clock.getDelta() * 60

        if (this.controller.userData.isSelecting === true) {
            const cube = this.room.children[0]
            this.room.remove(cube)

            cube.position.copy(this.controller.position);
            cube.userData.velocity.x = (Math.random() - 0.5) * 0.02 * delta
            cube.userData.velocity.y = (Math.random() - 0.5) * 0.02 * delta
            cube.userData.velocity.z = (Math.random() * 0.01 - 0.05) * delta
            cube.userData.velocity.applyQuaternion(this.controller.quaternion);
            this.room.add(cube);
        }
        this.renderer.render(this.scene, this.camera)
    }
}

export { App };