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
include libde265/encoder/algo/CMakeFiles/algo.dir/depend.make

# Include the progress variables for this target.
include libde265/encoder/algo/CMakeFiles/algo.dir/progress.make

# Include the compile flags for this target's objects.
include libde265/encoder/algo/CMakeFiles/algo.dir/flags.make

libde265/encoder/algo/CMakeFiles/algo.dir/algo.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/algo.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/algo.cc.o: ../libde265/encoder/algo/algo.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/algo.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/algo.cc.o -c /src/libde265/encoder/algo/algo.cc

libde265/encoder/algo/CMakeFiles/algo.dir/algo.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/algo.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/algo.cc > CMakeFiles/algo.dir/algo.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/algo.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/algo.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/algo.cc -o CMakeFiles/algo.dir/algo.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/coding-options.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/coding-options.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/coding-options.cc.o: ../libde265/encoder/algo/coding-options.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/coding-options.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/coding-options.cc.o -c /src/libde265/encoder/algo/coding-options.cc

libde265/encoder/algo/CMakeFiles/algo.dir/coding-options.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/coding-options.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/coding-options.cc > CMakeFiles/algo.dir/coding-options.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/coding-options.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/coding-options.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/coding-options.cc -o CMakeFiles/algo.dir/coding-options.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/ctb-qscale.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/ctb-qscale.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/ctb-qscale.cc.o: ../libde265/encoder/algo/ctb-qscale.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/ctb-qscale.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/ctb-qscale.cc.o -c /src/libde265/encoder/algo/ctb-qscale.cc

libde265/encoder/algo/CMakeFiles/algo.dir/ctb-qscale.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/ctb-qscale.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/ctb-qscale.cc > CMakeFiles/algo.dir/ctb-qscale.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/ctb-qscale.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/ctb-qscale.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/ctb-qscale.cc -o CMakeFiles/algo.dir/ctb-qscale.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/cb-split.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/cb-split.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/cb-split.cc.o: ../libde265/encoder/algo/cb-split.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/cb-split.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/cb-split.cc.o -c /src/libde265/encoder/algo/cb-split.cc

libde265/encoder/algo/CMakeFiles/algo.dir/cb-split.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/cb-split.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/cb-split.cc > CMakeFiles/algo.dir/cb-split.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/cb-split.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/cb-split.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/cb-split.cc -o CMakeFiles/algo.dir/cb-split.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/cb-intrapartmode.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/cb-intrapartmode.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/cb-intrapartmode.cc.o: ../libde265/encoder/algo/cb-intrapartmode.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/cb-intrapartmode.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/cb-intrapartmode.cc.o -c /src/libde265/encoder/algo/cb-intrapartmode.cc

libde265/encoder/algo/CMakeFiles/algo.dir/cb-intrapartmode.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/cb-intrapartmode.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/cb-intrapartmode.cc > CMakeFiles/algo.dir/cb-intrapartmode.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/cb-intrapartmode.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/cb-intrapartmode.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/cb-intrapartmode.cc -o CMakeFiles/algo.dir/cb-intrapartmode.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/cb-interpartmode.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/cb-interpartmode.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/cb-interpartmode.cc.o: ../libde265/encoder/algo/cb-interpartmode.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/cb-interpartmode.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/cb-interpartmode.cc.o -c /src/libde265/encoder/algo/cb-interpartmode.cc

libde265/encoder/algo/CMakeFiles/algo.dir/cb-interpartmode.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/cb-interpartmode.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/cb-interpartmode.cc > CMakeFiles/algo.dir/cb-interpartmode.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/cb-interpartmode.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/cb-interpartmode.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/cb-interpartmode.cc -o CMakeFiles/algo.dir/cb-interpartmode.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/cb-skip.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/cb-skip.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/cb-skip.cc.o: ../libde265/encoder/algo/cb-skip.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_7) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/cb-skip.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/cb-skip.cc.o -c /src/libde265/encoder/algo/cb-skip.cc

libde265/encoder/algo/CMakeFiles/algo.dir/cb-skip.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/cb-skip.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/cb-skip.cc > CMakeFiles/algo.dir/cb-skip.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/cb-skip.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/cb-skip.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/cb-skip.cc -o CMakeFiles/algo.dir/cb-skip.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/cb-intra-inter.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/cb-intra-inter.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/cb-intra-inter.cc.o: ../libde265/encoder/algo/cb-intra-inter.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_8) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/cb-intra-inter.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/cb-intra-inter.cc.o -c /src/libde265/encoder/algo/cb-intra-inter.cc

libde265/encoder/algo/CMakeFiles/algo.dir/cb-intra-inter.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/cb-intra-inter.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/cb-intra-inter.cc > CMakeFiles/algo.dir/cb-intra-inter.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/cb-intra-inter.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/cb-intra-inter.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/cb-intra-inter.cc -o CMakeFiles/algo.dir/cb-intra-inter.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/cb-mergeindex.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/cb-mergeindex.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/cb-mergeindex.cc.o: ../libde265/encoder/algo/cb-mergeindex.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_9) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/cb-mergeindex.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/cb-mergeindex.cc.o -c /src/libde265/encoder/algo/cb-mergeindex.cc

libde265/encoder/algo/CMakeFiles/algo.dir/cb-mergeindex.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/cb-mergeindex.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/cb-mergeindex.cc > CMakeFiles/algo.dir/cb-mergeindex.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/cb-mergeindex.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/cb-mergeindex.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/cb-mergeindex.cc -o CMakeFiles/algo.dir/cb-mergeindex.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/tb-split.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/tb-split.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/tb-split.cc.o: ../libde265/encoder/algo/tb-split.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_10) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/tb-split.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/tb-split.cc.o -c /src/libde265/encoder/algo/tb-split.cc

libde265/encoder/algo/CMakeFiles/algo.dir/tb-split.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/tb-split.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/tb-split.cc > CMakeFiles/algo.dir/tb-split.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/tb-split.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/tb-split.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/tb-split.cc -o CMakeFiles/algo.dir/tb-split.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/tb-transform.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/tb-transform.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/tb-transform.cc.o: ../libde265/encoder/algo/tb-transform.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_11) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/tb-transform.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/tb-transform.cc.o -c /src/libde265/encoder/algo/tb-transform.cc

libde265/encoder/algo/CMakeFiles/algo.dir/tb-transform.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/tb-transform.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/tb-transform.cc > CMakeFiles/algo.dir/tb-transform.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/tb-transform.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/tb-transform.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/tb-transform.cc -o CMakeFiles/algo.dir/tb-transform.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/tb-intrapredmode.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/tb-intrapredmode.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/tb-intrapredmode.cc.o: ../libde265/encoder/algo/tb-intrapredmode.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_12) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/tb-intrapredmode.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/tb-intrapredmode.cc.o -c /src/libde265/encoder/algo/tb-intrapredmode.cc

libde265/encoder/algo/CMakeFiles/algo.dir/tb-intrapredmode.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/tb-intrapredmode.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/tb-intrapredmode.cc > CMakeFiles/algo.dir/tb-intrapredmode.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/tb-intrapredmode.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/tb-intrapredmode.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/tb-intrapredmode.cc -o CMakeFiles/algo.dir/tb-intrapredmode.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/tb-rateestim.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/tb-rateestim.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/tb-rateestim.cc.o: ../libde265/encoder/algo/tb-rateestim.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_13) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/tb-rateestim.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/tb-rateestim.cc.o -c /src/libde265/encoder/algo/tb-rateestim.cc

libde265/encoder/algo/CMakeFiles/algo.dir/tb-rateestim.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/tb-rateestim.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/tb-rateestim.cc > CMakeFiles/algo.dir/tb-rateestim.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/tb-rateestim.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/tb-rateestim.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/tb-rateestim.cc -o CMakeFiles/algo.dir/tb-rateestim.cc.s

libde265/encoder/algo/CMakeFiles/algo.dir/pb-mv.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/flags.make
libde265/encoder/algo/CMakeFiles/algo.dir/pb-mv.cc.o: libde265/encoder/algo/CMakeFiles/algo.dir/includes_CXX.rsp
libde265/encoder/algo/CMakeFiles/algo.dir/pb-mv.cc.o: ../libde265/encoder/algo/pb-mv.cc
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/src/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_14) "Building CXX object libde265/encoder/algo/CMakeFiles/algo.dir/pb-mv.cc.o"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/algo.dir/pb-mv.cc.o -c /src/libde265/encoder/algo/pb-mv.cc

libde265/encoder/algo/CMakeFiles/algo.dir/pb-mv.cc.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/algo.dir/pb-mv.cc.i"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /src/libde265/encoder/algo/pb-mv.cc > CMakeFiles/algo.dir/pb-mv.cc.i

libde265/encoder/algo/CMakeFiles/algo.dir/pb-mv.cc.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/algo.dir/pb-mv.cc.s"
	cd /src/build/libde265/encoder/algo && /emsdk/upstream/emscripten/em++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /src/libde265/encoder/algo/pb-mv.cc -o CMakeFiles/algo.dir/pb-mv.cc.s

algo: libde265/encoder/algo/CMakeFiles/algo.dir/algo.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/coding-options.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/ctb-qscale.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/cb-split.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/cb-intrapartmode.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/cb-interpartmode.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/cb-skip.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/cb-intra-inter.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/cb-mergeindex.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/tb-split.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/tb-transform.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/tb-intrapredmode.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/tb-rateestim.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/pb-mv.cc.o
algo: libde265/encoder/algo/CMakeFiles/algo.dir/build.make

.PHONY : algo

# Rule to build all files generated by this target.
libde265/encoder/algo/CMakeFiles/algo.dir/build: algo

.PHONY : libde265/encoder/algo/CMakeFiles/algo.dir/build

libde265/encoder/algo/CMakeFiles/algo.dir/clean:
	cd /src/build/libde265/encoder/algo && $(CMAKE_COMMAND) -P CMakeFiles/algo.dir/cmake_clean.cmake
.PHONY : libde265/encoder/algo/CMakeFiles/algo.dir/clean

libde265/encoder/algo/CMakeFiles/algo.dir/depend:
	cd /src/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /src /src/libde265/encoder/algo /src/build /src/build/libde265/encoder/algo /src/build/libde265/encoder/algo/CMakeFiles/algo.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : libde265/encoder/algo/CMakeFiles/algo.dir/depend
