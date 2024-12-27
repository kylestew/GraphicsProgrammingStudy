/*
 * All color values are in the range 0.0 to 1.0
 */
import { Color } from './color'

function ImageCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('Could not get 2d context from canvas')
    }

    return {
        ctx: ctx,
        width: ctx.canvas.width,
        height: ctx.canvas.height,
        imageData: ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),

        write: function (x: number, y: number, color: Color) {
            const idx = x * 4 + y * this.width * 4
            color.write(this.imageData, idx)
        },

        display: function () {
            this.ctx.putImageData(this.imageData, 0, 0)
        },
    }
}

export { Color, ImageCanvas }
