(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('path'), require('fs'), require('crypto')) :
	typeof define === 'function' && define.amd ? define(['path', 'fs', 'crypto'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.path, global.fs, global.crypto));
})(this, (function (path, fs, crypto$1) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
	var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
	var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto$1);

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var decoder_simd_2 = createCommonjsModule(function (module) {
	  var Module = typeof Module != "undefined" ? Module : {};
	  var moduleOverrides = Object.assign({}, Module);
	  var thisProgram = "./this.program";

	  var ENVIRONMENT_IS_WEB = typeof window == "object";
	  var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
	  var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
	  var scriptDirectory = "";

	  function locateFile(path) {
	    if (Module["locateFile"]) {
	      return Module["locateFile"](path, scriptDirectory);
	    }

	    return scriptDirectory + path;
	  }

	  var read_, readAsync, readBinary;

	  var fs;
	  var nodePath;
	  var requireNodeFS;

	  if (ENVIRONMENT_IS_NODE) {
	    if (ENVIRONMENT_IS_WORKER) {
	      scriptDirectory = path__default["default"].dirname(scriptDirectory) + "/";
	    } else {
	      scriptDirectory = __dirname + "/";
	    }

	    requireNodeFS = () => {
	      if (!nodePath) {
	        fs = fs__default["default"];
	        nodePath = path__default["default"];
	      }
	    };

	    read_ = function shell_read(filename, binary) {
	      requireNodeFS();
	      filename = nodePath["normalize"](filename);
	      return fs.readFileSync(filename, binary ? undefined : "utf8");
	    };

	    readBinary = filename => {
	      var ret = read_(filename, true);

	      if (!ret.buffer) {
	        ret = new Uint8Array(ret);
	      }

	      return ret;
	    };

	    readAsync = (filename, onload, onerror) => {
	      requireNodeFS();
	      filename = nodePath["normalize"](filename);
	      fs.readFile(filename, function (err, data) {
	        if (err) onerror(err);else onload(data.buffer);
	      });
	    };

	    if (process["argv"].length > 1) {
	      thisProgram = process["argv"][1].replace(/\\/g, "/");
	    }

	    process["argv"].slice(2);

	    {
	      module["exports"] = Module;
	    }

	    process["on"]("uncaughtException", function (ex) {
	      if (!(ex instanceof ExitStatus)) {
	        throw ex;
	      }
	    });
	    process["on"]("unhandledRejection", function (reason) {
	      throw reason;
	    });

	    Module["inspect"] = function () {
	      return "[Emscripten Module object]";
	    };
	  } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
	    if (ENVIRONMENT_IS_WORKER) {
	      scriptDirectory = self.location.href;
	    } else if (typeof document != "undefined" && document.currentScript) {
	      scriptDirectory = document.currentScript.src;
	    }

	    if (scriptDirectory.indexOf("blob:") !== 0) {
	      scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
	    } else {
	      scriptDirectory = "";
	    }

	    {
	      read_ = url => {
	        var xhr = new XMLHttpRequest();
	        xhr.open("GET", url, false);
	        xhr.send(null);
	        return xhr.responseText;
	      };

	      if (ENVIRONMENT_IS_WORKER) {
	        readBinary = url => {
	          var xhr = new XMLHttpRequest();
	          xhr.open("GET", url, false);
	          xhr.responseType = "arraybuffer";
	          xhr.send(null);
	          return new Uint8Array(xhr.response);
	        };
	      }

	      readAsync = (url, onload, onerror) => {
	        var xhr = new XMLHttpRequest();
	        xhr.open("GET", url, true);
	        xhr.responseType = "arraybuffer";

	        xhr.onload = () => {
	          if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
	            onload(xhr.response);
	            return;
	          }

	          onerror();
	        };

	        xhr.onerror = onerror;
	        xhr.send(null);
	      };
	    }
	  } else ;

	  var out = Module["print"] || console.log.bind(console);
	  var err = Module["printErr"] || console.warn.bind(console);
	  Object.assign(Module, moduleOverrides);
	  moduleOverrides = null;
	  if (Module["arguments"]) ;
	  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
	  if (Module["quit"]) ;
	  var POINTER_SIZE = 4;

	  var wasmBinary;
	  if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
	  Module["noExitRuntime"] || true;

	  if (typeof WebAssembly != "object") {
	    abort("no native wasm support detected");
	  }

	  var wasmMemory;
	  var ABORT = false;

	  function assert(condition, text) {
	    if (!condition) {
	      abort(text);
	    }
	  }

	  var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;

	  function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
	    var endIdx = idx + maxBytesToRead;
	    var endPtr = idx;

	    while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;

	    if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
	      return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
	    } else {
	      var str = "";

	      while (idx < endPtr) {
	        var u0 = heapOrArray[idx++];

	        if (!(u0 & 128)) {
	          str += String.fromCharCode(u0);
	          continue;
	        }

	        var u1 = heapOrArray[idx++] & 63;

	        if ((u0 & 224) == 192) {
	          str += String.fromCharCode((u0 & 31) << 6 | u1);
	          continue;
	        }

	        var u2 = heapOrArray[idx++] & 63;

	        if ((u0 & 240) == 224) {
	          u0 = (u0 & 15) << 12 | u1 << 6 | u2;
	        } else {
	          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
	        }

	        if (u0 < 65536) {
	          str += String.fromCharCode(u0);
	        } else {
	          var ch = u0 - 65536;
	          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
	        }
	      }
	    }

	    return str;
	  }

	  function UTF8ToString(ptr, maxBytesToRead) {
	    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
	  }

	  function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
	    if (!(maxBytesToWrite > 0)) return 0;
	    var startIdx = outIdx;
	    var endIdx = outIdx + maxBytesToWrite - 1;

	    for (var i = 0; i < str.length; ++i) {
	      var u = str.charCodeAt(i);

	      if (u >= 55296 && u <= 57343) {
	        var u1 = str.charCodeAt(++i);
	        u = 65536 + ((u & 1023) << 10) | u1 & 1023;
	      }

	      if (u <= 127) {
	        if (outIdx >= endIdx) break;
	        heap[outIdx++] = u;
	      } else if (u <= 2047) {
	        if (outIdx + 1 >= endIdx) break;
	        heap[outIdx++] = 192 | u >> 6;
	        heap[outIdx++] = 128 | u & 63;
	      } else if (u <= 65535) {
	        if (outIdx + 2 >= endIdx) break;
	        heap[outIdx++] = 224 | u >> 12;
	        heap[outIdx++] = 128 | u >> 6 & 63;
	        heap[outIdx++] = 128 | u & 63;
	      } else {
	        if (outIdx + 3 >= endIdx) break;
	        heap[outIdx++] = 240 | u >> 18;
	        heap[outIdx++] = 128 | u >> 12 & 63;
	        heap[outIdx++] = 128 | u >> 6 & 63;
	        heap[outIdx++] = 128 | u & 63;
	      }
	    }

	    heap[outIdx] = 0;
	    return outIdx - startIdx;
	  }

	  function stringToUTF8(str, outPtr, maxBytesToWrite) {
	    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
	  }

	  function lengthBytesUTF8(str) {
	    var len = 0;

	    for (var i = 0; i < str.length; ++i) {
	      var u = str.charCodeAt(i);
	      if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
	      if (u <= 127) ++len;else if (u <= 2047) len += 2;else if (u <= 65535) len += 3;else len += 4;
	    }

	    return len;
	  }

	  var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : undefined;

	  function UTF16ToString(ptr, maxBytesToRead) {
	    var endPtr = ptr;
	    var idx = endPtr >> 1;
	    var maxIdx = idx + maxBytesToRead / 2;

	    while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;

	    endPtr = idx << 1;

	    if (endPtr - ptr > 32 && UTF16Decoder) {
	      return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
	    } else {
	      var str = "";

	      for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
	        var codeUnit = HEAP16[ptr + i * 2 >> 1];
	        if (codeUnit == 0) break;
	        str += String.fromCharCode(codeUnit);
	      }

	      return str;
	    }
	  }

	  function stringToUTF16(str, outPtr, maxBytesToWrite) {
	    if (maxBytesToWrite === undefined) {
	      maxBytesToWrite = 2147483647;
	    }

	    if (maxBytesToWrite < 2) return 0;
	    maxBytesToWrite -= 2;
	    var startPtr = outPtr;
	    var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;

	    for (var i = 0; i < numCharsToWrite; ++i) {
	      var codeUnit = str.charCodeAt(i);
	      HEAP16[outPtr >> 1] = codeUnit;
	      outPtr += 2;
	    }

	    HEAP16[outPtr >> 1] = 0;
	    return outPtr - startPtr;
	  }

	  function lengthBytesUTF16(str) {
	    return str.length * 2;
	  }

	  function UTF32ToString(ptr, maxBytesToRead) {
	    var i = 0;
	    var str = "";

	    while (!(i >= maxBytesToRead / 4)) {
	      var utf32 = HEAP32[ptr + i * 4 >> 2];
	      if (utf32 == 0) break;
	      ++i;

	      if (utf32 >= 65536) {
	        var ch = utf32 - 65536;
	        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
	      } else {
	        str += String.fromCharCode(utf32);
	      }
	    }

	    return str;
	  }

	  function stringToUTF32(str, outPtr, maxBytesToWrite) {
	    if (maxBytesToWrite === undefined) {
	      maxBytesToWrite = 2147483647;
	    }

	    if (maxBytesToWrite < 4) return 0;
	    var startPtr = outPtr;
	    var endPtr = startPtr + maxBytesToWrite - 4;

	    for (var i = 0; i < str.length; ++i) {
	      var codeUnit = str.charCodeAt(i);

	      if (codeUnit >= 55296 && codeUnit <= 57343) {
	        var trailSurrogate = str.charCodeAt(++i);
	        codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
	      }

	      HEAP32[outPtr >> 2] = codeUnit;
	      outPtr += 4;
	      if (outPtr + 4 > endPtr) break;
	    }

	    HEAP32[outPtr >> 2] = 0;
	    return outPtr - startPtr;
	  }

	  function lengthBytesUTF32(str) {
	    var len = 0;

	    for (var i = 0; i < str.length; ++i) {
	      var codeUnit = str.charCodeAt(i);
	      if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
	      len += 4;
	    }

	    return len;
	  }

	  function writeAsciiToMemory(str, buffer, dontAddNull) {
	    for (var i = 0; i < str.length; ++i) {
	      HEAP8[buffer++ >> 0] = str.charCodeAt(i);
	    }

	    if (!dontAddNull) HEAP8[buffer >> 0] = 0;
	  }

	  var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

	  function updateGlobalBufferAndViews(buf) {
	    buffer = buf;
	    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
	    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
	    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
	    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
	    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
	    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
	    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
	    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
	  }

	  Module["INITIAL_MEMORY"] || 134217728;
	  var wasmTable;
	  var __ATPRERUN__ = [];
	  var __ATINIT__ = [];
	  var __ATPOSTRUN__ = [];

	  function preRun() {
	    if (Module["preRun"]) {
	      if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];

	      while (Module["preRun"].length) {
	        addOnPreRun(Module["preRun"].shift());
	      }
	    }

	    callRuntimeCallbacks(__ATPRERUN__);
	  }

	  function initRuntime() {
	    if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
	    FS.ignorePermissions = false;
	    callRuntimeCallbacks(__ATINIT__);
	  }

	  function postRun() {
	    if (Module["postRun"]) {
	      if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];

	      while (Module["postRun"].length) {
	        addOnPostRun(Module["postRun"].shift());
	      }
	    }

	    callRuntimeCallbacks(__ATPOSTRUN__);
	  }

	  function addOnPreRun(cb) {
	    __ATPRERUN__.unshift(cb);
	  }

	  function addOnInit(cb) {
	    __ATINIT__.unshift(cb);
	  }

	  function addOnPostRun(cb) {
	    __ATPOSTRUN__.unshift(cb);
	  }

	  var runDependencies = 0;
	  var dependenciesFulfilled = null;

	  function getUniqueRunDependency(id) {
	    return id;
	  }

	  function addRunDependency(id) {
	    runDependencies++;

	    if (Module["monitorRunDependencies"]) {
	      Module["monitorRunDependencies"](runDependencies);
	    }
	  }

	  function removeRunDependency(id) {
	    runDependencies--;

	    if (Module["monitorRunDependencies"]) {
	      Module["monitorRunDependencies"](runDependencies);
	    }

	    if (runDependencies == 0) {

	      if (dependenciesFulfilled) {
	        var callback = dependenciesFulfilled;
	        dependenciesFulfilled = null;
	        callback();
	      }
	    }
	  }

	  function abort(what) {
	    {
	      if (Module["onAbort"]) {
	        Module["onAbort"](what);
	      }
	    }
	    what = "Aborted(" + what + ")";
	    err(what);
	    ABORT = true;
	    what += ". Build with -sASSERTIONS for more info.";
	    var e = new WebAssembly.RuntimeError(what);
	    throw e;
	  }

	  var dataURIPrefix = "data:application/octet-stream;base64,";

	  function isDataURI(filename) {
	    return filename.startsWith(dataURIPrefix);
	  }

	  function isFileURI(filename) {
	    return filename.startsWith("file://");
	  }

	  var wasmBinaryFile;
	  wasmBinaryFile = "decoder_simd_2.wasm";

	  if (!isDataURI(wasmBinaryFile)) {
	    wasmBinaryFile = locateFile(wasmBinaryFile);
	  }

	  function getBinary(file) {
	    try {
	      if (file == wasmBinaryFile && wasmBinary) {
	        return new Uint8Array(wasmBinary);
	      }

	      if (readBinary) {
	        return readBinary(file);
	      } else {
	        throw "both async and sync fetching of the wasm failed";
	      }
	    } catch (err) {
	      abort(err);
	    }
	  }

	  function getBinaryPromise() {
	    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
	      if (typeof fetch == "function" && !isFileURI(wasmBinaryFile)) {
	        return fetch(wasmBinaryFile, {
	          credentials: "same-origin"
	        }).then(function (response) {
	          if (!response["ok"]) {
	            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
	          }

	          return response["arrayBuffer"]();
	        }).catch(function () {
	          return getBinary(wasmBinaryFile);
	        });
	      } else {
	        if (readAsync) {
	          return new Promise(function (resolve, reject) {
	            readAsync(wasmBinaryFile, function (response) {
	              resolve(new Uint8Array(response));
	            }, reject);
	          });
	        }
	      }
	    }

	    return Promise.resolve().then(function () {
	      return getBinary(wasmBinaryFile);
	    });
	  }

	  function createWasm() {
	    var info = {
	      "a": asmLibraryArg
	    };

	    function receiveInstance(instance, module) {
	      var exports = instance.exports;
	      Module["asm"] = exports;
	      wasmMemory = Module["asm"]["F"];
	      updateGlobalBufferAndViews(wasmMemory.buffer);
	      wasmTable = Module["asm"]["M"];
	      addOnInit(Module["asm"]["G"]);
	      removeRunDependency();
	    }

	    addRunDependency();

	    function receiveInstantiationResult(result) {
	      receiveInstance(result["instance"]);
	    }

	    function instantiateArrayBuffer(receiver) {
	      return getBinaryPromise().then(function (binary) {
	        return WebAssembly.instantiate(binary, info);
	      }).then(function (instance) {
	        return instance;
	      }).then(receiver, function (reason) {
	        err("failed to asynchronously prepare wasm: " + reason);
	        abort(reason);
	      });
	    }

	    function instantiateAsync() {
	      if (!wasmBinary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
	        return fetch(wasmBinaryFile, {
	          credentials: "same-origin"
	        }).then(function (response) {
	          var result = WebAssembly.instantiateStreaming(response, info);
	          return result.then(receiveInstantiationResult, function (reason) {
	            err("wasm streaming compile failed: " + reason);
	            err("falling back to ArrayBuffer instantiation");
	            return instantiateArrayBuffer(receiveInstantiationResult);
	          });
	        });
	      } else {
	        return instantiateArrayBuffer(receiveInstantiationResult);
	      }
	    }

	    if (Module["instantiateWasm"]) {
	      try {
	        var exports = Module["instantiateWasm"](info, receiveInstance);
	        return exports;
	      } catch (e) {
	        err("Module.instantiateWasm callback failed with error: " + e);
	        return false;
	      }
	    }

	    instantiateAsync();
	    return {};
	  }

	  var tempDouble;
	  var tempI64;

	  function callRuntimeCallbacks(callbacks) {
	    while (callbacks.length > 0) {
	      callbacks.shift()(Module);
	    }
	  }

	  var wasmTableMirror = [];

	  function getWasmTableEntry(funcPtr) {
	    var func = wasmTableMirror[funcPtr];

	    if (!func) {
	      if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
	      wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
	    }

	    return func;
	  }

	  function ___cxa_allocate_exception(size) {
	    return _malloc(size + 24) + 24;
	  }

	  function ExceptionInfo(excPtr) {
	    this.excPtr = excPtr;
	    this.ptr = excPtr - 24;

	    this.set_type = function (type) {
	      HEAPU32[this.ptr + 4 >> 2] = type;
	    };

	    this.get_type = function () {
	      return HEAPU32[this.ptr + 4 >> 2];
	    };

	    this.set_destructor = function (destructor) {
	      HEAPU32[this.ptr + 8 >> 2] = destructor;
	    };

	    this.get_destructor = function () {
	      return HEAPU32[this.ptr + 8 >> 2];
	    };

	    this.set_refcount = function (refcount) {
	      HEAP32[this.ptr >> 2] = refcount;
	    };

	    this.set_caught = function (caught) {
	      caught = caught ? 1 : 0;
	      HEAP8[this.ptr + 12 >> 0] = caught;
	    };

	    this.get_caught = function () {
	      return HEAP8[this.ptr + 12 >> 0] != 0;
	    };

	    this.set_rethrown = function (rethrown) {
	      rethrown = rethrown ? 1 : 0;
	      HEAP8[this.ptr + 13 >> 0] = rethrown;
	    };

	    this.get_rethrown = function () {
	      return HEAP8[this.ptr + 13 >> 0] != 0;
	    };

	    this.init = function (type, destructor) {
	      this.set_adjusted_ptr(0);
	      this.set_type(type);
	      this.set_destructor(destructor);
	      this.set_refcount(0);
	      this.set_caught(false);
	      this.set_rethrown(false);
	    };

	    this.add_ref = function () {
	      var value = HEAP32[this.ptr >> 2];
	      HEAP32[this.ptr >> 2] = value + 1;
	    };

	    this.release_ref = function () {
	      var prev = HEAP32[this.ptr >> 2];
	      HEAP32[this.ptr >> 2] = prev - 1;
	      return prev === 1;
	    };

	    this.set_adjusted_ptr = function (adjustedPtr) {
	      HEAPU32[this.ptr + 16 >> 2] = adjustedPtr;
	    };

	    this.get_adjusted_ptr = function () {
	      return HEAPU32[this.ptr + 16 >> 2];
	    };

	    this.get_exception_ptr = function () {
	      var isPointer = ___cxa_is_pointer_type(this.get_type());

	      if (isPointer) {
	        return HEAPU32[this.excPtr >> 2];
	      }

	      var adjusted = this.get_adjusted_ptr();
	      if (adjusted !== 0) return adjusted;
	      return this.excPtr;
	    };
	  }

	  function ___cxa_throw(ptr, type, destructor) {
	    var info = new ExceptionInfo(ptr);
	    info.init(type, destructor);
	    throw ptr;
	  }

	  function setErrNo(value) {
	    HEAP32[___errno_location() >> 2] = value;
	    return value;
	  }

	  var PATH = {
	    isAbs: path => path.charAt(0) === "/",
	    splitPath: filename => {
	      var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	      return splitPathRe.exec(filename).slice(1);
	    },
	    normalizeArray: (parts, allowAboveRoot) => {
	      var up = 0;

	      for (var i = parts.length - 1; i >= 0; i--) {
	        var last = parts[i];

	        if (last === ".") {
	          parts.splice(i, 1);
	        } else if (last === "..") {
	          parts.splice(i, 1);
	          up++;
	        } else if (up) {
	          parts.splice(i, 1);
	          up--;
	        }
	      }

	      if (allowAboveRoot) {
	        for (; up; up--) {
	          parts.unshift("..");
	        }
	      }

	      return parts;
	    },
	    normalize: path => {
	      var isAbsolute = PATH.isAbs(path),
	          trailingSlash = path.substr(-1) === "/";
	      path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");

	      if (!path && !isAbsolute) {
	        path = ".";
	      }

	      if (path && trailingSlash) {
	        path += "/";
	      }

	      return (isAbsolute ? "/" : "") + path;
	    },
	    dirname: path => {
	      var result = PATH.splitPath(path),
	          root = result[0],
	          dir = result[1];

	      if (!root && !dir) {
	        return ".";
	      }

	      if (dir) {
	        dir = dir.substr(0, dir.length - 1);
	      }

	      return root + dir;
	    },
	    basename: path => {
	      if (path === "/") return "/";
	      path = PATH.normalize(path);
	      path = path.replace(/\/$/, "");
	      var lastSlash = path.lastIndexOf("/");
	      if (lastSlash === -1) return path;
	      return path.substr(lastSlash + 1);
	    },
	    join: function () {
	      var paths = Array.prototype.slice.call(arguments, 0);
	      return PATH.normalize(paths.join("/"));
	    },
	    join2: (l, r) => {
	      return PATH.normalize(l + "/" + r);
	    }
	  };

	  function getRandomDevice() {
	    if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
	      var randomBuffer = new Uint8Array(1);
	      return function () {
	        crypto.getRandomValues(randomBuffer);
	        return randomBuffer[0];
	      };
	    } else if (ENVIRONMENT_IS_NODE) {
	      try {
	        var crypto_module = crypto__default["default"];
	        return function () {
	          return crypto_module["randomBytes"](1)[0];
	        };
	      } catch (e) {}
	    }

	    return function () {
	      abort("randomDevice");
	    };
	  }

	  var PATH_FS = {
	    resolve: function () {
	      var resolvedPath = "",
	          resolvedAbsolute = false;

	      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	        var path = i >= 0 ? arguments[i] : FS.cwd();

	        if (typeof path != "string") {
	          throw new TypeError("Arguments to path.resolve must be strings");
	        } else if (!path) {
	          return "";
	        }

	        resolvedPath = path + "/" + resolvedPath;
	        resolvedAbsolute = PATH.isAbs(path);
	      }

	      resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
	      return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
	    },
	    relative: (from, to) => {
	      from = PATH_FS.resolve(from).substr(1);
	      to = PATH_FS.resolve(to).substr(1);

	      function trim(arr) {
	        var start = 0;

	        for (; start < arr.length; start++) {
	          if (arr[start] !== "") break;
	        }

	        var end = arr.length - 1;

	        for (; end >= 0; end--) {
	          if (arr[end] !== "") break;
	        }

	        if (start > end) return [];
	        return arr.slice(start, end - start + 1);
	      }

	      var fromParts = trim(from.split("/"));
	      var toParts = trim(to.split("/"));
	      var length = Math.min(fromParts.length, toParts.length);
	      var samePartsLength = length;

	      for (var i = 0; i < length; i++) {
	        if (fromParts[i] !== toParts[i]) {
	          samePartsLength = i;
	          break;
	        }
	      }

	      var outputParts = [];

	      for (var i = samePartsLength; i < fromParts.length; i++) {
	        outputParts.push("..");
	      }

	      outputParts = outputParts.concat(toParts.slice(samePartsLength));
	      return outputParts.join("/");
	    }
	  };
	  var TTY = {
	    ttys: [],
	    init: function () {},
	    shutdown: function () {},
	    register: function (dev, ops) {
	      TTY.ttys[dev] = {
	        input: [],
	        output: [],
	        ops: ops
	      };
	      FS.registerDevice(dev, TTY.stream_ops);
	    },
	    stream_ops: {
	      open: function (stream) {
	        var tty = TTY.ttys[stream.node.rdev];

	        if (!tty) {
	          throw new FS.ErrnoError(43);
	        }

	        stream.tty = tty;
	        stream.seekable = false;
	      },
	      close: function (stream) {
	        stream.tty.ops.flush(stream.tty);
	      },
	      flush: function (stream) {
	        stream.tty.ops.flush(stream.tty);
	      },
	      read: function (stream, buffer, offset, length, pos) {
	        if (!stream.tty || !stream.tty.ops.get_char) {
	          throw new FS.ErrnoError(60);
	        }

	        var bytesRead = 0;

	        for (var i = 0; i < length; i++) {
	          var result;

	          try {
	            result = stream.tty.ops.get_char(stream.tty);
	          } catch (e) {
	            throw new FS.ErrnoError(29);
	          }

	          if (result === undefined && bytesRead === 0) {
	            throw new FS.ErrnoError(6);
	          }

	          if (result === null || result === undefined) break;
	          bytesRead++;
	          buffer[offset + i] = result;
	        }

	        if (bytesRead) {
	          stream.node.timestamp = Date.now();
	        }

	        return bytesRead;
	      },
	      write: function (stream, buffer, offset, length, pos) {
	        if (!stream.tty || !stream.tty.ops.put_char) {
	          throw new FS.ErrnoError(60);
	        }

	        try {
	          for (var i = 0; i < length; i++) {
	            stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
	          }
	        } catch (e) {
	          throw new FS.ErrnoError(29);
	        }

	        if (length) {
	          stream.node.timestamp = Date.now();
	        }

	        return i;
	      }
	    },
	    default_tty_ops: {
	      get_char: function (tty) {
	        if (!tty.input.length) {
	          var result = null;

	          if (ENVIRONMENT_IS_NODE) {
	            var BUFSIZE = 256;
	            var buf = Buffer.alloc(BUFSIZE);
	            var bytesRead = 0;

	            try {
	              bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1);
	            } catch (e) {
	              if (e.toString().includes("EOF")) bytesRead = 0;else throw e;
	            }

	            if (bytesRead > 0) {
	              result = buf.slice(0, bytesRead).toString("utf-8");
	            } else {
	              result = null;
	            }
	          } else if (typeof window != "undefined" && typeof window.prompt == "function") {
	            result = window.prompt("Input: ");

	            if (result !== null) {
	              result += "\n";
	            }
	          } else if (typeof readline == "function") {
	            result = readline();

	            if (result !== null) {
	              result += "\n";
	            }
	          }

	          if (!result) {
	            return null;
	          }

	          tty.input = intArrayFromString(result, true);
	        }

	        return tty.input.shift();
	      },
	      put_char: function (tty, val) {
	        if (val === null || val === 10) {
	          out(UTF8ArrayToString(tty.output, 0));
	          tty.output = [];
	        } else {
	          if (val != 0) tty.output.push(val);
	        }
	      },
	      flush: function (tty) {
	        if (tty.output && tty.output.length > 0) {
	          out(UTF8ArrayToString(tty.output, 0));
	          tty.output = [];
	        }
	      }
	    },
	    default_tty1_ops: {
	      put_char: function (tty, val) {
	        if (val === null || val === 10) {
	          err(UTF8ArrayToString(tty.output, 0));
	          tty.output = [];
	        } else {
	          if (val != 0) tty.output.push(val);
	        }
	      },
	      flush: function (tty) {
	        if (tty.output && tty.output.length > 0) {
	          err(UTF8ArrayToString(tty.output, 0));
	          tty.output = [];
	        }
	      }
	    }
	  };

	  function mmapAlloc(size) {
	    abort();
	  }

	  var MEMFS = {
	    ops_table: null,
	    mount: function (mount) {
	      return MEMFS.createNode(null, "/", 16384 | 511, 0);
	    },
	    createNode: function (parent, name, mode, dev) {
	      if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
	        throw new FS.ErrnoError(63);
	      }

	      if (!MEMFS.ops_table) {
	        MEMFS.ops_table = {
	          dir: {
	            node: {
	              getattr: MEMFS.node_ops.getattr,
	              setattr: MEMFS.node_ops.setattr,
	              lookup: MEMFS.node_ops.lookup,
	              mknod: MEMFS.node_ops.mknod,
	              rename: MEMFS.node_ops.rename,
	              unlink: MEMFS.node_ops.unlink,
	              rmdir: MEMFS.node_ops.rmdir,
	              readdir: MEMFS.node_ops.readdir,
	              symlink: MEMFS.node_ops.symlink
	            },
	            stream: {
	              llseek: MEMFS.stream_ops.llseek
	            }
	          },
	          file: {
	            node: {
	              getattr: MEMFS.node_ops.getattr,
	              setattr: MEMFS.node_ops.setattr
	            },
	            stream: {
	              llseek: MEMFS.stream_ops.llseek,
	              read: MEMFS.stream_ops.read,
	              write: MEMFS.stream_ops.write,
	              allocate: MEMFS.stream_ops.allocate,
	              mmap: MEMFS.stream_ops.mmap,
	              msync: MEMFS.stream_ops.msync
	            }
	          },
	          link: {
	            node: {
	              getattr: MEMFS.node_ops.getattr,
	              setattr: MEMFS.node_ops.setattr,
	              readlink: MEMFS.node_ops.readlink
	            },
	            stream: {}
	          },
	          chrdev: {
	            node: {
	              getattr: MEMFS.node_ops.getattr,
	              setattr: MEMFS.node_ops.setattr
	            },
	            stream: FS.chrdev_stream_ops
	          }
	        };
	      }

	      var node = FS.createNode(parent, name, mode, dev);

	      if (FS.isDir(node.mode)) {
	        node.node_ops = MEMFS.ops_table.dir.node;
	        node.stream_ops = MEMFS.ops_table.dir.stream;
	        node.contents = {};
	      } else if (FS.isFile(node.mode)) {
	        node.node_ops = MEMFS.ops_table.file.node;
	        node.stream_ops = MEMFS.ops_table.file.stream;
	        node.usedBytes = 0;
	        node.contents = null;
	      } else if (FS.isLink(node.mode)) {
	        node.node_ops = MEMFS.ops_table.link.node;
	        node.stream_ops = MEMFS.ops_table.link.stream;
	      } else if (FS.isChrdev(node.mode)) {
	        node.node_ops = MEMFS.ops_table.chrdev.node;
	        node.stream_ops = MEMFS.ops_table.chrdev.stream;
	      }

	      node.timestamp = Date.now();

	      if (parent) {
	        parent.contents[name] = node;
	        parent.timestamp = node.timestamp;
	      }

	      return node;
	    },
	    getFileDataAsTypedArray: function (node) {
	      if (!node.contents) return new Uint8Array(0);
	      if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
	      return new Uint8Array(node.contents);
	    },
	    expandFileStorage: function (node, newCapacity) {
	      var prevCapacity = node.contents ? node.contents.length : 0;
	      if (prevCapacity >= newCapacity) return;
	      var CAPACITY_DOUBLING_MAX = 1024 * 1024;
	      newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
	      if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
	      var oldContents = node.contents;
	      node.contents = new Uint8Array(newCapacity);
	      if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
	    },
	    resizeFileStorage: function (node, newSize) {
	      if (node.usedBytes == newSize) return;

	      if (newSize == 0) {
	        node.contents = null;
	        node.usedBytes = 0;
	      } else {
	        var oldContents = node.contents;
	        node.contents = new Uint8Array(newSize);

	        if (oldContents) {
	          node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
	        }

	        node.usedBytes = newSize;
	      }
	    },
	    node_ops: {
	      getattr: function (node) {
	        var attr = {};
	        attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
	        attr.ino = node.id;
	        attr.mode = node.mode;
	        attr.nlink = 1;
	        attr.uid = 0;
	        attr.gid = 0;
	        attr.rdev = node.rdev;

	        if (FS.isDir(node.mode)) {
	          attr.size = 4096;
	        } else if (FS.isFile(node.mode)) {
	          attr.size = node.usedBytes;
	        } else if (FS.isLink(node.mode)) {
	          attr.size = node.link.length;
	        } else {
	          attr.size = 0;
	        }

	        attr.atime = new Date(node.timestamp);
	        attr.mtime = new Date(node.timestamp);
	        attr.ctime = new Date(node.timestamp);
	        attr.blksize = 4096;
	        attr.blocks = Math.ceil(attr.size / attr.blksize);
	        return attr;
	      },
	      setattr: function (node, attr) {
	        if (attr.mode !== undefined) {
	          node.mode = attr.mode;
	        }

	        if (attr.timestamp !== undefined) {
	          node.timestamp = attr.timestamp;
	        }

	        if (attr.size !== undefined) {
	          MEMFS.resizeFileStorage(node, attr.size);
	        }
	      },
	      lookup: function (parent, name) {
	        throw FS.genericErrors[44];
	      },
	      mknod: function (parent, name, mode, dev) {
	        return MEMFS.createNode(parent, name, mode, dev);
	      },
	      rename: function (old_node, new_dir, new_name) {
	        if (FS.isDir(old_node.mode)) {
	          var new_node;

	          try {
	            new_node = FS.lookupNode(new_dir, new_name);
	          } catch (e) {}

	          if (new_node) {
	            for (var i in new_node.contents) {
	              throw new FS.ErrnoError(55);
	            }
	          }
	        }

	        delete old_node.parent.contents[old_node.name];
	        old_node.parent.timestamp = Date.now();
	        old_node.name = new_name;
	        new_dir.contents[new_name] = old_node;
	        new_dir.timestamp = old_node.parent.timestamp;
	        old_node.parent = new_dir;
	      },
	      unlink: function (parent, name) {
	        delete parent.contents[name];
	        parent.timestamp = Date.now();
	      },
	      rmdir: function (parent, name) {
	        var node = FS.lookupNode(parent, name);

	        for (var i in node.contents) {
	          throw new FS.ErrnoError(55);
	        }

	        delete parent.contents[name];
	        parent.timestamp = Date.now();
	      },
	      readdir: function (node) {
	        var entries = [".", ".."];

	        for (var key in node.contents) {
	          if (!node.contents.hasOwnProperty(key)) {
	            continue;
	          }

	          entries.push(key);
	        }

	        return entries;
	      },
	      symlink: function (parent, newname, oldpath) {
	        var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
	        node.link = oldpath;
	        return node;
	      },
	      readlink: function (node) {
	        if (!FS.isLink(node.mode)) {
	          throw new FS.ErrnoError(28);
	        }

	        return node.link;
	      }
	    },
	    stream_ops: {
	      read: function (stream, buffer, offset, length, position) {
	        var contents = stream.node.contents;
	        if (position >= stream.node.usedBytes) return 0;
	        var size = Math.min(stream.node.usedBytes - position, length);

	        if (size > 8 && contents.subarray) {
	          buffer.set(contents.subarray(position, position + size), offset);
	        } else {
	          for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
	        }

	        return size;
	      },
	      write: function (stream, buffer, offset, length, position, canOwn) {
	        if (!length) return 0;
	        var node = stream.node;
	        node.timestamp = Date.now();

	        if (buffer.subarray && (!node.contents || node.contents.subarray)) {
	          if (canOwn) {
	            node.contents = buffer.subarray(offset, offset + length);
	            node.usedBytes = length;
	            return length;
	          } else if (node.usedBytes === 0 && position === 0) {
	            node.contents = buffer.slice(offset, offset + length);
	            node.usedBytes = length;
	            return length;
	          } else if (position + length <= node.usedBytes) {
	            node.contents.set(buffer.subarray(offset, offset + length), position);
	            return length;
	          }
	        }

	        MEMFS.expandFileStorage(node, position + length);

	        if (node.contents.subarray && buffer.subarray) {
	          node.contents.set(buffer.subarray(offset, offset + length), position);
	        } else {
	          for (var i = 0; i < length; i++) {
	            node.contents[position + i] = buffer[offset + i];
	          }
	        }

	        node.usedBytes = Math.max(node.usedBytes, position + length);
	        return length;
	      },
	      llseek: function (stream, offset, whence) {
	        var position = offset;

	        if (whence === 1) {
	          position += stream.position;
	        } else if (whence === 2) {
	          if (FS.isFile(stream.node.mode)) {
	            position += stream.node.usedBytes;
	          }
	        }

	        if (position < 0) {
	          throw new FS.ErrnoError(28);
	        }

	        return position;
	      },
	      allocate: function (stream, offset, length) {
	        MEMFS.expandFileStorage(stream.node, offset + length);
	        stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
	      },
	      mmap: function (stream, length, position, prot, flags) {
	        if (!FS.isFile(stream.node.mode)) {
	          throw new FS.ErrnoError(43);
	        }

	        var ptr;
	        var allocated;
	        var contents = stream.node.contents;

	        if (!(flags & 2) && contents.buffer === buffer) {
	          allocated = false;
	          ptr = contents.byteOffset;
	        } else {
	          if (position > 0 || position + length < contents.length) {
	            if (contents.subarray) {
	              contents = contents.subarray(position, position + length);
	            } else {
	              contents = Array.prototype.slice.call(contents, position, position + length);
	            }
	          }

	          allocated = true;
	          ptr = mmapAlloc();

	          if (!ptr) {
	            throw new FS.ErrnoError(48);
	          }

	          HEAP8.set(contents, ptr);
	        }

	        return {
	          ptr: ptr,
	          allocated: allocated
	        };
	      },
	      msync: function (stream, buffer, offset, length, mmapFlags) {
	        if (!FS.isFile(stream.node.mode)) {
	          throw new FS.ErrnoError(43);
	        }

	        if (mmapFlags & 2) {
	          return 0;
	        }

	        MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
	        return 0;
	      }
	    }
	  };

	  function asyncLoad(url, onload, onerror, noRunDep) {
	    var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
	    readAsync(url, function (arrayBuffer) {
	      assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
	      onload(new Uint8Array(arrayBuffer));
	      if (dep) removeRunDependency();
	    }, function (event) {
	      if (onerror) {
	        onerror();
	      } else {
	        throw 'Loading data file "' + url + '" failed.';
	      }
	    });
	    if (dep) addRunDependency();
	  }

	  var FS = {
	    root: null,
	    mounts: [],
	    devices: {},
	    streams: [],
	    nextInode: 1,
	    nameTable: null,
	    currentPath: "/",
	    initialized: false,
	    ignorePermissions: true,
	    ErrnoError: null,
	    genericErrors: {},
	    filesystems: null,
	    syncFSRequests: 0,
	    lookupPath: function (path) {
	      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      path = PATH_FS.resolve(FS.cwd(), path);
	      if (!path) return {
	        path: "",
	        node: null
	      };
	      var defaults = {
	        follow_mount: true,
	        recurse_count: 0
	      };
	      opts = Object.assign(defaults, opts);

	      if (opts.recurse_count > 8) {
	        throw new FS.ErrnoError(32);
	      }

	      var parts = PATH.normalizeArray(path.split("/").filter(p => !!p), false);
	      var current = FS.root;
	      var current_path = "/";

	      for (var i = 0; i < parts.length; i++) {
	        var islast = i === parts.length - 1;

	        if (islast && opts.parent) {
	          break;
	        }

	        current = FS.lookupNode(current, parts[i]);
	        current_path = PATH.join2(current_path, parts[i]);

	        if (FS.isMountpoint(current)) {
	          if (!islast || islast && opts.follow_mount) {
	            current = current.mounted.root;
	          }
	        }

	        if (!islast || opts.follow) {
	          var count = 0;

	          while (FS.isLink(current.mode)) {
	            var link = FS.readlink(current_path);
	            current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
	            var lookup = FS.lookupPath(current_path, {
	              recurse_count: opts.recurse_count + 1
	            });
	            current = lookup.node;

	            if (count++ > 40) {
	              throw new FS.ErrnoError(32);
	            }
	          }
	        }
	      }

	      return {
	        path: current_path,
	        node: current
	      };
	    },
	    getPath: node => {
	      var path;

	      while (true) {
	        if (FS.isRoot(node)) {
	          var mount = node.mount.mountpoint;
	          if (!path) return mount;
	          return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
	        }

	        path = path ? node.name + "/" + path : node.name;
	        node = node.parent;
	      }
	    },
	    hashName: (parentid, name) => {
	      var hash = 0;

	      for (var i = 0; i < name.length; i++) {
	        hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
	      }

	      return (parentid + hash >>> 0) % FS.nameTable.length;
	    },
	    hashAddNode: node => {
	      var hash = FS.hashName(node.parent.id, node.name);
	      node.name_next = FS.nameTable[hash];
	      FS.nameTable[hash] = node;
	    },
	    hashRemoveNode: node => {
	      var hash = FS.hashName(node.parent.id, node.name);

	      if (FS.nameTable[hash] === node) {
	        FS.nameTable[hash] = node.name_next;
	      } else {
	        var current = FS.nameTable[hash];

	        while (current) {
	          if (current.name_next === node) {
	            current.name_next = node.name_next;
	            break;
	          }

	          current = current.name_next;
	        }
	      }
	    },
	    lookupNode: (parent, name) => {
	      var errCode = FS.mayLookup(parent);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode, parent);
	      }

	      var hash = FS.hashName(parent.id, name);

	      for (var node = FS.nameTable[hash]; node; node = node.name_next) {
	        var nodeName = node.name;

	        if (node.parent.id === parent.id && nodeName === name) {
	          return node;
	        }
	      }

	      return FS.lookup(parent, name);
	    },
	    createNode: (parent, name, mode, rdev) => {
	      var node = new FS.FSNode(parent, name, mode, rdev);
	      FS.hashAddNode(node);
	      return node;
	    },
	    destroyNode: node => {
	      FS.hashRemoveNode(node);
	    },
	    isRoot: node => {
	      return node === node.parent;
	    },
	    isMountpoint: node => {
	      return !!node.mounted;
	    },
	    isFile: mode => {
	      return (mode & 61440) === 32768;
	    },
	    isDir: mode => {
	      return (mode & 61440) === 16384;
	    },
	    isLink: mode => {
	      return (mode & 61440) === 40960;
	    },
	    isChrdev: mode => {
	      return (mode & 61440) === 8192;
	    },
	    isBlkdev: mode => {
	      return (mode & 61440) === 24576;
	    },
	    isFIFO: mode => {
	      return (mode & 61440) === 4096;
	    },
	    isSocket: mode => {
	      return (mode & 49152) === 49152;
	    },
	    flagModes: {
	      "r": 0,
	      "r+": 2,
	      "w": 577,
	      "w+": 578,
	      "a": 1089,
	      "a+": 1090
	    },
	    modeStringToFlags: str => {
	      var flags = FS.flagModes[str];

	      if (typeof flags == "undefined") {
	        throw new Error("Unknown file open mode: " + str);
	      }

	      return flags;
	    },
	    flagsToPermissionString: flag => {
	      var perms = ["r", "w", "rw"][flag & 3];

	      if (flag & 512) {
	        perms += "w";
	      }

	      return perms;
	    },
	    nodePermissions: (node, perms) => {
	      if (FS.ignorePermissions) {
	        return 0;
	      }

	      if (perms.includes("r") && !(node.mode & 292)) {
	        return 2;
	      } else if (perms.includes("w") && !(node.mode & 146)) {
	        return 2;
	      } else if (perms.includes("x") && !(node.mode & 73)) {
	        return 2;
	      }

	      return 0;
	    },
	    mayLookup: dir => {
	      var errCode = FS.nodePermissions(dir, "x");
	      if (errCode) return errCode;
	      if (!dir.node_ops.lookup) return 2;
	      return 0;
	    },
	    mayCreate: (dir, name) => {
	      try {
	        var node = FS.lookupNode(dir, name);
	        return 20;
	      } catch (e) {}

	      return FS.nodePermissions(dir, "wx");
	    },
	    mayDelete: (dir, name, isdir) => {
	      var node;

	      try {
	        node = FS.lookupNode(dir, name);
	      } catch (e) {
	        return e.errno;
	      }

	      var errCode = FS.nodePermissions(dir, "wx");

	      if (errCode) {
	        return errCode;
	      }

	      if (isdir) {
	        if (!FS.isDir(node.mode)) {
	          return 54;
	        }

	        if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
	          return 10;
	        }
	      } else {
	        if (FS.isDir(node.mode)) {
	          return 31;
	        }
	      }

	      return 0;
	    },
	    mayOpen: (node, flags) => {
	      if (!node) {
	        return 44;
	      }

	      if (FS.isLink(node.mode)) {
	        return 32;
	      } else if (FS.isDir(node.mode)) {
	        if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
	          return 31;
	        }
	      }

	      return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
	    },
	    MAX_OPEN_FDS: 4096,
	    nextfd: function () {
	      let fd_start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      let fd_end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FS.MAX_OPEN_FDS;

	      for (var fd = fd_start; fd <= fd_end; fd++) {
	        if (!FS.streams[fd]) {
	          return fd;
	        }
	      }

	      throw new FS.ErrnoError(33);
	    },
	    getStream: fd => FS.streams[fd],
	    createStream: (stream, fd_start, fd_end) => {
	      if (!FS.FSStream) {
	        FS.FSStream = function () {
	          this.shared = {};
	        };

	        FS.FSStream.prototype = {};
	        Object.defineProperties(FS.FSStream.prototype, {
	          object: {
	            get: function () {
	              return this.node;
	            },
	            set: function (val) {
	              this.node = val;
	            }
	          },
	          isRead: {
	            get: function () {
	              return (this.flags & 2097155) !== 1;
	            }
	          },
	          isWrite: {
	            get: function () {
	              return (this.flags & 2097155) !== 0;
	            }
	          },
	          isAppend: {
	            get: function () {
	              return this.flags & 1024;
	            }
	          },
	          flags: {
	            get: function () {
	              return this.shared.flags;
	            },
	            set: function (val) {
	              this.shared.flags = val;
	            }
	          },
	          position: {
	            get: function () {
	              return this.shared.position;
	            },
	            set: function (val) {
	              this.shared.position = val;
	            }
	          }
	        });
	      }

	      stream = Object.assign(new FS.FSStream(), stream);
	      var fd = FS.nextfd(fd_start, fd_end);
	      stream.fd = fd;
	      FS.streams[fd] = stream;
	      return stream;
	    },
	    closeStream: fd => {
	      FS.streams[fd] = null;
	    },
	    chrdev_stream_ops: {
	      open: stream => {
	        var device = FS.getDevice(stream.node.rdev);
	        stream.stream_ops = device.stream_ops;

	        if (stream.stream_ops.open) {
	          stream.stream_ops.open(stream);
	        }
	      },
	      llseek: () => {
	        throw new FS.ErrnoError(70);
	      }
	    },
	    major: dev => dev >> 8,
	    minor: dev => dev & 255,
	    makedev: (ma, mi) => ma << 8 | mi,
	    registerDevice: (dev, ops) => {
	      FS.devices[dev] = {
	        stream_ops: ops
	      };
	    },
	    getDevice: dev => FS.devices[dev],
	    getMounts: mount => {
	      var mounts = [];
	      var check = [mount];

	      while (check.length) {
	        var m = check.pop();
	        mounts.push(m);
	        check.push.apply(check, m.mounts);
	      }

	      return mounts;
	    },
	    syncfs: (populate, callback) => {
	      if (typeof populate == "function") {
	        callback = populate;
	        populate = false;
	      }

	      FS.syncFSRequests++;

	      if (FS.syncFSRequests > 1) {
	        err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
	      }

	      var mounts = FS.getMounts(FS.root.mount);
	      var completed = 0;

	      function doCallback(errCode) {
	        FS.syncFSRequests--;
	        return callback(errCode);
	      }

	      function done(errCode) {
	        if (errCode) {
	          if (!done.errored) {
	            done.errored = true;
	            return doCallback(errCode);
	          }

	          return;
	        }

	        if (++completed >= mounts.length) {
	          doCallback(null);
	        }
	      }

	      mounts.forEach(mount => {
	        if (!mount.type.syncfs) {
	          return done(null);
	        }

	        mount.type.syncfs(mount, populate, done);
	      });
	    },
	    mount: (type, opts, mountpoint) => {
	      var root = mountpoint === "/";
	      var pseudo = !mountpoint;
	      var node;

	      if (root && FS.root) {
	        throw new FS.ErrnoError(10);
	      } else if (!root && !pseudo) {
	        var lookup = FS.lookupPath(mountpoint, {
	          follow_mount: false
	        });
	        mountpoint = lookup.path;
	        node = lookup.node;

	        if (FS.isMountpoint(node)) {
	          throw new FS.ErrnoError(10);
	        }

	        if (!FS.isDir(node.mode)) {
	          throw new FS.ErrnoError(54);
	        }
	      }

	      var mount = {
	        type: type,
	        opts: opts,
	        mountpoint: mountpoint,
	        mounts: []
	      };
	      var mountRoot = type.mount(mount);
	      mountRoot.mount = mount;
	      mount.root = mountRoot;

	      if (root) {
	        FS.root = mountRoot;
	      } else if (node) {
	        node.mounted = mount;

	        if (node.mount) {
	          node.mount.mounts.push(mount);
	        }
	      }

	      return mountRoot;
	    },
	    unmount: mountpoint => {
	      var lookup = FS.lookupPath(mountpoint, {
	        follow_mount: false
	      });

	      if (!FS.isMountpoint(lookup.node)) {
	        throw new FS.ErrnoError(28);
	      }

	      var node = lookup.node;
	      var mount = node.mounted;
	      var mounts = FS.getMounts(mount);
	      Object.keys(FS.nameTable).forEach(hash => {
	        var current = FS.nameTable[hash];

	        while (current) {
	          var next = current.name_next;

	          if (mounts.includes(current.mount)) {
	            FS.destroyNode(current);
	          }

	          current = next;
	        }
	      });
	      node.mounted = null;
	      var idx = node.mount.mounts.indexOf(mount);
	      node.mount.mounts.splice(idx, 1);
	    },
	    lookup: (parent, name) => {
	      return parent.node_ops.lookup(parent, name);
	    },
	    mknod: (path, mode, dev) => {
	      var lookup = FS.lookupPath(path, {
	        parent: true
	      });
	      var parent = lookup.node;
	      var name = PATH.basename(path);

	      if (!name || name === "." || name === "..") {
	        throw new FS.ErrnoError(28);
	      }

	      var errCode = FS.mayCreate(parent, name);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!parent.node_ops.mknod) {
	        throw new FS.ErrnoError(63);
	      }

	      return parent.node_ops.mknod(parent, name, mode, dev);
	    },
	    create: (path, mode) => {
	      mode = mode !== undefined ? mode : 438;
	      mode &= 4095;
	      mode |= 32768;
	      return FS.mknod(path, mode, 0);
	    },
	    mkdir: (path, mode) => {
	      mode = mode !== undefined ? mode : 511;
	      mode &= 511 | 512;
	      mode |= 16384;
	      return FS.mknod(path, mode, 0);
	    },
	    mkdirTree: (path, mode) => {
	      var dirs = path.split("/");
	      var d = "";

	      for (var i = 0; i < dirs.length; ++i) {
	        if (!dirs[i]) continue;
	        d += "/" + dirs[i];

	        try {
	          FS.mkdir(d, mode);
	        } catch (e) {
	          if (e.errno != 20) throw e;
	        }
	      }
	    },
	    mkdev: (path, mode, dev) => {
	      if (typeof dev == "undefined") {
	        dev = mode;
	        mode = 438;
	      }

	      mode |= 8192;
	      return FS.mknod(path, mode, dev);
	    },
	    symlink: (oldpath, newpath) => {
	      if (!PATH_FS.resolve(oldpath)) {
	        throw new FS.ErrnoError(44);
	      }

	      var lookup = FS.lookupPath(newpath, {
	        parent: true
	      });
	      var parent = lookup.node;

	      if (!parent) {
	        throw new FS.ErrnoError(44);
	      }

	      var newname = PATH.basename(newpath);
	      var errCode = FS.mayCreate(parent, newname);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!parent.node_ops.symlink) {
	        throw new FS.ErrnoError(63);
	      }

	      return parent.node_ops.symlink(parent, newname, oldpath);
	    },
	    rename: (old_path, new_path) => {
	      var old_dirname = PATH.dirname(old_path);
	      var new_dirname = PATH.dirname(new_path);
	      var old_name = PATH.basename(old_path);
	      var new_name = PATH.basename(new_path);
	      var lookup, old_dir, new_dir;
	      lookup = FS.lookupPath(old_path, {
	        parent: true
	      });
	      old_dir = lookup.node;
	      lookup = FS.lookupPath(new_path, {
	        parent: true
	      });
	      new_dir = lookup.node;
	      if (!old_dir || !new_dir) throw new FS.ErrnoError(44);

	      if (old_dir.mount !== new_dir.mount) {
	        throw new FS.ErrnoError(75);
	      }

	      var old_node = FS.lookupNode(old_dir, old_name);
	      var relative = PATH_FS.relative(old_path, new_dirname);

	      if (relative.charAt(0) !== ".") {
	        throw new FS.ErrnoError(28);
	      }

	      relative = PATH_FS.relative(new_path, old_dirname);

	      if (relative.charAt(0) !== ".") {
	        throw new FS.ErrnoError(55);
	      }

	      var new_node;

	      try {
	        new_node = FS.lookupNode(new_dir, new_name);
	      } catch (e) {}

	      if (old_node === new_node) {
	        return;
	      }

	      var isdir = FS.isDir(old_node.mode);
	      var errCode = FS.mayDelete(old_dir, old_name, isdir);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!old_dir.node_ops.rename) {
	        throw new FS.ErrnoError(63);
	      }

	      if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
	        throw new FS.ErrnoError(10);
	      }

	      if (new_dir !== old_dir) {
	        errCode = FS.nodePermissions(old_dir, "w");

	        if (errCode) {
	          throw new FS.ErrnoError(errCode);
	        }
	      }

	      FS.hashRemoveNode(old_node);

	      try {
	        old_dir.node_ops.rename(old_node, new_dir, new_name);
	      } catch (e) {
	        throw e;
	      } finally {
	        FS.hashAddNode(old_node);
	      }
	    },
	    rmdir: path => {
	      var lookup = FS.lookupPath(path, {
	        parent: true
	      });
	      var parent = lookup.node;
	      var name = PATH.basename(path);
	      var node = FS.lookupNode(parent, name);
	      var errCode = FS.mayDelete(parent, name, true);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!parent.node_ops.rmdir) {
	        throw new FS.ErrnoError(63);
	      }

	      if (FS.isMountpoint(node)) {
	        throw new FS.ErrnoError(10);
	      }

	      parent.node_ops.rmdir(parent, name);
	      FS.destroyNode(node);
	    },
	    readdir: path => {
	      var lookup = FS.lookupPath(path, {
	        follow: true
	      });
	      var node = lookup.node;

	      if (!node.node_ops.readdir) {
	        throw new FS.ErrnoError(54);
	      }

	      return node.node_ops.readdir(node);
	    },
	    unlink: path => {
	      var lookup = FS.lookupPath(path, {
	        parent: true
	      });
	      var parent = lookup.node;

	      if (!parent) {
	        throw new FS.ErrnoError(44);
	      }

	      var name = PATH.basename(path);
	      var node = FS.lookupNode(parent, name);
	      var errCode = FS.mayDelete(parent, name, false);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!parent.node_ops.unlink) {
	        throw new FS.ErrnoError(63);
	      }

	      if (FS.isMountpoint(node)) {
	        throw new FS.ErrnoError(10);
	      }

	      parent.node_ops.unlink(parent, name);
	      FS.destroyNode(node);
	    },
	    readlink: path => {
	      var lookup = FS.lookupPath(path);
	      var link = lookup.node;

	      if (!link) {
	        throw new FS.ErrnoError(44);
	      }

	      if (!link.node_ops.readlink) {
	        throw new FS.ErrnoError(28);
	      }

	      return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
	    },
	    stat: (path, dontFollow) => {
	      var lookup = FS.lookupPath(path, {
	        follow: !dontFollow
	      });
	      var node = lookup.node;

	      if (!node) {
	        throw new FS.ErrnoError(44);
	      }

	      if (!node.node_ops.getattr) {
	        throw new FS.ErrnoError(63);
	      }

	      return node.node_ops.getattr(node);
	    },
	    lstat: path => {
	      return FS.stat(path, true);
	    },
	    chmod: (path, mode, dontFollow) => {
	      var node;

	      if (typeof path == "string") {
	        var lookup = FS.lookupPath(path, {
	          follow: !dontFollow
	        });
	        node = lookup.node;
	      } else {
	        node = path;
	      }

	      if (!node.node_ops.setattr) {
	        throw new FS.ErrnoError(63);
	      }

	      node.node_ops.setattr(node, {
	        mode: mode & 4095 | node.mode & ~4095,
	        timestamp: Date.now()
	      });
	    },
	    lchmod: (path, mode) => {
	      FS.chmod(path, mode, true);
	    },
	    fchmod: (fd, mode) => {
	      var stream = FS.getStream(fd);

	      if (!stream) {
	        throw new FS.ErrnoError(8);
	      }

	      FS.chmod(stream.node, mode);
	    },
	    chown: (path, uid, gid, dontFollow) => {
	      var node;

	      if (typeof path == "string") {
	        var lookup = FS.lookupPath(path, {
	          follow: !dontFollow
	        });
	        node = lookup.node;
	      } else {
	        node = path;
	      }

	      if (!node.node_ops.setattr) {
	        throw new FS.ErrnoError(63);
	      }

	      node.node_ops.setattr(node, {
	        timestamp: Date.now()
	      });
	    },
	    lchown: (path, uid, gid) => {
	      FS.chown(path, uid, gid, true);
	    },
	    fchown: (fd, uid, gid) => {
	      var stream = FS.getStream(fd);

	      if (!stream) {
	        throw new FS.ErrnoError(8);
	      }

	      FS.chown(stream.node, uid, gid);
	    },
	    truncate: (path, len) => {
	      if (len < 0) {
	        throw new FS.ErrnoError(28);
	      }

	      var node;

	      if (typeof path == "string") {
	        var lookup = FS.lookupPath(path, {
	          follow: true
	        });
	        node = lookup.node;
	      } else {
	        node = path;
	      }

	      if (!node.node_ops.setattr) {
	        throw new FS.ErrnoError(63);
	      }

	      if (FS.isDir(node.mode)) {
	        throw new FS.ErrnoError(31);
	      }

	      if (!FS.isFile(node.mode)) {
	        throw new FS.ErrnoError(28);
	      }

	      var errCode = FS.nodePermissions(node, "w");

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      node.node_ops.setattr(node, {
	        size: len,
	        timestamp: Date.now()
	      });
	    },
	    ftruncate: (fd, len) => {
	      var stream = FS.getStream(fd);

	      if (!stream) {
	        throw new FS.ErrnoError(8);
	      }

	      if ((stream.flags & 2097155) === 0) {
	        throw new FS.ErrnoError(28);
	      }

	      FS.truncate(stream.node, len);
	    },
	    utime: (path, atime, mtime) => {
	      var lookup = FS.lookupPath(path, {
	        follow: true
	      });
	      var node = lookup.node;
	      node.node_ops.setattr(node, {
	        timestamp: Math.max(atime, mtime)
	      });
	    },
	    open: (path, flags, mode) => {
	      if (path === "") {
	        throw new FS.ErrnoError(44);
	      }

	      flags = typeof flags == "string" ? FS.modeStringToFlags(flags) : flags;
	      mode = typeof mode == "undefined" ? 438 : mode;

	      if (flags & 64) {
	        mode = mode & 4095 | 32768;
	      } else {
	        mode = 0;
	      }

	      var node;

	      if (typeof path == "object") {
	        node = path;
	      } else {
	        path = PATH.normalize(path);

	        try {
	          var lookup = FS.lookupPath(path, {
	            follow: !(flags & 131072)
	          });
	          node = lookup.node;
	        } catch (e) {}
	      }

	      var created = false;

	      if (flags & 64) {
	        if (node) {
	          if (flags & 128) {
	            throw new FS.ErrnoError(20);
	          }
	        } else {
	          node = FS.mknod(path, mode, 0);
	          created = true;
	        }
	      }

	      if (!node) {
	        throw new FS.ErrnoError(44);
	      }

	      if (FS.isChrdev(node.mode)) {
	        flags &= ~512;
	      }

	      if (flags & 65536 && !FS.isDir(node.mode)) {
	        throw new FS.ErrnoError(54);
	      }

	      if (!created) {
	        var errCode = FS.mayOpen(node, flags);

	        if (errCode) {
	          throw new FS.ErrnoError(errCode);
	        }
	      }

	      if (flags & 512 && !created) {
	        FS.truncate(node, 0);
	      }

	      flags &= ~(128 | 512 | 131072);
	      var stream = FS.createStream({
	        node: node,
	        path: FS.getPath(node),
	        flags: flags,
	        seekable: true,
	        position: 0,
	        stream_ops: node.stream_ops,
	        ungotten: [],
	        error: false
	      });

	      if (stream.stream_ops.open) {
	        stream.stream_ops.open(stream);
	      }

	      if (Module["logReadFiles"] && !(flags & 1)) {
	        if (!FS.readFiles) FS.readFiles = {};

	        if (!(path in FS.readFiles)) {
	          FS.readFiles[path] = 1;
	        }
	      }

	      return stream;
	    },
	    close: stream => {
	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if (stream.getdents) stream.getdents = null;

	      try {
	        if (stream.stream_ops.close) {
	          stream.stream_ops.close(stream);
	        }
	      } catch (e) {
	        throw e;
	      } finally {
	        FS.closeStream(stream.fd);
	      }

	      stream.fd = null;
	    },
	    isClosed: stream => {
	      return stream.fd === null;
	    },
	    llseek: (stream, offset, whence) => {
	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if (!stream.seekable || !stream.stream_ops.llseek) {
	        throw new FS.ErrnoError(70);
	      }

	      if (whence != 0 && whence != 1 && whence != 2) {
	        throw new FS.ErrnoError(28);
	      }

	      stream.position = stream.stream_ops.llseek(stream, offset, whence);
	      stream.ungotten = [];
	      return stream.position;
	    },
	    read: (stream, buffer, offset, length, position) => {
	      if (length < 0 || position < 0) {
	        throw new FS.ErrnoError(28);
	      }

	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if ((stream.flags & 2097155) === 1) {
	        throw new FS.ErrnoError(8);
	      }

	      if (FS.isDir(stream.node.mode)) {
	        throw new FS.ErrnoError(31);
	      }

	      if (!stream.stream_ops.read) {
	        throw new FS.ErrnoError(28);
	      }

	      var seeking = typeof position != "undefined";

	      if (!seeking) {
	        position = stream.position;
	      } else if (!stream.seekable) {
	        throw new FS.ErrnoError(70);
	      }

	      var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
	      if (!seeking) stream.position += bytesRead;
	      return bytesRead;
	    },
	    write: (stream, buffer, offset, length, position, canOwn) => {
	      if (length < 0 || position < 0) {
	        throw new FS.ErrnoError(28);
	      }

	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if ((stream.flags & 2097155) === 0) {
	        throw new FS.ErrnoError(8);
	      }

	      if (FS.isDir(stream.node.mode)) {
	        throw new FS.ErrnoError(31);
	      }

	      if (!stream.stream_ops.write) {
	        throw new FS.ErrnoError(28);
	      }

	      if (stream.seekable && stream.flags & 1024) {
	        FS.llseek(stream, 0, 2);
	      }

	      var seeking = typeof position != "undefined";

	      if (!seeking) {
	        position = stream.position;
	      } else if (!stream.seekable) {
	        throw new FS.ErrnoError(70);
	      }

	      var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
	      if (!seeking) stream.position += bytesWritten;
	      return bytesWritten;
	    },
	    allocate: (stream, offset, length) => {
	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if (offset < 0 || length <= 0) {
	        throw new FS.ErrnoError(28);
	      }

	      if ((stream.flags & 2097155) === 0) {
	        throw new FS.ErrnoError(8);
	      }

	      if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
	        throw new FS.ErrnoError(43);
	      }

	      if (!stream.stream_ops.allocate) {
	        throw new FS.ErrnoError(138);
	      }

	      stream.stream_ops.allocate(stream, offset, length);
	    },
	    mmap: (stream, length, position, prot, flags) => {
	      if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
	        throw new FS.ErrnoError(2);
	      }

	      if ((stream.flags & 2097155) === 1) {
	        throw new FS.ErrnoError(2);
	      }

	      if (!stream.stream_ops.mmap) {
	        throw new FS.ErrnoError(43);
	      }

	      return stream.stream_ops.mmap(stream, length, position, prot, flags);
	    },
	    msync: (stream, buffer, offset, length, mmapFlags) => {
	      if (!stream || !stream.stream_ops.msync) {
	        return 0;
	      }

	      return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
	    },
	    munmap: stream => 0,
	    ioctl: (stream, cmd, arg) => {
	      if (!stream.stream_ops.ioctl) {
	        throw new FS.ErrnoError(59);
	      }

	      return stream.stream_ops.ioctl(stream, cmd, arg);
	    },
	    readFile: function (path) {
	      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      opts.flags = opts.flags || 0;
	      opts.encoding = opts.encoding || "binary";

	      if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
	        throw new Error('Invalid encoding type "' + opts.encoding + '"');
	      }

	      var ret;
	      var stream = FS.open(path, opts.flags);
	      var stat = FS.stat(path);
	      var length = stat.size;
	      var buf = new Uint8Array(length);
	      FS.read(stream, buf, 0, length, 0);

	      if (opts.encoding === "utf8") {
	        ret = UTF8ArrayToString(buf, 0);
	      } else if (opts.encoding === "binary") {
	        ret = buf;
	      }

	      FS.close(stream);
	      return ret;
	    },
	    writeFile: function (path, data) {
	      let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	      opts.flags = opts.flags || 577;
	      var stream = FS.open(path, opts.flags, opts.mode);

	      if (typeof data == "string") {
	        var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
	        var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
	        FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
	      } else if (ArrayBuffer.isView(data)) {
	        FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
	      } else {
	        throw new Error("Unsupported data type");
	      }

	      FS.close(stream);
	    },
	    cwd: () => FS.currentPath,
	    chdir: path => {
	      var lookup = FS.lookupPath(path, {
	        follow: true
	      });

	      if (lookup.node === null) {
	        throw new FS.ErrnoError(44);
	      }

	      if (!FS.isDir(lookup.node.mode)) {
	        throw new FS.ErrnoError(54);
	      }

	      var errCode = FS.nodePermissions(lookup.node, "x");

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      FS.currentPath = lookup.path;
	    },
	    createDefaultDirectories: () => {
	      FS.mkdir("/tmp");
	      FS.mkdir("/home");
	      FS.mkdir("/home/web_user");
	    },
	    createDefaultDevices: () => {
	      FS.mkdir("/dev");
	      FS.registerDevice(FS.makedev(1, 3), {
	        read: () => 0,
	        write: (stream, buffer, offset, length, pos) => length
	      });
	      FS.mkdev("/dev/null", FS.makedev(1, 3));
	      TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
	      TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
	      FS.mkdev("/dev/tty", FS.makedev(5, 0));
	      FS.mkdev("/dev/tty1", FS.makedev(6, 0));
	      var random_device = getRandomDevice();
	      FS.createDevice("/dev", "random", random_device);
	      FS.createDevice("/dev", "urandom", random_device);
	      FS.mkdir("/dev/shm");
	      FS.mkdir("/dev/shm/tmp");
	    },
	    createSpecialDirectories: () => {
	      FS.mkdir("/proc");
	      var proc_self = FS.mkdir("/proc/self");
	      FS.mkdir("/proc/self/fd");
	      FS.mount({
	        mount: () => {
	          var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
	          node.node_ops = {
	            lookup: (parent, name) => {
	              var fd = +name;
	              var stream = FS.getStream(fd);
	              if (!stream) throw new FS.ErrnoError(8);
	              var ret = {
	                parent: null,
	                mount: {
	                  mountpoint: "fake"
	                },
	                node_ops: {
	                  readlink: () => stream.path
	                }
	              };
	              ret.parent = ret;
	              return ret;
	            }
	          };
	          return node;
	        }
	      }, {}, "/proc/self/fd");
	    },
	    createStandardStreams: () => {
	      if (Module["stdin"]) {
	        FS.createDevice("/dev", "stdin", Module["stdin"]);
	      } else {
	        FS.symlink("/dev/tty", "/dev/stdin");
	      }

	      if (Module["stdout"]) {
	        FS.createDevice("/dev", "stdout", null, Module["stdout"]);
	      } else {
	        FS.symlink("/dev/tty", "/dev/stdout");
	      }

	      if (Module["stderr"]) {
	        FS.createDevice("/dev", "stderr", null, Module["stderr"]);
	      } else {
	        FS.symlink("/dev/tty1", "/dev/stderr");
	      }

	      FS.open("/dev/stdin", 0);
	      FS.open("/dev/stdout", 1);
	      FS.open("/dev/stderr", 1);
	    },
	    ensureErrnoError: () => {
	      if (FS.ErrnoError) return;

	      FS.ErrnoError = function ErrnoError(errno, node) {
	        this.node = node;

	        this.setErrno = function (errno) {
	          this.errno = errno;
	        };

	        this.setErrno(errno);
	        this.message = "FS error";
	      };

	      FS.ErrnoError.prototype = new Error();
	      FS.ErrnoError.prototype.constructor = FS.ErrnoError;
	      [44].forEach(code => {
	        FS.genericErrors[code] = new FS.ErrnoError(code);
	        FS.genericErrors[code].stack = "<generic error, no stack>";
	      });
	    },
	    staticInit: () => {
	      FS.ensureErrnoError();
	      FS.nameTable = new Array(4096);
	      FS.mount(MEMFS, {}, "/");
	      FS.createDefaultDirectories();
	      FS.createDefaultDevices();
	      FS.createSpecialDirectories();
	      FS.filesystems = {
	        "MEMFS": MEMFS
	      };
	    },
	    init: (input, output, error) => {
	      FS.init.initialized = true;
	      FS.ensureErrnoError();
	      Module["stdin"] = input || Module["stdin"];
	      Module["stdout"] = output || Module["stdout"];
	      Module["stderr"] = error || Module["stderr"];
	      FS.createStandardStreams();
	    },
	    quit: () => {
	      FS.init.initialized = false;

	      for (var i = 0; i < FS.streams.length; i++) {
	        var stream = FS.streams[i];

	        if (!stream) {
	          continue;
	        }

	        FS.close(stream);
	      }
	    },
	    getMode: (canRead, canWrite) => {
	      var mode = 0;
	      if (canRead) mode |= 292 | 73;
	      if (canWrite) mode |= 146;
	      return mode;
	    },
	    findObject: (path, dontResolveLastLink) => {
	      var ret = FS.analyzePath(path, dontResolveLastLink);

	      if (ret.exists) {
	        return ret.object;
	      } else {
	        return null;
	      }
	    },
	    analyzePath: (path, dontResolveLastLink) => {
	      try {
	        var lookup = FS.lookupPath(path, {
	          follow: !dontResolveLastLink
	        });
	        path = lookup.path;
	      } catch (e) {}

	      var ret = {
	        isRoot: false,
	        exists: false,
	        error: 0,
	        name: null,
	        path: null,
	        object: null,
	        parentExists: false,
	        parentPath: null,
	        parentObject: null
	      };

	      try {
	        var lookup = FS.lookupPath(path, {
	          parent: true
	        });
	        ret.parentExists = true;
	        ret.parentPath = lookup.path;
	        ret.parentObject = lookup.node;
	        ret.name = PATH.basename(path);
	        lookup = FS.lookupPath(path, {
	          follow: !dontResolveLastLink
	        });
	        ret.exists = true;
	        ret.path = lookup.path;
	        ret.object = lookup.node;
	        ret.name = lookup.node.name;
	        ret.isRoot = lookup.path === "/";
	      } catch (e) {
	        ret.error = e.errno;
	      }

	      return ret;
	    },
	    createPath: (parent, path, canRead, canWrite) => {
	      parent = typeof parent == "string" ? parent : FS.getPath(parent);
	      var parts = path.split("/").reverse();

	      while (parts.length) {
	        var part = parts.pop();
	        if (!part) continue;
	        var current = PATH.join2(parent, part);

	        try {
	          FS.mkdir(current);
	        } catch (e) {}

	        parent = current;
	      }

	      return current;
	    },
	    createFile: (parent, name, properties, canRead, canWrite) => {
	      var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
	      var mode = FS.getMode(canRead, canWrite);
	      return FS.create(path, mode);
	    },
	    createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
	      var path = name;

	      if (parent) {
	        parent = typeof parent == "string" ? parent : FS.getPath(parent);
	        path = name ? PATH.join2(parent, name) : parent;
	      }

	      var mode = FS.getMode(canRead, canWrite);
	      var node = FS.create(path, mode);

	      if (data) {
	        if (typeof data == "string") {
	          var arr = new Array(data.length);

	          for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);

	          data = arr;
	        }

	        FS.chmod(node, mode | 146);
	        var stream = FS.open(node, 577);
	        FS.write(stream, data, 0, data.length, 0, canOwn);
	        FS.close(stream);
	        FS.chmod(node, mode);
	      }

	      return node;
	    },
	    createDevice: (parent, name, input, output) => {
	      var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
	      var mode = FS.getMode(!!input, !!output);
	      if (!FS.createDevice.major) FS.createDevice.major = 64;
	      var dev = FS.makedev(FS.createDevice.major++, 0);
	      FS.registerDevice(dev, {
	        open: stream => {
	          stream.seekable = false;
	        },
	        close: stream => {
	          if (output && output.buffer && output.buffer.length) {
	            output(10);
	          }
	        },
	        read: (stream, buffer, offset, length, pos) => {
	          var bytesRead = 0;

	          for (var i = 0; i < length; i++) {
	            var result;

	            try {
	              result = input();
	            } catch (e) {
	              throw new FS.ErrnoError(29);
	            }

	            if (result === undefined && bytesRead === 0) {
	              throw new FS.ErrnoError(6);
	            }

	            if (result === null || result === undefined) break;
	            bytesRead++;
	            buffer[offset + i] = result;
	          }

	          if (bytesRead) {
	            stream.node.timestamp = Date.now();
	          }

	          return bytesRead;
	        },
	        write: (stream, buffer, offset, length, pos) => {
	          for (var i = 0; i < length; i++) {
	            try {
	              output(buffer[offset + i]);
	            } catch (e) {
	              throw new FS.ErrnoError(29);
	            }
	          }

	          if (length) {
	            stream.node.timestamp = Date.now();
	          }

	          return i;
	        }
	      });
	      return FS.mkdev(path, mode, dev);
	    },
	    forceLoadFile: obj => {
	      if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;

	      if (typeof XMLHttpRequest != "undefined") {
	        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
	      } else if (read_) {
	        try {
	          obj.contents = intArrayFromString(read_(obj.url), true);
	          obj.usedBytes = obj.contents.length;
	        } catch (e) {
	          throw new FS.ErrnoError(29);
	        }
	      } else {
	        throw new Error("Cannot load without read() or XMLHttpRequest.");
	      }
	    },
	    createLazyFile: (parent, name, url, canRead, canWrite) => {
	      function LazyUint8Array() {
	        this.lengthKnown = false;
	        this.chunks = [];
	      }

	      LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
	        if (idx > this.length - 1 || idx < 0) {
	          return undefined;
	        }

	        var chunkOffset = idx % this.chunkSize;
	        var chunkNum = idx / this.chunkSize | 0;
	        return this.getter(chunkNum)[chunkOffset];
	      };

	      LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
	        this.getter = getter;
	      };

	      LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
	        var xhr = new XMLHttpRequest();
	        xhr.open("HEAD", url, false);
	        xhr.send(null);
	        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
	        var datalength = Number(xhr.getResponseHeader("Content-length"));
	        var header;
	        var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
	        var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
	        var chunkSize = 1024 * 1024;
	        if (!hasByteServing) chunkSize = datalength;

	        var doXHR = (from, to) => {
	          if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
	          if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
	          var xhr = new XMLHttpRequest();
	          xhr.open("GET", url, false);
	          if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
	          xhr.responseType = "arraybuffer";

	          if (xhr.overrideMimeType) {
	            xhr.overrideMimeType("text/plain; charset=x-user-defined");
	          }

	          xhr.send(null);
	          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);

	          if (xhr.response !== undefined) {
	            return new Uint8Array(xhr.response || []);
	          } else {
	            return intArrayFromString(xhr.responseText || "", true);
	          }
	        };

	        var lazyArray = this;
	        lazyArray.setDataGetter(chunkNum => {
	          var start = chunkNum * chunkSize;
	          var end = (chunkNum + 1) * chunkSize - 1;
	          end = Math.min(end, datalength - 1);

	          if (typeof lazyArray.chunks[chunkNum] == "undefined") {
	            lazyArray.chunks[chunkNum] = doXHR(start, end);
	          }

	          if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
	          return lazyArray.chunks[chunkNum];
	        });

	        if (usesGzip || !datalength) {
	          chunkSize = datalength = 1;
	          datalength = this.getter(0).length;
	          chunkSize = datalength;
	          out("LazyFiles on gzip forces download of the whole file when length is accessed");
	        }

	        this._length = datalength;
	        this._chunkSize = chunkSize;
	        this.lengthKnown = true;
	      };

	      if (typeof XMLHttpRequest != "undefined") {
	        if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
	        var lazyArray = new LazyUint8Array();
	        Object.defineProperties(lazyArray, {
	          length: {
	            get: function () {
	              if (!this.lengthKnown) {
	                this.cacheLength();
	              }

	              return this._length;
	            }
	          },
	          chunkSize: {
	            get: function () {
	              if (!this.lengthKnown) {
	                this.cacheLength();
	              }

	              return this._chunkSize;
	            }
	          }
	        });
	        var properties = {
	          isDevice: false,
	          contents: lazyArray
	        };
	      } else {
	        var properties = {
	          isDevice: false,
	          url: url
	        };
	      }

	      var node = FS.createFile(parent, name, properties, canRead, canWrite);

	      if (properties.contents) {
	        node.contents = properties.contents;
	      } else if (properties.url) {
	        node.contents = null;
	        node.url = properties.url;
	      }

	      Object.defineProperties(node, {
	        usedBytes: {
	          get: function () {
	            return this.contents.length;
	          }
	        }
	      });
	      var stream_ops = {};
	      var keys = Object.keys(node.stream_ops);
	      keys.forEach(key => {
	        var fn = node.stream_ops[key];

	        stream_ops[key] = function forceLoadLazyFile() {
	          FS.forceLoadFile(node);
	          return fn.apply(null, arguments);
	        };
	      });

	      function writeChunks(stream, buffer, offset, length, position) {
	        var contents = stream.node.contents;
	        if (position >= contents.length) return 0;
	        var size = Math.min(contents.length - position, length);

	        if (contents.slice) {
	          for (var i = 0; i < size; i++) {
	            buffer[offset + i] = contents[position + i];
	          }
	        } else {
	          for (var i = 0; i < size; i++) {
	            buffer[offset + i] = contents.get(position + i);
	          }
	        }

	        return size;
	      }

	      stream_ops.read = (stream, buffer, offset, length, position) => {
	        FS.forceLoadFile(node);
	        return writeChunks(stream, buffer, offset, length, position);
	      };

	      stream_ops.mmap = (stream, length, position, prot, flags) => {
	        FS.forceLoadFile(node);
	        var ptr = mmapAlloc();

	        if (!ptr) {
	          throw new FS.ErrnoError(48);
	        }

	        writeChunks(stream, HEAP8, ptr, length, position);
	        return {
	          ptr: ptr,
	          allocated: true
	        };
	      };

	      node.stream_ops = stream_ops;
	      return node;
	    },
	    createPreloadedFile: (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
	      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;

	      function processData(byteArray) {
	        function finish(byteArray) {
	          if (preFinish) preFinish();

	          if (!dontCreateFile) {
	            FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
	          }

	          if (onload) onload();
	          removeRunDependency();
	        }

	        if (Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
	          if (onerror) onerror();
	          removeRunDependency();
	        })) {
	          return;
	        }

	        finish(byteArray);
	      }

	      addRunDependency();

	      if (typeof url == "string") {
	        asyncLoad(url, byteArray => processData(byteArray), onerror);
	      } else {
	        processData(url);
	      }
	    },
	    indexedDB: () => {
	      return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	    },
	    DB_NAME: () => {
	      return "EM_FS_" + window.location.pathname;
	    },
	    DB_VERSION: 20,
	    DB_STORE_NAME: "FILE_DATA",
	    saveFilesToDB: (paths, onload, onerror) => {
	      onload = onload || (() => {});

	      onerror = onerror || (() => {});

	      var indexedDB = FS.indexedDB();

	      try {
	        var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
	      } catch (e) {
	        return onerror(e);
	      }

	      openRequest.onupgradeneeded = () => {
	        out("creating db");
	        var db = openRequest.result;
	        db.createObjectStore(FS.DB_STORE_NAME);
	      };

	      openRequest.onsuccess = () => {
	        var db = openRequest.result;
	        var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
	        var files = transaction.objectStore(FS.DB_STORE_NAME);
	        var ok = 0,
	            fail = 0,
	            total = paths.length;

	        function finish() {
	          if (fail == 0) onload();else onerror();
	        }

	        paths.forEach(path => {
	          var putRequest = files.put(FS.analyzePath(path).object.contents, path);

	          putRequest.onsuccess = () => {
	            ok++;
	            if (ok + fail == total) finish();
	          };

	          putRequest.onerror = () => {
	            fail++;
	            if (ok + fail == total) finish();
	          };
	        });
	        transaction.onerror = onerror;
	      };

	      openRequest.onerror = onerror;
	    },
	    loadFilesFromDB: (paths, onload, onerror) => {
	      onload = onload || (() => {});

	      onerror = onerror || (() => {});

	      var indexedDB = FS.indexedDB();

	      try {
	        var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
	      } catch (e) {
	        return onerror(e);
	      }

	      openRequest.onupgradeneeded = onerror;

	      openRequest.onsuccess = () => {
	        var db = openRequest.result;

	        try {
	          var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
	        } catch (e) {
	          onerror(e);
	          return;
	        }

	        var files = transaction.objectStore(FS.DB_STORE_NAME);
	        var ok = 0,
	            fail = 0,
	            total = paths.length;

	        function finish() {
	          if (fail == 0) onload();else onerror();
	        }

	        paths.forEach(path => {
	          var getRequest = files.get(path);

	          getRequest.onsuccess = () => {
	            if (FS.analyzePath(path).exists) {
	              FS.unlink(path);
	            }

	            FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
	            ok++;
	            if (ok + fail == total) finish();
	          };

	          getRequest.onerror = () => {
	            fail++;
	            if (ok + fail == total) finish();
	          };
	        });
	        transaction.onerror = onerror;
	      };

	      openRequest.onerror = onerror;
	    }
	  };
	  var SYSCALLS = {
	    DEFAULT_POLLMASK: 5,
	    calculateAt: function (dirfd, path, allowEmpty) {
	      if (PATH.isAbs(path)) {
	        return path;
	      }

	      var dir;

	      if (dirfd === -100) {
	        dir = FS.cwd();
	      } else {
	        var dirstream = FS.getStream(dirfd);
	        if (!dirstream) throw new FS.ErrnoError(8);
	        dir = dirstream.path;
	      }

	      if (path.length == 0) {
	        if (!allowEmpty) {
	          throw new FS.ErrnoError(44);
	        }

	        return dir;
	      }

	      return PATH.join2(dir, path);
	    },
	    doStat: function (func, path, buf) {
	      try {
	        var stat = func(path);
	      } catch (e) {
	        if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
	          return -54;
	        }

	        throw e;
	      }

	      HEAP32[buf >> 2] = stat.dev;
	      HEAP32[buf + 4 >> 2] = 0;
	      HEAP32[buf + 8 >> 2] = stat.ino;
	      HEAP32[buf + 12 >> 2] = stat.mode;
	      HEAP32[buf + 16 >> 2] = stat.nlink;
	      HEAP32[buf + 20 >> 2] = stat.uid;
	      HEAP32[buf + 24 >> 2] = stat.gid;
	      HEAP32[buf + 28 >> 2] = stat.rdev;
	      HEAP32[buf + 32 >> 2] = 0;
	      tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
	      HEAP32[buf + 48 >> 2] = 4096;
	      HEAP32[buf + 52 >> 2] = stat.blocks;
	      HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
	      HEAP32[buf + 60 >> 2] = 0;
	      HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
	      HEAP32[buf + 68 >> 2] = 0;
	      HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
	      HEAP32[buf + 76 >> 2] = 0;
	      tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 80 >> 2] = tempI64[0], HEAP32[buf + 84 >> 2] = tempI64[1];
	      return 0;
	    },
	    doMsync: function (addr, stream, len, flags, offset) {
	      var buffer = HEAPU8.slice(addr, addr + len);
	      FS.msync(stream, buffer, offset, len, flags);
	    },
	    varargs: undefined,
	    get: function () {
	      SYSCALLS.varargs += 4;
	      var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
	      return ret;
	    },
	    getStr: function (ptr) {
	      var ret = UTF8ToString(ptr);
	      return ret;
	    },
	    getStreamFromFD: function (fd) {
	      var stream = FS.getStream(fd);
	      if (!stream) throw new FS.ErrnoError(8);
	      return stream;
	    }
	  };

	  function ___syscall_fcntl64(fd, cmd, varargs) {
	    SYSCALLS.varargs = varargs;

	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);

	      switch (cmd) {
	        case 0:
	          {
	            var arg = SYSCALLS.get();

	            if (arg < 0) {
	              return -28;
	            }

	            var newStream;
	            newStream = FS.createStream(stream, arg);
	            return newStream.fd;
	          }

	        case 1:
	        case 2:
	          return 0;

	        case 3:
	          return stream.flags;

	        case 4:
	          {
	            var arg = SYSCALLS.get();
	            stream.flags |= arg;
	            return 0;
	          }

	        case 5:
	          {
	            var arg = SYSCALLS.get();
	            var offset = 0;
	            HEAP16[arg + offset >> 1] = 2;
	            return 0;
	          }

	        case 6:
	        case 7:
	          return 0;

	        case 16:
	        case 8:
	          return -28;

	        case 9:
	          setErrNo(28);
	          return -1;

	        default:
	          {
	            return -28;
	          }
	      }
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return -e.errno;
	    }
	  }

	  function ___syscall_openat(dirfd, path, flags, varargs) {
	    SYSCALLS.varargs = varargs;

	    try {
	      path = SYSCALLS.getStr(path);
	      path = SYSCALLS.calculateAt(dirfd, path);
	      var mode = varargs ? SYSCALLS.get() : 0;
	      return FS.open(path, flags, mode).fd;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return -e.errno;
	    }
	  }

	  function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {}

	  function getShiftFromSize(size) {
	    switch (size) {
	      case 1:
	        return 0;

	      case 2:
	        return 1;

	      case 4:
	        return 2;

	      case 8:
	        return 3;

	      default:
	        throw new TypeError("Unknown type size: " + size);
	    }
	  }

	  function embind_init_charCodes() {
	    var codes = new Array(256);

	    for (var i = 0; i < 256; ++i) {
	      codes[i] = String.fromCharCode(i);
	    }

	    embind_charCodes = codes;
	  }

	  var embind_charCodes = undefined;

	  function readLatin1String(ptr) {
	    var ret = "";
	    var c = ptr;

	    while (HEAPU8[c]) {
	      ret += embind_charCodes[HEAPU8[c++]];
	    }

	    return ret;
	  }

	  var awaitingDependencies = {};
	  var registeredTypes = {};
	  var typeDependencies = {};
	  var char_0 = 48;
	  var char_9 = 57;

	  function makeLegalFunctionName(name) {
	    if (undefined === name) {
	      return "_unknown";
	    }

	    name = name.replace(/[^a-zA-Z0-9_]/g, "$");
	    var f = name.charCodeAt(0);

	    if (f >= char_0 && f <= char_9) {
	      return "_" + name;
	    }

	    return name;
	  }

	  function createNamedFunction(name, body) {
	    name = makeLegalFunctionName(name);
	    return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body);
	  }

	  function extendError(baseErrorType, errorName) {
	    var errorClass = createNamedFunction(errorName, function (message) {
	      this.name = errorName;
	      this.message = message;
	      var stack = new Error(message).stack;

	      if (stack !== undefined) {
	        this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
	      }
	    });
	    errorClass.prototype = Object.create(baseErrorType.prototype);
	    errorClass.prototype.constructor = errorClass;

	    errorClass.prototype.toString = function () {
	      if (this.message === undefined) {
	        return this.name;
	      } else {
	        return this.name + ": " + this.message;
	      }
	    };

	    return errorClass;
	  }

	  var BindingError = undefined;

	  function throwBindingError(message) {
	    throw new BindingError(message);
	  }

	  var InternalError = undefined;

	  function throwInternalError(message) {
	    throw new InternalError(message);
	  }

	  function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
	    myTypes.forEach(function (type) {
	      typeDependencies[type] = dependentTypes;
	    });

	    function onComplete(typeConverters) {
	      var myTypeConverters = getTypeConverters(typeConverters);

	      if (myTypeConverters.length !== myTypes.length) {
	        throwInternalError("Mismatched type converter count");
	      }

	      for (var i = 0; i < myTypes.length; ++i) {
	        registerType(myTypes[i], myTypeConverters[i]);
	      }
	    }

	    var typeConverters = new Array(dependentTypes.length);
	    var unregisteredTypes = [];
	    var registered = 0;
	    dependentTypes.forEach((dt, i) => {
	      if (registeredTypes.hasOwnProperty(dt)) {
	        typeConverters[i] = registeredTypes[dt];
	      } else {
	        unregisteredTypes.push(dt);

	        if (!awaitingDependencies.hasOwnProperty(dt)) {
	          awaitingDependencies[dt] = [];
	        }

	        awaitingDependencies[dt].push(() => {
	          typeConverters[i] = registeredTypes[dt];
	          ++registered;

	          if (registered === unregisteredTypes.length) {
	            onComplete(typeConverters);
	          }
	        });
	      }
	    });

	    if (0 === unregisteredTypes.length) {
	      onComplete(typeConverters);
	    }
	  }

	  function registerType(rawType, registeredInstance) {
	    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	    if (!("argPackAdvance" in registeredInstance)) {
	      throw new TypeError("registerType registeredInstance requires argPackAdvance");
	    }

	    var name = registeredInstance.name;

	    if (!rawType) {
	      throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
	    }

	    if (registeredTypes.hasOwnProperty(rawType)) {
	      if (options.ignoreDuplicateRegistrations) {
	        return;
	      } else {
	        throwBindingError("Cannot register type '" + name + "' twice");
	      }
	    }

	    registeredTypes[rawType] = registeredInstance;
	    delete typeDependencies[rawType];

	    if (awaitingDependencies.hasOwnProperty(rawType)) {
	      var callbacks = awaitingDependencies[rawType];
	      delete awaitingDependencies[rawType];
	      callbacks.forEach(cb => cb());
	    }
	  }

	  function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
	    var shift = getShiftFromSize(size);
	    name = readLatin1String(name);
	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (wt) {
	        return !!wt;
	      },
	      "toWireType": function (destructors, o) {
	        return o ? trueValue : falseValue;
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": function (pointer) {
	        var heap;

	        if (size === 1) {
	          heap = HEAP8;
	        } else if (size === 2) {
	          heap = HEAP16;
	        } else if (size === 4) {
	          heap = HEAP32;
	        } else {
	          throw new TypeError("Unknown boolean type size: " + name);
	        }

	        return this["fromWireType"](heap[pointer >> shift]);
	      },
	      destructorFunction: null
	    });
	  }

	  function ClassHandle_isAliasOf(other) {
	    if (!(this instanceof ClassHandle)) {
	      return false;
	    }

	    if (!(other instanceof ClassHandle)) {
	      return false;
	    }

	    var leftClass = this.$$.ptrType.registeredClass;
	    var left = this.$$.ptr;
	    var rightClass = other.$$.ptrType.registeredClass;
	    var right = other.$$.ptr;

	    while (leftClass.baseClass) {
	      left = leftClass.upcast(left);
	      leftClass = leftClass.baseClass;
	    }

	    while (rightClass.baseClass) {
	      right = rightClass.upcast(right);
	      rightClass = rightClass.baseClass;
	    }

	    return leftClass === rightClass && left === right;
	  }

	  function shallowCopyInternalPointer(o) {
	    return {
	      count: o.count,
	      deleteScheduled: o.deleteScheduled,
	      preservePointerOnDelete: o.preservePointerOnDelete,
	      ptr: o.ptr,
	      ptrType: o.ptrType,
	      smartPtr: o.smartPtr,
	      smartPtrType: o.smartPtrType
	    };
	  }

	  function throwInstanceAlreadyDeleted(obj) {
	    function getInstanceTypeName(handle) {
	      return handle.$$.ptrType.registeredClass.name;
	    }

	    throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
	  }

	  var finalizationRegistry = false;

	  function detachFinalizer(handle) {}

	  function runDestructor($$) {
	    if ($$.smartPtr) {
	      $$.smartPtrType.rawDestructor($$.smartPtr);
	    } else {
	      $$.ptrType.registeredClass.rawDestructor($$.ptr);
	    }
	  }

	  function releaseClassHandle($$) {
	    $$.count.value -= 1;
	    var toDelete = 0 === $$.count.value;

	    if (toDelete) {
	      runDestructor($$);
	    }
	  }

	  function downcastPointer(ptr, ptrClass, desiredClass) {
	    if (ptrClass === desiredClass) {
	      return ptr;
	    }

	    if (undefined === desiredClass.baseClass) {
	      return null;
	    }

	    var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);

	    if (rv === null) {
	      return null;
	    }

	    return desiredClass.downcast(rv);
	  }

	  var registeredPointers = {};

	  function getInheritedInstanceCount() {
	    return Object.keys(registeredInstances).length;
	  }

	  function getLiveInheritedInstances() {
	    var rv = [];

	    for (var k in registeredInstances) {
	      if (registeredInstances.hasOwnProperty(k)) {
	        rv.push(registeredInstances[k]);
	      }
	    }

	    return rv;
	  }

	  var deletionQueue = [];

	  function flushPendingDeletes() {
	    while (deletionQueue.length) {
	      var obj = deletionQueue.pop();
	      obj.$$.deleteScheduled = false;
	      obj["delete"]();
	    }
	  }

	  var delayFunction = undefined;

	  function setDelayFunction(fn) {
	    delayFunction = fn;

	    if (deletionQueue.length && delayFunction) {
	      delayFunction(flushPendingDeletes);
	    }
	  }

	  function init_embind() {
	    Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
	    Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
	    Module["flushPendingDeletes"] = flushPendingDeletes;
	    Module["setDelayFunction"] = setDelayFunction;
	  }

	  var registeredInstances = {};

	  function getBasestPointer(class_, ptr) {
	    if (ptr === undefined) {
	      throwBindingError("ptr should not be undefined");
	    }

	    while (class_.baseClass) {
	      ptr = class_.upcast(ptr);
	      class_ = class_.baseClass;
	    }

	    return ptr;
	  }

	  function getInheritedInstance(class_, ptr) {
	    ptr = getBasestPointer(class_, ptr);
	    return registeredInstances[ptr];
	  }

	  function makeClassHandle(prototype, record) {
	    if (!record.ptrType || !record.ptr) {
	      throwInternalError("makeClassHandle requires ptr and ptrType");
	    }

	    var hasSmartPtrType = !!record.smartPtrType;
	    var hasSmartPtr = !!record.smartPtr;

	    if (hasSmartPtrType !== hasSmartPtr) {
	      throwInternalError("Both smartPtrType and smartPtr must be specified");
	    }

	    record.count = {
	      value: 1
	    };
	    return attachFinalizer(Object.create(prototype, {
	      $$: {
	        value: record
	      }
	    }));
	  }

	  function RegisteredPointer_fromWireType(ptr) {
	    var rawPointer = this.getPointee(ptr);

	    if (!rawPointer) {
	      this.destructor(ptr);
	      return null;
	    }

	    var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);

	    if (undefined !== registeredInstance) {
	      if (0 === registeredInstance.$$.count.value) {
	        registeredInstance.$$.ptr = rawPointer;
	        registeredInstance.$$.smartPtr = ptr;
	        return registeredInstance["clone"]();
	      } else {
	        var rv = registeredInstance["clone"]();
	        this.destructor(ptr);
	        return rv;
	      }
	    }

	    function makeDefaultHandle() {
	      if (this.isSmartPointer) {
	        return makeClassHandle(this.registeredClass.instancePrototype, {
	          ptrType: this.pointeeType,
	          ptr: rawPointer,
	          smartPtrType: this,
	          smartPtr: ptr
	        });
	      } else {
	        return makeClassHandle(this.registeredClass.instancePrototype, {
	          ptrType: this,
	          ptr: ptr
	        });
	      }
	    }

	    var actualType = this.registeredClass.getActualType(rawPointer);
	    var registeredPointerRecord = registeredPointers[actualType];

	    if (!registeredPointerRecord) {
	      return makeDefaultHandle.call(this);
	    }

	    var toType;

	    if (this.isConst) {
	      toType = registeredPointerRecord.constPointerType;
	    } else {
	      toType = registeredPointerRecord.pointerType;
	    }

	    var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);

	    if (dp === null) {
	      return makeDefaultHandle.call(this);
	    }

	    if (this.isSmartPointer) {
	      return makeClassHandle(toType.registeredClass.instancePrototype, {
	        ptrType: toType,
	        ptr: dp,
	        smartPtrType: this,
	        smartPtr: ptr
	      });
	    } else {
	      return makeClassHandle(toType.registeredClass.instancePrototype, {
	        ptrType: toType,
	        ptr: dp
	      });
	    }
	  }

	  function attachFinalizer(handle) {
	    if ("undefined" === typeof FinalizationRegistry) {
	      attachFinalizer = handle => handle;

	      return handle;
	    }

	    finalizationRegistry = new FinalizationRegistry(info => {
	      releaseClassHandle(info.$$);
	    });

	    attachFinalizer = handle => {
	      var $$ = handle.$$;
	      var hasSmartPtr = !!$$.smartPtr;

	      if (hasSmartPtr) {
	        var info = {
	          $$: $$
	        };
	        finalizationRegistry.register(handle, info, handle);
	      }

	      return handle;
	    };

	    detachFinalizer = handle => finalizationRegistry.unregister(handle);

	    return attachFinalizer(handle);
	  }

	  function ClassHandle_clone() {
	    if (!this.$$.ptr) {
	      throwInstanceAlreadyDeleted(this);
	    }

	    if (this.$$.preservePointerOnDelete) {
	      this.$$.count.value += 1;
	      return this;
	    } else {
	      var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
	        $$: {
	          value: shallowCopyInternalPointer(this.$$)
	        }
	      }));
	      clone.$$.count.value += 1;
	      clone.$$.deleteScheduled = false;
	      return clone;
	    }
	  }

	  function ClassHandle_delete() {
	    if (!this.$$.ptr) {
	      throwInstanceAlreadyDeleted(this);
	    }

	    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
	      throwBindingError("Object already scheduled for deletion");
	    }

	    detachFinalizer(this);
	    releaseClassHandle(this.$$);

	    if (!this.$$.preservePointerOnDelete) {
	      this.$$.smartPtr = undefined;
	      this.$$.ptr = undefined;
	    }
	  }

	  function ClassHandle_isDeleted() {
	    return !this.$$.ptr;
	  }

	  function ClassHandle_deleteLater() {
	    if (!this.$$.ptr) {
	      throwInstanceAlreadyDeleted(this);
	    }

	    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
	      throwBindingError("Object already scheduled for deletion");
	    }

	    deletionQueue.push(this);

	    if (deletionQueue.length === 1 && delayFunction) {
	      delayFunction(flushPendingDeletes);
	    }

	    this.$$.deleteScheduled = true;
	    return this;
	  }

	  function init_ClassHandle() {
	    ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
	    ClassHandle.prototype["clone"] = ClassHandle_clone;
	    ClassHandle.prototype["delete"] = ClassHandle_delete;
	    ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
	    ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
	  }

	  function ClassHandle() {}

	  function ensureOverloadTable(proto, methodName, humanName) {
	    if (undefined === proto[methodName].overloadTable) {
	      var prevFunc = proto[methodName];

	      proto[methodName] = function () {
	        if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
	          throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
	        }

	        return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
	      };

	      proto[methodName].overloadTable = [];
	      proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
	    }
	  }

	  function exposePublicSymbol(name, value, numArguments) {
	    if (Module.hasOwnProperty(name)) {
	      if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
	        throwBindingError("Cannot register public name '" + name + "' twice");
	      }

	      ensureOverloadTable(Module, name, name);

	      if (Module.hasOwnProperty(numArguments)) {
	        throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
	      }

	      Module[name].overloadTable[numArguments] = value;
	    } else {
	      Module[name] = value;

	      if (undefined !== numArguments) {
	        Module[name].numArguments = numArguments;
	      }
	    }
	  }

	  function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
	    this.name = name;
	    this.constructor = constructor;
	    this.instancePrototype = instancePrototype;
	    this.rawDestructor = rawDestructor;
	    this.baseClass = baseClass;
	    this.getActualType = getActualType;
	    this.upcast = upcast;
	    this.downcast = downcast;
	    this.pureVirtualFunctions = [];
	  }

	  function upcastPointer(ptr, ptrClass, desiredClass) {
	    while (ptrClass !== desiredClass) {
	      if (!ptrClass.upcast) {
	        throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
	      }

	      ptr = ptrClass.upcast(ptr);
	      ptrClass = ptrClass.baseClass;
	    }

	    return ptr;
	  }

	  function constNoSmartPtrRawPointerToWireType(destructors, handle) {
	    if (handle === null) {
	      if (this.isReference) {
	        throwBindingError("null is not a valid " + this.name);
	      }

	      return 0;
	    }

	    if (!handle.$$) {
	      throwBindingError('Cannot pass "' + embindRepr(handle) + '" as a ' + this.name);
	    }

	    if (!handle.$$.ptr) {
	      throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
	    }

	    var handleClass = handle.$$.ptrType.registeredClass;
	    var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
	    return ptr;
	  }

	  function genericPointerToWireType(destructors, handle) {
	    var ptr;

	    if (handle === null) {
	      if (this.isReference) {
	        throwBindingError("null is not a valid " + this.name);
	      }

	      if (this.isSmartPointer) {
	        ptr = this.rawConstructor();

	        if (destructors !== null) {
	          destructors.push(this.rawDestructor, ptr);
	        }

	        return ptr;
	      } else {
	        return 0;
	      }
	    }

	    if (!handle.$$) {
	      throwBindingError('Cannot pass "' + embindRepr(handle) + '" as a ' + this.name);
	    }

	    if (!handle.$$.ptr) {
	      throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
	    }

	    if (!this.isConst && handle.$$.ptrType.isConst) {
	      throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
	    }

	    var handleClass = handle.$$.ptrType.registeredClass;
	    ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);

	    if (this.isSmartPointer) {
	      if (undefined === handle.$$.smartPtr) {
	        throwBindingError("Passing raw pointer to smart pointer is illegal");
	      }

	      switch (this.sharingPolicy) {
	        case 0:
	          if (handle.$$.smartPtrType === this) {
	            ptr = handle.$$.smartPtr;
	          } else {
	            throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
	          }

	          break;

	        case 1:
	          ptr = handle.$$.smartPtr;
	          break;

	        case 2:
	          if (handle.$$.smartPtrType === this) {
	            ptr = handle.$$.smartPtr;
	          } else {
	            var clonedHandle = handle["clone"]();
	            ptr = this.rawShare(ptr, Emval.toHandle(function () {
	              clonedHandle["delete"]();
	            }));

	            if (destructors !== null) {
	              destructors.push(this.rawDestructor, ptr);
	            }
	          }

	          break;

	        default:
	          throwBindingError("Unsupporting sharing policy");
	      }
	    }

	    return ptr;
	  }

	  function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
	    if (handle === null) {
	      if (this.isReference) {
	        throwBindingError("null is not a valid " + this.name);
	      }

	      return 0;
	    }

	    if (!handle.$$) {
	      throwBindingError('Cannot pass "' + embindRepr(handle) + '" as a ' + this.name);
	    }

	    if (!handle.$$.ptr) {
	      throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
	    }

	    if (handle.$$.ptrType.isConst) {
	      throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
	    }

	    var handleClass = handle.$$.ptrType.registeredClass;
	    var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
	    return ptr;
	  }

	  function simpleReadValueFromPointer(pointer) {
	    return this["fromWireType"](HEAP32[pointer >> 2]);
	  }

	  function RegisteredPointer_getPointee(ptr) {
	    if (this.rawGetPointee) {
	      ptr = this.rawGetPointee(ptr);
	    }

	    return ptr;
	  }

	  function RegisteredPointer_destructor(ptr) {
	    if (this.rawDestructor) {
	      this.rawDestructor(ptr);
	    }
	  }

	  function RegisteredPointer_deleteObject(handle) {
	    if (handle !== null) {
	      handle["delete"]();
	    }
	  }

	  function init_RegisteredPointer() {
	    RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
	    RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
	    RegisteredPointer.prototype["argPackAdvance"] = 8;
	    RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
	    RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
	    RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
	  }

	  function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
	    this.name = name;
	    this.registeredClass = registeredClass;
	    this.isReference = isReference;
	    this.isConst = isConst;
	    this.isSmartPointer = isSmartPointer;
	    this.pointeeType = pointeeType;
	    this.sharingPolicy = sharingPolicy;
	    this.rawGetPointee = rawGetPointee;
	    this.rawConstructor = rawConstructor;
	    this.rawShare = rawShare;
	    this.rawDestructor = rawDestructor;

	    if (!isSmartPointer && registeredClass.baseClass === undefined) {
	      if (isConst) {
	        this["toWireType"] = constNoSmartPtrRawPointerToWireType;
	        this.destructorFunction = null;
	      } else {
	        this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
	        this.destructorFunction = null;
	      }
	    } else {
	      this["toWireType"] = genericPointerToWireType;
	    }
	  }

	  function replacePublicSymbol(name, value, numArguments) {
	    if (!Module.hasOwnProperty(name)) {
	      throwInternalError("Replacing nonexistant public symbol");
	    }

	    if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
	      Module[name].overloadTable[numArguments] = value;
	    } else {
	      Module[name] = value;
	      Module[name].argCount = numArguments;
	    }
	  }

	  function dynCallLegacy(sig, ptr, args) {
	    var f = Module["dynCall_" + sig];
	    return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
	  }

	  function dynCall(sig, ptr, args) {
	    if (sig.includes("j")) {
	      return dynCallLegacy(sig, ptr, args);
	    }

	    var rtn = getWasmTableEntry(ptr).apply(null, args);
	    return rtn;
	  }

	  function getDynCaller(sig, ptr) {
	    var argCache = [];
	    return function () {
	      argCache.length = 0;
	      Object.assign(argCache, arguments);
	      return dynCall(sig, ptr, argCache);
	    };
	  }

	  function embind__requireFunction(signature, rawFunction) {
	    signature = readLatin1String(signature);

	    function makeDynCaller() {
	      if (signature.includes("j")) {
	        return getDynCaller(signature, rawFunction);
	      }

	      return getWasmTableEntry(rawFunction);
	    }

	    var fp = makeDynCaller();

	    if (typeof fp != "function") {
	      throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
	    }

	    return fp;
	  }

	  var UnboundTypeError = undefined;

	  function getTypeName(type) {
	    var ptr = ___getTypeName(type);

	    var rv = readLatin1String(ptr);

	    _free(ptr);

	    return rv;
	  }

	  function throwUnboundTypeError(message, types) {
	    var unboundTypes = [];
	    var seen = {};

	    function visit(type) {
	      if (seen[type]) {
	        return;
	      }

	      if (registeredTypes[type]) {
	        return;
	      }

	      if (typeDependencies[type]) {
	        typeDependencies[type].forEach(visit);
	        return;
	      }

	      unboundTypes.push(type);
	      seen[type] = true;
	    }

	    types.forEach(visit);
	    throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
	  }

	  function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
	    name = readLatin1String(name);
	    getActualType = embind__requireFunction(getActualTypeSignature, getActualType);

	    if (upcast) {
	      upcast = embind__requireFunction(upcastSignature, upcast);
	    }

	    if (downcast) {
	      downcast = embind__requireFunction(downcastSignature, downcast);
	    }

	    rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
	    var legalFunctionName = makeLegalFunctionName(name);
	    exposePublicSymbol(legalFunctionName, function () {
	      throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
	    });
	    whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function (base) {
	      base = base[0];
	      var baseClass;
	      var basePrototype;

	      if (baseClassRawType) {
	        baseClass = base.registeredClass;
	        basePrototype = baseClass.instancePrototype;
	      } else {
	        basePrototype = ClassHandle.prototype;
	      }

	      var constructor = createNamedFunction(legalFunctionName, function () {
	        if (Object.getPrototypeOf(this) !== instancePrototype) {
	          throw new BindingError("Use 'new' to construct " + name);
	        }

	        if (undefined === registeredClass.constructor_body) {
	          throw new BindingError(name + " has no accessible constructor");
	        }

	        var body = registeredClass.constructor_body[arguments.length];

	        if (undefined === body) {
	          throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
	        }

	        return body.apply(this, arguments);
	      });
	      var instancePrototype = Object.create(basePrototype, {
	        constructor: {
	          value: constructor
	        }
	      });
	      constructor.prototype = instancePrototype;
	      var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
	      var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
	      var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
	      var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
	      registeredPointers[rawType] = {
	        pointerType: pointerConverter,
	        constPointerType: constPointerConverter
	      };
	      replacePublicSymbol(legalFunctionName, constructor);
	      return [referenceConverter, pointerConverter, constPointerConverter];
	    });
	  }

	  function heap32VectorToArray(count, firstElement) {
	    var array = [];

	    for (var i = 0; i < count; i++) {
	      array.push(HEAPU32[firstElement + i * 4 >> 2]);
	    }

	    return array;
	  }

	  function runDestructors(destructors) {
	    while (destructors.length) {
	      var ptr = destructors.pop();
	      var del = destructors.pop();
	      del(ptr);
	    }
	  }

	  function new_(constructor, argumentList) {
	    if (!(constructor instanceof Function)) {
	      throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function");
	    }

	    var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function () {});
	    dummy.prototype = constructor.prototype;
	    var obj = new dummy();
	    var r = constructor.apply(obj, argumentList);
	    return r instanceof Object ? r : obj;
	  }

	  function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
	    var argCount = argTypes.length;

	    if (argCount < 2) {
	      throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
	    }

	    var isClassMethodFunc = argTypes[1] !== null && classType !== null;
	    var needsDestructorStack = false;

	    for (var i = 1; i < argTypes.length; ++i) {
	      if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
	        needsDestructorStack = true;
	        break;
	      }
	    }

	    var returns = argTypes[0].name !== "void";
	    var argsList = "";
	    var argsListWired = "";

	    for (var i = 0; i < argCount - 2; ++i) {
	      argsList += (i !== 0 ? ", " : "") + "arg" + i;
	      argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
	    }

	    var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";

	    if (needsDestructorStack) {
	      invokerFnBody += "var destructors = [];\n";
	    }

	    var dtorStack = needsDestructorStack ? "destructors" : "null";
	    var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
	    var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];

	    if (isClassMethodFunc) {
	      invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
	    }

	    for (var i = 0; i < argCount - 2; ++i) {
	      invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
	      args1.push("argType" + i);
	      args2.push(argTypes[i + 2]);
	    }

	    if (isClassMethodFunc) {
	      argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
	    }

	    invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";

	    if (needsDestructorStack) {
	      invokerFnBody += "runDestructors(destructors);\n";
	    } else {
	      for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
	        var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";

	        if (argTypes[i].destructorFunction !== null) {
	          invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
	          args1.push(paramName + "_dtor");
	          args2.push(argTypes[i].destructorFunction);
	        }
	      }
	    }

	    if (returns) {
	      invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
	    }

	    invokerFnBody += "}\n";
	    args1.push(invokerFnBody);
	    var invokerFunction = new_(Function, args1).apply(null, args2);
	    return invokerFunction;
	  }

	  function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
	    assert(argCount > 0);
	    var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
	    invoker = embind__requireFunction(invokerSignature, invoker);
	    whenDependentTypesAreResolved([], [rawClassType], function (classType) {
	      classType = classType[0];
	      var humanName = "constructor " + classType.name;

	      if (undefined === classType.registeredClass.constructor_body) {
	        classType.registeredClass.constructor_body = [];
	      }

	      if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
	        throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
	      }

	      classType.registeredClass.constructor_body[argCount - 1] = () => {
	        throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
	      };

	      whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
	        argTypes.splice(1, 0, null);
	        classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
	        return [];
	      });
	      return [];
	    });
	  }

	  function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
	    var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
	    methodName = readLatin1String(methodName);
	    rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
	    whenDependentTypesAreResolved([], [rawClassType], function (classType) {
	      classType = classType[0];
	      var humanName = classType.name + "." + methodName;

	      if (methodName.startsWith("@@")) {
	        methodName = Symbol[methodName.substring(2)];
	      }

	      if (isPureVirtual) {
	        classType.registeredClass.pureVirtualFunctions.push(methodName);
	      }

	      function unboundTypesHandler() {
	        throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
	      }

	      var proto = classType.registeredClass.instancePrototype;
	      var method = proto[methodName];

	      if (undefined === method || undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
	        unboundTypesHandler.argCount = argCount - 2;
	        unboundTypesHandler.className = classType.name;
	        proto[methodName] = unboundTypesHandler;
	      } else {
	        ensureOverloadTable(proto, methodName, humanName);
	        proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
	      }

	      whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
	        var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);

	        if (undefined === proto[methodName].overloadTable) {
	          memberFunction.argCount = argCount - 2;
	          proto[methodName] = memberFunction;
	        } else {
	          proto[methodName].overloadTable[argCount - 2] = memberFunction;
	        }

	        return [];
	      });
	      return [];
	    });
	  }

	  var emval_free_list = [];
	  var emval_handle_array = [{}, {
	    value: undefined
	  }, {
	    value: null
	  }, {
	    value: true
	  }, {
	    value: false
	  }];

	  function __emval_decref(handle) {
	    if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
	      emval_handle_array[handle] = undefined;
	      emval_free_list.push(handle);
	    }
	  }

	  function count_emval_handles() {
	    var count = 0;

	    for (var i = 5; i < emval_handle_array.length; ++i) {
	      if (emval_handle_array[i] !== undefined) {
	        ++count;
	      }
	    }

	    return count;
	  }

	  function get_first_emval() {
	    for (var i = 5; i < emval_handle_array.length; ++i) {
	      if (emval_handle_array[i] !== undefined) {
	        return emval_handle_array[i];
	      }
	    }

	    return null;
	  }

	  function init_emval() {
	    Module["count_emval_handles"] = count_emval_handles;
	    Module["get_first_emval"] = get_first_emval;
	  }

	  var Emval = {
	    toValue: handle => {
	      if (!handle) {
	        throwBindingError("Cannot use deleted val. handle = " + handle);
	      }

	      return emval_handle_array[handle].value;
	    },
	    toHandle: value => {
	      switch (value) {
	        case undefined:
	          return 1;

	        case null:
	          return 2;

	        case true:
	          return 3;

	        case false:
	          return 4;

	        default:
	          {
	            var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
	            emval_handle_array[handle] = {
	              refcount: 1,
	              value: value
	            };
	            return handle;
	          }
	      }
	    }
	  };

	  function __embind_register_emval(rawType, name) {
	    name = readLatin1String(name);
	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (handle) {
	        var rv = Emval.toValue(handle);

	        __emval_decref(handle);

	        return rv;
	      },
	      "toWireType": function (destructors, value) {
	        return Emval.toHandle(value);
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": simpleReadValueFromPointer,
	      destructorFunction: null
	    });
	  }

	  function embindRepr(v) {
	    if (v === null) {
	      return "null";
	    }

	    var t = typeof v;

	    if (t === "object" || t === "array" || t === "function") {
	      return v.toString();
	    } else {
	      return "" + v;
	    }
	  }

	  function floatReadValueFromPointer(name, shift) {
	    switch (shift) {
	      case 2:
	        return function (pointer) {
	          return this["fromWireType"](HEAPF32[pointer >> 2]);
	        };

	      case 3:
	        return function (pointer) {
	          return this["fromWireType"](HEAPF64[pointer >> 3]);
	        };

	      default:
	        throw new TypeError("Unknown float type: " + name);
	    }
	  }

	  function __embind_register_float(rawType, name, size) {
	    var shift = getShiftFromSize(size);
	    name = readLatin1String(name);
	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (value) {
	        return value;
	      },
	      "toWireType": function (destructors, value) {
	        return value;
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": floatReadValueFromPointer(name, shift),
	      destructorFunction: null
	    });
	  }

	  function integerReadValueFromPointer(name, shift, signed) {
	    switch (shift) {
	      case 0:
	        return signed ? function readS8FromPointer(pointer) {
	          return HEAP8[pointer];
	        } : function readU8FromPointer(pointer) {
	          return HEAPU8[pointer];
	        };

	      case 1:
	        return signed ? function readS16FromPointer(pointer) {
	          return HEAP16[pointer >> 1];
	        } : function readU16FromPointer(pointer) {
	          return HEAPU16[pointer >> 1];
	        };

	      case 2:
	        return signed ? function readS32FromPointer(pointer) {
	          return HEAP32[pointer >> 2];
	        } : function readU32FromPointer(pointer) {
	          return HEAPU32[pointer >> 2];
	        };

	      default:
	        throw new TypeError("Unknown integer type: " + name);
	    }
	  }

	  function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
	    name = readLatin1String(name);

	    var shift = getShiftFromSize(size);

	    var fromWireType = value => value;

	    if (minRange === 0) {
	      var bitshift = 32 - 8 * size;

	      fromWireType = value => value << bitshift >>> bitshift;
	    }

	    var isUnsignedType = name.includes("unsigned");

	    var checkAssertions = (value, toTypeName) => {};

	    var toWireType;

	    if (isUnsignedType) {
	      toWireType = function (destructors, value) {
	        checkAssertions(value, this.name);
	        return value >>> 0;
	      };
	    } else {
	      toWireType = function (destructors, value) {
	        checkAssertions(value, this.name);
	        return value;
	      };
	    }

	    registerType(primitiveType, {
	      name: name,
	      "fromWireType": fromWireType,
	      "toWireType": toWireType,
	      "argPackAdvance": 8,
	      "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
	      destructorFunction: null
	    });
	  }

	  function __embind_register_memory_view(rawType, dataTypeIndex, name) {
	    var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
	    var TA = typeMapping[dataTypeIndex];

	    function decodeMemoryView(handle) {
	      handle = handle >> 2;
	      var heap = HEAPU32;
	      var size = heap[handle];
	      var data = heap[handle + 1];
	      return new TA(buffer, data, size);
	    }

	    name = readLatin1String(name);
	    registerType(rawType, {
	      name: name,
	      "fromWireType": decodeMemoryView,
	      "argPackAdvance": 8,
	      "readValueFromPointer": decodeMemoryView
	    }, {
	      ignoreDuplicateRegistrations: true
	    });
	  }

	  function __embind_register_std_string(rawType, name) {
	    name = readLatin1String(name);
	    var stdStringIsUTF8 = name === "std::string";
	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (value) {
	        var length = HEAPU32[value >> 2];
	        var payload = value + 4;
	        var str;

	        if (stdStringIsUTF8) {
	          var decodeStartPtr = payload;

	          for (var i = 0; i <= length; ++i) {
	            var currentBytePtr = payload + i;

	            if (i == length || HEAPU8[currentBytePtr] == 0) {
	              var maxRead = currentBytePtr - decodeStartPtr;
	              var stringSegment = UTF8ToString(decodeStartPtr, maxRead);

	              if (str === undefined) {
	                str = stringSegment;
	              } else {
	                str += String.fromCharCode(0);
	                str += stringSegment;
	              }

	              decodeStartPtr = currentBytePtr + 1;
	            }
	          }
	        } else {
	          var a = new Array(length);

	          for (var i = 0; i < length; ++i) {
	            a[i] = String.fromCharCode(HEAPU8[payload + i]);
	          }

	          str = a.join("");
	        }

	        _free(value);

	        return str;
	      },
	      "toWireType": function (destructors, value) {
	        if (value instanceof ArrayBuffer) {
	          value = new Uint8Array(value);
	        }

	        var length;
	        var valueIsOfTypeString = typeof value == "string";

	        if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
	          throwBindingError("Cannot pass non-string to std::string");
	        }

	        if (stdStringIsUTF8 && valueIsOfTypeString) {
	          length = lengthBytesUTF8(value);
	        } else {
	          length = value.length;
	        }

	        var base = _malloc(4 + length + 1);

	        var ptr = base + 4;
	        HEAPU32[base >> 2] = length;

	        if (stdStringIsUTF8 && valueIsOfTypeString) {
	          stringToUTF8(value, ptr, length + 1);
	        } else {
	          if (valueIsOfTypeString) {
	            for (var i = 0; i < length; ++i) {
	              var charCode = value.charCodeAt(i);

	              if (charCode > 255) {
	                _free(ptr);

	                throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
	              }

	              HEAPU8[ptr + i] = charCode;
	            }
	          } else {
	            for (var i = 0; i < length; ++i) {
	              HEAPU8[ptr + i] = value[i];
	            }
	          }
	        }

	        if (destructors !== null) {
	          destructors.push(_free, base);
	        }

	        return base;
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": simpleReadValueFromPointer,
	      destructorFunction: function (ptr) {
	        _free(ptr);
	      }
	    });
	  }

	  function __embind_register_std_wstring(rawType, charSize, name) {
	    name = readLatin1String(name);
	    var decodeString, encodeString, getHeap, lengthBytesUTF, shift;

	    if (charSize === 2) {
	      decodeString = UTF16ToString;
	      encodeString = stringToUTF16;
	      lengthBytesUTF = lengthBytesUTF16;

	      getHeap = () => HEAPU16;

	      shift = 1;
	    } else if (charSize === 4) {
	      decodeString = UTF32ToString;
	      encodeString = stringToUTF32;
	      lengthBytesUTF = lengthBytesUTF32;

	      getHeap = () => HEAPU32;

	      shift = 2;
	    }

	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (value) {
	        var length = HEAPU32[value >> 2];
	        var HEAP = getHeap();
	        var str;
	        var decodeStartPtr = value + 4;

	        for (var i = 0; i <= length; ++i) {
	          var currentBytePtr = value + 4 + i * charSize;

	          if (i == length || HEAP[currentBytePtr >> shift] == 0) {
	            var maxReadBytes = currentBytePtr - decodeStartPtr;
	            var stringSegment = decodeString(decodeStartPtr, maxReadBytes);

	            if (str === undefined) {
	              str = stringSegment;
	            } else {
	              str += String.fromCharCode(0);
	              str += stringSegment;
	            }

	            decodeStartPtr = currentBytePtr + charSize;
	          }
	        }

	        _free(value);

	        return str;
	      },
	      "toWireType": function (destructors, value) {
	        if (!(typeof value == "string")) {
	          throwBindingError("Cannot pass non-string to C++ string type " + name);
	        }

	        var length = lengthBytesUTF(value);

	        var ptr = _malloc(4 + length + charSize);

	        HEAPU32[ptr >> 2] = length >> shift;
	        encodeString(value, ptr + 4, length + charSize);

	        if (destructors !== null) {
	          destructors.push(_free, ptr);
	        }

	        return ptr;
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": simpleReadValueFromPointer,
	      destructorFunction: function (ptr) {
	        _free(ptr);
	      }
	    });
	  }

	  function __embind_register_void(rawType, name) {
	    name = readLatin1String(name);
	    registerType(rawType, {
	      isVoid: true,
	      name: name,
	      "argPackAdvance": 0,
	      "fromWireType": function () {
	        return undefined;
	      },
	      "toWireType": function (destructors, o) {
	        return undefined;
	      }
	    });
	  }

	  function __emscripten_date_now() {
	    return Date.now();
	  }

	  var emval_symbols = {};

	  function getStringOrSymbol(address) {
	    var symbol = emval_symbols[address];

	    if (symbol === undefined) {
	      return readLatin1String(address);
	    }

	    return symbol;
	  }

	  var emval_methodCallers = [];

	  function __emval_call_void_method(caller, handle, methodName, args) {
	    caller = emval_methodCallers[caller];
	    handle = Emval.toValue(handle);
	    methodName = getStringOrSymbol(methodName);
	    caller(handle, methodName, null, args);
	  }

	  function emval_addMethodCaller(caller) {
	    var id = emval_methodCallers.length;
	    emval_methodCallers.push(caller);
	    return id;
	  }

	  function requireRegisteredType(rawType, humanName) {
	    var impl = registeredTypes[rawType];

	    if (undefined === impl) {
	      throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
	    }

	    return impl;
	  }

	  function emval_lookupTypes(argCount, argTypes) {
	    var a = new Array(argCount);

	    for (var i = 0; i < argCount; ++i) {
	      a[i] = requireRegisteredType(HEAPU32[argTypes + i * POINTER_SIZE >> 2], "parameter " + i);
	    }

	    return a;
	  }

	  var emval_registeredMethods = [];

	  function __emval_get_method_caller(argCount, argTypes) {
	    var types = emval_lookupTypes(argCount, argTypes);
	    var retType = types[0];
	    var signatureName = retType.name + "_$" + types.slice(1).map(function (t) {
	      return t.name;
	    }).join("_") + "$";
	    var returnId = emval_registeredMethods[signatureName];

	    if (returnId !== undefined) {
	      return returnId;
	    }

	    var params = ["retType"];
	    var args = [retType];
	    var argsList = "";

	    for (var i = 0; i < argCount - 1; ++i) {
	      argsList += (i !== 0 ? ", " : "") + "arg" + i;
	      params.push("argType" + i);
	      args.push(types[1 + i]);
	    }

	    var functionName = makeLegalFunctionName("methodCaller_" + signatureName);
	    var functionBody = "return function " + functionName + "(handle, name, destructors, args) {\n";
	    var offset = 0;

	    for (var i = 0; i < argCount - 1; ++i) {
	      functionBody += "    var arg" + i + " = argType" + i + ".readValueFromPointer(args" + (offset ? "+" + offset : "") + ");\n";
	      offset += types[i + 1]["argPackAdvance"];
	    }

	    functionBody += "    var rv = handle[name](" + argsList + ");\n";

	    for (var i = 0; i < argCount - 1; ++i) {
	      if (types[i + 1]["deleteObject"]) {
	        functionBody += "    argType" + i + ".deleteObject(arg" + i + ");\n";
	      }
	    }

	    if (!retType.isVoid) {
	      functionBody += "    return retType.toWireType(destructors, rv);\n";
	    }

	    functionBody += "};\n";
	    params.push(functionBody);
	    var invokerFunction = new_(Function, params).apply(null, args);
	    returnId = emval_addMethodCaller(invokerFunction);
	    emval_registeredMethods[signatureName] = returnId;
	    return returnId;
	  }

	  function _abort() {
	    abort("");
	  }

	  function _emscripten_memcpy_big(dest, src, num) {
	    HEAPU8.copyWithin(dest, src, src + num);
	  }

	  function abortOnCannotGrowMemory(requestedSize) {
	    abort("OOM");
	  }

	  function _emscripten_resize_heap(requestedSize) {
	    HEAPU8.length;
	    abortOnCannotGrowMemory();
	  }

	  var ENV = {};

	  function getExecutableName() {
	    return thisProgram || "./this.program";
	  }

	  function getEnvStrings() {
	    if (!getEnvStrings.strings) {
	      var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
	      var env = {
	        "USER": "web_user",
	        "LOGNAME": "web_user",
	        "PATH": "/",
	        "PWD": "/",
	        "HOME": "/home/web_user",
	        "LANG": lang,
	        "_": getExecutableName()
	      };

	      for (var x in ENV) {
	        if (ENV[x] === undefined) delete env[x];else env[x] = ENV[x];
	      }

	      var strings = [];

	      for (var x in env) {
	        strings.push(x + "=" + env[x]);
	      }

	      getEnvStrings.strings = strings;
	    }

	    return getEnvStrings.strings;
	  }

	  function _environ_get(__environ, environ_buf) {
	    var bufSize = 0;
	    getEnvStrings().forEach(function (string, i) {
	      var ptr = environ_buf + bufSize;
	      HEAPU32[__environ + i * 4 >> 2] = ptr;
	      writeAsciiToMemory(string, ptr);
	      bufSize += string.length + 1;
	    });
	    return 0;
	  }

	  function _environ_sizes_get(penviron_count, penviron_buf_size) {
	    var strings = getEnvStrings();
	    HEAPU32[penviron_count >> 2] = strings.length;
	    var bufSize = 0;
	    strings.forEach(function (string) {
	      bufSize += string.length + 1;
	    });
	    HEAPU32[penviron_buf_size >> 2] = bufSize;
	    return 0;
	  }

	  function _fd_close(fd) {
	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      FS.close(stream);
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function _fd_fdstat_get(fd, pbuf) {
	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
	      HEAP8[pbuf >> 0] = type;
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function doReadv(stream, iov, iovcnt, offset) {
	    var ret = 0;

	    for (var i = 0; i < iovcnt; i++) {
	      var ptr = HEAPU32[iov >> 2];
	      var len = HEAPU32[iov + 4 >> 2];
	      iov += 8;
	      var curr = FS.read(stream, HEAP8, ptr, len, offset);
	      if (curr < 0) return -1;
	      ret += curr;
	      if (curr < len) break;
	    }

	    return ret;
	  }

	  function _fd_read(fd, iov, iovcnt, pnum) {
	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      var num = doReadv(stream, iov, iovcnt);
	      HEAP32[pnum >> 2] = num;
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function convertI32PairToI53Checked(lo, hi) {
	    return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
	  }

	  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
	    try {
	      var offset = convertI32PairToI53Checked(offset_low, offset_high);
	      if (isNaN(offset)) return 61;
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      FS.llseek(stream, offset, whence);
	      tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
	      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function doWritev(stream, iov, iovcnt, offset) {
	    var ret = 0;

	    for (var i = 0; i < iovcnt; i++) {
	      var ptr = HEAPU32[iov >> 2];
	      var len = HEAPU32[iov + 4 >> 2];
	      iov += 8;
	      var curr = FS.write(stream, HEAP8, ptr, len, offset);
	      if (curr < 0) return -1;
	      ret += curr;
	    }

	    return ret;
	  }

	  function _fd_write(fd, iov, iovcnt, pnum) {
	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      var num = doWritev(stream, iov, iovcnt);
	      HEAPU32[pnum >> 2] = num;
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function _setTempRet0(val) {
	  }

	  var FSNode = function (parent, name, mode, rdev) {
	    if (!parent) {
	      parent = this;
	    }

	    this.parent = parent;
	    this.mount = parent.mount;
	    this.mounted = null;
	    this.id = FS.nextInode++;
	    this.name = name;
	    this.mode = mode;
	    this.node_ops = {};
	    this.stream_ops = {};
	    this.rdev = rdev;
	  };

	  var readMode = 292 | 73;
	  var writeMode = 146;
	  Object.defineProperties(FSNode.prototype, {
	    read: {
	      get: function () {
	        return (this.mode & readMode) === readMode;
	      },
	      set: function (val) {
	        val ? this.mode |= readMode : this.mode &= ~readMode;
	      }
	    },
	    write: {
	      get: function () {
	        return (this.mode & writeMode) === writeMode;
	      },
	      set: function (val) {
	        val ? this.mode |= writeMode : this.mode &= ~writeMode;
	      }
	    },
	    isFolder: {
	      get: function () {
	        return FS.isDir(this.mode);
	      }
	    },
	    isDevice: {
	      get: function () {
	        return FS.isChrdev(this.mode);
	      }
	    }
	  });
	  FS.FSNode = FSNode;
	  FS.staticInit();
	  embind_init_charCodes();
	  BindingError = Module["BindingError"] = extendError(Error, "BindingError");
	  InternalError = Module["InternalError"] = extendError(Error, "InternalError");
	  init_ClassHandle();
	  init_embind();
	  init_RegisteredPointer();
	  UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
	  init_emval();

	  function intArrayFromString(stringy, dontAddNull, length) {
	    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
	    var u8array = new Array(len);
	    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
	    if (dontAddNull) u8array.length = numBytesWritten;
	    return u8array;
	  }

	  var asmLibraryArg = {
	    "r": ___cxa_allocate_exception,
	    "q": ___cxa_throw,
	    "C": ___syscall_fcntl64,
	    "v": ___syscall_openat,
	    "t": __embind_register_bigint,
	    "E": __embind_register_bool,
	    "i": __embind_register_class,
	    "h": __embind_register_class_constructor,
	    "d": __embind_register_class_function,
	    "D": __embind_register_emval,
	    "l": __embind_register_float,
	    "c": __embind_register_integer,
	    "b": __embind_register_memory_view,
	    "m": __embind_register_std_string,
	    "g": __embind_register_std_wstring,
	    "p": __embind_register_void,
	    "f": __emscripten_date_now,
	    "n": __emval_call_void_method,
	    "o": __emval_decref,
	    "j": __emval_get_method_caller,
	    "a": _abort,
	    "z": _emscripten_memcpy_big,
	    "e": _emscripten_resize_heap,
	    "x": _environ_get,
	    "y": _environ_sizes_get,
	    "k": _fd_close,
	    "w": _fd_fdstat_get,
	    "B": _fd_read,
	    "s": _fd_seek,
	    "A": _fd_write,
	    "u": _setTempRet0
	  };
	  createWasm();

	  Module["___wasm_call_ctors"] = function () {
	    return (Module["___wasm_call_ctors"] = Module["asm"]["G"]).apply(null, arguments);
	  };

	  var _free = Module["_free"] = function () {
	    return (_free = Module["_free"] = Module["asm"]["H"]).apply(null, arguments);
	  };

	  var _malloc = Module["_malloc"] = function () {
	    return (_malloc = Module["_malloc"] = Module["asm"]["I"]).apply(null, arguments);
	  };

	  var ___errno_location = Module["___errno_location"] = function () {
	    return (___errno_location = Module["___errno_location"] = Module["asm"]["J"]).apply(null, arguments);
	  };

	  var ___getTypeName = Module["___getTypeName"] = function () {
	    return (___getTypeName = Module["___getTypeName"] = Module["asm"]["K"]).apply(null, arguments);
	  };

	  Module["___embind_register_native_and_builtin_types"] = function () {
	    return (Module["___embind_register_native_and_builtin_types"] = Module["asm"]["L"]).apply(null, arguments);
	  };

	  var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = function () {
	    return (___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = Module["asm"]["N"]).apply(null, arguments);
	  };

	  Module["dynCall_jiji"] = function () {
	    return (Module["dynCall_jiji"] = Module["asm"]["O"]).apply(null, arguments);
	  };

	  var calledRun;

	  function ExitStatus(status) {
	    this.name = "ExitStatus";
	    this.message = "Program terminated with exit(" + status + ")";
	    this.status = status;
	  }

	  dependenciesFulfilled = function runCaller() {
	    if (!calledRun) run();
	    if (!calledRun) dependenciesFulfilled = runCaller;
	  };

	  function run(args) {

	    if (runDependencies > 0) {
	      return;
	    }

	    preRun();

	    if (runDependencies > 0) {
	      return;
	    }

	    function doRun() {
	      if (calledRun) return;
	      calledRun = true;
	      Module["calledRun"] = true;
	      if (ABORT) return;
	      initRuntime();
	      if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
	      postRun();
	    }

	    if (Module["setStatus"]) {
	      Module["setStatus"]("Running...");
	      setTimeout(function () {
	        setTimeout(function () {
	          Module["setStatus"]("");
	        }, 1);
	        doRun();
	      }, 1);
	    } else {
	      doRun();
	    }
	  }

	  Module["run"] = run;

	  if (Module["preInit"]) {
	    if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];

	    while (Module["preInit"].length > 0) {
	      Module["preInit"].pop()();
	    }
	  }

	  run();
	  module.exports = Module;
	});

	const AVType = {
	  Video: 0x1,
	  Audio: 0x2
	};
	const VideoType = {
	  H264: 0x1,
	  H265: 0x2
	};
	const AudioType = {
	  PCM: 0x1,
	  PCMA: 0x2,
	  PCMU: 0x4,
	  AAC: 0x8
	};
	const WORKER_SEND_TYPE = {
	  init: 'init',
	  setVideoCodec: 'setVideoCodec',
	  decodeVideo: 'decodeVideo',
	  setAudioCodec: 'setAudioCodec',
	  decodeAudio: 'decodeAudio',
	  reset: 'reset',
	  destroy: 'destroy'
	};
	const WORKER_EVENT_TYPE = {
	  created: 'created',
	  inited: 'inited',
	  reseted: 'reseted',
	  destroyed: 'destroyed',
	  videoInfo: 'videoInfo',
	  yuvData: 'yuvData',
	  audioInfo: 'audioInfo',
	  pcmData: 'pcmData'
	};

	class AVPacket {
	  payload;
	  avtype;
	  timestamp;
	  nals;
	  iskeyframe;
	}

	class VideoInfo {
	  vtype;
	  width;
	  height;
	  extradata;
	}

	class AudioInfo {
	  atype;
	  sample;
	  channels;
	  depth;
	  profile;
	  extradata;
	}

	class SpliteBuffer {
	  _sampleRate = 0;
	  _channels = 0;
	  _samplesPerPacket = 0;
	  _samplesList = [];
	  _curSamples = 0;

	  constructor(sampleRate, channels, samplesPerPacket) {
	    this._sampleRate = sampleRate;
	    this._channels = channels;
	    this._samplesPerPacket = samplesPerPacket;
	  }

	  addBuffer(buffers, pts) {
	    this._samplesList.push({
	      buffers,
	      pts
	    });

	    this._curSamples += buffers[0].length;
	  }

	  spliteOnce(f) {
	    if (this._curSamples < this._samplesPerPacket) {
	      return;
	    }

	    let newbuffers = [];
	    let pts = undefined;

	    for (let i = 0; i < this._channels; i++) {
	      newbuffers.push(new Float32Array(this._samplesPerPacket));
	    }

	    let needSamples = this._samplesPerPacket;
	    let copySamples = 0;

	    while (true) {
	      if (needSamples === 0) {
	        break;
	      }

	      let first = this._samplesList[0];

	      if (!pts) {
	        pts = first.pts;
	      }

	      if (needSamples >= first.buffers[0].length) {
	        newbuffers[0].set(first.buffers[0], copySamples);

	        if (this._channels > 1) {
	          newbuffers[1].set(first.buffers[1], copySamples);
	        }

	        needSamples -= first.buffers[0].length;
	        copySamples += first.buffers[0].length;

	        this._samplesList.shift();
	      } else {
	        newbuffers[0].set(first.buffers[0].slice(0, needSamples), copySamples);
	        first.buffers[0] = first.buffers[0].slice(needSamples);

	        if (this._channels > 1) {
	          newbuffers[1].set(first.buffers[1].slice(0, needSamples), copySamples);
	          first.buffers[1] = first.buffers[1].slice(needSamples);
	        }

	        first.pts += Math.floor(needSamples * 1000 / this._sampleRate);
	        copySamples += needSamples;
	        needSamples = 0;
	      }
	    }

	    this._curSamples -= this._samplesPerPacket;
	    f(newbuffers, pts);
	  }

	  splite(f) {
	    while (this._curSamples >= this._samplesPerPacket) {
	      this.spliteOnce(f);
	    }
	  }

	}

	function caculateSamplesPerPacket(sampleRate) {
	  return 1024;
	}

	class Logger {
	  _logEnable = false;

	  constructor() {}

	  setLogEnable(logEnable) {
	    this._logEnable = logEnable;
	  }

	  info(module) {
	    if (this._logEnable) {
	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      console.log(`AVPlayer: [${module}]`, ...args);
	    }
	  }

	  warn(module) {
	    if (this._logEnable) {
	      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	      }

	      console.warn(`AVPlayer: [${module}]`, ...args);
	    }
	  }

	  error(module) {
	    if (this._logEnable) {
	      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	        args[_key3 - 1] = arguments[_key3];
	      }

	      console.error(`AVPlayer: [${module}]`, ...args);
	    }
	  }

	}

	var eventemitter3 = createCommonjsModule(function (module) {

	var has = Object.prototype.hasOwnProperty
	  , prefix = '~';

	/**
	 * Constructor to create a storage for our `EE` objects.
	 * An `Events` instance is a plain object whose properties are event names.
	 *
	 * @constructor
	 * @private
	 */
	function Events() {}

	//
	// We try to not inherit from `Object.prototype`. In some engines creating an
	// instance in this way is faster than calling `Object.create(null)` directly.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// character to make sure that the built-in object properties are not
	// overridden or used as an attack vector.
	//
	if (Object.create) {
	  Events.prototype = Object.create(null);

	  //
	  // This hack is needed because the `__proto__` property is still inherited in
	  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
	  //
	  if (!new Events().__proto__) prefix = false;
	}

	/**
	 * Representation of a single event listener.
	 *
	 * @param {Function} fn The listener function.
	 * @param {*} context The context to invoke the listener with.
	 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	 * @constructor
	 * @private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Add a listener for a given event.
	 *
	 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} context The context to invoke the listener with.
	 * @param {Boolean} once Specify if the listener is a one-time listener.
	 * @returns {EventEmitter}
	 * @private
	 */
	function addListener(emitter, event, fn, context, once) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('The listener must be a function');
	  }

	  var listener = new EE(fn, context || emitter, once)
	    , evt = prefix ? prefix + event : event;

	  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
	  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
	  else emitter._events[evt] = [emitter._events[evt], listener];

	  return emitter;
	}

	/**
	 * Clear event by name.
	 *
	 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	 * @param {(String|Symbol)} evt The Event name.
	 * @private
	 */
	function clearEvent(emitter, evt) {
	  if (--emitter._eventsCount === 0) emitter._events = new Events();
	  else delete emitter._events[evt];
	}

	/**
	 * Minimal `EventEmitter` interface that is molded against the Node.js
	 * `EventEmitter` interface.
	 *
	 * @constructor
	 * @public
	 */
	function EventEmitter() {
	  this._events = new Events();
	  this._eventsCount = 0;
	}

	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var names = []
	    , events
	    , name;

	  if (this._eventsCount === 0) return names;

	  for (name in (events = this._events)) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }

	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }

	  return names;
	};

	/**
	 * Return the listeners registered for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Array} The registered listeners.
	 * @public
	 */
	EventEmitter.prototype.listeners = function listeners(event) {
	  var evt = prefix ? prefix + event : event
	    , handlers = this._events[evt];

	  if (!handlers) return [];
	  if (handlers.fn) return [handlers.fn];

	  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
	    ee[i] = handlers[i].fn;
	  }

	  return ee;
	};

	/**
	 * Return the number of listeners listening to a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Number} The number of listeners.
	 * @public
	 */
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
	  var evt = prefix ? prefix + event : event
	    , listeners = this._events[evt];

	  if (!listeners) return 0;
	  if (listeners.fn) return 1;
	  return listeners.length;
	};

	/**
	 * Calls each of the listeners registered for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Boolean} `true` if the event had listeners, else `false`.
	 * @public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return false;

	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;

	  if (listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Add a listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  return addListener(this, event, fn, context, false);
	};

	/**
	 * Add a one-time listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  return addListener(this, event, fn, context, true);
	};

	/**
	 * Remove the listeners of a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn Only remove the listeners that match this function.
	 * @param {*} context Only remove the listeners that have this context.
	 * @param {Boolean} once Only remove one-time listeners.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return this;
	  if (!fn) {
	    clearEvent(this, evt);
	    return this;
	  }

	  var listeners = this._events[evt];

	  if (listeners.fn) {
	    if (
	      listeners.fn === fn &&
	      (!once || listeners.once) &&
	      (!context || listeners.context === context)
	    ) {
	      clearEvent(this, evt);
	    }
	  } else {
	    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
	      if (
	        listeners[i].fn !== fn ||
	        (once && !listeners[i].once) ||
	        (context && listeners[i].context !== context)
	      ) {
	        events.push(listeners[i]);
	      }
	    }

	    //
	    // Reset the array, or remove it completely if we have no more listeners.
	    //
	    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
	    else clearEvent(this, evt);
	  }

	  return this;
	};

	/**
	 * Remove all listeners, or those of the specified event.
	 *
	 * @param {(String|Symbol)} [event] The event name.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  var evt;

	  if (event) {
	    evt = prefix ? prefix + event : event;
	    if (this._events[evt]) clearEvent(this, evt);
	  } else {
	    this._events = new Events();
	    this._eventsCount = 0;
	  }

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;

	//
	// Allow `EventEmitter` to be imported as module namespace.
	//
	EventEmitter.EventEmitter = EventEmitter;

	//
	// Expose the module.
	//
	{
	  module.exports = EventEmitter;
	}
	});

	class Bitop {
	  constructor(buffer) {
	    this.buffer = buffer;
	    this.buflen = buffer.length;
	    this.bufpos = 0;
	    this.bufoff = 0;
	    this.iserro = false;
	  }

	  read(n) {
	    let v = 0;
	    let d = 0;

	    while (n) {
	      if (n < 0 || this.bufpos >= this.buflen) {
	        this.iserro = true;
	        return 0;
	      }

	      this.iserro = false;
	      d = this.bufoff + n > 8 ? 8 - this.bufoff : n;
	      v <<= d;
	      v += this.buffer[this.bufpos] >> 8 - this.bufoff - d & 0xff >> 8 - d;
	      this.bufoff += d;
	      n -= d;

	      if (this.bufoff == 8) {
	        this.bufpos++;
	        this.bufoff = 0;
	      }
	    }

	    return v;
	  }

	  look(n) {
	    let p = this.bufpos;
	    let o = this.bufoff;
	    let v = this.read(n);
	    this.bufpos = p;
	    this.bufoff = o;
	    return v;
	  }

	  read_golomb() {
	    let n;

	    for (n = 0; this.read(1) == 0 && !this.iserro; n++);

	    return (1 << n) + this.read(n) - 1;
	  }

	}

	//
	const AAC_SAMPLE_RATE = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350, 0, 0, 0];
	const AAC_CHANNELS = [0, 1, 2, 3, 4, 5, 6, 8];

	function getObjectType(bitop) {
	  let audioObjectType = bitop.read(5);

	  if (audioObjectType === 31) {
	    audioObjectType = bitop.read(6) + 32;
	  }

	  return audioObjectType;
	}

	function getSampleRate(bitop, info) {
	  info.sampling_index = bitop.read(4);
	  return info.sampling_index == 0x0f ? bitop.read(24) : AAC_SAMPLE_RATE[info.sampling_index];
	}

	function readAACSpecificConfig(aacSequenceHeader) {
	  let info = {};
	  let bitop = new Bitop(aacSequenceHeader);
	  bitop.read(16);
	  info.object_type = getObjectType(bitop);
	  info.sample_rate = getSampleRate(bitop, info);
	  info.chan_config = bitop.read(4);

	  if (info.chan_config < AAC_CHANNELS.length) {
	    info.channels = AAC_CHANNELS[info.chan_config];
	  }

	  info.sbr = -1;
	  info.ps = -1;

	  if (info.object_type == 5 || info.object_type == 29) {
	    if (info.object_type == 29) {
	      info.ps = 1;
	    }

	    info.ext_object_type = 5;
	    info.sbr = 1;
	    info.sample_rate = getSampleRate(bitop, info);
	    info.object_type = getObjectType(bitop);
	  }

	  return info;
	}

	function readH264SpecificConfig(avcSequenceHeader) {
	  let info = {};
	  let profile_idc, width, height, crop_left, crop_right, crop_top, crop_bottom, frame_mbs_only, n, cf_idc, num_ref_frames;
	  let bitop = new Bitop(avcSequenceHeader);
	  bitop.read(48);
	  info.width = 0;
	  info.height = 0;

	  do {
	    info.profile = bitop.read(8);
	    info.compat = bitop.read(8);
	    info.level = bitop.read(8);
	    info.nalu = (bitop.read(8) & 0x03) + 1;
	    info.nb_sps = bitop.read(8) & 0x1F;

	    if (info.nb_sps == 0) {
	      break;
	    }
	    /* nal size */


	    bitop.read(16);
	    /* nal type */

	    if (bitop.read(8) != 0x67) {
	      break;
	    }
	    /* SPS */


	    profile_idc = bitop.read(8);
	    /* flags */

	    bitop.read(8);
	    /* level idc */

	    bitop.read(8);
	    /* SPS id */

	    bitop.read_golomb();

	    if (profile_idc == 100 || profile_idc == 110 || profile_idc == 122 || profile_idc == 244 || profile_idc == 44 || profile_idc == 83 || profile_idc == 86 || profile_idc == 118) {
	      /* chroma format idc */
	      cf_idc = bitop.read_golomb();

	      if (cf_idc == 3) {
	        /* separate color plane */
	        bitop.read(1);
	      }
	      /* bit depth luma - 8 */


	      bitop.read_golomb();
	      /* bit depth chroma - 8 */

	      bitop.read_golomb();
	      /* qpprime y zero transform bypass */

	      bitop.read(1);
	      /* seq scaling matrix present */

	      if (bitop.read(1)) {
	        for (n = 0; n < (cf_idc != 3 ? 8 : 12); n++) {
	          /* seq scaling list present */
	          if (bitop.read(1)) ;
	        }
	      }
	    }
	    /* log2 max frame num */


	    bitop.read_golomb();
	    /* pic order cnt type */

	    switch (bitop.read_golomb()) {
	      case 0:
	        /* max pic order cnt */
	        bitop.read_golomb();
	        break;

	      case 1:
	        /* delta pic order alwys zero */
	        bitop.read(1);
	        /* offset for non-ref pic */

	        bitop.read_golomb();
	        /* offset for top to bottom field */

	        bitop.read_golomb();
	        /* num ref frames in pic order */

	        num_ref_frames = bitop.read_golomb();

	        for (n = 0; n < num_ref_frames; n++) {
	          /* offset for ref frame */
	          bitop.read_golomb();
	        }

	    }
	    /* num ref frames */


	    info.avc_ref_frames = bitop.read_golomb();
	    /* gaps in frame num allowed */

	    bitop.read(1);
	    /* pic width in mbs - 1 */

	    width = bitop.read_golomb();
	    /* pic height in map units - 1 */

	    height = bitop.read_golomb();
	    /* frame mbs only flag */

	    frame_mbs_only = bitop.read(1);

	    if (!frame_mbs_only) {
	      /* mbs adaprive frame field */
	      bitop.read(1);
	    }
	    /* direct 8x8 inference flag */


	    bitop.read(1);
	    /* frame cropping */

	    if (bitop.read(1)) {
	      crop_left = bitop.read_golomb();
	      crop_right = bitop.read_golomb();
	      crop_top = bitop.read_golomb();
	      crop_bottom = bitop.read_golomb();
	    } else {
	      crop_left = 0;
	      crop_right = 0;
	      crop_top = 0;
	      crop_bottom = 0;
	    }

	    info.level = info.level / 10.0;
	    info.width = (width + 1) * 16 - (crop_left + crop_right) * 2;
	    info.height = (2 - frame_mbs_only) * (height + 1) * 16 - (crop_top + crop_bottom) * 2;
	  } while (0);

	  return info;
	}

	function HEVCParsePtl(bitop, hevc, max_sub_layers_minus1) {
	  let general_ptl = {};
	  general_ptl.profile_space = bitop.read(2);
	  general_ptl.tier_flag = bitop.read(1);
	  general_ptl.profile_idc = bitop.read(5);
	  general_ptl.profile_compatibility_flags = bitop.read(32);
	  general_ptl.general_progressive_source_flag = bitop.read(1);
	  general_ptl.general_interlaced_source_flag = bitop.read(1);
	  general_ptl.general_non_packed_constraint_flag = bitop.read(1);
	  general_ptl.general_frame_only_constraint_flag = bitop.read(1);
	  bitop.read(32);
	  bitop.read(12);
	  general_ptl.level_idc = bitop.read(8);
	  general_ptl.sub_layer_profile_present_flag = [];
	  general_ptl.sub_layer_level_present_flag = [];

	  for (let i = 0; i < max_sub_layers_minus1; i++) {
	    general_ptl.sub_layer_profile_present_flag[i] = bitop.read(1);
	    general_ptl.sub_layer_level_present_flag[i] = bitop.read(1);
	  }

	  if (max_sub_layers_minus1 > 0) {
	    for (let i = max_sub_layers_minus1; i < 8; i++) {
	      bitop.read(2);
	    }
	  }

	  general_ptl.sub_layer_profile_space = [];
	  general_ptl.sub_layer_tier_flag = [];
	  general_ptl.sub_layer_profile_idc = [];
	  general_ptl.sub_layer_profile_compatibility_flag = [];
	  general_ptl.sub_layer_progressive_source_flag = [];
	  general_ptl.sub_layer_interlaced_source_flag = [];
	  general_ptl.sub_layer_non_packed_constraint_flag = [];
	  general_ptl.sub_layer_frame_only_constraint_flag = [];
	  general_ptl.sub_layer_level_idc = [];

	  for (let i = 0; i < max_sub_layers_minus1; i++) {
	    if (general_ptl.sub_layer_profile_present_flag[i]) {
	      general_ptl.sub_layer_profile_space[i] = bitop.read(2);
	      general_ptl.sub_layer_tier_flag[i] = bitop.read(1);
	      general_ptl.sub_layer_profile_idc[i] = bitop.read(5);
	      general_ptl.sub_layer_profile_compatibility_flag[i] = bitop.read(32);
	      general_ptl.sub_layer_progressive_source_flag[i] = bitop.read(1);
	      general_ptl.sub_layer_interlaced_source_flag[i] = bitop.read(1);
	      general_ptl.sub_layer_non_packed_constraint_flag[i] = bitop.read(1);
	      general_ptl.sub_layer_frame_only_constraint_flag[i] = bitop.read(1);
	      bitop.read(32);
	      bitop.read(12);
	    }

	    if (general_ptl.sub_layer_level_present_flag[i]) {
	      general_ptl.sub_layer_level_idc[i] = bitop.read(8);
	    } else {
	      general_ptl.sub_layer_level_idc[i] = 1;
	    }
	  }

	  return general_ptl;
	}

	function HEVCParseSPS(SPS, hevc) {
	  let psps = {};
	  let NumBytesInNALunit = SPS.length;
	  let rbsp_array = [];
	  let bitop = new Bitop(SPS);
	  bitop.read(1); //forbidden_zero_bit

	  bitop.read(6); //nal_unit_type

	  bitop.read(6); //nuh_reserved_zero_6bits

	  bitop.read(3); //nuh_temporal_id_plus1

	  for (let i = 2; i < NumBytesInNALunit; i++) {
	    if (i + 2 < NumBytesInNALunit && bitop.look(24) == 0x000003) {
	      rbsp_array.push(bitop.read(8));
	      rbsp_array.push(bitop.read(8));
	      i += 2;
	      bitop.read(8);
	      /* equal to 0x03 */
	    } else {
	      rbsp_array.push(bitop.read(8));
	    }
	  }

	  let rbsp = new Uint8Array(rbsp_array);
	  let rbspBitop = new Bitop(rbsp);
	  psps.sps_video_parameter_set_id = rbspBitop.read(4);
	  psps.sps_max_sub_layers_minus1 = rbspBitop.read(3);
	  psps.sps_temporal_id_nesting_flag = rbspBitop.read(1);
	  psps.profile_tier_level = HEVCParsePtl(rbspBitop, hevc, psps.sps_max_sub_layers_minus1);
	  psps.sps_seq_parameter_set_id = rbspBitop.read_golomb();
	  psps.chroma_format_idc = rbspBitop.read_golomb();

	  if (psps.chroma_format_idc == 3) {
	    psps.separate_colour_plane_flag = rbspBitop.read(1);
	  } else {
	    psps.separate_colour_plane_flag = 0;
	  }

	  psps.pic_width_in_luma_samples = rbspBitop.read_golomb();
	  psps.pic_height_in_luma_samples = rbspBitop.read_golomb();
	  psps.conformance_window_flag = rbspBitop.read(1);

	  if (psps.conformance_window_flag) {
	    let vert_mult = 1 + (psps.chroma_format_idc < 2);
	    let horiz_mult = 1 + (psps.chroma_format_idc < 3);
	    psps.conf_win_left_offset = rbspBitop.read_golomb() * horiz_mult;
	    psps.conf_win_right_offset = rbspBitop.read_golomb() * horiz_mult;
	    psps.conf_win_top_offset = rbspBitop.read_golomb() * vert_mult;
	    psps.conf_win_bottom_offset = rbspBitop.read_golomb() * vert_mult;
	  } // Logger.debug(psps);


	  return psps;
	}

	function readHEVCSpecificConfig(hevcSequenceHeader) {
	  let info = {};
	  info.width = 0;
	  info.height = 0;
	  info.profile = 0;
	  info.level = 0; // let bitop = new Bitop(hevcSequenceHeader);
	  // bitop.read(48);

	  hevcSequenceHeader = hevcSequenceHeader.slice(5);

	  do {
	    let hevc = {};

	    if (hevcSequenceHeader.length < 23) {
	      break;
	    }

	    hevc.configurationVersion = hevcSequenceHeader[0];

	    if (hevc.configurationVersion != 1) {
	      break;
	    }

	    hevc.general_profile_space = hevcSequenceHeader[1] >> 6 & 0x03;
	    hevc.general_tier_flag = hevcSequenceHeader[1] >> 5 & 0x01;
	    hevc.general_profile_idc = hevcSequenceHeader[1] & 0x1F;
	    hevc.general_profile_compatibility_flags = hevcSequenceHeader[2] << 24 | hevcSequenceHeader[3] << 16 | hevcSequenceHeader[4] << 8 | hevcSequenceHeader[5];
	    hevc.general_constraint_indicator_flags = hevcSequenceHeader[6] << 24 | hevcSequenceHeader[7] << 16 | hevcSequenceHeader[8] << 8 | hevcSequenceHeader[9];
	    hevc.general_constraint_indicator_flags = hevc.general_constraint_indicator_flags << 16 | hevcSequenceHeader[10] << 8 | hevcSequenceHeader[11];
	    hevc.general_level_idc = hevcSequenceHeader[12];
	    hevc.min_spatial_segmentation_idc = (hevcSequenceHeader[13] & 0x0F) << 8 | hevcSequenceHeader[14];
	    hevc.parallelismType = hevcSequenceHeader[15] & 0x03;
	    hevc.chromaFormat = hevcSequenceHeader[16] & 0x03;
	    hevc.bitDepthLumaMinus8 = hevcSequenceHeader[17] & 0x07;
	    hevc.bitDepthChromaMinus8 = hevcSequenceHeader[18] & 0x07;
	    hevc.avgFrameRate = hevcSequenceHeader[19] << 8 | hevcSequenceHeader[20];
	    hevc.constantFrameRate = hevcSequenceHeader[21] >> 6 & 0x03;
	    hevc.numTemporalLayers = hevcSequenceHeader[21] >> 3 & 0x07;
	    hevc.temporalIdNested = hevcSequenceHeader[21] >> 2 & 0x01;
	    hevc.lengthSizeMinusOne = hevcSequenceHeader[21] & 0x03;
	    let numOfArrays = hevcSequenceHeader[22];
	    let p = hevcSequenceHeader.slice(23);

	    for (let i = 0; i < numOfArrays; i++) {
	      if (p.length < 3) {
	        brak;
	      }

	      let nalutype = p[0];
	      let n = p[1] << 8 | p[2]; // Logger.debug(nalutype, n);

	      p = p.slice(3);

	      for (let j = 0; j < n; j++) {
	        if (p.length < 2) {
	          break;
	        }

	        let k = p[0] << 8 | p[1]; // Logger.debug('k', k);

	        if (p.length < 2 + k) {
	          break;
	        }

	        p = p.slice(2);

	        if (nalutype == 33) {
	          //SPS
	          let sps = new Uint8Array(k);
	          sps.set(p.slice(0, k), 0); // Logger.debug(sps, sps.length);

	          hevc.psps = HEVCParseSPS(sps, hevc);
	          info.profile = hevc.general_profile_idc;
	          info.level = hevc.general_level_idc / 30.0;
	          info.width = hevc.psps.pic_width_in_luma_samples - (hevc.psps.conf_win_left_offset + hevc.psps.conf_win_right_offset);
	          info.height = hevc.psps.pic_height_in_luma_samples - (hevc.psps.conf_win_top_offset + hevc.psps.conf_win_bottom_offset);
	        }

	        p = p.slice(k);
	      }
	    }
	  } while (0);

	  return info;
	}

	function readAVCSpecificConfig(avcSequenceHeader) {
	  let codec_id = avcSequenceHeader[0] & 0x0f;

	  if (codec_id == 7) {
	    return readH264SpecificConfig(avcSequenceHeader);
	  } else if (codec_id == 12) {
	    return readHEVCSpecificConfig(avcSequenceHeader);
	  }
	}

	const FLV_MEDIA_TYPE = {
	  Audio: 8,
	  Video: 9,
	  Script: 18
	};
	const CodecID = {
	  AVC: 7,
	  //h264
	  HEVC: 12 //h265

	};
	const FrameType = {
	  KeyFrame: 1,
	  InterFrame: 2
	};
	const AVCPacketType = {
	  AVCSequenceHeader: 0,
	  AVCNalu: 1
	};
	const SoundFormat = {
	  G711A: 7,
	  G711U: 8,
	  AAC: 10
	};
	const AACPackettype = {
	  AACSequenceHeader: 0,
	  AACRaw: 1
	};
	const FLV_Parse_State = {
	  Init: 0,
	  TagCommerHeader: 1,
	  TagPayload: 2
	};

	class FLVDemuxer extends eventemitter3 {
	  _buffer = undefined;
	  _needlen = 0;
	  _state = 0;
	  _tagtype = 0;
	  _dts = 0;
	  _pts = 0;
	  _videoinfo;
	  _audioinfo;

	  constructor(player) {
	    super();
	    this._player = player;
	    this.reset();
	  }

	  reset() {
	    this._videoinfo = new VideoInfo();
	    this._audioinfo = new AudioInfo();
	    this._state = FLV_Parse_State.Init;
	    this._needlen = 9;
	    this._buffer = undefined;
	  }

	  dispatch(data) {
	    let remain = data;

	    if (this._buffer) {
	      let newbuffer = new Uint8Array(this._buffer.length + data.length);
	      newbuffer.set(this._buffer, 0);
	      newbuffer.set(data, this._buffer.length);
	      remain = newbuffer;
	      this._buffer = undefined;
	    }

	    const tmp = new ArrayBuffer(4);
	    const dv = new DataView(tmp);

	    while (true) {
	      if (remain.length < this._needlen) {
	        break;
	      }

	      if (this._state === FLV_Parse_State.Init) {
	        remain.slice(0, this._needlen);
	        remain = remain.slice(this._needlen);
	        this._needlen = 15;
	        this._state = FLV_Parse_State.TagCommerHeader;
	      } else if (this._state === FLV_Parse_State.TagCommerHeader) {
	        this._tagtype = remain[4] & 0x1F; // 5bit代表类型,8:audio 9:video 18:script other:其他

	        dv.setUint8(0, remain[7]);
	        dv.setUint8(1, remain[6]);
	        dv.setUint8(2, remain[5]);
	        dv.setUint8(3, 0);
	        let payloadlen = dv.getUint32(0, true); //Tag 中除通用头外的长度，即 Header + Data 字段的长度 (等于 Tag 总长度 – 11)

	        dv.setUint8(0, remain[10]);
	        dv.setUint8(1, remain[9]);
	        dv.setUint8(2, remain[8]);
	        dv.setUint8(3, remain[11]);
	        this._dts = dv.getUint32(0, true);
	        remain.slice(0, this._needlen);
	        remain = remain.slice(this._needlen);
	        this._needlen = payloadlen;
	        this._state = FLV_Parse_State.TagPayload;
	      } else {
	        if (this._tagtype === FLV_MEDIA_TYPE.Video) {
	          let frametype = remain[0] >> 4 & 0x0F;
	          let codecid = remain[0] & 0x0F;

	          if (codecid === CodecID.AVC || codecid === CodecID.HEVC) {
	            let avcpackettype = remain[1];
	            dv.setUint8(0, remain[4]);
	            dv.setUint8(1, remain[3]);
	            dv.setUint8(2, remain[2]);
	            dv.setUint8(3, 0);
	            let compositiontime = dv.getUint32(0, true);
	            this._pts = this._dts + compositiontime;

	            if (frametype === FrameType.KeyFrame) {
	              if (avcpackettype === AVCPacketType.AVCSequenceHeader) {
	                //avcseq
	                let info = readAVCSpecificConfig(remain.slice(0, this._needlen));
	                this._videoinfo.vtype = codecid === CodecID.AVC ? VideoType.H264 : VideoType.H265;
	                this._videoinfo.width = info.width;
	                this._videoinfo.height = info.height;
	                this._videoinfo.extradata = remain.slice(5, this._needlen);
	                this.emit('videoinfo', this._videoinfo);
	              } else if (avcpackettype === AVCPacketType.AVCNalu) {
	                //I Frame
	                let vframe = remain.slice(5, this._needlen);
	                let packet = new AVPacket();
	                packet.payload = vframe; //convertAVCCtoAnnexB(vframe);

	                packet.iskeyframe = true;
	                packet.timestamp = this._dts;
	                packet.avtype = AVType.Video; // packet.nals = SplitBufferToNals(vframe);

	                this.emit('videodata', packet);
	              } else ;
	            } else if (frametype === FrameType.InterFrame) {
	              if (avcpackettype === AVCPacketType.AVCNalu) {
	                //P Frame
	                let vframe = remain.slice(5, this._needlen);
	                let packet = new AVPacket();
	                packet.payload = vframe; //convertAVCCtoAnnexB(vframe);

	                packet.iskeyframe = false;
	                packet.timestamp = this._dts;
	                packet.avtype = AVType.Video; // packet.nals = SplitBufferToNals(vframe);

	                this.emit('videodata', packet);
	              }
	            } else ;
	          }
	        } else if (this._tagtype === FLV_MEDIA_TYPE.Audio) {
	          let soundformat = remain[0] >> 4 & 0x0F;
	          remain[0] >> 2 & 0x02;
	          let soundsize = remain[0] >> 1 & 0x01;
	          remain[0] & 0x0F;

	          if (soundformat === SoundFormat.AAC) {
	            let aacpackettype = remain[1];

	            if (aacpackettype === AACPackettype.AACSequenceHeader) {
	              let aacinfo = readAACSpecificConfig(remain.slice(0, this._needlen));
	              this._audioinfo.atype = AudioType.AAC;
	              this._audioinfo.profile = aacinfo.object_type;
	              this._audioinfo.sample = aacinfo.sample_rate;
	              this._audioinfo.channels = aacinfo.chan_config;
	              this._audioinfo.depth = soundsize ? 16 : 8;
	              this._audioinfo.extradata = remain.slice(2, this._needlen);
	              this.emit('audioinfo', this._audioinfo);
	            } else {
	              let aacraw = remain.slice(2, this._needlen);
	              let packet = new AVPacket();
	              packet.payload = aacraw;
	              packet.iskeyframe = false;
	              packet.timestamp = this._dts;
	              packet.avtype = AVType.Audio;
	              this.emit('audiodata', packet);
	            }
	          } else {
	            if (!this._pcminfosend) {
	              this._audioinfo.atype = soundformat === SoundFormat.G711A ? AudioType.PCMA : AudioType.PCMU;
	              this._audioinfo.profile = 0;
	              this._audioinfo.sample = 8000;
	              this._audioinfo.channels = 1;
	              this._audioinfo.depth = 16;
	              this._audioinfo.extradata = new Uint8Array(0);
	              this.emit('audioinfo', this._audioinfo);
	              this._pcminfosend = true;
	            }

	            let audioraw = remain.slice(1, this._needlen);
	            let packet = new AVPacket();
	            packet.payload = audioraw;
	            packet.iskeyframe = false;
	            packet.timestamp = this._dts;
	            packet.avtype = AVType.Audio;
	            this.emit('audiodata', packet);
	          }
	        } else if (this._tagtype === FLV_MEDIA_TYPE.Script) ; else ;

	        remain = remain.slice(this._needlen);
	        this._needlen = 15;
	        this._state = FLV_Parse_State.TagCommerHeader;
	      }
	    }

	    this._buffer = remain;
	  }

	  destroy() {
	    this.off();

	    this._player._logger.info('FLVDemuxer', 'FLVDemuxer destroy');
	  }

	}

	class FetchStream extends eventemitter3 {
	  _player = undefined;
	  _abort = undefined;
	  _retryTimer = undefined;
	  _retryCnt = 0;

	  constructor(player) {
	    super();
	    this._player = player;
	    this._abort = new AbortController();
	  }

	  start() {
	    this._retryCnt++;

	    this._player._logger.warn('FetchStream', `fetch url ${this._player._options.url} start, Cnt ${this._retryCnt}`);

	    fetch(this._player._options.url, {
	      signal: this._abort.signal
	    }).then(res => {
	      const reader = res.body.getReader();

	      let fetchNext = async () => {
	        let {
	          done,
	          value
	        } = await reader.read();

	        if (done) {
	          this._player._logger.warn('FetchStream', `fetch url ${this._player._options.url} done, Cnt ${this._retryCnt}`);

	          this.retry();
	        } else {
	          this.emit('data', value);
	          fetchNext();
	        }
	      };

	      fetchNext();
	    }).catch(e => {
	      this._player._logger.warn('FetchStream', `fetch url ${this._player._options.url} error ${e}, Cnt ${this._retryCnt}`);

	      this.retry();
	    });
	  }

	  retry() {
	    this.stop();

	    if (this._player._options.retryCnt >= 0 && this._retryCnt > this._player._options.retryCnt) {
	      this._player._logger.warn('FetchStream', `fetch url ${this._player._options.url} finish because reach retryCnt, Cnt ${this._retryCnt} optionsCnt ${this._player._options.retryCnt}`);

	      this.emit('finish');
	      return;
	    }

	    this._player._logger.warn('FetchStream', `fetch url ${this._player._options.url} retry, start retry timer delay ${this._player._options.retryDelay} sec`);

	    this._abort = new AbortController();
	    this._retryTimer = setTimeout(() => {
	      this.start();
	    }, this._player._options.retryDelay * 1000);
	    this.emit('retry');
	  }

	  stop() {
	    if (this._abort) {
	      this._abort.abort();

	      this._abort = undefined;
	    }

	    if (this._retryTimer) {
	      clearTimeout(this._retryTimer);
	      this._retryTimer = undefined;
	    }
	  }

	  destroy() {
	    this.stop();
	    this.off();

	    this._player._logger.info('FetchStream', 'FetchStream destroy');
	  }

	}

	const JitterBufferStatus = {
	  notstart: 'notstart',
	  //未开始
	  bufferring: 'bufferring',
	  //开始，等待缓冲满
	  bufferReady: 'bufferReady' //buffer准备好了，可以播放了

	};
	const delayScale = 5;

	class JitterBuffer extends eventemitter3 {
	  _vgop = [];
	  _agop = [];
	  _status = JitterBufferStatus.notstart;
	  _firstpacketts = undefined;
	  _firstts = undefined;
	  _player = undefined;
	  _playTimer = undefined;
	  _statisticTimer = undefined;

	  constructor(player) {
	    super();
	    this._player = player;
	    this._statisticTimer = setInterval(() => {
	      this._player._logger.info('jitterbuffer', `video packet ${this._vgop.length} audio packet ${this._agop.length}`);
	    }, 1000);
	    let sec = 10; // 100 fps

	    this._playTimer = setInterval(() => {
	      this.playTicket();
	    }, sec);

	    this._player._logger.info('jitterbuffer', `start play video timer ${1000 / sec} frames per second, delay ${this._player._options.delay}`);
	  }

	  reset() {
	    this._agop = [];
	    this._vgop = [];

	    if (this._playTimer) {
	      clearInterval(this._playTimer);
	      this._playTimer = undefined;
	    }

	    this._status = JitterBufferStatus.notstart;
	    this._firstpacketts = undefined;
	    this._firstts = undefined;
	  }

	  destroy() {
	    this.reset();

	    if (this._statisticTimer) {
	      clearInterval(this._statisticTimer);
	    }

	    this.off();

	    this._player._logger.info('JitterBuffer', 'JitterBuffer destroy');
	  }

	  playTicket() {
	    if (this._status != JitterBufferStatus.bufferReady) {
	      return;
	    }

	    let now = new Date().getTime();

	    while (1) {
	      if (this._vgop.length < 1) {
	        break;
	      }

	      if (now - this._firstts < this._vgop[0].timestamp - this._firstpacketts) {
	        break;
	      }

	      let avpacket = this._vgop.shift();

	      this.emit('videopacket', avpacket);
	    }

	    while (1) {
	      if (this._agop.length < 1) {
	        break;
	      }

	      if (now - this._firstts < this._agop[0].timestamp - this._firstpacketts) {
	        break;
	      }

	      let avpacket = this._agop.shift();

	      this.emit('audiopacket', avpacket);
	    }

	    this.updateJitterBufferState();
	  }

	  pushAudio(avpacket) {
	    this._agop.push(avpacket);
	  }

	  pushVideo(avpacket) {
	    this._vgop.push(avpacket);

	    this.updateJitterBufferState();
	  }

	  updateJitterBufferState() {
	    let ret = true;

	    while (ret) {
	      ret = this.tryUpdateJitterBufferState();
	    }
	  }

	  tryUpdateJitterBufferState() {
	    let gop = this._vgop;

	    if (this._status === JitterBufferStatus.notstart) {
	      if (gop.length < 1) {
	        return false;
	      }

	      this._status = JitterBufferStatus.bufferring;
	      return true;
	    } else if (this._status === JitterBufferStatus.bufferring) {
	      if (gop.length < 2) {
	        this._player._logger.warn('jitterbuffer', `now buffering, but gop len [${gop.length}] less than 2,`);

	        return false;
	      }

	      if (gop[gop.length - 1].timestamp - gop[0].timestamp > this._player._options.delay) {
	        this._firstpacketts = gop[0].timestamp;
	        this._firstts = new Date().getTime();
	        this._status = JitterBufferStatus.bufferReady;

	        this._player._logger.info('jitterbuffer', `gop buffer ok, delay ${this._player._options.delay}, last[${gop[gop.length - 1].timestamp}] first[${gop[0].timestamp}] `);

	        return true;
	      }

	      return false;
	    } else if (this._status === JitterBufferStatus.bufferReady) {
	      if (gop.length < 1) {
	        this._player._logger.warn('jitterbuffer', `gop buffer is empty, restart buffering`);

	        this._status = JitterBufferStatus.bufferring;
	        return false;
	      }

	      this.tryDropFrames();
	      return false;
	    } else {
	      this._player._logger.error('jitterbuffer', `jittbuffer status [${this._status}]  error !!!`);
	    }

	    return false;
	  }

	  tryDropFrames() {
	    if (this._player._options.playMode !== 'live') {
	      //  this._player._logger.error('jitterbuffer',`not drop frame!!!`);
	      return;
	    } //  this._player._logger.error('jitterbuffer',`drop frame [${this._player._options.playMode}] !!!`);


	    let dropDelay = this._player._options.delay * delayScale;

	    if (this._vgop.length < 2) {
	      return;
	    }

	    if (this._vgop[this._vgop.length - 1].timestamp - this._vgop[0].timestamp < dropDelay) {
	      return;
	    }

	    let lastkeyindex = -1;

	    for (let i = 0; i < this._vgop.length; i++) {
	      let avpacket = this._vgop[i];

	      if (avpacket.iskeyframe) {
	        lastkeyindex = i;
	      }
	    }

	    if (lastkeyindex > 0) {
	      let ts = this._vgop[lastkeyindex].timestamp;
	      let lastaudioindex = -1;

	      this._player._logger.warn('jitterbuffer', `live stream store so much video frames, so discard video ${lastkeyindex} frames !!!`);

	      this._vgop = this._vgop.slice(lastkeyindex);

	      for (let j = 0; j < this._agop.length; j++) {
	        let avpacket = this._agop[j];

	        if (avpacket.timestamp < ts) {
	          lastaudioindex = j;
	        }
	      }

	      if (lastaudioindex >= 0) {
	        if (lastaudioindex + 1 >= this._agop.length) {
	          this._agop = [];
	        } else {
	          this._agop = this._agop.slice(lastaudioindex + 1);
	        }
	      }
	    }
	  }

	}

	// import decModule from './decoder/decoder'

	class WorkerCore {
	  _vDecoder = undefined;
	  _aDecoder = undefined;
	  _width = 0;
	  _height = 0;
	  _sampleRate = 0;
	  _channels = 0;
	  _samplesPerPacket = 0;
	  _options = undefined;
	  _gop = [];
	  _lastStatTs = undefined;
	  _useSpliteBuffer = false;
	  _spliteBuffer = undefined;
	  _logger = undefined;
	  _demuxer = undefined;
	  _stream = undefined;
	  _vframerate = 0;
	  _vbitrate = 0;
	  _aframerate = 0;
	  _abitrate = 0;
	  _yuvframerate = 0;
	  _yuvbitrate = 0;
	  _pcmframerate = 0;
	  _pcmbitrate = 0;
	  _statsec = 2;
	  _lastts;
	  _curpts;
	  _Module = undefined;
	  _jitterBuffer = undefined;

	  constructor(options, Module) {
	    this._Module = Module;
	    this._vDecoder = new this._Module.VideoDecoder(this);
	    this._aDecoder = new this._Module.AudioDecoder(this);
	    this._options = options;
	    this._logger = new Logger(); //  this._logger.setLogEnable(true);

	    this._demuxer = new FLVDemuxer(this); // demux stream to h264/h265 aac/pcmu/pcma

	    this._stream = new FetchStream(this); //get strem from remote

	    this._jitterBuffer = new JitterBuffer(this);
	    this.registerEvents();

	    this._stream.start();

	    this._lastStatTs = new Date().getTime();
	    this._stattimer = setInterval(() => {
	      let now = new Date().getTime();
	      let diff = (now - this._lastStatTs) / 1000;
	      this._lastStatTs = now;

	      this._logger.info('WCSTAT', `------ WORKER CORE STAT ${diff} ---------
                video gen framerate:${this._vframerate / diff} bitrate:${this._vbitrate * 8 / diff / 1024 / 1024}M
                audio gen framerate:${this._aframerate / diff} bitrate:${this._abitrate * 8 / diff}
                yuv   gen framerate:${this._yuvframerate / diff} bitrate:${this._yuvbitrate * 8 / diff}
                pcm   gen framerate:${this._pcmframerate / diff} bitrate:${this._pcmbitrate * 8 / diff}
                `);

	      this._vframerate = 0;
	      this._vbitrate = 0;
	      this._aframerate = 0;
	      this._abitrate = 0;
	      this._yuvframerate = 0;
	      this._yuvbitrate = 0;
	      this._pcmframerate = 0;
	      this._pcmbitrate = 0;
	    }, this._statsec * 1000);
	  }

	  registerEvents() {
	    this._logger.info('WorkerCore', `now play ${this._options.url}`);

	    this._stream.on('finish', () => {});

	    this._stream.on('retry', () => {
	      this.reset();
	      postMessage({
	        cmd: WORKER_EVENT_TYPE.reseted
	      });
	    });

	    this._stream.on('data', data => {
	      this._demuxer.dispatch(data);
	    });

	    this._demuxer.on('videoinfo', videoinfo => {
	      this._logger.info('WorkerCore', `demux video info vtype:${videoinfo.vtype} width:${videoinfo.width} hight:${videoinfo.height}`);

	      this._vDecoder.setCodec(videoinfo.vtype, videoinfo.extradata);
	    });

	    this._demuxer.on('audioinfo', audioinfo => {
	      this._logger.info('WorkerCore', `demux audio info atype:${audioinfo.atype} sample:${audioinfo.sample} channels:${audioinfo.channels} depth:${audioinfo.depth} aacprofile:${audioinfo.profile}`);

	      this._aDecoder.setCodec(audioinfo.atype, audioinfo.extradata);
	    });

	    this._demuxer.on('videodata', packet => {
	      this._vframerate++;
	      this._vbitrate += packet.payload.length;
	      packet.timestamp = this.adjustTime(packet.timestamp);

	      this._jitterBuffer.pushVideo(packet);
	    });

	    this._demuxer.on('audiodata', packet => {
	      this._aframerate++;
	      this._abitrate += packet.payload.length;
	      packet.timestamp = this.adjustTime(packet.timestamp);

	      this._jitterBuffer.pushAudio(packet);
	    });

	    this._jitterBuffer.on('videopacket', packet => {
	      this._vDecoder.decode(packet.payload, packet.iskeyframe ? 1 : 0, packet.timestamp);
	    });

	    this._jitterBuffer.on('audiopacket', packet => {
	      this._aDecoder.decode(packet.payload, packet.timestamp);
	    });
	  }

	  destroy() {
	    this.reset();

	    this._aDecoder.clear();

	    this._vDecoder.clear();

	    this._aDecoder = undefined;
	    this._vDecoder = undefined;

	    this._stream.destroy();

	    this._demuxer.destroy();

	    this._jitterBuffer.destroy();

	    clearInterval(this._stattimer);

	    this._logger.info('WorkerCore', `WorkerCore destroy`);
	  }

	  reset() {
	    this._logger.info('WorkerCore', `work thiread reset, clear gop buffer & reset all Params`);

	    this._gop = [];
	    this._lastts = 0;
	    this._useSpliteBuffer = false;
	    this._spliteBuffer = undefined;
	    this._width = 0;
	    this._height = 0;
	    this._sampleRate = 0;
	    this._channels = 0;
	    this.samplesPerPacket = 0;

	    this._demuxer.reset();

	    this._jitterBuffer.reset();
	  }

	  setVideoCodec(vtype, extradata) {
	    this._vDecoder.setCodec(vtype, extradata);
	  }

	  setAudioCodec(atype, extradata) {
	    this._aDecoder.setCodec(atype, extradata);
	  } //callback


	  videoInfo(vtype, width, height) {
	    this._width = width;
	    this._height = height;
	    postMessage({
	      cmd: WORKER_EVENT_TYPE.videoInfo,
	      vtype,
	      width,
	      height
	    });
	  }

	  yuvData(yuv, timestamp) {
	    //    this._logger.info('WorkerCore', `yuvdata timestamp ${timestamp}`);
	    let size = this._width * this._height * 3 / 2;

	    let out = this._Module.HEAPU8.subarray(yuv, yuv + size);

	    let data = Uint8Array.from(out);
	    this._yuvframerate++;
	    this._yuvbitrate += data.length;
	    postMessage({
	      cmd: WORKER_EVENT_TYPE.yuvData,
	      data,
	      width: this._width,
	      height: this._height,
	      timestamp
	    }, [data.buffer]);
	  }

	  audioInfo(atype, sampleRate, channels) {
	    this._sampleRate = sampleRate;
	    this._channels = channels;
	    this._samplesPerPacket = caculateSamplesPerPacket();
	    postMessage({
	      cmd: WORKER_EVENT_TYPE.audioInfo,
	      atype,
	      sampleRate,
	      channels,
	      samplesPerPacket: this._samplesPerPacket
	    });
	  }

	  adjustTime(timestamp) {
	    if (!this._lastts) {
	      this._lastts = timestamp;
	      this._curpts = 10000;
	    } else {
	      let diff = timestamp - this._lastts;

	      if (diff < -3000) {
	        this._logger.warn('WorkerCore', `now ts ${timestamp}  - lastts ${this._lastts} < -1000, adjust now pts ${this._curpts}`);

	        this._curpts -= 25;
	        this._lastts = timestamp;
	      } else if (diff > 3000) {
	        this._logger.warn('WorkerCore', `now ts ${timestamp}  - lastts ${this._lastts} > 1000, now pts ${this._curpts}`);

	        this._curpts += diff;
	        this._lastts = timestamp;
	      } else {
	        this._curpts += diff;
	        this._lastts = timestamp;
	      }
	    }

	    return this._curpts;
	  }

	  pcmData(pcmDataArray, samples, timestamp) {
	    //     this._logger.info('WorkerCore', `pcmData samples ${samples} timestamp${timestamp}`);
	    let datas = [];
	    this._pcmframerate++;

	    for (let i = 0; i < this._channels; i++) {
	      var fp = this._Module.HEAPU32[(pcmDataArray >> 2) + i] >> 2;
	      datas.push(Float32Array.of(...this._Module.HEAPF32.subarray(fp, fp + samples)));
	      this._pcmbitrate += datas[i].length * 4;
	    }

	    if (!this._useSpliteBuffer) {
	      if (samples === this._samplesPerPacket) {
	        postMessage({
	          cmd: WORKER_EVENT_TYPE.pcmData,
	          datas,
	          timestamp
	        }, datas.map(x => x.buffer));
	        return;
	      }

	      this._spliteBuffer = new SpliteBuffer(this._sampleRate, this._channels, this._samplesPerPacket);
	      this._useSpliteBuffer = true;
	    }

	    this._spliteBuffer.addBuffer(datas, timestamp);

	    this._spliteBuffer.splite((buffers, ts) => {
	      postMessage({
	        cmd: WORKER_EVENT_TYPE.pcmData,
	        datas: buffers,
	        timestamp: ts
	      }, buffers.map(x => x.buffer));
	    });
	  }

	}

	function workerPostRun(Module) {
	  console.log('avplayer: worker start');
	  let workerCore = undefined; //recv msg from main thread

	  self.onmessage = function (event) {
	    var msg = event.data;

	    switch (msg.cmd) {
	      case WORKER_SEND_TYPE.init:
	        {
	          workerCore = new WorkerCore(JSON.parse(msg.options), Module);
	          postMessage({
	            cmd: WORKER_EVENT_TYPE.inited
	          });
	          break;
	        }

	      case WORKER_SEND_TYPE.destroy:
	        {
	          workerCore.destroy();
	          workerCore = undefined;
	          postMessage({
	            cmd: WORKER_EVENT_TYPE.destroyed
	          });
	          break;
	        }
	    }
	  }; // notify main thread after worker thread  init completely


	  postMessage({
	    cmd: WORKER_EVENT_TYPE.created
	  });
	}

	decoder_simd_2.postRun = () => {
	  workerPostRun(decoder_simd_2);
	};

}));
//# sourceMappingURL=worker_simd_2.js.map
