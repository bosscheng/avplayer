# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.16

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
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /src

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /src/build

# Include any dependencies generated for this target.
include dec265/CMakeFiles/dec265.dir/depend.make

# Include the progress variables for this target.
include dec265/CMakeFiles/dec265.dir/progress.make

# Include the compile flags for this target's objects.
include dec265/CMakeFiles/dec265.dir/flags.make

dec265/CMakeFiles/dec265.dir/dec265.cc.o: dec265/CMakeFiles/dec265.dir/flags.make
dec265/CMakeFiles/dec265.dir/dec265.cc.o: dec265/CMakeFiles/dec265.dir/includes_CXX.rsp
dec265/CMakeFiles/dec265.dir/dec265.cc.o: ../dec265/dec265.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object dec265/CMakeFiles/dec265.dir/dec265.cc.o"
	cd /src/build/dec265 && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/dec265.dir/dec265.cc.o -c /src/dec265/dec265.cc

dec265/CMakeFiles/dec265.dir/dec265.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/dec265.dir/dec265.cc.i"
	cd /src/build/dec265 && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/dec265/dec265.cc > CMakeFiles/dec265.dir/dec265.cc.i

dec265/CMakeFiles/dec265.dir/dec265.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/dec265.dir/dec265.cc.s"
	cd /src/build/dec265 && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/dec265/dec265.cc -o CMakeFiles/dec265.dir/dec265.cc.s

# Object files for target dec265
dec265_OBJECTS = \
"CMakeFiles/dec265.dir/dec265.cc.o"

# External object files for target dec265
dec265_EXTERNAL_OBJECTS =

dec265/dec265.js: dec265/CMakeFiles/dec265.dir/dec265.cc.o
dec265/dec265.js: dec265/CMakeFiles/dec265.dir/build.make
dec265/dec265.js: libde265/liblibde265.a
dec265/dec265.js: dec265/CMakeFiles/dec265.dir/linklibs.rsp
dec265/dec265.js: dec265/CMakeFiles/dec265.dir/objects1.rsp
dec265/dec265.js: dec265/CMakeFiles/dec265.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking CXX executable dec265.js"
	cd /src/build/dec265 && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/dec265.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
dec265/CMakeFiles/dec265.dir/build: dec265/dec265.js

.PHONY : dec265/CMakeFiles/dec265.dir/build

dec265/CMakeFiles/dec265.dir/clean:
	cd /src/build/dec265 && $(CMAKE_COMMAND) -P CMakeFiles/dec265.dir/cmake_clean.cmake
.PHONY : dec265/CMakeFiles/dec265.dir/clean

dec265/CMakeFiles/dec265.dir/depend:
	cd /src/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /src /src/dec265 /src/build /src/build/dec265 /src/build/dec265/CMakeFiles/dec265.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : dec265/CMakeFiles/dec265.dir/depend
