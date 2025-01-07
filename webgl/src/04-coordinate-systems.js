import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Mesh } from './glib/Mesh.js'
import { Box } from './glib/extras/Box.js'
import { Mat4 } from './glib/math/Mat4.js'

import vertexSource from './shaders/uv_colored.vert?raw'
import fragmentSource from './shaders/uv_colored.frag?raw'

const canvas = document.getElementById('gl-canvas')
const renderer = new Renderer({
    canvas: canvas,
    depth: false,
})
const gl = renderer.gl

// // Enable face culling
// gl.enable(gl.CULL_FACE)

// // Specify that back faces should be culled
// gl.cullFace(gl.BACK)

// // (Optional) Set the front face winding order
// // By default, WebGL considers counter-clockwise (CCW) winding as front-facing
// gl.frontFace(gl.CCW)

function resize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
}
window.addEventListener('resize', resize, false)
resize()

const program = new Program(gl, {
    vertex: vertexSource,
    fragment: fragmentSource,
})

const box = new Box(gl)
const mesh = new Mesh(gl, { geometry: box, program })

// Variables for mouse tracking
let rotationY = 0
let rotationX = 0
let isDragging = false
let lastMouseX = 0
let lastMouseY = 0

// Mouse event listeners
canvas.addEventListener('mousedown', (event) => {
    isDragging = true
    lastMouseX = event.clientX
    lastMouseY = event.clientY
})

canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - lastMouseX
        const deltaY = event.clientY - lastMouseY
        rotationY += deltaX * 0.01 // Adjust sensitivity as needed
        rotationX += deltaY * 0.01
        lastMouseX = event.clientX
        lastMouseY = event.clientY
    }
})

canvas.addEventListener('mouseup', () => {
    isDragging = false
})

canvas.addEventListener('mouseleave', () => {
    isDragging = false
})

function render(now) {
    // let time = now * 0.001 // in milliseconds

    // prettier-ignore
    let modelMatrix = new Mat4()
    // modelMatrix.translate([0.1, 0.0, 0.0])
    modelMatrix.rotate(rotationX, [1.0, 0.0, 0.0])
    modelMatrix.rotate(rotationY, [0.0, 1.0, 0.0])
    program.setUniform('uModelMatrix', modelMatrix)

    renderer.render({ scene: mesh })
    requestAnimationFrame(render)
}
requestAnimationFrame(render)
