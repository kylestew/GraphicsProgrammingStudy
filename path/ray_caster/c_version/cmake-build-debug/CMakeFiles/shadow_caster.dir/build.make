# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.12

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /Applications/CLion.app/Contents/bin/cmake/mac/bin/cmake

# The command to remove a file.
RM = /Applications/CLion.app/Contents/bin/cmake/mac/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/kylestewart/Projects/shadow_caster

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/kylestewart/Projects/shadow_caster/cmake-build-debug

# Include any dependencies generated for this target.
include CMakeFiles/shadow_caster.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/shadow_caster.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/shadow_caster.dir/flags.make

CMakeFiles/shadow_caster.dir/main.cpp.o: CMakeFiles/shadow_caster.dir/flags.make
CMakeFiles/shadow_caster.dir/main.cpp.o: ../main.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/kylestewart/Projects/shadow_caster/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/shadow_caster.dir/main.cpp.o"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/shadow_caster.dir/main.cpp.o -c /Users/kylestewart/Projects/shadow_caster/main.cpp

CMakeFiles/shadow_caster.dir/main.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/shadow_caster.dir/main.cpp.i"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/kylestewart/Projects/shadow_caster/main.cpp > CMakeFiles/shadow_caster.dir/main.cpp.i

CMakeFiles/shadow_caster.dir/main.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/shadow_caster.dir/main.cpp.s"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/kylestewart/Projects/shadow_caster/main.cpp -o CMakeFiles/shadow_caster.dir/main.cpp.s

# Object files for target shadow_caster
shadow_caster_OBJECTS = \
"CMakeFiles/shadow_caster.dir/main.cpp.o"

# External object files for target shadow_caster
shadow_caster_EXTERNAL_OBJECTS =

shadow_caster: CMakeFiles/shadow_caster.dir/main.cpp.o
shadow_caster: CMakeFiles/shadow_caster.dir/build.make
shadow_caster: CMakeFiles/shadow_caster.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/Users/kylestewart/Projects/shadow_caster/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking CXX executable shadow_caster"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/shadow_caster.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/shadow_caster.dir/build: shadow_caster

.PHONY : CMakeFiles/shadow_caster.dir/build

CMakeFiles/shadow_caster.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/shadow_caster.dir/cmake_clean.cmake
.PHONY : CMakeFiles/shadow_caster.dir/clean

CMakeFiles/shadow_caster.dir/depend:
	cd /Users/kylestewart/Projects/shadow_caster/cmake-build-debug && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/kylestewart/Projects/shadow_caster /Users/kylestewart/Projects/shadow_caster /Users/kylestewart/Projects/shadow_caster/cmake-build-debug /Users/kylestewart/Projects/shadow_caster/cmake-build-debug /Users/kylestewart/Projects/shadow_caster/cmake-build-debug/CMakeFiles/shadow_caster.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/shadow_caster.dir/depend
