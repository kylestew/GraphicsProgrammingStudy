import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Geometry } from './glib/Geometry.js'
import { Mesh } from './glib/Mesh.js'

import vertexSource from './shaders/basic.vert?raw'
import fragmentSource from './shaders/basic.frag?raw'

function init() {
    // 1: Setup Renderer
    const canvas = document.getElementById('gl-canvas')
    const renderer = new Renderer({
        canvas: canvas,
    })
    const gl = renderer.gl
    console.log('Renderer created successfully', renderer)

    // 1a: Handle window resize
    function resize() {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    }
    window.addEventListener('resize', resize, false)
    resize()

    // 2: Create Program
    const program = new Program(gl, vertexSource, fragmentSource)
    console.log('Program created successfully', program)

    // 3: Create Geometry
    // prettier-ignore
    const positions = new Float32Array([
        0.0, 0.0,
        0.0, 0.5,
        0.5, 0.0
    ])
    // COLORs
    // prettier-ignore
    const colors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ])
    // note: key (i.e. 'a_position') needs to match shader attribute name
    const geometry = new Geometry(gl, {
        a_position: { size: 2, data: positions },
        a_color: { size: 4, data: colors },
    })
    console.log('Geometry created successfully', geometry)

    // 4: Create Mesh (geometry + shader)
    let mesh = new Mesh(gl, { geometry, program })
    console.log('Mesh created successfully', mesh)

    // 6: Render Loop
    function render(now) {
        const time = now * 0.001 // in milliseconds

        // // update uniforms - rotate the triangle
        // const cosTheta = Math.cos(time)
        // const sinTheta = Math.sin(time)
        // // prettier-ignore
        // // UPDATE for new program stack
        // // program.uniforms.u_model.value = ...
        // gl.uniformMatrix2fv(modelUniformLocation, false, [
        //     cosTheta, sinTheta,
        //     -sinTheta, cosTheta,
        // ])

        // A MESH loads the program, geometry, and uniforms
        renderer.render({ scene: mesh })

        // requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

init()