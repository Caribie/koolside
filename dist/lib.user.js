// ==UserScript==
// @name          koolside
// @namespace     https://github.com/toriato/koolside
// @version       0.1.0
// @author        Sangha Lee <totoriato@gmail.com>
// @description   디시인사이드 도우미
// @include       https://*.dcinside.com/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/less.js/3.10.3/less.min.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @run-at        document-start
// ==/UserScript==
/******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/decode-uri-component/index.js":
/*!****************************************************!*\
  !*** ./node_modules/decode-uri-component/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ }),

/***/ "./node_modules/dot-prop/index.js":
/*!****************************************!*\
  !*** ./node_modules/dot-prop/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const isObj = __webpack_require__(/*! is-obj */ "./node_modules/is-obj/index.js");

const disallowedKeys = [
	'__proto__',
	'prototype',
	'constructor'
];

const isValidPath = pathSegments => !pathSegments.some(segment => disallowedKeys.includes(segment));

function getPathSegments(path) {
	const pathArray = path.split('.');
	const parts = [];

	for (let i = 0; i < pathArray.length; i++) {
		let p = pathArray[i];

		while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
			p = p.slice(0, -1) + '.';
			p += pathArray[++i];
		}

		parts.push(p);
	}

	if (!isValidPath(parts)) {
		return [];
	}

	return parts;
}

module.exports = {
	get(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return value === undefined ? object : value;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return;
		}

		for (let i = 0; i < pathArray.length; i++) {
			if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i])) {
				return value;
			}

			object = object[pathArray[i]];

			if (object === undefined || object === null) {
				// `object` is either `undefined` or `null` so we want to stop the loop, and
				// if this is not the last bit of the path, and
				// if it did't return `undefined`
				// it would return `null` if `object` is `null`
				// but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
				if (i !== pathArray.length - 1) {
					return value;
				}

				break;
			}
		}

		return object;
	},

	set(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return object;
		}

		const root = object;
		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (!isObj(object[p])) {
				object[p] = {};
			}

			if (i === pathArray.length - 1) {
				object[p] = value;
			}

			object = object[p];
		}

		return root;
	},

	delete(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return;
		}

		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (i === pathArray.length - 1) {
				delete object[p];
				return;
			}

			object = object[p];

			if (!isObj(object)) {
				return;
			}
		}
	},

	has(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return false;
		}

		// eslint-disable-next-line unicorn/no-for-loop
		for (let i = 0; i < pathArray.length; i++) {
			if (isObj(object)) {
				if (!(pathArray[i] in object)) {
					return false;
				}

				object = object[pathArray[i]];
			} else {
				return false;
			}
		}

		return true;
	}
};


/***/ }),

/***/ "./node_modules/is-obj/index.js":
/*!**************************************!*\
  !*** ./node_modules/is-obj/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = value => {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
};


/***/ }),

/***/ "./node_modules/p-limit/index.js":
/*!***************************************!*\
  !*** ./node_modules/p-limit/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const pTry = __webpack_require__(/*! p-try */ "./node_modules/p-try/index.js");

const pLimit = concurrency => {
	if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
		return Promise.reject(new TypeError('Expected `concurrency` to be a number from 1 and up'));
	}

	const queue = [];
	let activeCount = 0;

	const next = () => {
		activeCount--;

		if (queue.length > 0) {
			queue.shift()();
		}
	};

	const run = (fn, resolve, ...args) => {
		activeCount++;

		const result = pTry(fn, ...args);

		resolve(result);

		result.then(next, next);
	};

	const enqueue = (fn, resolve, ...args) => {
		if (activeCount < concurrency) {
			run(fn, resolve, ...args);
		} else {
			queue.push(run.bind(null, fn, resolve, ...args));
		}
	};

	const generator = (fn, ...args) => new Promise(resolve => enqueue(fn, resolve, ...args));
	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount
		},
		pendingCount: {
			get: () => queue.length
		}
	});

	return generator;
};

module.exports = pLimit;
module.exports.default = pLimit;


/***/ }),

/***/ "./node_modules/p-try/index.js":
/*!*************************************!*\
  !*** ./node_modules/p-try/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const pTry = (fn, ...arguments_) => new Promise(resolve => {
	resolve(fn(...arguments_));
});

module.exports = pTry;
// TODO: remove this in the next major version
module.exports.default = pTry;


/***/ }),

/***/ "./node_modules/query-string/index.js":
/*!********************************************!*\
  !*** ./node_modules/query-string/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const strictUriEncode = __webpack_require__(/*! strict-uri-encode */ "./node_modules/strict-uri-encode/index.js");
const decodeComponent = __webpack_require__(/*! decode-uri-component */ "./node_modules/decode-uri-component/index.js");
const splitOnFirst = __webpack_require__(/*! split-on-first */ "./node_modules/split-on-first/index.js");

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;
				if (value === undefined || (options.skipNull && value === null)) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (value === undefined || (options.skipNull && value === null)) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'comma':
			return key => (result, value) => {
				if (value === null || value === undefined || value.length === 0) {
					return result;
				}

				if (result.length === 0) {
					return [[encode(key, options), '=', encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(',')];
			};

		default:
			return key => (result, value) => {
				if (value === undefined || (options.skipNull && value === null)) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.split('').indexOf(',') > -1;
				const newValue = isArray ? value.split(',') : value;
				accumulator[key] = newValue;
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parseValue(value, options) {
	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		value = Number(value);
	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		value = value.toLowerCase() === 'true';
	}

	return value;
}

function parse(input, options) {
	options = Object.assign({
		decode: true,
		sort: true,
		arrayFormat: 'none',
		parseNumbers: false,
		parseBooleans: false
	}, options);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof input !== 'string') {
		return ret;
	}

	input = input.trim().replace(/^[?#&]/, '');

	if (!input) {
		return ret;
	}

	for (const param of input.split('&')) {
		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : decode(value, options);
		formatter(decode(key, options), value, ret);
	}

	for (const key of Object.keys(ret)) {
		const value = ret[key];
		if (typeof value === 'object' && value !== null) {
			for (const k of Object.keys(value)) {
				value[k] = parseValue(value[k], options);
			}
		} else {
			ret[key] = parseValue(value, options);
		}
	}

	if (options.sort === false) {
		return ret;
	}

	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none'
	}, options);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = Object.assign({}, object);
	if (options.skipNull) {
		for (const key of Object.keys(objectCopy)) {
			if (objectCopy[key] === undefined || objectCopy[key] === null) {
				delete objectCopy[key];
			}
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (input, options) => {
	return {
		url: removeHash(input).split('?')[0] || '',
		query: parse(extract(input), options)
	};
};


/***/ }),

/***/ "./node_modules/split-on-first/index.js":
/*!**********************************************!*\
  !*** ./node_modules/split-on-first/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};


/***/ }),

/***/ "./node_modules/strict-uri-encode/index.js":
/*!*************************************************!*\
  !*** ./node_modules/strict-uri-encode/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);


/***/ }),

/***/ "./node_modules/string-format/index.js":
/*!*********************************************!*\
  !*** ./node_modules/string-format/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

void function(global) {

  'use strict';

  //  ValueError :: String -> Error
  function ValueError(message) {
    var err = new Error(message);
    err.name = 'ValueError';
    return err;
  }

  //  create :: Object -> String,*... -> String
  function create(transformers) {
    return function(template) {
      var args = Array.prototype.slice.call(arguments, 1);
      var idx = 0;
      var state = 'UNDEFINED';

      return template.replace(
        /([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,
        function(match, literal, _key, xf) {
          if (literal != null) {
            return literal;
          }
          var key = _key;
          if (key.length > 0) {
            if (state === 'IMPLICIT') {
              throw ValueError('cannot switch from ' +
                               'implicit to explicit numbering');
            }
            state = 'EXPLICIT';
          } else {
            if (state === 'EXPLICIT') {
              throw ValueError('cannot switch from ' +
                               'explicit to implicit numbering');
            }
            state = 'IMPLICIT';
            key = String(idx);
            idx += 1;
          }

          //  1.  Split the key into a lookup path.
          //  2.  If the first path component is not an index, prepend '0'.
          //  3.  Reduce the lookup path to a single result. If the lookup
          //      succeeds the result is a singleton array containing the
          //      value at the lookup path; otherwise the result is [].
          //  4.  Unwrap the result by reducing with '' as the default value.
          var path = key.split('.');
          var value = (/^\d+$/.test(path[0]) ? path : ['0'].concat(path))
            .reduce(function(maybe, key) {
              return maybe.reduce(function(_, x) {
                return x != null && key in Object(x) ?
                  [typeof x[key] === 'function' ? x[key]() : x[key]] :
                  [];
              }, []);
            }, [args])
            .reduce(function(_, x) { return x; }, '');

          if (xf == null) {
            return value;
          } else if (Object.prototype.hasOwnProperty.call(transformers, xf)) {
            return transformers[xf](value);
          } else {
            throw ValueError('no transformer named "' + xf + '"');
          }
        }
      );
    };
  }

  //  format :: String,*... -> String
  var format = create({});

  //  format.create :: Object -> String,*... -> String
  format.create = create;

  //  format.extend :: Object,Object -> ()
  format.extend = function(prototype, transformers) {
    var $format = create(transformers);
    prototype.format = function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this);
      return $format.apply(global, args);
    };
  };

  /* istanbul ignore else */
  if (true) {
    module.exports = format;
  } else {}

}.call(this, this);


/***/ }),

/***/ "./node_modules/wait-for-the-element/waitForTheElement.js":
/*!****************************************************************!*\
  !*** ./node_modules/wait-for-the-element/waitForTheElement.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?t(exports):undefined}(this,function(e){"use strict";function c(e,t){var n=e.type,r=e.target,o=e.addedNodes;if("attributes"===n&&r.matches(t))return r;if("childList"!==n)return null;for(var i=0,u=o;i<u.length;i+=1){var a=u[i];if("function"==typeof a.matches&&a.matches(t))return a}return r.querySelector(t)}function n(a,e){void 0===e&&(e={});var n=e.timeout;void 0===n&&(n=2500);var r=e.scope;return void 0===r&&(r=document),new Promise(function(o,e){var t=r.querySelector(a),i=null;if(null===t){var u=new MutationObserver(function(e){for(var t=0,n=e;t<n.length;t+=1){var r=c(n[t],a);if(null!==r){clearTimeout(i),u.disconnect(),o(r);break}}});u.observe(r,{attributes:!0,subtree:!0,childList:!0}),i=setTimeout(function(){u.disconnect(),e(new Error("No element matches the selector "+a+"."))},n)}else o(t)})}var t={waitForTheElement:n,tryAndWaitForTheElement:function(e,t){return n(e,t).catch(function(){return null})}},r=t.waitForTheElement,o=t.tryAndWaitForTheElement;e.default=t,e.tryAndWaitForTheElement=o,e.waitForTheElement=r,Object.defineProperty(e,"__esModule",{value:!0})});


/***/ }),

/***/ "./src/components/config.ts":
/*!**********************************!*\
  !*** ./src/components/config.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importStar(__webpack_require__(/*! ../includes/config */ "./src/includes/config.ts"));
const utils_1 = __webpack_require__(/*! ../includes/utils */ "./src/includes/utils.ts");
const style_1 = __importDefault(__webpack_require__(/*! ./style */ "./src/components/style.ts"));
function generateItems(details, key) {
    const result = [];
    key = key || '';
    for (let k in details) {
        const item = details[k];
        if (item.items) {
            // 카테고리라면 헤더와 하위 아이템 추가하기
            const i = 2 + (key.match(/\./g) || []).length;
            result.push(`<h${i} class="ks-config-item">${item.name}</h${i}>`);
            result.push(...generateItems(item.items, `${key}${k}.`));
        }
        else {
            // 아이템 추가하기
            const currentKey = `${key}${k}`;
            let html = '';
            switch (typeof item.default) {
                case 'string':
                    html = /* html */ `
            <label>${item.name}</label>
            <input 
              type="text"
              value="${config_1.default.get(currentKey).replace(/"/g, '&quot;')}"
              data-key="${currentKey}">
          `;
                    break;
                case 'boolean':
                    html = /* html */ `
            <label>
              <input
                type="checkbox" 
                data-key="${currentKey}"
                ${config_1.default.get(currentKey) ? 'checked' : ''}>
              <span>${item.name}</span>
            </label>
          `;
                    break;
            }
            result.push(/* html */ `
        <div class="ks-config-item ks-config-key">
          ${html}
        </div>
      `);
        }
    }
    return result;
}
const componentConfig = {
    create() {
        var _a;
        const wrapper = utils_1.createElement(/* html */ `
      <div id="ks-config">
        <div>
          <h1>설정</h1>
          ${generateItems(config_1.details).join('\n')}
        </div>
      </div>
    `);
        document.body.prepend(wrapper);
        (_a = document.querySelector('#ks-config')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', e => {
            var _a;
            const target = e.target;
            if (target.id === 'ks-config') {
                (_a = target.classList) === null || _a === void 0 ? void 0 : _a.toggle('ks-active');
            }
        });
        function update() {
            const key = this.dataset.key;
            let value;
            switch (typeof config_1.default.get(key)) {
                case 'boolean':
                    value = this.checked;
                    break;
                default:
                    value = this.value;
            }
            config_1.default.set(key, value);
            config_1.default.sync();
            // 스타일 관련 설정이 변경됐다면 스타일시트 컴포턴트 새로 생성하기
            if (key.startsWith('style')) {
                style_1.default.destroy();
                style_1.default.create();
            }
        }
        for (let input of document.querySelectorAll('.ks-config-key input')) {
            input.addEventListener('change', update);
        }
    },
    destroy() {
        var _a;
        (_a = document.querySelector('#ks-preview')) === null || _a === void 0 ? void 0 : _a.remove();
    }
};
exports.default = componentConfig;


/***/ }),

/***/ "./src/components/nav.ts":
/*!*******************************!*\
  !*** ./src/components/nav.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ../includes/utils */ "./src/includes/utils.ts");
const componentNav = {
    create() {
        const nav = utils_1.createElement(/* html */ `
      <ul id="ks-nav">
        <li class="ks-nav-item ks-nav-item-setting">설정</li>
      </ul>
    `);
        const replacement = document.querySelector('.gnb_bar');
        if (replacement) {
            replacement.innerHTML = '';
            replacement.append(nav);
            document.querySelector('.ks-nav-item-setting').addEventListener('click', () => {
                document.querySelector('#ks-config').classList.toggle('ks-active');
            });
        }
    },
    destroy() {
        var _a;
        (_a = document.querySelector('#ks-nav')) === null || _a === void 0 ? void 0 : _a.remove();
    }
};
exports.default = componentNav;


/***/ }),

/***/ "./src/components/preview.ts":
/*!***********************************!*\
  !*** ./src/components/preview.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ../includes/utils */ "./src/includes/utils.ts");
const componentPreview = {
    create() {
        const preview = utils_1.createElement('<div id="ks-preview"></div>');
        document.body.prepend(preview);
    },
    destroy() {
        var _a;
        (_a = document.querySelector('#ks-preview')) === null || _a === void 0 ? void 0 : _a.remove();
    }
};
exports.default = componentPreview;


/***/ }),

/***/ "./src/components/style.ts":
/*!*********************************!*\
  !*** ./src/components/style.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const string_format_1 = __importDefault(__webpack_require__(/*! string-format */ "./node_modules/string-format/index.js"));
const config_1 = __importDefault(__webpack_require__(/*! ../includes/config */ "./src/includes/config.ts"));
const utils_1 = __webpack_require__(/*! ../includes/utils */ "./src/includes/utils.ts");
const template = /* less */ `
  @font-sans: {font_family_sans};
  @font-serif: {font_family_serif};
  @font-monospace: {font_family_monospace};

  @color-primary: #4A56A8;
  @color-primary-dark: #23284f;
  @color-primary-darker: #171a33;

  .ks-clearfix {
    &:after {
      display: table;
      clear: both;
      content: '';
    }
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  body,
  .gall_list,
  button, input, select, table, textarea {
    font-family: @font-sans;
  }

  body {
    &.ks-hide-logo .dc_logo {
      visibility: hidden;
    }
    &.ks-hide-title .left_content header {
      display: none
    }
    &.ks-hide-titlebar .left_content article:nth-child(2) {
      display: none 
    }

    &.ks-hide-right {
      .left_content {
        float: none;
        width: 100%;
      }

      .issuebox {
        width: 100%;
      }
      .minor_intro_box {
        width: calc(100% - 155px);
      }
      .visit_history {
        width: 100%;
        box-sizing: border-box;
      }
      .list_array_option {
        width: 100%;
      }
      .right_content {
        display: none;
      }
    }

    &.ks-hide-right .stickyunit {
      display: none;
    }
    &.ks-hide-right-login .login_box {
      display: none;
    }
    &.ks-hide-right-recommend .r_recommend {
      display: none;
    }
    &.ks-hide-right-issuezoom .r_issuezoom {
      display: none;
    }
    &.ks-hide-right-news .r_news {
      display: none; 
    }
    &.ks-hide-right-realtime .r_realtime_issue {
      display: none;
    }
    &.ks-hide-right-hit .r_hit { 
      display: none; 
    }
    &.ks-hide-right-sec-recommend .r_sec_recommend { 
      display: none; 
    }
    &.ks-hide-right-wiki .r_wiki { 
      display: none; 
    }
  
    &.ks-prevent-scrolling {
      overflow: hidden;
      height: 100%;
    }
  }

  #ks-nav {
    margin: 0 auto;
    width: 100%;
    max-width: 1100px;
    list-style-type: none;
    color: white;
  
    .ks-nav-item {
      padding: 1em 2em;
      cursor: pointer;
    }
  }

  #ks-config {
    transition: opacity .25s;
    z-index: 500;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    visibility: hidden;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    cursor: pointer;

    > div {
      overflow: hidden;
      overflow-y: auto;
      width: 100%;
      min-width: 400px;
      max-width: 600px;
      height: 100%;
      min-height: 300px;
      max-height: 80%;
      border-radius: 5px;
      background: @color-primary-dark;
      box-shadow: 0 0 100% black;
      color: white;
      cursor: initial;
    }

    .ks-config-item {
      box-sizing: border-box;
      padding: 0.5em 1em;
      
      &:nth-child(even) {
        background: rgba(0, 0, 0, .15);
      }
    }

    .ks-config-key {
      display: block;
      width: 100%;

      label {
        float: left;
        display: inline-block;
        cursor: pointer;
      }

      > input {
        float: right;
        display: inline-block;
        border: 1px solid rgba(0, 0, 0, .15);
        background: @color-primary-dark;
        font-family: @font-monospace;
        color: white;
      }

      .ks-clearfix();
    }
    
    &.ks-active {
      visibility: visible;
      opacity: 1;
    }
  }

  #ks-preview {
    transition: opacity .25s;
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    overflow-y: auto;
    transition: opacity .25s;
    visibility: hidden;
    padding: 1em;
    max-width: 500px;
    max-height: 250px;
    opacity: 0;
    background: black;
    box-shadow: 0 0 5px black;
    border-radius: 5px;
    font-size: {font_size_preview};
    line-height: {font_size_preview};
    color: white;

    img {
      max-width: 100%;
      max-height: 200px;
      cursor: pointer;

      &.ks-active {
        max-height: 100%;
      }
    }

    &.ks-active {
      visibility: visible;
      opacity: .85;
    }
  }

  .us-post {
    &.ks-new {
      animation-name: ks-new;
      animation-duration: .5s;
    }

    &.ks-deleted {
      background: rgb(240, 100, 100)
    }
  }

  @keyframes ks-new {
    from {
      transform: scaleY(0);
      max-height: 0;
      background: rgba(240, 100, 100, 1);
    }
    to {
      transform: scaleY(1);
      max-height: 100%;
      background: rgba(240, 100, 100, 0);
    }
  }
`;
const componentStyle = {
    create() {
        const style = utils_1.createElement('<style id="ks-style" type="text/less"></style>');
        style.innerHTML = string_format_1.default(template, config_1.default.get('style'));
        document.head.append(style);
        if (config_1.default.get('debug.less')) {
            less.options.env = 'development';
        }
        less.refresh();
    },
    destroy() {
        var _a;
        (_a = document.querySelector('#ks-style')) === null || _a === void 0 ? void 0 : _a.remove();
    }
};
exports.default = componentStyle;


/***/ }),

/***/ "./src/includes/cache.ts":
/*!*******************************!*\
  !*** ./src/includes/cache.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(__webpack_require__(/*! ./request */ "./src/includes/request.ts"));
const utils_1 = __webpack_require__(/*! ./utils */ "./src/includes/utils.ts");
class Cache extends Map {
    async fetchPost(gallery, no) {
        const url = `https://m.dcinside.com/board/${gallery}/${no}`;
        const res = await request_1.default({
            url,
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36'
            }
        });
        // body 태그 속만 불러오기
        const matches = res.responseText.match(utils_1.BODY_PATTERN);
        const $ = utils_1.createElement(matches.groups.body).parentNode;
        // 필요없는 태그 제거하기
        const content = $.querySelector('.thum-txtin');
        const query = '*:not(img):not(iframe):not(br):empty';
        for (let e of content.querySelectorAll(query)) {
            e.remove();
        }
        // 모든 이미지 원본 주소로 변환하기
        for (let img of content.querySelectorAll('img')) {
            const src = img.dataset.original || img.src;
            while (img.attributes.length) {
                img.removeAttribute(img.attributes[0].name);
            }
            img.src = src;
        }
        // 캐싱하기
        this.set(no, content);
        return content;
    }
    fetchPosts(gallery, posts) {
        return posts.map(no => this.fetchPost(gallery, no));
    }
}
const cache = new Cache();
exports.default = cache;


/***/ }),

/***/ "./src/includes/config.ts":
/*!********************************!*\
  !*** ./src/includes/config.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __importDefault(__webpack_require__(/*! ./storage */ "./src/includes/storage.ts"));
function generateDefaultValeus(details, map) {
    const result = {};
    for (let key in details) {
        const detail = details[key];
        result[key] = detail.items ? generateDefaultValeus(detail.items, map) : detail.default;
    }
    return result;
}
exports.details = {
    hide: {
        name: '숨길 요소',
        items: {
            logo: {
                name: '웹 사이트 로고',
                default: false
            },
            title: {
                name: '갤러리 제목',
                default: false
            },
            titlebar: {
                name: '갤러리 정보',
                default: false
            },
            right: {
                name: '우측 사이드 바',
                items: {
                    all: {
                        name: '전체',
                        default: false
                    },
                    login: {
                        name: '사용자 정보',
                        default: false
                    },
                    recommend: {
                        name: '개념글',
                        default: false
                    },
                    issuezoom: {
                        name: '이슈 줌',
                        default: false
                    },
                    news: {
                        name: '뉴스',
                        default: false
                    },
                    realtime: {
                        name: '실시간 검색어',
                        default: false
                    },
                    hit: {
                        name: '힛',
                        default: false
                    },
                    sec_recommend: {
                        name: '초개념',
                        default: false
                    },
                    wiki: {
                        name: '디시위키',
                        default: false
                    }
                }
            }
        }
    },
    style: {
        name: '사용자 스타일',
        items: {
            font_family_sans: {
                name: '산세리프 글꼴',
                default: '"맑은 고딕", sans-serif'
            },
            font_family_serif: {
                name: '세리프 글꼴',
                default: 'serif'
            },
            font_family_monospace: {
                name: '고정폭 글꼴',
                default: '"D2Coding", NanumGothicCoding, monospace'
            },
            font_size_preview: {
                name: '프리뷰 글자 크기',
                default: '1.5em'
            }
        }
    },
    debug: {
        name: '디버깅',
        items: {
            less: {
                name: 'Less',
                default: true
            }
        }
    }
};
const defaultValue = generateDefaultValeus(exports.details);
const config = new storage_1.default('config', {
    defaultValue,
    onSync() {
        const classes = [];
        if (this.get('hide.logo'))
            classes.push('ks-hide-logo');
        if (this.get('hide.title'))
            classes.push('ks-hide-title');
        if (this.get('hide.titlebar'))
            classes.push('ks-hide-titlebar');
        if (this.get('hide.right.all')) {
            classes.push('ks-hide-right');
        }
        else {
            if (this.get('hide.right.login'))
                classes.push('ks-hide-right-login');
            if (this.get('hide.right.recommend'))
                classes.push('ks-hide-right-recommend');
            if (this.get('hide.right.issuezoom'))
                classes.push('ks-hide-right-issuezoom');
            if (this.get('hide.right.news'))
                classes.push('ks-hide-right-news');
            if (this.get('hide.right.realtime'))
                classes.push('ks-hide-right-realtime');
            if (this.get('hide.right.hit'))
                classes.push('ks-hide-right-hit');
            if (this.get('hide.right.sec_recommend'))
                classes.push('ks-hide-right-sec-recommend');
            if (this.get('hide.right.wiki'))
                classes.push('ks-hide-right-wiki');
        }
        document.body.setAttribute('class', classes.join(' '));
    }
});
exports.default = config;


/***/ }),

/***/ "./src/includes/request.ts":
/*!*********************************!*\
  !*** ./src/includes/request.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = __importDefault(__webpack_require__(/*! ./cache */ "./src/includes/cache.ts"));
const utils_1 = __webpack_require__(/*! ./utils */ "./src/includes/utils.ts");
function request(opts) {
    return new Promise((resolve, reject) => {
        opts.method = opts.method || 'GET';
        const clonedOpts = {
            ...opts,
            onload: res => {
                if (opts.onload) {
                    opts.onload(res);
                }
                if (res.readyState !== 4) {
                    return;
                }
                resolve(res);
            },
            onerror: res => {
                if (opts.onerror) {
                    opts.onerror(res);
                }
                const e = new Error('placeholder request error');
                reject(e);
            }
        };
        GM_xmlhttpRequest(clonedOpts);
    });
}
exports.default = request;
async function fetchList(gallery) {
    const res = await request({
        url: location.href
    });
    // body 태그 속만 불러오기
    const matches = res.responseText.match(utils_1.BODY_PATTERN);
    const $ = utils_1.createElement(matches.groups.body).parentNode;
    // 필요없는 글은 삭제하기
    const addedPosts = $.querySelectorAll('.us-post');
    const tbody = document.querySelector('.gall_list tbody');
    const numbers = [];
    for (let post of addedPosts) {
        switch (true) {
            case post.dataset.type === 'icon_notice':
                continue;
        }
        const no = parseInt(post.dataset.no, 10);
        // 기존 글 댓글 수, 조회 수 등 업데이트
        const cached = document.querySelector(`.us-post[data-no="${post.dataset.no}"]`);
        if (cached) {
            cached.innerHTML = post.innerHTML;
        }
        // 캐시되지 않은 글이라면 캐시하기 추가하기
        if (!cache_1.default.has(no)) {
            cache_1.default.fetchPost(gallery, no);
            post.classList.add('ks-new');
            tbody.prepend(post);
        }
        numbers.push(no);
    }
    const lowest = Math.min(...numbers);
    for (let post of document.querySelectorAll('.us-post')) {
        const no = parseInt(post.dataset.no, 10);
        if (no < lowest) {
            break;
        }
        if (!numbers.includes(no)) {
            post.classList.add('ks-deleted');
        }
    }
}
exports.fetchList = fetchList;


/***/ }),

/***/ "./src/includes/storage.ts":
/*!*********************************!*\
  !*** ./src/includes/storage.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dot_prop_1 = __importDefault(__webpack_require__(/*! dot-prop */ "./node_modules/dot-prop/index.js"));
class Storage {
    constructor(key, opts) {
        this.key = key;
        this.opts = opts || {};
        this.storage = GM_getValue(key, opts.defaultValue);
    }
    sync() {
        GM_setValue(this.key, this.storage);
        if (this.opts.onSync) {
            this.opts.onSync.apply(this);
        }
    }
    get(key) {
        return dot_prop_1.default.get(this.storage, key) || dot_prop_1.default.get(this.opts.defaultValue, key);
    }
    set(key, value) {
        dot_prop_1.default.set(this.storage, key, value);
        this.sync();
    }
    export() {
        return this.storage;
    }
    import(value) {
        this.storage = value;
        this.sync();
    }
}
exports.default = Storage;


/***/ }),

/***/ "./src/includes/utils.ts":
/*!*******************************!*\
  !*** ./src/includes/utils.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = __importDefault(__webpack_require__(/*! query-string */ "./node_modules/query-string/index.js"));
function createElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}
exports.createElement = createElement;
function getParameter(key) {
    const params = query_string_1.default.parse(location.search);
    return params[key];
}
exports.getParameter = getParameter;
exports.BODY_PATTERN = /(?<body><body[^>]*>((.|[\n\r])*)<\/body>)/im;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_limit_1 = __importDefault(__webpack_require__(/*! p-limit */ "./node_modules/p-limit/index.js"));
const wait_for_the_element_1 = __webpack_require__(/*! wait-for-the-element */ "./node_modules/wait-for-the-element/waitForTheElement.js");
const config_1 = __importDefault(__webpack_require__(/*! ./components/config */ "./src/components/config.ts"));
const nav_1 = __importDefault(__webpack_require__(/*! ./components/nav */ "./src/components/nav.ts"));
const preview_1 = __importDefault(__webpack_require__(/*! ./components/preview */ "./src/components/preview.ts"));
const style_1 = __importDefault(__webpack_require__(/*! ./components/style */ "./src/components/style.ts"));
const cache_1 = __importDefault(__webpack_require__(/*! ./includes/cache */ "./src/includes/cache.ts"));
const config_2 = __importDefault(__webpack_require__(/*! ./includes/config */ "./src/includes/config.ts"));
const request_1 = __webpack_require__(/*! ./includes/request */ "./src/includes/request.ts");
const utils_1 = __webpack_require__(/*! ./includes/utils */ "./src/includes/utils.ts");
const gallery = utils_1.getParameter('id');
async function main() {
    // 설정 맞추기
    config_2.default.sync();
    // 앱에서 사용할 요소와 스타일 시트 추가하기
    style_1.default.create();
    config_1.default.create();
    nav_1.default.create();
    preview_1.default.create();
    const preview = document.querySelector('#ks-preview');
    function onMouseEvent(e) {
        let el = e.target;
        // 게시글 목록 요소인지 확인하기
        while (el !== null) {
            // 프리뷰 객체라면 프리뷰 박스 내에서 스크롤 해야하므로 무시하기
            if (el === preview) {
                document.body.classList.add('ks-prevent-scrolling');
                break;
            }
            else {
                document.body.classList.remove('ks-prevent-scrolling');
            }
            if (el.classList && el.classList.contains('us-post')) {
                break;
            }
            el = el.parentNode;
        }
        if (el) {
            const no = parseInt(el.dataset.no, 10);
            // 현재 프리뷰가 선택한 게시글이 아니라면 업데이트하기
            if (cache_1.default.has(no) && preview.dataset.no !== el.dataset.no) {
                const scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
                const clientTop = document.body.clientTop || document.documentElement.clientTop || 0;
                const rect = el.getBoundingClientRect();
                const top = rect.top + scrollTop - clientTop;
                preview.style.top = `${top}px`;
                preview.style.left = `${e.pageX + 25}px`;
                preview.dataset.no = el.dataset.no;
                preview.innerHTML = cache_1.default.get(no).innerHTML;
                preview.classList.add('ks-active');
                for (let img of preview.querySelectorAll('img')) {
                    img.addEventListener('click', function () {
                        this.classList.toggle('ks-active');
                    });
                }
            }
        }
        else {
            // 프리뷰 박스 초기화
            preview.classList.remove('ks-active');
            preview.innerHTML = '';
            delete preview.dataset.no;
        }
    }
    document.body.prepend(preview);
    document.addEventListener('mousemove', onMouseEvent);
    // document.addEventListener('mousewheel', onMouseEvent)
    // document.addEventListener('DOMMouseScroll', onMouseEvent) // for our firefox friends :)
    const promises = [];
    const limit = p_limit_1.default(10);
    for (let el of document.querySelectorAll('.us-post')) {
        // 번호 없는 글은 무시하기
        if (!el.dataset.no) {
            console.log(el);
            continue;
        }
        // 공지 게시글은 무시하기
        if (el.dataset.type === 'icon_notice') {
            continue;
        }
        const no = parseInt(el.dataset.no, 10);
        try {
            const promise = limit(() => cache_1.default.fetchPost(gallery, no));
            promises.push(promise);
        }
        catch (e) {
            console.error(e);
        }
    }
    // 현재 불러온 게시글 전체 캐싱하기
    await Promise.all(promises);
    // 게시글 실시간 업데이트 시작하기
    setInterval(() => request_1.fetchList(gallery), 1000);
}
// 최상단 페이지에서만 스크립트 실행하기
if (window.top === window.self) {
    // 갤러리 테이블 요소 대기 후 main() 실행하기
    wait_for_the_element_1.tryAndWaitForTheElement('.copyright')
        .catch(() => console.error('페이지에서 게시글 테이블 요소를 불러올 수 없습니다'))
        .then(() => main())
        .catch(console.error);
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2RlY29kZS11cmktY29tcG9uZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kb3QtcHJvcC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaXMtb2JqL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wLWxpbWl0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wLXRyeS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcXVlcnktc3RyaW5nL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zcGxpdC1vbi1maXJzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3RyaWN0LXVyaS1lbmNvZGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0cmluZy1mb3JtYXQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dhaXQtZm9yLXRoZS1lbGVtZW50L3dhaXRGb3JUaGVFbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9uYXYudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcHJldmlldy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zdHlsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5jbHVkZXMvY2FjaGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luY2x1ZGVzL2NvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5jbHVkZXMvcmVxdWVzdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5jbHVkZXMvc3RvcmFnZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5jbHVkZXMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZhO0FBQ2IsdUJBQXVCLEVBQUU7QUFDekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUEsaUJBQWlCLG1CQUFtQjtBQUNwQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsZ0JBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzdGYTtBQUNiLGNBQWMsbUJBQU8sQ0FBQyw4Q0FBUTs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLHNCQUFzQjtBQUN0Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixVQUFVO0FBQ25DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLHNCQUFzQjtBQUN2Qzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGlCQUFpQixzQkFBc0I7QUFDdkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDN0lhOztBQUViO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDTGE7QUFDYixhQUFhLG1CQUFPLENBQUMsNENBQU87O0FBRTVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQ25EYTs7QUFFYjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNSYTtBQUNiLHdCQUF3QixtQkFBTyxDQUFDLG9FQUFtQjtBQUNuRCx3QkFBd0IsbUJBQU8sQ0FBQywwRUFBc0I7QUFDdEQscUJBQXFCLG1CQUFPLENBQUMsOERBQWdCOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjs7QUFFQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzdTYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7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SUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6RCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUN2QjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDakI7S0FDRjtJQUVELHFCQUFxQjtJQUNyQixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBRTNCLG9CQUFvQjtJQUNwQixXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUM7QUFDN0MsQ0FBQztBQUVELHVCQUF1QjtBQUN2QixJQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtJQUU5Qiw4QkFBOEI7SUFDOUIsOENBQXVCLENBQUMsWUFBWSxDQUFDO1NBQ2xDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDMUQsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2xCLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0NBQ3hCIiwiZmlsZSI6ImxpYi51c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9rZW4gPSAnJVthLWYwLTldezJ9JztcbnZhciBzaW5nbGVNYXRjaGVyID0gbmV3IFJlZ0V4cCh0b2tlbiwgJ2dpJyk7XG52YXIgbXVsdGlNYXRjaGVyID0gbmV3IFJlZ0V4cCgnKCcgKyB0b2tlbiArICcpKycsICdnaScpO1xuXG5mdW5jdGlvbiBkZWNvZGVDb21wb25lbnRzKGNvbXBvbmVudHMsIHNwbGl0KSB7XG5cdHRyeSB7XG5cdFx0Ly8gVHJ5IHRvIGRlY29kZSB0aGUgZW50aXJlIHN0cmluZyBmaXJzdFxuXHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoY29tcG9uZW50cy5qb2luKCcnKSk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIERvIG5vdGhpbmdcblx0fVxuXG5cdGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9XG5cblx0c3BsaXQgPSBzcGxpdCB8fCAxO1xuXG5cdC8vIFNwbGl0IHRoZSBhcnJheSBpbiAyIHBhcnRzXG5cdHZhciBsZWZ0ID0gY29tcG9uZW50cy5zbGljZSgwLCBzcGxpdCk7XG5cdHZhciByaWdodCA9IGNvbXBvbmVudHMuc2xpY2Uoc3BsaXQpO1xuXG5cdHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmNhbGwoW10sIGRlY29kZUNvbXBvbmVudHMobGVmdCksIGRlY29kZUNvbXBvbmVudHMocmlnaHQpKTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChpbnB1dCk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdHZhciB0b2tlbnMgPSBpbnB1dC5tYXRjaChzaW5nbGVNYXRjaGVyKTtcblxuXHRcdGZvciAodmFyIGkgPSAxOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpbnB1dCA9IGRlY29kZUNvbXBvbmVudHModG9rZW5zLCBpKS5qb2luKCcnKTtcblxuXHRcdFx0dG9rZW5zID0gaW5wdXQubWF0Y2goc2luZ2xlTWF0Y2hlcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGlucHV0O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGN1c3RvbURlY29kZVVSSUNvbXBvbmVudChpbnB1dCkge1xuXHQvLyBLZWVwIHRyYWNrIG9mIGFsbCB0aGUgcmVwbGFjZW1lbnRzIGFuZCBwcmVmaWxsIHRoZSBtYXAgd2l0aCB0aGUgYEJPTWBcblx0dmFyIHJlcGxhY2VNYXAgPSB7XG5cdFx0JyVGRSVGRic6ICdcXHVGRkZEXFx1RkZGRCcsXG5cdFx0JyVGRiVGRSc6ICdcXHVGRkZEXFx1RkZGRCdcblx0fTtcblxuXHR2YXIgbWF0Y2ggPSBtdWx0aU1hdGNoZXIuZXhlYyhpbnB1dCk7XG5cdHdoaWxlIChtYXRjaCkge1xuXHRcdHRyeSB7XG5cdFx0XHQvLyBEZWNvZGUgYXMgYmlnIGNodW5rcyBhcyBwb3NzaWJsZVxuXHRcdFx0cmVwbGFjZU1hcFttYXRjaFswXV0gPSBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbMF0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IGRlY29kZShtYXRjaFswXSk7XG5cblx0XHRcdGlmIChyZXN1bHQgIT09IG1hdGNoWzBdKSB7XG5cdFx0XHRcdHJlcGxhY2VNYXBbbWF0Y2hbMF1dID0gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG1hdGNoID0gbXVsdGlNYXRjaGVyLmV4ZWMoaW5wdXQpO1xuXHR9XG5cblx0Ly8gQWRkIGAlQzJgIGF0IHRoZSBlbmQgb2YgdGhlIG1hcCB0byBtYWtlIHN1cmUgaXQgZG9lcyBub3QgcmVwbGFjZSB0aGUgY29tYmluYXRvciBiZWZvcmUgZXZlcnl0aGluZyBlbHNlXG5cdHJlcGxhY2VNYXBbJyVDMiddID0gJ1xcdUZGRkQnO1xuXG5cdHZhciBlbnRyaWVzID0gT2JqZWN0LmtleXMocmVwbGFjZU1hcCk7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Ly8gUmVwbGFjZSBhbGwgZGVjb2RlZCBjb21wb25lbnRzXG5cdFx0dmFyIGtleSA9IGVudHJpZXNbaV07XG5cdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoa2V5LCAnZycpLCByZXBsYWNlTWFwW2tleV0pO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbmNvZGVkVVJJKSB7XG5cdGlmICh0eXBlb2YgZW5jb2RlZFVSSSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBgZW5jb2RlZFVSSWAgdG8gYmUgb2YgdHlwZSBgc3RyaW5nYCwgZ290IGAnICsgdHlwZW9mIGVuY29kZWRVUkkgKyAnYCcpO1xuXHR9XG5cblx0dHJ5IHtcblx0XHRlbmNvZGVkVVJJID0gZW5jb2RlZFVSSS5yZXBsYWNlKC9cXCsvZywgJyAnKTtcblxuXHRcdC8vIFRyeSB0aGUgYnVpbHQgaW4gZGVjb2RlciBmaXJzdFxuXHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZW5jb2RlZFVSSSk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIEZhbGxiYWNrIHRvIGEgbW9yZSBhZHZhbmNlZCBkZWNvZGVyXG5cdFx0cmV0dXJuIGN1c3RvbURlY29kZVVSSUNvbXBvbmVudChlbmNvZGVkVVJJKTtcblx0fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGlzT2JqID0gcmVxdWlyZSgnaXMtb2JqJyk7XG5cbmNvbnN0IGRpc2FsbG93ZWRLZXlzID0gW1xuXHQnX19wcm90b19fJyxcblx0J3Byb3RvdHlwZScsXG5cdCdjb25zdHJ1Y3Rvcidcbl07XG5cbmNvbnN0IGlzVmFsaWRQYXRoID0gcGF0aFNlZ21lbnRzID0+ICFwYXRoU2VnbWVudHMuc29tZShzZWdtZW50ID0+IGRpc2FsbG93ZWRLZXlzLmluY2x1ZGVzKHNlZ21lbnQpKTtcblxuZnVuY3Rpb24gZ2V0UGF0aFNlZ21lbnRzKHBhdGgpIHtcblx0Y29uc3QgcGF0aEFycmF5ID0gcGF0aC5zcGxpdCgnLicpO1xuXHRjb25zdCBwYXJ0cyA9IFtdO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IHAgPSBwYXRoQXJyYXlbaV07XG5cblx0XHR3aGlsZSAocFtwLmxlbmd0aCAtIDFdID09PSAnXFxcXCcgJiYgcGF0aEFycmF5W2kgKyAxXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwID0gcC5zbGljZSgwLCAtMSkgKyAnLic7XG5cdFx0XHRwICs9IHBhdGhBcnJheVsrK2ldO1xuXHRcdH1cblxuXHRcdHBhcnRzLnB1c2gocCk7XG5cdH1cblxuXHRpZiAoIWlzVmFsaWRQYXRoKHBhcnRzKSkge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdHJldHVybiBwYXJ0cztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGdldChvYmplY3QsIHBhdGgsIHZhbHVlKSB7XG5cdFx0aWYgKCFpc09iaihvYmplY3QpIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyBvYmplY3QgOiB2YWx1ZTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXRoQXJyYXkgPSBnZXRQYXRoU2VnbWVudHMocGF0aCk7XG5cdFx0aWYgKHBhdGhBcnJheS5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhBcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKCFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBwYXRoQXJyYXlbaV0pKSB7XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0b2JqZWN0ID0gb2JqZWN0W3BhdGhBcnJheVtpXV07XG5cblx0XHRcdGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCB8fCBvYmplY3QgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gYG9iamVjdGAgaXMgZWl0aGVyIGB1bmRlZmluZWRgIG9yIGBudWxsYCBzbyB3ZSB3YW50IHRvIHN0b3AgdGhlIGxvb3AsIGFuZFxuXHRcdFx0XHQvLyBpZiB0aGlzIGlzIG5vdCB0aGUgbGFzdCBiaXQgb2YgdGhlIHBhdGgsIGFuZFxuXHRcdFx0XHQvLyBpZiBpdCBkaWQndCByZXR1cm4gYHVuZGVmaW5lZGBcblx0XHRcdFx0Ly8gaXQgd291bGQgcmV0dXJuIGBudWxsYCBpZiBgb2JqZWN0YCBpcyBgbnVsbGBcblx0XHRcdFx0Ly8gYnV0IHdlIHdhbnQgYGdldCh7Zm9vOiBudWxsfSwgJ2Zvby5iYXInKWAgdG8gZXF1YWwgYHVuZGVmaW5lZGAsIG9yIHRoZSBzdXBwbGllZCB2YWx1ZSwgbm90IGBudWxsYFxuXHRcdFx0XHRpZiAoaSAhPT0gcGF0aEFycmF5Lmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9LFxuXG5cdHNldChvYmplY3QsIHBhdGgsIHZhbHVlKSB7XG5cdFx0aWYgKCFpc09iaihvYmplY3QpIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIG9iamVjdDtcblx0XHR9XG5cblx0XHRjb25zdCByb290ID0gb2JqZWN0O1xuXHRcdGNvbnN0IHBhdGhBcnJheSA9IGdldFBhdGhTZWdtZW50cyhwYXRoKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBwID0gcGF0aEFycmF5W2ldO1xuXG5cdFx0XHRpZiAoIWlzT2JqKG9iamVjdFtwXSkpIHtcblx0XHRcdFx0b2JqZWN0W3BdID0ge307XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpID09PSBwYXRoQXJyYXkubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRvYmplY3RbcF0gPSB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0b2JqZWN0ID0gb2JqZWN0W3BdO1xuXHRcdH1cblxuXHRcdHJldHVybiByb290O1xuXHR9LFxuXG5cdGRlbGV0ZShvYmplY3QsIHBhdGgpIHtcblx0XHRpZiAoIWlzT2JqKG9iamVjdCkgfHwgdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGF0aEFycmF5ID0gZ2V0UGF0aFNlZ21lbnRzKHBhdGgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHAgPSBwYXRoQXJyYXlbaV07XG5cblx0XHRcdGlmIChpID09PSBwYXRoQXJyYXkubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRkZWxldGUgb2JqZWN0W3BdO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdG9iamVjdCA9IG9iamVjdFtwXTtcblxuXHRcdFx0aWYgKCFpc09iaihvYmplY3QpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0aGFzKG9iamVjdCwgcGF0aCkge1xuXHRcdGlmICghaXNPYmoob2JqZWN0KSB8fCB0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXRoQXJyYXkgPSBnZXRQYXRoU2VnbWVudHMocGF0aCk7XG5cdFx0aWYgKHBhdGhBcnJheS5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1mb3ItbG9vcFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoaXNPYmoob2JqZWN0KSkge1xuXHRcdFx0XHRpZiAoIShwYXRoQXJyYXlbaV0gaW4gb2JqZWN0KSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG9iamVjdCA9IG9iamVjdFtwYXRoQXJyYXlbaV1dO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlID0+IHtcblx0Y29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcblx0cmV0dXJuIHZhbHVlICE9PSBudWxsICYmICh0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnZnVuY3Rpb24nKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBwVHJ5ID0gcmVxdWlyZSgncC10cnknKTtcblxuY29uc3QgcExpbWl0ID0gY29uY3VycmVuY3kgPT4ge1xuXHRpZiAoISgoTnVtYmVyLmlzSW50ZWdlcihjb25jdXJyZW5jeSkgfHwgY29uY3VycmVuY3kgPT09IEluZmluaXR5KSAmJiBjb25jdXJyZW5jeSA+IDApKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGBjb25jdXJyZW5jeWAgdG8gYmUgYSBudW1iZXIgZnJvbSAxIGFuZCB1cCcpKTtcblx0fVxuXG5cdGNvbnN0IHF1ZXVlID0gW107XG5cdGxldCBhY3RpdmVDb3VudCA9IDA7XG5cblx0Y29uc3QgbmV4dCA9ICgpID0+IHtcblx0XHRhY3RpdmVDb3VudC0tO1xuXG5cdFx0aWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdHF1ZXVlLnNoaWZ0KCkoKTtcblx0XHR9XG5cdH07XG5cblx0Y29uc3QgcnVuID0gKGZuLCByZXNvbHZlLCAuLi5hcmdzKSA9PiB7XG5cdFx0YWN0aXZlQ291bnQrKztcblxuXHRcdGNvbnN0IHJlc3VsdCA9IHBUcnkoZm4sIC4uLmFyZ3MpO1xuXG5cdFx0cmVzb2x2ZShyZXN1bHQpO1xuXG5cdFx0cmVzdWx0LnRoZW4obmV4dCwgbmV4dCk7XG5cdH07XG5cblx0Y29uc3QgZW5xdWV1ZSA9IChmbiwgcmVzb2x2ZSwgLi4uYXJncykgPT4ge1xuXHRcdGlmIChhY3RpdmVDb3VudCA8IGNvbmN1cnJlbmN5KSB7XG5cdFx0XHRydW4oZm4sIHJlc29sdmUsIC4uLmFyZ3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRxdWV1ZS5wdXNoKHJ1bi5iaW5kKG51bGwsIGZuLCByZXNvbHZlLCAuLi5hcmdzKSk7XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnN0IGdlbmVyYXRvciA9IChmbiwgLi4uYXJncykgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBlbnF1ZXVlKGZuLCByZXNvbHZlLCAuLi5hcmdzKSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdlbmVyYXRvciwge1xuXHRcdGFjdGl2ZUNvdW50OiB7XG5cdFx0XHRnZXQ6ICgpID0+IGFjdGl2ZUNvdW50XG5cdFx0fSxcblx0XHRwZW5kaW5nQ291bnQ6IHtcblx0XHRcdGdldDogKCkgPT4gcXVldWUubGVuZ3RoXG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gZ2VuZXJhdG9yO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwTGltaXQ7XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gcExpbWl0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwVHJ5ID0gKGZuLCAuLi5hcmd1bWVudHNfKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0cmVzb2x2ZShmbiguLi5hcmd1bWVudHNfKSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwVHJ5O1xuLy8gVE9ETzogcmVtb3ZlIHRoaXMgaW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvblxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IHBUcnk7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBzdHJpY3RVcmlFbmNvZGUgPSByZXF1aXJlKCdzdHJpY3QtdXJpLWVuY29kZScpO1xuY29uc3QgZGVjb2RlQ29tcG9uZW50ID0gcmVxdWlyZSgnZGVjb2RlLXVyaS1jb21wb25lbnQnKTtcbmNvbnN0IHNwbGl0T25GaXJzdCA9IHJlcXVpcmUoJ3NwbGl0LW9uLWZpcnN0Jyk7XG5cbmZ1bmN0aW9uIGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKSB7XG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzpcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSByZXN1bHQubGVuZ3RoO1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFsuLi5yZXN1bHQsIFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJ1snLCBpbmRleCwgJ10nXS5qb2luKCcnKV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbJywgZW5jb2RlKGluZGV4LCBvcHRpb25zKSwgJ109JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJylcblx0XHRcdFx0XTtcblx0XHRcdH07XG5cblx0XHRjYXNlICdicmFja2V0Jzpcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbLi4ucmVzdWx0LCBbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXSddLmpvaW4oJycpXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbLi4ucmVzdWx0LCBbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXT0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKV07XG5cdFx0XHR9O1xuXG5cdFx0Y2FzZSAnY29tbWEnOlxuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gW1tlbmNvZGUoa2V5LCBvcHRpb25zKSwgJz0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1tyZXN1bHQsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJywnKV07XG5cdFx0XHR9O1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbLi4ucmVzdWx0LCBlbmNvZGUoa2V5LCBvcHRpb25zKV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gWy4uLnJlc3VsdCwgW2VuY29kZShrZXksIG9wdGlvbnMpLCAnPScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpXTtcblx0XHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0aW9ucykge1xuXHRsZXQgcmVzdWx0O1xuXG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzpcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0cmVzdWx0ID0gL1xcWyhcXGQqKVxcXSQvLmV4ZWMoa2V5KTtcblxuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvXFxbXFxkKlxcXSQvLCAnJyk7XG5cblx0XHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB7fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV1bcmVzdWx0WzFdXSA9IHZhbHVlO1xuXHRcdFx0fTtcblxuXHRcdGNhc2UgJ2JyYWNrZXQnOlxuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRyZXN1bHQgPSAvKFxcW1xcXSkkLy5leGVjKGtleSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9cXFtcXF0kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW3ZhbHVlXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW10uY29uY2F0KGFjY3VtdWxhdG9yW2tleV0sIHZhbHVlKTtcblx0XHRcdH07XG5cblx0XHRjYXNlICdjb21tYSc6XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGlzQXJyYXkgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnNwbGl0KCcnKS5pbmRleE9mKCcsJykgPiAtMTtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBpc0FycmF5ID8gdmFsdWUuc3BsaXQoJywnKSA6IHZhbHVlO1xuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gbmV3VmFsdWU7XG5cdFx0XHR9O1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW10uY29uY2F0KGFjY3VtdWxhdG9yW2tleV0sIHZhbHVlKTtcblx0XHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gZW5jb2RlKHZhbHVlLCBvcHRpb25zKSB7XG5cdGlmIChvcHRpb25zLmVuY29kZSkge1xuXHRcdHJldHVybiBvcHRpb25zLnN0cmljdCA/IHN0cmljdFVyaUVuY29kZSh2YWx1ZSkgOiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMuZGVjb2RlKSB7XG5cdFx0cmV0dXJuIGRlY29kZUNvbXBvbmVudCh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGtleXNTb3J0ZXIoaW5wdXQpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG5cdFx0cmV0dXJuIGlucHV0LnNvcnQoKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnKSB7XG5cdFx0cmV0dXJuIGtleXNTb3J0ZXIoT2JqZWN0LmtleXMoaW5wdXQpKVxuXHRcdFx0LnNvcnQoKGEsIGIpID0+IE51bWJlcihhKSAtIE51bWJlcihiKSlcblx0XHRcdC5tYXAoa2V5ID0+IGlucHV0W2tleV0pO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVIYXNoKGlucHV0KSB7XG5cdGNvbnN0IGhhc2hTdGFydCA9IGlucHV0LmluZGV4T2YoJyMnKTtcblx0aWYgKGhhc2hTdGFydCAhPT0gLTEpIHtcblx0XHRpbnB1dCA9IGlucHV0LnNsaWNlKDAsIGhhc2hTdGFydCk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3QoaW5wdXQpIHtcblx0aW5wdXQgPSByZW1vdmVIYXNoKGlucHV0KTtcblx0Y29uc3QgcXVlcnlTdGFydCA9IGlucHV0LmluZGV4T2YoJz8nKTtcblx0aWYgKHF1ZXJ5U3RhcnQgPT09IC0xKSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0LnNsaWNlKHF1ZXJ5U3RhcnQgKyAxKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSwgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucy5wYXJzZU51bWJlcnMgJiYgIU51bWJlci5pc05hTihOdW1iZXIodmFsdWUpKSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkgIT09ICcnKSkge1xuXHRcdHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLnBhcnNlQm9vbGVhbnMgJiYgdmFsdWUgIT09IG51bGwgJiYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJyB8fCB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAnZmFsc2UnKSkge1xuXHRcdHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBwYXJzZShpbnB1dCwgb3B0aW9ucykge1xuXHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0ZGVjb2RlOiB0cnVlLFxuXHRcdHNvcnQ6IHRydWUsXG5cdFx0YXJyYXlGb3JtYXQ6ICdub25lJyxcblx0XHRwYXJzZU51bWJlcnM6IGZhbHNlLFxuXHRcdHBhcnNlQm9vbGVhbnM6IGZhbHNlXG5cdH0sIG9wdGlvbnMpO1xuXG5cdGNvbnN0IGZvcm1hdHRlciA9IHBhcnNlckZvckFycmF5Rm9ybWF0KG9wdGlvbnMpO1xuXG5cdC8vIENyZWF0ZSBhbiBvYmplY3Qgd2l0aCBubyBwcm90b3R5cGVcblx0Y29uc3QgcmV0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRpbnB1dCA9IGlucHV0LnRyaW0oKS5yZXBsYWNlKC9eWz8jJl0vLCAnJyk7XG5cblx0aWYgKCFpbnB1dCkge1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRmb3IgKGNvbnN0IHBhcmFtIG9mIGlucHV0LnNwbGl0KCcmJykpIHtcblx0XHRsZXQgW2tleSwgdmFsdWVdID0gc3BsaXRPbkZpcnN0KG9wdGlvbnMuZGVjb2RlID8gcGFyYW0ucmVwbGFjZSgvXFwrL2csICcgJykgOiBwYXJhbSwgJz0nKTtcblxuXHRcdC8vIE1pc3NpbmcgYD1gIHNob3VsZCBiZSBgbnVsbGA6XG5cdFx0Ly8gaHR0cDovL3czLm9yZy9UUi8yMDEyL1dELXVybC0yMDEyMDUyNC8jY29sbGVjdC11cmwtcGFyYW1ldGVyc1xuXHRcdHZhbHVlID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpO1xuXHRcdGZvcm1hdHRlcihkZWNvZGUoa2V5LCBvcHRpb25zKSwgdmFsdWUsIHJldCk7XG5cdH1cblxuXHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZXQpKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSByZXRba2V5XTtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0Zm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKHZhbHVlKSkge1xuXHRcdFx0XHR2YWx1ZVtrXSA9IHBhcnNlVmFsdWUodmFsdWVba10sIG9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXRba2V5XSA9IHBhcnNlVmFsdWUodmFsdWUsIG9wdGlvbnMpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNvcnQgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHJldHVybiAob3B0aW9ucy5zb3J0ID09PSB0cnVlID8gT2JqZWN0LmtleXMocmV0KS5zb3J0KCkgOiBPYmplY3Qua2V5cyhyZXQpLnNvcnQob3B0aW9ucy5zb3J0KSkucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuXHRcdGNvbnN0IHZhbHVlID0gcmV0W2tleV07XG5cdFx0aWYgKEJvb2xlYW4odmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHQvLyBTb3J0IG9iamVjdCBrZXlzLCBub3QgdmFsdWVzXG5cdFx0XHRyZXN1bHRba2V5XSA9IGtleXNTb3J0ZXIodmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHRba2V5XSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufVxuXG5leHBvcnRzLmV4dHJhY3QgPSBleHRyYWN0O1xuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuXG5leHBvcnRzLnN0cmluZ2lmeSA9IChvYmplY3QsIG9wdGlvbnMpID0+IHtcblx0aWYgKCFvYmplY3QpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0ZW5jb2RlOiB0cnVlLFxuXHRcdHN0cmljdDogdHJ1ZSxcblx0XHRhcnJheUZvcm1hdDogJ25vbmUnXG5cdH0sIG9wdGlvbnMpO1xuXG5cdGNvbnN0IGZvcm1hdHRlciA9IGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKTtcblxuXHRjb25zdCBvYmplY3RDb3B5ID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqZWN0KTtcblx0aWYgKG9wdGlvbnMuc2tpcE51bGwpIHtcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3RDb3B5KSkge1xuXHRcdFx0aWYgKG9iamVjdENvcHlba2V5XSA9PT0gdW5kZWZpbmVkIHx8IG9iamVjdENvcHlba2V5XSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkZWxldGUgb2JqZWN0Q29weVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3RDb3B5KTtcblxuXHRpZiAob3B0aW9ucy5zb3J0ICE9PSBmYWxzZSkge1xuXHRcdGtleXMuc29ydChvcHRpb25zLnNvcnQpO1xuXHR9XG5cblx0cmV0dXJuIGtleXMubWFwKGtleSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWVcblx0XHRcdFx0LnJlZHVjZShmb3JtYXR0ZXIoa2V5KSwgW10pXG5cdFx0XHRcdC5qb2luKCcmJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdGlvbnMpICsgJz0nICsgZW5jb2RlKHZhbHVlLCBvcHRpb25zKTtcblx0fSkuZmlsdGVyKHggPT4geC5sZW5ndGggPiAwKS5qb2luKCcmJyk7XG59O1xuXG5leHBvcnRzLnBhcnNlVXJsID0gKGlucHV0LCBvcHRpb25zKSA9PiB7XG5cdHJldHVybiB7XG5cdFx0dXJsOiByZW1vdmVIYXNoKGlucHV0KS5zcGxpdCgnPycpWzBdIHx8ICcnLFxuXHRcdHF1ZXJ5OiBwYXJzZShleHRyYWN0KGlucHV0KSwgb3B0aW9ucylcblx0fTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKHN0cmluZywgc2VwYXJhdG9yKSA9PiB7XG5cdGlmICghKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBzZXBhcmF0b3IgPT09ICdzdHJpbmcnKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRoZSBhcmd1bWVudHMgdG8gYmUgb2YgdHlwZSBgc3RyaW5nYCcpO1xuXHR9XG5cblx0aWYgKHNlcGFyYXRvciA9PT0gJycpIHtcblx0XHRyZXR1cm4gW3N0cmluZ107XG5cdH1cblxuXHRjb25zdCBzZXBhcmF0b3JJbmRleCA9IHN0cmluZy5pbmRleE9mKHNlcGFyYXRvcik7XG5cblx0aWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xuXHRcdHJldHVybiBbc3RyaW5nXTtcblx0fVxuXG5cdHJldHVybiBbXG5cdFx0c3RyaW5nLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KSxcblx0XHRzdHJpbmcuc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyBzZXBhcmF0b3IubGVuZ3RoKVxuXHRdO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gc3RyID0+IGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoL1shJygpKl0vZywgeCA9PiBgJSR7eC5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpfWApO1xuIiwidm9pZCBmdW5jdGlvbihnbG9iYWwpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gIFZhbHVlRXJyb3IgOjogU3RyaW5nIC0+IEVycm9yXG4gIGZ1bmN0aW9uIFZhbHVlRXJyb3IobWVzc2FnZSkge1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgZXJyLm5hbWUgPSAnVmFsdWVFcnJvcic7XG4gICAgcmV0dXJuIGVycjtcbiAgfVxuXG4gIC8vICBjcmVhdGUgOjogT2JqZWN0IC0+IFN0cmluZywqLi4uIC0+IFN0cmluZ1xuICBmdW5jdGlvbiBjcmVhdGUodHJhbnNmb3JtZXJzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICB2YXIgaWR4ID0gMDtcbiAgICAgIHZhciBzdGF0ZSA9ICdVTkRFRklORUQnO1xuXG4gICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZShcbiAgICAgICAgLyhbe31dKVxcMXxbe10oLio/KSg/OiEoLis/KSk/W31dL2csXG4gICAgICAgIGZ1bmN0aW9uKG1hdGNoLCBsaXRlcmFsLCBfa2V5LCB4Zikge1xuICAgICAgICAgIGlmIChsaXRlcmFsICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXRlcmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIga2V5ID0gX2tleTtcbiAgICAgICAgICBpZiAoa2V5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ0lNUExJQ0lUJykge1xuICAgICAgICAgICAgICB0aHJvdyBWYWx1ZUVycm9yKCdjYW5ub3Qgc3dpdGNoIGZyb20gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ltcGxpY2l0IHRvIGV4cGxpY2l0IG51bWJlcmluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGUgPSAnRVhQTElDSVQnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUgPT09ICdFWFBMSUNJVCcpIHtcbiAgICAgICAgICAgICAgdGhyb3cgVmFsdWVFcnJvcignY2Fubm90IHN3aXRjaCBmcm9tICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdleHBsaWNpdCB0byBpbXBsaWNpdCBudW1iZXJpbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlID0gJ0lNUExJQ0lUJztcbiAgICAgICAgICAgIGtleSA9IFN0cmluZyhpZHgpO1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gIDEuICBTcGxpdCB0aGUga2V5IGludG8gYSBsb29rdXAgcGF0aC5cbiAgICAgICAgICAvLyAgMi4gIElmIHRoZSBmaXJzdCBwYXRoIGNvbXBvbmVudCBpcyBub3QgYW4gaW5kZXgsIHByZXBlbmQgJzAnLlxuICAgICAgICAgIC8vICAzLiAgUmVkdWNlIHRoZSBsb29rdXAgcGF0aCB0byBhIHNpbmdsZSByZXN1bHQuIElmIHRoZSBsb29rdXBcbiAgICAgICAgICAvLyAgICAgIHN1Y2NlZWRzIHRoZSByZXN1bHQgaXMgYSBzaW5nbGV0b24gYXJyYXkgY29udGFpbmluZyB0aGVcbiAgICAgICAgICAvLyAgICAgIHZhbHVlIGF0IHRoZSBsb29rdXAgcGF0aDsgb3RoZXJ3aXNlIHRoZSByZXN1bHQgaXMgW10uXG4gICAgICAgICAgLy8gIDQuICBVbndyYXAgdGhlIHJlc3VsdCBieSByZWR1Y2luZyB3aXRoICcnIGFzIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgICAgICAgIHZhciBwYXRoID0ga2V5LnNwbGl0KCcuJyk7XG4gICAgICAgICAgdmFyIHZhbHVlID0gKC9eXFxkKyQvLnRlc3QocGF0aFswXSkgPyBwYXRoIDogWycwJ10uY29uY2F0KHBhdGgpKVxuICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbihtYXliZSwga2V5KSB7XG4gICAgICAgICAgICAgIHJldHVybiBtYXliZS5yZWR1Y2UoZnVuY3Rpb24oXywgeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICE9IG51bGwgJiYga2V5IGluIE9iamVjdCh4KSA/XG4gICAgICAgICAgICAgICAgICBbdHlwZW9mIHhba2V5XSA9PT0gJ2Z1bmN0aW9uJyA/IHhba2V5XSgpIDogeFtrZXldXSA6XG4gICAgICAgICAgICAgICAgICBbXTtcbiAgICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICAgICAgfSwgW2FyZ3NdKVxuICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbihfLCB4KSB7IHJldHVybiB4OyB9LCAnJyk7XG5cbiAgICAgICAgICBpZiAoeGYgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRyYW5zZm9ybWVycywgeGYpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtZXJzW3hmXSh2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IFZhbHVlRXJyb3IoJ25vIHRyYW5zZm9ybWVyIG5hbWVkIFwiJyArIHhmICsgJ1wiJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH07XG4gIH1cblxuICAvLyAgZm9ybWF0IDo6IFN0cmluZywqLi4uIC0+IFN0cmluZ1xuICB2YXIgZm9ybWF0ID0gY3JlYXRlKHt9KTtcblxuICAvLyAgZm9ybWF0LmNyZWF0ZSA6OiBPYmplY3QgLT4gU3RyaW5nLCouLi4gLT4gU3RyaW5nXG4gIGZvcm1hdC5jcmVhdGUgPSBjcmVhdGU7XG5cbiAgLy8gIGZvcm1hdC5leHRlbmQgOjogT2JqZWN0LE9iamVjdCAtPiAoKVxuICBmb3JtYXQuZXh0ZW5kID0gZnVuY3Rpb24ocHJvdG90eXBlLCB0cmFuc2Zvcm1lcnMpIHtcbiAgICB2YXIgJGZvcm1hdCA9IGNyZWF0ZSh0cmFuc2Zvcm1lcnMpO1xuICAgIHByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIGFyZ3MudW5zaGlmdCh0aGlzKTtcbiAgICAgIHJldHVybiAkZm9ybWF0LmFwcGx5KGdsb2JhbCwgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZvcm1hdDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBmb3JtYXQ7IH0pO1xuICB9IGVsc2Uge1xuICAgIGdsb2JhbC5mb3JtYXQgPSBmb3JtYXQ7XG4gIH1cblxufS5jYWxsKHRoaXMsIHRoaXMpO1xuIiwiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dCgoZT1lfHxzZWxmKS53YWl0Rm9yVGhlRWxlbWVudD17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYyhlLHQpe3ZhciBuPWUudHlwZSxyPWUudGFyZ2V0LG89ZS5hZGRlZE5vZGVzO2lmKFwiYXR0cmlidXRlc1wiPT09biYmci5tYXRjaGVzKHQpKXJldHVybiByO2lmKFwiY2hpbGRMaXN0XCIhPT1uKXJldHVybiBudWxsO2Zvcih2YXIgaT0wLHU9bztpPHUubGVuZ3RoO2krPTEpe3ZhciBhPXVbaV07aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYS5tYXRjaGVzJiZhLm1hdGNoZXModCkpcmV0dXJuIGF9cmV0dXJuIHIucXVlcnlTZWxlY3Rvcih0KX1mdW5jdGlvbiBuKGEsZSl7dm9pZCAwPT09ZSYmKGU9e30pO3ZhciBuPWUudGltZW91dDt2b2lkIDA9PT1uJiYobj0yNTAwKTt2YXIgcj1lLnNjb3BlO3JldHVybiB2b2lkIDA9PT1yJiYocj1kb2N1bWVudCksbmV3IFByb21pc2UoZnVuY3Rpb24obyxlKXt2YXIgdD1yLnF1ZXJ5U2VsZWN0b3IoYSksaT1udWxsO2lmKG51bGw9PT10KXt2YXIgdT1uZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihlKXtmb3IodmFyIHQ9MCxuPWU7dDxuLmxlbmd0aDt0Kz0xKXt2YXIgcj1jKG5bdF0sYSk7aWYobnVsbCE9PXIpe2NsZWFyVGltZW91dChpKSx1LmRpc2Nvbm5lY3QoKSxvKHIpO2JyZWFrfX19KTt1Lm9ic2VydmUocix7YXR0cmlidXRlczohMCxzdWJ0cmVlOiEwLGNoaWxkTGlzdDohMH0pLGk9c2V0VGltZW91dChmdW5jdGlvbigpe3UuZGlzY29ubmVjdCgpLGUobmV3IEVycm9yKFwiTm8gZWxlbWVudCBtYXRjaGVzIHRoZSBzZWxlY3RvciBcIithK1wiLlwiKSl9LG4pfWVsc2Ugbyh0KX0pfXZhciB0PXt3YWl0Rm9yVGhlRWxlbWVudDpuLHRyeUFuZFdhaXRGb3JUaGVFbGVtZW50OmZ1bmN0aW9uKGUsdCl7cmV0dXJuIG4oZSx0KS5jYXRjaChmdW5jdGlvbigpe3JldHVybiBudWxsfSl9fSxyPXQud2FpdEZvclRoZUVsZW1lbnQsbz10LnRyeUFuZFdhaXRGb3JUaGVFbGVtZW50O2UuZGVmYXVsdD10LGUudHJ5QW5kV2FpdEZvclRoZUVsZW1lbnQ9byxlLndhaXRGb3JUaGVFbGVtZW50PXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbiIsImltcG9ydCBjb25maWcsIHsgZGV0YWlscyB9IGZyb20gXCIuLi9pbmNsdWRlcy9jb25maWdcIlxyXG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL2luY2x1ZGVzL3V0aWxzXCJcclxuaW1wb3J0IGNvbXBvbmVudFN0eWxlIGZyb20gXCIuL3N0eWxlXCJcclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlSXRlbXMgKGRldGFpbHM6IExvb3NlT2JqZWN0LCBrZXk/OiBzdHJpbmcpIHtcclxuICBjb25zdCByZXN1bHQgPSBbXSBhcyBzdHJpbmdbXVxyXG4gIFxyXG4gIGtleSA9IGtleSB8fCAnJ1xyXG5cclxuICBmb3IgKGxldCBrIGluIGRldGFpbHMpIHtcclxuICAgIGNvbnN0IGl0ZW0gPSBkZXRhaWxzW2tdXHJcblxyXG4gICAgaWYgKGl0ZW0uaXRlbXMpIHtcclxuICAgICAgLy8g7Lm07YWM6rOg66as652866m0IO2XpOuNlOyZgCDtlZjsnIQg7JWE7J207YWcIOy2lOqwgO2VmOq4sFxyXG4gICAgICBjb25zdCBpID0gMiArIChrZXkubWF0Y2goL1xcLi9nKSB8fCBbXSkubGVuZ3RoXHJcbiAgICAgIHJlc3VsdC5wdXNoKGA8aCR7aX0gY2xhc3M9XCJrcy1jb25maWctaXRlbVwiPiR7aXRlbS5uYW1lfTwvaCR7aX0+YClcclxuICAgICAgcmVzdWx0LnB1c2goLi4uZ2VuZXJhdGVJdGVtcyhpdGVtLml0ZW1zLCBgJHtrZXl9JHtrfS5gKSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIOyVhOydtO2FnCDstpTqsIDtlZjquLBcclxuICAgICAgY29uc3QgY3VycmVudEtleSA9IGAke2tleX0ke2t9YFxyXG5cclxuICAgICAgbGV0IGh0bWwgPSAnJ1xyXG5cclxuICAgICAgc3dpdGNoICh0eXBlb2YgaXRlbS5kZWZhdWx0KSB7XHJcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgICAgIGh0bWwgPSAvKiBodG1sICovYFxyXG4gICAgICAgICAgICA8bGFiZWw+JHtpdGVtLm5hbWV9PC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IFxyXG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICB2YWx1ZT1cIiR7Y29uZmlnLmdldDxzdHJpbmc+KGN1cnJlbnRLZXkpLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKX1cIlxyXG4gICAgICAgICAgICAgIGRhdGEta2V5PVwiJHtjdXJyZW50S2V5fVwiPlxyXG4gICAgICAgICAgYFxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgICAgIGh0bWwgPSAvKiBodG1sICovYFxyXG4gICAgICAgICAgICA8bGFiZWw+XHJcbiAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIiBcclxuICAgICAgICAgICAgICAgIGRhdGEta2V5PVwiJHtjdXJyZW50S2V5fVwiXHJcbiAgICAgICAgICAgICAgICAke2NvbmZpZy5nZXQ8bnVtYmVyPihjdXJyZW50S2V5KSA/ICdjaGVja2VkJyA6ICcnfT5cclxuICAgICAgICAgICAgICA8c3Bhbj4ke2l0ZW0ubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICBgXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXN1bHQucHVzaCgvKiBodG1sICovYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJrcy1jb25maWctaXRlbSBrcy1jb25maWcta2V5XCI+XHJcbiAgICAgICAgICAke2h0bWx9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIGApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmNvbnN0IGNvbXBvbmVudENvbmZpZzogQ29tcG9uZW50ID0ge1xyXG4gIGNyZWF0ZSAoKSB7XHJcbiAgICBjb25zdCB3cmFwcGVyID0gY3JlYXRlRWxlbWVudCgvKiBodG1sICovYFxyXG4gICAgICA8ZGl2IGlkPVwia3MtY29uZmlnXCI+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxoMT7shKTsoJU8L2gxPlxyXG4gICAgICAgICAgJHtnZW5lcmF0ZUl0ZW1zKGRldGFpbHMpLmpvaW4oJ1xcbicpfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIGApXHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5wcmVwZW5kKHdyYXBwZXIpXHJcblxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2tzLWNvbmZpZycpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxyXG4gICAgICBpZiAodGFyZ2V0LmlkID09PSAna3MtY29uZmlnJykge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3Q/LnRvZ2dsZSgna3MtYWN0aXZlJylcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUgKHRoaXM6IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgY29uc3Qga2V5ID0gdGhpcy5kYXRhc2V0LmtleVxyXG4gICAgICBsZXQgdmFsdWVcclxuXHJcbiAgICAgIHN3aXRjaCAodHlwZW9mIGNvbmZpZy5nZXQoa2V5KSkge1xyXG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmNoZWNrZWRcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHZhbHVlID0gdGhpcy52YWx1ZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25maWcuc2V0KGtleSwgdmFsdWUpXHJcbiAgICAgIGNvbmZpZy5zeW5jKClcclxuXHJcbiAgICAgIC8vIOyKpO2DgOydvCDqtIDroKgg7ISk7KCV7J20IOuzgOqyveuQkOuLpOuptCDsiqTtg4Dsnbzsi5ztirgg7Lu07Y+s7YS07Yq4IOyDiOuhnCDsg53shLHtlZjquLBcclxuICAgICAgaWYgKGtleS5zdGFydHNXaXRoKCdzdHlsZScpKSB7XHJcbiAgICAgICAgY29tcG9uZW50U3R5bGUuZGVzdHJveSgpXHJcbiAgICAgICAgY29tcG9uZW50U3R5bGUuY3JlYXRlKClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGlucHV0IG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5rcy1jb25maWcta2V5IGlucHV0JykgYXMgTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50Pikge1xyXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGUpXHJcbiAgICB9XHJcblxyXG4gIH0sXHJcbiAgZGVzdHJveSAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcja3MtcHJldmlldycpPy5yZW1vdmUoKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29tcG9uZW50Q29uZmlnXHJcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tIFwiLi4vaW5jbHVkZXMvdXRpbHNcIlxyXG5cclxuY29uc3QgY29tcG9uZW50TmF2OiBDb21wb25lbnQgPSB7XHJcbiAgY3JlYXRlICgpIHtcclxuICAgIGNvbnN0IG5hdiA9IGNyZWF0ZUVsZW1lbnQoLyogaHRtbCAqL2BcclxuICAgICAgPHVsIGlkPVwia3MtbmF2XCI+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwia3MtbmF2LWl0ZW0ga3MtbmF2LWl0ZW0tc2V0dGluZ1wiPuyEpOyglTwvbGk+XHJcbiAgICAgIDwvdWw+XHJcbiAgICBgKVxyXG5cclxuICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmduYl9iYXInKVxyXG5cclxuICAgIGlmIChyZXBsYWNlbWVudCkge1xyXG4gICAgICByZXBsYWNlbWVudC5pbm5lckhUTUwgPSAnJ1xyXG4gICAgICByZXBsYWNlbWVudC5hcHBlbmQobmF2KVxyXG4gICAgXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5rcy1uYXYtaXRlbS1zZXR0aW5nJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2tzLWNvbmZpZycpLmNsYXNzTGlzdC50b2dnbGUoJ2tzLWFjdGl2ZScpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBkZXN0cm95ICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNrcy1uYXYnKT8ucmVtb3ZlKClcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudE5hdlxyXG4iLCJpbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL2luY2x1ZGVzL3V0aWxzXCJcclxuXHJcbmNvbnN0IGNvbXBvbmVudFByZXZpZXc6IENvbXBvbmVudCA9IHtcclxuICBjcmVhdGUgKCkge1xyXG4gICAgY29uc3QgcHJldmlldyA9IGNyZWF0ZUVsZW1lbnQoJzxkaXYgaWQ9XCJrcy1wcmV2aWV3XCI+PC9kaXY+JylcclxuICAgIGRvY3VtZW50LmJvZHkucHJlcGVuZChwcmV2aWV3KVxyXG4gIH0sXHJcbiAgZGVzdHJveSAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcja3MtcHJldmlldycpPy5yZW1vdmUoKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29tcG9uZW50UHJldmlld1xyXG4iLCJpbXBvcnQgZm9ybWF0IGZyb20gJ3N0cmluZy1mb3JtYXQnXHJcblxyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2luY2x1ZGVzL2NvbmZpZydcclxuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi9pbmNsdWRlcy91dGlsc1wiXHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9ICAvKiBsZXNzICovYFxyXG4gIEBmb250LXNhbnM6IHtmb250X2ZhbWlseV9zYW5zfTtcclxuICBAZm9udC1zZXJpZjoge2ZvbnRfZmFtaWx5X3NlcmlmfTtcclxuICBAZm9udC1tb25vc3BhY2U6IHtmb250X2ZhbWlseV9tb25vc3BhY2V9O1xyXG5cclxuICBAY29sb3ItcHJpbWFyeTogIzRBNTZBODtcclxuICBAY29sb3ItcHJpbWFyeS1kYXJrOiAjMjMyODRmO1xyXG4gIEBjb2xvci1wcmltYXJ5LWRhcmtlcjogIzE3MWEzMztcclxuXHJcbiAgLmtzLWNsZWFyZml4IHtcclxuICAgICY6YWZ0ZXIge1xyXG4gICAgICBkaXNwbGF5OiB0YWJsZTtcclxuICAgICAgY2xlYXI6IGJvdGg7XHJcbiAgICAgIGNvbnRlbnQ6ICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaHRtbCwgYm9keSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICB9XHJcblxyXG4gIGJvZHksXHJcbiAgLmdhbGxfbGlzdCxcclxuICBidXR0b24sIGlucHV0LCBzZWxlY3QsIHRhYmxlLCB0ZXh0YXJlYSB7XHJcbiAgICBmb250LWZhbWlseTogQGZvbnQtc2FucztcclxuICB9XHJcblxyXG4gIGJvZHkge1xyXG4gICAgJi5rcy1oaWRlLWxvZ28gLmRjX2xvZ28ge1xyXG4gICAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICB9XHJcbiAgICAmLmtzLWhpZGUtdGl0bGUgLmxlZnRfY29udGVudCBoZWFkZXIge1xyXG4gICAgICBkaXNwbGF5OiBub25lXHJcbiAgICB9XHJcbiAgICAmLmtzLWhpZGUtdGl0bGViYXIgLmxlZnRfY29udGVudCBhcnRpY2xlOm50aC1jaGlsZCgyKSB7XHJcbiAgICAgIGRpc3BsYXk6IG5vbmUgXHJcbiAgICB9XHJcblxyXG4gICAgJi5rcy1oaWRlLXJpZ2h0IHtcclxuICAgICAgLmxlZnRfY29udGVudCB7XHJcbiAgICAgICAgZmxvYXQ6IG5vbmU7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5pc3N1ZWJveCB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIH1cclxuICAgICAgLm1pbm9yX2ludHJvX2JveCB7XHJcbiAgICAgICAgd2lkdGg6IGNhbGMoMTAwJSAtIDE1NXB4KTtcclxuICAgICAgfVxyXG4gICAgICAudmlzaXRfaGlzdG9yeSB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgICAgfVxyXG4gICAgICAubGlzdF9hcnJheV9vcHRpb24ge1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICB9XHJcbiAgICAgIC5yaWdodF9jb250ZW50IHtcclxuICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi5rcy1oaWRlLXJpZ2h0IC5zdGlja3l1bml0IHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1sb2dpbiAubG9naW5fYm94IHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1yZWNvbW1lbmQgLnJfcmVjb21tZW5kIHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1pc3N1ZXpvb20gLnJfaXNzdWV6b29tIHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1uZXdzIC5yX25ld3Mge1xyXG4gICAgICBkaXNwbGF5OiBub25lOyBcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1yZWFsdGltZSAucl9yZWFsdGltZV9pc3N1ZSB7XHJcbiAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcbiAgICAmLmtzLWhpZGUtcmlnaHQtaGl0IC5yX2hpdCB7IFxyXG4gICAgICBkaXNwbGF5OiBub25lOyBcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1zZWMtcmVjb21tZW5kIC5yX3NlY19yZWNvbW1lbmQgeyBcclxuICAgICAgZGlzcGxheTogbm9uZTsgXHJcbiAgICB9XHJcbiAgICAmLmtzLWhpZGUtcmlnaHQtd2lraSAucl93aWtpIHsgXHJcbiAgICAgIGRpc3BsYXk6IG5vbmU7IFxyXG4gICAgfVxyXG4gIFxyXG4gICAgJi5rcy1wcmV2ZW50LXNjcm9sbGluZyB7XHJcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgIGhlaWdodDogMTAwJTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICNrcy1uYXYge1xyXG4gICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIG1heC13aWR0aDogMTEwMHB4O1xyXG4gICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gIFxyXG4gICAgLmtzLW5hdi1pdGVtIHtcclxuICAgICAgcGFkZGluZzogMWVtIDJlbTtcclxuICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgI2tzLWNvbmZpZyB7XHJcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4yNXM7XHJcbiAgICB6LWluZGV4OiA1MDA7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjUpO1xyXG4gICAgb3BhY2l0eTogMDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuXHJcbiAgICA+IGRpdiB7XHJcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBtaW4td2lkdGg6IDQwMHB4O1xyXG4gICAgICBtYXgtd2lkdGg6IDYwMHB4O1xyXG4gICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgIG1pbi1oZWlnaHQ6IDMwMHB4O1xyXG4gICAgICBtYXgtaGVpZ2h0OiA4MCU7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgYmFja2dyb3VuZDogQGNvbG9yLXByaW1hcnktZGFyaztcclxuICAgICAgYm94LXNoYWRvdzogMCAwIDEwMCUgYmxhY2s7XHJcbiAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgY3Vyc29yOiBpbml0aWFsO1xyXG4gICAgfVxyXG5cclxuICAgIC5rcy1jb25maWctaXRlbSB7XHJcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICAgIHBhZGRpbmc6IDAuNWVtIDFlbTtcclxuICAgICAgXHJcbiAgICAgICY6bnRoLWNoaWxkKGV2ZW4pIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIC4xNSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAua3MtY29uZmlnLWtleSB7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICB3aWR0aDogMTAwJTtcclxuXHJcbiAgICAgIGxhYmVsIHtcclxuICAgICAgICBmbG9hdDogbGVmdDtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICA+IGlucHV0IHtcclxuICAgICAgICBmbG9hdDogcmlnaHQ7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgLjE1KTtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBAY29sb3ItcHJpbWFyeS1kYXJrO1xyXG4gICAgICAgIGZvbnQtZmFtaWx5OiBAZm9udC1tb25vc3BhY2U7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAua3MtY2xlYXJmaXgoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgJi5rcy1hY3RpdmUge1xyXG4gICAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xyXG4gICAgICBvcGFjaXR5OiAxO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgI2tzLXByZXZpZXcge1xyXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMjVzO1xyXG4gICAgei1pbmRleDogMTAwMDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgLjI1cztcclxuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcclxuICAgIHBhZGRpbmc6IDFlbTtcclxuICAgIG1heC13aWR0aDogNTAwcHg7XHJcbiAgICBtYXgtaGVpZ2h0OiAyNTBweDtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgICBiYWNrZ3JvdW5kOiBibGFjaztcclxuICAgIGJveC1zaGFkb3c6IDAgMCA1cHggYmxhY2s7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgICBmb250LXNpemU6IHtmb250X3NpemVfcHJldmlld307XHJcbiAgICBsaW5lLWhlaWdodDoge2ZvbnRfc2l6ZV9wcmV2aWV3fTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuXHJcbiAgICBpbWcge1xyXG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgICAgIG1heC1oZWlnaHQ6IDIwMHB4O1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcblxyXG4gICAgICAmLmtzLWFjdGl2ZSB7XHJcbiAgICAgICAgbWF4LWhlaWdodDogMTAwJTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICYua3MtYWN0aXZlIHtcclxuICAgICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcclxuICAgICAgb3BhY2l0eTogLjg1O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLnVzLXBvc3Qge1xyXG4gICAgJi5rcy1uZXcge1xyXG4gICAgICBhbmltYXRpb24tbmFtZToga3MtbmV3O1xyXG4gICAgICBhbmltYXRpb24tZHVyYXRpb246IC41cztcclxuICAgIH1cclxuXHJcbiAgICAmLmtzLWRlbGV0ZWQge1xyXG4gICAgICBiYWNrZ3JvdW5kOiByZ2IoMjQwLCAxMDAsIDEwMClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBrZXlmcmFtZXMga3MtbmV3IHtcclxuICAgIGZyb20ge1xyXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlWSgwKTtcclxuICAgICAgbWF4LWhlaWdodDogMDtcclxuICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDEwMCwgMTAwLCAxKTtcclxuICAgIH1cclxuICAgIHRvIHtcclxuICAgICAgdHJhbnNmb3JtOiBzY2FsZVkoMSk7XHJcbiAgICAgIG1heC1oZWlnaHQ6IDEwMCU7XHJcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAxMDAsIDEwMCwgMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5gXHJcblxyXG5jb25zdCBjb21wb25lbnRTdHlsZTogQ29tcG9uZW50ID0ge1xyXG4gIGNyZWF0ZSAoKSB7XHJcbiAgICBjb25zdCBzdHlsZSA9IGNyZWF0ZUVsZW1lbnQoJzxzdHlsZSBpZD1cImtzLXN0eWxlXCIgdHlwZT1cInRleHQvbGVzc1wiPjwvc3R5bGU+JylcclxuICAgIHN0eWxlLmlubmVySFRNTCA9IGZvcm1hdCh0ZW1wbGF0ZSwgY29uZmlnLmdldCgnc3R5bGUnKSlcclxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKVxyXG5cclxuICAgIGlmIChjb25maWcuZ2V0KCdkZWJ1Zy5sZXNzJykpIHtcclxuICAgICAgbGVzcy5vcHRpb25zLmVudiA9ICdkZXZlbG9wbWVudCdcclxuICAgIH1cclxuXHJcbiAgICBsZXNzLnJlZnJlc2goKVxyXG4gIH0sXHJcbiAgZGVzdHJveSAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcja3Mtc3R5bGUnKT8ucmVtb3ZlKClcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudFN0eWxlXHJcbiIsImltcG9ydCByZXF1ZXN0IGZyb20gJy4vcmVxdWVzdCdcclxuaW1wb3J0IHsgQk9EWV9QQVRURVJOLGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuL3V0aWxzJ1xyXG5cclxuY2xhc3MgQ2FjaGUgZXh0ZW5kcyBNYXA8bnVtYmVyLCBFbGVtZW50PiB7XHJcbiAgYXN5bmMgZmV0Y2hQb3N0IChnYWxsZXJ5OiBzdHJpbmcsIG5vOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHVybCA9IGBodHRwczovL20uZGNpbnNpZGUuY29tL2JvYXJkLyR7Z2FsbGVyeX0vJHtub31gXHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0KHtcclxuICAgICAgdXJsLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgJ3VzZXItYWdlbnQnOiAnTW96aWxsYS81LjAgKExpbnV4OyBBbmRyb2lkIDQuNC4yOyBOZXh1cyA0IEJ1aWxkL0tPVDQ5SCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzM0LjAuMTg0Ny4xMTQgTW9iaWxlIFNhZmFyaS81MzcuMzYnXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgXHJcbiAgICAvLyBib2R5IO2DnOq3uCDsho3rp4wg67aI65+s7Jik6riwXHJcbiAgICBjb25zdCBtYXRjaGVzID0gcmVzLnJlc3BvbnNlVGV4dC5tYXRjaChCT0RZX1BBVFRFUk4pXHJcbiAgICBjb25zdCAkID0gY3JlYXRlRWxlbWVudChtYXRjaGVzLmdyb3Vwcy5ib2R5KS5wYXJlbnROb2RlXHJcbiAgXHJcbiAgICAvLyDtlYTsmpTsl4bripQg7YOc6re4IOygnOqxsO2VmOq4sFxyXG4gICAgY29uc3QgY29udGVudCA9ICQucXVlcnlTZWxlY3RvcignLnRodW0tdHh0aW4nKVxyXG4gICAgY29uc3QgcXVlcnkgPSAnKjpub3QoaW1nKTpub3QoaWZyYW1lKTpub3QoYnIpOmVtcHR5J1xyXG4gIFxyXG4gICAgZm9yIChsZXQgZSBvZiBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpKSB7XHJcbiAgICAgIGUucmVtb3ZlKClcclxuICAgIH1cclxuICBcclxuICAgIC8vIOuqqOuToCDsnbTrr7jsp4Ag7JuQ67O4IOyjvOyGjOuhnCDrs4DtmZjtlZjquLBcclxuICAgIGZvciAobGV0IGltZyBvZiBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpKSB7XHJcbiAgICAgIGNvbnN0IHNyYyA9IGltZy5kYXRhc2V0Lm9yaWdpbmFsIHx8IGltZy5zcmNcclxuICBcclxuICAgICAgd2hpbGUgKGltZy5hdHRyaWJ1dGVzLmxlbmd0aCkge1xyXG4gICAgICAgIGltZy5yZW1vdmVBdHRyaWJ1dGUoaW1nLmF0dHJpYnV0ZXNbMF0ubmFtZSlcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBpbWcuc3JjID0gc3JjXHJcbiAgICB9XHJcbiBcclxuICAgIC8vIOy6kOyLse2VmOq4sFxyXG4gICAgdGhpcy5zZXQobm8sIGNvbnRlbnQpXHJcbiAgXHJcbiAgICByZXR1cm4gY29udGVudFxyXG4gIH1cclxuXHJcbiAgZmV0Y2hQb3N0cyAoZ2FsbGVyeTogc3RyaW5nLCBwb3N0czogbnVtYmVyW10pIHtcclxuICAgIHJldHVybiBwb3N0cy5tYXAobm8gPT4gdGhpcy5mZXRjaFBvc3QoZ2FsbGVyeSwgbm8pKVxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgY2FjaGUgPSBuZXcgQ2FjaGUoKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FjaGVcclxuIiwiaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi9zdG9yYWdlJ1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVEZWZhdWx0VmFsZXVzIChkZXRhaWxzOiBMb29zZU9iamVjdCwgbWFwPzogKGtleTogc3RyaW5nLCB2YWx1ZTogU3RvcmFibGUpID0+IHZvaWQpIHtcclxuICBjb25zdCByZXN1bHQgPSB7fSBhcyBMb29zZU9iamVjdFxyXG5cclxuICBmb3IgKGxldCBrZXkgaW4gZGV0YWlscykge1xyXG4gICAgY29uc3QgZGV0YWlsID0gZGV0YWlsc1trZXldXHJcbiAgICByZXN1bHRba2V5XSA9IGRldGFpbC5pdGVtcyA/IGdlbmVyYXRlRGVmYXVsdFZhbGV1cyhkZXRhaWwuaXRlbXMsIG1hcCkgOiBkZXRhaWwuZGVmYXVsdFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGV0YWlscyA9IHtcclxuICBoaWRlOiB7XHJcbiAgICBuYW1lOiAn7Iio6ri4IOyalOyGjCcsXHJcbiAgICBpdGVtczoge1xyXG4gICAgICBsb2dvOiB7XHJcbiAgICAgICAgbmFtZTogJ+ybuSDsgqzsnbTtirgg66Gc6rOgJyxcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB0aXRsZToge1xyXG4gICAgICAgIG5hbWU6ICfqsKTrn6zrpqwg7KCc66qpJyxcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB0aXRsZWJhcjoge1xyXG4gICAgICAgIG5hbWU6ICfqsKTrn6zrpqwg7KCV67O0JyxcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICByaWdodDoge1xyXG4gICAgICAgIG5hbWU6ICfsmrDsuKEg7IKs7J2065OcIOuwlCcsXHJcbiAgICAgICAgaXRlbXM6IHtcclxuICAgICAgICAgIGFsbDoge1xyXG4gICAgICAgICAgICBuYW1lOiAn7KCE7LK0JyxcclxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBsb2dpbjoge1xyXG4gICAgICAgICAgICBuYW1lOiAn7IKs7Jqp7J6QIOygleuztCcsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVjb21tZW5kOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICfqsJzrhZDquIAnLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGlzc3Vlem9vbToge1xyXG4gICAgICAgICAgICBuYW1lOiAn7J207IqIIOykjCcsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbmV3czoge1xyXG4gICAgICAgICAgICBuYW1lOiAn64m07IqkJyxcclxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICByZWFsdGltZToge1xyXG4gICAgICAgICAgICBuYW1lOiAn7Iuk7Iuc6rCEIOqygOyDieyWtCcsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaGl0OiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICftnpsnLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNlY19yZWNvbW1lbmQ6IHtcclxuICAgICAgICAgICAgbmFtZTogJ+y0iOqwnOuFkCcsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgd2lraToge1xyXG4gICAgICAgICAgICBuYW1lOiAn65SU7Iuc7JyE7YKkJyxcclxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIHN0eWxlOiB7XHJcbiAgICBuYW1lOiAn7IKs7Jqp7J6QIOyKpO2DgOydvCcsXHJcbiAgICBpdGVtczoge1xyXG4gICAgICBmb250X2ZhbWlseV9zYW5zOiB7XHJcbiAgICAgICAgbmFtZTogJ+yCsOyEuOumrO2UhCDquIDqvLQnLFxyXG4gICAgICAgIGRlZmF1bHQ6ICdcIuunkeydgCDqs6DrlJVcIiwgc2Fucy1zZXJpZidcclxuICAgICAgfSxcclxuICAgICAgZm9udF9mYW1pbHlfc2VyaWY6IHtcclxuICAgICAgICBuYW1lOiAn7IS466as7ZSEIOq4gOq8tCcsXHJcbiAgICAgICAgZGVmYXVsdDogJ3NlcmlmJ1xyXG4gICAgICB9LFxyXG4gICAgICBmb250X2ZhbWlseV9tb25vc3BhY2U6IHtcclxuICAgICAgICBuYW1lOiAn6rOg7KCV7Y+tIOq4gOq8tCcsXHJcbiAgICAgICAgZGVmYXVsdDogJ1wiRDJDb2RpbmdcIiwgTmFudW1Hb3RoaWNDb2RpbmcsIG1vbm9zcGFjZSdcclxuICAgICAgfSxcclxuICAgICAgZm9udF9zaXplX3ByZXZpZXc6IHtcclxuICAgICAgICBuYW1lOiAn7ZSE66as67ewIOq4gOyekCDtgazquLAnLFxyXG4gICAgICAgIGRlZmF1bHQ6ICcxLjVlbSdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGVidWc6IHtcclxuICAgIG5hbWU6ICfrlJTrsoTquYUnLFxyXG4gICAgaXRlbXM6IHtcclxuICAgICAgbGVzczoge1xyXG4gICAgICAgIG5hbWUgOidMZXNzJyxcclxuICAgICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRWYWx1ZSA9IGdlbmVyYXRlRGVmYXVsdFZhbGV1cyhkZXRhaWxzKVxyXG5cclxuY29uc3QgY29uZmlnID0gbmV3IFN0b3JhZ2UoJ2NvbmZpZycsIHtcclxuICBkZWZhdWx0VmFsdWUsXHJcbiAgb25TeW5jICgpIHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbXVxyXG5cclxuICAgIGlmICh0aGlzLmdldCgnaGlkZS5sb2dvJykpIGNsYXNzZXMucHVzaCgna3MtaGlkZS1sb2dvJylcclxuICAgIGlmICh0aGlzLmdldCgnaGlkZS50aXRsZScpKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtdGl0bGUnKVxyXG4gICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnRpdGxlYmFyJykpIGNsYXNzZXMucHVzaCgna3MtaGlkZS10aXRsZWJhcicpXHJcblxyXG4gICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0LmFsbCcpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaCgna3MtaGlkZS1yaWdodCcpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5nZXQoJ2hpZGUucmlnaHQubG9naW4nKSkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXJpZ2h0LWxvZ2luJylcclxuICAgICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0LnJlY29tbWVuZCcpKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtcmlnaHQtcmVjb21tZW5kJylcclxuICAgICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0Lmlzc3Vlem9vbScpKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtcmlnaHQtaXNzdWV6b29tJylcclxuICAgICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0Lm5ld3MnKSkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXJpZ2h0LW5ld3MnKVxyXG4gICAgICBpZiAodGhpcy5nZXQoJ2hpZGUucmlnaHQucmVhbHRpbWUnKSkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXJpZ2h0LXJlYWx0aW1lJylcclxuICAgICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0LmhpdCcpKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtcmlnaHQtaGl0JylcclxuICAgICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0LnNlY19yZWNvbW1lbmQnKSkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXJpZ2h0LXNlYy1yZWNvbW1lbmQnKVxyXG4gICAgICBpZiAodGhpcy5nZXQoJ2hpZGUucmlnaHQud2lraScpKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtcmlnaHQtd2lraScpXHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3Nlcy5qb2luKCcgJykpXHJcbiAgfVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnXHJcbiIsImltcG9ydCBjYWNoZSBmcm9tICcuL2NhY2hlJ1xyXG5pbXBvcnQgeyBCT0RZX1BBVFRFUk4sY3JlYXRlRWxlbWVudCB9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXF1ZXN0IChvcHRzOiBHTV9SZXF1ZXN0SW5mbykge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZTxHTV9SZXNwb25zZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgIG9wdHMubWV0aG9kID0gb3B0cy5tZXRob2QgfHwgJ0dFVCdcclxuXHJcbiAgICBjb25zdCBjbG9uZWRPcHRzOiBHTV9SZXF1ZXN0SW5mbyA9IHtcclxuICAgICAgLi4ub3B0cyxcclxuICAgICAgb25sb2FkOiByZXMgPT4ge1xyXG4gICAgICAgIGlmIChvcHRzLm9ubG9hZCkge1xyXG4gICAgICAgICAgb3B0cy5vbmxvYWQocmVzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlcy5yZWFkeVN0YXRlICE9PSA0KSB7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc29sdmUocmVzKVxyXG4gICAgICB9LFxyXG4gICAgICBvbmVycm9yOiByZXMgPT4ge1xyXG4gICAgICAgIGlmIChvcHRzLm9uZXJyb3IpIHtcclxuICAgICAgICAgIG9wdHMub25lcnJvcihyZXMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBlID0gbmV3IEVycm9yKCdwbGFjZWhvbGRlciByZXF1ZXN0IGVycm9yJylcclxuICAgICAgICByZWplY3QoZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEdNX3htbGh0dHBSZXF1ZXN0KGNsb25lZE9wdHMpXHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoTGlzdCAoZ2FsbGVyeTogc3RyaW5nKSB7XHJcbiAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdCh7XHJcbiAgICB1cmw6IGxvY2F0aW9uLmhyZWZcclxuICB9KVxyXG5cclxuICAvLyBib2R5IO2DnOq3uCDsho3rp4wg67aI65+s7Jik6riwXHJcbiAgY29uc3QgbWF0Y2hlcyA9IHJlcy5yZXNwb25zZVRleHQubWF0Y2goQk9EWV9QQVRURVJOKVxyXG4gIGNvbnN0ICQgPSBjcmVhdGVFbGVtZW50KG1hdGNoZXMuZ3JvdXBzLmJvZHkpLnBhcmVudE5vZGVcclxuXHJcbiAgLy8g7ZWE7JqU7JeG64qUIOq4gOydgCDsgq3soJztlZjquLBcclxuICBjb25zdCBhZGRlZFBvc3RzID0gJC5xdWVyeVNlbGVjdG9yQWxsKCcudXMtcG9zdCcpIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+XHJcblxyXG4gIGNvbnN0IHRib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbGxfbGlzdCB0Ym9keScpXHJcbiAgY29uc3QgbnVtYmVycyA9IFtdXHJcblxyXG4gIGZvciAobGV0IHBvc3Qgb2YgYWRkZWRQb3N0cykge1xyXG4gICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgIGNhc2UgcG9zdC5kYXRhc2V0LnR5cGUgPT09ICdpY29uX25vdGljZSc6XHJcbiAgICAgICAgY29udGludWVcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBubyA9IHBhcnNlSW50KHBvc3QuZGF0YXNldC5ubywgMTApXHJcblxyXG4gICAgLy8g6riw7KG0IOq4gCDrjJPquIAg7IiYLCDsobDtmowg7IiYIOuTsSDsl4XrjbDsnbTtirhcclxuICAgIGNvbnN0IGNhY2hlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC51cy1wb3N0W2RhdGEtbm89XCIke3Bvc3QuZGF0YXNldC5ub31cIl1gKSBcclxuICAgIGlmIChjYWNoZWQpIHtcclxuICAgICAgY2FjaGVkLmlubmVySFRNTCA9IHBvc3QuaW5uZXJIVE1MXHJcbiAgICB9XHJcblxyXG4gICAgLy8g7LqQ7Iuc65CY7KeAIOyViuydgCDquIDsnbTrnbzrqbQg7LqQ7Iuc7ZWY6riwIOy2lOqwgO2VmOq4sFxyXG4gICAgaWYgKCFjYWNoZS5oYXMobm8pKSB7XHJcbiAgICAgIGNhY2hlLmZldGNoUG9zdChnYWxsZXJ5LCBubylcclxuICAgICAgcG9zdC5jbGFzc0xpc3QuYWRkKCdrcy1uZXcnKVxyXG4gICAgICB0Ym9keS5wcmVwZW5kKHBvc3QpXHJcbiAgICB9XHJcblxyXG4gICAgbnVtYmVycy5wdXNoKG5vKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgbG93ZXN0ID0gTWF0aC5taW4oLi4ubnVtYmVycylcclxuXHJcbiAgZm9yIChsZXQgcG9zdCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudXMtcG9zdCcpIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+KSB7XHJcbiAgICBjb25zdCBubyA9IHBhcnNlSW50KHBvc3QuZGF0YXNldC5ubywgMTApXHJcblxyXG4gICAgaWYgKG5vIDwgbG93ZXN0KSB7XHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFudW1iZXJzLmluY2x1ZGVzKG5vKSkge1xyXG4gICAgICBwb3N0LmNsYXNzTGlzdC5hZGQoJ2tzLWRlbGV0ZWQnKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgZG90UHJvcCBmcm9tICdkb3QtcHJvcCdcclxuXHJcbmludGVyZmFjZSBTdG9yYWdlT3B0aW9ucyB7XHJcbiAgZGVmYXVsdFZhbHVlPzogTG9vc2VPYmplY3Q7XHJcbiAgb25TeW5jPyh0aGlzOiBTdG9yYWdlKTogdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmFnZSB7XHJcbiAgcHVibGljIHJlYWRvbmx5IGtleTogc3RyaW5nXHJcbiAgcHVibGljIHJlYWRvbmx5IG9wdHM6IFN0b3JhZ2VPcHRpb25zXHJcbiAgcHJpdmF0ZSBzdG9yYWdlOiBMb29zZU9iamVjdFxyXG5cclxuICBjb25zdHJ1Y3RvciAoa2V5OiBzdHJpbmcsIG9wdHM/OiBTdG9yYWdlT3B0aW9ucykge1xyXG4gICAgdGhpcy5rZXkgPSBrZXlcclxuICAgIHRoaXMub3B0cyA9IG9wdHMgfHwge31cclxuICAgIHRoaXMuc3RvcmFnZSA9IEdNX2dldFZhbHVlPExvb3NlT2JqZWN0PihrZXksIG9wdHMuZGVmYXVsdFZhbHVlKVxyXG4gIH1cclxuXHJcbiAgc3luYyAoKSB7XHJcbiAgICBHTV9zZXRWYWx1ZSh0aGlzLmtleSwgdGhpcy5zdG9yYWdlKVxyXG5cclxuICAgIGlmICh0aGlzLm9wdHMub25TeW5jKSB7XHJcbiAgICAgIHRoaXMub3B0cy5vblN5bmMuYXBwbHkodGhpcylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldDxUID0gU3RvcmFibGU+IChrZXk6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGRvdFByb3AuZ2V0PFQ+KHRoaXMuc3RvcmFnZSwga2V5KSB8fCBkb3RQcm9wLmdldDxUPih0aGlzLm9wdHMuZGVmYXVsdFZhbHVlLCBrZXkpXHJcbiAgfVxyXG5cclxuICBzZXQgKGtleTogc3RyaW5nLCB2YWx1ZTogU3RvcmFibGUpIHtcclxuICAgIGRvdFByb3Auc2V0KHRoaXMuc3RvcmFnZSwga2V5LCB2YWx1ZSlcclxuICAgIHRoaXMuc3luYygpXHJcbiAgfVxyXG5cclxuICBleHBvcnQgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZVxyXG4gIH1cclxuXHJcbiAgaW1wb3J0ICh2YWx1ZTogTG9vc2VPYmplY3QpIHtcclxuICAgIHRoaXMuc3RvcmFnZSA9IHZhbHVlXHJcbiAgICB0aGlzLnN5bmMoKVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgcXMgZnJvbSAncXVlcnktc3RyaW5nJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQ8VCA9IEhUTUxFbGVtZW50PiAoaHRtbDogc3RyaW5nKSB7XHJcbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpXHJcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbC50cmltKClcclxuICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkIGFzIHVua25vd24gYXMgVFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyYW1ldGVyIChrZXk6IHN0cmluZykge1xyXG4gIGNvbnN0IHBhcmFtcyA9IHFzLnBhcnNlKGxvY2F0aW9uLnNlYXJjaClcclxuICByZXR1cm4gcGFyYW1zW2tleV0gYXMgc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBCT0RZX1BBVFRFUk4gPSAvKD88Ym9keT48Ym9keVtePl0qPigoLnxbXFxuXFxyXSkqKTxcXC9ib2R5PikvaW1cclxuIiwiaW1wb3J0IHBMaW1pdCBmcm9tICdwLWxpbWl0J1xyXG5pbXBvcnQgeyB0cnlBbmRXYWl0Rm9yVGhlRWxlbWVudCB9IGZyb20gJ3dhaXQtZm9yLXRoZS1lbGVtZW50J1xyXG5cclxuaW1wb3J0IGNvbXBvbmVudENvbmZpZyBmcm9tICcuL2NvbXBvbmVudHMvY29uZmlnJ1xyXG5pbXBvcnQgY29tcG9uZW50TmF2IGZyb20gJy4vY29tcG9uZW50cy9uYXYnXHJcbmltcG9ydCBjb21wb25lbnRQcmV2aWV3IGZyb20gJy4vY29tcG9uZW50cy9wcmV2aWV3J1xyXG5pbXBvcnQgY29tcG9uZW50U3R5bGUgZnJvbSAnLi9jb21wb25lbnRzL3N0eWxlJ1xyXG5pbXBvcnQgY2FjaGUgZnJvbSAnLi9pbmNsdWRlcy9jYWNoZSdcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2luY2x1ZGVzL2NvbmZpZydcclxuaW1wb3J0IHsgZmV0Y2hMaXN0IH0gZnJvbSAnLi9pbmNsdWRlcy9yZXF1ZXN0J1xyXG5pbXBvcnQgeyBnZXRQYXJhbWV0ZXIgfSBmcm9tICcuL2luY2x1ZGVzL3V0aWxzJ1xyXG5cclxuY29uc3QgZ2FsbGVyeSA9IGdldFBhcmFtZXRlcignaWQnKVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gbWFpbiAoKSB7XHJcbiAgLy8g7ISk7KCVIOunnuy2lOq4sFxyXG4gIGNvbmZpZy5zeW5jKClcclxuXHJcbiAgLy8g7JWx7JeQ7IScIOyCrOyaqe2VoCDsmpTshozsmYAg7Iqk7YOA7J28IOyLnO2KuCDstpTqsIDtlZjquLBcclxuICBjb21wb25lbnRTdHlsZS5jcmVhdGUoKVxyXG4gIGNvbXBvbmVudENvbmZpZy5jcmVhdGUoKVxyXG4gIGNvbXBvbmVudE5hdi5jcmVhdGUoKVxyXG4gIGNvbXBvbmVudFByZXZpZXcuY3JlYXRlKClcclxuXHJcbiAgY29uc3QgcHJldmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNrcy1wcmV2aWV3JykgYXMgSFRNTEVsZW1lbnRcclxuXHJcbiAgZnVuY3Rpb24gb25Nb3VzZUV2ZW50IChlOiBNb3VzZUV2ZW50KSB7XHJcbiAgICBsZXQgZWwgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxyXG5cclxuICAgIC8vIOqyjOyLnOq4gCDrqqnroZ0g7JqU7IaM7J247KeAIO2ZleyduO2VmOq4sFxyXG4gICAgd2hpbGUgKGVsICE9PSBudWxsKSB7XHJcbiAgICAgIC8vIO2UhOumrOu3sCDqsJ3ssrTrnbzrqbQg7ZSE66as67ewIOuwleyKpCDrgrTsl5DshJwg7Iqk7YGs66GkIO2VtOyVvO2VmOuvgOuhnCDrrLTsi5ztlZjquLBcclxuICAgICAgaWYgKGVsID09PSBwcmV2aWV3KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdrcy1wcmV2ZW50LXNjcm9sbGluZycpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2tzLXByZXZlbnQtc2Nyb2xsaW5nJylcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGVsLmNsYXNzTGlzdCAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ3VzLXBvc3QnKSkge1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsID0gZWwucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudFxyXG4gICAgfVxyXG4gIFxyXG4gICAgaWYgKGVsKSB7XHJcbiAgICAgIGNvbnN0IG5vID0gcGFyc2VJbnQoZWwuZGF0YXNldC5ubywgMTApXHJcblxyXG4gICAgICAvLyDtmITsnqwg7ZSE66as67ew6rCAIOyEoO2Dne2VnCDqsozsi5zquIDsnbQg7JWE64uI652866m0IOyXheuNsOydtO2KuO2VmOq4sFxyXG4gICAgICBpZiAoY2FjaGUuaGFzKG5vKSAmJiBwcmV2aWV3LmRhdGFzZXQubm8gIT09IGVsLmRhdGFzZXQubm8pIHtcclxuICAgICAgICBjb25zdCBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxyXG4gICAgICAgIGNvbnN0IGNsaWVudFRvcCA9IGRvY3VtZW50LmJvZHkuY2xpZW50VG9wIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRUb3AgfHwgMFxyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICBjb25zdCB0b3AgPSByZWN0LnRvcCArIHNjcm9sbFRvcCAtIGNsaWVudFRvcFxyXG5cclxuICAgICAgICBwcmV2aWV3LnN0eWxlLnRvcCA9IGAke3RvcH1weGBcclxuICAgICAgICBwcmV2aWV3LnN0eWxlLmxlZnQgPSBgJHtlLnBhZ2VYICsgMjV9cHhgXHJcbiAgICAgICAgcHJldmlldy5kYXRhc2V0Lm5vID0gZWwuZGF0YXNldC5ub1xyXG4gICAgICAgIHByZXZpZXcuaW5uZXJIVE1MID0gY2FjaGUuZ2V0KG5vKS5pbm5lckhUTUxcclxuICAgICAgICBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2tzLWFjdGl2ZScpXHJcblxyXG4gICAgICAgIGZvciAobGV0IGltZyBvZiBwcmV2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpKSB7XHJcbiAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgna3MtYWN0aXZlJylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyDtlITrpqzrt7Ag67CV7IqkIOy0iOq4sO2ZlFxyXG4gICAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2tzLWFjdGl2ZScpXHJcbiAgICAgIHByZXZpZXcuaW5uZXJIVE1MID0gJydcclxuICAgICAgZGVsZXRlIHByZXZpZXcuZGF0YXNldC5ub1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZG9jdW1lbnQuYm9keS5wcmVwZW5kKHByZXZpZXcpXHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VFdmVudClcclxuICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgb25Nb3VzZUV2ZW50KVxyXG4gIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgb25Nb3VzZUV2ZW50KSAvLyBmb3Igb3VyIGZpcmVmb3ggZnJpZW5kcyA6KVxyXG5cclxuICBjb25zdCBwcm9taXNlcyA9IFtdXHJcbiAgY29uc3QgbGltaXQgPSBwTGltaXQoMTApXHJcblxyXG4gIGZvciAobGV0IGVsIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcudXMtcG9zdCcpKSB7XHJcbiAgICAvLyDrsojtmLgg7JeG64qUIOq4gOydgCDrrLTsi5ztlZjquLBcclxuICAgIGlmICghZWwuZGF0YXNldC5ubykge1xyXG4gICAgICBjb25zb2xlLmxvZyhlbClcclxuICAgICAgY29udGludWVcclxuICAgIH1cclxuXHJcbiAgICAvLyDqs7Xsp4Ag6rKM7Iuc6riA7J2AIOustOyLnO2VmOq4sFxyXG4gICAgaWYgKGVsLmRhdGFzZXQudHlwZSA9PT0gJ2ljb25fbm90aWNlJykge1xyXG4gICAgICBjb250aW51ZVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5vID0gcGFyc2VJbnQoZWwuZGF0YXNldC5ubywgMTApXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcHJvbWlzZSA9IGxpbWl0KCgpID0+IGNhY2hlLmZldGNoUG9zdChnYWxsZXJ5LCBubykpXHJcbiAgICAgIHByb21pc2VzLnB1c2gocHJvbWlzZSlcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g7ZiE7J6sIOu2iOufrOyYqCDqsozsi5zquIAg7KCE7LK0IOy6kOyLse2VmOq4sFxyXG4gIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxyXG5cclxuICAvLyDqsozsi5zquIAg7Iuk7Iuc6rCEIOyXheuNsOydtO2KuCDsi5zsnpHtlZjquLBcclxuICBzZXRJbnRlcnZhbCgoKSA9PiBmZXRjaExpc3QoZ2FsbGVyeSksIDEwMDApXHJcbn1cclxuXHJcbi8vIOy1nOyDgeuLqCDtjpjsnbTsp4Dsl5DshJzrp4wg7Iqk7YGs66a97Yq4IOyLpO2Wie2VmOq4sFxyXG5pZiAod2luZG93LnRvcCA9PT0gd2luZG93LnNlbGYpIHtcclxuXHJcbiAgLy8g6rCk65+s66asIO2FjOydtOu4lCDsmpTshowg64yA6riwIO2bhCBtYWluKCkg7Iuk7ZaJ7ZWY6riwXHJcbiAgdHJ5QW5kV2FpdEZvclRoZUVsZW1lbnQoJy5jb3B5cmlnaHQnKVxyXG4gICAgLmNhdGNoKCgpID0+IGNvbnNvbGUuZXJyb3IoJ+2OmOydtOyngOyXkOyEnCDqsozsi5zquIAg7YWM7J2067iUIOyalOyGjOulvCDrtojrn6zsmKwg7IiYIOyXhuyKteuLiOuLpCcpKVxyXG4gICAgLnRoZW4oKCkgPT4gbWFpbigpKVxyXG4gICAgLmNhdGNoKGNvbnNvbGUuZXJyb3IpXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==