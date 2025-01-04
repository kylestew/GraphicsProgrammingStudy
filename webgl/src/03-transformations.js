import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Mesh } from './glib/Mesh.js'
import { Geometry } from './glib/Geometry.js'
import { mat4 } from 'gl-matrix'

import vertexSource from './shaders/model_trans.vert?raw'
import fragmentSource from './shaders/basic.frag?raw'

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

// GEOEMETRY: A flat plane (two triangles)
// prettier-ignore
const positions = new Float32Array([
    // bottom triangle
    -0.5, -0.5, 0.0,
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    // top triangle
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.5, 0.5, 0.0,
])
// COLORs
// prettier-ignore
const colors = new Float32Array([
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0, // red
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0, // green
])
const geometry = new Geometry(gl, 6, {
    aPosition: { size: 3, data: positions },
    aColor: { size: 4, data: colors },
})
const mesh = new Mesh(gl, { geometry, program })

function render(now) {
    let time = now * 0.001 // in milliseconds

    // prettier-ignore
    let modelMatrix = mat4.create()
    mat4.rotate(modelMatrix, modelMatrix, time, [1.0, 0.666, 0.333])
    program.setUniform('uModelMatrix', modelMatrix)

    renderer.render({ scene: mesh })
    requestAnimationFrame(render)
}
requestAnimationFrame(render)
