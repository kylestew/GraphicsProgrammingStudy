import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Geometry } from './glib/Geometry.js'
import { Mesh } from './glib/Mesh.js'

const vertexSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 position;
in vec4 color;

uniform float uTime;

out vec4 v_color;

void main() {
    // Convert 2D position to 4d (homogeneous coordinates)
    // gl_Position is a special variable a vertex shader is responsible for setting
    vec2 pos = position;
    pos.y += 0.3 * sin(uTime * 1.2);
    pos.x += 0.3 * cos(uTime);
    gl_Position = vec4(pos, 0.0, 1.0);

    v_color = color;
}
`

const fragmentSource = `#version 300 es

// fragment shaders don't have a default precision - vertex shaders default to highp
precision mediump float;

in vec4 v_color;

out vec4 fragColor;

// The fragment shader's job is to output the color of the pixel
void main() {
    fragColor = v_color;
}
`

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
    const program = new Program(gl, {
        vertex: vertexSource,
        fragment: fragmentSource,
        // uniforms: {
        //     uTime: { value: 0 },
        // },
    })
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
    // note: key (i.e. 'aPosition') needs to match shader attribute name
    const geometry = new Geometry(gl, {
        position: { size: 2, data: positions },
        color: { size: 4, data: colors },
    })
    console.log('Geometry created successfully', geometry)

    // 4: Create Mesh (geometry + shader)
    let mesh = new Mesh(gl, { geometry, program })
    console.log('Mesh created successfully', mesh)

    // 5: Render Loop
    function render(now) {
        const time = now * 0.001 // in milliseconds
        program.setUniform('uTime', time)

        // A MESH loads the program, geometry, and uniforms
        renderer.render({ scene: mesh })

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

init()
