import { Vec3 } from './vec3'

class Color extends Vec3 {
    get r() {
        return this.x
    }
    get g() {
        return this.y
    }
    get b() {
        return this.z
    }

    write(data: ImageData, idx: number) {
        const img = data.data
        img[idx + 0] = Math.min(Math.max(this.x * 255.99, 0), 255)
        img[idx + 1] = Math.min(Math.max(this.y * 255.99, 0), 255)
        img[idx + 2] = Math.min(Math.max(this.z * 255.99, 0), 255)
        img[idx + 3] = 255
    }
}

export { Color }
