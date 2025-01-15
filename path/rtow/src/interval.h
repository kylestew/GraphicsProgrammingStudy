#ifndef INTERVAL_H
#define INTERVAL_H

#include "rtweekend.h"

class interval {
  public:
    double min, max;

    // default interval is empty
    interval() : min(+infinity), max(-infinity) {}

    interval(double _min, double _max) : min(_min), max(_max) {}

    // size of interval
    double size() const { return max - min; }

    bool contains(double x) const { return min <= x && x <= max; }

    bool surrounds(double x) const { return min < x && x < max; }

    double clamp(double x) const {
        if (x < min)
            return min;
        if (x > max)
            return max;
        return x;
    }

    static const interval empty, universe;
};

const interval interval::empty    = interval(+infinity, -infinity);
const interval interval::universe = interval(-infinity, +infinity);

#endif