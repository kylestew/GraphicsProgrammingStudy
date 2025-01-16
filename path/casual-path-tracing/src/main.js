import { Renderer, Geometry, Program, Mesh, Camera } from 'ogl'

import vertexSource from './shaders/basic.vert?raw'
import fragmentSource from './shaders/basic.frag?raw'

{
    const renderer = new Renderer()
    const gl = renderer.gl
    document.body.appendChild(gl.canvas)

    // const camera = new Camera(gl)
    // camera.position.z = 5

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        // camera.perspective({
        //     aspect: gl.canvas.width / gl.canvas.height,
        // })
    }
    window.addEventListener('resize', resize, false)
    resize()

    // Big Triangle that covers viewport, with UVs that still span 0 > 1 across viewport
    const geometry = new Geometry(gl, {
        position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
        uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    })

    const program = new Program(gl, {
        vertex: vertexSource,
        fragment: fragmentSource,
        uniforms: {
            uAspect: { value: gl.canvas.width / gl.canvas.height },
        },
    })

    // Only proceed if program compiled successfully
    let successfulCompilation =
        gl.getShaderInfoLog(program.vertexShader) == '' && gl.getShaderInfoLog(program.fragmentShader) == ''

    if (successfulCompilation) {
        const mesh = new Mesh(gl, { geometry, program })

        function update(t) {
            requestAnimationFrame(update)

            const aspect = gl.canvas.width / gl.canvas.height
            program.uniforms.uAspect.value = aspect

            // renderer.render({ scene: mesh, camera })
            renderer.render({ scene: mesh })
        }
        requestAnimationFrame(update)
    } else {
        console.error('Failed to compile shader program')
    }
}
