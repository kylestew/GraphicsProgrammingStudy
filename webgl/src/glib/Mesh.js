let ID = 0

export class Mesh {
    constructor(gl, { geometry, program, mode = gl.TRIANGLES }) {
        if (!gl.canvas) console.error('gl not passed as first argument to Mesh')
        this.gl = gl
        this.id = ID++

        this.geometry = geometry
        this.program = program
        this.mode = mode

        // create a VAO for this mesh
        // TODO: mesh is in charge of VAOs since they describe how the program should interpret the geometry
        this.createVAO(program)
    }

    createVAO(program) {
        const vao = this.gl.createVertexArray()
        this.gl.bindVertexArray(vao)
        this.vao = vao

        // for each attribute we created a buffer for (Geometry)
        for (let key in this.geometry.attributes) {
            const attr = this.geometry.attributes[key]

            const attribLocation = this.gl.getAttribLocation(program.program, key)
            console.log('Attrib location', attribLocation, key)

            // describe and enable the position attribute
            this.gl.bindBuffer(attr.target, attr.buffer)
            this.gl.vertexAttribPointer(attribLocation, attr.size, attr.type, attr.normalized, attr.stride, attr.offset)
            this.gl.enableVertexAttribArray(attribLocation)
        }
        this.gl.bindVertexArray(null) // just in case
    }

    draw() {
        this.program.use()

        // mesh is in charge of binding the VAO
        this.gl.bindVertexArray(this.vao)

        this.geometry.draw({ mode: this.mode, program: this.program })

        // unbind the VAO just in case
        this.gl.bindVertexArray(null)
    }
}
