import { Geometry } from '../Geometry'

export class Plane extends Geometry {
    constructor(gl, { width = 1, height = 1, depth = 0, widthSegments = 1, heightSegments = 1, attributes = {} } = {}) {
        const num = (widthSegments + 1) * (heightSegments + 1)
        const numIndices = widthSegments * heightSegments * 6

        const position = new Float32Array(num * 3)
        const normal = new Float32Array(num * 3)
        const uv = new Float32Array(num * 2)
        const index = numIndices > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices)

        Plane.buildPlane(position, normal, uv, index, width, height, depth, widthSegments, heightSegments)

        Object.assign(attributes, {
            position: { size: 3, data: position },
            normal: { size: 3, data: normal },
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
     * @param {number} depth - The depth of the plane.
     * @param {number} wSegments - segments along width of plane.
     * @param {number} hSegments - segments along height of plane.
     * @param {number} u - which axis (x, y, z) maps to u
     * @param {number} v - which axis (x, y, z) maps to v
     * @param {number} w - which axis (x, y, z) maps to w
     * @param {number} uDir - ???
     * @param {number} vDir - ???
     * @param {number} i - position/normal/UV offset (allows use of this method to build multiple planes into one buffer)
     * @param {number} ii - index offset (same as above)
     */
    static buildPlane(
        position,
        normal,
        uv,
        index,
        width,
        height,
        depth,
        wSegments,
        hSegments,
        u = 0,
        v = 1,
        w = 2,
        uDir = 1,
        vDir = -1,
        i = 0,
        ii = 0
    ) {
        const segW = width / wSegments
        const segH = height / hSegments

        for (let iy = 0; iy <= hSegments; iy++) {
            let y = iy * segH - height / 2
            for (let ix = 0; ix <= wSegments; ix++, i++) {
                let x = ix * segW - width / 2

                // positions created in u, v, w space
                position[i * 3 + u] = x * uDir
                position[i * 3 + v] = y * vDir
                position[i * 3 + w] = depth / 2

                // planar normal always in one axis
                normal[i * 3 + u] = 0
                normal[i * 3 + v] = 0
                normal[i * 3 + w] = depth >= 0 ? 1 : -1

                // mark uv position on plane, w value not needed on flat plane
                uv[i * 2] = ix / wSegments
                uv[i * 2 + 1] = 1 - iy / hSegments

                // calculate indices for quads (two triangles)
                if (ix < wSegments && iy < hSegments) {
                    const a = i // top-left
                    const b = i + 1 // top-right
                    const c = i + wSegments + 1 // bottom-left
                    const d = i + wSegments + 2 // bottom-right

                    // first triangle (a, c, b)
                    index[ii++] = a
                    index[ii++] = c
                    index[ii++] = b

                    // second triangle (b, c, d)
                    index[ii++] = b
                    index[ii++] = c
                    index[ii++] = d
                }
            }
        }
    }
}
