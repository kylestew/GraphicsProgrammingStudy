// Attribute Params
// {
//  data - typed array eg UInt16Array for indices, Float32Array, etc
//  size - int default 1
//  type - gl enum default gl.UNSIGNED_SHORT for 'index', gl.FLOAT for others
//  normalized - boolean default false
//  buffer - gl buffer, if exists, don't provide data
// }

let ID = 1
let ATTR_ID = 1

export class Geometry {
    constructor(gl, drawCount, attributes = {}) {
        if (!gl.canvas) console.error('gl not passed as first argument to Geometry')
        this.gl = gl
        this.attributes = attributes
        this.id = ID++

        this.drawCount = drawCount

        // create the buffers
        for (let key in attributes) {
            this.addAttribute(key, attributes[key])
        }
    }

    addAttribute(key, attr) {
        this.attributes[key] = attr

        // set options that describe the mesh
        attr.id = ATTR_ID++
        attr.size = attr.size || 1
        attr.type =
            attr.type ||
            (attr.data.constructor === Float32Array
                ? this.gl.FLOAT
                : attr.data.constructor === Uint16Array
                ? this.gl.UNSIGNED_SHORT
                : this.gl.UNSIGNED_INT) // Uint32Array
        attr.target = key === 'index' ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER
        attr.normalized = attr.normalized || false

        attr.stride = attr.stride || 0
        attr.offset = attr.offset || 0

        attr.usage = attr.usage || this.gl.STATIC_DRAW

        if (!attr.buffer) {
            // push data to buffer
            this.updateAttribute(attr)
        }
    }

    updateAttribute(attr) {
        const isNewBuffer = !attr.buffer
        if (isNewBuffer) attr.buffer = this.gl.createBuffer()
        this.gl.bindBuffer(attr.target, attr.buffer)

        if (isNewBuffer) {
            this.gl.bufferData(attr.target, attr.data, attr.usage)
        } else {
            console.error('buffer already exist, use .bufferSubData() instead')
        }
    }

    draw({ mode = this.gl.TRIANGLES }) {
        this.gl.drawArrays(mode, 0, this.drawCount)
    }

    remove() {
        for (let key in this.attributes) {
            this.gl.deleteBuffer(this.attributes[key].buffer)
            delete this.attributes[key]
        }
    }
}
