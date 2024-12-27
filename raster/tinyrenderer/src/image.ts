type Color = [number, number, number, number]
type ImageCanvas = {
    imageData: ImageData
    size: { width: number; height: number }
    set: (x: number, y: number, color: Color) => void
    display: () => void
}

function createImageCanvas(): ImageCanvas {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('Failed to get 2D context')
    }

    // Create an ImageData object of the same size as the canvas
    let imageData = ctx.createImageData(canvas.width, canvas.height)

    // Function to fill the canvas with a default color (black in this case)
    function fillCanvasWithDefaultColor(imageData: ImageData, color: Color): void {
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i + 0] = color[0] // Red
            imageData.data[i + 1] = color[1] // Green
            imageData.data[i + 2] = color[2] // Blue
            imageData.data[i + 3] = color[3] // Alpha (opacity)
        }
    }

    // Fill the canvas with black by default
    fillCanvasWithDefaultColor(imageData, [0, 0, 0, 255])

    // Function to set a pixel's color in the ImageData object
    function set(x: number, y: number, color: Color): void {
        x = Math.round(x)
        y = Math.round(y)

        let index = (x + y * imageData.width) * 4
        imageData.data[index + 0] = color[0]
        imageData.data[index + 1] = color[1]
        imageData.data[index + 2] = color[2]
        imageData.data[index + 3] = color[3]
    }

    function flipVertically() {
        if (!imageData.data) return false

        const width = imageData.width
        const height = imageData.height
        const bytesPerPixel = 4 // Assuming RGBA
        const bytesPerLine = width * bytesPerPixel

        for (let j = 0; j < Math.floor(height / 2); j++) {
            const line1Index = j * bytesPerLine
            const line2Index = (height - 1 - j) * bytesPerLine

            for (let i = 0; i < bytesPerLine; i++) {
                const temp = imageData.data[line1Index + i]
                imageData.data[line1Index + i] = imageData.data[line2Index + i]
                imageData.data[line2Index + i] = temp
            }
        }

        return true
    }

    // Function to display the ImageData object on the canvas
    function display(): void {
        flipVertically()
        if (ctx) {
            ctx.putImageData(imageData, 0, 0)
        }
    }

    // Return an object containing the imageData, setPixel function, and display function
    return {
        imageData,
        size: { width: canvas.width, height: canvas.height },
        set,
        display,
    }
}

export type { Color, ImageCanvas }
export { createImageCanvas }
