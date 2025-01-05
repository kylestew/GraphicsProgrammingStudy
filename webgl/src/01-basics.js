import vertexSource from './shaders/vertex_color.vert?raw'
import fragmentSource from './shaders/vertex_color.frag?raw'

function compileShader(gl, source, type) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!success) {
        console.error(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!success) {
        console.error(gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
    }
    return program
}

function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
    }
}

function init() {
    const gl = document.getElementById('gl-canvas').getContext('webgl2')
    if (!gl) {
        console.error('WebGL2 not supported')
        return
    }

    // compile/link shaders
    const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER)
    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) {
        console.error('Failed to create program')
        return
    }
    console.log('Program created successfully', program)

    // gather attribute and uniform locations
    const positionAttribLocation = gl.getAttribLocation(program, 'position') // standard 'position' for library use
    console.log('Position attribute location', positionAttribLocation)
    const colorAttribLocation = gl.getAttribLocation(program, 'aColor')
    console.log('Color attribute location', colorAttribLocation)
    const timeUniformLocation = gl.getUniformLocation(program, 'uTime')
    console.log('Time uniform location', timeUniformLocation)

    // == VAOs and Buffers ==
    // Data for the GPU pipeline is stored in Buffers
    // Buffers are basically a bag of data that can contain whatever we want
    // WebGL needs to know how to read the data from the buffer when sending it to the GPU
    // Attributes describe how to read the data from the buffer
    // VAOs combine the attributes, which buffers they come from, and how to read them into one object

    // POSITIONs
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

    // combine positions and colors into single array before uploading to GPU
    // NOTE: this doesn't have to be a single buffer
    // prettier-ignore
    const combinedData = new Float32Array([
        positions[0], positions[1], colors[0], colors[1], colors[2], colors[3],
        positions[2], positions[3], colors[4], colors[5], colors[6], colors[7],
        positions[4], positions[5], colors[8], colors[9], colors[10], colors[11],
    ])

    // upload data to GPU
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, combinedData, gl.STATIC_DRAW)

    // data is stored in a GL buffer, now we need to describe how to read it using a VAO
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    // describe how to read the data from the buffer
    const positionSize = 2 // 2 components per position (vec2)
    const colorSize = 4 // 4 components per color (vec4)
    const vertexSize = positionSize + colorSize // 6 components per vertex
    const type = gl.FLOAT // data is 32-bit floats
    const normalize = false // don't normalize the data
    const stride = vertexSize * Float32Array.BYTES_PER_ELEMENT // 6 * 4 = 24 bytes per vertex
    const offset = 0 // start at the beginning of the buffer
    const colorOffset = positionSize * Float32Array.BYTES_PER_ELEMENT // 2 * 4 = 8 bytes

    // describe and enable the position attribute
    gl.enableVertexAttribArray(positionAttribLocation)
    gl.vertexAttribPointer(positionAttribLocation, positionSize, type, normalize, stride, offset)

    // describe and enable the color attribute
    gl.enableVertexAttribArray(colorAttribLocation)
    gl.vertexAttribPointer(colorAttribLocation, colorSize, type, normalize, stride, colorOffset)

    // == DRAWING ==
    function render(now) {
        const time = now * 0.001 // in milliseconds

        // size gl drawing buffer to canvas size
        resizeCanvasToDisplaySize(gl.canvas)

        // WebGL needs to know how to convert from the clip space values back into pixels (screen space)
        // This will tell WebGL the -1 to +1 clip space maps to 0 <-> gl.canvas.width and 0 <-> gl.canvas.height
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        // clear the canvas
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        // use our shader program
        gl.useProgram(program)

        // bind the VAO
        gl.bindVertexArray(vao)

        // update uniforms - rotate the triangle
        gl.uniform1f(timeUniformLocation, time)

        // draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

init()
