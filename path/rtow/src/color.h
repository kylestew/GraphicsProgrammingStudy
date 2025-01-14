#ifndef COLOR_H
#define COLOR_H

#include "vec3.h"

using color = vec3;

void write_color(std::ostream &out, const color &pixel_color) {
    auto r = pixel_color.x();
    auto g = pixel_color.y();
    auto b = pixel_color.z();

    // Clamp values to [0,1] range before converting to bytes
    r = (r < 0) ? 0 : (r > 1) ? 1 : r;
    g = (g < 0) ? 0 : (g > 1) ? 1 : g;
    b = (b < 0) ? 0 : (b > 1) ? 1 : b;

    // Translate the [0,1] component values to the byte range [0,255].
    int rbyte = int(255.999 * r);
    int gbyte = int(255.999 * g);
    int bbyte = int(255.999 * b);

    // Write out the pixel color components.
    out << rbyte << ' ' << gbyte << ' ' << bbyte << '\n';
}

#endif