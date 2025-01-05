const EPSILON = 0.000001

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
export function translate(out, a, v) {
    let x = v[0],
        y = v[1],
        z = v[2]
    let a00, a01, a02, a03
    let a10, a11, a12, a13
    let a20, a21, a22, a23

    // multiply only what's needed for efficiency
    if (a === out) {
        // only the bottom row is effected
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
    } else {
        // copy first 3 rows directly
        a00 = a[0]
        a01 = a[1]
        a02 = a[2]
        a03 = a[3]
        a10 = a[4]
        a11 = a[5]
        a12 = a[6]
        a13 = a[7]
        a20 = a[8]
        a21 = a[9]
        a22 = a[10]
        a23 = a[11]

        out[0] = a00
        out[1] = a01
        out[2] = a02
        out[3] = a03
        out[4] = a10
        out[5] = a11
        out[6] = a12
        out[7] = a13
        out[8] = a20
        out[9] = a21
        out[10] = a22
        out[11] = a23

        // only the bottom row is effected
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
    }
    return out
}

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
export function rotate(out, a, rad, axis) {
    let x = axis[0],
        y = axis[1],
        z = axis[2]
    let len = Math.hypot(x, y, z)

    if (Math.abs(len) < EPSILON) {
        return null
    }

    // normalize axis vector
    len = 1 / len
    x *= len
    y *= len
    z *= len

    // construct the elements of the rotation matrix
    // https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
    let s = Math.sin(rad)
    let c = Math.cos(rad)
    let t = 1 - c
    let b00 = x * x * t + c
    let b01 = y * x * t + z * s
    let b02 = z * x * t - y * s
    let b10 = x * y * t - z * s
    let b11 = y * y * t + c
    let b12 = z * y * t + x * s
    let b20 = x * z * t + y * s
    let b21 = y * z * t - x * s
    let b22 = z * z * t + c

    // cache 3x4 top half of original matrix so it doesn't get clobbered during multiplication
    let a00 = a[0]
    let a01 = a[1]
    let a02 = a[2]
    let a03 = a[3]
    let a10 = a[4]
    let a11 = a[5]
    let a12 = a[6]
    let a13 = a[7]
    let a20 = a[8]
    let a21 = a[9]
    let a22 = a[10]
    let a23 = a[11]

    // perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02
    out[1] = a01 * b00 + a11 * b01 + a21 * b02
    out[2] = a02 * b00 + a12 * b01 + a22 * b02
    out[3] = a03 * b00 + a13 * b01 + a23 * b02
    out[4] = a00 * b10 + a10 * b11 + a20 * b12
    out[5] = a01 * b10 + a11 * b11 + a21 * b12
    out[6] = a02 * b10 + a12 * b11 + a22 * b12
    out[7] = a03 * b10 + a13 * b11 + a23 * b12
    out[8] = a00 * b20 + a10 * b21 + a20 * b22
    out[9] = a01 * b20 + a11 * b21 + a21 * b22
    out[10] = a02 * b20 + a12 * b21 + a22 * b22
    out[11] = a03 * b20 + a13 * b21 + a23 * b22

    if (a !== out) {
        // if source and destination differ, copy the unchanged last row
        out[12] = a[12]
        out[13] = a[13]
        out[14] = a[14]
        out[15] = a[15]
    }
    return out
}

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
export function scale(out, a, v) {
    let x = v[0],
        y = v[1],
        z = v[2]

    out[0] = a[0] * x
    out[1] = a[1] * x
    out[2] = a[2] * x
    out[3] = a[3] * x

    out[4] = a[4] * y
    out[5] = a[5] * y
    out[6] = a[6] * y
    out[7] = a[7] * y

    out[8] = a[8] * z
    out[9] = a[9] * z
    out[10] = a[10] * z
    out[11] = a[11] * z

    out[12] = a[12]
    out[13] = a[13]
    out[14] = a[14]
    out[15] = a[15]
}
