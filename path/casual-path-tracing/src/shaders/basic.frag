#version 300 es

precision highp float;

// === Types ===============================================
struct Ray {
    vec3 origin;
    vec3 dir;
};

struct Material {
    vec3 color;
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

// === Random ==============================================
float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }

// PCG (permuted congruential generator). Thanks to:
// www.pcg-random.org and www.shadertoy.com/view/XlGcRh
uint nextRandom(inout uint state) {
    state       = state * 747796405u + 2891336453u;
    uint result = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    result      = (result >> 22u) ^ result;
    return result;
}

float randomValue(inout uint state) { return float(nextRandom(state)) / 4294967296.0; }

vec3 randomVectorInUnitSphere(inout uint state) {
    while (true) {
        float x  = randomValue(state);
        float y  = randomValue(state);
        float z  = randomValue(state);
        vec3 vec = normalize(vec3(x, y, z));
        if (dot(vec, vec) < 1.0) {
            return vec;
        }
    }
}
// =========================================================

// === Ray Intersections ===================================
HitInfo RaySphere(Ray ray, vec3 sphereCentre, float sphereRadius) {
    HitInfo hitInfo;
    hitInfo.didHit   = false;
    hitInfo.dist     = 0.0;
    hitInfo.hitPoint = vec3(0.0);
    hitInfo.normal   = vec3(0.0);
    hitInfo.material = Material(vec3(0.0));

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

// Test against all spheres
const int NUM_SPHERES = 4;
Sphere spheres[NUM_SPHERES];

void initSpheres() {
    spheres[0] = Sphere(vec3(-1.2, 0, 0), 0.5, Material(vec3(0.9, 0.2, 0.2)));
    spheres[1] = Sphere(vec3(0, 0, 0), 0.5, Material(vec3(0.9, 0.2, 0.2)));
    spheres[2] = Sphere(vec3(1.2, 0, 0), 0.5, Material(vec3(0.9, 0.2, 0.2)));
    spheres[3] = Sphere(vec3(0.0, -100.5, 0.0), 100.0, Material(vec3(0.3, 0.8, 0.8)));
}

// === Ray Tracing =========================================
// Find the first point that the given ray collides with, and return hit info
HitInfo CalculateRayCollision(Ray ray) {
    // empty hit info initialisation
    HitInfo closestHit;
    closestHit.didHit   = false;
    closestHit.dist     = 1e20; // large finite value
    closestHit.hitPoint = vec3(0.0);
    closestHit.normal   = vec3(0.0);
    closestHit.material = Material(vec3(0.0));

    // check each sphere in the scene to see which is closest
    for (int i = 0; i < NUM_SPHERES; i++) {
        Sphere sphere   = spheres[i];
        HitInfo hitInfo = RaySphere(ray, sphere.position, sphere.radius);

        if (hitInfo.didHit && hitInfo.dist < closestHit.dist) {
            closestHit          = hitInfo;
            closestHit.material = sphere.material;
        }
    }

    return closestHit;
}

// Trace the path of a ray of light (in reverse) as it travels from the camera,
// reflects off objects in the scene, and ends up (hopefully) at a light source.

const int MAX_BOUNCES = 10;

vec3 Trace(Ray ray, uint seed) {
    vec3 incomingLight = vec3(0.0);
    vec3 rayColor      = vec3(1.0);

    for (int i = 0; i < MAX_BOUNCES; i++) {
        // find the first thing the ray collides with
        HitInfo hitInfo = CalculateRayCollision(ray);

        if (hitInfo.didHit) {
            rayColor *= hitInfo.material.color;

            // == diffuse shading ==
            // from the endpoint of the normal, find a random vector in the unit sphere
            // shoot a new ray from the hit point towards the random vector
            ray.origin = hitInfo.hitPoint;
            // ray.dir    = hitInfo.normal + randomVectorInUnitSphere(seed);

            // == metal shading ==
            ray.dir = reflect(ray.dir, hitInfo.normal);
        } else {
            break;
        }
    }

    return rayColor;
    // return incomingLight;
}
// =========================================================

uniform float time;

in vec2 vUv;
in vec3 vCameraPosition;

out vec4 fragColor;

void main() {
    initSpheres();

    // Create a random seed from screen position and time
    uint seed = uint(random(vUv + time) * 4294967296.0);

    // Calculate ray direction
    vec3 forward = normalize(-vCameraPosition);
    vec3 right   = normalize(cross(forward, vec3(0, 1, 0)));
    vec3 up      = cross(forward, right);

    Ray ray;
    ray.origin = vCameraPosition;
    ray.dir    = normalize(forward + right * vUv.x - up * vUv.y);

    vec3 pixelCol = Trace(ray, seed);
    fragColor     = vec4(pixelCol, 1.0);
}
