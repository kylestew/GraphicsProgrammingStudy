import { dot } from "./vec3";

function determineFrontFace(ray, outwardNormal) {
  return dot(ray.direction, outwardNormal) < 0;
}

function HitRecord(ray, distToSurf, outwardNormal) {
  let hitP = ray.at(distToSurf);
  let isFrontFace = determineFrontFace(ray, outwardNormal);

  return {
    d: distToSurf,
    p: hitP,
    n: isFrontFace ? outwardNormal : outwardNormal.mulScalar(-1),
    isFrontFace: isFrontFace,
  };
}

function HittableList() {
  return {
    objects: [],

    add: function (object) {
      this.objects.push(object);
    },

    hit: function (ray, tMin, tMax) {
      let hit = false;
      let closestSoFar = tMax;

      this.objects.forEach((obj) => {
        let result = obj.hit(ray, tMin, closestSoFar);
        if (result !== false) {
          closestSoFar = result.t;
          hit = result;
        }
      });

      return hit;
    },
  };
}

export { HitRecord, HittableList };
