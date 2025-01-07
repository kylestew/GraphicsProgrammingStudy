import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Plane } from './glib/extras/Plane.js'
import { Mesh } from './glib/Mesh.js'
import { Mat4 } from './glib/math/Mat4.js'

import vertexSource from './shaders/uv_colored.vert?raw'
import fragmentSource from './shaders/uv_colored.frag?raw'

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

// == GEOMETRY ==
// define two planes and make them intersect so we can test depth buffering
const planeA = new Plane(gl, { widthSegments: 2, heightSegments: 2 })
const meshA = new Mesh(gl, { geometry: planeA, program })

const planeB = new Plane(gl)
const meshB = new Mesh(gl, { geometry: planeB, program })

function render(now) {
    let time = now * 0.001 // in milliseconds

    let modelMatrixA = new Mat4()
    modelMatrixA.translate([0.2, 0.2, 0.0])
    program.setUniform('uModelMatrix', modelMatrixA)

    // first mesh rendered in rendering call
    renderer.render({ scene: meshA })

    let modelMatrixB = new Mat4()
    modelMatrixB.translate([-0.2, -0.2, -0.2]) // move in front (z negative towards screen)
    program.setUniform('uModelMatrix', modelMatrixB)

    meshB.draw()

    // requestAnimationFrame(render)
}
requestAnimationFrame(render)
