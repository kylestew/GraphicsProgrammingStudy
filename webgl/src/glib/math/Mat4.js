import * as Mat4Func from './functions/Mat4Func.js'

export class Mat4 extends Array {
    constructor(
        m00 = 1,
        m01 = 0,
        m02 = 0,
        m03 = 0,
        m10 = 0,
        m11 = 1,
        m12 = 0,
        m13 = 0,
        m20 = 0,
        m21 = 0,
        m22 = 1,
        m23 = 0,
        m30 = 0,
        m31 = 0,
        m32 = 0,
        m33 = 1
    ) {
        super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)
        return this
    }

    translate(v, m = this) {
        Mat4Func.translate(this, m, v)
        return this
    }

    rotate(v, axis, m = this) {
        Mat4Func.rotate(this, m, v, axis)
        return this
    }

    scale(v, m = this) {
        Mat4Func.scale(this, m, typeof v === 'number' ? [v, v, v] : v)
        return this
    }

    static perspective(fov, aspect, near, far) {
        return Mat4Func.perspective(new Mat4(), fov, aspect, near, far)
    }

    lookAt(eye, target, up) {
        const zAxis = new Float32Array(3)
        const yAxis = new Float32Array(3)
        const xAxis = new Float32Array(3)

        // z = normalize(eye - target)
        zAxis[0] = eye[0] - target[0]
        zAxis[1] = eye[1] - target[1]
        zAxis[2] = eye[2] - target[2]
        const zLen = Math.hypot(zAxis[0], zAxis[1], zAxis[2])
        zAxis[0] /= zLen
        zAxis[1] /= zLen
        zAxis[2] /= zLen

        // x = normalize(cross(up, z))
        xAxis[0] = up[1] * zAxis[2] - up[2] * zAxis[1]
        xAxis[1] = up[2] * zAxis[0] - up[0] * zAxis[2]
        xAxis[2] = up[0] * zAxis[1] - up[1] * zAxis[0]
        const xLen = Math.hypot(xAxis[0], xAxis[1], xAxis[2])
        xAxis[0] /= xLen
        xAxis[1] /= xLen
        xAxis[2] /= xLen

        // y = cross(z, x)
        yAxis[0] = zAxis[1] * xAxis[2] - zAxis[2] * xAxis[1]
        yAxis[1] = zAxis[2] * xAxis[0] - zAxis[0] * xAxis[2]
        yAxis[2] = zAxis[0] * xAxis[1] - zAxis[1] * xAxis[0]

        // Set the matrix values
        this[0] = xAxis[0]
        this[1] = xAxis[1]
        this[2] = xAxis[2]
        this[3] = 0
        this[4] = yAxis[0]
        this[5] = yAxis[1]
        this[6] = yAxis[2]
        this[7] = 0
        this[8] = zAxis[0]
        this[9] = zAxis[1]
        this[10] = zAxis[2]
        this[11] = 0
        this[12] = eye[0]
        this[13] = eye[1]
        this[14] = eye[2]
        this[15] = 1

        // Invert the matrix since we want to transform from world to view space
        this.invert()

        return this
    }

    invert() {
        const a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3]
        const a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7]
        const a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11]
        const a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15]

        const b00 = a00 * a11 - a01 * a10
        const b01 = a00 * a12 - a02 * a10
        const b02 = a00 * a13 - a03 * a10
        const b03 = a01 * a12 - a02 * a11
        const b04 = a01 * a13 - a03 * a11
        const b05 = a02 * a13 - a03 * a12
        const b06 = a20 * a31 - a21 * a30
        const b07 = a20 * a32 - a22 * a30
        const b08 = a20 * a33 - a23 * a30
        const b09 = a21 * a32 - a22 * a31
        const b10 = a21 * a33 - a23 * a31
        const b11 = a22 * a33 - a23 * a32

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

        if (!det) return null
        det = 1.0 / det

        this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
        this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det
        this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det
        this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det
        this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det
        this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det
        this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det
        this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det
        this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det
        this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det
        this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det
        this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det
        this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det
        this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det
        this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det
        this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det

        return this
    }
}
