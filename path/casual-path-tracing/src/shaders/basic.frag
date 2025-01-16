precision highp float;

// === Types ===============================================
struct Ray {
    vec3 origin;
    vec3 dir;
};

struct Material {
    vec4 color;
};

struct Sphere {
    vec3 position;
    float radius;
    Material material;
};

struct HitInfo {
    bool didHit;
    float dist;
    vec3 hitPoint;
    vec3 normal;
    Material material;
};
// =========================================================

// === Ray Intersections ===================================
HitInfo RaySphere(Ray ray, vec3 sphereCentre, float sphereRadius) {
    HitInfo hitInfo;
    hitInfo.didHit   = false;
    hitInfo.dist     = 0.0;
    hitInfo.hitPoint = vec3(0.0);
    hitInfo.normal   = vec3(0.0);
    hitInfo.material = Material(vec4(0.0));

    vec3 offsetRayOrigin = ray.origin - sphereCentre;
    // From the equation: sqrLength(rayOrigin + rayDir * dst) = radius^2
    // Solving for dst results in a quadratic equation with coefficients:
    float a = dot(ray.dir, ray.dir); // a = 1 (assuming unit vector)
    float b = 2.0 * dot(offsetRayOrigin, ray.dir);
    float c = dot(offsetRayOrigin, offsetRayOrigin) - sphereRadius * sphereRadius;
    // Quadratic discriminant
    float discriminant = b * b - 4.0 * a * c;

    // No solution when d < 0 (ray misses sphere)
    if (discriminant >= 0.0) {
        // Distance to nearest intersection point (from quadratic formula)
        float dst = (-b - sqrt(discriminant)) / (2.0 * a);

        // Ignore intersections that occur behind the ray
        if (dst >= 0.0) {
            hitInfo.didHit   = true;
            hitInfo.dist     = dst;
            hitInfo.hitPoint = ray.origin + ray.dir * dst;
            hitInfo.normal   = normalize(hitInfo.hitPoint - sphereCentre);
        }
    }
    return hitInfo;
}
// =========================================================

vec3 Trace(Ray ray) { return vec3(1.0, 0.0, 1.0); }

varying vec2 vUv;

void main() {
    // the ray starts at the camera position (the origin)
    Ray ray;
    // TODO: bring in camera position
    ray.origin = vec3(0.0, 0.0, -3.0);

    // calculate coordinsates of the ray target on the imaginary pixel plane
    // -1 to +1 on x, y axis. 1 unit away on the z axis
    vec3 rayTarget = vec3(vUv, 1.0);

    // calculate a normalized vector for the ray direction.
    // it's pointing from the ray position to the ray target
    ray.dir = normalize(rayTarget - ray.origin);

    // raytrace for this pixel
    // vec3 color = Trace(ray);

    HitInfo hitInfo = RaySphere(ray, vec3(0.0), 0.5);
    vec3 color      = hitInfo.didHit ? hitInfo.normal : vec3(0.0, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
