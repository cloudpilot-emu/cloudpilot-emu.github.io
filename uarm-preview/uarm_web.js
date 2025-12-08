var createModule = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;
  return (
async function(moduleArg = {}) {
  var moduleRtn;

// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != 'undefined';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == 'object' && process.versions?.node && process.type != 'renderer';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

if (ENVIRONMENT_IS_WORKER) {
  _scriptName = self.location.href;
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL('.', _scriptName).href; // includes trailing slash
  } catch {
    // Must be a `blob:` or `data:` URL (e.g. `blob:http://site.com/etc/etc`), we cannot
    // infer anything from them.
  }

  {
// include: web_or_worker_shell_read.js
if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = async (url) => {
    var response = await fetch(url, { credentials: 'same-origin' });
    if (response.ok) {
      return response.arrayBuffer();
    }
    throw new Error(response.status + ' : ' + response.url);
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
}

var out = console.log.bind(console);
var err = console.error.bind(console);

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;

// Wasm globals

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    // This build was created without ASSERTIONS defined.  `assert()` should not
    // ever be called in this configuration but in case there are callers in
    // the wild leave this simple abort() implementation here for now.
    abort(text);
  }
}

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');

// include: runtime_common.js
// include: runtime_stack_check.js
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
var readyPromiseResolve, readyPromiseReject;

// Memory management

var wasmMemory;

var
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

// BigInt64Array type is not correctly defined in closure
var
/** not-@type {!BigInt64Array} */
  HEAP64,
/* BigUint64Array type is not correctly defined in closure
/** not-@type {!BigUint64Array} */
  HEAPU64;

var runtimeInitialized = false;



function updateMemoryViews() {
  var b = wasmMemory.buffer;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  HEAP32 = new Int32Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
  // End ATPRERUNS hooks
}

function initRuntime() {
  runtimeInitialized = true;

  // Begin ATINITS hooks
  callRuntimeCallbacks(onInits);
  // End ATINITS hooks

  wasmExports['__wasm_call_ctors']();

  // No ATPOSTCTORS hooks
}

function preMain() {
  // No ATMAINS hooks
}

function postRun() {
   // PThreads reuse the runtime from the main thread.

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
  // End ATPOSTRUNS hooks
}

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function addRunDependency(id) {
  runDependencies++;

  Module['monitorRunDependencies']?.(runDependencies);

}

function removeRunDependency(id) {
  runDependencies--;

  Module['monitorRunDependencies']?.(runDependencies);

  if (runDependencies == 0) {
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  Module['onAbort']?.(what);

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  what += '. Build with -sASSERTIONS for more info.';

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject?.(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

var wasmBinaryFile;

function findWasmBinary() {
    return locateFile('uarm_web.wasm');
}

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw 'both async and sync fetching of the wasm failed';
}

async function getWasmBinary(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary) {
    // Fetch the binary using readAsync
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {
      // Fall back to getBinarySync below;
    }
  }

  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  if (!binary && typeof WebAssembly.instantiateStreaming == 'function'
     ) {
    try {
      var response = fetch(binaryFile, { credentials: 'same-origin' });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
      // We expect the most common failure cause to be a bad MIME type for the binary,
      // in which case falling back to ArrayBuffer instantiation should work.
      err(`wasm streaming compile failed: ${reason}`);
      err('falling back to ArrayBuffer instantiation');
      // fall back of instantiateArrayBuffer below
    };
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  // prepare imports
  return {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  }
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    

    wasmMemory = wasmExports['memory'];
    
    updateMemoryViews();

    wasmTable = wasmExports['__indirect_function_table'];
    Module['wasmTable'] = wasmTable;

    assignWasmExports(wasmExports);
    removeRunDependency('wasm-instantiate');
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    return receiveInstance(result['instance']);
  }

  var info = getWasmImports();

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {
    return new Promise((resolve, reject) => {
        Module['instantiateWasm'](info, (mod, inst) => {
          resolve(receiveInstance(mod, inst));
        });
    });
  }

  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js

// Begin JS library code


  class ExitStatus {
      name = 'ExitStatus';
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };
  var onPostRuns = [];
  var addOnPostRun = (cb) => onPostRuns.push(cb);

  var onPreRuns = [];
  var addOnPreRun = (cb) => onPreRuns.push(cb);


  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP64[((ptr)>>3)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = true;

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': HEAP64[((ptr)>>3)] = BigInt(value); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder() : undefined;
  
    /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number=} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.  Also, use the length info to avoid running tiny
      // strings through TextDecoder, since .subarray() allocates garbage.
      // (As a tiny code save trick, compare endPtr against endIdx using a negation,
      // so that undefined/NaN means Infinity)
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  
      // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      // If building with TextDecoder, we have already computed the string length
      // above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
  var UTF8ToString = (ptr, maxBytesToRead) => {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
  var ___assert_fail = (condition, filename, line, func) =>
      abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);

  var INT53_MAX = 9007199254740992;
  
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);
  function ___syscall_ftruncate64(fd, length) {
    length = bigintToI53Checked(length);
  
  
  ;
  }

  var __abort_js = () =>
      abort('');

  var runtimeKeepaliveCounter = 0;
  var __emscripten_runtime_keepalive_clear = () => {
      noExitRuntime = false;
      runtimeKeepaliveCounter = 0;
    };

  var isLeapYear = (year) => year%4 === 0 && (year%100 !== 0 || year%400 === 0);
  
  var MONTH_DAYS_LEAP_CUMULATIVE = [0,31,60,91,121,152,182,213,244,274,305,335];
  
  var MONTH_DAYS_REGULAR_CUMULATIVE = [0,31,59,90,120,151,181,212,243,273,304,334];
  var ydayFromDate = (date) => {
      var leap = isLeapYear(date.getFullYear());
      var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
      var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1; // -1 since it's days since Jan 1
  
      return yday;
    };
  
  function __localtime_js(time, tmPtr) {
    time = bigintToI53Checked(time);
  
  
      var date = new Date(time*1000);
      HEAP32[((tmPtr)>>2)] = date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)] = date.getDay();
  
      var yday = ydayFromDate(date)|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
      HEAP32[(((tmPtr)+(36))>>2)] = -(date.getTimezoneOffset() * 60);
  
      // Attention: DST is in December in South, and some regions don't have DST at all.
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
      HEAP32[(((tmPtr)+(32))>>2)] = dst;
    ;
  }

  
  var __mktime_js = function(tmPtr) {
  
  var ret = (() => { 
      var date = new Date(HEAP32[(((tmPtr)+(20))>>2)] + 1900,
                          HEAP32[(((tmPtr)+(16))>>2)],
                          HEAP32[(((tmPtr)+(12))>>2)],
                          HEAP32[(((tmPtr)+(8))>>2)],
                          HEAP32[(((tmPtr)+(4))>>2)],
                          HEAP32[((tmPtr)>>2)],
                          0);
  
      // There's an ambiguous hour when the time goes back; the tm_isdst field is
      // used to disambiguate it.  Date() basically guesses, so we fix it up if it
      // guessed wrong, or fill in tm_isdst with the guess if it's -1.
      var dst = HEAP32[(((tmPtr)+(32))>>2)];
      var guessedOffset = date.getTimezoneOffset();
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dstOffset = Math.min(winterOffset, summerOffset); // DST is in December in South
      if (dst < 0) {
        // Attention: some regions don't have DST at all.
        HEAP32[(((tmPtr)+(32))>>2)] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
      } else if ((dst > 0) != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
        date.setTime(date.getTime() + (trueOffset - guessedOffset)*60000);
      }
  
      HEAP32[(((tmPtr)+(24))>>2)] = date.getDay();
      var yday = ydayFromDate(date)|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
      // To match expected behavior, update fields from date
      HEAP32[((tmPtr)>>2)] = date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getYear();
  
      var timeMs = date.getTime();
      if (isNaN(timeMs)) {
        return -1;
      }
      // Return time in microseconds
      return timeMs / 1000;
     })();
  return BigInt(ret);
  };

  var timers = {
  };
  
  var handleException = (e) => {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      quit_(1, e);
    };
  
  
  var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
  var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        Module['onExit']?.(code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };
  /** @suppress {duplicate } */
  /** @param {boolean|number=} implicit */
  var exitJS = (status, implicit) => {
      EXITSTATUS = status;
  
      _proc_exit(status);
    };
  var _exit = exitJS;
  
  
  var maybeExit = () => {
      if (!keepRuntimeAlive()) {
        try {
          _exit(EXITSTATUS);
        } catch (e) {
          handleException(e);
        }
      }
    };
  var callUserCallback = (func) => {
      if (ABORT) {
        return;
      }
      try {
        func();
        maybeExit();
      } catch (e) {
        handleException(e);
      }
    };
  
  
  var _emscripten_get_now = () => performance.now();
  var __setitimer_js = (which, timeout_ms) => {
      // First, clear any existing timer.
      if (timers[which]) {
        clearTimeout(timers[which].id);
        delete timers[which];
      }
  
      // A timeout of zero simply cancels the current timeout so we have nothing
      // more to do.
      if (!timeout_ms) return 0;
  
      var id = setTimeout(() => {
        delete timers[which];
        callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
      }, timeout_ms);
      timers[which] = { id, timeout_ms };
      return 0;
    };

  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.codePointAt(i);
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
          // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
          // We need to manually skip over the second code unit for correct iteration.
          i++;
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  var __tzset_js = (timezone, daylight, std_name, dst_name) => {
      // TODO: Use (malleable) environment variables instead of system settings.
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
  
      // Local standard timezone offset. Local standard time is not adjusted for
      // daylight savings.  This code uses the fact that getTimezoneOffset returns
      // a greater value during Standard Time versus Daylight Saving Time (DST).
      // Thus it determines the expected output during Standard Time, and it
      // compares whether the output of the given date the same (Standard) or less
      // (DST).
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  
      // timezone is specified as seconds west of UTC ("The external variable
      // `timezone` shall be set to the difference, in seconds, between
      // Coordinated Universal Time (UTC) and local standard time."), the same
      // as returned by stdTimezoneOffset.
      // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
      HEAPU32[((timezone)>>2)] = stdTimezoneOffset * 60;
  
      HEAP32[((daylight)>>2)] = Number(winterOffset != summerOffset);
  
      var extractZone = (timezoneOffset) => {
        // Why inverse sign?
        // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
        var sign = timezoneOffset >= 0 ? "-" : "+";
  
        var absOffset = Math.abs(timezoneOffset)
        var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
        var minutes = String(absOffset % 60).padStart(2, "0");
  
        return `UTC${sign}${hours}${minutes}`;
      }
  
      var winterName = extractZone(winterOffset);
      var summerName = extractZone(summerOffset);
      if (summerOffset < winterOffset) {
        // Northern hemisphere
        stringToUTF8(winterName, std_name, 17);
        stringToUTF8(summerName, dst_name, 17);
      } else {
        stringToUTF8(winterName, dst_name, 17);
        stringToUTF8(summerName, std_name, 17);
      }
    };

  
  var _emscripten_date_now = () => Date.now();
  
  var nowIsMonotonic = 1;
  
  var checkWasiClock = (clock_id) => clock_id >= 0 && clock_id <= 3;
  
  function _clock_time_get(clk_id, ignored_precision, ptime) {
    ignored_precision = bigintToI53Checked(ignored_precision);
  
  
      if (!checkWasiClock(clk_id)) {
        return 28;
      }
      var now;
      // all wasi clocks but realtime are monotonic
      if (clk_id === 0) {
        now = _emscripten_date_now();
      } else if (nowIsMonotonic) {
        now = _emscripten_get_now();
      } else {
        return 52;
      }
      // "now" is in ms, and wasi times are in ns.
      var nsec = Math.round(now * 1000 * 1000);
      HEAP64[((ptime)>>3)] = BigInt(nsec);
      return 0;
    ;
  }

  var readEmAsmArgsArray = [];
  var readEmAsmArgs = (sigPtr, buf) => {
      readEmAsmArgsArray.length = 0;
      var ch;
      // Most arguments are i32s, so shift the buffer pointer so it is a plain
      // index into HEAP32.
      while (ch = HEAPU8[sigPtr++]) {
        // Floats are always passed as doubles, so all types except for 'i'
        // are 8 bytes and require alignment.
        var wide = (ch != 105);
        wide &= (ch != 112);
        buf += wide && (buf % 8) ? 4 : 0;
        readEmAsmArgsArray.push(
          // Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
          ch == 112 ? HEAPU32[((buf)>>2)] :
          ch == 106 ? HEAP64[((buf)>>3)] :
          ch == 105 ?
            HEAP32[((buf)>>2)] :
            HEAPF64[((buf)>>3)]
        );
        buf += wide ? 8 : 4;
      }
      return readEmAsmArgsArray;
    };
  var runEmAsmFunction = (code, sigPtr, argbuf) => {
      var args = readEmAsmArgs(sigPtr, argbuf);
      return ASM_CONSTS[code](...args);
    };
  var _emscripten_asm_const_int = (code, sigPtr, argbuf) => {
      return runEmAsmFunction(code, sigPtr, argbuf);
    };


  var getHeapMax = () =>
      // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
      // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
      // for any code that deals with heap sizes, which would require special
      // casing all heap size related code to treat 0 specially.
      2147483648;
  
  var alignMemory = (size, alignment) => {
      return Math.ceil(size / alignment) * alignment;
    };
  
  var growMemory = (size) => {
      var b = wasmMemory.buffer;
      var pages = ((size - b.byteLength + 65535) / 65536) | 0;
      try {
        // round size grow request up to wasm page size (fixed 64KB per spec)
        wasmMemory.grow(pages); // .grow() takes a delta compared to the previous size
        updateMemoryViews();
        return 1 /*success*/;
      } catch(e) {
      }
      // implicit 0 return to save code size (caller will cast "undefined" into 0
      // anyhow)
    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      // With multithreaded builds, races can happen (another thread might increase the size
      // in between), so return a failure, and let the caller retry.
  
      // Memory resize rules:
      // 1.  Always increase heap size to at least the requested size, rounded up
      //     to next page multiple.
      // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
      //     geometrically: increase the heap size according to
      //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
      //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
      // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
      //     linearly: increase the heap size by at least
      //     MEMORY_GROWTH_LINEAR_STEP bytes.
      // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
      //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
      // 4.  If we were unable to allocate as much memory, it may be due to
      //     over-eager decision to excessively reserve due to (3) above.
      //     Hence if an allocation fails, cut down on the amount of excess
      //     growth, in an attempt to succeed to perform a smaller allocation.
  
      // A limit is set for how much we can grow. We should not exceed that
      // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
  
      // Loop through potential heap size increases. If we attempt a too eager
      // reservation that fails, cut down on the attempted size and reserve a
      // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
        // but limit overreserving (default to capping at +96MB overgrowth at most)
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );
  
        var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
  
        var replacement = growMemory(newSize);
        if (replacement) {
  
          return true;
        }
      }
      return false;
    };

  var ENV = {
  };
  
  var getExecutableName = () => thisProgram || './this.program';
  var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        // Default values.
        // Browser language detection #8751
        var lang = ((typeof navigator == 'object' && navigator.language) || 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          // x is a key in ENV; if ENV[x] is undefined, that means it was
          // explicitly set to be so. We allow user code to do that to
          // force variables with default values to remain unset.
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
  
  var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      var envp = 0;
      for (var string of getEnvStrings()) {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(envp))>>2)] = ptr;
        bufSize += stringToUTF8(string, ptr, Infinity) + 1;
        envp += 4;
      }
      return 0;
    };

  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      for (var string of strings) {
        bufSize += lengthBytesUTF8(string) + 1;
      }
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    };

  var _fd_close = (fd) => {
      return 52;
    };

  var _fd_read = (fd, iov, iovcnt, pnum) => {
      return 52;
    };

  function _fd_seek(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
  
  
      return 70;
    ;
  }

  var printCharBuffers = [null,[],[]];
  
  var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream];
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };
  
  var flush_NO_FILESYSTEM = () => {
      // flush anything remaining in the buffers during shutdown
      if (printCharBuffers[1].length) printChar(1, 10);
      if (printCharBuffers[2].length) printChar(2, 10);
    };
  
  
  var SYSCALLS = {
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  var _fd_write = (fd, iov, iovcnt, pnum) => {
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    };




  
  /** @type {function(string, boolean=, number=)} */
  var intArrayFromString = (stringy, dontAddNull, length) => {
      var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    };



  var onInits = [];
  var addOnInit = (cb) => onInits.push(cb);

  /** @type {WebAssembly.Table} */
  var wasmTable;
// End JS library code

// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.

{

  // Begin ATMODULES hooks
  if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];
if (Module['print']) out = Module['print'];
if (Module['printErr']) err = Module['printErr'];
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
  // End ATMODULES hooks

  if (Module['arguments']) arguments_ = Module['arguments'];
  if (Module['thisProgram']) thisProgram = Module['thisProgram'];

}

// Begin runtime exports
  Module['callMain'] = callMain;
  Module['wasmTable'] = wasmTable;
  // End runtime exports
  // Begin JS library exports
  // End JS library exports

// end include: postlibrary.js

var ASM_CONSTS = {
  72350: ($0) => { wasmTable.grow(0x10000); for (let i = 0; i <= 0xffff; i++) wasmTable.set(wasmTable.length - 0xffff - 1 + i, wasmTable.get(HEAPU32[($0 >>> 2) + i])); return wasmTable.length - 0xffff - 1; }
};
function __emscripten_abort() { throw new Error("emulator terminated"); }

// Imports from the Wasm binary.
var _main,
  _webidl_free,
  _webidl_malloc,
  _emscripten_bind_VoidPtr___destroy___0,
  _emscripten_bind_Uarm_Uarm_0,
  _emscripten_bind_Uarm_SetRamSize_1,
  _emscripten_bind_Uarm_SetNand_2,
  _emscripten_bind_Uarm_SetMemory_2,
  _emscripten_bind_Uarm_SetSavestate_2,
  _emscripten_bind_Uarm_SetSd_3,
  _emscripten_bind_Uarm_SetDefaultMips_1,
  _emscripten_bind_Uarm_Launch_2,
  _emscripten_bind_Uarm_Cycle_1,
  _emscripten_bind_Uarm_GetFrame_0,
  _emscripten_bind_Uarm_ResetFrame_0,
  _emscripten_bind_Uarm_GetTimesliceSizeUsec_0,
  _emscripten_bind_Uarm_PenDown_2,
  _emscripten_bind_Uarm_PenUp_0,
  _emscripten_bind_Uarm_CurrentIps_0,
  _emscripten_bind_Uarm_CurrentIpsMax_0,
  _emscripten_bind_Uarm_SetMaxLoad_1,
  _emscripten_bind_Uarm_SetCyclesPerSecondLimit_1,
  _emscripten_bind_Uarm_GetTimestampUsec_0,
  _emscripten_bind_Uarm_KeyDown_1,
  _emscripten_bind_Uarm_KeyUp_1,
  _emscripten_bind_Uarm_PendingSamples_0,
  _emscripten_bind_Uarm_PopQueuedSamples_0,
  _emscripten_bind_Uarm_GetSampleQueueSize_0,
  _emscripten_bind_Uarm_SetPcmOutputEnabled_1,
  _emscripten_bind_Uarm_SetPcmSuspended_1,
  _emscripten_bind_Uarm_GetRomDataSize_0,
  _emscripten_bind_Uarm_GetRomData_0,
  _emscripten_bind_Uarm_GetNandDataSize_0,
  _emscripten_bind_Uarm_GetNandData_0,
  _emscripten_bind_Uarm_GetNandDirtyPages_0,
  _emscripten_bind_Uarm_IsNandDirty_0,
  _emscripten_bind_Uarm_SetNandDirty_1,
  _emscripten_bind_Uarm_GetSdCardDataSize_0,
  _emscripten_bind_Uarm_GetSdCardData_0,
  _emscripten_bind_Uarm_GetSdCardDirtyPages_0,
  _emscripten_bind_Uarm_IsSdCardDirty_0,
  _emscripten_bind_Uarm_SetSdCardDirty_1,
  _emscripten_bind_Uarm_GetMemoryDataSize_0,
  _emscripten_bind_Uarm_GetMemoryData_0,
  _emscripten_bind_Uarm_GetMemoryDirtyPages_0,
  _emscripten_bind_Uarm_GetDeviceType_0,
  _emscripten_bind_Uarm_SdCardInsert_3,
  _emscripten_bind_Uarm_SdCardEject_0,
  _emscripten_bind_Uarm_SdCardInitialized_0,
  _emscripten_bind_Uarm_GetSdCardId_0,
  _emscripten_bind_Uarm_Reset_0,
  _emscripten_bind_Uarm_Save_0,
  _emscripten_bind_Uarm_GetSavestateSize_0,
  _emscripten_bind_Uarm_GetSavestateData_0,
  _emscripten_bind_Uarm_IsSdInserted_0,
  _emscripten_bind_Uarm_GetRamSize_0,
  _emscripten_bind_Uarm_JamKey_2,
  _emscripten_bind_Uarm_IsUiInitialized_0,
  _emscripten_bind_Uarm_IsOsVersionSet_0,
  _emscripten_bind_Uarm_GetOsVersion_0,
  _emscripten_bind_Uarm_IsLcdEnabled_0,
  _emscripten_bind_Uarm_InstallDatabase_2,
  _emscripten_bind_Uarm_NewDbBackup_1,
  _emscripten_bind_Uarm___destroy___0,
  _emscripten_bind_DbBackup_Init_0,
  _emscripten_bind_DbBackup_GetState_0,
  _emscripten_bind_DbBackup_Continue_0,
  _emscripten_bind_DbBackup_HasLastProcessedDb_0,
  _emscripten_bind_DbBackup_GetLastProcessedDb_0,
  _emscripten_bind_DbBackup_GetArchiveData_0,
  _emscripten_bind_DbBackup_GetArchiveSize_0,
  _emscripten_bind_DbBackup___destroy___0,
  _emscripten_bind_Bridge_Bridge_0,
  _emscripten_bind_Bridge_Malloc_1,
  _emscripten_bind_Bridge_Free_1,
  _emscripten_bind_Bridge___destroy___0,
  _emscripten_bind_SessionFile5_SessionFile5_0,
  _emscripten_bind_SessionFile5_IsSessionFile_2,
  _emscripten_bind_SessionFile5_GetDeviceId_0,
  _emscripten_bind_SessionFile5_SetDeviceId_1,
  _emscripten_bind_SessionFile5_GetMetadata_0,
  _emscripten_bind_SessionFile5_GetMetadataSize_0,
  _emscripten_bind_SessionFile5_SetMetadata_2,
  _emscripten_bind_SessionFile5_GetNor_0,
  _emscripten_bind_SessionFile5_GetNorSize_0,
  _emscripten_bind_SessionFile5_SetNor_2,
  _emscripten_bind_SessionFile5_GetNand_0,
  _emscripten_bind_SessionFile5_GetNandSize_0,
  _emscripten_bind_SessionFile5_SetNand_2,
  _emscripten_bind_SessionFile5_GetMemory_0,
  _emscripten_bind_SessionFile5_GetMemorySize_0,
  _emscripten_bind_SessionFile5_SetMemory_2,
  _emscripten_bind_SessionFile5_GetSavestate_0,
  _emscripten_bind_SessionFile5_GetSavestateSize_0,
  _emscripten_bind_SessionFile5_SetSavestate_2,
  _emscripten_bind_SessionFile5_GetRamSize_0,
  _emscripten_bind_SessionFile5_SetRamSize_1,
  _emscripten_bind_SessionFile5_Serialize_0,
  _emscripten_bind_SessionFile5_GetSerializedSession_0,
  _emscripten_bind_SessionFile5_GetSerializedSessionSize_0,
  _emscripten_bind_SessionFile5_GetVersion_0,
  _emscripten_bind_SessionFile5_Deserialize_2,
  _emscripten_bind_SessionFile5___destroy___0,
  __emscripten_timeout,
  __emscripten_stack_restore,
  __emscripten_stack_alloc,
  _emscripten_stack_get_current,
  ___cxa_increment_exception_refcount;


function assignWasmExports(wasmExports) {
  Module['_main'] = _main = wasmExports['main'];
  Module['_webidl_free'] = _webidl_free = wasmExports['webidl_free'];
  Module['_webidl_malloc'] = _webidl_malloc = wasmExports['webidl_malloc'];
  Module['_emscripten_bind_VoidPtr___destroy___0'] = _emscripten_bind_VoidPtr___destroy___0 = wasmExports['emscripten_bind_VoidPtr___destroy___0'];
  Module['_emscripten_bind_Uarm_Uarm_0'] = _emscripten_bind_Uarm_Uarm_0 = wasmExports['emscripten_bind_Uarm_Uarm_0'];
  Module['_emscripten_bind_Uarm_SetRamSize_1'] = _emscripten_bind_Uarm_SetRamSize_1 = wasmExports['emscripten_bind_Uarm_SetRamSize_1'];
  Module['_emscripten_bind_Uarm_SetNand_2'] = _emscripten_bind_Uarm_SetNand_2 = wasmExports['emscripten_bind_Uarm_SetNand_2'];
  Module['_emscripten_bind_Uarm_SetMemory_2'] = _emscripten_bind_Uarm_SetMemory_2 = wasmExports['emscripten_bind_Uarm_SetMemory_2'];
  Module['_emscripten_bind_Uarm_SetSavestate_2'] = _emscripten_bind_Uarm_SetSavestate_2 = wasmExports['emscripten_bind_Uarm_SetSavestate_2'];
  Module['_emscripten_bind_Uarm_SetSd_3'] = _emscripten_bind_Uarm_SetSd_3 = wasmExports['emscripten_bind_Uarm_SetSd_3'];
  Module['_emscripten_bind_Uarm_SetDefaultMips_1'] = _emscripten_bind_Uarm_SetDefaultMips_1 = wasmExports['emscripten_bind_Uarm_SetDefaultMips_1'];
  Module['_emscripten_bind_Uarm_Launch_2'] = _emscripten_bind_Uarm_Launch_2 = wasmExports['emscripten_bind_Uarm_Launch_2'];
  Module['_emscripten_bind_Uarm_Cycle_1'] = _emscripten_bind_Uarm_Cycle_1 = wasmExports['emscripten_bind_Uarm_Cycle_1'];
  Module['_emscripten_bind_Uarm_GetFrame_0'] = _emscripten_bind_Uarm_GetFrame_0 = wasmExports['emscripten_bind_Uarm_GetFrame_0'];
  Module['_emscripten_bind_Uarm_ResetFrame_0'] = _emscripten_bind_Uarm_ResetFrame_0 = wasmExports['emscripten_bind_Uarm_ResetFrame_0'];
  Module['_emscripten_bind_Uarm_GetTimesliceSizeUsec_0'] = _emscripten_bind_Uarm_GetTimesliceSizeUsec_0 = wasmExports['emscripten_bind_Uarm_GetTimesliceSizeUsec_0'];
  Module['_emscripten_bind_Uarm_PenDown_2'] = _emscripten_bind_Uarm_PenDown_2 = wasmExports['emscripten_bind_Uarm_PenDown_2'];
  Module['_emscripten_bind_Uarm_PenUp_0'] = _emscripten_bind_Uarm_PenUp_0 = wasmExports['emscripten_bind_Uarm_PenUp_0'];
  Module['_emscripten_bind_Uarm_CurrentIps_0'] = _emscripten_bind_Uarm_CurrentIps_0 = wasmExports['emscripten_bind_Uarm_CurrentIps_0'];
  Module['_emscripten_bind_Uarm_CurrentIpsMax_0'] = _emscripten_bind_Uarm_CurrentIpsMax_0 = wasmExports['emscripten_bind_Uarm_CurrentIpsMax_0'];
  Module['_emscripten_bind_Uarm_SetMaxLoad_1'] = _emscripten_bind_Uarm_SetMaxLoad_1 = wasmExports['emscripten_bind_Uarm_SetMaxLoad_1'];
  Module['_emscripten_bind_Uarm_SetCyclesPerSecondLimit_1'] = _emscripten_bind_Uarm_SetCyclesPerSecondLimit_1 = wasmExports['emscripten_bind_Uarm_SetCyclesPerSecondLimit_1'];
  Module['_emscripten_bind_Uarm_GetTimestampUsec_0'] = _emscripten_bind_Uarm_GetTimestampUsec_0 = wasmExports['emscripten_bind_Uarm_GetTimestampUsec_0'];
  Module['_emscripten_bind_Uarm_KeyDown_1'] = _emscripten_bind_Uarm_KeyDown_1 = wasmExports['emscripten_bind_Uarm_KeyDown_1'];
  Module['_emscripten_bind_Uarm_KeyUp_1'] = _emscripten_bind_Uarm_KeyUp_1 = wasmExports['emscripten_bind_Uarm_KeyUp_1'];
  Module['_emscripten_bind_Uarm_PendingSamples_0'] = _emscripten_bind_Uarm_PendingSamples_0 = wasmExports['emscripten_bind_Uarm_PendingSamples_0'];
  Module['_emscripten_bind_Uarm_PopQueuedSamples_0'] = _emscripten_bind_Uarm_PopQueuedSamples_0 = wasmExports['emscripten_bind_Uarm_PopQueuedSamples_0'];
  Module['_emscripten_bind_Uarm_GetSampleQueueSize_0'] = _emscripten_bind_Uarm_GetSampleQueueSize_0 = wasmExports['emscripten_bind_Uarm_GetSampleQueueSize_0'];
  Module['_emscripten_bind_Uarm_SetPcmOutputEnabled_1'] = _emscripten_bind_Uarm_SetPcmOutputEnabled_1 = wasmExports['emscripten_bind_Uarm_SetPcmOutputEnabled_1'];
  Module['_emscripten_bind_Uarm_SetPcmSuspended_1'] = _emscripten_bind_Uarm_SetPcmSuspended_1 = wasmExports['emscripten_bind_Uarm_SetPcmSuspended_1'];
  Module['_emscripten_bind_Uarm_GetRomDataSize_0'] = _emscripten_bind_Uarm_GetRomDataSize_0 = wasmExports['emscripten_bind_Uarm_GetRomDataSize_0'];
  Module['_emscripten_bind_Uarm_GetRomData_0'] = _emscripten_bind_Uarm_GetRomData_0 = wasmExports['emscripten_bind_Uarm_GetRomData_0'];
  Module['_emscripten_bind_Uarm_GetNandDataSize_0'] = _emscripten_bind_Uarm_GetNandDataSize_0 = wasmExports['emscripten_bind_Uarm_GetNandDataSize_0'];
  Module['_emscripten_bind_Uarm_GetNandData_0'] = _emscripten_bind_Uarm_GetNandData_0 = wasmExports['emscripten_bind_Uarm_GetNandData_0'];
  Module['_emscripten_bind_Uarm_GetNandDirtyPages_0'] = _emscripten_bind_Uarm_GetNandDirtyPages_0 = wasmExports['emscripten_bind_Uarm_GetNandDirtyPages_0'];
  Module['_emscripten_bind_Uarm_IsNandDirty_0'] = _emscripten_bind_Uarm_IsNandDirty_0 = wasmExports['emscripten_bind_Uarm_IsNandDirty_0'];
  Module['_emscripten_bind_Uarm_SetNandDirty_1'] = _emscripten_bind_Uarm_SetNandDirty_1 = wasmExports['emscripten_bind_Uarm_SetNandDirty_1'];
  Module['_emscripten_bind_Uarm_GetSdCardDataSize_0'] = _emscripten_bind_Uarm_GetSdCardDataSize_0 = wasmExports['emscripten_bind_Uarm_GetSdCardDataSize_0'];
  Module['_emscripten_bind_Uarm_GetSdCardData_0'] = _emscripten_bind_Uarm_GetSdCardData_0 = wasmExports['emscripten_bind_Uarm_GetSdCardData_0'];
  Module['_emscripten_bind_Uarm_GetSdCardDirtyPages_0'] = _emscripten_bind_Uarm_GetSdCardDirtyPages_0 = wasmExports['emscripten_bind_Uarm_GetSdCardDirtyPages_0'];
  Module['_emscripten_bind_Uarm_IsSdCardDirty_0'] = _emscripten_bind_Uarm_IsSdCardDirty_0 = wasmExports['emscripten_bind_Uarm_IsSdCardDirty_0'];
  Module['_emscripten_bind_Uarm_SetSdCardDirty_1'] = _emscripten_bind_Uarm_SetSdCardDirty_1 = wasmExports['emscripten_bind_Uarm_SetSdCardDirty_1'];
  Module['_emscripten_bind_Uarm_GetMemoryDataSize_0'] = _emscripten_bind_Uarm_GetMemoryDataSize_0 = wasmExports['emscripten_bind_Uarm_GetMemoryDataSize_0'];
  Module['_emscripten_bind_Uarm_GetMemoryData_0'] = _emscripten_bind_Uarm_GetMemoryData_0 = wasmExports['emscripten_bind_Uarm_GetMemoryData_0'];
  Module['_emscripten_bind_Uarm_GetMemoryDirtyPages_0'] = _emscripten_bind_Uarm_GetMemoryDirtyPages_0 = wasmExports['emscripten_bind_Uarm_GetMemoryDirtyPages_0'];
  Module['_emscripten_bind_Uarm_GetDeviceType_0'] = _emscripten_bind_Uarm_GetDeviceType_0 = wasmExports['emscripten_bind_Uarm_GetDeviceType_0'];
  Module['_emscripten_bind_Uarm_SdCardInsert_3'] = _emscripten_bind_Uarm_SdCardInsert_3 = wasmExports['emscripten_bind_Uarm_SdCardInsert_3'];
  Module['_emscripten_bind_Uarm_SdCardEject_0'] = _emscripten_bind_Uarm_SdCardEject_0 = wasmExports['emscripten_bind_Uarm_SdCardEject_0'];
  Module['_emscripten_bind_Uarm_SdCardInitialized_0'] = _emscripten_bind_Uarm_SdCardInitialized_0 = wasmExports['emscripten_bind_Uarm_SdCardInitialized_0'];
  Module['_emscripten_bind_Uarm_GetSdCardId_0'] = _emscripten_bind_Uarm_GetSdCardId_0 = wasmExports['emscripten_bind_Uarm_GetSdCardId_0'];
  Module['_emscripten_bind_Uarm_Reset_0'] = _emscripten_bind_Uarm_Reset_0 = wasmExports['emscripten_bind_Uarm_Reset_0'];
  Module['_emscripten_bind_Uarm_Save_0'] = _emscripten_bind_Uarm_Save_0 = wasmExports['emscripten_bind_Uarm_Save_0'];
  Module['_emscripten_bind_Uarm_GetSavestateSize_0'] = _emscripten_bind_Uarm_GetSavestateSize_0 = wasmExports['emscripten_bind_Uarm_GetSavestateSize_0'];
  Module['_emscripten_bind_Uarm_GetSavestateData_0'] = _emscripten_bind_Uarm_GetSavestateData_0 = wasmExports['emscripten_bind_Uarm_GetSavestateData_0'];
  Module['_emscripten_bind_Uarm_IsSdInserted_0'] = _emscripten_bind_Uarm_IsSdInserted_0 = wasmExports['emscripten_bind_Uarm_IsSdInserted_0'];
  Module['_emscripten_bind_Uarm_GetRamSize_0'] = _emscripten_bind_Uarm_GetRamSize_0 = wasmExports['emscripten_bind_Uarm_GetRamSize_0'];
  Module['_emscripten_bind_Uarm_JamKey_2'] = _emscripten_bind_Uarm_JamKey_2 = wasmExports['emscripten_bind_Uarm_JamKey_2'];
  Module['_emscripten_bind_Uarm_IsUiInitialized_0'] = _emscripten_bind_Uarm_IsUiInitialized_0 = wasmExports['emscripten_bind_Uarm_IsUiInitialized_0'];
  Module['_emscripten_bind_Uarm_IsOsVersionSet_0'] = _emscripten_bind_Uarm_IsOsVersionSet_0 = wasmExports['emscripten_bind_Uarm_IsOsVersionSet_0'];
  Module['_emscripten_bind_Uarm_GetOsVersion_0'] = _emscripten_bind_Uarm_GetOsVersion_0 = wasmExports['emscripten_bind_Uarm_GetOsVersion_0'];
  Module['_emscripten_bind_Uarm_IsLcdEnabled_0'] = _emscripten_bind_Uarm_IsLcdEnabled_0 = wasmExports['emscripten_bind_Uarm_IsLcdEnabled_0'];
  Module['_emscripten_bind_Uarm_InstallDatabase_2'] = _emscripten_bind_Uarm_InstallDatabase_2 = wasmExports['emscripten_bind_Uarm_InstallDatabase_2'];
  Module['_emscripten_bind_Uarm_NewDbBackup_1'] = _emscripten_bind_Uarm_NewDbBackup_1 = wasmExports['emscripten_bind_Uarm_NewDbBackup_1'];
  Module['_emscripten_bind_Uarm___destroy___0'] = _emscripten_bind_Uarm___destroy___0 = wasmExports['emscripten_bind_Uarm___destroy___0'];
  Module['_emscripten_bind_DbBackup_Init_0'] = _emscripten_bind_DbBackup_Init_0 = wasmExports['emscripten_bind_DbBackup_Init_0'];
  Module['_emscripten_bind_DbBackup_GetState_0'] = _emscripten_bind_DbBackup_GetState_0 = wasmExports['emscripten_bind_DbBackup_GetState_0'];
  Module['_emscripten_bind_DbBackup_Continue_0'] = _emscripten_bind_DbBackup_Continue_0 = wasmExports['emscripten_bind_DbBackup_Continue_0'];
  Module['_emscripten_bind_DbBackup_HasLastProcessedDb_0'] = _emscripten_bind_DbBackup_HasLastProcessedDb_0 = wasmExports['emscripten_bind_DbBackup_HasLastProcessedDb_0'];
  Module['_emscripten_bind_DbBackup_GetLastProcessedDb_0'] = _emscripten_bind_DbBackup_GetLastProcessedDb_0 = wasmExports['emscripten_bind_DbBackup_GetLastProcessedDb_0'];
  Module['_emscripten_bind_DbBackup_GetArchiveData_0'] = _emscripten_bind_DbBackup_GetArchiveData_0 = wasmExports['emscripten_bind_DbBackup_GetArchiveData_0'];
  Module['_emscripten_bind_DbBackup_GetArchiveSize_0'] = _emscripten_bind_DbBackup_GetArchiveSize_0 = wasmExports['emscripten_bind_DbBackup_GetArchiveSize_0'];
  Module['_emscripten_bind_DbBackup___destroy___0'] = _emscripten_bind_DbBackup___destroy___0 = wasmExports['emscripten_bind_DbBackup___destroy___0'];
  Module['_emscripten_bind_Bridge_Bridge_0'] = _emscripten_bind_Bridge_Bridge_0 = wasmExports['emscripten_bind_Bridge_Bridge_0'];
  Module['_emscripten_bind_Bridge_Malloc_1'] = _emscripten_bind_Bridge_Malloc_1 = wasmExports['emscripten_bind_Bridge_Malloc_1'];
  Module['_emscripten_bind_Bridge_Free_1'] = _emscripten_bind_Bridge_Free_1 = wasmExports['emscripten_bind_Bridge_Free_1'];
  Module['_emscripten_bind_Bridge___destroy___0'] = _emscripten_bind_Bridge___destroy___0 = wasmExports['emscripten_bind_Bridge___destroy___0'];
  Module['_emscripten_bind_SessionFile5_SessionFile5_0'] = _emscripten_bind_SessionFile5_SessionFile5_0 = wasmExports['emscripten_bind_SessionFile5_SessionFile5_0'];
  Module['_emscripten_bind_SessionFile5_IsSessionFile_2'] = _emscripten_bind_SessionFile5_IsSessionFile_2 = wasmExports['emscripten_bind_SessionFile5_IsSessionFile_2'];
  Module['_emscripten_bind_SessionFile5_GetDeviceId_0'] = _emscripten_bind_SessionFile5_GetDeviceId_0 = wasmExports['emscripten_bind_SessionFile5_GetDeviceId_0'];
  Module['_emscripten_bind_SessionFile5_SetDeviceId_1'] = _emscripten_bind_SessionFile5_SetDeviceId_1 = wasmExports['emscripten_bind_SessionFile5_SetDeviceId_1'];
  Module['_emscripten_bind_SessionFile5_GetMetadata_0'] = _emscripten_bind_SessionFile5_GetMetadata_0 = wasmExports['emscripten_bind_SessionFile5_GetMetadata_0'];
  Module['_emscripten_bind_SessionFile5_GetMetadataSize_0'] = _emscripten_bind_SessionFile5_GetMetadataSize_0 = wasmExports['emscripten_bind_SessionFile5_GetMetadataSize_0'];
  Module['_emscripten_bind_SessionFile5_SetMetadata_2'] = _emscripten_bind_SessionFile5_SetMetadata_2 = wasmExports['emscripten_bind_SessionFile5_SetMetadata_2'];
  Module['_emscripten_bind_SessionFile5_GetNor_0'] = _emscripten_bind_SessionFile5_GetNor_0 = wasmExports['emscripten_bind_SessionFile5_GetNor_0'];
  Module['_emscripten_bind_SessionFile5_GetNorSize_0'] = _emscripten_bind_SessionFile5_GetNorSize_0 = wasmExports['emscripten_bind_SessionFile5_GetNorSize_0'];
  Module['_emscripten_bind_SessionFile5_SetNor_2'] = _emscripten_bind_SessionFile5_SetNor_2 = wasmExports['emscripten_bind_SessionFile5_SetNor_2'];
  Module['_emscripten_bind_SessionFile5_GetNand_0'] = _emscripten_bind_SessionFile5_GetNand_0 = wasmExports['emscripten_bind_SessionFile5_GetNand_0'];
  Module['_emscripten_bind_SessionFile5_GetNandSize_0'] = _emscripten_bind_SessionFile5_GetNandSize_0 = wasmExports['emscripten_bind_SessionFile5_GetNandSize_0'];
  Module['_emscripten_bind_SessionFile5_SetNand_2'] = _emscripten_bind_SessionFile5_SetNand_2 = wasmExports['emscripten_bind_SessionFile5_SetNand_2'];
  Module['_emscripten_bind_SessionFile5_GetMemory_0'] = _emscripten_bind_SessionFile5_GetMemory_0 = wasmExports['emscripten_bind_SessionFile5_GetMemory_0'];
  Module['_emscripten_bind_SessionFile5_GetMemorySize_0'] = _emscripten_bind_SessionFile5_GetMemorySize_0 = wasmExports['emscripten_bind_SessionFile5_GetMemorySize_0'];
  Module['_emscripten_bind_SessionFile5_SetMemory_2'] = _emscripten_bind_SessionFile5_SetMemory_2 = wasmExports['emscripten_bind_SessionFile5_SetMemory_2'];
  Module['_emscripten_bind_SessionFile5_GetSavestate_0'] = _emscripten_bind_SessionFile5_GetSavestate_0 = wasmExports['emscripten_bind_SessionFile5_GetSavestate_0'];
  Module['_emscripten_bind_SessionFile5_GetSavestateSize_0'] = _emscripten_bind_SessionFile5_GetSavestateSize_0 = wasmExports['emscripten_bind_SessionFile5_GetSavestateSize_0'];
  Module['_emscripten_bind_SessionFile5_SetSavestate_2'] = _emscripten_bind_SessionFile5_SetSavestate_2 = wasmExports['emscripten_bind_SessionFile5_SetSavestate_2'];
  Module['_emscripten_bind_SessionFile5_GetRamSize_0'] = _emscripten_bind_SessionFile5_GetRamSize_0 = wasmExports['emscripten_bind_SessionFile5_GetRamSize_0'];
  Module['_emscripten_bind_SessionFile5_SetRamSize_1'] = _emscripten_bind_SessionFile5_SetRamSize_1 = wasmExports['emscripten_bind_SessionFile5_SetRamSize_1'];
  Module['_emscripten_bind_SessionFile5_Serialize_0'] = _emscripten_bind_SessionFile5_Serialize_0 = wasmExports['emscripten_bind_SessionFile5_Serialize_0'];
  Module['_emscripten_bind_SessionFile5_GetSerializedSession_0'] = _emscripten_bind_SessionFile5_GetSerializedSession_0 = wasmExports['emscripten_bind_SessionFile5_GetSerializedSession_0'];
  Module['_emscripten_bind_SessionFile5_GetSerializedSessionSize_0'] = _emscripten_bind_SessionFile5_GetSerializedSessionSize_0 = wasmExports['emscripten_bind_SessionFile5_GetSerializedSessionSize_0'];
  Module['_emscripten_bind_SessionFile5_GetVersion_0'] = _emscripten_bind_SessionFile5_GetVersion_0 = wasmExports['emscripten_bind_SessionFile5_GetVersion_0'];
  Module['_emscripten_bind_SessionFile5_Deserialize_2'] = _emscripten_bind_SessionFile5_Deserialize_2 = wasmExports['emscripten_bind_SessionFile5_Deserialize_2'];
  Module['_emscripten_bind_SessionFile5___destroy___0'] = _emscripten_bind_SessionFile5___destroy___0 = wasmExports['emscripten_bind_SessionFile5___destroy___0'];
  __emscripten_timeout = wasmExports['_emscripten_timeout'];
  __emscripten_stack_restore = wasmExports['_emscripten_stack_restore'];
  __emscripten_stack_alloc = wasmExports['_emscripten_stack_alloc'];
  _emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'];
  ___cxa_increment_exception_refcount = wasmExports['__cxa_increment_exception_refcount'];
}
var wasmImports = {
  /** @export */
  __assert_fail: ___assert_fail,
  /** @export */
  __emscripten_abort,
  /** @export */
  __syscall_ftruncate64: ___syscall_ftruncate64,
  /** @export */
  _abort_js: __abort_js,
  /** @export */
  _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear,
  /** @export */
  _localtime_js: __localtime_js,
  /** @export */
  _mktime_js: __mktime_js,
  /** @export */
  _setitimer_js: __setitimer_js,
  /** @export */
  _tzset_js: __tzset_js,
  /** @export */
  clock_time_get: _clock_time_get,
  /** @export */
  emscripten_asm_const_int: _emscripten_asm_const_int,
  /** @export */
  emscripten_date_now: _emscripten_date_now,
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */
  environ_get: _environ_get,
  /** @export */
  environ_sizes_get: _environ_sizes_get,
  /** @export */
  fd_close: _fd_close,
  /** @export */
  fd_read: _fd_read,
  /** @export */
  fd_seek: _fd_seek,
  /** @export */
  fd_write: _fd_write,
  /** @export */
  proc_exit: _proc_exit
};
var wasmExports = await createWasm();


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

function callMain() {

  var entryFunction = _main;

  var argc = 0;
  var argv = 0;

  try {

    var ret = entryFunction(argc, argv);

    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

function run() {

  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    readyPromiseResolve?.(Module);
    Module['onRuntimeInitialized']?.();

    var noInitialRun = Module['noInitialRun'] || false;
    if (!noInitialRun) callMain();

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(() => {
      setTimeout(() => Module['setStatus'](''), 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
}

function preInit() {
  if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
    while (Module['preInit'].length > 0) {
      Module['preInit'].shift()();
    }
  }
}

preInit();
run();

// end include: postamble.js

// include: web/binding/binding.js

// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_webidl_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_webidl_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_webidl_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = alignMemory(len, 8); // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_webidl_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy(array, view, offset) {
    offset /= view.BYTES_PER_ELEMENT;
    for (var i = 0; i < array.length; i++) {
      view[offset + i] = array[i];
    }
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}

// Interface: VoidPtr

/** @suppress {undefinedVars, duplicate} @this{Object} */
function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

/** @suppress {undefinedVars, duplicate} @this{Object} */
VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};

// Interface: Uarm

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Uarm() {
  this.ptr = _emscripten_bind_Uarm_Uarm_0();
  getCache(Uarm)[this.ptr] = this;
};

Uarm.prototype = Object.create(WrapperObject.prototype);
Uarm.prototype.constructor = Uarm;
Uarm.prototype.__class__ = Uarm;
Uarm.__cache__ = {};
Module['Uarm'] = Uarm;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetRamSize'] = Uarm.prototype.SetRamSize = function(size) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  return wrapPointer(_emscripten_bind_Uarm_SetRamSize_1(self, size), Uarm);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetNand'] = Uarm.prototype.SetNand = function(size, data) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return wrapPointer(_emscripten_bind_Uarm_SetNand_2(self, size, data), Uarm);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetMemory'] = Uarm.prototype.SetMemory = function(size, data) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return wrapPointer(_emscripten_bind_Uarm_SetMemory_2(self, size, data), Uarm);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetSavestate'] = Uarm.prototype.SetSavestate = function(size, data) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return wrapPointer(_emscripten_bind_Uarm_SetSavestate_2(self, size, data), Uarm);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetSd'] = Uarm.prototype.SetSd = function(size, data, id) {
  var self = this.ptr;
  ensureCache.prepare();
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  if (id && typeof id === 'object') id = id.ptr;
  else id = ensureString(id);
  return wrapPointer(_emscripten_bind_Uarm_SetSd_3(self, size, data, id), Uarm);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetDefaultMips'] = Uarm.prototype.SetDefaultMips = function(defaultMips) {
  var self = this.ptr;
  if (defaultMips && typeof defaultMips === 'object') defaultMips = defaultMips.ptr;
  return wrapPointer(_emscripten_bind_Uarm_SetDefaultMips_1(self, defaultMips), Uarm);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['Launch'] = Uarm.prototype.Launch = function(romSize, romData) {
  var self = this.ptr;
  if (romSize && typeof romSize === 'object') romSize = romSize.ptr;
  if (romData && typeof romData === 'object') romData = romData.ptr;
  return !!(_emscripten_bind_Uarm_Launch_2(self, romSize, romData));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['Cycle'] = Uarm.prototype.Cycle = function(now) {
  var self = this.ptr;
  if (now && typeof now === 'object') now = now.ptr;
  return _emscripten_bind_Uarm_Cycle_1(self, now);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetFrame'] = Uarm.prototype.GetFrame = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_GetFrame_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['ResetFrame'] = Uarm.prototype.ResetFrame = function() {
  var self = this.ptr;
  _emscripten_bind_Uarm_ResetFrame_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetTimesliceSizeUsec'] = Uarm.prototype.GetTimesliceSizeUsec = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetTimesliceSizeUsec_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['PenDown'] = Uarm.prototype.PenDown = function(x, y) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  _emscripten_bind_Uarm_PenDown_2(self, x, y);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['PenUp'] = Uarm.prototype.PenUp = function() {
  var self = this.ptr;
  _emscripten_bind_Uarm_PenUp_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['CurrentIps'] = Uarm.prototype.CurrentIps = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_CurrentIps_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['CurrentIpsMax'] = Uarm.prototype.CurrentIpsMax = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_CurrentIpsMax_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetMaxLoad'] = Uarm.prototype.SetMaxLoad = function(maxLoad) {
  var self = this.ptr;
  if (maxLoad && typeof maxLoad === 'object') maxLoad = maxLoad.ptr;
  _emscripten_bind_Uarm_SetMaxLoad_1(self, maxLoad);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetCyclesPerSecondLimit'] = Uarm.prototype.SetCyclesPerSecondLimit = function(cyclesPerSecondLimit) {
  var self = this.ptr;
  if (cyclesPerSecondLimit && typeof cyclesPerSecondLimit === 'object') cyclesPerSecondLimit = cyclesPerSecondLimit.ptr;
  _emscripten_bind_Uarm_SetCyclesPerSecondLimit_1(self, cyclesPerSecondLimit);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetTimestampUsec'] = Uarm.prototype.GetTimestampUsec = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetTimestampUsec_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['KeyDown'] = Uarm.prototype.KeyDown = function(key) {
  var self = this.ptr;
  if (key && typeof key === 'object') key = key.ptr;
  _emscripten_bind_Uarm_KeyDown_1(self, key);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['KeyUp'] = Uarm.prototype.KeyUp = function(key) {
  var self = this.ptr;
  if (key && typeof key === 'object') key = key.ptr;
  _emscripten_bind_Uarm_KeyUp_1(self, key);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['PendingSamples'] = Uarm.prototype.PendingSamples = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_PendingSamples_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['PopQueuedSamples'] = Uarm.prototype.PopQueuedSamples = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_PopQueuedSamples_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetSampleQueueSize'] = Uarm.prototype.GetSampleQueueSize = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetSampleQueueSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetPcmOutputEnabled'] = Uarm.prototype.SetPcmOutputEnabled = function(enabled) {
  var self = this.ptr;
  if (enabled && typeof enabled === 'object') enabled = enabled.ptr;
  _emscripten_bind_Uarm_SetPcmOutputEnabled_1(self, enabled);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetPcmSuspended'] = Uarm.prototype.SetPcmSuspended = function(suspended) {
  var self = this.ptr;
  if (suspended && typeof suspended === 'object') suspended = suspended.ptr;
  _emscripten_bind_Uarm_SetPcmSuspended_1(self, suspended);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetRomDataSize'] = Uarm.prototype.GetRomDataSize = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetRomDataSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetRomData'] = Uarm.prototype.GetRomData = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_GetRomData_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetNandDataSize'] = Uarm.prototype.GetNandDataSize = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetNandDataSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetNandData'] = Uarm.prototype.GetNandData = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_GetNandData_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetNandDirtyPages'] = Uarm.prototype.GetNandDirtyPages = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_GetNandDirtyPages_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['IsNandDirty'] = Uarm.prototype.IsNandDirty = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Uarm_IsNandDirty_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetNandDirty'] = Uarm.prototype.SetNandDirty = function(isDirty) {
  var self = this.ptr;
  if (isDirty && typeof isDirty === 'object') isDirty = isDirty.ptr;
  _emscripten_bind_Uarm_SetNandDirty_1(self, isDirty);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetSdCardDataSize'] = Uarm.prototype.GetSdCardDataSize = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetSdCardDataSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetSdCardData'] = Uarm.prototype.GetSdCardData = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_GetSdCardData_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetSdCardDirtyPages'] = Uarm.prototype.GetSdCardDirtyPages = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_GetSdCardDirtyPages_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['IsSdCardDirty'] = Uarm.prototype.IsSdCardDirty = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Uarm_IsSdCardDirty_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SetSdCardDirty'] = Uarm.prototype.SetSdCardDirty = function(isDirty) {
  var self = this.ptr;
  if (isDirty && typeof isDirty === 'object') isDirty = isDirty.ptr;
  _emscripten_bind_Uarm_SetSdCardDirty_1(self, isDirty);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetMemoryDataSize'] = Uarm.prototype.GetMemoryDataSize = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetMemoryDataSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetMemoryData'] = Uarm.prototype.GetMemoryData = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_GetMemoryData_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetMemoryDirtyPages'] = Uarm.prototype.GetMemoryDirtyPages = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_GetMemoryDirtyPages_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetDeviceType'] = Uarm.prototype.GetDeviceType = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetDeviceType_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SdCardInsert'] = Uarm.prototype.SdCardInsert = function(data, length, id) {
  var self = this.ptr;
  ensureCache.prepare();
  if (data && typeof data === 'object') data = data.ptr;
  if (length && typeof length === 'object') length = length.ptr;
  if (id && typeof id === 'object') id = id.ptr;
  else id = ensureString(id);
  return !!(_emscripten_bind_Uarm_SdCardInsert_3(self, data, length, id));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SdCardEject'] = Uarm.prototype.SdCardEject = function() {
  var self = this.ptr;
  _emscripten_bind_Uarm_SdCardEject_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['SdCardInitialized'] = Uarm.prototype.SdCardInitialized = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Uarm_SdCardInitialized_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetSdCardId'] = Uarm.prototype.GetSdCardId = function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_Uarm_GetSdCardId_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['Reset'] = Uarm.prototype.Reset = function() {
  var self = this.ptr;
  _emscripten_bind_Uarm_Reset_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['Save'] = Uarm.prototype.Save = function() {
  var self = this.ptr;
  _emscripten_bind_Uarm_Save_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetSavestateSize'] = Uarm.prototype.GetSavestateSize = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetSavestateSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetSavestateData'] = Uarm.prototype.GetSavestateData = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Uarm_GetSavestateData_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['IsSdInserted'] = Uarm.prototype.IsSdInserted = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Uarm_IsSdInserted_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetRamSize'] = Uarm.prototype.GetRamSize = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetRamSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['JamKey'] = Uarm.prototype.JamKey = function(key, durationMsec) {
  var self = this.ptr;
  if (key && typeof key === 'object') key = key.ptr;
  if (durationMsec && typeof durationMsec === 'object') durationMsec = durationMsec.ptr;
  _emscripten_bind_Uarm_JamKey_2(self, key, durationMsec);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['IsUiInitialized'] = Uarm.prototype.IsUiInitialized = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Uarm_IsUiInitialized_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['IsOsVersionSet'] = Uarm.prototype.IsOsVersionSet = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Uarm_IsOsVersionSet_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['GetOsVersion'] = Uarm.prototype.GetOsVersion = function() {
  var self = this.ptr;
  return _emscripten_bind_Uarm_GetOsVersion_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['IsLcdEnabled'] = Uarm.prototype.IsLcdEnabled = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_Uarm_IsLcdEnabled_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['InstallDatabase'] = Uarm.prototype.InstallDatabase = function(len, data) {
  var self = this.ptr;
  if (len && typeof len === 'object') len = len.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return _emscripten_bind_Uarm_InstallDatabase_2(self, len, data);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['NewDbBackup'] = Uarm.prototype.NewDbBackup = function(type) {
  var self = this.ptr;
  if (type && typeof type === 'object') type = type.ptr;
  return wrapPointer(_emscripten_bind_Uarm_NewDbBackup_1(self, type), DbBackup);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
Uarm.prototype['__destroy__'] = Uarm.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Uarm___destroy___0(self);
};

// Interface: DbBackup

/** @suppress {undefinedVars, duplicate} @this{Object} */
function DbBackup() { throw "cannot construct a DbBackup, no constructor in IDL" }
DbBackup.prototype = Object.create(WrapperObject.prototype);
DbBackup.prototype.constructor = DbBackup;
DbBackup.prototype.__class__ = DbBackup;
DbBackup.__cache__ = {};
Module['DbBackup'] = DbBackup;
/** @suppress {undefinedVars, duplicate} @this{Object} */
DbBackup.prototype['Init'] = DbBackup.prototype.Init = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_DbBackup_Init_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DbBackup.prototype['GetState'] = DbBackup.prototype.GetState = function() {
  var self = this.ptr;
  return _emscripten_bind_DbBackup_GetState_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DbBackup.prototype['Continue'] = DbBackup.prototype.Continue = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_DbBackup_Continue_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DbBackup.prototype['HasLastProcessedDb'] = DbBackup.prototype.HasLastProcessedDb = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_DbBackup_HasLastProcessedDb_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DbBackup.prototype['GetLastProcessedDb'] = DbBackup.prototype.GetLastProcessedDb = function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_DbBackup_GetLastProcessedDb_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DbBackup.prototype['GetArchiveData'] = DbBackup.prototype.GetArchiveData = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_DbBackup_GetArchiveData_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DbBackup.prototype['GetArchiveSize'] = DbBackup.prototype.GetArchiveSize = function() {
  var self = this.ptr;
  return _emscripten_bind_DbBackup_GetArchiveSize_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
DbBackup.prototype['__destroy__'] = DbBackup.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_DbBackup___destroy___0(self);
};

// Interface: Bridge

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Bridge() {
  this.ptr = _emscripten_bind_Bridge_Bridge_0();
  getCache(Bridge)[this.ptr] = this;
};

Bridge.prototype = Object.create(WrapperObject.prototype);
Bridge.prototype.constructor = Bridge;
Bridge.prototype.__class__ = Bridge;
Bridge.__cache__ = {};
Module['Bridge'] = Bridge;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Bridge.prototype['Malloc'] = Bridge.prototype.Malloc = function(size) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  return wrapPointer(_emscripten_bind_Bridge_Malloc_1(self, size), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Bridge.prototype['Free'] = Bridge.prototype.Free = function(ptr) {
  var self = this.ptr;
  if (ptr && typeof ptr === 'object') ptr = ptr.ptr;
  _emscripten_bind_Bridge_Free_1(self, ptr);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
Bridge.prototype['__destroy__'] = Bridge.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Bridge___destroy___0(self);
};

// Interface: SessionFile5

/** @suppress {undefinedVars, duplicate} @this{Object} */
function SessionFile5() {
  this.ptr = _emscripten_bind_SessionFile5_SessionFile5_0();
  getCache(SessionFile5)[this.ptr] = this;
};

SessionFile5.prototype = Object.create(WrapperObject.prototype);
SessionFile5.prototype.constructor = SessionFile5;
SessionFile5.prototype.__class__ = SessionFile5;
SessionFile5.__cache__ = {};
Module['SessionFile5'] = SessionFile5;
/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['IsSessionFile'] = SessionFile5.prototype.IsSessionFile = function(size, data) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return !!(_emscripten_bind_SessionFile5_IsSessionFile_2(self, size, data));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetDeviceId'] = SessionFile5.prototype.GetDeviceId = function() {
  var self = this.ptr;
  return _emscripten_bind_SessionFile5_GetDeviceId_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['SetDeviceId'] = SessionFile5.prototype.SetDeviceId = function(deviceId) {
  var self = this.ptr;
  if (deviceId && typeof deviceId === 'object') deviceId = deviceId.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_SetDeviceId_1(self, deviceId), SessionFile5);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetMetadata'] = SessionFile5.prototype.GetMetadata = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_GetMetadata_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetMetadataSize'] = SessionFile5.prototype.GetMetadataSize = function() {
  var self = this.ptr;
  return _emscripten_bind_SessionFile5_GetMetadataSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['SetMetadata'] = SessionFile5.prototype.SetMetadata = function(size, data) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_SetMetadata_2(self, size, data), SessionFile5);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetNor'] = SessionFile5.prototype.GetNor = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_GetNor_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetNorSize'] = SessionFile5.prototype.GetNorSize = function() {
  var self = this.ptr;
  return _emscripten_bind_SessionFile5_GetNorSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['SetNor'] = SessionFile5.prototype.SetNor = function(size, data) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_SetNor_2(self, size, data), SessionFile5);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetNand'] = SessionFile5.prototype.GetNand = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_GetNand_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetNandSize'] = SessionFile5.prototype.GetNandSize = function() {
  var self = this.ptr;
  return _emscripten_bind_SessionFile5_GetNandSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['SetNand'] = SessionFile5.prototype.SetNand = function(size, data) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_SetNand_2(self, size, data), SessionFile5);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetMemory'] = SessionFile5.prototype.GetMemory = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_GetMemory_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetMemorySize'] = SessionFile5.prototype.GetMemorySize = function() {
  var self = this.ptr;
  return _emscripten_bind_SessionFile5_GetMemorySize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['SetMemory'] = SessionFile5.prototype.SetMemory = function(size, data) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_SetMemory_2(self, size, data), SessionFile5);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetSavestate'] = SessionFile5.prototype.GetSavestate = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_GetSavestate_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetSavestateSize'] = SessionFile5.prototype.GetSavestateSize = function() {
  var self = this.ptr;
  return _emscripten_bind_SessionFile5_GetSavestateSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['SetSavestate'] = SessionFile5.prototype.SetSavestate = function(size, data) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_SetSavestate_2(self, size, data), SessionFile5);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetRamSize'] = SessionFile5.prototype.GetRamSize = function() {
  var self = this.ptr;
  return _emscripten_bind_SessionFile5_GetRamSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['SetRamSize'] = SessionFile5.prototype.SetRamSize = function(size) {
  var self = this.ptr;
  if (size && typeof size === 'object') size = size.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_SetRamSize_1(self, size), SessionFile5);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['Serialize'] = SessionFile5.prototype.Serialize = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_SessionFile5_Serialize_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetSerializedSession'] = SessionFile5.prototype.GetSerializedSession = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_SessionFile5_GetSerializedSession_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetSerializedSessionSize'] = SessionFile5.prototype.GetSerializedSessionSize = function() {
  var self = this.ptr;
  return _emscripten_bind_SessionFile5_GetSerializedSessionSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['GetVersion'] = SessionFile5.prototype.GetVersion = function() {
  var self = this.ptr;
  return _emscripten_bind_SessionFile5_GetVersion_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['Deserialize'] = SessionFile5.prototype.Deserialize = function(Size, data) {
  var self = this.ptr;
  if (Size && typeof Size === 'object') Size = Size.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  return !!(_emscripten_bind_SessionFile5_Deserialize_2(self, Size, data));
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
SessionFile5.prototype['__destroy__'] = SessionFile5.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_SessionFile5___destroy___0(self);
};
// end include: web/binding/binding.js

// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
//
// We assign to the `moduleRtn` global here and configure closure to see
// this as and extern so it won't get minified.

if (runtimeInitialized)  {
  moduleRtn = Module;
} else {
  // Set up the promise that indicates the Module is initialized
  moduleRtn = new Promise((resolve, reject) => {
    readyPromiseResolve = resolve;
    readyPromiseReject = reject;
  });
}

// end include: postamble_modularize.js



  return moduleRtn;
}
);
})();
if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = createModule;
  // This default export looks redundant, but it allows TS to import this
  // commonjs style module.
  module.exports.default = createModule;
} else if (typeof define === 'function' && define['amd'])
  define([], () => createModule);
