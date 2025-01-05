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
    constructor(gl, attributes = {}) {
        if (!gl.canvas) console.error('gl not passed as first argument to Geometry')
        this.gl = gl
        this.attributes = {}
        this.id = ID++

        // create the buffers
        for (let key in attributes) {
            this.addAttribute(key, attributes[key])
        }

        // try to infer the element draw count
        this.drawCount = 0
        if (this.indexAttribute) {
            this.drawCount = this.indexAttribute.count
        } else if (this.attributes.position) {
            this.drawCount = this.attributes.position.count
        }

        console.log('Geometry Created', this.drawCount, this.attributes, 'indexed?', this.indexAttribute)
    }

    addAttribute(key, attr) {
        attr.id = ATTR_ID++
        attr.size = attr.size || 1
        attr.type =
            attr.type ||
            (attr.data.constructor === Float32Array
                ? this.gl.FLOAT
                : attr.data.constructor === Uint16Array
                ? this.gl.UNSIGNED_SHORT
                : this.gl.UNSIGNED_INT) // Uint32Array
        attr.target = attr.target || key === 'index' ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER
        attr.normalized = attr.normalized || false

        attr.stride = attr.stride || 0
        attr.offset = attr.offset || 0
        attr.count = attr.count || attr.data.length / attr.size

        attr.usage = attr.usage || this.gl.STATIC_DRAW

        attr.needsUpdate = false

        if (key === 'index') {
            // store for later update - VAO needs to be bound before uploading to GL buffer
            attr.needsUpdate = true
            this.indexAttribute = attr
        } else {
            this.attributes[key] = attr

            if (!attr.buffer) {
                // push data to buffer
                this.updateAttribute(attr)
            }
        }
    }

    updateAttribute(attr) {
        const isNewBuffer = !attr.buffer
        if (isNewBuffer) attr.buffer = this.gl.createBuffer()
        this.gl.bindBuffer(attr.target, attr.buffer)

        if (isNewBuffer) {
            this.gl.bufferData(attr.target, attr.data, attr.usage)
            console.log(
                'Binding Buffer',
                attr.id,
                attr.target == this.gl.ARRAY_BUFFER ? 'ARRAY_BUFFER' : 'ELEMENT_ARRAY_BUFFER',
                attr.data.length,
                attr.data.constructor
            )
        } else {
            console.error('buffer already exist, use .bufferSubData() instead')
        }
        attr.needsUpdate = false
    }

    setDrawCount(count) {
        this.drawCount = count
    }

    draw({ mode = this.gl.TRIANGLES }) {
        if (this.drawCount <= 0) {
            console.warn('No elements to draw for', this)
            return
        }

        if (this.indexAttribute) {
            if (this.indexAttribute.needsUpdate) {
                this.updateAttribute(this.indexAttribute)
            }
            this.gl.drawElements(mode, this.drawCount, this.gl.UNSIGNED_SHORT, 0)
        } else {
            this.gl.drawArrays(mode, 0, this.drawCount)
        }
    }

    remove() {
        for (let key in this.attributes) {
            this.gl.deleteBuffer(this.attributes[key].buffer)
            delete this.attributes[key]
        }
    }
}
