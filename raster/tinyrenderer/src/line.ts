import { Color, ImageCanvas } from './image'

export type Vec2 = [number, number]

/*
 * Breshenham's line algorithm is a way to determing which points on a grid should
 * be selected to form a straight line between two specified points.
 *
 * Only integer arithmetic is used for efficiency.
 */
export function line(t0: Vec2, t1: Vec2, image: ImageCanvas, color: Color) {
    let [x0, y0] = t0
    let [x1, y1] = t1

    let steep = false
    if (Math.abs(x1 - x0) < Math.abs(y1 - y0)) {
        // if the line is steep (more vertical distance than horizontal), we want to draw
        // it as if it was not steep so swap coordinates
        ;[x0, y0] = [y0, x0] // swap hack
        ;[x1, y1] = [y1, x1]
        steep = true
    }
    if (x0 > x1) {
        // we always want to draw across the horizontal axis from left-to-right
        ;[x0, x1] = [x1, x0]
        ;[y0, y1] = [y1, y0]
    }

    // determine slope of line and use it as the "error"
    // error determines how much Y should be incremented in each iteration (movement of X)
    let dx = x1 - x0
    let dy = y1 - y0
    // simple - but uses floating points
    // let derror = Math.abs(dy / dx)
    // let error = 0
    // we can get rid of floating points by replacing the error variable and assume its
    // equal to error * dx * 2
    let derror2 = Math.abs(dy) * 2
    let error2 = 0

    // draw horizontal, left-to-right
    let y = y0
    for (let x = x0; x <= x1; x++) {
        // if we had swapped for steepness, undo that now
        if (steep) {
            image.set(y, x, color)
        } else {
            image.set(x, y, color)
        }

        // in each iteration of the loop, we just need to determine where to place Y
        // using the error term to increment Y based difference between DX and DY
        error2 += derror2
        if (error2 > dx) {
            y += y1 > y0 ? 1 : -1
            error2 -= dx * 2
        }
    }
}
