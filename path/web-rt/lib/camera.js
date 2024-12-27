import Vec3 from "./vec3.js";
import Ray from "./ray.js";

function Camera(aspectRatio) {
  const viewportHeight = 2.0;
  const viewportWidth = aspectRatio * viewportHeight;
  const focalLength = 1.0;

  const origin = new Vec3();
  const horizontal = new Vec3(viewportWidth, 0, 0);
  const vertical = new Vec3(0, viewportHeight, 0);
  const lowerLeftCorner = origin
    .sub(horizontal.divScalar(2))
    .sub(vertical.divScalar(2))
    .sub(new Vec3(0, 0, focalLength));

  return {
    getRay: function (u, v) {
      const direction = lowerLeftCorner.add(
        horizontal.mulScalar(u).add(vertical.mulScalar(v)).sub(origin)
      );
      return new Ray(origin, direction);
    },
  };
}

export default Camera;
