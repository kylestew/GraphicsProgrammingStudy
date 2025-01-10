import { Renderer } from './glib/Renderer.js'
import { Program } from './glib/Program.js'
import { Mesh } from './glib/Mesh.js'
import { Box } from './glib/extras/Box.js'
import { Mat4 } from './glib/math/Mat4.js'

const vertexSource = `#version 300 es

in vec3 position;
in vec3 normal;
in vec2 uv;
in vec4 color;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;

out vec4 v_color;

void main() {
    gl_Position = uProjectionMatrix * uModelMatrix * vec4(position, 1.0);
    v_color     = color;
}
`
import fragmentSource from './shaders/vertex_colored.frag?raw'

const canvas = document.getElementById('gl-canvas')
const renderer = new Renderer({
    canvas: canvas,
})
const gl = renderer.gl

// Enable face culling
renderer.setFaceCulling({
    enabled: true,
    face: gl.BACK,
    frontFace: gl.CCW,
})

function resize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
}
window.addEventListener('resize', resize, false)
resize()

const program = new Program(gl, {
    vertex: vertexSource,
    fragment: fragmentSource,
})

// prettier-ignore
const colors = new Float32Array([
    // Red
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    // Green
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    // Blue
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    // Yellow
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    // Cyan
    0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    // Magenta
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
]);

const box = new Box(gl, {
    attributes: {
        color: { size: 4, data: colors },
    },
})
const mesh = new Mesh(gl, { geometry: box, program })

let rotationY = 0
let rotationX = 0
let rotationZ = 0
function render(now) {
    rotationX += 0.01
    rotationY += 0.005
    rotationZ += 0.008

    let modelMatrix = new Mat4()
    modelMatrix.translate([0.0, 0.0, -3.0]) // move away from the fake camera
    modelMatrix.rotate(rotationX, [1.0, 0.0, 0.0])
    modelMatrix.rotate(rotationY, [0.0, 1.0, 0.0])
    modelMatrix.rotate(rotationZ, [0.0, 0.0, 1.0])
    program.setUniform('uModelMatrix', modelMatrix)

    // Projection Matrix
    // just remake it each time with aspect ratio
    // this.projectionMatrix.fromPerspective({ fov: fov * (Math.PI / 180), aspect, near, far });
    let fov = Math.PI / 4 // 45 degrees
    let aspect = gl.canvas.width / gl.canvas.height
    let near = 0.1
    let far = 100
    const perspectiveMatrix = Mat4.perspective(fov, aspect, near, far)
    program.setUniform('uProjectionMatrix', perspectiveMatrix)

    renderer.render({ scene: mesh })
    requestAnimationFrame(render)
}
requestAnimationFrame(render)
