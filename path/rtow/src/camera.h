#ifndef CAMERA_H
#define CAMERA_H

#include "hittable.h"
#include "material.h"

class camera {
  public:
    double aspect_ratio   = 1.0; // ration of image width to height
    int image_width       = 100; // rendered image width in pixel count
    int samples_per_pixel = 10;  // number of samples per pixel
    int max_depth         = 10;  // max depth of ray bounces

    void render(const hittable &world) {
        initialize();

        std::cout << "P3\n" << image_width << ' ' << image_height << "\n255\n";

        for (int j = 0; j < image_height; j++) {
            std::clog << "\rScanlines remaining: " << (image_height - j) << ' ' << std::flush;
            for (int i = 0; i < image_width; i++) {
                color pixel_color(0, 0, 0);
                for (int s = 0; s < samples_per_pixel; s++) {
                    ray r = get_ray(i, j);
                    pixel_color += ray_color(r, max_depth, world);
                }
                write_color(std::cout, pixel_samples_scale * pixel_color);
            }
        }

        std::clog << "\rDone.                   \n";
    }

  private:
    // image height derived from width and aspect ratio
    int image_height;
    double pixel_samples_scale; // color scale factor for a sum of pixel samples
    point3 center;
    point3 pixel00_loc; // Location of pixel 0, 0
    vec3 pixel_delta_u; // Offset to pixel to the right
    vec3 pixel_delta_v; // Offset to pixel below

    void initialize() {
        image_height = int(image_width / aspect_ratio);
        image_height = (image_height < 1) ? 1 : image_height;

        pixel_samples_scale = 1.0 / samples_per_pixel;

        center = point3(0, 0, 0);

        // Determine viewport dimensions
        auto focal_length    = 1.0;
        auto viewport_height = 2.0;
        auto viewport_width  = viewport_height * (double(image_width) / image_height);

        // Calculate the vectors across the horizontal and down the vertical viewport edges
        auto viewport_u = vec3(viewport_width, 0, 0);
        auto viewport_v = vec3(0, -viewport_height, 0);
        // Calculate the horizontal and vertical delta vectors from pixel to pixel
        pixel_delta_u = viewport_u / image_width;
        pixel_delta_v = viewport_v / image_height;
        // Calculate the location of the upper left pixel
        // (point towards screen and subtract vectors to find top left)
        auto viewport_upper_left = center - vec3(0, 0, focal_length) - viewport_u / 2 - viewport_v / 2;
        pixel00_loc              = viewport_upper_left + 0.5 * (pixel_delta_u + pixel_delta_v);
    }

    ray get_ray(int i, int j) const {
        // Construct a camera ray originating from the origin and directed at a randomly
        // sampled point around the pixel location (i, j)
        auto offset       = sample_square();
        auto pixel_sample = pixel00_loc + (i + offset.x()) * pixel_delta_u + (j + offset.y()) * pixel_delta_v;

        auto ray_origin    = center;
        auto ray_direction = pixel_sample - ray_origin;

        return ray(ray_origin, ray_direction);
    }

    vec3 sample_square() const {
        // retursn the vector to a random point in [-0.5, 0.5] - [0.5, 0.5] unit square
        return vec3(random_double() - 0.5, random_double() - 0.5, 0);
    }

    color ray_color(const ray &r, int depth, const hittable &world) {
        // if we've exceeded the ray bounce limit, no more light is gathered
        if (depth <= 0)
            return color(0, 0, 0);

        hit_record rec;

        // drop any rays that don't fully align with the surface (0.001)
        if (world.hit(r, interval(0.001, infinity), rec)) {
            // query material for scattering
            ray scattered;
            color attenuation;
            if (rec.mat->scatter(r, rec, attenuation, scattered)) {
                return attenuation * ray_color(scattered, depth - 1, world);
            }
            // not sure why it would fail
            return color(0, 0, 0);

            // (interesting failure)
            // vec3 s = rec.p + rec.normal + random_unit_vector();
            // return 0.5 * ray_color(ray(rec.p, s), depth - 1, world);

            // == lambertian reflection ==
            // vec3 direction = rec.normal + random_unit_vector();
            // return 0.5 * ray_color(ray(rec.p, direction), depth - 1, world);

            // == diffuse reflection bounce ==
            // vec3 direction = random_on_hemisphere(rec.normal);
            // return 0.5 * ray_color(ray(rec.p, s), depth - 1, world);

            // == return normal as color ==
            // vector can range values -1 to 1, so scale to 0 to 1 by adding 1 and dividing by 2
            // return 0.5 * (rec.normal + color(1, 1, 1));
        }

        // gradient sky
        auto a = 0.5 * r.direction().y() + 0.5;
        return (1 - a) * color(1.0, 1.0, 1.0) + a * color(0.5, 0.7, 1.0);
    }
};

#endif