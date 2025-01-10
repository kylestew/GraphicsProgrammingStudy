// https://github.com/oframe/ogl/blob/master/src/core/Renderer.js

export class Renderer {
    constructor({
        canvas = document.createElement('canvas'),
        width = 800,
        height = 600,
        dpr = 1,
        alpha = false,
        depth = true,
    } = {}) {
        const attributes = { alpha, depth }
        this.dpr = dpr
        this.alpha = alpha
        this.depth = depth

        this.gl = canvas.getContext('webgl2', attributes)
        if (!this.gl) console.error('WebGL2 not supported')

        // attach renderer to gl so all classes have access to internal state functions
        this.gl.renderer = this

        // initialize size values
        this.setSize(width, height)
    }

    setSize(width, height) {
        this.width = width
        this.height = height

        this.gl.canvas.width = width * this.dpr
        this.gl.canvas.height = height * this.dpr
    }

    setViewport(width, height) {
        // WebGL needs to know how to convert from the clip space values back into pixels (screen space)
        // This will tell WebGL the -1 to +1 clip space maps to 0 <-> gl.canvas.width and 0 <-> gl.canvas.height
        this.gl.viewport(0, 0, width, height)
    }

    setFaceCulling({ enabled = true, face = null, frontFace = null } = {}) {
        if (enabled) {
            this.gl.enable(this.gl.CULL_FACE)

            // Set which face to cull if specified
            if (face) {
                this.gl.cullFace(face)
            }

            // Set front face winding order if specified
            if (frontFace) {
                this.gl.frontFace(frontFace)
            }
        } else {
            this.gl.disable(this.gl.CULL_FACE)
        }
    }

    render({ scene, update = true }) {
        this.setViewport(this.width * this.dpr, this.height * this.dpr)

        // ensure depth buffer writing is enabled so it can be cleared
        if (this.depth) {
            this.gl.enable(this.gl.DEPTH_TEST)
            this.gl.depthMask(true)
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0))

        // updates all scene graph matrices
        if (update) scene.updateMatrixWorld()

        // TODO: get list of renderables
        // for now just render the scene directly
        scene.draw()
    }
}
