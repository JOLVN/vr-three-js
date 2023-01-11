// index.js
import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)


const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)

camera.position.z = 3


renderer.xr.enabled = true
document.body.appendChild(VRButton.createButton(renderer))

const animate = () => {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    controls.update()
    renderer.render(scene, camera)
}
animate()




