import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Plane } from './glib/extras/Plane.js'

import { Mesh } from './glib/Mesh.js'
import { Geometry } from './glib/Geometry.js'
import { Mat4 } from './glib/math/Mat4.js'

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

// basic 1x1 plane
const geometry = new Plane(gl)
console.log(geometry)

// const mesh = new Mesh(gl, { geometry, program })

// function render(now) {
//     let time = now * 0.001 // in milliseconds

//     // prettier-ignore
//     let modelMatrix = new Mat4()
//     // modelMatrix.translate([0.1, 0.0, 0.0])
//     // mat4.rotate(modelMatrix, modelMatrix, time, [1.0, 0.666, 0.333])
//     // program.setUniform('uModelMatrix', modelMatrix)
//     // console.log(modelMatrix)

//     // renderer.render({ scene: mesh })
//     // requestAnimationFrame(render)
// }
// requestAnimationFrame(render)
