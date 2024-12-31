export class Program {
    constructor(gl, vertSrc, fragSrc) {
        if (!gl.canvas) console.error('gl not passed as first argument to Program')
        this.gl = gl

        // create empty shaders and attach to program
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER)
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        this.program = gl.createProgram()
        gl.attachShader(this.program, this.vertexShader)
        gl.attachShader(this.program, this.fragmentShader)

        this.setShaders(vertSrc, fragSrc)
    }

    setShaders(vertSrc, fragSrc) {
        this.gl.shaderSource(this.vertexShader, vertSrc)
        this.gl.compileShader(this.vertexShader)
        let success = this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)
        if (!success) {
            console.error(`${this.gl.getShaderInfoLog(this.vertexShader)}\nVertex Shader\n${addLineNumbers(vertex)}`)
        }

        this.gl.shaderSource(this.fragmentShader, fragSrc)
        this.gl.compileShader(this.fragmentShader)
        success = this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)
        if (!success) {
            console.error(
                `${this.gl.getShaderInfoLog(this.fragmentShader)}\nFragment Shader\n${addLineNumbers(fragSrc)}`
            )
        }

        // compile program and log errors
        this.gl.linkProgram(this.program)
        success = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)
        if (!success) {
            console.error(`${this.gl.getProgramInfoLog(this.program)}\nProgram`)
        }

        // get active uniform locations
        this.uniformLocations = new Map()
        let numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS)
        for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
            let uniform = this.gl.getActiveUniform(this.program, uIndex)
            this.uniformLocations.set(uniform.name, this.gl.getUniformLocation(this.program, uniform.name))
        }

        // get active attribute locations
        this.attributeLocations = new Map()
        const locations = []
        const numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES)
        for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
            const attrib = this.gl.getActiveAttrib(this.program, aIndex)
            const location = this.gl.getAttribLocation(this.program, attrib.name)
            locations[location] = attrib.name
            this.attributeLocations.set(attrib.name, location)
        }
    }

    use() {
        this.gl.useProgram(this.program)

        // TODO: is the program in charge of activating uniforms?
    }

    remove() {
        this.gl.deleteShader(this.vertexShader)
        this.gl.deleteShader(this.fragmentShader)
        this.gl.deleteProgram(this.program)
    }
}

function addLineNumbers(string) {
    let lines = string.split('\n')
    for (let i = 0; i < lines.length; i++) {
        lines[i] = i + 1 + ': ' + lines[i]
    }
    return lines.join('\n')
}
