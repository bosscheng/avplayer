#----------------------------------------------------------------
# Generated CMake target import file for configuration "RELEASE".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "libde265" for configuration "RELEASE"
set_property(TARGET libde265 APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(libde265 PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_RELEASE "CXX"
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/lib/liblibde265.a"
  )

list(APPEND _IMPORT_CHECK_TARGETS libde265 )
list(APPEND _IMPORT_CHECK_FILES_FOR_libde265 "${_IMPORT_PREFIX}/lib/liblibde265.a" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
