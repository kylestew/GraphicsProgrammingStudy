import { Color, ImageCanvas, createImageCanvas } from './image'
import { line } from './line'
import { Vec2, Vec } from './vector'
import { readModelFromRaw } from './model_reader'

import fileContents from './model/african_head/african_head.obj?raw'

const image = createImageCanvas()

const red: Color = [255, 0, 0, 255]
const white: Color = [255, 255, 255, 255]
const green: Color = [0, 255, 0, 255]
const blue: Color = [0, 0, 255, 255]

let model = readModelFromRaw(fileContents)
console.log(model)

// == TEST TRIANGLE ==

function triangle(t0: Vec2, t1: Vec2, t2: Vec2, image: ImageCanvas, color: Color) {
    // sweep length of t1-t2
    let length = Vec.length(Vec.sub(t2, t1))
    const step = 1.0 / length

    for (let t = 0.0; t < 1.0; t += step) {
        // let b = t1 * (1.0 - t) + t2 * t
        let b = Vec.add(Vec.mul(t1, 1.0 - t), Vec.mul(t2, t))
        line(t0, b, image, color)
    }

    // debug outline
    line(t0, t1, image, blue)
    line(t1, t2, image, blue)
    line(t2, t0, image, blue)
}

const t0: Vec2[] = [
    [10, 70],
    [50, 160],
    [70, 80],
]
const t1: Vec2[] = [
    [180, 50],
    [150, 1],
    [70, 180],
]
const t2: Vec2[] = [
    [180, 150],
    [120, 160],
    [130, 180],
]
triangle(t0[0], t0[1], t0[2], image, red)
triangle(t1[0], t1[1], t1[2], image, white)
triangle(t2[0], t2[1], t2[2], image, green)

image.display(false)

// == TEST WIREFRAME ==
// for (const face of model.faces) {
//     for (let i = 0; i < 3; i++) {
//         const v0 = model.vertices[face[i] - 1]
//         const v1 = model.vertices[face[(i + 1) % 3] - 1]

//         let x0 = (v0[0] + 1.0) * (image.size.width / 2.0)
//         let y0 = (v0[1] + 1.0) * (image.size.height / 2.0)
//         let x1 = (v1[0] + 1.0) * (image.size.width / 2.0)
//         let y1 = (v1[1] + 1.0) * (image.size.height / 2.0)

//         line([x0, y0], [x1, y1], image, white)
//     }
// }

// == TEST LINES ==
// line([13, 20], [80, 40], image, white) // horiz, small slope
// line([20, 13], [40, 80], image, red) // horiz, large slope
// line([80, 40], [13, 20], image, red) // draw over first line, but red
// line([90, 10], [90, 80], image, white) // vertical line
// line([13, 80], [70, 10], image, white) // negative slope
// line([80, 40], [17, 21.2], image, red) // should write over top of the first line

image.display()

/*
function xAtYForLine(t0: Vec2, t1: Vec2, y: number): number {
    const [x0, y0] = t0
    const [x1, y1] = t1
    return ((x1 - x0) * (y - y0)) / (y1 - y0) + x0
}

function triangle(t0: Vec2, t1: Vec2, t2: Vec2, image: ImageCanvas, color: Color) {
    // sort vertices by y (quick bubble sort)
    if (t0[1] > t1[1]) {
        ;[t0, t1] = [t1, t0]
    }
    if (t0[1] > t2[1]) {
        ;[t0, t2] = [t2, t0]
    }
    if (t1[1] > t2[1]) {
        ;[t1, t2] = [t2, t1]
    }

    // segment 1: [t0 -> t1, t0 -> X] where X is somewhere between t0 and t1
    for (let y = t0[1]; y <= t1[1]; y++) {
        let x0 = xAtYForLine(t0, t2, y)
        let x1 = xAtYForLine(t0, t1, y)
        let a: Vec2 = [x0, y]
        let b: Vec2 = [x1, y]
        line(a, b, image, color)
    }

    // segment 2: [t0 -> t1, t0 -> X] where X is somewhere between t0 and t1
    for (let y = t1[1]; y <= t2[1]; y++) {
        let x0 = xAtYForLine(t0, t2, y)
        let x1 = xAtYForLine(t1, t2, y)
        let a: Vec2 = [x0, y]
        let b: Vec2 = [x1, y]
        line(a, b, image, color)
    }

    // console.log(t0, t1, t2)
    line(t0, t1, image, color)
    line(t1, t2, image, color)
    line(t2, t0, image, color)
}

*/
