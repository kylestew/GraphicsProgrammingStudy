let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let canvasBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);

// === Canvas Access ========================================================
function PutPixel(x, y, color) {
    x = canvas.width / 2 + x;
    y = canvas.height / 2 - y - 1;

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        return;
    }

    let offset = (x + canvasBuffer.width * y) * 4;
    canvasBuffer.data[offset++] = color.r;
    canvasBuffer.data[offset++] = color.g;
    canvasBuffer.data[offset++] = color.b;
    canvasBuffer.data[offset++] = 255;
}

function UpdateCanvas() {
    ctx.putImageData(canvasBuffer, 0, 0);
}
// ==========================================================================

// === Linear Algebra =======================================================

function Vec(x, y, z) {
    return {
        x,
        y,
        z,
        dot: function (vec) {
            return this.x * vec.x + this.y * vec.y + this.z * vec.z;
        },
        sub: function (vec) {
            return Vec(this.x - vec.x, this.y - vec.y, this.z - vec.z);
        },
    };
}

// =========================================================================

function Sphere(center, radius, color) {
    return {
        center,
        radius,
        color,
    };
}

const viewport_size = 1;
const projection_plane_z = 1;
const camera_position = Vec(0, 0, 0);
const background_color = { r: 255, g: 255, b: 255 };
const spheres = [
    Sphere(Vec(0, -1, 3), 1, { r: 255, g: 0, b: 0 }),
    Sphere(Vec(-2, 0, 4), 1, { r: 0, g: 255, b: 0 }),
    Sphere(Vec(2, 0, 4), 1, { r: 0, g: 0, b: 255 }),
    Sphere(Vec(0, -5001, 0), 5000, { r: 255, g: 255, b: 0 }),
];

function CanvasToViewport(x, y) {
    return Vec((x * viewport_size) / canvas.width, (y * viewport_size) / canvas.height, projection_plane_z);
}

// Computes the intersection of a ray and a sphere
// returns the values of t for the two intersections
function IntersectRaySphere(origin, direction, sphere) {
    let oc = origin.sub(sphere.center);

    let a = direction.dot(direction);
    let b = 2 * oc.dot(direction);
    let c = oc.dot(oc) - sphere.radius * sphere.radius;

    let discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return [Infinity, Infinity];
    }

    let t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    let t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

    return [t1, t2];
}

function TraceRay(origin, direction, min_t, max_t) {
    let closest_t = Infinity;
    let closest_sphere = null;

    for (let i = 0; i < spheres.length; i++) {
        let ts = IntersectRaySphere(origin, direction, spheres[i]);
        if (ts[0] < closest_t && ts[0] > min_t && ts[0] < max_t) {
            closest_t = ts[0];
            closest_sphere = spheres[i];
        }
        if (ts[1] < closest_t && ts[1] > min_t && ts[1] < max_t) {
            closest_t = ts[1];
            closest_sphere = spheres[i];
        }
    }

    if (closest_sphere == null) {
        return background_color;
    }

    return closest_sphere.color;
}

// === Main Loop ===

for (let x = -canvas.width / 2; x < canvas.width / 2; x++) {
    for (let y = -canvas.height / 2; y < canvas.height / 2; y++) {
        let direction = CanvasToViewport(x, y);
        let color = TraceRay(camera_position, direction, 1, Infinity);
        PutPixel(x, y, color);
    }
}

// paint buffer to canvas
UpdateCanvas();
