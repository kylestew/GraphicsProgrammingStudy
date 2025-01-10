import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Mesh } from './glib/Mesh.js'
import { ColoredBox } from './glib/helpers/ColoredBox.js'
import { Mat4 } from './glib/math/Mat4.js'

import vertexSource from './shaders/vertex_colored.vert?raw'
import fragmentSource from './shaders/vertex_colored.frag?raw'

const canvas = document.getElementById('gl-canvas')
const renderer = new Renderer({
    canvas: canvas,
})
const gl = renderer.gl

function resize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
}
window.addEventListener('resize', resize, false)
resize()

const program = new Program(gl, {
    vertex: vertexSource,
    fragment: fragmentSource,
})

const box = new ColoredBox(gl)
const mesh = new Mesh(gl, { geometry: box, program })

// Add mouse interaction state
let isDragging = false
let previousMouseX = 0
let previousMouseY = 0

// Update camera state variables
let cameraAngle = 0
let cameraHeight = 2.0
let cameraRadius = 5.0

// Add mouse event listeners
canvas.addEventListener('mousedown', (e) => {
    isDragging = true
    previousMouseX = e.clientX
    previousMouseY = e.clientY
})

canvas.addEventListener('mouseup', () => {
    isDragging = false
})

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - previousMouseX
    const deltaY = e.clientY - previousMouseY

    // Update camera angle and height based on mouse movement
    cameraAngle += deltaX * 0.005
    cameraHeight = Math.max(-5, Math.min(5, cameraHeight - deltaY * 0.01))

    previousMouseX = e.clientX
    previousMouseY = e.clientY
})

// Add zoom with mouse wheel
canvas.addEventListener('wheel', (e) => {
    e.preventDefault()
    // Adjust camera radius (zoom) with mouse wheel
    cameraRadius = Math.max(2, Math.min(10, cameraRadius + e.deltaY * 0.01))
})

function render(now) {
    // Update camera position
    // cameraAngle += 0.005 // Rotate camera around the scene

    // Calculate camera position using spherical coordinates
    const cameraX = Math.sin(cameraAngle) * cameraRadius
    const cameraZ = Math.cos(cameraAngle) * cameraRadius
    const cameraPosition = [cameraX, cameraHeight, cameraZ]

    // Create view matrix - looking at origin from camera position
    const viewMatrix = new Mat4()
    viewMatrix.lookAt(
        cameraPosition, // camera position
        [0, 0, 0], // target (looking at origin)
        [0, 1, 0] // up vector
    )
    program.setUniform('uViewMatrix', viewMatrix)

    // Model matrix - position and rotate the box
    let modelMatrix = new Mat4()
    // modelMatrix.rotate(0.5, [1.0, 0.0, 0.0])
    // modelMatrix.rotate(0.9, [0.0, 1.0, 0.0])
    program.setUniform('uModelMatrix', modelMatrix)

    // Projection matrix
    let fov = Math.PI / 4 // 45 degrees
    let aspect = gl.canvas.width / gl.canvas.height
    let near = 0.1
    let far = 100
    const perspectiveMatrix = Mat4.perspective(fov, aspect, near, far)
    program.setUniform('uProjectionMatrix', perspectiveMatrix)

    renderer.render({ scene: mesh })
    requestAnimationFrame(render)
}
requestAnimationFrame(render)
