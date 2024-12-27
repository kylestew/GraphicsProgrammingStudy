import { Vec3 } from './vec3'

class Ray {
    origin: Vec3
    direction: Vec3

    constructor(origin: Vec3, direction: Vec3) {
        this.origin = origin
        this.direction = direction
    }

    // Method to calculate a point along the ray at distance `t`
    at(t: number): Vec3 {
        return this.origin.add(this.direction.mulScalar(t))
    }
}

export default Ray
