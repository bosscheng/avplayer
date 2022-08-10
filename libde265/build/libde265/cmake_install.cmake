# Install script for directory: /src/libde265

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/emsdk/upstream/emscripten/cache/sysroot")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "RELEASE")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "TRUE")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "/src/build/libde265/liblibde265.a")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/libde265" TYPE FILE FILES
    "/src/libde265/acceleration.h"
    "/src/libde265/alloc_pool.h"
    "/src/libde265/bitstream.h"
    "/src/libde265/cabac.h"
    "/src/libde265/configparam.h"
    "/src/libde265/de265-version.h"
    "/src/libde265/contextmodel.h"
    "/src/libde265/de265.h"
    "/src/libde265/deblock.h"
    "/src/libde265/decctx.h"
    "/src/libde265/dpb.h"
    "/src/libde265/en265.h"
    "/src/libde265/fallback-dct.h"
    "/src/libde265/fallback-motion.h"
    "/src/libde265/fallback.h"
    "/src/libde265/image-io.h"
    "/src/libde265/image.h"
    "/src/libde265/intrapred.h"
    "/src/libde265/md5.h"
    "/src/libde265/motion.h"
    "/src/libde265/nal-parser.h"
    "/src/libde265/nal.h"
    "/src/libde265/pps.h"
    "/src/libde265/quality.h"
    "/src/libde265/refpic.h"
    "/src/libde265/sao.h"
    "/src/libde265/scan.h"
    "/src/libde265/sei.h"
    "/src/libde265/slice.h"
    "/src/libde265/sps.h"
    "/src/libde265/threads.h"
    "/src/libde265/transform.h"
    "/src/libde265/util.h"
    "/src/libde265/visualize.h"
    "/src/libde265/vps.h"
    "/src/libde265/vui.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include/libde265" TYPE FILE FILES "/src/build/libde265/de265-version.h")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/libde265/libde265Config.cmake")
    file(DIFFERENT EXPORT_FILE_CHANGED FILES
         "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/libde265/libde265Config.cmake"
         "/src/build/libde265/CMakeFiles/Export/lib/cmake/libde265/libde265Config.cmake")
    if(EXPORT_FILE_CHANGED)
      file(GLOB OLD_CONFIG_FILES "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/libde265/libde265Config-*.cmake")
      if(OLD_CONFIG_FILES)
        message(STATUS "Old export file \"$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/lib/cmake/libde265/libde265Config.cmake\" will be replaced.  Removing files [${OLD_CONFIG_FILES}].")
        file(REMOVE ${OLD_CONFIG_FILES})
      endif()
    endif()
  endif()
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/libde265" TYPE FILE FILES "/src/build/libde265/CMakeFiles/Export/lib/cmake/libde265/libde265Config.cmake")
  if("${CMAKE_INSTALL_CONFIG_NAME}" MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
    file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/libde265" TYPE FILE FILES "/src/build/libde265/CMakeFiles/Export/lib/cmake/libde265/libde265Config-release.cmake")
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/cmake/libde265" TYPE FILE FILES "/src/build/libde265/libde265ConfigVersion.cmake")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/src/build/libde265/encoder/cmake_install.cmake")
  include("/src/build/libde265/x86/cmake_install.cmake")

endif()

