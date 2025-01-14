#ifndef SPHERE_H
#define SPHERE_H

#include "hittable.h"

class sphere : public hittable {
  public:
    sphere(const point3 &center, double radius) : center(center), radius(std::fmax(radius, 0.0)) {}

    bool hit(const ray &r, double t_min, double t_max, hit_record &rec) const override {
        vec3 oc = center - r.origin();
        auto a  = r.direction().length_squared();
        auto h  = dot(r.direction(), oc);
        auto c  = oc.length_squared() - radius * radius;

        auto discriminant = h * h - a * c;
        if (discriminant < 0)
            return false;

        auto sqrtd = std::sqrt(discriminant);

        // Find the nearest root that lies in the acceptable range.
        auto root = (h - sqrtd) / a;
        if (root <= t_min || t_max <= root) {
            root = (h + sqrtd) / a;
            if (root <= t_min || t_max <= root)
                return false;
        }

        rec.t      = root;
        rec.p      = r.at(rec.t);
        rec.normal = (rec.p - center) / radius;

        return true;
    }

  private:
    point3 center;
    double radius;
};

#endif