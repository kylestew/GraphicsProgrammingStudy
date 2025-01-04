export type Vec2 = [number, number]

export const Vec = {
    add: (v0: Vec2, v1: Vec2): Vec2 => [v0[0] + v1[0], v0[1] + v1[1]],
    sub: (v0: Vec2, v1: Vec2): Vec2 => [v0[0] - v1[0], v0[1] - v1[1]],

    // scalar multiply
    mul: (v: Vec2, s: number): Vec2 => [v[0] * s, v[1] * s],

    length: (v: Vec2): number => Math.sqrt(v[0] * v[0] + v[1] * v[1]),
}
