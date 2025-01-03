import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Mesh } from './glib/Mesh.js'
import { Box } from './glib/extras/Box.js'

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

const geometry = new Box(gl)
const mesh = new Mesh(gl, { geometry, program })

function render(now) {
    //     //     const time = now * 0.001 // in milliseconds
    //     //     program.setUniform('uTime', time)

    //     // mesh.rotation.y -= 0.04
    //     // mesh.rotation.x += 0.03
    // // rotate
    // // scale matrices

    renderer.render({ scene: mesh })

    // requestAnimationFrame(render)
}
requestAnimationFrame(render)
