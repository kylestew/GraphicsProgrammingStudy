import { Transform } from './Transform'

let ID = 0

export class Mesh extends Transform {
    constructor(gl, { geometry, program, mode = gl.TRIANGLES }) {
        super()

        if (!gl.canvas) console.error('gl not passed as first argument to Mesh')
        this.gl = gl
        this.id = ID++

        this.geometry = geometry
        this.program = program
        this.mode = mode

        // this.modelViewMatrix = new Mat4()

        // mesh is in charge of VAOs since they describe how the program should interpret the geometry
        this.createVAO()
    }

    createVAO() {
        // create a VAO for this mesh
        const vao = this.gl.createVertexArray()
        this.gl.bindVertexArray(vao)
        this.vao = vao

        // for each attribute we created a buffer for (Geometry)
        for (let key in this.geometry.attributes) {
            const attr = this.geometry.attributes[key]
            const attribLocation = this.gl.getAttribLocation(this.program.program, key)

            // describe and enable the position attribute
            this.gl.bindBuffer(attr.target, attr.buffer)
            this.gl.vertexAttribPointer(attribLocation, attr.size, attr.type, attr.normalized, attr.stride, attr.offset)
            this.gl.enableVertexAttribArray(attribLocation)
            console.log(
                'Binding Attribute',
                key,
                attr.size,
                attr.type == this.gl.FLOAT ? 'FLOAT' : 'other',
                attr.normalized,
                attr.stride,
                attr.offset,
                attr.data.constructor
            )
        }
    }

    /*
        bindAttributes(program) {
        // Link all attributes to program using gl.vertexAttribPointer
        program.attributeLocations.forEach((location, { name, type }) => {
            // If geometry missing a required shader attribute
            if (!this.attributes[name]) {
                console.warn(`active attribute ${name} not being supplied`);
                return;
            }

            const attr = this.attributes[name];

            this.gl.bindBuffer(attr.target, attr.buffer);
            this.glState.boundBuffer = attr.buffer;

            // For matrix attributes, buffer needs to be defined per column
            let numLoc = 1;
            if (type === 35674) numLoc = 2; // mat2
            if (type === 35675) numLoc = 3; // mat3
            if (type === 35676) numLoc = 4; // mat4

            const size = attr.size / numLoc;
            const stride = numLoc === 1 ? 0 : numLoc * numLoc * 4;
            const offset = numLoc === 1 ? 0 : numLoc * 4;

            for (let i = 0; i < numLoc; i++) {
                this.gl.vertexAttribPointer(location + i, size, attr.type, attr.normalized, attr.stride + stride, attr.offset + i * offset);
                this.gl.enableVertexAttribArray(location + i);

                // For instanced attributes, divisor needs to be set.
                // For firefox, need to set back to 0 if non-instanced drawn after instanced. Else won't render
                this.gl.renderer.vertexAttribDivisor(location + i, attr.divisor);
            }
        });

        // Bind indices if geometry indexed
        if (this.attributes.index) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
    }
    */

    draw() {
        // add empty matrix uniforms to program if unset
        if (!this.program.uniforms.modelMatrix) {
            Object.assign(this.program.uniforms, {
                modelMatrix: { value: null },
            })
        }

        this.program.use()

        // mesh is in charge of binding the VAO
        this.gl.bindVertexArray(this.vao)

        this.geometry.draw({ mode: this.mode })

        // unbind the VAO just in case
        this.gl.bindVertexArray(null)
    }
}
