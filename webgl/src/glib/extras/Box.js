import { Geometry } from '../Geometry.js'

export class Box extends Geometry {
    constructor(gl, { width = 1, height = 1, depth = 1, attributes = {} } = {}) {
        // half dimensions for centering the box
        const hw = width / 2
        const hh = height / 2
        const hd = depth / 2

        // prettier-ignore
        const positions = new Float32Array([
            // front face, CCW
            -hw, -hh, hd, // BL
            hw, -hh, hd,  // BR
            hw, hh, hd,   // TR
            -hw, hh, hd,  // TL
            // back face, CCW from front
            -hw, -hh, -hd,
            hw, -hh, -hd,
            hw, hh, -hd, 
            -hw, hh, -hd,
        ])

        // prettier-ignore
        const indices = new Uint16Array([
            0, 1, 2, 0, 2, 3, // front face

            4, 5, 6, 4, 6, 7, // back face (wound backwards?)

            0, 3, 7, 0, 7, 4, // left face
            1, 2, 6, 1, 6, 5, // right face
            3, 2, 6, 3, 6, 7, // top face
            0, 1, 5, 0, 5, 4, // bottom face
        ])

        // extend current attributes with new position and index data
        Object.assign(attributes, {
            aPosition: { size: 3, data: positions },
            index: { data: indices }, // index treated as ELEMENT_ARRAY_BUFFER by Geometry
        })

        // Pass attributes to the parent class
        const drawCount = indices.length
        super(gl, drawCount, attributes)
    }
}
