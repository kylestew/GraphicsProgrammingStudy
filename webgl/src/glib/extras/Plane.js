import { Geometry } from '../Geometry'

export class Plane extends Geometry {
    constructor(gl, { width = 1, height = 1, attributes = {} } = {}) {
        // determine length of arrays
        const num = 4
        // const numIndices = 12

        const position = new Float32Array(num * 3)
        const normal = new Float32Array(num * 3)
        const uv = new Float32Array(num * 2)
        const index = new Uint16Array(6)
        Plane.buildSimplePlane(position, normal, uv, index, width, height)

        Object.assign(attributes, {
            position: { size: 3, data: position },
            // normal: { size: 3, data: normal },
            uv: { size: 2, data: uv },
            index: { data: index },
        })

        super(gl, attributes)
    }

    /**
     * Generates a single-segment plane geometry in 3D space.
     *
     * @param {Float32Array} position - An array to store the 3D positions of the plane's vertices.
     * @param {Float32Array} normal - An array to store the normals (perpendicular vectors) for each vertex.
     * @param {Float32Array} uv - An array to store the texture coordinates for each vertex.
     * @param {Uint16Array} index - An array to store the indices defining how vertices connect into triangles.
     * @param {number} width - The width of the plane.
     * @param {number} height - The height of the plane.
     */
    static buildSimplePlane(position, normal, uv, index, width, height) {
        const halfWidth = width / 2
        const halfHeight = height / 2

        // define axis index for plane axis
        const u = 0
        const v = 1
        const w = 2

        // define direction of axis
        const uDir = 1
        const vDir = 1

        // 4 vertices for a single quad
        const vertices = [
            [-halfWidth, -halfHeight], // bottom-left
            [halfWidth, -halfHeight], // bottom-right
            [halfWidth, halfHeight], // top-right
            [-halfWidth, halfHeight], // top-left
        ]

        for (let i = 0; i < 4; i++) {
            const x = vertices[i][0]
            const y = vertices[i][1]

            // set vertex position
            position[i * 3 + u] = x * uDir
            position[i * 3 + v] = y * vDir
            position[i * 3 + w] = 0

            // set the vertex normal
            normal[i * 3 + u] = 0
            normal[i * 3 + v] = 0
            normal[i * 3 + w] = 1

            // set the texture coordinate (UV mapping)
            uv[i * 2] = (x + halfWidth) / width
            uv[i * 2 + 1] = 1 - (y + halfHeight) / height
        }

        index[0] = 0
        index[0] = 1
        index[2] = 2
        index[3] = 0
        index[4] = 2
        index[5] = 3
    }
}
