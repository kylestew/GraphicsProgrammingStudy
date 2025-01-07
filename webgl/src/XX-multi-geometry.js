import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Plane } from './glib/extras/Plane.js'
import { Mesh } from './glib/Mesh.js'
import { Mat4 } from './glib/math/Mat4.js'

import vertexSource from './shaders/vertex_colored.vert?raw'
import fragmentSource from './shaders/vertex_colored.frag?raw'

const canvas = document.getElementById('gl-canvas')
const renderer = new Renderer({
    canvas: canvas,
    depth: true,
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

// == GEOMETRY ==
// define two planes and make them intersect so we can test depth buffering
// prettier-ignore
const colorRed = new Float32Array([
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
])
const planeA = new Plane(gl, {
    width: 0.5,
    height: 0.5,
    depth: 0.0,
    attributes: {
        color: { size: 4, data: colorRed },
    },
})
const meshA = new Mesh(gl, { geometry: planeA, program })

// prettier-ignore
const colorGreen = new Float32Array([
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
])
const planeB = new Plane(gl, {
    width: 1.0,
    height: 1.0,
    depth: 0.0,
    attributes: {
        color: { size: 4, data: colorGreen },
    },
})
const meshB = new Mesh(gl, { geometry: planeB, program })

function render(now) {
    let time = now * 0.001 // in milliseconds

    let modelMatrixA = new Mat4()
    modelMatrixA.translate([0.0, 0.0, 0.0])
    program.setUniform('uModelMatrix', modelMatrixA)

    // first mesh rendered in rendering call
    renderer.render({ scene: meshA })

    // green plane (move forward)
    let modelMatrixB = new Mat4()
    // NDC coordinates are Left Handed, WebGL is right handed
    // we are only working in NDC coordinates in this example
    modelMatrixB.translate([0.0, 0.0, 0.2])
    program.setUniform('uModelMatrix', modelMatrixB)

    meshB.draw()

    // requestAnimationFrame(render)
}
requestAnimationFrame(render)
