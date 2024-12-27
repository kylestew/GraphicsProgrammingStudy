import numpy as np
import matplotlib.pyplot as plt


class ImageBuilder:
    def __init__(self, width, height, channels=3):
        self.width = width
        self.height = height
        self.channels = channels
        self.data = np.zeros((height, width, channels), dtype=np.uint8)

    def set_pixel(self, x, y, color):
        if (0 <= x < self.width) and (0 <= y < self.height):
            self.data[y, x] = color
        else:
            raise ValueError(f"Pixel coordinates ({x}, {y}) are out of bounds.")

    def set_pixels(self, coordinates, colors):
        for (x, y), color in zip(coordinates, colors):
            self.set_pixel(x, y, color)

    def fill_region(self, x_start, y_start, x_end, y_end, color):
        self.data[y_start:y_end, x_start:x_end] = color

    def display(self):
        plt.imshow(self.data)
        plt.axis("off")
        plt.show()

    def save(self, filename):
        plt.imsave(filename, self.data)
