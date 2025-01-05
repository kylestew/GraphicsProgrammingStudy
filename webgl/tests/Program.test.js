import { describe, it, expect, beforeEach } from 'vitest'
import { Program } from '../src/glib/Program.js'
import createGL from 'gl'

describe('Program', () => {
    let gl

    beforeEach(() => {
        gl = createGL(640, 480, { preserveDrawingBuffer: true })
        if (!gl) {
            throw new Error('Failed to create GL context')
        }
    })

    it('initializes with shaders and program', () => {
        const vertex = `
            attribute vec4 position;
            void main() {
                gl_Position = position;
            }
        `
        const fragment = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0);
            }
        `

        const program = new Program(gl, { vertex, fragment })

        // Ensure shaders and program are created
        expect(program.vertexShader).toBeTruthy()
        expect(program.fragmentShader).toBeTruthy()
        expect(program.program).toBeTruthy()

        // Check that the program was linked
        const linkStatus = gl.getProgramParameter(program.program, gl.LINK_STATUS)
        expect(linkStatus).toBe(true)
    })

    it('logs shader compilation errors', () => {
        const vertex = `
            attribute vec4 position;
            void main() {
                gl_Position = position;
        ` // Missing closing brace
        const fragment = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0);
            }
        `

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
        const program = new Program(gl, { vertex, fragment })

        const compileStatus = gl.getShaderParameter(program.vertexShader, gl.COMPILE_STATUS)
        expect(compileStatus).toBe(false)

        expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('ERROR'))
        consoleError.mockRestore()
    })

    it('sets and retrieves uniform values', () => {
        const vertex = `
            attribute vec4 position;
            void main() {
                gl_Position = position;
            }
        `
        const fragment = `
            precision mediump float;
            uniform float u_value;
            void main() {
                gl_FragColor = vec4(u_value);
            }
        `

        const program = new Program(gl, { vertex, fragment })
        program.setUniform('u_value', 1.0)

        expect(program.uniforms.u_value).toBe(1.0)
    })

    it('cleans up resources', () => {
        const vertex = `
            attribute vec4 position;
            void main() {
                gl_Position = position;
            }
        `
        const fragment = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0);
            }
        `

        const program = new Program(gl, { vertex, fragment })
        program.remove()

        // Check that shaders and program are deleted
        expect(() => gl.getShaderParameter(program.vertexShader, gl.COMPILE_STATUS)).toThrow()
        expect(() => gl.getProgramParameter(program.program, gl.LINK_STATUS)).toThrow()
    })
})
