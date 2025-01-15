#! /bin/bash

cd build
if ! make; then
    echo "Build failed"
    exit 1
fi

cd ..
build/inOneWeekend > image.ppm

open image.ppm