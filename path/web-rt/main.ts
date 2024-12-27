import { ImageCanvas } from './lib/image_canvas'
import { Color } from './lib/color'
// import { HittableList } from "./lib/hittable.js";
// import Camera from "./lib/camera.js";
// import Sphere from "./lib/sphere.js";
// import Ray from "./lib/ray.js";

const canvasElm = document.getElementById('canvas') as HTMLCanvasElement
let image = ImageCanvas(canvasElm)

// Image
// const aspectRatio = imageWidth / imageHeight;
// const samplesPerPixel = 1;
// const maxDepth = 16;

for (let j = 0; j < image.height; j++) {
    for (let i = 0; i < image.width; i++) {
        let r = i / (image.width - 1)
        let g = j / (image.height - 1)
        let b = 0.0

        image.write(i, j, new Color(r, g, b))
    }
}

image.display()

// // World
// let world = HittableList();
// world.add(Sphere(new Vec3(0, -100.5, -1), 100));
// world.add(Sphere(new Vec3(0, 0, -1), 0.5));

// // Camera
// const cam = Camera(aspectRatio);

// function rayColor(ray, world, depth) {
//   if (depth <= 0) return new Color(0, 0, 0);

//   let hit = world.hit(ray, 0, Number.MAX_SAFE_INTEGER);
//   if (hit !== false) {
//     // DIFFUSE REFLECTION:
//     // pick a random point S in the unit sphere tangent to hit point P
//     // unit sphere is centered at (P + n)
//     // (S - P) is the new direction vector of our diffuse reflection
//     let S = hit.p.add(hit.n.add(Vec3.RandomInUnitSphere()));
//     // ray march recusively in new direction
//     // (losing some of the light intensity after bounce?)
//     return rayColor(new Ray(hit.p, S.sub(hit.p)), world, depth - 1).mulScalar(
//       0.5
//     );
//   }

//   // default background
//   const unit_direction = ray.direction.unit();
//   let t = 0.5 * (unit_direction.y + 1.0);
//   return new Color(1, 1, 1)
//     .mulScalar(1.0 - t)
//     .add(new Color(0.5, 0.7, 1.0).mulScalar(t));
// }

// /*
//  * Scan render scene
//  */
// let currentLine = 0;
// function render() {
//   for (let i = 0; i < imageWidth; ++i) {
//     const u = i / imageWidth;
//     const v = currentLine / imageHeight;
//     let pixel = new Color(0, 0, 0);
//     for (let s = 0; s < samplesPerPixel; ++s) {
//       const su = u + Math.random() / imageWidth;
//       const sv = v + Math.random() / imageHeight;

//       const r = cam.getRay(su, sv);
//       // add up all samples
//       pixel = pixel.add(rayColor(r, world, maxDepth));
//     }
//     // divide samples back down to color range
//     pixel = pixel.divScalar(samplesPerPixel);

//     pixels.write(u, v, pixel);
//   }

//   pixels.display();
//   currentLine++;
//   if (currentLine < imageHeight) requestAnimationFrame(render);
// }
// requestAnimationFrame(render);
