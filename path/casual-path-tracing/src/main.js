import { Renderer, Geometry, Program, Mesh, Camera, Vec3, Mat4, Orbit } from 'ogl'

import vertexSource from './shaders/basic.vert?raw'
import fragmentSource from './shaders/basic.frag?raw'

{
    const renderer = new Renderer({
        antialias: false,
    })
    const gl = renderer.gl
    document.body.appendChild(gl.canvas)

    const camera = new Camera(gl)
    camera.position.z = 1

    // Create controls and pass parameters
    const controls = new Orbit(camera, {
        target: new Vec3(0, 1.0, 0),
    })

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.perspective({
            aspect: gl.canvas.width / gl.canvas.height,
        })
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
            cameraPosition: { value: new Vec3() },
            aspectRatio: { value: gl.canvas.width / gl.canvas.height },
            time: { value: 0 },
        },
    })

    // Only proceed if program compiled successfully
    let successfulCompilation =
        gl.getShaderInfoLog(program.vertexShader) == '' && gl.getShaderInfoLog(program.fragmentShader) == ''

    if (successfulCompilation) {
        const mesh = new Mesh(gl, { geometry, program })

        function update(t) {
            controls.update()

            program.uniforms.aspectRatio.value = gl.canvas.width / gl.canvas.height
            program.uniforms.cameraPosition.value.copy(camera.position)
            program.uniforms.time.value = t * 0.001 // Convert to seconds

            renderer.render({ scene: mesh, camera })
            requestAnimationFrame(update)
        }
        update(0)
    } else {
        console.error('Failed to compile shader program')
    }
}
