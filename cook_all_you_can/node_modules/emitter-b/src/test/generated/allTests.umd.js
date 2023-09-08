(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["allTests"] = factory();
	else
		root["allTests"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 55);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/util.js ***!
  \****************************************************************************************************/
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;


/***/ }),
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/process/browser.js ***!
  \********************************************************************************/
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/path-browserify/index.js ***!
  \**************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

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
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../process/browser.js */ 1)))

/***/ }),
/* 3 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/async-future/asyncFuture.js ***!
  \*****************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var trimArgs = __webpack_require__(/*! trimArguments */ 48)


module.exports = Future

Future.debug = false // switch this to true if you want ids and long stack traces

var curId = 0         // for ids\
function Future(value) {
	if(arguments.length > 0) {
		var f = new Future()
        f.return(value)
        return f
	} else {
        this.isResolved = false
        this.queue = []
        if(Future.debug) {
            curId++
            this.id = curId
        }
    }
}

// static methods

// has one parameter: either a bunch of futures, or a single array of futures
// returns a promise that resolves when one of them errors, or when all of them succeeds
Future.all = function() {
    if(arguments[0] instanceof Array) {
        var futures = arguments[0]
    } else {
        var futures = trimArgs(arguments)
    }

    var f = new Future()
    var results = []

    if(futures.length > 0) {
        var current = futures[0]
        futures.forEach(function(future, index) {
            current = current.then(function(v) {
                results[index] = v
                return futures[index+1]
            })
        })

        //if
        current.catch(function(e) {
            f.throw(e)
        })
        // else
        current.then(function() {
            f.return(results)
        })


    } else {
        f.return(results)
    }

    return f
}

// either used like futureWrap(function(){ ... })(arg1,arg2,etc) or
//  futureWrap(object, 'methodName')(arg1,arg2,etc)
Future.wrap = function() {
    // function
    if(arguments.length === 1) {
        var fn = arguments[0]
        var object = undefined


    // object, function
    } else {
        var object = arguments[0]
        var fn = object[arguments[1]]
    }

    return function() {
        var args = Array.prototype.slice.call(arguments)
        var future = new Future
        args.push(future.resolver())
        var me = this
        if(object) me = object
        fn.apply(me, args)
        return future
    }
}


// default
var unhandledErrorHandler = function(e) {
    setTimeout(function() {
        throw e
    },0)
}

// setup unhandled error handler
// unhandled errors happen when done is called, and  then an exception is thrown from the future
Future.error = function(handler) {
    unhandledErrorHandler = handler
}

// instance methods

// returns a value for the future (can only be executed once)
// if there are callbacks waiting on this value, they are run in the next tick
    // (ie they aren't run immediately, allowing the current thread of execution to complete)
Future.prototype.return = function(v) {
    resolve(this, 'return', v)
}
Future.prototype.throw = function(e) {
    resolve(this, 'error', e)
}

function setNext(that, future) {
    if(future !== undefined && !isLikeAFuture(future) )
        throw Error("Value returned from then or catch *not* a Future: "+future)

    resolve(that, 'next', future)
}

function wait(that, cb) {
    if(that.isResolved) {
        executeCallbacks(that, [cb])
    } else {
        that.queue.push(cb)
    }
}

// duck typing to determine if something is or isn't a future
function isLikeAFuture(x) {
    return x.isResolved !== undefined && x.queue !== undefined && x.then !== undefined
}

function waitOnResult(f, result, cb) {
    wait(result, function() {
        if(this.hasError) {
            f.throw(this.error)
        } else if(this.hasNext) {
            waitOnResult(f, this.next, cb)
        } else {
            try {
                setNext(f, cb(this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
}


// cb takes one parameter - the value returned
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.then = function(cb) {
    var f = new Future
    wait(this, function() {
        if(this.hasError)
            f.throw(this.error)
        else if(this.hasNext)
            waitOnResult(f, this.next, cb)
        else {
            try {
                setNext(f, cb(this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
    return f
}
// cb takes one parameter - the error caught
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.catch = function(cb) {
    var f = new Future
    wait(this, function() {
        if(this.hasError) {
            try {
                setNext(f, cb(this.error))
            } catch(e) {
                f.throw(e)
            }
        } else if(this.hasNext) {
            this.next.then(function(v) {
                f.return(v)
            }).catch(function(e) {
                setNext(f, cb(e))
            })
        } else {
            f.return(this.result)
        }
    })
    return f
}
// cb takes no parameters
// callback's return value is ignored, but thrown exceptions propogate normally
Future.prototype.finally = function(cb) {
    var f = new Future
    wait(this, function() {
        try {
            var that = this
            if(this.hasNext) {
                this.next.then(function(v) {
                    var x = cb()
                    f.return(v)
                    return x
                }).catch(function(e) {
                    var x = cb()
                    f.throw(e)
                    return x
                }).done()
            } else if(this.hasError) {
                Future(true).then(function() {
                    return cb()
                }).then(function() {
                    f.throw(that.error)
                }).catch(function(e) {
                    f.throw(e)
                }).done()

            } else  {
                Future(true).then(function() {
                    return cb()
                }).then(function() {
                    f.return(that.result)
                }).catch(function(e) {
                    f.throw(e)
                }).done()
            }
        } catch(e) {
            f.throw(e)
        }
    })
    return f
}

// all unused futures should end with this (e.g. most then-chains)
// detatches the future so any propogated exception is thrown (so the exception isn't silently lost)
Future.prototype.done = function() {
    wait(this, function() {
        if(this.hasError) {
            unhandledErrorHandler(this.error)
        } else if(this.hasNext) {
            this.next.catch(function(e) {
                unhandledErrorHandler(e)
            })
        }
    })
}



Future.prototype.resolver = function() {
    var me = this

    return function(e,v) {
        if(e) { // error argument
            me.throw(e)
        } else {
            me.return(v)
        }
    }
}

Future.prototype.resolved = function() {
    return this.isResolved
}


function resolve(that, type, value) {
    if(that.isResolved)
        throw Error("Future resolved more than once! Resolution: "+value)

    that.isResolved = true
    that.hasError = type === 'error'
    that.hasNext = type === 'next' && value !== undefined

    if(that.hasError)
        that.error = value
    else if(that.hasNext)
        that.next = value
    else
        that.result = value

    executeCallbacks(that, that.queue)
}

function executeCallbacks(that, callbacks) {
    if(callbacks.length > 0) {
        setTimeout(function() {
            callbacks.forEach(function(cb) {
                cb.apply(that)
            })
        },0)
    }
}


/***/ }),
/* 5 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/colors/safe.js ***!
  \****************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var isHeadless = false;

if (typeof module !== 'undefined') {
  isHeadless = true;
}

if (!isHeadless) {
  var exports = {};
  var module = {};
  var colors = exports;
  exports.mode = "browser";
} else {
  exports.mode = "console";
}

//
// Prototypes the string object to have additional method calls that add terminal colors
//
var addProperty = function (color, func) {
  exports[color] = function (str) {
    return func.apply(str);
  };
};

function stylize(str, style) {

  var styles;

  if (exports.mode === 'console') {
    styles = {
      //styles
      'bold'      : ['\x1B[1m',  '\x1B[22m'],
      'italic'    : ['\x1B[3m',  '\x1B[23m'],
      'underline' : ['\x1B[4m',  '\x1B[24m'],
      'inverse'   : ['\x1B[7m',  '\x1B[27m'],
      'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
      //text colors
      //grayscale
      'white'     : ['\x1B[37m', '\x1B[39m'],
      'grey'      : ['\x1B[90m', '\x1B[39m'],
      'black'     : ['\x1B[30m', '\x1B[39m'],
      //colors
      'blue'      : ['\x1B[34m', '\x1B[39m'],
      'cyan'      : ['\x1B[36m', '\x1B[39m'],
      'green'     : ['\x1B[32m', '\x1B[39m'],
      'magenta'   : ['\x1B[35m', '\x1B[39m'],
      'red'       : ['\x1B[31m', '\x1B[39m'],
      'yellow'    : ['\x1B[33m', '\x1B[39m'],
      //background colors
      //grayscale
      'whiteBG'     : ['\x1B[47m', '\x1B[49m'],
      'greyBG'      : ['\x1B[49;5;8m', '\x1B[49m'],
      'blackBG'     : ['\x1B[40m', '\x1B[49m'],
      //colors
      'blueBG'      : ['\x1B[44m', '\x1B[49m'],
      'cyanBG'      : ['\x1B[46m', '\x1B[49m'],
      'greenBG'     : ['\x1B[42m', '\x1B[49m'],
      'magentaBG'   : ['\x1B[45m', '\x1B[49m'],
      'redBG'       : ['\x1B[41m', '\x1B[49m'],
      'yellowBG'    : ['\x1B[43m', '\x1B[49m']
    };
  } else if (exports.mode === 'browser') {
    styles = {
      //styles
      'bold'      : ['<b>',  '</b>'],
      'italic'    : ['<i>',  '</i>'],
      'underline' : ['<u>',  '</u>'],
      'inverse'   : ['<span style="background-color:black;color:white;">',  '</span>'],
      'strikethrough' : ['<del>',  '</del>'],
      //text colors
      //grayscale
      'white'     : ['<span style="color:white;">',   '</span>'],
      'grey'      : ['<span style="color:gray;">',    '</span>'],
      'black'     : ['<span style="color:black;">',   '</span>'],
      //colors
      'blue'      : ['<span style="color:blue;">',    '</span>'],
      'cyan'      : ['<span style="color:cyan;">',    '</span>'],
      'green'     : ['<span style="color:green;">',   '</span>'],
      'magenta'   : ['<span style="color:magenta;">', '</span>'],
      'red'       : ['<span style="color:red;">',     '</span>'],
      'yellow'    : ['<span style="color:yellow;">',  '</span>'],
      //background colors
      //grayscale
      'whiteBG'     : ['<span style="background-color:white;">',   '</span>'],
      'greyBG'      : ['<span style="background-color:gray;">',    '</span>'],
      'blackBG'     : ['<span style="background-color:black;">',   '</span>'],
      //colors
      'blueBG'      : ['<span style="background-color:blue;">',    '</span>'],
      'cyanBG'      : ['<span style="background-color:cyan;">',    '</span>'],
      'greenBG'     : ['<span style="background-color:green;">',   '</span>'],
      'magentaBG'   : ['<span style="background-color:magenta;">', '</span>'],
      'redBG'       : ['<span style="background-color:red;">',     '</span>'],
      'yellowBG'    : ['<span style="background-color:yellow;">',  '</span>']
    };
  } else if (exports.mode === 'none') {
    return str + '';
  } else {
    console.log('unsupported mode, try "browser", "console" or "none"');
  }
  return styles[style][0] + str + styles[style][1];
}

function applyTheme(theme) {

  Object.keys(theme).forEach(function (prop) {
      if (typeof(theme[prop]) === 'string') {
        addProperty(prop, function () {
          return exports[theme[prop]](this);
        });
      }
      else {
        addProperty(prop, function () {
          var ret = this;
          for (var t = 0; t < theme[prop].length; t++) {
            ret = exports[theme[prop][t]](ret);
          }
          return ret;
        });
      }
  });
}


//
// Iterate through all default styles and colors
//
var x = ['bold', 'underline', 'strikethrough', 'italic', 'inverse', 'grey', 'black', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta', 'greyBG', 'blackBG', 'yellowBG', 'redBG', 'greenBG', 'blueBG', 'whiteBG', 'cyanBG', 'magentaBG'];
x.forEach(function (style) {

  // __defineGetter__ at the least works in more browsers
  // http://robertnyman.com/javascript/javascript-getters-setters.html
  // Object.defineProperty only works in Chrome
  addProperty(style, function () {
    return stylize(this, style);
  });
});

function sequencer(map) {
  return function () {
    if (!isHeadless) {
      return this.replace(/( )/, '$1');
    }
    var exploded = this.split(""), i = 0;
    exploded = exploded.map(map);
    return exploded.join("");
  };
}

var rainbowMap = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return stylize(letter, rainbowColors[i++ % rainbowColors.length]);
    }
  };
})();

exports.themes = {};

exports.addSequencer = function (name, map) {
  addProperty(name, sequencer(map));
};

exports.addSequencer('rainbow', rainbowMap);
exports.addSequencer('zebra', function (letter, i, exploded) {
  return i % 2 === 0 ? letter : letter.inverse;
});

exports.setTheme = function (theme) {
  if (typeof theme === 'string') {
    exports.themes[theme] = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
    applyTheme(exports.themes[theme]);
    return exports.themes[theme];
  } else {
    applyTheme(theme);
  }
};


addProperty('stripColors', function () {
  return ("" + this).replace(/\x1B\[\d+m/g, '');
});

// please no
function zalgo(text, options) {
  var soul = {
    "up" : [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚'
    ],
    "down" : [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣'
    ],
    "mid" : [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉'
    ]
  },
  all = [].concat(soul.up, soul.down, soul.mid),
  zalgo = {};

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function is_char(character) {
    var bool = false;
    all.filter(function (i) {
      bool = (i === character);
    });
    return bool;
  }

  function heComes(text, options) {
    var result = '', counts, l;
    options = options || {};
    options["up"] = options["up"] || true;
    options["mid"] = options["mid"] || true;
    options["down"] = options["down"] || true;
    options["size"] = options["size"] || "maxi";
    text = text.split('');
    for (l in text) {
      if (is_char(l)) {
        continue;
      }
      result = result + text[l];
      counts = {"up" : 0, "down" : 0, "mid" : 0};
      switch (options.size) {
      case 'mini':
        counts.up = randomNumber(8);
        counts.min = randomNumber(2);
        counts.down = randomNumber(8);
        break;
      case 'maxi':
        counts.up = randomNumber(16) + 3;
        counts.min = randomNumber(4) + 1;
        counts.down = randomNumber(64) + 3;
        break;
      default:
        counts.up = randomNumber(8) + 1;
        counts.mid = randomNumber(6) / 2;
        counts.down = randomNumber(8) + 1;
        break;
      }

      var arr = ["up", "mid", "down"];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0 ; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  return heComes(text);
}


// don't summon zalgo
addProperty('zalgo', function () {
  return zalgo(this);
});

exports.transforms = x.concat(['rainbow', 'zebra', 'stripColors','zalgo'])

/***/ }),
/* 6 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/async-future/asyncFuture.js ***!
  \*********************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var trimArgs = __webpack_require__(/*! trimArguments */ 17)


module.exports = Future

Future.debug = false // switch this to true if you want ids and long stack traces

var curId = 0         // for ids\
function Future(value) {
	if(arguments.length > 0) {
		var f = new Future()
        f.return(value)
        return f
	} else {
        this.isResolved = false
        this.queue = []
        this.n = 1 // future depth (for preventing "too much recursion" RangeErrors)
        if(Future.debug) {
            curId++
            this.id = curId
        }
    }
}

// static methods

// has one parameter: either a bunch of futures, or a single array of futures
// returns a promise that resolves when one of them errors, or when all of them succeeds
Future.all = function() {
    if(arguments[0] instanceof Array) {
        var futures = arguments[0]
    } else {
        var futures = trimArgs(arguments)
    }

    var f = new Future()
    var results = []

    if(futures.length > 0) {
        var current = futures[0]
        futures.forEach(function(future, index) {
            current = current.then(function(v) {
                results[index] = v
                return futures[index+1]
            })
        })

        //if
        current.catch(function(e) {
            f.throw(e)
        })
        // else
        current.then(function() {
            f.return(results)
        })


    } else {
        f.return(results)
    }

    return f
}

// either used like futureWrap(function(){ ... })(arg1,arg2,etc) or
//  futureWrap(object, 'methodName')(arg1,arg2,etc)
Future.wrap = function() {
    // function
    if(arguments.length === 1) {
        var fn = arguments[0]
        var object = undefined


    // object, function
    } else {
        var object = arguments[0]
        var fn = object[arguments[1]]
    }

    return function() {
        var args = Array.prototype.slice.call(arguments)
        var future = new Future
        args.push(future.resolver())
        var me = this
        if(object) me = object
        fn.apply(me, args)
        return future
    }
}

// future wraps a function who's callback only takes one parameter - the return value (no error is available)
// eg: function(result) {}
Future.wrapSingleParameter = function() {
    if(arguments.length === 1) {
        var fn = arguments[0]
    } else {
        var object = arguments[0]
        var method = arguments[1]
        var fn = object[method]
    }

    return function() {
        var args = Array.prototype.slice.call(arguments)
		var future = new Future
		args.push(function(result) {
		    future.return(result)
		})
		var me = this
        if(object) me = object
        fn.apply(me, args)
		return future
    }
}


// default
var unhandledErrorHandler = function(e) {
    setTimeout(function() {
        throw e
    },0)
}

// setup unhandled error handler
// unhandled errors happen when done is called, and  then an exception is thrown from the future
Future.error = function(handler) {
    unhandledErrorHandler = handler
}

// instance methods

// returns a value for the future (can only be executed once)
// if there are callbacks waiting on this value, they are run in the next tick
    // (ie they aren't run immediately, allowing the current thread of execution to complete)
Future.prototype.return = function(v) {
    resolve(this, 'return', v)
}
Future.prototype.throw = function(e) {
    if(this.location !== undefined) {
        e.stack += '\n    ---------------------------\n'+this.location.stack.split('\n').slice(4).join('\n')
    }
    resolve(this, 'error', e)
    return this
}

function setNext(that, future) {
    resolve(that, 'next', future)
}

function wait(that, cb) {
    if(that.isResolved) {
        executeCallbacks(that, [cb])
    } else {
        that.queue.push(cb)
    }
}

// duck typing to determine if something is or isn't a future
var isLikeAFuture = Future.isLikeAFuture = function(x) {
    return x.isResolved !== undefined && x.queue !== undefined && x.then !== undefined
}

function waitOnResult(f, result, cb) {
    wait(result, function() {
        if(this.hasError) {
            f.throw(this.error)
        } else if(this.hasNext) {
            waitOnResult(f, this.next, cb)
        } else {
            try {
                setNext(f, executeCallback(cb,this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
}


// cb takes one parameter - the value returned
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.then = function(cb) {
    var f = createChainFuture(this)
    wait(this, function() {
        if(this.hasError)
            f.throw(this.error)
        else if(this.hasNext)
            waitOnResult(f, this.next, cb)
        else {
            try {
                setNext(f, executeCallback(cb,this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
    return f
}
// cb takes one parameter - the error caught
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.catch = function(cb) {
    var f = createChainFuture(this)
    wait(this, function() {
        if(this.hasError) {
            try {
                setNext(f, executeCallback(cb,this.error))
            } catch(e) {
                f.throw(e)
            }
        } else if(this.hasNext) {
            this.next.then(function(v) {
                f.return(v)
            }).catch(function(e) {
                try {
                    setNext(f, executeCallback(cb,e))
                } catch(e) {
                    f.throw(e)
                }
            })
        } else {
            f.return(this.result)
        }
    })
    return f
}
// cb takes no parameters
// callback's return value is ignored, but thrown exceptions propogate normally
Future.prototype.finally = function(cb) {
    var f = createChainFuture(this)
    wait(this, function() {
        try {
            var that = this
            if(this.hasNext) {
                this.next.then(function(v) {
                    var x = executeCallback(cb)
                    f.return(v)
                    return x
                }).catch(function(e) {
                    var x = executeCallback(cb)
                    f.throw(e)
                    return x
                }).done()
            } else if(this.hasError) {
                Future(true).then(function() {
                    return executeCallback(cb)
                }).then(function() {
                    f.throw(that.error)
                }).catch(function(e) {
                    f.throw(e)
                }).done()

            } else  {
                Future(true).then(function() {
                    return executeCallback(cb)
                }).then(function() {
                    f.return(that.result)
                }).catch(function(e) {
                    f.throw(e)
                }).done()
            }
        } catch(e) {
            f.throw(e)
        }
    })
    return f
}

// a future created for the chain functions (then, catch, and finally)
function createChainFuture(that) {
    var f = new Future
    f.n = that.n + 1
    if(Future.debug) {
        f.location = createException()  // used for long traces
    }
    return f
}

// all unused futures should end with this (e.g. most then-chains)
// detatches the future so any propogated exception is thrown (so the exception isn't silently lost)
Future.prototype.done = function() {
    wait(this, function() {
        if(this.hasError) {
            unhandledErrorHandler(this.error)
        } else if(this.hasNext) {
            this.next.catch(function(e) {
                unhandledErrorHandler(e)
            })
        }
    })
}



Future.prototype.resolver = function() {
    var me = this

    return function(e,v) {
        if(e) { // error argument
            me.throw(e)
        } else {
            me.return(v)
        }
    }
}

Future.prototype.resolved = function() {
    return this.isResolved
}


function resolve(that, type, value) {
    if(that.isResolved)
        throw Error("Future resolved more than once! Resolution: "+value)

    that.isResolved = true
    that.hasError = type === 'error'
    that.hasNext = type === 'next' && value !== undefined

    if(that.hasError)
        that.error = value
    else if(that.hasNext)
        that.next = value
    else
        that.result = value

    // 100 is a pretty arbitrary number - it should be set significantly lower than common maximum stack depths, and high enough to make sure performance isn't significantly affected
    // in using this for deadunit, firefox was getting a recursion error at 150, but not at 100. This doesn't mean that it can't happen at 100 too, but it'll certainly make it less likely
    // if you're getting recursion errors even with this mechanism, you probably need to figure that out in your own code
    if(that.n % 100 !== 0) {
        executeCallbacks(that, that.queue)
    } else {
        setTimeout(function() { // this prevents too much recursion errors
            executeCallbacks(that, that.queue)
        }, 0)
    }
}

function executeCallbacks(that, callbacks) {
    if(callbacks.length > 0) {
        try {
            callbacks.forEach(function(cb) {
                cb.apply(that)
            })
        } catch(e) {
            unhandledErrorHandler(e)
        }
    }
}

// executes a callback and ensures that it returns a future
function executeCallback(cb, arg) {
    var r = cb(arg)
    if(r !== undefined && !isLikeAFuture(r) )
        throw Error("Value returned from then or catch ("+r+") is *not* a Future. Callback: "+cb.toString())

    return r
}

function createException() {
    try {
        throw new Error()
    } catch(e) {
        return e
    }
}

/***/ }),
/* 7 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/array-set.js ***!
  \*********************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(/*! ./util */ 0);
var has = Object.prototype.hasOwnProperty;

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = util.toSetString(aStr);
  var isDuplicate = has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    this._set[sStr] = idx;
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  var sStr = util.toSetString(aStr);
  return has.call(this._set, sStr);
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  var sStr = util.toSetString(aStr);
  if (has.call(this._set, sStr)) {
    return this._set[sStr];
  }
  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;


/***/ }),
/* 8 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/base64-vlq.js ***!
  \**********************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = __webpack_require__(/*! ./base64 */ 24);

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};


/***/ }),
/* 9 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/source-map-generator.js ***!
  \********************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = __webpack_require__(/*! ./base64-vlq */ 8);
var util = __webpack_require__(/*! ./util */ 0);
var ArraySet = __webpack_require__(/*! ./array-set */ 7).ArraySet;
var MappingList = __webpack_require__(/*! ./mapping-list */ 26).MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),
/* 10 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit/basicFormatter.js ***!
  \****************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var Future = __webpack_require__(/*! async-future */ 4)

// built in test formatting helper
module.exports = function(unitTest, printOnTheFly/*, [consoleColors,] format*/) {
    if(arguments.length === 3) {
        var format = arguments[2]
    } else /* if(arguments.length > 3) */{
        var color = arguments[2]
        var format = arguments[3]
    }

    var dotText = '.'
    if(color !== undefined) {
        dotText = color.green('.')
    }

    var result = new Future

    var lastPrintWasDot = false
    var printDot = function(dot) {
        if(dot) {
            process.stdout.write(dotText)
        } else if(lastPrintWasDot) {
            process.stdout.write('\n')
        }

        lastPrintWasDot = dot
    }

    var ended = false
    var events = {
        end: function(e) {
            ended = true
            if(printOnTheFly) printDot(false)

            var results = unitTest.results()
            result.return(formatGroup(results, format, 0).result)

            if(format.end !== undefined)
                format.end()
        }
    }

    if(printOnTheFly) {
        var groups = {}
        events.assert = function(e) {
            printDot(e.success && !ended)
            if(e.success) {
                groups[e.parent].testSuccesses++
                groups[e.parent].assertSuccesses++
            } else {
                groups[e.parent].testFailures++
                groups[e.parent].assertFailures++
            }

            if(!e.success || ended) {
                console.log(format.assert(e, undefined, true))
            }
        }
        events.exception = function(e) {
            printDot(false)
            groups[e.parent].exceptions++

            console.log(format.exception(e.error, true))
        }
        events.log = function(e) {
            printDot(false)
            console.log(format.log(e.values, true))
        }
        events.group = function(g) {
            groups[g.id] = {parent: g.parent, name: g.name, testSuccesses: 0, testFailures: 0, assertSuccesses: 0, assertFailures: 0, exceptions: 0}
        }
        events.groupEnd = function(g) {
            var parent = groups[g.id].parent
            if(parent !== undefined) {
                printDot(false)
                if(groups[g.id].testFailures === 0 && groups[g.id].assertFailures === 0 && groups[g.id].exceptions === 0) {
                    groups[parent].testSuccesses++
                } else {
                    groups[parent].testFailures++
                }

                console.log(format.group(groups[g.id].name, undefined, groups[g.id].testSuccesses,groups[g.id].testFailures,groups[g.id].assertSuccesses,groups[g.id].assertFailures,
                                        groups[g.id].exceptions, [], [], 1, false, true))
            }
        }
    }

    unitTest.events(events)

    return result
}

function formatGroup(testResults, format, nestingLevel) {
    var assertSuccesses = 0
    var assertFailures = 0
    var exceptions = 0

    var testCaseSuccesses= 0, testCaseFailures=0;

    var results = []
    testResults.results.forEach(function(result) {
        if(result.type === 'assert') {
            if(result.success) {
                testCaseSuccesses++
                assertSuccesses ++
            } else {
                testCaseFailures++
                assertFailures++
            }

            results.push(format.assert(result, testResults.name, false))

        } else if(result.type === 'group') {
            var group = formatGroup(result, format, nestingLevel+1)
            exceptions+= group.exceptions

            if(group.failures === 0 && group.exceptions === 0)
                testCaseSuccesses++
            else
                testCaseFailures++

            results.push(group.result)
            assertSuccesses+= group.assertSuccesses
            assertFailures+= group.assertFailures

        } else if(result.type === 'log') {
            results.push(format.log(result.values, false))
        } else {
            throw new Error("Unknown result type: "+result.type)
        }
    })

    var exceptionResults = []
    testResults.exceptions.forEach(function(e) {
        exceptionResults.push(format.exception(e, false))
    })

    exceptions+= testResults.exceptions.length

    var formattedGroup = format.group(testResults.name, testResults.duration,
                                      testCaseSuccesses, testCaseFailures,
                                      assertSuccesses, assertFailures, exceptions,
                                      results, exceptionResults, nestingLevel, testResults.timeout, false)
    return {result: formattedGroup,
            successes: testCaseSuccesses,
            failures: testCaseFailures,
            assertSuccesses: assertSuccesses,
            assertFailures: assertFailures,
            exceptions: exceptions
    }
}


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../process/browser.js */ 1)))

/***/ }),
/* 11 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit/defaultFormats.js ***!
  \****************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var Future = __webpack_require__(/*! async-future */ 4)

var formatBasic = __webpack_require__(/*! ./basicFormatter */ 10)
var indent = __webpack_require__(/*! ./indent */ 37)
var utils = __webpack_require__(/*! ./utils */ 39)

// unitTest is a deadunit-core UnitTest object
// if consoleColoring is true, the string will contain console color annotations
// if printOnTheFly is true, test results will be printed to the screen in addition to being returned
// returns a future containing a string with the final results
exports.text = function textOutput(unitTest, consoleColors, printOnTheFly, printLateEvents) {
    if(printLateEvents === undefined) printLateEvents = true

    function color(theColor, theString) {
        if(consoleColors !== undefined)
            return consoleColors[theColor](theString.toString())
        else
            return theString.toString()
    }

    var warningHasBeenPrinted = false
    function lateEventsWarning() {
        if(ended && !warningHasBeenPrinted && printLateEvents) {
            warningHasBeenPrinted = true

            return color('red',
                'Test results were accessed before asynchronous parts of tests were fully complete'
                +" If you have tests with asynchronous parts, make sure to use `this.count` to declare how many assertions you're waiting for."
            )+'\n\n'
        } else {
            return ''
        }
    }


    var ended = false
    return formatBasic(unitTest, printOnTheFly, consoleColors, {
        group: function(name, totalDuration, testSuccesses, testFailures,
                              assertSuccesses, assertFailures, exceptions,
                              testResults, exceptionResults, nestingLevel, timedOut, onTheFly) {

            var total = testSuccesses+testFailures

            var addResults = function() {
                var result = ''
                if(testResults.length > 0)
                    result += '\n'+indent('   ', testResults.join('\n'))
                if(exceptionResults.length > 0)
                    result += '\n'+indent('   ', exceptionResults.join('\n'))
                return result
            }


            var testColor, exceptionColor, failColor, finalColor
            testColor = exceptionColor = failColor = finalColor = 'green'
            if(testFailures > 0) {
                testColor = failColor = finalColor = 'red'
            }
            if(exceptions > 0) {
                finalColor = 'red'
                exceptionColor = 'magenta'
            }

            var durationText = utils.timeText(totalDuration)

            if(nestingLevel === 0) {
                var resultsLine = ''

                if(name) resultsLine += color('cyan', name+' - ')



                resultsLine += color(finalColor, testSuccesses+'/'+(testSuccesses+testFailures)+' successful tests. ')+
                        color('green', assertSuccesses+' pass'+utils.plural(assertSuccesses,"es",""))+
                        ', '+color(failColor, assertFailures+' fail'+utils.plural(assertFailures))+
                        ', and '+color(exceptionColor, exceptions+' exception'+utils.plural(exceptions))+"."
                        +color('grey', " Took "+durationText+".")

                var result = ''
                if(name) result += color('cyan', name)+'\n'
                result += addResults()
                result += '\n\n'+resultsLine

                if(timedOut) {
                    result += color('red', '\n    The test timed out')
                }
            } else {
                if(!name) name = "<unnamed test>"
                var result = color(finalColor, name)+':           '
                                +color(testColor, testSuccesses+'/'+total)
                                +" and "+color(exceptionColor, exceptionResults.length+" exception"+utils.plural(exceptionResults.length))
                                +color('grey', " took "+durationText)
                result += addResults()
            }

            return lateEventsWarning()+result
        },
        assert: function(result, test, onTheFly) {
            if(result.success) {
                var word = "Ok!  ";
                var c = 'green'
            } else {
                var word = "Fail:";
                var c = 'red'
            }

            var linesDisplay = result.sourceLines
            if(result.sourceLines.indexOf("\n") !== -1) {
                linesDisplay = "\n"+linesDisplay;
            }

            var expectations = ""
            if(!result.success && (result.actual !== undefined || result.expected !== undefined)) {
                var things = []
                if(result.expected !== undefined)
                    things.push("Expected "+utils.valueToMessage(result.expected))
                if(result.actual !== undefined)
                    things.push("Got "+utils.valueToMessage(result.actual))

                expectations = " - "+things.join(', ')
            }

            var column = ''
            if(result.column !== undefined) {
                column = color('grey', ":"+result.column)
            }

            return lateEventsWarning()+color(c, word)+" ["+color('grey', result.file)+" "+result.line+column+"] "
                        +color(c, linesDisplay)
                        +expectations
        },
        exception: function(e, onTheFly) {
            return lateEventsWarning()+color('red', 'Exception: ')
                        +color('magenta', utils.errorToString(e))
        },
        log: function(values, onTheFly) {
            return lateEventsWarning()+values.map(function(v) {
                return utils.valueToString(v)
            }).join(', ')
        },
        end: function() {
            ended = true
        }
    })
}


var htmlColors = exports.htmlColors = {
    red: 'rgb(200,30,30)',
    darkRed: 'rgb(90,0,0)',
    lightRed: 'rgb(255,210,230)',

    black: 'rgb(20,20,20)',
    white: 'rgb(240,220,220)',
    gray: 'rgb(185, 180, 180)',

    green: 'rgb(0,100,20)',
    brightGreen: 'rgb(0,200,50)',

    purple: 'rgb(190,0,160)',
    brightPurple: 'rgb(255,126,255)',

    blue: 'rgb(0, 158, 173)',
    brightBlue: 'rgb(0, 233, 255)',

    yellow: 'rgb(210,182,0)',
    darkYellow: 'rgb(106,93,0)'
}

var red = htmlColors.red
var darkRed = htmlColors.darkRed
var lightRed = htmlColors.lightRed
var black = htmlColors.black
var white = htmlColors.white
var green = htmlColors.green
var brightGreen = htmlColors.brightGreen
var purple = htmlColors.purple
var brightPurple = htmlColors.brightPurple
var blue = htmlColors.blue
var brightBlue = htmlColors.brightBlue
var gray = htmlColors.gray


exports.html = function(unitTest, printLateEvents) {
    if(printLateEvents === undefined) printLateEvents = true

    var getTestDisplayer = function() {
        return {
            onToggle: function(displayNone, $bgcolor, innerSelector, outerSelector) {
                if(displayNone == true) {
                    $(innerSelector).css({"display":""});
                    if(outerSelector != undefined) {
                        $(outerSelector).css({"border":"1px solid "+$bgcolor});
                    }
                } else {
                    $(innerSelector).css({"display":"none"});
                    if(outerSelector != undefined) {
                        $(outerSelector).css({"border":""});
                    }
                }
            }
        }
    }


    var formattedTestHtml = formatBasic(unitTest, false, {
        group: function(name, totalDuration, testSuccesses, testFailures,
                          assertSuccesses, assertFailures, exceptions,
                          testResults, exceptionResults, nestingLevel, timedOut) {

            var total = testSuccesses+testFailures
            var mainId = getMainId(name)

            if(testFailures > 0 || exceptions > 0) {
                var bgcolor=red;
                var show = "true";
                var foregroundColor = lightRed
            } else {
                var bgcolor=green;
                var show = "false";
                var foregroundColor = brightGreen
            }

            var durationText = utils.timeText(totalDuration)

            if(nestingLevel === 0) {

                var initTestGroup = function(mainId, bgcolor, show) {
                    $(function()
                    {	$('#'+mainId).css({"border-color":"'+bgcolor+'"});
                        TestDisplayer.onToggle(show, bgcolor, '#'+mainId);

                        $('#'+mainId+'_final').click(function()
                        {	TestDisplayer.onToggle($('#'+mainId).css("display") == "none", bgcolor, '#'+mainId);
                        });
                    });
                }

                var nameLine = "", titleLine = ''
                if(name) {
                    titleLine = '<h1 class="primaryTitle">'+name+'</h1>'
                    nameLine = name+' - '
                }

                var timeoutNote = ""
                if(timedOut) {
                    timeoutNote = 'The test timed out'
                }

                return titleLine+
                       '<div class="testResultsArea" id="'+mainId+'">'+
                            testResults.join('\n')+
                            exceptionResults.join('\n')+"\n"+
                            '<div style="color:'+red+'">'+timeoutNote+'</div>'+
                       '</div>'+
                       '<div class="testResultsBar link" style="border:2px solid '+bgcolor+';" id="'+mainId+'_final">'+
                            '<div class="testResultsBarInner" style="background-color:'+bgcolor+';">'+
                                '<div style="float:right;"><i>click on this bar</i></div>'+
                                '<div><span class="testResultsName">'+nameLine+'</span>' + testSuccesses+'/'+total+' successful tests. '+
                                '<span style="color:'+brightGreen+'">'+assertSuccesses+' pass'+utils.plural(assertSuccesses,"es","")+'</span>'+
                                ', <span style="color:'+darkRed+'">'+assertFailures+' fail'+utils.plural(assertFailures)+'</span>'+
                                ', and <span style="color:'+brightPurple+'">'+exceptions+' exception'+utils.plural(exceptions)+'</span>'+
                                '. <span style="color: '+white+'">Took '+durationText+".</span>"+
                            '</div>'+
                       '</div>'+

                       '<script>;('+initTestGroup+')("'+mainId+'", "'+bgcolor+'", '+show+')</script>'+
                       '</div>'

            } else {
                var n = getNewNumber()

                var testId = mainId+n

                var initTest = function(mainId, bgcolor, show, n) {
                    $(function()
                    {	$('#'+mainId).css({borderColor:bgcolor});
                        TestDisplayer.onToggle(show, bgcolor, '#'+mainId+n+'_inner', '#'+mainId+n);

                        $('.'+mainId+n+'_status').click(function()
                        {	TestDisplayer.onToggle
                            (	$('#'+mainId+n+'_inner').css("display") == "none",
                                bgcolor,
                                '#'+mainId+n+'_inner',
                                '#'+mainId+n+''
                            );
                        });
                    });
                }

                if(!name) name = "<unnamed test>"

                return '<div class="resultsArea" id="'+mainId+n+'">'+
                            '<div class="resultsBar link '+mainId+n+'_status" style="background-color:'+bgcolor+';color:'+foregroundColor+'">'+
                                name+': &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
                                testSuccesses+'/'+total+" and "+exceptions+" exception"+utils.plural(exceptions)
                                +' <span style="color: white">took '+durationText+'</span>'+
                            '</div>'+
                            '<div class="resultsAreaInner" id="'+testId+'_inner">'+
                                '<h2 class="'+testId+'_status link" style="color:'+bgcolor+';">'+name+'</h2>'+
                                testResults.join('\n')+"\n"+
                                exceptionResults.join('\n')+"\n"+
                            '</div>'+
                            '<script>;('+initTest+')("'+mainId+'", "'+bgcolor+'", '+show+', '+n+')</script>'+
                      '</div>';
            }
        },
        assert: function(result) {
            if(false === result.success) {
                var color = red;
                var word = "Fail:";
            } else {
                var color = green;
                var word = "Ok!";
            }

            var linesDisplay = "<i>"+utils.textToHtml(result.sourceLines)+"</i>";
            if(result.sourceLines.indexOf("\n") !== -1) {
                linesDisplay = "<br>\n"+linesDisplay;
            }

            var expectations = ""
            if(!result.success && (result.actual !== undefined || result.expected !== undefined)) {
                var things = []
                if(result.expected !== undefined)
                    things.push("Expected "+utils.textToHtml(utils.valueToMessage(result.expected)))
                if(result.actual !== undefined)
                    things.push("Got "+utils.textToHtml(utils.valueToMessage(result.actual)))

                expectations = " - "+things.join(', ')
            }

            var column = ''
            if(result.column !== undefined) {
                column = ":"+result.column
            }

            return '<div style="color:'+color+';"><span >'+word+'</span>'+
                        " <span class='locationOuter'>[<span class='locationInner'>"
                                +result.file+" line <span class='lineNumber'>"+result.line+"</span>"+column+"</span>]"
                        +"</span> "
                    +linesDisplay
                    +' <span class="expectations">'+expectations+'</span>'
            +"</div>"
        },
        exception: function(exception) {
            var formattedException = utils.textToHtml(utils.errorToString(exception))
            return '<div style="color:'+purple+';">Exception: '+formattedException+'</div>'
        },
        log: function(values) {
            return '<div>'
                +values.map(function(v) {
                    return utils.textToHtml(utils.valueToString(v))
                }).join(', ')
            +'</div>'

        }
    })

    return formattedTestHtml.then(function(formattedHtml) {
        return Future('<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>'+
        '<style>\
            body{\
                background-color: '+black+';\
                color: '+white+';\
            }\
            h2{\
                margin-bottom: 5px;\
                margin-top: 10px;\
            }\
            .green\
            {   color: '+green+';\
            }\
            .link\
            {   cursor:pointer;\
            }\
            .primaryTitle {\
                color: '+blue+';\
            }\
            .testResultsName {\
                color: '+brightBlue+';\
            }\
            .asyncTime {\
                color: '+gray+';\
            }\
            .resultsArea{\
                margin:1px;\
                margin-bottom: 5px;\
            }\
                .resultsAreaInner{\
                    padding:0 8px;\
                }\
                .resultsBar{\
                    color:white;\
                    margin-bottom:4px;\
                    padding: 1px 3px;\
                }\
            .testResultsArea{\
                padding:0 8px;\
            }\
            .testResultsBar{\
                background-color:'+black+';color:white;margin:4px 0;\
            }\
                .testResultsBarInner{\
                    color:white;margin:1px;padding: 1px 3px;\
                }\
                \
            .locationOuter{\
                color:'+white+';\
            }\
            .locationInner, .expectations {\
                color:'+gray+';\
            }\
            .lineNumber{\
                color:'+white+';\
            }\
         </style>'+
        '<script type="text/javascript">                      \
             var TestDisplayer = ('+getTestDisplayer+')() \
          </script>'
        +formattedHtml)
    })
}

var nextId = 0
var getMainId = function(name) {
    nextId++
    return 'unitTest_'+nextId//+name.replace(/[^a-zA-Z]/g, "") // get rid of all characters except letters
}
var getNewNumber = function() {
    getNewNumber.n++
    return getNewNumber.n
}
getNewNumber.n = 0



/***/ }),
/* 12 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/events/events.js ***!
  \******************************************************************************/
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 13 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit/deadunit.node.js ***!
  \***************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2014 Billy Tetrud - Free to use for any purpose: MIT License*/

var deadunitInternal = __webpack_require__(/*! ./deadunit.internal */ 36)
var defaultFormats = __webpack_require__(/*! ./defaultFormats */ 11)
var color = __webpack_require__(/*! colors/safe */ 5)

module.exports = deadunitInternal({
    deadunitCore: __webpack_require__(/*! deadunit-core/src/deadunitCore.node */ 33),

    environmentSpecificMethods: function() {

        this.string = function(colorize) {
            if(colorize === true) var colorModule = color
            return defaultFormats.text(this, colorModule, /*printOnTheFly=*/false, /*printLateEvents=*/false)
        }

        this.writeConsole = function(hangingTimeout) {
            if(hangingTimeout === undefined) hangingTimeout = 100

            var test = this
            return defaultFormats.text(this, __webpack_require__(/*! colors/safe */ 5), /*printOnTheFly=*/true, /*printLateEvents=*/true).then(function(finalResults) {
                console.log('\nFinal test results:')
                console.log(finalResults)

                if(hangingTimeout !== 0) {
                    setTimeout(function() {
                        var name = test.results().name
                        console.log(color.red("Script is hanging (lasted more than "+hangingTimeout+"ms after test "
                                    +"\""+name+"\" finished printing)"))
                    }, hangingTimeout).unref() // note: unref is only available in node.js
                }
            })
        }
    }
})


/***/ }),
/* 14 */
/* unknown exports provided */
/* all exports used */
/*!***************************!*\
  !*** ../EventEmitterB.js ***!
  \***************************/
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(/*! events */ 12).EventEmitter
var proto = __webpack_require__(/*! proto */ 41)

module.exports = proto(EventEmitter, function(superclass) {

    this.init = function() {
        superclass.apply(this, arguments)

        this.ifonHandlers = {}
        this.ifoffHandlers = {}
        this.ifonAllHandlers = []
        this.ifoffAllHandlers = []
    }

    // callback will be triggered immediately if there is already a listener attached, or
    // callback will be triggered when the first listener for the event is added
    // (regardless of whether its done through on or once)
    // parameters can be:
        // event, callback - attach an ifon handler for the passed event
        // callback - attach an ifon handler for all events
    this.ifon = function(event, callback) {
        if(event instanceof Function) {     // event not passed, only a callback
            callback = event // fix the argument
            for(var eventName in this._events) {
                if(this.listeners(eventName).length > 0) {
                    callback(eventName)
                }
            }
        } else if(this.listeners(event).length > 0) {
            callback(event)
        }

        addHandlerToList(this, 'ifonHandlers', event, callback)
    }

    // removes either:
        // removeIfon() - all ifon handlers (if no arguments are passed), or
        // removeIfon(event) - all ifon handlers for the passed event, or
        // removeIfon(callback) - the passed ifon-all handler (if the first parameter is the callback)
        // removeIfon(event, callback) - the specific passed callback for the passed event
    this.removeIfon = function(event, callback) {
        removeFromHandlerList(this, 'ifonHandlers', event, callback)
    }

    // callback will be triggered when the last listener for the 'click' event is removed (will not trigger immediately if there is no event listeners on call of ifoff)
    // (regardless of whether this is done through removeListener or as a result of 'once' being fulfilled)
    // parameters can be:
        // event, callback - attach an ifoff handler for the passed event
        // callback - attach an ifoff handler for all events
    this.ifoff = function(event, callback) {
        addHandlerToList(this, 'ifoffHandlers', event, callback)
    }

    // removes either:
        // removeIfoff() - all ifoff handlers (if no arguments are passed), or
        // removeIfoff(event) - all ifoff handlers for the passed event, or
        // removeIfoff(callback) - the passed ifoff-all handler (if the first parameter is the callback)
        // removeIfoff(event, callback) - the specific passed callback for the passed event
    this.removeIfoff = function(event, callback) {
        removeFromHandlerList(this, 'ifoffHandlers', event, callback)
    }

    // emitter is the emitter to proxy handler binding to
    // options can have one of the following properties:
        // only - an array of events to proxy
        // except - an array of events to *not* proxy
    this.proxy = function(emitter, options) {
        if(options === undefined) options = {}
        if(options.except !== undefined) {
            var except = arrayToMap(options.except)
            var handleIt = function(event){return !(event in except)}
        } else if(options.only !== undefined) {
            var only = arrayToMap(options.only)
            var handleIt = function(event){return event in only}
        } else {
            var handleIt = function(){return true}
        }

        var that = this, handler;
        this.ifon(function(event) {
            if(handleIt(event)) {
                emitter.on(event, handler = function() {
                    that.emit.apply(that, [event].concat(Array.prototype.slice.call(arguments)))
                })
            }
        })
        this.ifoff(function(event) {
            if(handleIt(event))
                emitter.off(event, handler)
        })
    }

    /*override*/ this.on = this.addListener = function(event, callback) {
        var triggerIfOn = this.listeners(event).length === 0
        superclass.prototype.on.apply(this,arguments)
        if(triggerIfOn) triggerIfHandlers(this, 'ifonHandlers', event)
    }

    /*override*/ this.off = this.removeListener = function(event, callback) {
        var triggerIfOff = this.listeners(event).length === 1
        superclass.prototype.removeListener.apply(this,arguments)
        if(triggerIfOff) triggerIfHandlers(this, 'ifoffHandlers', event)
    }
    /*override*/ this.removeAllListeners = function(event) {
        var triggerIfOffForEvents = []
        if(event !== undefined) {
            if(this.listeners(event).length > 0) {
                triggerIfOffForEvents.push(event)
            }
        } else {
            for(var event in this._events) {
                if(this.listeners(event).length > 0) {
                    triggerIfOffForEvents.push(event)
                }
            }
        }

        superclass.prototype.removeAllListeners.apply(this,arguments)

        for(var n=0; n<triggerIfOffForEvents.length; n++) {
            triggerIfHandlers(this, 'ifoffHandlers', triggerIfOffForEvents[n])
        }
    }

})


// triggers the if handlers from the normal list and the "all" list
function triggerIfHandlers(that, handlerListName, event) {
    triggerIfHandlerList(that[handlerListName][event], event)
    triggerIfHandlerList(that[normalHandlerToAllHandlerProperty(handlerListName)], event)
}


// triggers the if handlers from a specific list
// ya these names are confusing, sorry : (
function triggerIfHandlerList(handlerList, event) {
    if(handlerList !== undefined) {
        for(var n=0; n<handlerList.length; n++) {
            handlerList[n](event)
        }
    }
}

function addHandlerToList(that, handlerListName, event, callback) {
    if(event instanceof Function) {
        // correct arguments
        callback = event
        event = undefined
    }

    if(event !== undefined && callback !== undefined) {
        var handlerList = that[handlerListName][event]
        if(handlerList === undefined) {
            handlerList = that[handlerListName][event] = []
        }

        handlerList.push(callback)
    } else {
        that[normalHandlerToAllHandlerProperty(handlerListName)].push(callback)
    }
}

function removeFromHandlerList(that, handlerListName, event, callback) {
    if(event instanceof Function) {
        // correct arguments
        callback = event
        event = undefined
    }

    if(event !== undefined && callback !== undefined) {
        removeCallbackFromList(that[handlerListName][event], callback)
    } else if(event !== undefined) {
        delete that[handlerListName][event]
    } else if(callback !== undefined) {
        var allHandlerListName = normalHandlerToAllHandlerProperty(handlerListName)
        removeCallbackFromList(that[allHandlerListName], callback)
    } else {
        var allHandlerListName = normalHandlerToAllHandlerProperty(handlerListName)
        that[handlerListName] = {}
        that[allHandlerListName] = []
    }
}

function normalHandlerToAllHandlerProperty(handlerListName) {
    if(handlerListName === 'ifonHandlers')
        return 'ifonAllHandlers'
    if(handlerListName === 'ifoffHandlers')
        return 'ifoffAllHandlers'
}

function removeCallbackFromList(list, callback) {
    var index = list.indexOf(callback)
    list.splice(index,1)
}

function getTrace() {
    try {
        throw new Error()
    } catch(e) {
        return e
    }
}

// turns an array of values into a an object where those values are all keys that point to 'true'
function arrayToMap(array) {
    var result = {}
    array.forEach(function(v) {
        result[v] = true
    })
    return result
}


/***/ }),
/* 15 */
/* unknown exports provided */
/* all exports used */
/*!************************!*\
  !*** ./~/testUtils.js ***!
  \************************/
/***/ (function(module, exports) {



// you define the functions up front, and when you call the return value, it passes the arguments you call it with to the functions in sequence
// returns a function that, each time its called, calls the next function in the list with the passed argument
// example:
/*
 var sequenceX = testUtils.seq(
 function(x) {
 t.ok(x === 'a')
 },
 function(x) {
 t.ok(x === 'b')
 },
 function(x) {
 t.ok(x === 'c')
 })

 var obj = {a:1,b:2,c:3}
 for(var x in obj) {
 sequenceX(x)
 }
 */
exports.seq = function (/*functions*/) {
    var n=-1
    var fns = arguments
    return function() {
        n++
        if(n>=fns.length)
            throw new Error("Unexpected call "+n+". Arguments: "+Array.prototype.slice.call(arguments))
        // else
        fns[n].apply(this,arguments)
    }
}

/***/ }),
/* 16 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/colors ***!
  \********************************************************************/
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 16;

/***/ }),
/* 17 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/async-future/~/trimArguments/trimArguments.js ***!
  \***************************************************************************************************************************/
/***/ (function(module, exports) {

// resolves varargs variable into more usable form
// args - should be a function arguments variable
// returns a javascript Array object of arguments that doesn't count trailing undefined values in the length
module.exports = function(theArguments) {
    var args = Array.prototype.slice.call(theArguments, 0)

    var count = 0;
    for(var n=args.length-1; n>=0; n--) {
        if(args[n] === undefined)
            count++
    }
    args.splice(-0, count)
    return args
}

/***/ }),
/* 18 */
/* unknown exports provided */
/* all exports used */
/*!************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/colors ***!
  \************************************************************************************/
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 18;

/***/ }),
/* 19 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/colors/safe.js ***!
  \********************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var isHeadless = false;

if (typeof module !== 'undefined') {
  isHeadless = true;
}

if (!isHeadless) {
  var exports = {};
  var module = {};
  var colors = exports;
  exports.mode = "browser";
} else {
  exports.mode = "console";
}

//
// Prototypes the string object to have additional method calls that add terminal colors
//
var addProperty = function (color, func) {
  exports[color] = function (str) {
    return func.apply(str);
  };
};

function stylize(str, style) {

  var styles;

  if (exports.mode === 'console') {
    styles = {
      //styles
      'bold'      : ['\x1B[1m',  '\x1B[22m'],
      'italic'    : ['\x1B[3m',  '\x1B[23m'],
      'underline' : ['\x1B[4m',  '\x1B[24m'],
      'inverse'   : ['\x1B[7m',  '\x1B[27m'],
      'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
      //text colors
      //grayscale
      'white'     : ['\x1B[37m', '\x1B[39m'],
      'grey'      : ['\x1B[90m', '\x1B[39m'],
      'black'     : ['\x1B[30m', '\x1B[39m'],
      //colors
      'blue'      : ['\x1B[34m', '\x1B[39m'],
      'cyan'      : ['\x1B[36m', '\x1B[39m'],
      'green'     : ['\x1B[32m', '\x1B[39m'],
      'magenta'   : ['\x1B[35m', '\x1B[39m'],
      'red'       : ['\x1B[31m', '\x1B[39m'],
      'yellow'    : ['\x1B[33m', '\x1B[39m'],
      //background colors
      //grayscale
      'whiteBG'     : ['\x1B[47m', '\x1B[49m'],
      'greyBG'      : ['\x1B[49;5;8m', '\x1B[49m'],
      'blackBG'     : ['\x1B[40m', '\x1B[49m'],
      //colors
      'blueBG'      : ['\x1B[44m', '\x1B[49m'],
      'cyanBG'      : ['\x1B[46m', '\x1B[49m'],
      'greenBG'     : ['\x1B[42m', '\x1B[49m'],
      'magentaBG'   : ['\x1B[45m', '\x1B[49m'],
      'redBG'       : ['\x1B[41m', '\x1B[49m'],
      'yellowBG'    : ['\x1B[43m', '\x1B[49m']
    };
  } else if (exports.mode === 'browser') {
    styles = {
      //styles
      'bold'      : ['<b>',  '</b>'],
      'italic'    : ['<i>',  '</i>'],
      'underline' : ['<u>',  '</u>'],
      'inverse'   : ['<span style="background-color:black;color:white;">',  '</span>'],
      'strikethrough' : ['<del>',  '</del>'],
      //text colors
      //grayscale
      'white'     : ['<span style="color:white;">',   '</span>'],
      'grey'      : ['<span style="color:gray;">',    '</span>'],
      'black'     : ['<span style="color:black;">',   '</span>'],
      //colors
      'blue'      : ['<span style="color:blue;">',    '</span>'],
      'cyan'      : ['<span style="color:cyan;">',    '</span>'],
      'green'     : ['<span style="color:green;">',   '</span>'],
      'magenta'   : ['<span style="color:magenta;">', '</span>'],
      'red'       : ['<span style="color:red;">',     '</span>'],
      'yellow'    : ['<span style="color:yellow;">',  '</span>'],
      //background colors
      //grayscale
      'whiteBG'     : ['<span style="background-color:white;">',   '</span>'],
      'greyBG'      : ['<span style="background-color:gray;">',    '</span>'],
      'blackBG'     : ['<span style="background-color:black;">',   '</span>'],
      //colors
      'blueBG'      : ['<span style="background-color:blue;">',    '</span>'],
      'cyanBG'      : ['<span style="background-color:cyan;">',    '</span>'],
      'greenBG'     : ['<span style="background-color:green;">',   '</span>'],
      'magentaBG'   : ['<span style="background-color:magenta;">', '</span>'],
      'redBG'       : ['<span style="background-color:red;">',     '</span>'],
      'yellowBG'    : ['<span style="background-color:yellow;">',  '</span>']
    };
  } else if (exports.mode === 'none') {
    return str + '';
  } else {
    console.log('unsupported mode, try "browser", "console" or "none"');
  }
  return styles[style][0] + str + styles[style][1];
}

function applyTheme(theme) {

  Object.keys(theme).forEach(function (prop) {
      if (typeof(theme[prop]) === 'string') {
        addProperty(prop, function () {
          return exports[theme[prop]](this);
        });
      }
      else {
        addProperty(prop, function () {
          var ret = this;
          for (var t = 0; t < theme[prop].length; t++) {
            ret = exports[theme[prop][t]](ret);
          }
          return ret;
        });
      }
  });
}


//
// Iterate through all default styles and colors
//
var x = ['bold', 'underline', 'strikethrough', 'italic', 'inverse', 'grey', 'black', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta', 'greyBG', 'blackBG', 'yellowBG', 'redBG', 'greenBG', 'blueBG', 'whiteBG', 'cyanBG', 'magentaBG'];
x.forEach(function (style) {

  // __defineGetter__ at the least works in more browsers
  // http://robertnyman.com/javascript/javascript-getters-setters.html
  // Object.defineProperty only works in Chrome
  addProperty(style, function () {
    return stylize(this, style);
  });
});

function sequencer(map) {
  return function () {
    if (!isHeadless) {
      return this.replace(/( )/, '$1');
    }
    var exploded = this.split(""), i = 0;
    exploded = exploded.map(map);
    return exploded.join("");
  };
}

var rainbowMap = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return stylize(letter, rainbowColors[i++ % rainbowColors.length]);
    }
  };
})();

exports.themes = {};

exports.addSequencer = function (name, map) {
  addProperty(name, sequencer(map));
};

exports.addSequencer('rainbow', rainbowMap);
exports.addSequencer('zebra', function (letter, i, exploded) {
  return i % 2 === 0 ? letter : letter.inverse;
});

exports.setTheme = function (theme) {
  if (typeof theme === 'string') {
    exports.themes[theme] = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
    applyTheme(exports.themes[theme]);
    return exports.themes[theme];
  } else {
    applyTheme(theme);
  }
};


addProperty('stripColors', function () {
  return ("" + this).replace(/\x1B\[\d+m/g, '');
});

// please no
function zalgo(text, options) {
  var soul = {
    "up" : [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚'
    ],
    "down" : [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣'
    ],
    "mid" : [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉'
    ]
  },
  all = [].concat(soul.up, soul.down, soul.mid),
  zalgo = {};

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function is_char(character) {
    var bool = false;
    all.filter(function (i) {
      bool = (i === character);
    });
    return bool;
  }

  function heComes(text, options) {
    var result = '', counts, l;
    options = options || {};
    options["up"] = options["up"] || true;
    options["mid"] = options["mid"] || true;
    options["down"] = options["down"] || true;
    options["size"] = options["size"] || "maxi";
    text = text.split('');
    for (l in text) {
      if (is_char(l)) {
        continue;
      }
      result = result + text[l];
      counts = {"up" : 0, "down" : 0, "mid" : 0};
      switch (options.size) {
      case 'mini':
        counts.up = randomNumber(8);
        counts.min = randomNumber(2);
        counts.down = randomNumber(8);
        break;
      case 'maxi':
        counts.up = randomNumber(16) + 3;
        counts.min = randomNumber(4) + 1;
        counts.down = randomNumber(64) + 3;
        break;
      default:
        counts.up = randomNumber(8) + 1;
        counts.mid = randomNumber(6) / 2;
        counts.down = randomNumber(8) + 1;
        break;
      }

      var arr = ["up", "mid", "down"];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0 ; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  return heComes(text);
}


// don't summon zalgo
addProperty('zalgo', function () {
  return zalgo(this);
});

exports.transforms = x.concat(['rainbow', 'zebra', 'stripColors','zalgo'])

/***/ }),
/* 20 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/proto/proto.js ***!
  \********************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var noop = function() {}

var prototypeName='prototype', undefined, protoUndefined='undefined', init='init', ownProperty=({}).hasOwnProperty; // minifiable variables
function proto() {
    var args = arguments // minifiable variables

    if(args.length == 1) {
        var parent = {init: noop}
        var prototypeBuilder = args[0]

    } else { // length == 2
        var parent = args[0]
        var prototypeBuilder = args[1]
    }

    // special handling for Error objects
    var namePointer = {}    // name used only for Error Objects
    if([Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError].indexOf(parent) !== -1) {
        parent = normalizeErrorObject(parent, namePointer)
    }

    // set up the parent into the prototype chain if a parent is passed
    var parentIsFunction = typeof(parent) === "function"
    if(parentIsFunction) {
        prototypeBuilder[prototypeName] = parent[prototypeName]
    } else {
        prototypeBuilder[prototypeName] = parent
    }

    // the prototype that will be used to make instances
    var prototype = new prototypeBuilder(parent)
    namePointer.name = prototype.name

    // if there's no init, assume its inheriting a non-proto class, so default to applying the superclass's constructor.
    if(!prototype[init] && parentIsFunction) {
        prototype[init] = function() {
            parent.apply(this, arguments)
        }
    }

    // constructor for empty object which will be populated via the constructor
    var F = function() {}
        F[prototypeName] = prototype    // set the prototype for created instances

    var constructorName = prototype.name?prototype.name:''
    if(prototype[init] === undefined || prototype[init] === noop) {
        var ProtoObjectFactory = new Function('F',
            "return function " + constructorName + "(){" +
                "return new F()" +
            "}"
        )(F)
    } else {
        // dynamically creating this function cause there's no other way to dynamically name a function
        var ProtoObjectFactory = new Function('F','i','u','n', // shitty variables cause minifiers aren't gonna minify my function string here
            "return function " + constructorName + "(){ " +
                "var x=new F(),r=i.apply(x,arguments)\n" +    // populate object via the constructor
                "if(r===n)\n" +
                    "return x\n" +
                "else if(r===u)\n" +
                    "return n\n" +
                "else\n" +
                    "return r\n" +
            "}"
        )(F, prototype[init], proto[protoUndefined]) // note that n is undefined
    }

    prototype.constructor = ProtoObjectFactory;    // set the constructor property on the prototype

    // add all the prototype properties onto the static class as well (so you can access that class when you want to reference superclass properties)
    for(var n in prototype) {
        addProperty(ProtoObjectFactory, prototype, n)
    }

    // add properties from parent that don't exist in the static class object yet
    for(var n in parent) {
        if(ownProperty.call(parent, n) && ProtoObjectFactory[n] === undefined) {
            addProperty(ProtoObjectFactory, parent, n)
        }
    }

    ProtoObjectFactory.parent = parent;            // special parent property only available on the returned proto class
    ProtoObjectFactory[prototypeName] = prototype  // set the prototype on the object factory

    return ProtoObjectFactory;
}

proto[protoUndefined] = {} // a special marker for when you want to return undefined from a constructor

module.exports = proto

function normalizeErrorObject(ErrorObject, namePointer) {
    function NormalizedError() {
        var tmp = new ErrorObject(arguments[0])
        tmp.name = namePointer.name

        this.message = tmp.message
        if(Object.defineProperty) {
            /*this.stack = */Object.defineProperty(this, 'stack', { // getter for more optimizy goodness
                get: function() {
                    return tmp.stack
                },
                configurable: true // so you can change it if you want
            })
        } else {
            this.stack = tmp.stack
        }

        return this
    }

    var IntermediateInheritor = function() {}
        IntermediateInheritor.prototype = ErrorObject.prototype
    NormalizedError.prototype = new IntermediateInheritor()

    return NormalizedError
}

function addProperty(factoryObject, prototype, property) {
    try {
        var info = Object.getOwnPropertyDescriptor(prototype, property)
        if(info.get !== undefined || info.get !== undefined && Object.defineProperty !== undefined) {
            Object.defineProperty(factoryObject, property, info)
        } else {
            factoryObject[property] = prototype[property]
        }
    } catch(e) {
        // do nothing, if a property (like `name`) can't be set, just ignore it
    }
}

/***/ }),
/* 21 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map-resolve/~/resolve-url/resolve-url.js ***!
  \*****************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

void (function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof exports === "object") {
    module.exports = factory()
  } else {
    root.resolveUrl = factory()
  }
}(this, function() {

  function resolveUrl(/* ...urls */) {
    var numUrls = arguments.length

    if (numUrls === 0) {
      throw new Error("resolveUrl requires at least one argument; got none.")
    }

    var base = document.createElement("base")
    base.href = arguments[0]

    if (numUrls === 1) {
      return base.href
    }

    var head = document.getElementsByTagName("head")[0]
    head.insertBefore(base, head.firstChild)

    var a = document.createElement("a")
    var resolved

    for (var index = 1; index < numUrls; index++) {
      a.href = arguments[index]
      resolved = a.href
      base.href = resolved
    }

    head.removeChild(base)

    return resolved
  }

  return resolveUrl

}));


/***/ }),
/* 22 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map-resolve/~/source-map-url/source-map-url.js ***!
  \***********************************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// Copyright 2014 Simon Lydell

void (function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof exports === "object") {
    module.exports = factory()
  } else {
    root.sourceMappingURL = factory()
  }
}(this, function(undefined) {

  var innerRegex = /[#@] sourceMappingURL=([^\s'"]*)/
  var newlineRegex = /\r\n?|\n/

  var regex = RegExp(
    "(^|(?:" + newlineRegex.source + "))" +
    "(?:" +
      "/\\*" +
      "(?:\\s*(?:" + newlineRegex.source + ")(?://)?)?" +
      "(?:" + innerRegex.source + ")" +
      "\\s*" +
      "\\*/" +
      "|" +
      "//(?:" + innerRegex.source + ")" +
    ")" +
    "\\s*$"
  )

  function SourceMappingURL(commentSyntax) {
    this._commentSyntax = commentSyntax
  }

  SourceMappingURL.prototype.regex = regex
  SourceMappingURL.prototype._innerRegex = innerRegex
  SourceMappingURL.prototype._newlineRegex = newlineRegex

  SourceMappingURL.prototype.get = function(code) {
    var match = code.match(this.regex)
    if (!match) {
      return null
    }
    return match[2] || match[3] || ""
  }

  SourceMappingURL.prototype.set = function(code, url, commentSyntax) {
    if (!commentSyntax) {
      commentSyntax = this._commentSyntax
    }
    // Use a newline present in the code, or fall back to '\n'.
    var newline = String(code.match(this._newlineRegex) || "\n")
    var open = commentSyntax[0], close = commentSyntax[1] || ""
    code = this.remove(code)
    return code + newline + open + "# sourceMappingURL=" + url + close
  }

  SourceMappingURL.prototype.remove = function(code) {
    return code.replace(this.regex, "")
  }

  SourceMappingURL.prototype.insertBefore = function(code, string) {
    var match = code.match(this.regex)
    if (match) {
      var hasNewline = Boolean(match[1])
      return code.slice(0, match.index) +
        string +
        (hasNewline ? "" : "\n") +
        code.slice(match.index)
    } else {
      return code + string
    }
  }

  SourceMappingURL.prototype.SourceMappingURL = SourceMappingURL

  return new SourceMappingURL(["/*", " */"])

}));


/***/ }),
/* 23 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map-resolve/source-map-resolve.js ***!
  \**********************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

// Note: source-map-resolve.js is generated from source-map-resolve-node.js and
// source-map-resolve-template.js. Only edit the two latter files, _not_
// source-map-resolve.js!

void (function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! source-map-url */ 22), __webpack_require__(/*! resolve-url */ 21)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof exports === "object") {
    var sourceMappingURL = require("source-map-url")
    var resolveUrl = require("resolve-url")
    module.exports = factory(sourceMappingURL, resolveUrl)
  } else {
    root.sourceMapResolve = factory(root.sourceMappingURL, root.resolveUrl)
  }
}(this, function(sourceMappingURL, resolveUrl) {

  function callbackAsync(callback, error, result) {
    setImmediate(function() { callback(error, result) })
  }

  function sig(name, codeOrMap, url, read, callback) {
    var type = (name.indexOf("Sources") >= 0 ? "map" : "code")

    var throwError = function(num, what, got) {
      throw new Error(
        name + " requires argument " + num + " to be " + what + ". Got:\n" + got
      )
    }

    if (type === "map") {
      if (typeof codeOrMap !== "object" || codeOrMap === null) {
        throwError(1, "a source map", codeOrMap)
      }
    } else {
      if (typeof codeOrMap !== "string") {
        throwError(1, "some code", codeOrMap)
      }
    }
    if (typeof url !== "string") {
      throwError(2, "the " + type + " url", url)
    }
    if (typeof read !== "function") {
      throwError(3, "a reading function", read)
    }
    if (arguments.length === 1 + 4 && typeof callback !== "function") {
      throwError(4, "a callback function", callback)
    }
  }

  function parseMapToJSON(string) {
    return JSON.parse(string.replace(/^\)\]\}'/, ""))
  }



  function resolveSourceMap(code, codeUrl, read, callback) {
    sig("resolveSourceMap", code, codeUrl, read, callback)
    var mapData
    try {
      mapData = resolveSourceMapHelper(code, codeUrl)
    } catch (error) {
      return callbackAsync(callback, error)
    }
    if (!mapData || mapData.map) {
      return callbackAsync(callback, null, mapData)
    }
    read(mapData.url, function(error, result) {
      if (error) {
        return callback(error)
      }
      try {
        mapData.map = parseMapToJSON(String(result))
      } catch (error) {
        return callback(error)
      }
      callback(null, mapData)
    })
  }

  function resolveSourceMapSync(code, codeUrl, read) {
    sig("resolveSourceMapSync", code, codeUrl, read)
    var mapData = resolveSourceMapHelper(code, codeUrl)
    if (!mapData || mapData.map) {
      return mapData
    }
    mapData.map = parseMapToJSON(String(read(mapData.url)))
    return mapData
  }

  var dataUriRegex = /^data:([^,;]*)(;[^,;]*)*(?:,(.*))?$/
  var jsonMimeTypeRegex = /^(?:application|text)\/json$/

  function resolveSourceMapHelper(code, codeUrl) {
    var url = sourceMappingURL.get(code)
    if (!url) {
      return null
    }

    var dataUri = url.match(dataUriRegex)
    if (dataUri) {
      var mimeType = dataUri[1]
      var lastParameter = dataUri[2]
      var encoded = dataUri[3]
      if (!jsonMimeTypeRegex.test(mimeType)) {
        throw new Error("Unuseful data uri mime type: " + (mimeType || "text/plain"))
      }
      return {
        sourceMappingURL: url,
        url: null,
        sourcesRelativeTo: codeUrl,
        map: parseMapToJSON(lastParameter === ";base64" ? atob(encoded) : decodeURIComponent(encoded))
      }
    }

    var mapUrl = resolveUrl(codeUrl, url)
    return {
      sourceMappingURL: url,
      url: mapUrl,
      sourcesRelativeTo: mapUrl,
      map: null
    }
  }



  function resolveSources(map, mapUrl, read, callback) {
    sig("resolveSources", map, mapUrl, read, callback)
    var pending = map.sources.length
    var errored = false
    var sources = []

    var done = function(error) {
      if (errored) {
        return
      }
      if (error) {
        errored = true
        return callback(error)
      }
      pending--
      if (pending === 0) {
        callback(null, sources)
      }
    }

    resolveSourcesHelper(map, mapUrl, function(fullUrl, sourceContent, index) {
      if (typeof sourceContent === "string") {
        sources[index] = sourceContent
        callbackAsync(done, null)
      } else {
        read(fullUrl, function(error, result) {
          sources[index] = String(result)
          done(error)
        })
      }
    })
  }

  function resolveSourcesSync(map, mapUrl, read) {
    sig("resolveSourcesSync", map, mapUrl, read)
    var sources = []
    resolveSourcesHelper(map, mapUrl, function(fullUrl, sourceContent, index) {
      if (typeof sourceContent === "string") {
        sources[index] = sourceContent
      } else {
        sources[index] = String(read(fullUrl))
      }
    })
    return sources
  }

  var endingSlash = /\/?$/

  function resolveSourcesHelper(map, mapUrl, fn) {
    var fullUrl
    var sourceContent
    for (var index = 0, len = map.sources.length; index < len; index++) {
      if (map.sourceRoot) {
        // Make sure that the sourceRoot ends with a slash, so that `/scripts/subdir` becomes
        // `/scripts/subdir/<source>`, not `/scripts/<source>`. Pointing to a file as source root
        // does not make sense.
        fullUrl = resolveUrl(mapUrl, map.sourceRoot.replace(endingSlash, "/"), map.sources[index])
      } else {
        fullUrl = resolveUrl(mapUrl, map.sources[index])
      }
      sourceContent = (map.sourceContents || [])[index]
      fn(fullUrl, sourceContent, index)
    }
  }



  function resolve(code, codeUrl, read, callback) {
    sig("resolve", code, codeUrl, read, callback)
    resolveSourceMap(code, codeUrl, read, function(error, mapData) {
      if (error) {
        return callback(error)
      }
      if (!mapData) {
        return callback(null, null)
      }
      resolveSources(mapData.map, mapData.sourcesRelativeTo, read, function(error, sources) {
        if (error) {
          return callback(error)
        }
        mapData.sources = sources
        callback(null, mapData)
      })
    })
  }

  function resolveSync(code, codeUrl, read) {
    sig("resolveSync", code, codeUrl, read)
    var mapData = resolveSourceMapSync(code, codeUrl, read)
    if (!mapData) {
      return null
    }
    mapData.sources = resolveSourcesSync(mapData.map, mapData.sourcesRelativeTo, read)
    return mapData
  }



  return {
    resolveSourceMap:     resolveSourceMap,
    resolveSourceMapSync: resolveSourceMapSync,
    resolveSources:       resolveSources,
    resolveSourcesSync:   resolveSourcesSync,
    resolve:              resolve,
    resolveSync:          resolveSync
  }

}));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../timers-browserify/main.js */ 47).setImmediate))

/***/ }),
/* 24 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/base64.js ***!
  \******************************************************************************************************/
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};


/***/ }),
/* 25 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/binary-search.js ***!
  \*************************************************************************************************************/
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};


/***/ }),
/* 26 */
/* unknown exports provided */
/* all exports used */
/*!************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/mapping-list.js ***!
  \************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(/*! ./util */ 0);

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;


/***/ }),
/* 27 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/quick-sort.js ***!
  \**********************************************************************************************************/
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};


/***/ }),
/* 28 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/source-map-consumer.js ***!
  \*******************************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(/*! ./util */ 0);
var binarySearch = __webpack_require__(/*! ./binary-search */ 25);
var ArraySet = __webpack_require__(/*! ./array-set */ 7).ArraySet;
var base64VLQ = __webpack_require__(/*! ./base64-vlq */ 8);
var quickSort = __webpack_require__(/*! ./quick-sort */ 27).quickSort;

function SourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap)
    : new BasicSourceMapConsumer(sourceMap);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      if (source != null && sourceRoot != null) {
        source = util.join(sourceRoot, source);
      }
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: Optional. the column number in the original source.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    if (this.sourceRoot != null) {
      needle.source = util.relative(this.sourceRoot, needle.source);
    }
    if (!this._sources.has(needle.source)) {
      return [];
    }
    needle.source = this._sources.indexOf(needle.source);

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The only parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._sources.toArray().map(function (s) {
      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
    }, this);
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          if (this.sourceRoot != null) {
            source = util.join(this.sourceRoot, source);
          }
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    if (this.sourceRoot != null) {
      aSource = util.relative(this.sourceRoot, aSource);
    }

    if (this._sources.has(aSource)) {
      return this.sourcesContent[this._sources.indexOf(aSource)];
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + aSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    if (this.sourceRoot != null) {
      source = util.relative(this.sourceRoot, source);
    }
    if (!this._sources.has(source)) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    source = this._sources.indexOf(source);

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The only parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        if (section.consumer.sourceRoot !== null) {
          source = util.join(section.consumer.sourceRoot, source);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = section.consumer._names.at(mapping.name);
        this._names.add(name);
        name = this._names.indexOf(name);

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 29 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/lib/source-node.js ***!
  \***********************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = __webpack_require__(/*! ./source-map-generator */ 9).SourceMapGenerator;
var util = __webpack_require__(/*! ./util */ 0);

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are removed from this array, by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var shiftNextLine = function() {
      var lineContents = remainingLines.shift();
      // The last line of a file might not have a newline.
      var newLine = remainingLines.shift() || "";
      return lineContents + newLine;
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[0];
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[0];
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[0] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLines.length > 0) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;


/***/ }),
/* 30 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/source-map/source-map.js ***!
  \******************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = __webpack_require__(/*! ./lib/source-map-generator */ 9).SourceMapGenerator;
exports.SourceMapConsumer = __webpack_require__(/*! ./lib/source-map-consumer */ 28).SourceMapConsumer;
exports.SourceNode = __webpack_require__(/*! ./lib/source-node */ 29).SourceNode;


/***/ }),
/* 31 */
/* unknown exports provided */
/* all exports used */
/*!************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/~/stack-trace/lib/stack-trace.js ***!
  \************************************************************************************************************/
/***/ (function(module, exports) {

exports.get = function(belowFn) {
  var oldLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;

  var dummyObject = {};

  var v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = function(dummyObject, v8StackTrace) {
    return v8StackTrace;
  };
  Error.captureStackTrace(dummyObject, belowFn || exports.get);

  var v8StackTrace = dummyObject.stack;
  Error.prepareStackTrace = v8Handler;
  Error.stackTraceLimit = oldLimit;

  return v8StackTrace;
};

exports.parse = function(err) {
  if (!err.stack) {
    return [];
  }

  var self = this;
  var lines = err.stack.split('\n').slice(1);

  return lines
    .map(function(line) {
      if (line.match(/^\s*[-]{4,}$/)) {
        return self._createParsedCallSite({
          fileName: line,
          lineNumber: null,
          functionName: null,
          typeName: null,
          methodName: null,
          columnNumber: null,
          'native': null,
        });
      }

      var lineMatch = line.match(/at (?:([^\s]+)\s+)?\(?(?:(.+?):(\d+):(\d+)|([^)]+))\)?/);
      if (!lineMatch) {
        return;
      }

      var object = null;
      var method = null;
      var functionName = null;
      var typeName = null;
      var methodName = null;
      var isNative = (lineMatch[5] === 'native');

      if (lineMatch[1]) {
        var methodMatch = lineMatch[1].match(/([^\.]+)(?:\.(.+))?/);
        object = methodMatch[1];
        method = methodMatch[2];
        functionName = lineMatch[1];
        typeName = 'Object';
      }

      if (method) {
        typeName = object;
        methodName = method;
      }

      if (method === '<anonymous>') {
        methodName = null;
        functionName = '';
      }

      var properties = {
        fileName: lineMatch[2] || null,
        lineNumber: parseInt(lineMatch[3], 10) || null,
        functionName: functionName,
        typeName: typeName,
        methodName: methodName,
        columnNumber: parseInt(lineMatch[4], 10) || null,
        'native': isNative,
      };

      return self._createParsedCallSite(properties);
    })
    .filter(function(callSite) {
      return !!callSite;
    });
};

exports._createParsedCallSite = function(properties) {
  var methods = {};
  for (var property in properties) {
    var prefix = 'get';
    if (property === 'native') {
      prefix = 'is';
    }
    var method = prefix + property.substr(0, 1).toUpperCase() + property.substr(1);

    (function(property) {
      methods[method] = function() {
        return properties[property];
      }
    })(property);
  }

  var callSite = Object.create(methods);
  for (var property in properties) {
    callSite[property] = properties[property];
  }

  return callSite;
};


/***/ }),
/* 32 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/src/deadunitCore.js ***!
  \***********************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var path = __webpack_require__(/*! path */ 2)
var Url = __webpack_require__(/*! url */ 49)

var proto = __webpack_require__(/*! proto */ 20)
var Future = __webpack_require__(/*! async-future */ 6)
var SourceMapConsumer = __webpack_require__(/*! source-map */ 30).SourceMapConsumer

var processResults = __webpack_require__(/*! ./processResults */ 35)
var isRelative = __webpack_require__(/*! ./isRelative */ 34)

// returns a module intended for a specific environment (that environment being described by the options)
// options can contain:
    // initialization - a function run once that can setup things (like a global error handler).
        // Gets a single parameter 'state' which has the following form:
            // unhandledErrorHandler(error,warn)
    // initializeMainTest - a function run once that can setup things (like a test-specific handler).
        // Gets a single parameter 'mainTestState' which has the following form:
            // unhandledErrorHandler(error,warn) - the error handler for that test
    // getDomain - a function that returns the current domain, or undefined if the environment (*cough* browsers) doesn't have domains
    // getSourceMapObject - a function that returns a future of the pre-parsed source map object for a file, or future undefined
        // gets the parameter:
            // url - the url of the file to find a sourcemap for
            // warningHandler - a warningHandler function that expects an error to be passed to it
    // runTestGroup - a function run that allows you to wrap the actual test run in some way (intended for node.js domains)
        // gets parameters:
            // state - the same state object sent into `initialization`
            // tester - a UnitTester object for the test
            // runTest - the function that you should call to run the test group. Already has a synchronous try catch inside it (so you don't need to worry about that)
            // handleError - a function that handles an error if one comes up. Takes the error as its only parameter. Returns a future.
    // mainTestDone - a function run once a test is done
        // gets the 'mainTestState' parameter
    // defaultUnhandledErrorHandler - a function that handles an error unhandled by any other handler
        // gets the 'error' as its only parameter
    // defaultTestErrorHandler - is passed the current test, and should return a function that handles an error
module.exports = function(options) {

    // a variable that holds changeable state
    var state = {
        unhandledErrorHandler: options.defaultUnhandledErrorHandler
    }

    options.initialize(state)

    // the prototype of objects used to manage accessing and displaying results of a unit test
    var UnitTest = proto(function() {
        this.init = function(/*mainName=undefined, groups*/) {
            var that = this
            var args = arguments
            this.manager = EventManager(this)

            setTimeout(function() {
                runTest.call(that, args)
            },0)
        }

        this.events = function(handlers) {
            this.manager.add(handlers, options.getDomain())
            return this
        }

        this.results = function() {
            return processResults(this)
        }

        // private

        function runTest(args) {
            var fakeTest = new UnitTester()
                fakeTest.id = undefined // fake test doesn't get an id
                fakeTest.manager = this.manager
                fakeTest.timeouts = []
                fakeTest.onDoneCallbacks = []

                var getUnhandledErrorHandler = function() {
                    var unhandledErrorHandler = createUnhandledErrorHandler(fakeTest.mainSubTest)
                    getUnhandledErrorHandler = function() { // memoize this junk
                        return unhandledErrorHandler
                    }
                    return unhandledErrorHandler
                }
                fakeTest.mainTestState = {get unhandledErrorHandler(){return getUnhandledErrorHandler() || options.defaultTestErrorHandler(fakeTest)}}

                var warningInfoMessageHasBeenOutput = false
                this.manager.testObject.warningHandler = fakeTest.warningHandler = function(w) {
                    var errorHandler = getUnhandledErrorHandler()
                    if(warningInfoMessageHasBeenOutput === false) {
                        var warning = newError("You've received at least one warning. If you don't want to treat warnings as errors, use the `warning` method to redefine how to handle them.")
                        errorHandler(warning, false)
                        warningInfoMessageHasBeenOutput = true
                    }

                    errorHandler(w, false)
                }

                options.initializeMainTest(fakeTest.mainTestState)

                timeout(fakeTest, 3000, true) // initial (default) timeout
                fakeTest.onDone = function() { // will execute when this test is done
                    fakeTest.manager.lastEmitFuture.then(function() { // wait for all the already-registered emits to emit before finalizing the test
                        done(fakeTest)
                        options.mainTestDone(fakeTest.mainTestState)
                    }).done()
                }
                fakeTest.callOnDone = function(cb) {
                    fakeTest.onDoneCallbacks.push(cb)
                }

            UnitTester.prototype.test.apply(fakeTest, args) // set so the error handler can access the real test
            this.mainTester = fakeTest
            this.parentTester = fakeTest

            fakeTest.groupEnded = true
            checkGroupDone(fakeTest)
        }
    })

    var EventManager = proto(function() {

        this.init = function(testObject) {
            this.handlers = {
                group: [],
                assert: [],
                count: [],
                exception: [],
                log: [],
                end: [],
                groupEnd: [],
                before: [],
                after: [],
                beforeEnd: [],
                afterEnd: []
            }

            this.history = []
            this.emitDepth = 0 // records how many futures are waiting on eachother, so we can make sure maximum stack depth isn't exceeded
            this.lastEmitFuture = Future(undefined)
            this.testObject = testObject
        }

        this.testObject; // used to get the right warningHandler

        // emits an event
        // eventDataFuture resolves to either an eventData object, or undefined if nothing should be emitted
        this.emit = function(type, eventDataFuture) {
            var that = this
            var lastEmitFuture = that.lastEmitFuture // capture it for the possible setTimeout threadlet
            var doStuff = function(f) {
                var resultFuture = lastEmitFuture.then(function() {
                    return eventDataFuture
                }).then(function(eventData){
                    if(eventData !== undefined)
                        recordAndTriggerHandlers.call(that, type, eventData)
                }).catch(function(e) {
                    that.testObject.warningHandler(e)
                })

                if(f !== undefined) {
                    resultFuture.finally(function() {
                        setTimeout(function(){f.return()},0) // make sure we don't get a "too much recursion error" // todo: test not doing this once browsers all support proper tail calls
                    })
                    return f
                } else {
                    return resultFuture
                }
            }

            this.emitDepth++
            if(this.emitDepth % 40 === 0) { // 40 seems to be the magic number here for firefox - such a finicky browser
                that.lastEmitFuture = doStuff(new Future)
            } else {
                that.lastEmitFuture = doStuff()
            }

            return this.lastEmitFuture
        }

        // adds a set of listening handlers to the event stream, and runs those handlers on the stream's history
        // domain is optional, but if defined will be the node.js domain that unhandled errors will be routed to
        this.add = function(handlers, domain) {
            // run the history of events on the the handlers
            this.history.forEach(function(e) {
                if(handlers[e.type] !== undefined) {
                    handlers[e.type].call(undefined, e.data)
                }
            })

            // then have those handlers listen on future events
            for(var type in handlers) {
                var typeHandlers = this.handlers[type]
                if(typeHandlers === undefined) {
                    throw new Error("event type '"+type+"' invalid")
                }

                typeHandlers.push({handler: handlers[type], domain: domain})
            }
        }

        // the synchronous part of emitting
        function recordAndTriggerHandlers(type, eventData) {
            this.history.push({type:type, data: eventData})
            this.handlers[type].forEach(function(handlerInfo) {
                try {
                    handlerInfo.handler.call(undefined, eventData)
                } catch(e) {

                    // throw error asynchronously because these error should be separate from the test exceptions
                    var throwErrorFn = options.throwAsyncException

                    if(handlerInfo.domain) {
                        throwErrorFn = handlerInfo.domain.bind(throwErrorFn)    // this domain bind is needed because emit is done inside deadunit's test domain, which isn't where we want to put errors caused by the event handlers
                    }

                    throwErrorFn(e)
                }
            })
        }
    })

    function testGroup(tester, test) {

        // handles any error (synchronous or asynchronous errors)
        var handleError = createUnhandledErrorHandler(tester)

        var runTest = function() {
            try {
                test.call(tester, tester) // tester is both 'this' and the first parameter (for flexibility)
            } catch(e) {
                handleError(e, true).done()
            }
         }

        options.runTestGroup(state, tester, runTest, handleError)
    }

    function createUnhandledErrorHandler(tester) {

        var handleErrorInErrorHandler = function(warn, newError) {
            var textForOriginalError = newError.stack?newError.stack:newError

            if(warn !== false) {
                try {
                    tester.warningHandler(newError)
                } catch(warningHandlerError) {
                    var warningHandlerErrorText = warningHandlerError.stack?warningHandlerError.stack:warningHandlerErro

                    var errorception = new Error("An error happened in the error handler: "+warningHandlerErrorText+"\n"+textForOriginalError)
                    tester.manager.emit('exception', Future(errorception)).done() // if shit gets this bad, that sucks
                }
            } else {
                console.error(textForOriginalError)
            }
        }

        // warn should be set to false if the handler is being called to report a warning
        return function(e, warn) {
            if(tester.unhandledErrorHandler !== undefined) {
                try {
                    tester.unhandledErrorHandler(e)
                    return Future(undefined)

                } catch(newError) {     // error handler had an error...
                    handleErrorInErrorHandler(warn, newError)
                }
            }
            // else

            var errorToEmit = mapException(e, tester.warningHandler).catch(function(newError) {
                if(newError.message !== "Accessing the 'caller' property of a function or arguments object is not allowed in strict mode") { // stacktrace.js doesn't support IE for certain things
                    handleErrorInErrorHandler(warn, newError)
                }
                return Future(e) // use the original unmapped exception

            }).then(function(exception){
                return Future(exceptionEmitData(tester,exception))
            })

            var emitFuture = tester.manager.emit('exception', errorToEmit)
            return afterWaitingEmitIsComplete(tester, emitFuture)

        }
    }

    function exceptionEmitData(tester, e) {
        return {
            parent: tester.id,
            time: now(),
            error: e
        }
    }


    // the prototype of objects used to write tests and contain the results of tests
    var UnitTester = function(name, mainTester, parentTester) {
        if(!mainTester) mainTester = this

        this.id = groupid()
        this.mainTester = mainTester // the mainTester is used to easily figure out if the test results have been accessed (so early accesses can be detected)
        this.parentTester = parentTester // used to reset timeouts
        this.name = name

        this.doneTests = 0
        this.doneAsserts = 0
        this.runningTests = 0 // the number of subtests created synchronously
        this.doneCalled = false
        this.doSourcemappery = true // whether to do source mapping, if possible, within this test

        this.complete = new Future // resolved when done
    }

        UnitTester.prototype = {
            test: function() {
                if(arguments.length === 1) {
                    var test = arguments[0]

                // named test
                } else {
                    var name = arguments[0]
                    var test = arguments[1]
                }

                var that = this
                this.runningTests++

                var tester = new UnitTester(name, this.mainTester, this)
                tester.manager = this.manager
                tester.doSourcemappery = this.doSourcemappery // inherit from parent test
                tester.warningHandler = this.warningHandler

                if(this.id === undefined) { // ie its the top-level fake test
                    this.mainSubTest = tester
                }

                tester.onDone = function() { // will execute when this test is done
                    that.doneTests += 1

                    that.manager.emit('groupEnd', Future({
                        id: tester.id,
                        time: now()
                    }))

                    try {
                        tester.complete.return()
                    } catch(e) {
                        createUnhandledErrorHandler(tester)(e)
                    }

                    checkGroupDone(that)
                }

                tester.mainTester.callOnDone(function() {
                    if(!tester.doneCalled) { // a timeout happened - end the test
                        tester.doneCalled = true
                        that.manager.emit('groupEnd', Future({
                            id: tester.id,
                            time: now()
                        }))
                    }
                })

                this.manager.emit('group', Future({
                    id: tester.id,
                    parent: this.id,
                    name: name,
                    time: now()
                }))

                if(this.beforeFn) {
                    this.manager.emit('before', Future({
                        parent: tester.id,
                        time: now()
                    }))

                    this.beforeFn.call(this, this)

                    this.manager.emit('beforeEnd', Future({
                        parent: tester.id,
                        time: now()
                    }))
                }

                testGroup(tester, test)

                if(this.afterFn) {
                    this.manager.emit('after', Future({
                        parent: tester.id,
                        time: now()
                    }))

                    this.afterFn.call(this, this)

                    this.manager.emit('afterEnd', Future({
                        parent: tester.id,
                        time: now()
                    }))
                }

                tester.groupEnded = true
                checkGroupDone(tester)

                return tester
            },

            ok: function(success, actualValue, expectedValue) {
                this.doneAsserts += 1
                afterWaitingEmitIsComplete(this, assert(this, success, actualValue, expectedValue, 'assert', "ok")).done()
            },
            eq: function(actualValue, expectedValue) {
                this.doneAsserts += 1
                afterWaitingEmitIsComplete(this, assert(this, expectedValue === actualValue, actualValue, expectedValue, 'assert', "eq")).done()
            },
            count: function(number) {
                if(this.countExpected !== undefined)
                    throw Error("count called multiple times for this test")
                this.countExpected = number

                afterWaitingEmitIsComplete(this,assert(this, undefined, undefined, number, 'count', "count")).done()
            },

            before: function(fn) {
                if(this.beforeFn !== undefined)
                    throw Error("before called multiple times for this test")

                this.beforeFn = fn
            },
            after: function(fn) {
                if(this.afterFn !== undefined)
                    throw Error("after called multiple times for this test")

                this.afterFn = fn
            },

            log: function(/*arguments*/) {
                this.manager.emit('log', Future({
                    parent: this.id,
                    time: now(),
                    values: Array.prototype.slice.call(arguments, 0)
                }))
            },

            timeout: function(t) {
                timeout(this, t, false)
            },

            error: function(handler) {
                this.unhandledErrorHandler = handler
            },
            warning: function(handler) {
                this.warningHandler = handler
            },

            sourcemap: function(doSourcemappery) {
                this.doSourcemappery = doSourcemappery
            }
        }

    function afterWaitingEmitIsComplete(that, assertFuture) {
        return assertFuture.finally(function() {
            checkGroupDone(that)
        })
    }

    function checkGroupDone(group) {
        if(!group.doneCalled && group.groupEnded === true
            && ((group.countExpected === undefined || group.countExpected <= group.doneAsserts+group.doneTests)
                && group.runningTests === group.doneTests)
        ) {
            group.doneCalled = true // don't call twice
            group.onDone()
        }

    }

    function done(unitTester) {
        if(unitTester.mainTester.ended) {
            unitTester.mainTester.manager.emit('exception', Future({
                parent: unitTester.mainTester.mainSubTest.id,
                time: now(),
                error: newError("done called more than once (probably because the test timed out before it finished)")
            }))
        } else {
            unitTester.mainTester.timeouts.forEach(function(to) {
                clearTimeout(to)
            })
            unitTester.mainTester.timeouts = []

            endTest(unitTester, 'normal')
        }
    }

    function timeout(unitTester, t, theDefault) {
        var timeouts = unitTester.mainTester.timeouts

        unitTester.timeoutTime = t

        if(theDefault) {
            timeouts.defaultTimeout = true
        } else if(unitTester === unitTester.mainTester && timeouts.defaultTimeout) { // if a timeout is the default, it can be overridden
            clearTimeout(unitTester.timeoutHandle)
            remove(timeouts, unitTester.timeoutHandle)
            timeouts.defaultTimeout = undefined
            delete unitTester.timeoutHandle
        }

        setTesterTimeout(unitTester)
    }

    // sets or resets a timeout for a unitTester
    function setTesterTimeout(unitTester) {
        var timeouts = unitTester.mainTester.timeouts
        if(unitTester.timeoutHandle !== undefined) {
            clearTimeout(unitTester.timeoutHandle)
            remove(timeouts, unitTester.timeoutHandle)
        }

        unitTester.timeoutHandle = setTimeout(function() {
            remove(timeouts, unitTester.timeoutHandle)
            delete unitTester.timeoutHandle

            if(timeouts.length === 0 && !unitTester.mainTester.ended) {
                endTest(unitTester.mainTester, 'timeout')
            }
        }, unitTester.timeoutTime)

        timeouts.push(unitTester.timeoutHandle)
    }

    // removes an item from an array
    function remove(array, item) {
        var index = array.indexOf(item)
        if(index !== -1)
            array.splice(index, 1) // no longer throwing Error("Item doesn't exist to remove") if there's nothing to remove - in the case that mainTester.timeouts gets set back to [] (when done), it won't be there

    }

    function endTest(that, type) {
        that.mainTester.ended = true

        if(that.mainTester === that) { // if its the main tester
            that.onDoneCallbacks.forEach(function(cb) {
                cb()
            })
        }

        setTimeout(function() { // setTimeout here is to make it so the currently running threadlet that caused the test to end can finish before the end event is sent
            that.manager.emit('end', Future({
                type: type,
                time: now()
            }))
        },0)
    }

    // type - either "count" or "assert"
    function assert(that, success, actualValue, expectedValue, type, functionName/*="ok"*/, lineInfo/*=dynamic*/, stackIncrease/*=0*/) {
        if(!stackIncrease) stackIncrease = 1
        if(!functionName) functionName = "ok"
        if(!lineInfo)
            var lineInfoFuture = getLineInformation(functionName, stackIncrease, that.doSourcemappery, that.warningHandler)
        else
            var lineInfoFuture = Future(lineInfo)

        // reste timeouts up the chain
        var cur = that
        while(cur !== undefined) {
            setTesterTimeout(cur)
            cur = cur.parentTester
        }

        var emitData = lineInfoFuture.then(function(lineInfo) {
            var result = lineInfo
            result.type = 'assert'
            if(type !=='count') result.success = success === true

            if(actualValue !== undefined)     result.actual = actualValue
            if(expectedValue !== undefined)   result.expected = expectedValue

            result.parent = that.id
            result.time = now()

           return Future(result)
        })

        return that.manager.emit(type, emitData)
    }


    function getLineInformation(functionName, stackIncrease, doSourcemappery, warningHandler) {

        var file, line, column, lineinfo;
        return options.getLineInfo(stackIncrease).then(function(info){
            lineinfo = info
            return getSourceMapConsumer(info.file, warningHandler)
        }).catch(function(e){
            warningHandler(e)
            return Future(undefined)

        }).then(function(sourceMapConsumer) {
            if(sourceMapConsumer !== undefined && doSourcemappery) {

                var mappedInfo = getMappedSourceInfo(sourceMapConsumer, lineinfo.file, lineinfo.line, lineinfo.column)
                file = mappedInfo.file
                line = mappedInfo.line
                column = mappedInfo.column
                var sourceLines = mappedInfo.sourceLines

                var multiLineSearch = !mappedInfo.usingOriginalFile // don't to a multi-line search if the source has been mapped (the file might not be javascript)
            } else {
                file = lineinfo.file
                line = lineinfo.line
                column = lineinfo.column
                var sourceLines = undefined
                var multiLineSearch = true
            }

            return getFunctionCallLines(sourceLines, file, functionName, line, multiLineSearch, warningHandler)

        }).catch(function(e) {
            warningHandler(e)
            return Future("<source not available>")
        }).then(function(sourceLines) {
            return Future({
                sourceLines: sourceLines,
                file: path.basename(file),
                line: line,
                column: column
            })
        })
    }

    // returns the line, column, and filename mapped from a source map
    // appropriately handles cases where some information is missing
    function getMappedSourceInfo(sourceMapConsumer, originalFilePath, originalLine, originalColumn, originalFunctionName) {
        var sourceMapInfo = sourceMapConsumer.originalPositionFor({line:originalLine, column:originalColumn||0})       // the 0 is for browsers (like firefox) that don't output column numbers
        var line = sourceMapInfo.line
        var column = sourceMapInfo.column
        var fn = sourceMapInfo.name

        if(sourceMapInfo.source !== null) {
            var relative = isRelative(sourceMapInfo.source)

            /* I don't think this is needed any longer, and probably isn't correct - this was working around an issue in webpack: See https://github.com/webpack/webpack/issues/559 and https://github.com/webpack/webpack/issues/238
            if(sourceMapConsumer.sourceRoot !== null) {
                sourceMapInfo.source = sourceMapInfo.source.replace(sourceMapConsumer.sourceRoot, '') // remove sourceRoot
            }*/

            if(relative) {
                var file = Url.resolve(originalFilePath, path.basename(sourceMapInfo.source))
            } else {
                var file = sourceMapInfo.source
            }


            var originalFile = true
        } else {
            var file = originalFilePath
            var originalFile = false
        }

        if(fn === null || !originalFile) {
            fn = originalFunctionName
        }
        if(line === null || !originalFile) {
            line = originalLine
            column = originalColumn
        }
        if(column === null) {
            column = undefined
        }

        if(file != undefined && sourceMapConsumer.sourcesContent != undefined) { // intentional single !=
            var index = sourceMapConsumer.sources.indexOf(file)
            var sourceLines = sourceMapConsumer.sourcesContent[index]
            if(sourceLines !== undefined) sourceLines = sourceLines.split('\n')
        }

        return {
            file: file,
            function: fn,
            line: line,
            column: column,
            usingOriginalFile: originalFile,
            sourceLines: sourceLines
        }
    }

    // gets the actual lines of the call
    // if multiLineSearch is true, it finds
    function getFunctionCallLines(sourcesContent, filePath, functionName, lineNumber, multiLineSearch, warningHandler) {
        if(sourcesContent !==  undefined) {
            var source = Future(sourcesContent)
        } else {
            var source = options.getScriptSourceLines(filePath)
        }
        return source.catch(function(e) {
            warningHandler(e)
            return Future(undefined)

        }).then(function(fileLines) {
            if(fileLines !== undefined) {

                var startLine = findStartLine(fileLines, functionName, lineNumber)
                if(startLine === 'lineOfCodeNotFound') {
                    return Future("<line of code not found (possibly an error?)> ")

                } else if(startLine !== 'sourceNotAvailable') {
                    if(multiLineSearch) {
                        return Future(findFullSourceLine(fileLines, startLine))
                    } else {
                        return Future(fileLines[startLine].trim())
                    }
                }
            }
            // else
            return Future("<source not available>")

        })
    }

    var sourceMapConsumerCache = {} // a map from a script url to a future of its SourceMapConsumer object (null means no sourcemap exists)
    function getSourceMapConsumer(url, warningHandler) {
        if(sourceMapConsumerCache[url] === undefined) {
            try {
                sourceMapConsumerCache[url] = options.getSourceMapObject(url, warningHandler).then(function(sourceMapObject) {
                    if(sourceMapObject !== undefined) {
                        if(sourceMapObject.version === undefined) {
                            warningHandler(new Error("Sourcemap for "+url+" doesn't contain the required 'version' property. Assuming version 2."))
                            sourceMapObject.version = 2 // assume version 2 to make browserify's broken sourcemap format that omits the version
                        }
                        return Future(new SourceMapConsumer(sourceMapObject))
                    } else {
                        return Future(undefined)
                    }
                })
            } catch(e) {
                sourceMapConsumerCache[url] = Future(undefined)
                warningHandler(e)
            }
        }

        return sourceMapConsumerCache[url]
    }

    // takes an exception and returns a future exception that has a stacktrace with sourcemapped tracelines
    function mapException(exception, warningHandler) {
        try {
            if(exception instanceof Error) {
                var stacktrace;
                return options.getExceptionInfo(exception).then(function(trace){
                    stacktrace = trace

                    var smcFutures = []
                    for(var n=0; n<trace.length; n++) {
                        if(trace[n].file !== undefined) {
                            smcFutures.push(getSourceMapConsumer(trace[n].file, warningHandler))
                        } else {
                            smcFutures.push(Future(undefined))
                        }
                    }

                    return Future.all(smcFutures)
                }).then(function(sourceMapConsumers) {
                    var CustomMappedException = proto(MappedException, function() {
                        // set the name so it looks like the original exception when printed
                        // this subclasses MappedException so that name won't be an own-property
                        this.name = exception.name
                    })

                    try {
                        throw CustomMappedException(exception, stacktrace, sourceMapConsumers)  // IE doesn't give exceptions stack traces unless they're actually thrown
                    } catch(mappedExcetion) {
                        return Future(mappedExcetion)
                    }
                })
            } else {
                return Future(exception)
            }
        } catch(e) {
            var errorFuture = new Future
            errorFuture.throw(e)
            return errorFuture
        }
    }

    // an exception where the stacktrace's files and lines are mapped to the original file (when applicable)
    var MappedException = proto(Error, function(superclass) {

        // constructor. Takes the parameters:
            // originalError
            // traceInfo - an array where each element is an object containing information about that stacktrace line
            // sourceMapConsumers - an array of the same length as traceInfo where each element is the sourcemap consumer for the corresponding info in traceInfo
        this.init = function(originalError, traceInfo, sourceMapConsumers) {
            superclass.call(this, originalError.message)

            for(var p in originalError) {
                if(Object.hasOwnProperty.call(originalError, p)) {
                    try {
                        this[p] = originalError[p]
                    } catch(e) {
                        console.log("Error setting property "+p+' with value '+originalError[p])
                    }
                }
            }

            var newTraceLines = []
            for(var n=0; n<traceInfo.length; n++) {
                var info = traceInfo[n]
                if(sourceMapConsumers[n] !== undefined) {
                    info = getMappedSourceInfo(sourceMapConsumers[n], info.file, info.line, info.column, info.function)
                }

                var fileLineColumn = info.line
                if(info.column !== undefined) {
                    fileLineColumn += ':'+info.column
                }
                if(info.file !== undefined) {
                    fileLineColumn = info.file+':'+fileLineColumn
                }

                var traceLine = "    at "
                if(info.function !== undefined) {
                    traceLine += info.function+' ('+fileLineColumn+')'
                } else {
                    traceLine += fileLineColumn
                }

                newTraceLines.push(traceLine)
            }

            Object.defineProperty(this, 'stack', {
                get: function() {
                    return this.name+': '+this.message+'\n'+newTraceLines.join('\n')
                }
            })
        }
    })

    // attempts to find the full function call expression (over multiple lines) given the sources lines and a starting point
    function findFullSourceLine(fileLines, startLine) {
        var lines = []
        var parenCount = 0
        var mode = 0 // mode 0 for paren searching, mode 1 for double-quote searching, mode 2 for single-quote searching
        var lastWasBackslash = false // used for quote searching
        for(var n=startLine; n<fileLines.length; n++) {
            var line = fileLines[n]
            lines.push(line.trim())

            for(var i=0; i<line.length; i++) {
                var c = line[i]

                if(mode === 0) {
                    if(c === '(') {
                        parenCount++
                        //if(parenCount === 0) {
                          //  return lines.join('\n') // done
                        //}
                    } else if(c === ')' && parenCount > 0) {
                        parenCount--
                        if(parenCount === 0) {
                            return lines.join('\n') // done
                        }
                    } else if(c === '"') {
                        mode = 1
                    } else if(c === "'") {
                        mode = 2
                    }
                } else if(mode === 1) {
                    if(c === '"' && !lastWasBackslash) {
                        mode = 0
                    }

                    lastWasBackslash = c==='\\'
                } else { // mode === 2
                    if(c === "'" && !lastWasBackslash) {
                        mode = 0
                    }

                    lastWasBackslash = c==='\\'
                }
            }
        }

        return lines.join('\n') // if it gets here, something minor went wrong
    }

    // finds the line a function started on given the file's lines, and the stack trace line number (and function name)
    // returns undefined if something went wrong finding the startline
    function findStartLine(fileLines, functionName, lineNumber) {
        var startLine = lineNumber - 1
        while(true) {
            if(startLine < 0) {
                return 'lineOfCodeNotFound' // something went wrong if this is being returned (the functionName wasn't found above - means you didn't get the function name right)
            }

            var line = fileLines[startLine]
            if(line === undefined) {
                return 'sourceNotAvailable'
            }

            //lines.push(line.trim())
            var containsFunction = line.indexOf(functionName) !== -1
            if(containsFunction) {
                return startLine
            }

            startLine--
        }
    }

    function groupid() {
        groupid.next++
        return groupid.next
    }
    groupid.next = -1

    // returns a Unix Timestamp for now
    function now() {
        return (new Date()).getTime()
    }

    return {
        test: UnitTest
    }
}

function newError(message, ErrorPrototype) {
    try {
        throw new Error(message) // IE needs an exception to be actually thrown to get a stack trace property
    } catch(e) {
        return e
    }
}


/***/ }),
/* 33 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/src/deadunitCore.node.js ***!
  \****************************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
/* Copyright (c) 2014 Billy Tetrud - Free to use for any purpose: MIT License*/

var domain = __webpack_require__(/*! domain */ 40).create
var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
var path = __webpack_require__(/*! path */ 2)

var stackTrace = __webpack_require__(/*! stack-trace */ 31)
var Future = __webpack_require__(/*! async-future */ 6)
var resolveSourceMap = Future.wrap(__webpack_require__(/*! source-map-resolve */ 23).resolveSourceMap)
var color = __webpack_require__(/*! colors/safe */ 19)

var deadunitCore = __webpack_require__(/*! ./deadunitCore */ 32)

var readFileCache = {}
var nodeReadFile = Future.wrap(fs.readFile)
var readFile = function(filePath) {
    if(readFileCache[filePath] === undefined) {
        readFileCache[filePath] = nodeReadFile(filePath).then(function(fileBuffer) {
            return Future(fileBuffer.toString())
        })
    }
    return readFileCache[filePath]
}
var exists = function(filePath) {
    var existsFuture = new Future
    fs.exists(filePath, function(exists) {
        existsFuture.return(exists)
    })
    return existsFuture
}

module.exports = deadunitCore({
    initialize: function() {},
    initializeMainTest: function() {},
    mainTestDone: function() {},

    getDomain: function() {
        return process.domain
    },

    runTestGroup: function(deadunitState, tester, runTest, handleError) {

        var d = domain()
        d.on('error', function(err) {
            try {
                handleError(err, true).then(function() {
                    if(tester.mainTester.resultsAccessed) {
                        if(err instanceof Error) {
                            var errorToShow = err.stack
                        } else {
                            var errorToShow = err
                        }

                        handleUnhandledError(tester, Error("Test results were accessed before asynchronous parts of tests were fully complete."
                                                     +" Got error: "+errorToShow ))
                    }
                }).catch(function(e) {
                    handleUnhandledError(tester, Error("Deadunit threw up : ( - "+e.stack ))
                    console.log(e.stack)
                }).done()

            } catch(e) {
               handleUnhandledError(tester, Error("Deadunit threw up : ( - "+e.stack ))
               console.log(e.stack)
            }
        })

        d.run(function() {
            runTest()
        })


        function handleUnhandledError(tester, e) {
            if(tester.unhandledErrorHandler !== undefined)
                tester.unhandledErrorHandler(e)
            else
                deadunitState.unhandledErrorHandler(e)
        }
    },

    getScriptSourceLines: function(filePath) {
        return exists(filePath).then(function(exists) {
            if(exists) {
                return readFile(filePath).then(function(fileContents) {
                    return Future(fileContents.split('\n'))
                })
            } else {
                return Future(undefined)
            }
        })
    },

    getSourceMapObject: function(filePath, warningHandler) {
        return exists(filePath).then(function(fileExists) {
            if(fileExists) {
                return readFile(filePath).then(function(fileContents) {
                    return resolveSourceMap(fileContents.toString(), filePath, fs.readFile).catch(function(e){
                        warningHandler(e)
                        return Future(undefined)

                    }).then(function(sourceMapObject) {
                        if(sourceMapObject !== null) {
                            return Future(sourceMapObject.map)
                        } else {
                            return Future(undefined)
                        }

                        /*if(sourceMapFileName !== null) {

                            var sourceMapPath = path.join(path.dirname(filePath), sourceMapFileName)

                            return exists(sourceMapPath).then(function(fileExists) {
                                if(fileExists) {
                                    return readFile(sourceMapPath)
                                } else if(sourceMapFileName.indexOf('data:') === 0) {
                                    return Future(decodeDataUrl(sourceMapFileName))
                                } else {
                                    warningHandler(new Error("Couldn't find sourcemap file: "+sourceMapFileName))
                                    return Future(undefined)
                                }
                            })
                        } else {
                            return Future(undefined)
                        }*/
                    })
                })
            } else {
                return Future(undefined)
            }
        })
    },

    defaultUnhandledErrorHandler: defaultUnhandledErrorHandler,
    defaultTestErrorHandler: function(tester) {
        return defaultUnhandledErrorHandler
    },

    getLineInfo: function(stackIncrease) {
        var backTrace = stackTrace.get();
        var stackPosition = backTrace[3+stackIncrease]

        var filename = stackPosition.getFileName()
        var lineNumber = stackPosition.getLineNumber()
        var column = stackPosition.getColumnNumber()

        return Future({
            file: filename,
            line: lineNumber,
            column: column
        })
    },

    getExceptionInfo: function(e) {
        var info = stackTrace.parse(e)

        var results = []
        for(var n=0; n<info.length; n++) {
            var infoElement = info[n]

            var result = {
                function: infoElement.getFunctionName(),
                file: infoElement.getFileName(),
                line: infoElement.getLineNumber(),
                column: infoElement.getColumnNumber()
            }

            for(var key in result) {
                if(result[key] === null) result[key] = undefined
            }

            results.push(result)
        }

        return Future(results)
    },

    throwAsyncException: function(e) {
        setTimeout(function() {
            throw e
        },0)
    }
})

function defaultUnhandledErrorHandler(e) {
    setTimeout(function() {
        if(e.stack)
            var errorString = e.stack
        else
            var errorString = e.toString()

        console.log(color.red(errorString))
    },0)
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../process/browser.js */ 1)))

/***/ }),
/* 34 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/src/isRelative.js ***!
  \*********************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ 2)

module.exports = function isRelative(p) {
    var normal = path.normalize(p)
    var absolute = path.resolve(p)
    return normal != absolute && p.indexOf('://') === -1// second part for urls
}

/***/ }),
/* 35 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit-core/src/processResults.js ***!
  \*************************************************************************************************/
/***/ (function(module, exports) {

module.exports = function returnResults(unitTestObject) {

    var results;
    var groups = {}
    var groupMetadata = {}

    var primaryGroup;
    var ended = false

    unitTestObject.events({
        group: function(e) {
            var g = {
               parent: e.parent,
               id: e.id,              // a unique id for the test group
               type: 'group',         // indicates a test group (either a `Unit.test` call or `this.test`)
               name: e.name,          // the name of the test
               results: [],           // An array of test results, which can be of an `UnitTest` Result Types
               exceptions: [],        // An array of uncaught exceptions thrown in the test,
               time: e.time,
               duration: 0            // the duration of the test from its start til the last test action (assert, log, etc)
               //                       including asynchronous parts and including subtests
               //syncDuration: _,      // the synchronous duration of the test (not including any asynchronous parts)
               //totalSyncDuration: _  // syncDuration plus the before and after (if applicable)
            }

            if(primaryGroup === undefined) primaryGroup = g

            groups[e.id] = g
            groupMetadata[e.id] = {}
            if(e.parent === undefined) {
                results = g
            } else {
                groups[e.parent].results.push(g)
            }
        },
        assert: function(e) {
            e.type = 'assert'
            groups[e.parent].results.push(e)
            setGroupDuration(e.parent, e.time)
        },
        count: function(e) {
            e.type = 'assert'
            setGroupDuration(e.parent, e.time)

            groupMetadata[e.parent].countInfo = e
        },
        exception: function(e) {
            groups[e.parent].exceptions.push(e.error)
            setGroupDuration(e.parent, e.time)
        },
        log: function(e) {
            e.type = 'log'
            groups[e.parent].results.push(e)
            setGroupDuration(e.parent, e.time)
        },
        before: function(e) {
            groups[e.parent].beforeStart = e.time
        },
        after: function(e) {
            groups[e.parent].afterStart = e.time
        },
        beforeEnd: function(e) {
            groups[e.parent].beforeDuration = e.time - groups[e.parent].beforeStart
        },
        afterEnd: function(e) {
            groups[e.parent].afterDuration = e.time - groups[e.parent].afterStart
        },
        groupEnd: function(e) {
            setGroupDuration(e.id, e.time)
        },
        end: function(e) {
            primaryGroup.timeout = e.type === 'timeout'
            setGroupDuration(primaryGroup.id, e.time)

            // make the count assertions
            eachTest(primaryGroup, function(subtest, parenttest) {
                var countInfo = groupMetadata[subtest.id].countInfo
                if(countInfo !== undefined) {
                    var info = countInfo
                    var actualCount = 0
                    subtest.results.forEach(function(a) {
                        if(a.type === 'assert' || a.type === 'group')
                            actualCount++
                    })

                    subtest.results.splice(0,0,{
                        parent: subtest.id,
                        type: 'assert',
                        success: actualCount === info.expected,
                        time: info.time,
                        sourceLines: info.sourceLines,
                        file: info.file,
                        line: info.line,
                        column: info.column,
                        expected: info.expected,
                        actual: actualCount
                    })
                }
            })

            ended = true
        }
    })

    function setGroupDuration(groupid, time) {
        var newDuration = time - groups[groupid].time
        if(newDuration > groups[groupid].duration) {
            groups[groupid].duration = newDuration
        }

        if(groups[groupid].parent) {
            setGroupDuration(groups[groupid].parent, time)
        }
    }

    return results
}


// iterates through the tests and subtests leaves first (depth first)
function eachTest(test, callback, parent) {
    test.results.forEach(function(result) {
        if(result.type === 'group') {
            eachTest(result, callback, test)
        }
    })

    callback(test, parent)
}

/***/ }),
/* 36 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit/deadunit.internal.js ***!
  \*******************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

module.exports = function(options) {
    var exports = {}

    var deadunitCore = options.deadunitCore
    var proto = __webpack_require__(/*! proto */ 38)

    var defaultFormats = __webpack_require__(/*! ./defaultFormats */ 11)
    exports.format = __webpack_require__(/*! ./basicFormatter */ 10)

    exports.error = deadunitCore.error

    exports.test = proto(deadunitCore.test, function() {
        this.string = function() {
            return defaultFormats.text(this, undefined, /*printOnTheFly=*/false, /*printLateEvents=*/false)
        }

        this.html = function() {
            return defaultFormats.html(this, false)
        }

        this.results = function() {
            arguments[0] = false
            return deadunitCore.test.results.apply(this, arguments)
        }

        options.environmentSpecificMethods.call(this)
    })

    return exports
}



/***/ }),
/* 37 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit/indent.js ***!
  \********************************************************************************/
/***/ (function(module, exports) {


module.exports = function(i, str) {
    return i+str.split("\n")       // get all lines
              .join("\n"+i)      // join all lines with an indent
}

/***/ }),
/* 38 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit/~/proto/proto.js ***!
  \***************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var noop = function() {}

var prototypeName='prototype', undefined, protoUndefined='undefined', init='init', ownProperty=({}).hasOwnProperty; // minifiable variables
function proto() {
    var args = arguments // minifiable variables

    if(args.length == 1) {
        var parent = {init: noop}
        var prototypeBuilder = args[0]

    } else { // length == 2
        var parent = args[0]
        var prototypeBuilder = args[1]
    }

    // special handling for Error objects
    var namePointer = {}    // name used only for Error Objects
    if([Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError].indexOf(parent) !== -1) {
        parent = normalizeErrorObject(parent, namePointer)
    }

    // set up the parent into the prototype chain if a parent is passed
    var parentIsFunction = typeof(parent) === "function"
    if(parentIsFunction) {
        prototypeBuilder[prototypeName] = parent[prototypeName]
    } else {
        prototypeBuilder[prototypeName] = parent
    }

    // the prototype that will be used to make instances
    var prototype = new prototypeBuilder(parent)
    namePointer.name = prototype.name

    // if there's no init, assume its inheriting a non-proto class, so default to applying the superclass's constructor.
    if(!prototype[init] && parentIsFunction) {
        prototype[init] = function() {
            parent.apply(this, arguments)
        }
    }

    // constructor for empty object which will be populated via the constructor
    var F = function() {}
        F[prototypeName] = prototype    // set the prototype for created instances

    var constructorName = prototype.name?prototype.name:''
    if(prototype[init] === undefined || prototype[init] === noop) {
        var ProtoObjectFactory = new Function('F',
            "return function " + constructorName + "(){" +
                "return new F()" +
            "}"
        )(F)
    } else {
        // dynamically creating this function cause there's no other way to dynamically name a function
        var ProtoObjectFactory = new Function('F','i','u','n', // shitty variables cause minifiers aren't gonna minify my function string here
            "return function " + constructorName + "(){ " +
                "var x=new F(),r=i.apply(x,arguments)\n" +    // populate object via the constructor
                "if(r===n)\n" +
                    "return x\n" +
                "else if(r===u)\n" +
                    "return n\n" +
                "else\n" +
                    "return r\n" +
            "}"
        )(F, prototype[init], proto[protoUndefined]) // note that n is undefined
    }

    prototype.constructor = ProtoObjectFactory;    // set the constructor property on the prototype

    // add all the prototype properties onto the static class as well (so you can access that class when you want to reference superclass properties)
    for(var n in prototype) {
        addProperty(ProtoObjectFactory, prototype, n)
    }

    // add properties from parent that don't exist in the static class object yet
    for(var n in parent) {
        if(ownProperty.call(parent, n) && ProtoObjectFactory[n] === undefined) {
            addProperty(ProtoObjectFactory, parent, n)
        }
    }

    ProtoObjectFactory.parent = parent;            // special parent property only available on the returned proto class
    ProtoObjectFactory[prototypeName] = prototype  // set the prototype on the object factory

    return ProtoObjectFactory;
}

proto[protoUndefined] = {} // a special marker for when you want to return undefined from a constructor

module.exports = proto

function normalizeErrorObject(ErrorObject, namePointer) {
    function NormalizedError() {
        var tmp = new ErrorObject(arguments[0])
        tmp.name = namePointer.name

        this.message = tmp.message
        if(Object.defineProperty) {
            /*this.stack = */Object.defineProperty(this, 'stack', { // getter for more optimizy goodness
                get: function() {
                    return tmp.stack
                }
            })
        } else {
            this.stack = tmp.stack
        }

        return this
    }

    var IntermediateInheritor = function() {}
        IntermediateInheritor.prototype = ErrorObject.prototype
    NormalizedError.prototype = new IntermediateInheritor()

    return NormalizedError
}

function addProperty(factoryObject, prototype, property) {
    try {
        var info = Object.getOwnPropertyDescriptor(prototype, property)
        if(info.get !== undefined || info.get !== undefined && Object.defineProperty !== undefined) {
            Object.defineProperty(factoryObject, property, info)
        } else {
            factoryObject[property] = prototype[property]
        }
    } catch(e) {
        // do nothing, if a property (like `name`) can't be set, just ignore it
    }
}

/***/ }),
/* 39 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/deadunit/utils.js ***!
  \*******************************************************************************/
/***/ (function(module, exports, __webpack_require__) {


var util = __webpack_require__(/*! util */ 53)

exports.plural = function (num, plural, singular) {
	var plur = num!==1;

    if(singular === undefined) {
    	if(plur)	return "s"
        else        return ""
    } else {
    	if(plur)	return plural
        else		return singular
    }
}


exports.textToHtml = function(text) {
    return htmlEscape(text)
            .replace(/ /g, '&nbsp;')
            .replace(/\n/g, "<br>\n")
            .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
}

exports.timeText = function (ms) {
    if(ms < 2000)
        return ms+"ms"
    else
        return Number(ms/1000).toPrecision(3)+'s'
}


exports.valueToMessage = function(value) {
    if(value instanceof Error) {
        return exports.errorToString(value)
    } else {
        return prettyPrint(value)
    }
}

exports.errorToString = function(err) {
    if(err instanceof Error) {
        var otherProperties = []
        for(var n in err) {
            if(Object.hasOwnProperty.call(err, n) && n !== 'message' && n !== 'stack') {
                otherProperties.push(exports.valueToString(err[n]))
            }
        }

        var properties = ''
        if(otherProperties.length > 0)
            properties = '\n'+otherProperties.join("\n")


        if(err.stack !== undefined) {
            if(err.stack.indexOf(err.message) !== -1) { // chrome
                return err.stack+properties
            } else { // firefox (others?)
                return err.message+'\n'+err.stack+properties
            }
        } else {
            return err.toString()+properties
        }
    } else {
        return err
    }
}

exports.valueToString = function(v) {
    if(v instanceof Error) {
        return exports.errorToString(v)

    } else if(typeof(v) === 'string') {
        return v
    } else {
        return prettyPrint(v)
    }
}

function prettyPrint(value) {
    try {
        return util.inspect(value)       // I've seen this throw an error if the value contains a radio button dom object
    } catch(e) {
        console.log(e)
        return "<error printing value>"
    }
}


function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
}

/***/ }),
/* 40 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/domain-browser/index.js ***!
  \*************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// This file should be ES5 compatible
/* eslint prefer-spread:0, no-var:0, prefer-reflect:0, no-magic-numbers:0 */

module.exports = (function () {
	// Import Events
	var events = __webpack_require__(/*! events */ 12)

	// Export Domain
	var domain = {}
	domain.createDomain = domain.create = function () {
		var d = new events.EventEmitter()

		function emitError (e) {
			d.emit('error', e)
		}

		d.add = function (emitter) {
			emitter.on('error', emitError)
		}
		d.remove = function (emitter) {
			emitter.removeListener('error', emitError)
		}
		d.bind = function (fn) {
			return function () {
				var args = Array.prototype.slice.call(arguments)
				try {
					fn.apply(null, args)
				}
				catch (err) {
					emitError(err)
				}
			}
		}
		d.intercept = function (fn) {
			return function (err) {
				if ( err ) {
					emitError(err)
				}
				else {
					var args = Array.prototype.slice.call(arguments, 1)
					try {
						fn.apply(null, args)
					}
					catch (err) {
						emitError(err)
					}
				}
			}
		}
		d.run = function (fn) {
			try {
				fn()
			}
			catch (err) {
				emitError(err)
			}
			return this
		}
		d.dispose = function () {
			this.removeAllListeners()
			return this
		}
		d.enter = d.exit = function () {
			return this
		}
		return d
	}
	return domain
}).call(this)


/***/ }),
/* 41 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/proto/proto.js ***!
  \****************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var noop = function() {}

var prototypeName='prototype', undefined, protoUndefined='undefined', init='init', ownProperty=({}).hasOwnProperty; // minifiable variables
function proto() {
    var args = arguments // minifiable variables

    if(args.length == 1) {
        var parent = {init: noop}
        var prototypeBuilder = args[0]

    } else { // length == 2
        var parent = args[0]
        var prototypeBuilder = args[1]
    }

    // special handling for Error objects
    var namePointer = {}    // name used only for Error Objects
    if([Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError].indexOf(parent) !== -1) {
        parent = normalizeErrorObject(parent, namePointer)
    }

    // set up the parent into the prototype chain if a parent is passed
    var parentIsFunction = typeof(parent) === "function"
    if(parentIsFunction) {
        prototypeBuilder[prototypeName] = parent[prototypeName]
    } else {
        prototypeBuilder[prototypeName] = parent
    }

    // the prototype that will be used to make instances
    var prototype = new prototypeBuilder(parent)
    namePointer.name = prototype.name

    // if there's no init, assume its inheriting a non-proto class, so default to applying the superclass's constructor.
    if(!prototype[init] && parentIsFunction) {
        prototype[init] = function() {
            parent.apply(this, arguments)
        }
    }

    // constructor for empty object which will be populated via the constructor
    var F = function() {}
        F[prototypeName] = prototype    // set the prototype for created instances

    var constructorName = prototype.name?prototype.name:''
    if(prototype[init] === undefined || prototype[init] === noop) {
        var ProtoObjectFactory = new Function('F',
            "return function " + constructorName + "(){" +
                "return new F()" +
            "}"
        )(F)
    } else {
        // dynamically creating this function cause there's no other way to dynamically name a function
        var ProtoObjectFactory = new Function('F','i','u','n', // shitty variables cause minifiers aren't gonna minify my function string here
            "return function " + constructorName + "(){ " +
                "var x=new F(),r=i.apply(x,arguments)\n" +    // populate object via the constructor
                "if(r===n)\n" +
                    "return x\n" +
                "else if(r===u)\n" +
                    "return n\n" +
                "else\n" +
                    "return r\n" +
            "}"
        )(F, prototype[init], proto[protoUndefined]) // note that n is undefined
    }

    prototype.constructor = ProtoObjectFactory;    // set the constructor property on the prototype

    // add all the prototype properties onto the static class as well (so you can access that class when you want to reference superclass properties)
    for(var n in prototype) {
        addProperty(ProtoObjectFactory, prototype, n)
    }

    // add properties from parent that don't exist in the static class object yet
    for(var n in parent) {
        if(ownProperty.call(parent, n) && ProtoObjectFactory[n] === undefined) {
            addProperty(ProtoObjectFactory, parent, n)
        }
    }

    ProtoObjectFactory.parent = parent;            // special parent property only available on the returned proto class
    ProtoObjectFactory[prototypeName] = prototype  // set the prototype on the object factory

    return ProtoObjectFactory;
}

proto[protoUndefined] = {} // a special marker for when you want to return undefined from a constructor

module.exports = proto

function normalizeErrorObject(ErrorObject, namePointer) {
    function NormalizedError() {
        var tmp = new ErrorObject(arguments[0])
        tmp.name = namePointer.name

        this.message = tmp.message
        if(Object.defineProperty) {
            /*this.stack = */Object.defineProperty(this, 'stack', { // getter for more optimizy goodness
                get: function() {
                    return tmp.stack
                },
                configurable: true // so you can change it if you want
            })
        } else {
            this.stack = tmp.stack
        }

        return this
    }

    var IntermediateInheritor = function() {}
        IntermediateInheritor.prototype = ErrorObject.prototype
    NormalizedError.prototype = new IntermediateInheritor()

    return NormalizedError
}

function addProperty(factoryObject, prototype, property) {
    try {
        var info = Object.getOwnPropertyDescriptor(prototype, property)
        if(info.get !== undefined || info.get !== undefined && Object.defineProperty !== undefined) {
            Object.defineProperty(factoryObject, property, info)
        } else {
            factoryObject[property] = prototype[property]
        }
    } catch(e) {
        // do nothing, if a property (like `name`) can't be set, just ignore it
    }
}

/***/ }),
/* 42 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/punycode/punycode.js ***!
  \**********************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/module.js */ 54)(module), __webpack_require__(/*! ./../webpack/buildin/global.js */ 3)))

/***/ }),
/* 43 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/querystring-es3/decode.js ***!
  \***************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 44 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/querystring-es3/encode.js ***!
  \***************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 45 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/querystring-es3/index.js ***!
  \**************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 43);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 44);


/***/ }),
/* 46 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/setimmediate/setImmediate.js ***!
  \******************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 3), __webpack_require__(/*! ./../process/browser.js */ 1)))

/***/ }),
/* 47 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/timers-browserify/main.js ***!
  \***************************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ 46);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 48 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/trimArguments/trimArguments.js ***!
  \********************************************************************************************/
/***/ (function(module, exports) {

// resolves varargs variable into more usable form
// args - should be a function arguments variable
// returns a javascript Array object of arguments that doesn't count trailing undefined values in the length
module.exports = function(theArguments) {
    var args = Array.prototype.slice.call(theArguments, 0)

    var count = 0;
    for(var n=args.length-1; n>=0; n--) {
        if(args[n] === undefined)
            count++
    }
    args.splice(-0, count)
    return args
}

/***/ }),
/* 49 */
/* unknown exports provided */
/* all exports used */
/*!************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/url/url.js ***!
  \************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(/*! punycode */ 42);
var util = __webpack_require__(/*! ./util */ 50);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(/*! querystring */ 45);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 50 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/url/util.js ***!
  \*************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 51 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/util/~/inherits/inherits_browser.js ***!
  \*************************************************************************************************/
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 52 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/util/support/isBufferBrowser.js ***!
  \*********************************************************************************************/
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 53 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/EventEmitterB/~/util/util.js ***!
  \**************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ 52);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(/*! inherits */ 51);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 3), __webpack_require__(/*! ./../process/browser.js */ 1)))

/***/ }),
/* 54 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 55 */
/* unknown exports provided */
/* all exports used */
/*!**********************!*\
  !*** ./all.tests.js ***!
  \**********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Unit = __webpack_require__(/*! deadunit */ 13)

var EventEmitterB = __webpack_require__(/*! ../EventEmitterB */ 14)
var testUtils = __webpack_require__(/*! testUtils */ 15)



var tests = Unit.test("Testing EventEmitterB", function(t) {



    //*
    this.test("ifon, ifoff", function() {

        this.test("normal usage", function(t) {
            this.count(56)

            var e = EventEmitterB()

            var event = testUtils.seq(
                // e.on('a', cb1)
                function(eventName, type) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'on')
                },function(eventName, type, all) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'on')
                    t.eq(all, true)

                    // e.on('b', cb2)
                },function(eventName, type) {
                    t.eq(eventName, 'b')
                    t.eq(type, 'on')
                },function(eventName, type, all) {
                    t.eq(eventName, 'b')
                    t.eq(type, 'on')
                    t.eq(all, true)

                    // e.removeListener('b', cb2)
                },function(eventName, type) {
                    t.eq(eventName, 'b')
                    t.eq(type, 'off')
                },function(eventName, type, all) {
                    t.eq(eventName, 'b')
                    t.eq(type, 'off')
                    t.eq(all, true)

                    // e.removeListener('a', cb2)
                },function(eventName, type) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'off')
                },function(eventName, type, all) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'off')
                    t.eq(all, true)

                    // e.once('a', cb3)
                },function(eventName, type) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'on')
                },function(eventName, type, all) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'on')
                    t.eq(all, true)

                    // e.emit('a')
                },function(eventName, type) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'off')
                },function(eventName, type, all) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'off')
                    t.eq(all, true)

                    // e.on('a', cb1)
                    // e.on('b', cb1)
                    // e.on('a', cb2)
                    // e.on('b', cb2)
                    // e.on('c', cb1)
                },function(eventName, type) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'on')
                },function(eventName, type, all) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'on')
                    t.eq(all, true)
                },function(eventName, type) {
                    t.eq(eventName, 'b')
                    t.eq(type, 'on')
                },function(eventName, type, all) {
                    t.eq(eventName, 'b')
                    t.eq(type, 'on')
                    t.eq(all, true)
                },function(eventName, type, all) {
                    t.eq(eventName, 'c')
                    t.eq(type, 'on')
                    t.eq(all, true)

                    // e.removeAllListeners('a')
                },function(eventName, type) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'off')
                },function(eventName, type, all) {
                    t.eq(eventName, 'a')
                    t.eq(type, 'off')
                    t.eq(all, true)

                    // e.removeAllListeners()
                },function(eventName, type) {
                    t.eq(eventName, 'b')
                    t.eq(type, 'off')
                },function(eventName, type, all) {
                    t.eq(eventName, 'b')
                    t.eq(type, 'off')
                    t.eq(all, true)
                },function(eventName, type, all) {
                    t.eq(eventName, 'c')
                    t.eq(type, 'off')
                    t.eq(all, true)
                })

            e.ifon('a', function() {
                event('a', 'on')
            })
            e.ifoff('a', function() {
                event('a', 'off')
            })
            e.ifon('b', function() {
                event('b', 'on')
            })
            e.ifoff('b', function() {
                event('b', 'off')
            })

            e.ifon(function(eventName) {
                event(eventName, 'on', true)
            })
            e.ifoff(function(eventName) {
                event(eventName, 'off', true)
            })

            var cb1 = function(){}
            var cb2 = function(){}
            var cb3 = function(){}

            e.on('a', cb1)
            e.on('b', cb2)
            e.on('a', cb2)
            e.removeListener('a', cb1)
            e.removeListener('b', cb2)
            e.removeListener('a', cb2)

            e.once('a', cb3)
            e.emit('a')

            e.on('a', cb1)
            e.on('b', cb1)
            e.on('a', cb2)
            e.on('b', cb2)
            e.on('c', cb1)
            e.removeAllListeners('a')
            e.removeAllListeners()
        })

        this.test("ifon after events have been attachd", function(t) {
            this.count(4)

            var e = EventEmitterB()

            var sequenceEvent = testUtils.seq(
                // e.on('a', cb1)
                function(eventName) {
                    t.eq(eventName, 'shmaotown')
                },function(eventName) {
                    t.eq(eventName, 'you lazy plughole')
                },function(eventName) {
                    t.eq(eventName, 'all shmaotown')
                },function(eventName) {
                    t.eq(eventName, 'all you lazy plughole')
                })

            e.on('shmaotown', function() {})
            e.on('you lazy plughole', function() {})


            e.ifon('shmaotown', function() {
                sequenceEvent('shmaotown')
            })
            e.ifon('you lazy plughole', function() {
                sequenceEvent('you lazy plughole')
            })
            e.ifon(function(eventName) {
                sequenceEvent('all '+eventName)
            })
        })

        this.test("remove ifon", function(t) {
            this.count(26)

            var e = EventEmitterB()

            var event = testUtils.seq(
                // remove a
                function(eventName) {
                    t.eq(eventName, 'a2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'b')
                },function(eventName) {
                    t.eq(eventName, 'b2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'c')
                },function(eventName) {
                    t.eq(eventName, 'c2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')

                    // remove bs
                },function(eventName) {
                    t.eq(eventName, 'a2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'c')
                },function(eventName) {
                    t.eq(eventName, 'c2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')

                    // remove ifon-all callback
                },function(eventName) {
                    t.eq(eventName, 'a2')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'c')
                },function(eventName) {
                    t.eq(eventName, 'c2')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                })

            var a,a2, b,b2, c,c2, all1,all2
            e.ifon('a', a = function() {
                event('a')
            })
            e.ifon('a', a2=function() {
                event('a2')
            })
            e.ifon('b', b=function() {
                event('b')
            })
            e.ifon('b', b2=function() {
                event('b2')
            })
            e.ifon('c', c=function() {
                event('c')
            })
            e.ifon('c', c2=function() {
                event('c2')
            })

            e.ifon(all1=function() {
                event('all1')
            })
            e.ifon(all2=function() {
                event('all2')
            })

            t.log('remove a')
            e.removeIfon('a', a)
            e.on('a',function(){})
            e.on('b',function(){})
            e.on('c',function(){})

            e.removeAllListeners()

            t.log('remove bs')
            e.removeIfon('b')
            e.on('a',function(){})
            e.on('b',function(){})
            e.on('c',function(){})

            e.removeAllListeners()

            t.log('remove ifon-all callback')
            e.removeIfon(all1)
            e.on('a',function(){})
            e.on('b',function(){})
            e.on('c',function(){})

            e.removeAllListeners()

            t.log('remove all')
            e.removeIfon()
            e.on('a',function(){})
            e.on('b',function(){})
            e.on('c',function(){})
        })

        this.test("remove ifoff", function(t) {
            this.count(26)

            var e = EventEmitterB()

            var event = testUtils.seq(
                // remove a
                function(eventName) {
                    t.eq(eventName, 'a2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'b')
                },function(eventName) {
                    t.eq(eventName, 'b2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'c')
                },function(eventName) {
                    t.eq(eventName, 'c2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')

                    // remove bs
                },function(eventName) {
                    t.eq(eventName, 'a2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'c')
                },function(eventName) {
                    t.eq(eventName, 'c2')
                },function(eventName) {
                    t.eq(eventName, 'all1')
                },function(eventName) {
                    t.eq(eventName, 'all2')

                    // remove ifoff-all callback
                },function(eventName) {
                    t.eq(eventName, 'a2')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                },function(eventName) {
                    t.eq(eventName, 'c')
                },function(eventName) {
                    t.eq(eventName, 'c2')
                },function(eventName) {
                    t.eq(eventName, 'all2')
                })

            var a,a2, b,b2, c,c2, all1, all2
            e.ifoff('a', a = function() {
                event('a')
            })
            e.ifoff('a', a2=function() {
                event('a2')
            })
            e.ifoff('b', b=function() {
                event('b')
            })
            e.ifoff('b', b2=function() {
                event('b2')
            })
            e.ifoff('c', c=function() {
                event('c')
            })
            e.ifoff('c', c2=function() {
                event('c2')
            })

            e.ifoff(all1=function() {
                event('all1')
            })
            e.ifoff(all2=function() {
                event('all2')
            })

            var a,b,c

            t.log('remove a')
            e.removeIfoff('a', a)
            e.on('a',a=function(){})
            e.on('b',b=function(){})
            e.on('c',c=function(){})
            e.removeListener('a',a)
            e.removeListener('b',b)
            e.removeListener('c',c)

            e.on('a',a)
            e.on('b',b)
            e.on('c',c)

            t.log('remove bs')
            e.removeIfoff('b')
            e.removeListener('a',a)
            e.removeListener('b',b)
            e.removeListener('c',c)

            e.on('a',a)
            e.on('b',b)
            e.on('c',c)

            t.log('remove ifoff-all callback')
            e.removeIfoff(all1)
            e.removeListener('a',a)
            e.removeListener('b',b)
            e.removeListener('c',c)

            e.on('a',a)
            e.on('b',b)
            e.on('c',c)

            t.log('remove all')
            e.removeIfoff()
            e.removeListener('a',a)
            e.removeListener('b',b)
            e.removeListener('c',c)
        })
    })

    this.test("proxy events", function() {
        this.test("proxy all", function(t){
            this.count(2)

            var A = EventEmitterB()
            var B = EventEmitterB()

            var testEvent = testUtils.seq(
                function(eventName) {
                    t.eq(eventName, 'moose')
                },function(eventName) {
                    t.eq(eventName, 'bark')
                })


            A.proxy(B)   // proxy all events

            A.on('moose', function() {
                testEvent('moose')
            })
            A.on('bark', function() {
                testEvent('bark')
            })

            B.emit('moose')
            B.emit('bark')
        })

        this.test("proxy only", function(t){
            this.count(1)

            var A = EventEmitterB()
            var B = EventEmitterB()

            var testEvent = testUtils.seq(
                function(eventName) {
                    t.eq(eventName, 'moose')
                })


            A.proxy(B, {only: ['moose']})   // proxy only the 'moose' event

            A.on('moose', function() {
                testEvent('moose')
            })
            A.on('bark', function() {
                testEvent('bark')
            })

            B.emit('moose')
            B.emit('bark')
        })

        this.test("proxy except", function(t){
            this.count(1)

            var A = EventEmitterB()
            var B = EventEmitterB()

            var testEvent = testUtils.seq(
                function(eventName) {
                    t.eq(eventName, 'bark')
                })


            A.proxy(B, {except: ['moose']})   // proxy only the 'moose' event

            A.on('moose', function() {
                testEvent('moose')
            })
            A.on('bark', function() {
                testEvent('bark')
            })

            B.emit('moose')
            B.emit('bark')
        })

        this.test("proxy removeListener and removeAllListeners", function() {
            var A = EventEmitterB()
            var B = EventEmitterB()

            this.eq(B.listeners('moose').length, 0)

            A.proxy(B)

            var handler;
            A.on('moose', handler=function() {
                testEvent('moose')
            })

            this.eq(B.listeners('moose').length, 1)

            A.removeListener('moose',handler)
            this.eq(B.listeners('moose').length, 0)

            A.on('moose', handler)
            A.removeAllListeners('moose')
            this.eq(B.listeners('moose').length, 0)

            A.on('moose', handler)
            A.removeAllListeners()
            this.eq(B.listeners('moose').length, 0)
        })
    })
    //*/
})

tests.writeConsole(1000)



/***/ })
/******/ ]);
});
//# sourceMappingURL=allTests.umd.js.map