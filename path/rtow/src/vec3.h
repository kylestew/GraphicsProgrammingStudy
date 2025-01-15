#ifndef VEC3_H
#define VEC3_H

class vec3 {
  public:
    double e[3];

    vec3() : e{0, 0, 0} {}
    vec3(double e0, double e1, double e2) : e{e0, e1, e2} {}

    double x() const { return e[0]; }
    double y() const { return e[1]; }
    double z() const { return e[2]; }

    vec3 operator-() const { return vec3(-e[0], -e[1], -e[2]); }
    double operator[](int i) const { return e[i]; }
    double &operator[](int i) { return e[i]; }

    vec3 &operator+=(const vec3 &v) {
        e[0] += v.e[0];
        e[1] += v.e[1];
        e[2] += v.e[2];
        return *this;
    }

    double length() const { return std::sqrt(length_squared()); }
    double length_squared() const { return e[0] * e[0] + e[1] * e[1] + e[2] * e[2]; }

    bool near_zero() const {
        // Return true if the vector is close to zero in all dimensions.
        const auto s = 1e-8;
        return (std::fabs(e[0]) < s) && (std::fabs(e[1]) < s) && (std::fabs(e[2]) < s);
    }

    static vec3 random() { return vec3(random_double(), random_double(), random_double()); }

    static vec3 random(double min, double max) {
        return vec3(random_double(min, max), random_double(min, max), random_double(min, max));
    }
};

// point3 is just an alias for vec3, but useful for geometric clarity in the code
using point3 = vec3;

// Vector Utility Functions
inline vec3 operator+(const vec3 &u, const vec3 &v) { return vec3(u.e[0] + v.e[0], u.e[1] + v.e[1], u.e[2] + v.e[2]); }
inline vec3 operator-(const vec3 &u, const vec3 &v) { return vec3(u.e[0] - v.e[0], u.e[1] - v.e[1], u.e[2] - v.e[2]); }

inline vec3 operator*(const vec3 &u, const vec3 &v) { return vec3(u.e[0] * v.e[0], u.e[1] * v.e[1], u.e[2] * v.e[2]); }
inline vec3 operator*(double t, const vec3 &v) { return vec3(t * v.e[0], t * v.e[1], t * v.e[2]); }
inline vec3 operator*(const vec3 &v, double t) { return t * v; }

inline vec3 operator/(const vec3 &v, double t) { return (1 / t) * v; }

inline double dot(const vec3 &u, const vec3 &v) { return u.e[0] * v.e[0] + u.e[1] * v.e[1] + u.e[2] * v.e[2]; }

inline vec3 unit_vector(vec3 v) { return v / v.length(); }

inline vec3 random_unit_vector() {
    while (true) {
        auto p     = vec3::random(-1, 1);
        auto lensq = p.length_squared();
        // check if value is so small that it will underflow when squared
        if (1e-160 < lensq && lensq <= 1) {
            return p / sqrt(lensq); // normalize the vector
        }
    }
}

inline vec3 random_on_hemisphere(const vec3 &normal) {
    // can be determined by the dot product of the surface normal and a random vector
    vec3 on_unit_sphere = random_unit_vector();
    if (dot(on_unit_sphere, normal) > 0.0) {
        // both are in same hemisphere
        return on_unit_sphere;
    } else {
        return -on_unit_sphere;
    }
}

#endif