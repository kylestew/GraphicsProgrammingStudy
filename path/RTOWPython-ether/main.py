# %%
from lib.ImageBuilder import ImageBuilder
from rt import Vec3, Color

image_width = 100
image_height = 100
img = ImageBuilder(width=image_width, height=image_height)

for j in range(image_height):
    for i in range(image_width):
        color = Color(float(i) / (image_width - 1), float(j) / (image_height - 1), 0.0)

        ir = int(255.999 * color.r)
        ig = int(255.999 * color.g)
        ib = int(255.999 * color.b)

        img.set_pixel(i, j, [ir, ig, ib])

img.display()

# img.save("test.png")
