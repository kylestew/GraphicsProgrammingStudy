#ifndef MATERIAL_H
#define MATERIAL_H

#include "hittable.h"

class material {
  public:
    virtual bool scatter(const ray &r_in, const hit_record &rec, color &attenuation, ray &scattered) const = 0;
};

class lambertian : public material {
  public:
    lambertian(const color &albedo) : albedo(albedo) {}

    bool scatter(const ray &r_in, const hit_record &rec, color &attenuation, ray &scattered) const override {
        auto scatter_direction = rec.normal + random_unit_vector();

        // catch degenerate scatter direction
        if (scatter_direction.near_zero())
            scatter_direction = rec.normal;

        scattered   = ray(rec.p, scatter_direction);
        attenuation = albedo;
        return true;
    }

  private:
    color albedo;
};

class metal : public material {
  public:
    metal(const color &albedo, double fuzz) : albedo(albedo), fuzz(fuzz) {}

    bool scatter(const ray &r_in, const hit_record &rec, color &attenuation, ray &scattered) const override {
        // simple reflection
        vec3 reflected = reflect(r_in.direction(), rec.normal);
        // add fuzz to the reflected ray by moving its direction slightly (by a smaller random unit vector)
        reflected   = unit_vector(reflected) + (fuzz * random_unit_vector());
        scattered   = ray(rec.p, reflected);
        attenuation = albedo;

        // if the ray goes back into the object, absorb it (return false)
        return (dot(scattered.direction(), rec.normal) > 0);
    }

  private:
    color albedo;
    double fuzz;
};

#endif