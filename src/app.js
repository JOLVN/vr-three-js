

import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';


class App {
    constructor() {


        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
        this.camera.position.set(0, 1.6, 3);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x505050)

        this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040))

        const light = new THREE.DirectionalLight(0xffffff)
        light.position.set(1, 1, 1).normalize();
        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        document.body.appendChild(this.renderer.domElement)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1.6, 0);


        this.initScene()
        this.setupXR()

        this.tick()

        window.addEventListener('resize', this.resize())
    }

    initScene() {
        this.radius = 0.08

        this.room = new THREE.LineSegments(
            new BoxLineGeometry(6, 6, 6, 10, 10, 10),
            new THREE.LineBasicMaterial({ color: 0x808080 })
        )
        this.room.geometry.translate(0, 3, 0)
        this.scene.add(this.room)

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
    }

    setupXR() {
        this.renderer.xr.enabled = true
        document.body.appendChild(VRButton.createButton(this.renderer))
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


    tick() {
        window.requestAnimationFrame(() => this.tick())
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
    }
}

export { App };