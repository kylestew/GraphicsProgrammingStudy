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

// basic 1x1 plane
const geometry = new Plane(gl)
const mesh = new Mesh(gl, { geometry, program })

// TODO: second plane
//...

function render(now) {
    let time = now * 0.001 // in milliseconds

    let modelMatrix = new Mat4()
    //     // modelMatrix.translate([0.1, 0.0, 0.0])
    //     // mat4.rotate(modelMatrix, modelMatrix, time, [1.0, 0.666, 0.333])
    program.setUniform('uModelMatrix', modelMatrix)

    renderer.render({ scene: mesh })
    requestAnimationFrame(render)
}
requestAnimationFrame(render)
