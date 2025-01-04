let ID = 1

export class Program {
    constructor(gl, { vertex, fragment, uniforms = {} }) {
        if (!gl.canvas) console.error('gl not passed as first argument to Program')
        this.gl = gl
        this.id = ID++
        this.uniforms = uniforms

        // create empty shaders and attach to program
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER)
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        this.program = gl.createProgram()
        gl.attachShader(this.program, this.vertexShader)
        gl.attachShader(this.program, this.fragmentShader)

        this.setShaders(vertex, fragment)
    }

    setShaders(vertSrc, fragSrc) {
        this.gl.shaderSource(this.vertexShader, vertSrc)
        this.gl.compileShader(this.vertexShader)
        let success = this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)
        if (!success) {
            console.error(`${this.gl.getShaderInfoLog(this.vertexShader)}\nVertex Shader\n${addLineNumbers(vertSrc)}`)
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
            this.uniformLocations.set(uniform, this.gl.getUniformLocation(this.program, uniform.name))
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

    setUniform(name, value) {
        this.uniforms[name] = value
    }

    use() {
        this.gl.useProgram(this.program)

        // Update uniforms
        this.uniformLocations.forEach((location, activeUniform) => {
            const uniform = this.uniforms[activeUniform.name]

            if (uniform === undefined) {
                console.warn(`Uniform "${activeUniform.name}" has no value set.`)
                return
            }

            setUniform(this.gl, activeUniform.type, location, uniform)
        })
    }

    remove() {
        this.gl.deleteShader(this.vertexShader)
        this.gl.deleteShader(this.fragmentShader)
        this.gl.deleteProgram(this.program)
    }
}

function setUniform(gl, type, location, value) {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#uniform_types
    switch (type) {
        case gl.FLOAT:
            gl.uniform1f(location, value)
            break
        case gl.FLOAT_VEC2:
            gl.uniform2fv(location, value)
            break
        case gl.FLOAT_VEC3:
            gl.uniform3fv(location, value)
            break
        case gl.FLOAT_VEC4:
            gl.uniform4fv(location, value)
            break
        case gl.SAMPLER_2D:
            gl.uniform1i(location, value)
            break
        case gl.SAMPLER_2D_ARRAY:
            gl.uniform1iv(location, value)
            break
        case gl.FLOAT_MAT2:
            return gl.uniformMatrix2fv(location, false, value)
        case gl.FLOAT_MAT3:
            return gl.uniformMatrix3fv(location, false, value)
        case gl.FLOAT_MAT4:
            return gl.uniformMatrix4fv(location, false, value)

        // Add other cases as needed
        default:
            console.error(`Unhandled uniform type: ${type}`)
    }
}

function addLineNumbers(string) {
    let lines = string.split('\n')
    for (let i = 0; i < lines.length; i++) {
        lines[i] = i + 1 + ': ' + lines[i]
    }
    return lines.join('\n')
}
