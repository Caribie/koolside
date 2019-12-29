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
    onCreate() {
        const preview = utils_1.createElement('<div id="ks-preview"></div>');
        document.body.prepend(preview);
    },
    onDestroy() {
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

  body,
  .gall_list,
  button, input, select, table, textarea {
    font-family: @font-sans;
  }

  /* 앱 */
  body {
    &.ks-hide-logo .dc_logo { opacity: 0 }

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

  #ks-preview {
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    overflow-y: auto;
    transition: opacity .25s;
    display: none;
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
      display: inline-block;
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
    onCreate() {
        const style = utils_1.createElement('<style id="ks-style" type="text/less"></style>');
        style.innerHTML = string_format_1.default(template, config_1.default.get('style'));
        document.head.append(style);
        if (config_1.default.get('debug.less')) {
            less.options.env = 'development';
        }
        less.refresh();
    },
    onDestroy() {
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
const details = {
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
            font_size_list: {
                name: '게시글 목록 글자 크기',
                default: '1em'
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
const defaultValue = generateDefaultValeus(details);
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
            if (this.get('hideElhideement.right.hit'))
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
const preview_1 = __importDefault(__webpack_require__(/*! ./components/preview */ "./src/components/preview.ts"));
const style_1 = __importDefault(__webpack_require__(/*! ./components/style */ "./src/components/style.ts"));
const cache_1 = __importDefault(__webpack_require__(/*! ./includes/cache */ "./src/includes/cache.ts"));
const config_1 = __importDefault(__webpack_require__(/*! ./includes/config */ "./src/includes/config.ts"));
const request_1 = __webpack_require__(/*! ./includes/request */ "./src/includes/request.ts");
const utils_1 = __webpack_require__(/*! ./includes/utils */ "./src/includes/utils.ts");
const gallery = utils_1.getParameter('id');
async function main() {
    // 설정 맞추기
    config_1.default.sync();
    // 앱에서 사용할 요소와 스타일 시트 추가하기
    style_1.default.onCreate();
    preview_1.default.onCreate();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2RlY29kZS11cmktY29tcG9uZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kb3QtcHJvcC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaXMtb2JqL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wLWxpbWl0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wLXRyeS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcXVlcnktc3RyaW5nL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zcGxpdC1vbi1maXJzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3RyaWN0LXVyaS1lbmNvZGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0cmluZy1mb3JtYXQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dhaXQtZm9yLXRoZS1lbGVtZW50L3dhaXRGb3JUaGVFbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3ByZXZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvc3R5bGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luY2x1ZGVzL2NhY2hlLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmNsdWRlcy9jb25maWcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luY2x1ZGVzL3JlcXVlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luY2x1ZGVzL3N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luY2x1ZGVzL3V0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7O0FBRUEsb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3U2E7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDckJhO0FBQ2IsNkVBQTZFLDJDQUEyQzs7Ozs7Ozs7Ozs7O0FDRHhIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNqQjtLQUNGO0lBRUQscUJBQXFCO0lBQ3JCLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFFM0Isb0JBQW9CO0lBQ3BCLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQztBQUM3QyxDQUFDO0FBRUQsdUJBQXVCO0FBQ3ZCLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFO0lBRTlCLDhCQUE4QjtJQUM5Qiw4Q0FBdUIsQ0FBQyxZQUFZLENBQUM7U0FDbEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztTQUMxRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Q0FDeEIiLCJmaWxlIjoibGliLnVzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciB0b2tlbiA9ICclW2EtZjAtOV17Mn0nO1xudmFyIHNpbmdsZU1hdGNoZXIgPSBuZXcgUmVnRXhwKHRva2VuLCAnZ2knKTtcbnZhciBtdWx0aU1hdGNoZXIgPSBuZXcgUmVnRXhwKCcoJyArIHRva2VuICsgJykrJywgJ2dpJyk7XG5cbmZ1bmN0aW9uIGRlY29kZUNvbXBvbmVudHMoY29tcG9uZW50cywgc3BsaXQpIHtcblx0dHJ5IHtcblx0XHQvLyBUcnkgdG8gZGVjb2RlIHRoZSBlbnRpcmUgc3RyaW5nIGZpcnN0XG5cdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChjb21wb25lbnRzLmpvaW4oJycpKTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gRG8gbm90aGluZ1xuXHR9XG5cblx0aWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAxKSB7XG5cdFx0cmV0dXJuIGNvbXBvbmVudHM7XG5cdH1cblxuXHRzcGxpdCA9IHNwbGl0IHx8IDE7XG5cblx0Ly8gU3BsaXQgdGhlIGFycmF5IGluIDIgcGFydHNcblx0dmFyIGxlZnQgPSBjb21wb25lbnRzLnNsaWNlKDAsIHNwbGl0KTtcblx0dmFyIHJpZ2h0ID0gY29tcG9uZW50cy5zbGljZShzcGxpdCk7XG5cblx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuY2FsbChbXSwgZGVjb2RlQ29tcG9uZW50cyhsZWZ0KSwgZGVjb2RlQ29tcG9uZW50cyhyaWdodCkpO1xufVxuXG5mdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGlucHV0KTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0dmFyIHRva2VucyA9IGlucHV0Lm1hdGNoKHNpbmdsZU1hdGNoZXIpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDE7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlucHV0ID0gZGVjb2RlQ29tcG9uZW50cyh0b2tlbnMsIGkpLmpvaW4oJycpO1xuXG5cdFx0XHR0b2tlbnMgPSBpbnB1dC5tYXRjaChzaW5nbGVNYXRjaGVyKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW5wdXQ7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3VzdG9tRGVjb2RlVVJJQ29tcG9uZW50KGlucHV0KSB7XG5cdC8vIEtlZXAgdHJhY2sgb2YgYWxsIHRoZSByZXBsYWNlbWVudHMgYW5kIHByZWZpbGwgdGhlIG1hcCB3aXRoIHRoZSBgQk9NYFxuXHR2YXIgcmVwbGFjZU1hcCA9IHtcblx0XHQnJUZFJUZGJzogJ1xcdUZGRkRcXHVGRkZEJyxcblx0XHQnJUZGJUZFJzogJ1xcdUZGRkRcXHVGRkZEJ1xuXHR9O1xuXG5cdHZhciBtYXRjaCA9IG11bHRpTWF0Y2hlci5leGVjKGlucHV0KTtcblx0d2hpbGUgKG1hdGNoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdC8vIERlY29kZSBhcyBiaWcgY2h1bmtzIGFzIHBvc3NpYmxlXG5cdFx0XHRyZXBsYWNlTWFwW21hdGNoWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFswXSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gZGVjb2RlKG1hdGNoWzBdKTtcblxuXHRcdFx0aWYgKHJlc3VsdCAhPT0gbWF0Y2hbMF0pIHtcblx0XHRcdFx0cmVwbGFjZU1hcFttYXRjaFswXV0gPSByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bWF0Y2ggPSBtdWx0aU1hdGNoZXIuZXhlYyhpbnB1dCk7XG5cdH1cblxuXHQvLyBBZGQgYCVDMmAgYXQgdGhlIGVuZCBvZiB0aGUgbWFwIHRvIG1ha2Ugc3VyZSBpdCBkb2VzIG5vdCByZXBsYWNlIHRoZSBjb21iaW5hdG9yIGJlZm9yZSBldmVyeXRoaW5nIGVsc2Vcblx0cmVwbGFjZU1hcFsnJUMyJ10gPSAnXFx1RkZGRCc7XG5cblx0dmFyIGVudHJpZXMgPSBPYmplY3Qua2V5cyhyZXBsYWNlTWFwKTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHQvLyBSZXBsYWNlIGFsbCBkZWNvZGVkIGNvbXBvbmVudHNcblx0XHR2YXIga2V5ID0gZW50cmllc1tpXTtcblx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobmV3IFJlZ0V4cChrZXksICdnJyksIHJlcGxhY2VNYXBba2V5XSk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVuY29kZWRVUkkpIHtcblx0aWYgKHR5cGVvZiBlbmNvZGVkVVJJICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGBlbmNvZGVkVVJJYCB0byBiZSBvZiB0eXBlIGBzdHJpbmdgLCBnb3QgYCcgKyB0eXBlb2YgZW5jb2RlZFVSSSArICdgJyk7XG5cdH1cblxuXHR0cnkge1xuXHRcdGVuY29kZWRVUkkgPSBlbmNvZGVkVVJJLnJlcGxhY2UoL1xcKy9nLCAnICcpO1xuXG5cdFx0Ly8gVHJ5IHRoZSBidWlsdCBpbiBkZWNvZGVyIGZpcnN0XG5cdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlbmNvZGVkVVJJKTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gRmFsbGJhY2sgdG8gYSBtb3JlIGFkdmFuY2VkIGRlY29kZXJcblx0XHRyZXR1cm4gY3VzdG9tRGVjb2RlVVJJQ29tcG9uZW50KGVuY29kZWRVUkkpO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgaXNPYmogPSByZXF1aXJlKCdpcy1vYmonKTtcblxuY29uc3QgZGlzYWxsb3dlZEtleXMgPSBbXG5cdCdfX3Byb3RvX18nLFxuXHQncHJvdG90eXBlJyxcblx0J2NvbnN0cnVjdG9yJ1xuXTtcblxuY29uc3QgaXNWYWxpZFBhdGggPSBwYXRoU2VnbWVudHMgPT4gIXBhdGhTZWdtZW50cy5zb21lKHNlZ21lbnQgPT4gZGlzYWxsb3dlZEtleXMuaW5jbHVkZXMoc2VnbWVudCkpO1xuXG5mdW5jdGlvbiBnZXRQYXRoU2VnbWVudHMocGF0aCkge1xuXHRjb25zdCBwYXRoQXJyYXkgPSBwYXRoLnNwbGl0KCcuJyk7XG5cdGNvbnN0IHBhcnRzID0gW107XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgcCA9IHBhdGhBcnJheVtpXTtcblxuXHRcdHdoaWxlIChwW3AubGVuZ3RoIC0gMV0gPT09ICdcXFxcJyAmJiBwYXRoQXJyYXlbaSArIDFdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHAgPSBwLnNsaWNlKDAsIC0xKSArICcuJztcblx0XHRcdHAgKz0gcGF0aEFycmF5WysraV07XG5cdFx0fVxuXG5cdFx0cGFydHMucHVzaChwKTtcblx0fVxuXG5cdGlmICghaXNWYWxpZFBhdGgocGFydHMpKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblx0cmV0dXJuIHBhcnRzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Z2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcblx0XHRpZiAoIWlzT2JqKG9iamVjdCkgfHwgdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IG9iamVjdCA6IHZhbHVlO1xuXHRcdH1cblxuXHRcdGNvbnN0IHBhdGhBcnJheSA9IGdldFBhdGhTZWdtZW50cyhwYXRoKTtcblx0XHRpZiAocGF0aEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmplY3QsIHBhdGhBcnJheVtpXSkpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRvYmplY3QgPSBvYmplY3RbcGF0aEFycmF5W2ldXTtcblxuXHRcdFx0aWYgKG9iamVjdCA9PT0gdW5kZWZpbmVkIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuXHRcdFx0XHQvLyBgb2JqZWN0YCBpcyBlaXRoZXIgYHVuZGVmaW5lZGAgb3IgYG51bGxgIHNvIHdlIHdhbnQgdG8gc3RvcCB0aGUgbG9vcCwgYW5kXG5cdFx0XHRcdC8vIGlmIHRoaXMgaXMgbm90IHRoZSBsYXN0IGJpdCBvZiB0aGUgcGF0aCwgYW5kXG5cdFx0XHRcdC8vIGlmIGl0IGRpZCd0IHJldHVybiBgdW5kZWZpbmVkYFxuXHRcdFx0XHQvLyBpdCB3b3VsZCByZXR1cm4gYG51bGxgIGlmIGBvYmplY3RgIGlzIGBudWxsYFxuXHRcdFx0XHQvLyBidXQgd2Ugd2FudCBgZ2V0KHtmb286IG51bGx9LCAnZm9vLmJhcicpYCB0byBlcXVhbCBgdW5kZWZpbmVkYCwgb3IgdGhlIHN1cHBsaWVkIHZhbHVlLCBub3QgYG51bGxgXG5cdFx0XHRcdGlmIChpICE9PSBwYXRoQXJyYXkubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvYmplY3Q7XG5cdH0sXG5cblx0c2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpIHtcblx0XHRpZiAoIWlzT2JqKG9iamVjdCkgfHwgdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm4gb2JqZWN0O1xuXHRcdH1cblxuXHRcdGNvbnN0IHJvb3QgPSBvYmplY3Q7XG5cdFx0Y29uc3QgcGF0aEFycmF5ID0gZ2V0UGF0aFNlZ21lbnRzKHBhdGgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHAgPSBwYXRoQXJyYXlbaV07XG5cblx0XHRcdGlmICghaXNPYmoob2JqZWN0W3BdKSkge1xuXHRcdFx0XHRvYmplY3RbcF0gPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGkgPT09IHBhdGhBcnJheS5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdG9iamVjdFtwXSA9IHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRvYmplY3QgPSBvYmplY3RbcF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJvb3Q7XG5cdH0sXG5cblx0ZGVsZXRlKG9iamVjdCwgcGF0aCkge1xuXHRcdGlmICghaXNPYmoob2JqZWN0KSB8fCB0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBwYXRoQXJyYXkgPSBnZXRQYXRoU2VnbWVudHMocGF0aCk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhBcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgcCA9IHBhdGhBcnJheVtpXTtcblxuXHRcdFx0aWYgKGkgPT09IHBhdGhBcnJheS5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGRlbGV0ZSBvYmplY3RbcF07XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0b2JqZWN0ID0gb2JqZWN0W3BdO1xuXG5cdFx0XHRpZiAoIWlzT2JqKG9iamVjdCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRoYXMob2JqZWN0LCBwYXRoKSB7XG5cdFx0aWYgKCFpc09iaihvYmplY3QpIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGNvbnN0IHBhdGhBcnJheSA9IGdldFBhdGhTZWdtZW50cyhwYXRoKTtcblx0XHRpZiAocGF0aEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL25vLWZvci1sb29wXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChpc09iaihvYmplY3QpKSB7XG5cdFx0XHRcdGlmICghKHBhdGhBcnJheVtpXSBpbiBvYmplY3QpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0b2JqZWN0ID0gb2JqZWN0W3BhdGhBcnJheVtpXV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gdmFsdWUgPT4ge1xuXHRjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlO1xuXHRyZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgKHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdmdW5jdGlvbicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHBUcnkgPSByZXF1aXJlKCdwLXRyeScpO1xuXG5jb25zdCBwTGltaXQgPSBjb25jdXJyZW5jeSA9PiB7XG5cdGlmICghKChOdW1iZXIuaXNJbnRlZ2VyKGNvbmN1cnJlbmN5KSB8fCBjb25jdXJyZW5jeSA9PT0gSW5maW5pdHkpICYmIGNvbmN1cnJlbmN5ID4gMCkpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYGNvbmN1cnJlbmN5YCB0byBiZSBhIG51bWJlciBmcm9tIDEgYW5kIHVwJykpO1xuXHR9XG5cblx0Y29uc3QgcXVldWUgPSBbXTtcblx0bGV0IGFjdGl2ZUNvdW50ID0gMDtcblxuXHRjb25zdCBuZXh0ID0gKCkgPT4ge1xuXHRcdGFjdGl2ZUNvdW50LS07XG5cblx0XHRpZiAocXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0cXVldWUuc2hpZnQoKSgpO1xuXHRcdH1cblx0fTtcblxuXHRjb25zdCBydW4gPSAoZm4sIHJlc29sdmUsIC4uLmFyZ3MpID0+IHtcblx0XHRhY3RpdmVDb3VudCsrO1xuXG5cdFx0Y29uc3QgcmVzdWx0ID0gcFRyeShmbiwgLi4uYXJncyk7XG5cblx0XHRyZXNvbHZlKHJlc3VsdCk7XG5cblx0XHRyZXN1bHQudGhlbihuZXh0LCBuZXh0KTtcblx0fTtcblxuXHRjb25zdCBlbnF1ZXVlID0gKGZuLCByZXNvbHZlLCAuLi5hcmdzKSA9PiB7XG5cdFx0aWYgKGFjdGl2ZUNvdW50IDwgY29uY3VycmVuY3kpIHtcblx0XHRcdHJ1bihmbiwgcmVzb2x2ZSwgLi4uYXJncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHF1ZXVlLnB1c2gocnVuLmJpbmQobnVsbCwgZm4sIHJlc29sdmUsIC4uLmFyZ3MpKTtcblx0XHR9XG5cdH07XG5cblx0Y29uc3QgZ2VuZXJhdG9yID0gKGZuLCAuLi5hcmdzKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IGVucXVldWUoZm4sIHJlc29sdmUsIC4uLmFyZ3MpKTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZ2VuZXJhdG9yLCB7XG5cdFx0YWN0aXZlQ291bnQ6IHtcblx0XHRcdGdldDogKCkgPT4gYWN0aXZlQ291bnRcblx0XHR9LFxuXHRcdHBlbmRpbmdDb3VudDoge1xuXHRcdFx0Z2V0OiAoKSA9PiBxdWV1ZS5sZW5ndGhcblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBnZW5lcmF0b3I7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBMaW1pdDtcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBwTGltaXQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBUcnkgPSAoZm4sIC4uLmFyZ3VtZW50c18pID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRyZXNvbHZlKGZuKC4uLmFyZ3VtZW50c18pKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBUcnk7XG4vLyBUT0RPOiByZW1vdmUgdGhpcyBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gcFRyeTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHN0cmljdFVyaUVuY29kZSA9IHJlcXVpcmUoJ3N0cmljdC11cmktZW5jb2RlJyk7XG5jb25zdCBkZWNvZGVDb21wb25lbnQgPSByZXF1aXJlKCdkZWNvZGUtdXJpLWNvbXBvbmVudCcpO1xuY29uc3Qgc3BsaXRPbkZpcnN0ID0gcmVxdWlyZSgnc3BsaXQtb24tZmlyc3QnKTtcblxuZnVuY3Rpb24gZW5jb2RlckZvckFycmF5Rm9ybWF0KG9wdGlvbnMpIHtcblx0c3dpdGNoIChvcHRpb25zLmFycmF5Rm9ybWF0KSB7XG5cdFx0Y2FzZSAnaW5kZXgnOlxuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHJlc3VsdC5sZW5ndGg7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IChvcHRpb25zLnNraXBOdWxsICYmIHZhbHVlID09PSBudWxsKSkge1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gWy4uLnJlc3VsdCwgW2VuY29kZShrZXksIG9wdGlvbnMpLCAnWycsIGluZGV4LCAnXSddLmpvaW4oJycpXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0Li4ucmVzdWx0LFxuXHRcdFx0XHRcdFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJ1snLCBlbmNvZGUoaW5kZXgsIG9wdGlvbnMpLCAnXT0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKVxuXHRcdFx0XHRdO1xuXHRcdFx0fTtcblxuXHRcdGNhc2UgJ2JyYWNrZXQnOlxuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFsuLi5yZXN1bHQsIFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJ1tdJ10uam9pbignJyldO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFsuLi5yZXN1bHQsIFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJ1tdPScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpXTtcblx0XHRcdH07XG5cblx0XHRjYXNlICdjb21tYSc6XG5cdFx0XHRyZXR1cm4ga2V5ID0+IChyZXN1bHQsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHJldHVybiBbW2VuY29kZShrZXksIG9wdGlvbnMpLCAnPScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbW3Jlc3VsdCwgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignLCcpXTtcblx0XHRcdH07XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFsuLi5yZXN1bHQsIGVuY29kZShrZXksIG9wdGlvbnMpXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbLi4ucmVzdWx0LCBbZW5jb2RlKGtleSwgb3B0aW9ucyksICc9JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJyldO1xuXHRcdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBwYXJzZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKSB7XG5cdGxldCByZXN1bHQ7XG5cblx0c3dpdGNoIChvcHRpb25zLmFycmF5Rm9ybWF0KSB7XG5cdFx0Y2FzZSAnaW5kZXgnOlxuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRyZXN1bHQgPSAvXFxbKFxcZCopXFxdJC8uZXhlYyhrZXkpO1xuXG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9cXFtcXGQqXFxdJC8sICcnKTtcblxuXHRcdFx0XHRpZiAoIXJlc3VsdCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHt9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XVtyZXN1bHRbMV1dID0gdmFsdWU7XG5cdFx0XHR9O1xuXG5cdFx0Y2FzZSAnYnJhY2tldCc6XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdHJlc3VsdCA9IC8oXFxbXFxdKSQvLmV4ZWMoa2V5KTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW1xcXSQvLCAnJyk7XG5cblx0XHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbdmFsdWVdO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbXS5jb25jYXQoYWNjdW11bGF0b3Jba2V5XSwgdmFsdWUpO1xuXHRcdFx0fTtcblxuXHRcdGNhc2UgJ2NvbW1hJzpcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0Y29uc3QgaXNBcnJheSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuc3BsaXQoJycpLmluZGV4T2YoJywnKSA+IC0xO1xuXHRcdFx0XHRjb25zdCBuZXdWYWx1ZSA9IGlzQXJyYXkgPyB2YWx1ZS5zcGxpdCgnLCcpIDogdmFsdWU7XG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBuZXdWYWx1ZTtcblx0XHRcdH07XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbXS5jb25jYXQoYWNjdW11bGF0b3Jba2V5XSwgdmFsdWUpO1xuXHRcdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBlbmNvZGUodmFsdWUsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMuZW5jb2RlKSB7XG5cdFx0cmV0dXJuIG9wdGlvbnMuc3RyaWN0ID8gc3RyaWN0VXJpRW5jb2RlKHZhbHVlKSA6IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGRlY29kZSh2YWx1ZSwgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucy5kZWNvZGUpIHtcblx0XHRyZXR1cm4gZGVjb2RlQ29tcG9uZW50KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24ga2V5c1NvcnRlcihpbnB1dCkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcblx0XHRyZXR1cm4gaW5wdXQuc29ydCgpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4ga2V5c1NvcnRlcihPYmplY3Qua2V5cyhpbnB1dCkpXG5cdFx0XHQuc29ydCgoYSwgYikgPT4gTnVtYmVyKGEpIC0gTnVtYmVyKGIpKVxuXHRcdFx0Lm1hcChrZXkgPT4gaW5wdXRba2V5XSk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUhhc2goaW5wdXQpIHtcblx0Y29uc3QgaGFzaFN0YXJ0ID0gaW5wdXQuaW5kZXhPZignIycpO1xuXHRpZiAoaGFzaFN0YXJ0ICE9PSAtMSkge1xuXHRcdGlucHV0ID0gaW5wdXQuc2xpY2UoMCwgaGFzaFN0YXJ0KTtcblx0fVxuXG5cdHJldHVybiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdChpbnB1dCkge1xuXHRpbnB1dCA9IHJlbW92ZUhhc2goaW5wdXQpO1xuXHRjb25zdCBxdWVyeVN0YXJ0ID0gaW5wdXQuaW5kZXhPZignPycpO1xuXHRpZiAocXVlcnlTdGFydCA9PT0gLTEpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQuc2xpY2UocXVlcnlTdGFydCArIDEpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlLCBvcHRpb25zKSB7XG5cdGlmIChvcHRpb25zLnBhcnNlTnVtYmVycyAmJiAhTnVtYmVyLmlzTmFOKE51bWJlcih2YWx1ZSkpICYmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnRyaW0oKSAhPT0gJycpKSB7XG5cdFx0dmFsdWUgPSBOdW1iZXIodmFsdWUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMucGFyc2VCb29sZWFucyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnIHx8IHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICdmYWxzZScpKSB7XG5cdFx0dmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKGlucHV0LCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblx0XHRkZWNvZGU6IHRydWUsXG5cdFx0c29ydDogdHJ1ZSxcblx0XHRhcnJheUZvcm1hdDogJ25vbmUnLFxuXHRcdHBhcnNlTnVtYmVyczogZmFsc2UsXG5cdFx0cGFyc2VCb29sZWFuczogZmFsc2Vcblx0fSwgb3B0aW9ucyk7XG5cblx0Y29uc3QgZm9ybWF0dGVyID0gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0aW9ucyk7XG5cblx0Ly8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIG5vIHByb3RvdHlwZVxuXHRjb25zdCByZXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdGlucHV0ID0gaW5wdXQudHJpbSgpLnJlcGxhY2UoL15bPyMmXS8sICcnKTtcblxuXHRpZiAoIWlucHV0KSB7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdGZvciAoY29uc3QgcGFyYW0gb2YgaW5wdXQuc3BsaXQoJyYnKSkge1xuXHRcdGxldCBba2V5LCB2YWx1ZV0gPSBzcGxpdE9uRmlyc3Qob3B0aW9ucy5kZWNvZGUgPyBwYXJhbS5yZXBsYWNlKC9cXCsvZywgJyAnKSA6IHBhcmFtLCAnPScpO1xuXG5cdFx0Ly8gTWlzc2luZyBgPWAgc2hvdWxkIGJlIGBudWxsYDpcblx0XHQvLyBodHRwOi8vdzMub3JnL1RSLzIwMTIvV0QtdXJsLTIwMTIwNTI0LyNjb2xsZWN0LXVybC1wYXJhbWV0ZXJzXG5cdFx0dmFsdWUgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGRlY29kZSh2YWx1ZSwgb3B0aW9ucyk7XG5cdFx0Zm9ybWF0dGVyKGRlY29kZShrZXksIG9wdGlvbnMpLCB2YWx1ZSwgcmV0KTtcblx0fVxuXG5cdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHJldCkpIHtcblx0XHRjb25zdCB2YWx1ZSA9IHJldFtrZXldO1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XG5cdFx0XHRmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXModmFsdWUpKSB7XG5cdFx0XHRcdHZhbHVlW2tdID0gcGFyc2VWYWx1ZSh2YWx1ZVtrXSwgb3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldFtrZXldID0gcGFyc2VWYWx1ZSh2YWx1ZSwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc29ydCA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0cmV0dXJuIChvcHRpb25zLnNvcnQgPT09IHRydWUgPyBPYmplY3Qua2V5cyhyZXQpLnNvcnQoKSA6IE9iamVjdC5rZXlzKHJldCkuc29ydChvcHRpb25zLnNvcnQpKS5yZWR1Y2UoKHJlc3VsdCwga2V5KSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSByZXRba2V5XTtcblx0XHRpZiAoQm9vbGVhbih2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdC8vIFNvcnQgb2JqZWN0IGtleXMsIG5vdCB2YWx1ZXNcblx0XHRcdHJlc3VsdFtrZXldID0ga2V5c1NvcnRlcih2YWx1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdFtrZXldID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG59XG5cbmV4cG9ydHMuZXh0cmFjdCA9IGV4dHJhY3Q7XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG5cbmV4cG9ydHMuc3RyaW5naWZ5ID0gKG9iamVjdCwgb3B0aW9ucykgPT4ge1xuXHRpZiAoIW9iamVjdCkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblx0XHRlbmNvZGU6IHRydWUsXG5cdFx0c3RyaWN0OiB0cnVlLFxuXHRcdGFycmF5Rm9ybWF0OiAnbm9uZSdcblx0fSwgb3B0aW9ucyk7XG5cblx0Y29uc3QgZm9ybWF0dGVyID0gZW5jb2RlckZvckFycmF5Rm9ybWF0KG9wdGlvbnMpO1xuXG5cdGNvbnN0IG9iamVjdENvcHkgPSBPYmplY3QuYXNzaWduKHt9LCBvYmplY3QpO1xuXHRpZiAob3B0aW9ucy5za2lwTnVsbCkge1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iamVjdENvcHkpKSB7XG5cdFx0XHRpZiAob2JqZWN0Q29weVtrZXldID09PSB1bmRlZmluZWQgfHwgb2JqZWN0Q29weVtrZXldID09PSBudWxsKSB7XG5cdFx0XHRcdGRlbGV0ZSBvYmplY3RDb3B5W2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdENvcHkpO1xuXG5cdGlmIChvcHRpb25zLnNvcnQgIT09IGZhbHNlKSB7XG5cdFx0a2V5cy5zb3J0KG9wdGlvbnMuc29ydCk7XG5cdH1cblxuXHRyZXR1cm4ga2V5cy5tYXAoa2V5ID0+IHtcblx0XHRjb25zdCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG5cdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRpZiAodmFsdWUgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdHJldHVybiB2YWx1ZVxuXHRcdFx0XHQucmVkdWNlKGZvcm1hdHRlcihrZXkpLCBbXSlcblx0XHRcdFx0LmpvaW4oJyYnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0aW9ucykgKyAnPScgKyBlbmNvZGUodmFsdWUsIG9wdGlvbnMpO1xuXHR9KS5maWx0ZXIoeCA9PiB4Lmxlbmd0aCA+IDApLmpvaW4oJyYnKTtcbn07XG5cbmV4cG9ydHMucGFyc2VVcmwgPSAoaW5wdXQsIG9wdGlvbnMpID0+IHtcblx0cmV0dXJuIHtcblx0XHR1cmw6IHJlbW92ZUhhc2goaW5wdXQpLnNwbGl0KCc/JylbMF0gfHwgJycsXG5cdFx0cXVlcnk6IHBhcnNlKGV4dHJhY3QoaW5wdXQpLCBvcHRpb25zKVxuXHR9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoc3RyaW5nLCBzZXBhcmF0b3IpID0+IHtcblx0aWYgKCEodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHNlcGFyYXRvciA9PT0gJ3N0cmluZycpKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgdGhlIGFyZ3VtZW50cyB0byBiZSBvZiB0eXBlIGBzdHJpbmdgJyk7XG5cdH1cblxuXHRpZiAoc2VwYXJhdG9yID09PSAnJykge1xuXHRcdHJldHVybiBbc3RyaW5nXTtcblx0fVxuXG5cdGNvbnN0IHNlcGFyYXRvckluZGV4ID0gc3RyaW5nLmluZGV4T2Yoc2VwYXJhdG9yKTtcblxuXHRpZiAoc2VwYXJhdG9ySW5kZXggPT09IC0xKSB7XG5cdFx0cmV0dXJuIFtzdHJpbmddO1xuXHR9XG5cblx0cmV0dXJuIFtcblx0XHRzdHJpbmcuc2xpY2UoMCwgc2VwYXJhdG9ySW5kZXgpLFxuXHRcdHN0cmluZy5zbGljZShzZXBhcmF0b3JJbmRleCArIHNlcGFyYXRvci5sZW5ndGgpXG5cdF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBzdHIgPT4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCkqXS9nLCB4ID0+IGAlJHt4LmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCl9YCk7XG4iLCJ2b2lkIGZ1bmN0aW9uKGdsb2JhbCkge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyAgVmFsdWVFcnJvciA6OiBTdHJpbmcgLT4gRXJyb3JcbiAgZnVuY3Rpb24gVmFsdWVFcnJvcihtZXNzYWdlKSB7XG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICBlcnIubmFtZSA9ICdWYWx1ZUVycm9yJztcbiAgICByZXR1cm4gZXJyO1xuICB9XG5cbiAgLy8gIGNyZWF0ZSA6OiBPYmplY3QgLT4gU3RyaW5nLCouLi4gLT4gU3RyaW5nXG4gIGZ1bmN0aW9uIGNyZWF0ZSh0cmFuc2Zvcm1lcnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHZhciBpZHggPSAwO1xuICAgICAgdmFyIHN0YXRlID0gJ1VOREVGSU5FRCc7XG5cbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKFxuICAgICAgICAvKFt7fV0pXFwxfFt7XSguKj8pKD86ISguKz8pKT9bfV0vZyxcbiAgICAgICAgZnVuY3Rpb24obWF0Y2gsIGxpdGVyYWwsIF9rZXksIHhmKSB7XG4gICAgICAgICAgaWYgKGxpdGVyYWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxpdGVyYWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBrZXkgPSBfa2V5O1xuICAgICAgICAgIGlmIChrZXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKHN0YXRlID09PSAnSU1QTElDSVQnKSB7XG4gICAgICAgICAgICAgIHRocm93IFZhbHVlRXJyb3IoJ2Nhbm5vdCBzd2l0Y2ggZnJvbSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaW1wbGljaXQgdG8gZXhwbGljaXQgbnVtYmVyaW5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0ZSA9ICdFWFBMSUNJVCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PT0gJ0VYUExJQ0lUJykge1xuICAgICAgICAgICAgICB0aHJvdyBWYWx1ZUVycm9yKCdjYW5ub3Qgc3dpdGNoIGZyb20gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2V4cGxpY2l0IHRvIGltcGxpY2l0IG51bWJlcmluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGUgPSAnSU1QTElDSVQnO1xuICAgICAgICAgICAga2V5ID0gU3RyaW5nKGlkeCk7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyAgMS4gIFNwbGl0IHRoZSBrZXkgaW50byBhIGxvb2t1cCBwYXRoLlxuICAgICAgICAgIC8vICAyLiAgSWYgdGhlIGZpcnN0IHBhdGggY29tcG9uZW50IGlzIG5vdCBhbiBpbmRleCwgcHJlcGVuZCAnMCcuXG4gICAgICAgICAgLy8gIDMuICBSZWR1Y2UgdGhlIGxvb2t1cCBwYXRoIHRvIGEgc2luZ2xlIHJlc3VsdC4gSWYgdGhlIGxvb2t1cFxuICAgICAgICAgIC8vICAgICAgc3VjY2VlZHMgdGhlIHJlc3VsdCBpcyBhIHNpbmdsZXRvbiBhcnJheSBjb250YWluaW5nIHRoZVxuICAgICAgICAgIC8vICAgICAgdmFsdWUgYXQgdGhlIGxvb2t1cCBwYXRoOyBvdGhlcndpc2UgdGhlIHJlc3VsdCBpcyBbXS5cbiAgICAgICAgICAvLyAgNC4gIFVud3JhcCB0aGUgcmVzdWx0IGJ5IHJlZHVjaW5nIHdpdGggJycgYXMgdGhlIGRlZmF1bHQgdmFsdWUuXG4gICAgICAgICAgdmFyIHBhdGggPSBrZXkuc3BsaXQoJy4nKTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSAoL15cXGQrJC8udGVzdChwYXRoWzBdKSA/IHBhdGggOiBbJzAnXS5jb25jYXQocGF0aCkpXG4gICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uKG1heWJlLCBrZXkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1heWJlLnJlZHVjZShmdW5jdGlvbihfLCB4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHggIT0gbnVsbCAmJiBrZXkgaW4gT2JqZWN0KHgpID9cbiAgICAgICAgICAgICAgICAgIFt0eXBlb2YgeFtrZXldID09PSAnZnVuY3Rpb24nID8geFtrZXldKCkgOiB4W2tleV1dIDpcbiAgICAgICAgICAgICAgICAgIFtdO1xuICAgICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICB9LCBbYXJnc10pXG4gICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uKF8sIHgpIHsgcmV0dXJuIHg7IH0sICcnKTtcblxuICAgICAgICAgIGlmICh4ZiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodHJhbnNmb3JtZXJzLCB4ZikpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lcnNbeGZdKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgVmFsdWVFcnJvcignbm8gdHJhbnNmb3JtZXIgbmFtZWQgXCInICsgeGYgKyAnXCInKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfTtcbiAgfVxuXG4gIC8vICBmb3JtYXQgOjogU3RyaW5nLCouLi4gLT4gU3RyaW5nXG4gIHZhciBmb3JtYXQgPSBjcmVhdGUoe30pO1xuXG4gIC8vICBmb3JtYXQuY3JlYXRlIDo6IE9iamVjdCAtPiBTdHJpbmcsKi4uLiAtPiBTdHJpbmdcbiAgZm9ybWF0LmNyZWF0ZSA9IGNyZWF0ZTtcblxuICAvLyAgZm9ybWF0LmV4dGVuZCA6OiBPYmplY3QsT2JqZWN0IC0+ICgpXG4gIGZvcm1hdC5leHRlbmQgPSBmdW5jdGlvbihwcm90b3R5cGUsIHRyYW5zZm9ybWVycykge1xuICAgIHZhciAkZm9ybWF0ID0gY3JlYXRlKHRyYW5zZm9ybWVycyk7XG4gICAgcHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgYXJncy51bnNoaWZ0KHRoaXMpO1xuICAgICAgcmV0dXJuICRmb3JtYXQuYXBwbHkoZ2xvYmFsLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZm9ybWF0O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIGZvcm1hdDsgfSk7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLmZvcm1hdCA9IGZvcm1hdDtcbiAgfVxuXG59LmNhbGwodGhpcywgdGhpcyk7XG4iLCIhZnVuY3Rpb24oZSx0KXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT90KGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSx0KTp0KChlPWV8fHNlbGYpLndhaXRGb3JUaGVFbGVtZW50PXt9KX0odGhpcyxmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBjKGUsdCl7dmFyIG49ZS50eXBlLHI9ZS50YXJnZXQsbz1lLmFkZGVkTm9kZXM7aWYoXCJhdHRyaWJ1dGVzXCI9PT1uJiZyLm1hdGNoZXModCkpcmV0dXJuIHI7aWYoXCJjaGlsZExpc3RcIiE9PW4pcmV0dXJuIG51bGw7Zm9yKHZhciBpPTAsdT1vO2k8dS5sZW5ndGg7aSs9MSl7dmFyIGE9dVtpXTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLm1hdGNoZXMmJmEubWF0Y2hlcyh0KSlyZXR1cm4gYX1yZXR1cm4gci5xdWVyeVNlbGVjdG9yKHQpfWZ1bmN0aW9uIG4oYSxlKXt2b2lkIDA9PT1lJiYoZT17fSk7dmFyIG49ZS50aW1lb3V0O3ZvaWQgMD09PW4mJihuPTI1MDApO3ZhciByPWUuc2NvcGU7cmV0dXJuIHZvaWQgMD09PXImJihyPWRvY3VtZW50KSxuZXcgUHJvbWlzZShmdW5jdGlvbihvLGUpe3ZhciB0PXIucXVlcnlTZWxlY3RvcihhKSxpPW51bGw7aWYobnVsbD09PXQpe3ZhciB1PW5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKGUpe2Zvcih2YXIgdD0wLG49ZTt0PG4ubGVuZ3RoO3QrPTEpe3ZhciByPWMoblt0XSxhKTtpZihudWxsIT09cil7Y2xlYXJUaW1lb3V0KGkpLHUuZGlzY29ubmVjdCgpLG8ocik7YnJlYWt9fX0pO3Uub2JzZXJ2ZShyLHthdHRyaWJ1dGVzOiEwLHN1YnRyZWU6ITAsY2hpbGRMaXN0OiEwfSksaT1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dS5kaXNjb25uZWN0KCksZShuZXcgRXJyb3IoXCJObyBlbGVtZW50IG1hdGNoZXMgdGhlIHNlbGVjdG9yIFwiK2ErXCIuXCIpKX0sbil9ZWxzZSBvKHQpfSl9dmFyIHQ9e3dhaXRGb3JUaGVFbGVtZW50Om4sdHJ5QW5kV2FpdEZvclRoZUVsZW1lbnQ6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gbihlLHQpLmNhdGNoKGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9KX19LHI9dC53YWl0Rm9yVGhlRWxlbWVudCxvPXQudHJ5QW5kV2FpdEZvclRoZUVsZW1lbnQ7ZS5kZWZhdWx0PXQsZS50cnlBbmRXYWl0Rm9yVGhlRWxlbWVudD1vLGUud2FpdEZvclRoZUVsZW1lbnQ9cixPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuIiwiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gXCIuLi9pbmNsdWRlcy91dGlsc1wiXHJcblxyXG5jb25zdCBjb21wb25lbnRQcmV2aWV3OiBDb21wb25lbnQgPSB7XHJcbiAgb25DcmVhdGUgKCkge1xyXG4gICAgY29uc3QgcHJldmlldyA9IGNyZWF0ZUVsZW1lbnQoJzxkaXYgaWQ9XCJrcy1wcmV2aWV3XCI+PC9kaXY+JylcclxuICAgIGRvY3VtZW50LmJvZHkucHJlcGVuZChwcmV2aWV3KVxyXG4gIH0sXHJcbiAgb25EZXN0cm95ICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNrcy1wcmV2aWV3Jyk/LnJlbW92ZSgpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb21wb25lbnRQcmV2aWV3XHJcbiIsImltcG9ydCBmb3JtYXQgZnJvbSAnc3RyaW5nLWZvcm1hdCdcclxuXHJcbmltcG9ydCBjb25maWcgZnJvbSAnLi4vaW5jbHVkZXMvY29uZmlnJ1xyXG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSBcIi4uL2luY2x1ZGVzL3V0aWxzXCJcclxuXHJcbmNvbnN0IHRlbXBsYXRlID0gIC8qIGxlc3MgKi9gXHJcbiAgQGZvbnQtc2Fuczoge2ZvbnRfZmFtaWx5X3NhbnN9O1xyXG4gIEBmb250LXNlcmlmOiB7Zm9udF9mYW1pbHlfc2VyaWZ9O1xyXG4gIEBmb250LW1vbm9zcGFjZToge2ZvbnRfZmFtaWx5X21vbm9zcGFjZX07XHJcblxyXG4gIGJvZHksXHJcbiAgLmdhbGxfbGlzdCxcclxuICBidXR0b24sIGlucHV0LCBzZWxlY3QsIHRhYmxlLCB0ZXh0YXJlYSB7XHJcbiAgICBmb250LWZhbWlseTogQGZvbnQtc2FucztcclxuICB9XHJcblxyXG4gIC8qIOyVsSAqL1xyXG4gIGJvZHkge1xyXG4gICAgJi5rcy1oaWRlLWxvZ28gLmRjX2xvZ28geyBvcGFjaXR5OiAwIH1cclxuXHJcbiAgICAmLmtzLWhpZGUtdGl0bGUgLmxlZnRfY29udGVudCBoZWFkZXIge1xyXG4gICAgICBkaXNwbGF5OiBub25lXHJcbiAgICB9XHJcbiAgICAmLmtzLWhpZGUtdGl0bGViYXIgLmxlZnRfY29udGVudCBhcnRpY2xlOm50aC1jaGlsZCgyKSB7XHJcbiAgICAgIGRpc3BsYXk6IG5vbmUgXHJcbiAgICB9XHJcblxyXG4gICAgJi5rcy1oaWRlLXJpZ2h0IHtcclxuICAgICAgLmxlZnRfY29udGVudCB7XHJcbiAgICAgICAgZmxvYXQ6IG5vbmU7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5pc3N1ZWJveCB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIH1cclxuICAgICAgLm1pbm9yX2ludHJvX2JveCB7XHJcbiAgICAgICAgd2lkdGg6IGNhbGMoMTAwJSAtIDE1NXB4KTtcclxuICAgICAgfVxyXG4gICAgICAudmlzaXRfaGlzdG9yeSB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgICAgfVxyXG4gICAgICAubGlzdF9hcnJheV9vcHRpb24ge1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICB9XHJcbiAgICAgIC5yaWdodF9jb250ZW50IHtcclxuICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi5rcy1oaWRlLXJpZ2h0IC5zdGlja3l1bml0IHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1sb2dpbiAubG9naW5fYm94IHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1yZWNvbW1lbmQgLnJfcmVjb21tZW5kIHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1pc3N1ZXpvb20gLnJfaXNzdWV6b29tIHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1uZXdzIC5yX25ld3Mge1xyXG4gICAgICBkaXNwbGF5OiBub25lOyBcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1yZWFsdGltZSAucl9yZWFsdGltZV9pc3N1ZSB7XHJcbiAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICB9XHJcbiAgICAmLmtzLWhpZGUtcmlnaHQtaGl0IC5yX2hpdCB7IFxyXG4gICAgICBkaXNwbGF5OiBub25lOyBcclxuICAgIH1cclxuICAgICYua3MtaGlkZS1yaWdodC1zZWMtcmVjb21tZW5kIC5yX3NlY19yZWNvbW1lbmQgeyBcclxuICAgICAgZGlzcGxheTogbm9uZTsgXHJcbiAgICB9XHJcbiAgICAmLmtzLWhpZGUtcmlnaHQtd2lraSAucl93aWtpIHsgXHJcbiAgICAgIGRpc3BsYXk6IG5vbmU7IFxyXG4gICAgfVxyXG4gIFxyXG4gICAgJi5rcy1wcmV2ZW50LXNjcm9sbGluZyB7XHJcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgIGhlaWdodDogMTAwJTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICNrcy1wcmV2aWV3IHtcclxuICAgIHotaW5kZXg6IDEwMDA7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4yNXM7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgcGFkZGluZzogMWVtO1xyXG4gICAgbWF4LXdpZHRoOiA1MDBweDtcclxuICAgIG1heC1oZWlnaHQ6IDI1MHB4O1xyXG4gICAgb3BhY2l0eTogMDtcclxuICAgIGJhY2tncm91bmQ6IGJsYWNrO1xyXG4gICAgYm94LXNoYWRvdzogMCAwIDVweCBibGFjaztcclxuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgIGZvbnQtc2l6ZToge2ZvbnRfc2l6ZV9wcmV2aWV3fTtcclxuICAgIGxpbmUtaGVpZ2h0OiB7Zm9udF9zaXplX3ByZXZpZXd9O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG5cclxuICAgIGltZyB7XHJcbiAgICAgIG1heC13aWR0aDogMTAwJTtcclxuICAgICAgbWF4LWhlaWdodDogMjAwcHg7XHJcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuXHJcbiAgICAgICYua3MtYWN0aXZlIHtcclxuICAgICAgICBtYXgtaGVpZ2h0OiAxMDAlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi5rcy1hY3RpdmUge1xyXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgIG9wYWNpdHk6IC44NTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC51cy1wb3N0IHtcclxuICAgICYua3MtbmV3IHtcclxuICAgICAgYW5pbWF0aW9uLW5hbWU6IGtzLW5ldztcclxuICAgICAgYW5pbWF0aW9uLWR1cmF0aW9uOiAuNXM7XHJcbiAgICB9XHJcblxyXG4gICAgJi5rcy1kZWxldGVkIHtcclxuICAgICAgYmFja2dyb3VuZDogcmdiKDI0MCwgMTAwLCAxMDApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBAa2V5ZnJhbWVzIGtzLW5ldyB7XHJcbiAgICBmcm9tIHtcclxuICAgICAgdHJhbnNmb3JtOiBzY2FsZVkoMCk7XHJcbiAgICAgIG1heC1oZWlnaHQ6IDA7XHJcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQwLCAxMDAsIDEwMCwgMSk7XHJcbiAgICB9XHJcbiAgICB0byB7XHJcbiAgICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpO1xyXG4gICAgICBtYXgtaGVpZ2h0OiAxMDAlO1xyXG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMTAwLCAxMDAsIDApO1xyXG4gICAgfVxyXG4gIH1cclxuYFxyXG5cclxuY29uc3QgY29tcG9uZW50U3R5bGU6IENvbXBvbmVudCA9IHtcclxuICBvbkNyZWF0ZSAoKSB7XHJcbiAgICBjb25zdCBzdHlsZSA9IGNyZWF0ZUVsZW1lbnQoJzxzdHlsZSBpZD1cImtzLXN0eWxlXCIgdHlwZT1cInRleHQvbGVzc1wiPjwvc3R5bGU+JylcclxuICAgIHN0eWxlLmlubmVySFRNTCA9IGZvcm1hdCh0ZW1wbGF0ZSwgY29uZmlnLmdldCgnc3R5bGUnKSlcclxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKVxyXG5cclxuICAgIGlmIChjb25maWcuZ2V0KCdkZWJ1Zy5sZXNzJykpIHtcclxuICAgICAgbGVzcy5vcHRpb25zLmVudiA9ICdkZXZlbG9wbWVudCdcclxuICAgIH1cclxuXHJcbiAgICBsZXNzLnJlZnJlc2goKVxyXG4gIH0sXHJcbiAgb25EZXN0cm95ICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNrcy1zdHlsZScpPy5yZW1vdmUoKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29tcG9uZW50U3R5bGVcclxuIiwiaW1wb3J0IHJlcXVlc3QgZnJvbSAnLi9yZXF1ZXN0J1xyXG5pbXBvcnQgeyBCT0RZX1BBVFRFUk4sY3JlYXRlRWxlbWVudCB9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5jbGFzcyBDYWNoZSBleHRlbmRzIE1hcDxudW1iZXIsIEVsZW1lbnQ+IHtcclxuICBhc3luYyBmZXRjaFBvc3QgKGdhbGxlcnk6IHN0cmluZywgbm86IG51bWJlcikge1xyXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbS5kY2luc2lkZS5jb20vYm9hcmQvJHtnYWxsZXJ5fS8ke25vfWBcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHJlcXVlc3Qoe1xyXG4gICAgICB1cmwsXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAndXNlci1hZ2VudCc6ICdNb3ppbGxhLzUuMCAoTGludXg7IEFuZHJvaWQgNC40LjI7IE5leHVzIDQgQnVpbGQvS09UNDlIKSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMzQuMC4xODQ3LjExNCBNb2JpbGUgU2FmYXJpLzUzNy4zNidcclxuICAgICAgfVxyXG4gICAgfSlcclxuICBcclxuICAgIC8vIGJvZHkg7YOc6re4IOyGjeunjCDrtojrn6zsmKTquLBcclxuICAgIGNvbnN0IG1hdGNoZXMgPSByZXMucmVzcG9uc2VUZXh0Lm1hdGNoKEJPRFlfUEFUVEVSTilcclxuICAgIGNvbnN0ICQgPSBjcmVhdGVFbGVtZW50KG1hdGNoZXMuZ3JvdXBzLmJvZHkpLnBhcmVudE5vZGVcclxuICBcclxuICAgIC8vIO2VhOyalOyXhuuKlCDtg5zqt7gg7KCc6rGw7ZWY6riwXHJcbiAgICBjb25zdCBjb250ZW50ID0gJC5xdWVyeVNlbGVjdG9yKCcudGh1bS10eHRpbicpXHJcbiAgICBjb25zdCBxdWVyeSA9ICcqOm5vdChpbWcpOm5vdChpZnJhbWUpOm5vdChicik6ZW1wdHknXHJcbiAgXHJcbiAgICBmb3IgKGxldCBlIG9mIGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeSkpIHtcclxuICAgICAgZS5yZW1vdmUoKVxyXG4gICAgfVxyXG4gIFxyXG4gICAgLy8g66qo65OgIOydtOuvuOyngCDsm5Drs7gg7KO87IaM66GcIOuzgO2ZmO2VmOq4sFxyXG4gICAgZm9yIChsZXQgaW1nIG9mIGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nJykpIHtcclxuICAgICAgY29uc3Qgc3JjID0gaW1nLmRhdGFzZXQub3JpZ2luYWwgfHwgaW1nLnNyY1xyXG4gIFxyXG4gICAgICB3aGlsZSAoaW1nLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgaW1nLnJlbW92ZUF0dHJpYnV0ZShpbWcuYXR0cmlidXRlc1swXS5uYW1lKVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGltZy5zcmMgPSBzcmNcclxuICAgIH1cclxuIFxyXG4gICAgLy8g7LqQ7Iux7ZWY6riwXHJcbiAgICB0aGlzLnNldChubywgY29udGVudClcclxuICBcclxuICAgIHJldHVybiBjb250ZW50XHJcbiAgfVxyXG5cclxuICBmZXRjaFBvc3RzIChnYWxsZXJ5OiBzdHJpbmcsIHBvc3RzOiBudW1iZXJbXSkge1xyXG4gICAgcmV0dXJuIHBvc3RzLm1hcChubyA9PiB0aGlzLmZldGNoUG9zdChnYWxsZXJ5LCBubykpXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBjYWNoZSA9IG5ldyBDYWNoZSgpXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYWNoZVxyXG4iLCJpbXBvcnQgU3RvcmFnZSBmcm9tICcuL3N0b3JhZ2UnXHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZURlZmF1bHRWYWxldXMgKGRldGFpbHM6IExvb3NlT2JqZWN0LCBtYXA/OiAoa2V5OiBzdHJpbmcsIHZhbHVlOiBTdG9yYWJsZSkgPT4gdm9pZCkge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHt9IGFzIExvb3NlT2JqZWN0XHJcblxyXG4gIGZvciAobGV0IGtleSBpbiBkZXRhaWxzKSB7XHJcbiAgICBjb25zdCBkZXRhaWwgPSBkZXRhaWxzW2tleV1cclxuICAgIHJlc3VsdFtrZXldID0gZGV0YWlsLml0ZW1zID8gZ2VuZXJhdGVEZWZhdWx0VmFsZXVzKGRldGFpbC5pdGVtcywgbWFwKSA6IGRldGFpbC5kZWZhdWx0XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmNvbnN0IGRldGFpbHMgPSB7XHJcbiAgaGlkZToge1xyXG4gICAgbmFtZTogJ+yIqOq4uCDsmpTshownLFxyXG4gICAgaXRlbXM6IHtcclxuICAgICAgbG9nbzoge1xyXG4gICAgICAgIG5hbWU6ICfsm7kg7IKs7J207Yq4IOuhnOqzoCcsXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgdGl0bGU6IHtcclxuICAgICAgICBuYW1lOiAn6rCk65+s66asIOygnOuqqScsXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgdGl0bGViYXI6IHtcclxuICAgICAgICBuYW1lOiAn6rCk65+s66asIOygleuztCcsXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgcmlnaHQ6IHtcclxuICAgICAgICBuYW1lOiAn7Jqw7LihIOyCrOydtOuTnCDrsJQnLFxyXG4gICAgICAgIGl0ZW1zOiB7XHJcbiAgICAgICAgICBhbGw6IHtcclxuICAgICAgICAgICAgbmFtZTogJ+yghOyytCcsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbG9naW46IHtcclxuICAgICAgICAgICAgbmFtZTogJ+yCrOyaqeyekCDsoJXrs7QnLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJlY29tbWVuZDoge1xyXG4gICAgICAgICAgICBuYW1lOiAn6rCc64WQ6riAJyxcclxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBpc3N1ZXpvb206IHtcclxuICAgICAgICAgICAgbmFtZTogJ+ydtOyKiCDspIwnLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG5ld3M6IHtcclxuICAgICAgICAgICAgbmFtZTogJ+uJtOyKpCcsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVhbHRpbWU6IHtcclxuICAgICAgICAgICAgbmFtZTogJ+yLpOyLnOqwhCDqsoDsg4nslrQnLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGhpdDoge1xyXG4gICAgICAgICAgICBuYW1lOiAn7Z6bJyxcclxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZWNfcmVjb21tZW5kOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICfstIjqsJzrhZAnLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHdpa2k6IHtcclxuICAgICAgICAgICAgbmFtZTogJ+uUlOyLnOychO2CpCcsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBzdHlsZToge1xyXG4gICAgbmFtZTogJ+yCrOyaqeyekCDsiqTtg4DsnbwnLFxyXG4gICAgaXRlbXM6IHtcclxuICAgICAgZm9udF9mYW1pbHlfc2Fuczoge1xyXG4gICAgICAgIG5hbWU6ICfsgrDshLjrpqztlIQg6riA6ry0JyxcclxuICAgICAgICBkZWZhdWx0OiAnXCLrp5HsnYAg6rOg65SVXCIsIHNhbnMtc2VyaWYnXHJcbiAgICAgIH0sXHJcbiAgICAgIGZvbnRfZmFtaWx5X3NlcmlmOiB7XHJcbiAgICAgICAgbmFtZTogJ+yEuOumrO2UhCDquIDqvLQnLFxyXG4gICAgICAgIGRlZmF1bHQ6ICdzZXJpZidcclxuICAgICAgfSxcclxuICAgICAgZm9udF9mYW1pbHlfbW9ub3NwYWNlOiB7XHJcbiAgICAgICAgbmFtZTogJ+qzoOygle2PrSDquIDqvLQnLFxyXG4gICAgICAgIGRlZmF1bHQ6ICdcIkQyQ29kaW5nXCIsIE5hbnVtR290aGljQ29kaW5nLCBtb25vc3BhY2UnXHJcbiAgICAgIH0sXHJcbiAgICAgIGZvbnRfc2l6ZV9saXN0OiB7XHJcbiAgICAgICAgbmFtZTogJ+qyjOyLnOq4gCDrqqnroZ0g6riA7J6QIO2BrOq4sCcsXHJcbiAgICAgICAgZGVmYXVsdDogJzFlbSdcclxuICAgICAgfSxcclxuICAgICAgZm9udF9zaXplX3ByZXZpZXc6IHtcclxuICAgICAgICBuYW1lOiAn7ZSE66as67ewIOq4gOyekCDtgazquLAnLFxyXG4gICAgICAgIGRlZmF1bHQ6ICcxLjVlbSdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGVidWc6IHtcclxuICAgIG5hbWU6ICfrlJTrsoTquYUnLFxyXG4gICAgaXRlbXM6IHtcclxuICAgICAgbGVzczoge1xyXG4gICAgICAgIG5hbWUgOidMZXNzJyxcclxuICAgICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRWYWx1ZSA9IGdlbmVyYXRlRGVmYXVsdFZhbGV1cyhkZXRhaWxzKVxyXG5cclxuY29uc3QgY29uZmlnID0gbmV3IFN0b3JhZ2UoJ2NvbmZpZycsIHtcclxuICBkZWZhdWx0VmFsdWUsXHJcbiAgb25TeW5jICgpIHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbXVxyXG5cclxuICAgIGlmICh0aGlzLmdldCgnaGlkZS5sb2dvJykpIGNsYXNzZXMucHVzaCgna3MtaGlkZS1sb2dvJylcclxuICAgIGlmICh0aGlzLmdldCgnaGlkZS50aXRsZScpKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtdGl0bGUnKVxyXG4gICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnRpdGxlYmFyJykpIGNsYXNzZXMucHVzaCgna3MtaGlkZS10aXRsZWJhcicpXHJcblxyXG4gICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0LmFsbCcpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaCgna3MtaGlkZS1yaWdodCcpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5nZXQoJ2hpZGUucmlnaHQubG9naW4nKSkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXJpZ2h0LWxvZ2luJylcclxuICAgICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0LnJlY29tbWVuZCcpKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtcmlnaHQtcmVjb21tZW5kJylcclxuICAgICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0Lmlzc3Vlem9vbScpKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtcmlnaHQtaXNzdWV6b29tJylcclxuICAgICAgaWYgKHRoaXMuZ2V0KCdoaWRlLnJpZ2h0Lm5ld3MnKSkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXJpZ2h0LW5ld3MnKVxyXG4gICAgICBpZiAodGhpcy5nZXQoJ2hpZGUucmlnaHQucmVhbHRpbWUnKSkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXJpZ2h0LXJlYWx0aW1lJylcclxuICAgICAgaWYgKHRoaXMuZ2V0KCdoaWRlRWxoaWRlZW1lbnQucmlnaHQuaGl0JykpIGNsYXNzZXMucHVzaCgna3MtaGlkZS1yaWdodC1oaXQnKVxyXG4gICAgICBpZiAodGhpcy5nZXQoJ2hpZGUucmlnaHQuc2VjX3JlY29tbWVuZCcpKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtcmlnaHQtc2VjLXJlY29tbWVuZCcpXHJcbiAgICAgIGlmICh0aGlzLmdldCgnaGlkZS5yaWdodC53aWtpJykpIGNsYXNzZXMucHVzaCgna3MtaGlkZS1yaWdodC13aWtpJylcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbGFzc2VzLmpvaW4oJyAnKSlcclxuICB9XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25maWdcclxuIiwiaW1wb3J0IGNhY2hlIGZyb20gJy4vY2FjaGUnXHJcbmltcG9ydCB7IEJPRFlfUEFUVEVSTixjcmVhdGVFbGVtZW50IH0gZnJvbSAnLi91dGlscydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlcXVlc3QgKG9wdHM6IEdNX1JlcXVlc3RJbmZvKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlPEdNX1Jlc3BvbnNlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgb3B0cy5tZXRob2QgPSBvcHRzLm1ldGhvZCB8fCAnR0VUJ1xyXG5cclxuICAgIGNvbnN0IGNsb25lZE9wdHM6IEdNX1JlcXVlc3RJbmZvID0ge1xyXG4gICAgICAuLi5vcHRzLFxyXG4gICAgICBvbmxvYWQ6IHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKG9wdHMub25sb2FkKSB7XHJcbiAgICAgICAgICBvcHRzLm9ubG9hZChyZXMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVzLnJlYWR5U3RhdGUgIT09IDQpIHtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzb2x2ZShyZXMpXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uZXJyb3I6IHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKG9wdHMub25lcnJvcikge1xyXG4gICAgICAgICAgb3B0cy5vbmVycm9yKHJlcylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ3BsYWNlaG9sZGVyIHJlcXVlc3QgZXJyb3InKVxyXG4gICAgICAgIHJlamVjdChlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgR01feG1saHR0cFJlcXVlc3QoY2xvbmVkT3B0cylcclxuICB9KVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hMaXN0IChnYWxsZXJ5OiBzdHJpbmcpIHtcclxuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0KHtcclxuICAgIHVybDogbG9jYXRpb24uaHJlZlxyXG4gIH0pXHJcblxyXG4gIC8vIGJvZHkg7YOc6re4IOyGjeunjCDrtojrn6zsmKTquLBcclxuICBjb25zdCBtYXRjaGVzID0gcmVzLnJlc3BvbnNlVGV4dC5tYXRjaChCT0RZX1BBVFRFUk4pXHJcbiAgY29uc3QgJCA9IGNyZWF0ZUVsZW1lbnQobWF0Y2hlcy5ncm91cHMuYm9keSkucGFyZW50Tm9kZVxyXG5cclxuICAvLyDtlYTsmpTsl4bripQg6riA7J2AIOyCreygnO2VmOq4sFxyXG4gIGNvbnN0IGFkZGVkUG9zdHMgPSAkLnF1ZXJ5U2VsZWN0b3JBbGwoJy51cy1wb3N0JykgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD5cclxuXHJcbiAgY29uc3QgdGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FsbF9saXN0IHRib2R5JylcclxuICBjb25zdCBudW1iZXJzID0gW11cclxuXHJcbiAgZm9yIChsZXQgcG9zdCBvZiBhZGRlZFBvc3RzKSB7XHJcbiAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgY2FzZSBwb3N0LmRhdGFzZXQudHlwZSA9PT0gJ2ljb25fbm90aWNlJzpcclxuICAgICAgICBjb250aW51ZVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5vID0gcGFyc2VJbnQocG9zdC5kYXRhc2V0Lm5vLCAxMClcclxuXHJcbiAgICAvLyDquLDsobQg6riAIOuMk+q4gCDsiJgsIOyhsO2ajCDsiJgg65OxIOyXheuNsOydtO2KuFxyXG4gICAgY29uc3QgY2FjaGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnVzLXBvc3RbZGF0YS1ubz1cIiR7cG9zdC5kYXRhc2V0Lm5vfVwiXWApIFxyXG4gICAgaWYgKGNhY2hlZCkge1xyXG4gICAgICBjYWNoZWQuaW5uZXJIVE1MID0gcG9zdC5pbm5lckhUTUxcclxuICAgIH1cclxuXHJcbiAgICAvLyDsupDsi5zrkJjsp4Ag7JWK7J2AIOq4gOydtOudvOuptCDsupDsi5ztlZjquLAg7LaU6rCA7ZWY6riwXHJcbiAgICBpZiAoIWNhY2hlLmhhcyhubykpIHtcclxuICAgICAgY2FjaGUuZmV0Y2hQb3N0KGdhbGxlcnksIG5vKVxyXG4gICAgICBwb3N0LmNsYXNzTGlzdC5hZGQoJ2tzLW5ldycpXHJcbiAgICAgIHRib2R5LnByZXBlbmQocG9zdClcclxuICAgIH1cclxuXHJcbiAgICBudW1iZXJzLnB1c2gobm8pXHJcbiAgfVxyXG5cclxuICBjb25zdCBsb3dlc3QgPSBNYXRoLm1pbiguLi5udW1iZXJzKVxyXG5cclxuICBmb3IgKGxldCBwb3N0IG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy51cy1wb3N0JykgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4pIHtcclxuICAgIGNvbnN0IG5vID0gcGFyc2VJbnQocG9zdC5kYXRhc2V0Lm5vLCAxMClcclxuXHJcbiAgICBpZiAobm8gPCBsb3dlc3QpIHtcclxuICAgICAgYnJlYWtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIW51bWJlcnMuaW5jbHVkZXMobm8pKSB7XHJcbiAgICAgIHBvc3QuY2xhc3NMaXN0LmFkZCgna3MtZGVsZXRlZCcpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBkb3RQcm9wIGZyb20gJ2RvdC1wcm9wJ1xyXG5cclxuaW50ZXJmYWNlIFN0b3JhZ2VPcHRpb25zIHtcclxuICBkZWZhdWx0VmFsdWU/OiBMb29zZU9iamVjdDtcclxuICBvblN5bmM/KHRoaXM6IFN0b3JhZ2UpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yYWdlIHtcclxuICBwcml2YXRlIHJlYWRvbmx5IGtleTogc3RyaW5nXHJcbiAgcHJpdmF0ZSByZWFkb25seSBvcHRzOiBTdG9yYWdlT3B0aW9uc1xyXG4gIHByaXZhdGUgc3RvcmFnZTogTG9vc2VPYmplY3RcclxuXHJcbiAgY29uc3RydWN0b3IgKGtleTogc3RyaW5nLCBvcHRzPzogU3RvcmFnZU9wdGlvbnMpIHtcclxuICAgIHRoaXMua2V5ID0ga2V5XHJcbiAgICB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9XHJcbiAgICB0aGlzLnN0b3JhZ2UgPSBHTV9nZXRWYWx1ZTxMb29zZU9iamVjdD4oa2V5LCBvcHRzLmRlZmF1bHRWYWx1ZSlcclxuICB9XHJcblxyXG4gIHN5bmMgKCkge1xyXG4gICAgR01fc2V0VmFsdWUodGhpcy5rZXksIHRoaXMuc3RvcmFnZSlcclxuXHJcbiAgICBpZiAodGhpcy5vcHRzLm9uU3luYykge1xyXG4gICAgICB0aGlzLm9wdHMub25TeW5jLmFwcGx5KHRoaXMpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQ8VCA9IFN0b3JhYmxlPiAoa2V5OiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBkb3RQcm9wLmdldDxUPih0aGlzLnN0b3JhZ2UsIGtleSkgfHwgZG90UHJvcC5nZXQ8VD4odGhpcy5vcHRzLmRlZmF1bHRWYWx1ZSwga2V5KVxyXG4gIH1cclxuXHJcbiAgc2V0IChrZXk6IHN0cmluZywgdmFsdWU6IFN0b3JhYmxlKSB7XHJcbiAgICBkb3RQcm9wLnNldCh0aGlzLnN0b3JhZ2UsIGtleSwgdmFsdWUpXHJcbiAgICB0aGlzLnN5bmMoKVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0ICgpIHtcclxuICAgIHJldHVybiB0aGlzLnN0b3JhZ2VcclxuICB9XHJcblxyXG4gIGltcG9ydCAodmFsdWU6IExvb3NlT2JqZWN0KSB7XHJcbiAgICB0aGlzLnN0b3JhZ2UgPSB2YWx1ZVxyXG4gICAgdGhpcy5zeW5jKClcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHFzIGZyb20gJ3F1ZXJ5LXN0cmluZydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50PFQgPSBIVE1MRWxlbWVudD4gKGh0bWw6IHN0cmluZykge1xyXG4gIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKVxyXG4gIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWwudHJpbSgpXHJcbiAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZCBhcyB1bmtub3duIGFzIFRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcmFtZXRlciAoa2V5OiBzdHJpbmcpIHtcclxuICBjb25zdCBwYXJhbXMgPSBxcy5wYXJzZShsb2NhdGlvbi5zZWFyY2gpXHJcbiAgcmV0dXJuIHBhcmFtc1trZXldIGFzIHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQk9EWV9QQVRURVJOID0gLyg/PGJvZHk+PGJvZHlbXj5dKj4oKC58W1xcblxccl0pKik8XFwvYm9keT4pL2ltXHJcbiIsImltcG9ydCBwTGltaXQgZnJvbSAncC1saW1pdCdcclxuaW1wb3J0IHsgdHJ5QW5kV2FpdEZvclRoZUVsZW1lbnQgfSBmcm9tICd3YWl0LWZvci10aGUtZWxlbWVudCdcclxuXHJcbmltcG9ydCBjb21wb25lbnRQcmV2aWV3IGZyb20gJy4vY29tcG9uZW50cy9wcmV2aWV3J1xyXG5pbXBvcnQgY29tcG9uZW50U3R5bGUgZnJvbSAnLi9jb21wb25lbnRzL3N0eWxlJ1xyXG5pbXBvcnQgY2FjaGUgZnJvbSAnLi9pbmNsdWRlcy9jYWNoZSdcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2luY2x1ZGVzL2NvbmZpZydcclxuaW1wb3J0IHsgZmV0Y2hMaXN0IH0gZnJvbSAnLi9pbmNsdWRlcy9yZXF1ZXN0J1xyXG5pbXBvcnQgeyBnZXRQYXJhbWV0ZXIgfSBmcm9tICcuL2luY2x1ZGVzL3V0aWxzJ1xyXG5cclxuY29uc3QgZ2FsbGVyeSA9IGdldFBhcmFtZXRlcignaWQnKVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gbWFpbiAoKSB7XHJcbiAgLy8g7ISk7KCVIOunnuy2lOq4sFxyXG4gIGNvbmZpZy5zeW5jKClcclxuXHJcbiAgLy8g7JWx7JeQ7IScIOyCrOyaqe2VoCDsmpTshozsmYAg7Iqk7YOA7J28IOyLnO2KuCDstpTqsIDtlZjquLBcclxuICBjb21wb25lbnRTdHlsZS5vbkNyZWF0ZSgpXHJcbiAgY29tcG9uZW50UHJldmlldy5vbkNyZWF0ZSgpXHJcblxyXG4gIGNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcja3MtcHJldmlldycpIGFzIEhUTUxFbGVtZW50XHJcblxyXG4gIGZ1bmN0aW9uIG9uTW91c2VFdmVudCAoZTogTW91c2VFdmVudCkge1xyXG4gICAgbGV0IGVsID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcclxuXHJcbiAgICAvLyDqsozsi5zquIAg66qp66GdIOyalOyGjOyduOyngCDtmZXsnbjtlZjquLBcclxuICAgIHdoaWxlIChlbCAhPT0gbnVsbCkge1xyXG4gICAgICAvLyDtlITrpqzrt7Ag6rCd7LK0652866m0IO2UhOumrOu3sCDrsJXsiqQg64K07JeQ7IScIOyKpO2BrOuhpCDtlbTslbztlZjrr4DroZwg66y07Iuc7ZWY6riwXHJcbiAgICAgIGlmIChlbCA9PT0gcHJldmlldykge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgna3MtcHJldmVudC1zY3JvbGxpbmcnKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdrcy1wcmV2ZW50LXNjcm9sbGluZycpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlbC5jbGFzc0xpc3QgJiYgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd1cy1wb3N0JykpIHtcclxuICAgICAgICBicmVha1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbCA9IGVsLnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnRcclxuICAgIH1cclxuICBcclxuICAgIGlmIChlbCkge1xyXG4gICAgICBjb25zdCBubyA9IHBhcnNlSW50KGVsLmRhdGFzZXQubm8sIDEwKVxyXG5cclxuICAgICAgLy8g7ZiE7J6sIO2UhOumrOu3sOqwgCDshKDtg53tlZwg6rKM7Iuc6riA7J20IOyVhOuLiOudvOuptCDsl4XrjbDsnbTtirjtlZjquLBcclxuICAgICAgaWYgKGNhY2hlLmhhcyhubykgJiYgcHJldmlldy5kYXRhc2V0Lm5vICE9PSBlbC5kYXRhc2V0Lm5vKSB7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcclxuICAgICAgICBjb25zdCBjbGllbnRUb3AgPSBkb2N1bWVudC5ib2R5LmNsaWVudFRvcCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50VG9wIHx8IDBcclxuXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgY29uc3QgdG9wID0gcmVjdC50b3AgKyBzY3JvbGxUb3AgLSBjbGllbnRUb3BcclxuXHJcbiAgICAgICAgcHJldmlldy5zdHlsZS50b3AgPSBgJHt0b3B9cHhgXHJcbiAgICAgICAgcHJldmlldy5zdHlsZS5sZWZ0ID0gYCR7ZS5wYWdlWCArIDI1fXB4YFxyXG4gICAgICAgIHByZXZpZXcuZGF0YXNldC5ubyA9IGVsLmRhdGFzZXQubm9cclxuICAgICAgICBwcmV2aWV3LmlubmVySFRNTCA9IGNhY2hlLmdldChubykuaW5uZXJIVE1MXHJcbiAgICAgICAgcHJldmlldy5jbGFzc0xpc3QuYWRkKCdrcy1hY3RpdmUnKVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpbWcgb2YgcHJldmlldy5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKSkge1xyXG4gICAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2tzLWFjdGl2ZScpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8g7ZSE66as67ewIOuwleyKpCDstIjquLDtmZRcclxuICAgICAgcHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKCdrcy1hY3RpdmUnKVxyXG4gICAgICBwcmV2aWV3LmlubmVySFRNTCA9ICcnXHJcbiAgICAgIGRlbGV0ZSBwcmV2aWV3LmRhdGFzZXQubm9cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRvY3VtZW50LmJvZHkucHJlcGVuZChwcmV2aWV3KVxyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlRXZlbnQpXHJcbiAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIG9uTW91c2VFdmVudClcclxuICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIG9uTW91c2VFdmVudCkgLy8gZm9yIG91ciBmaXJlZm94IGZyaWVuZHMgOilcclxuXHJcbiAgY29uc3QgcHJvbWlzZXMgPSBbXVxyXG4gIGNvbnN0IGxpbWl0ID0gcExpbWl0KDEwKVxyXG5cclxuICBmb3IgKGxldCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignLnVzLXBvc3QnKSkge1xyXG4gICAgLy8g67KI7Zi4IOyXhuuKlCDquIDsnYAg66y07Iuc7ZWY6riwXHJcbiAgICBpZiAoIWVsLmRhdGFzZXQubm8pIHtcclxuICAgICAgY29uc29sZS5sb2coZWwpXHJcbiAgICAgIGNvbnRpbnVlXHJcbiAgICB9XHJcblxyXG4gICAgLy8g6rO17KeAIOqyjOyLnOq4gOydgCDrrLTsi5ztlZjquLBcclxuICAgIGlmIChlbC5kYXRhc2V0LnR5cGUgPT09ICdpY29uX25vdGljZScpIHtcclxuICAgICAgY29udGludWVcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBubyA9IHBhcnNlSW50KGVsLmRhdGFzZXQubm8sIDEwKVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHByb21pc2UgPSBsaW1pdCgoKSA9PiBjYWNoZS5mZXRjaFBvc3QoZ2FsbGVyeSwgbm8pKVxyXG4gICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIO2YhOyerCDrtojrn6zsmKgg6rKM7Iuc6riAIOyghOyytCDsupDsi7HtlZjquLBcclxuICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcclxuXHJcbiAgLy8g6rKM7Iuc6riAIOyLpOyLnOqwhCDsl4XrjbDsnbTtirgg7Iuc7J6R7ZWY6riwXHJcbiAgc2V0SW50ZXJ2YWwoKCkgPT4gZmV0Y2hMaXN0KGdhbGxlcnkpLCAxMDAwKVxyXG59XHJcblxyXG4vLyDstZzsg4Hri6gg7Y6Y7J207KeA7JeQ7ISc66eMIOyKpO2BrOumve2KuCDsi6TtlontlZjquLBcclxuaWYgKHdpbmRvdy50b3AgPT09IHdpbmRvdy5zZWxmKSB7XHJcblxyXG4gIC8vIOqwpOufrOumrCDthYzsnbTruJQg7JqU7IaMIOuMgOq4sCDtm4QgbWFpbigpIOyLpO2Wie2VmOq4sFxyXG4gIHRyeUFuZFdhaXRGb3JUaGVFbGVtZW50KCcuY29weXJpZ2h0JylcclxuICAgIC5jYXRjaCgoKSA9PiBjb25zb2xlLmVycm9yKCftjpjsnbTsp4Dsl5DshJwg6rKM7Iuc6riAIO2FjOydtOu4lCDsmpTshozrpbwg67aI65+s7JisIOyImCDsl4bsirXri4jri6QnKSlcclxuICAgIC50aGVuKCgpID0+IG1haW4oKSlcclxuICAgIC5jYXRjaChjb25zb2xlLmVycm9yKVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=