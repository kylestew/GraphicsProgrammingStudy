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
varying vec3 vCameraPosition;
varying mat4 vInverseProjectionMatrix;
varying mat4 vInverseViewMatrix;

void main() {
    Ray ray;
    ray.origin = vCameraPosition;

    // Calculate ray direction
    vec3 forward = normalize(-vCameraPosition);
    vec3 right   = normalize(cross(forward, vec3(0, 1, 0)));
    vec3 up      = cross(forward, right);

    ray.dir = normalize(forward + right * vUv.x - up * vUv.y);

    // Test against all spheres
    HitInfo hitInfo1 = RaySphere(ray, vec3(-1.0, 0.0, 0.0), 0.5);
    HitInfo hitInfo2 = RaySphere(ray, vec3(1.0, 0.0, 0.0), 0.5);
    HitInfo hitInfo3 = RaySphere(ray, vec3(0.0, 0.0, -2.0), 2.0); // Big sphere in background

    vec3 color;
    // Check which sphere was hit first (closest to camera)
    if (hitInfo1.didHit && (!hitInfo2.didHit || hitInfo1.dist < hitInfo2.dist) &&
        (!hitInfo3.didHit || hitInfo1.dist < hitInfo3.dist)) {
        color = hitInfo1.normal;
    } else if (hitInfo2.didHit && (!hitInfo3.didHit || hitInfo2.dist < hitInfo3.dist)) {
        color = hitInfo2.normal;
    } else if (hitInfo3.didHit) {
        color = hitInfo3.normal * vec3(1.0, 0.5, 0.2); // Give it an orange tint
    } else {
        color = vec3(0.0, 0.0, 1.0);
    }

    gl_FragColor = vec4(color, 1.0);
}
