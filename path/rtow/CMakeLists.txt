cmake_minimum_required(VERSION 3.10)

project(RTWeekend LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 11)

set(SOURCES
    src/main.cc
)

include_directories(src)

# add_compile_options(-Wunused-variable) # Variable is defined but unused
add_executable(inOneWeekend ${SOURCES})
