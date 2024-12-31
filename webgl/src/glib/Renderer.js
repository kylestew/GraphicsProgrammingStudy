// https://github.com/oframe/ogl/blob/master/src/core/Renderer.js

export class Renderer {
    constructor({ canvas = document.createElement('canvas'), width = 800, height = 600, dpr = 1 } = {}) {
        const attributes = {}

        this.gl = canvas.getContext('webgl2', attributes)
        if (!this.gl) console.error('WebGL2 not supported')

        // attach renderer to gl so all classes have access to internal state functions
        this.gl.renderer = this

        this.dpr = dpr

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

    render({ scene }) {
        this.setViewport(this.width * this.dpr, this.height * this.dpr)

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        // TODO: get list of renderables
        // for now just render the scene directly
        scene.draw()
    }
}