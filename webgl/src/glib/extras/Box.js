import { Geometry } from '../Geometry.js'
import { Plane } from './Plane.js'

export class Box extends Geometry {
    constructor(gl, { width = 1, height = 1, depth = 1, attributes = {} } = {}) {
        const widthSegments = 1
        const heightSegments = 1

        const wSegs = 1
        const hSegs = 1
        const dSegs = 1

        // num vertices = left/right count + top/bottom count + front/back count
        const numLeftRight = (dSegs + 1) * (hSegs + 1)
        const numTopBottom = (wSegs + 1) * (dSegs + 1)
        const numFrontBack = (wSegs + 1) * (hSegs + 1)
        const num = numLeftRight * 2 + numTopBottom * 2 + numFrontBack * 2
        // num indices = num segments per face * number of faces * 6 positions per segment
        const segCountLeftRight = dSegs * hSegs * 6
        const segCountTopBottom = wSegs * dSegs * 6
        const segCountFrontBack = wSegs * hSegs * 6
        const numIndices = segCountLeftRight * 2 + segCountTopBottom * 2 + segCountFrontBack * 2

        const position = new Float32Array(num * 3)
        const normal = new Float32Array(num * 3)
        const uv = new Float32Array(num * 2)
        const index = numIndices > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices)

        let i = 0
        let ii = 0

        // left
        Plane.buildPlane(position, normal, uv, index, depth, height, -width, dSegs, hSegs, 2, 1, 0, 1, -1, i, ii)
        i += numLeftRight
        ii += segCountLeftRight
        // right
        Plane.buildPlane(position, normal, uv, index, depth, height, width, dSegs, hSegs, 2, 1, 0, -1, -1, i, ii)
        i += numLeftRight
        ii += segCountLeftRight

        // top
        Plane.buildPlane(position, normal, uv, index, width, depth, height, dSegs, wSegs, 0, 2, 1, 1, 1, i, ii)
        i += numTopBottom
        ii += segCountTopBottom
        // bottom
        Plane.buildPlane(position, normal, uv, index, width, depth, -height, dSegs, wSegs, 0, 2, 1, 1, -1, i, ii)
        i += numTopBottom
        ii += segCountTopBottom

        // front
        Plane.buildPlane(position, normal, uv, index, width, height, depth, wSegs, hSegs, 0, 1, 2, 1, -1, i, ii)
        i += numFrontBack
        ii += segCountFrontBack
        // back
        Plane.buildPlane(position, normal, uv, index, width, height, -depth, wSegs, hSegs, 0, 1, 2, -1, -1, i, ii)

        Object.assign(attributes, {
            position: { size: 3, data: position },
            normal: { size: 3, data: normal },
            uv: { size: 2, data: uv },
            index: { data: index },
        })

        super(gl, attributes)
    }
}
