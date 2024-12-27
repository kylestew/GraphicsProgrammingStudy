import { dot } from "./vec3";
import { HitRecord } from "./hittable";

function Sphere(center, radius) {
  return {
    cen: center,
    r: radius,

    hit: function (ray, tMin, tMax) {
      // HOLY FUCK this is complex compared to ray marching
      const oc = ray.origin.sub(center);
      const a = ray.direction.lengthSquared();
      const half_b = dot(oc, ray.direction);
      const c = oc.lengthSquared() - radius * radius;

      const discriminant = half_b * half_b - a * c;
      if (discriminant < 0) return false;
      let sqrtd = Math.sqrt(discriminant);

      // find the nearest root that lies in the acceptable range
      let root = (-half_b - sqrtd) / a;
      if (root < tMin || tMax < root) {
        root = (-half_b + sqrtd) / a;
        if (root < tMin || tMax < root) return false;
      }

      // OK so now we have the distance...
      // record:
      // - point of impact
      // - distance to impact from eye
      // - normal at impact surface
      // - are we inside or outside of object?
      let hitP = ray.at(root);
      let outwardNormal = hitP.sub(center).divScalar(radius);
      return HitRecord(ray, root, outwardNormal);
    },
  };
}

export { Sphere };
export default Sphere;
