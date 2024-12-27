/*
https://github.com/greggman/twgl.js/blob/master/src/v3.js
*/
let VecType = Float32Array

class Vec3 {
    data: Float32Array

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        const dst = new VecType(3)
        dst[0] = x
        dst[1] = y
        dst[2] = z
        this.data = dst
    }

    get x() {
        return this.data[0]
    }
    get y() {
        return this.data[1]
    }
    get z() {
        return this.data[2]
    }

    add(b: Vec3) {
        return new Vec3(this.x + b.x, this.y + b.y, this.z + b.z)
    }
    sub(b: Vec3) {
        return new Vec3(this.x - b.x, this.y - b.y, this.z - b.z)
    }

    mulScalar(k: number) {
        return new Vec3(this.x * k, this.y * k, this.z * k)
    }
    divScalar(k: number) {
        return new Vec3(this.x / k, this.y / k, this.z / k)
    }

    //   lengthSquared() {
    //     return this.x * this.x + this.y * this.y + this.z * this.z;
    //   }
    //   length() {
    //     return Math.sqrt(this.lengthSquared());
    //   }
    //   unit() {
    //     return this.divScalar(this.length());
    //   }

    //   print() {
    //     console.log("(" + this.x + ", " + this.y + ", " + this.z + ")");
    //   }

    //   static RandomVector(min = 0, max = 1) {
    //     return new Vec3(
    //       randomInRange(min, max),
    //       randomInRange(min, max),
    //       randomInRange(min, max)
    //     );
    //   }

    //   static RandomInUnitSphere() {
    //     while (true) {
    //       let p = this.RandomVector(-1, 1);
    //       if (p.lengthSquared() >= 1) continue;
    //       return p;
    //     }
    //   }
}

// function randomInRange(min, max) {
//   return Math.random() * (max - min) + min;
// }

function dot(u: Vec3, v: Vec3) {
    return u.x * v.x + u.y * v.y + u.z * v.z
}

export { Vec3, dot }
