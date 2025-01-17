#include <iostream>
#include <math.h>

using namespace std;

#include "svpng.inc"

#define TWO_PI 6.28318530718f

#define W 512
#define H 512
#define N 64 // 64

#define MAX_STEP 64
#define MAX_DISTANCE 5.0f
#define EPSILON 1e-6f
#define BIAS 1e-4f
#define MAX_DEPTH 3

typedef struct {
    float surfDist;
    float emissive;
    float reflectivity;
} Result;

unsigned char img[W * H * 3];

float circleSDF(float x, float y, float cx, float cy, float r) {
    // spheres are easy :)
    float ux = x - cx, uy = y - cy;
    return sqrtf(ux * ux + uy * uy) - r;
}

float boxSDF(float x, float y, float cx, float cy, float theta, float sx, float sy) {
    float costheta = cosf(theta);
    float sintheta = sinf(theta);

    float dx = fabs((x - cx) * costheta + (y - cy) * sintheta) - sx;
    float dy = fabs((y - cy) * costheta - (x - cx) * sintheta) - sy;

    float ax = fmaxf(dx, 0.0f);
    float ay = fmaxf(dy, 0.0f);

    return fminf(fmaxf(dx, dy), 0.0f) + sqrtf(ax * ax + ay * ay);
}

float planeSDF(float x, float y, float px, float py, float nx, float ny) {
    return (x - px) * nx + (y - py) * ny;
}

Result unionOp(Result a, Result b) {
    return a.surfDist < b.surfDist ? a : b;
}

Result intersectOp(Result a, Result b) {
    return a.surfDist > b.surfDist ? a : b;
}

Result subtractOp(Result a, Result b) {
    Result r = a;
    r.surfDist = (a.surfDist > -b.surfDist) ? a.surfDist : -b.surfDist;
    return r;
}

Result scene_circleBox(float x, float y) {
    Result a = { circleSDF(x, y, 0.5f, 0.2f, 0.1f), 2.0f, 0.0f };
    Result b = { boxSDF(x, y, 0.5f, 0.6f, 0.0f, 0.2f, 0.1f), 0.0f, 0.9f };
    return unionOp(a, b);
}

Result scene(float x, float y) {
//    return scene_circleBox(x, y);

    Result a = { circleSDF(x, y, 0.4f, 0.2f, 0.1f), 2.0f, 0.0f };
    Result b = {    boxSDF(x, y, 0.5f, 0.8f, TWO_PI / 16.0f, 0.1f, 0.1f), 0.0f, 0.9f };
    Result c = {    boxSDF(x, y, 0.8f, 0.5f, TWO_PI / 16.0f, 0.1f, 0.1f), 0.0f, 0.9f };
    Result d = {  planeSDF(x, y, 0.0f, 0.5f, 0.0f, -1.0f), 0.0f, 0.9f };
    Result e = { circleSDF(x, y, 0.5f, 0.5f, 0.4f), 0.0f, 0.9f };
//     return unionOp(unionOp(a, b), c);
    return unionOp(a, subtractOp(d, e));
}

void gradient(float x, float y, float* nx, float* ny) {
    // find the slope of the line tangent to the curve at our point
    *nx = (scene(x + EPSILON, y).surfDist - scene(x - EPSILON, y).surfDist) * (0.5f / EPSILON);
    *ny = (scene(x, y + EPSILON).surfDist - scene(x, y - EPSILON).surfDist) * (0.5f / EPSILON);
}

void reflect(float ix, float iy, float nx, float ny, float* rx, float* ry) {
    float idotn2 = (ix * nx + iy * ny) * 2.0f;
    *rx = ix - idotn2 * nx;
    *ry = iy - idotn2 * ny;
}

float trace(float ox, float oy, float dx, float dy, int depth) {
    float t = 0.0f;
    // raymarch algo
    for (int i = 0; i < MAX_STEP && t < MAX_DISTANCE; i++) {
        // what's happening this distance along our ray?
        float x = ox + dx * t;
        float y = oy + dy * t;
        Result r = scene(x, y);
        if (r.surfDist < EPSILON) {
            float sum = r.emissive;
            if (depth < MAX_DEPTH && r.reflectivity > 0.0f) {
                // if we're here, our ray is currently touching a surface
                float nx, ny, rx, ry;

                gradient(x, y, &nx, &ny);
                reflect(dx, dy, nx, ny, &rx, &ry);

                // continue to bounce the ray around using our existing tracer
                sum += r.reflectivity * trace(x + nx * BIAS, y + ny * BIAS, rx, ry, depth + 1);
            }
            return sum;
        }
        t += r.surfDist; // move along ray safe distance
    }
    return 0.0f; // we did not hit the surface
}

float sample(float x, float y) {
    float sum = 0.0f;
    for (int i = 0; i < N; i++) {
        // random angle to throw ray at
        float theta = TWO_PI * (i + (float)rand() / RAND_MAX) / N;
        sum += trace(x, y, cosf(theta), sinf(theta), 0);
    }
    return sum / N;
}

int main() {
    unsigned char *p = img;
    for (int y = 0; y < H; y++)
        for (int x = 0; x < W; x++, p += 3)
            // greyscale map [0.0, 1.0] -> [0, 255]
            p[0] = p[1] = p[2] = (int)(fminf(sample((float)x / W, (float)y / H) * 255.0f, 255.0f));
    FILE *fp = fopen("reflection.png", "wb");
    svpng(fp, W, H, img, 0);
    fclose(fp);
}