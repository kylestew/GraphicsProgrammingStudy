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
}
