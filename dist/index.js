'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lodash = require('lodash');

const namespace = '__ARSNL__';

const App = class App {
    constructor(config){
        this.metadata = config.metadata || {};
        this.title = config.title || '';
        this.id = config.id;
        this.component = config.component;
        this.router = config.router || console.error('ARSNL Error: router not found!');
        this.globalize();
        this.renderApp();
    }
    globalize () {
        window[namespace] = this;
    }
    getRootElement() {
        return document.getElementById(this.id)
    }
    renderApp () {
        this.getRootElement()
            .append(this.component(this));
    }
    renderRoutes () {
        return this.router.render()
    }
};

class EventManager {
    constructor () {
        this.listeners = [];
        this.changeCount = 0;
    }
    addListener (fn) {
        this.listeners.push(fn);
    }
    removeListener (fn) {
        lodash.remove(this.listeners, (listener) => listener === fn);
    }
    onChange (key, value) {
        this.listeners.forEach(fn => {
            fn(key, value);
            this.changeCount = this.changeCount + 1;
        });
    }
}

const subscribe = (state, fn) => (
    state[namespace].addListener(fn)
);

var createProxy = (object, onChange) => {
    if (lodash.isFunction(onChange)) {
        subscribe(object, onChange);
    }
    return (
        new Proxy(object, {
            set: (target, key, value) => {
                if (target[key] !== value) {
                    target[key] = value;
                    object[namespace].onChange(key, value);
                }
                return true
            },
        })
    )
};

const extract = (state) => (
    lodash.omit(state, [namespace])
);

const State = (object={}, onChange) => {
    object[namespace] = new EventManager();
    return createProxy(object, onChange)
};

const xmlns = "http://www.w3.org/2000/svg";

var createElement = config => {
    let tag = config.tag;

    if (!lodash.isObject(config)) {
        return document.createDocumentFragment()
    }
    if (lodash.isString(tag)) {
        tag = tag.toLowerCase();
        if (tag === 'comment') {
            return document.createComment(config.render || '')
        }
        if (tag.includes('svg')) {
            return document.createElementNS(xmlns, tag.replace('svg:', ''))
        }
    }
    return document.createElement(tag || 'div')
};

var isDomNode = obj => obj.nodeType === 1;

var isElement = obj => {
    try {
        const isHtml = obj instanceof HTMLElement;
        const isComment = obj instanceof Comment;
        const isSvg = obj instanceof SVGElement;
        return isSvg || isHtml || isComment
    }
    catch(e){
        return lodash.isObject(obj)
            && isDomNode(obj)
            && lodash.isObject(obj.style)
            && lodash.isObject(obj.ownerDocument)
    }
};

var isState = (obj={}) => lodash.isObject(obj[namespace]);

const append = (target, appendage) => {
    if (lodash.isFunction(target.append)) {
        target.append(appendage);
    }
};

const renderArray = (el, contents) => {
    for (var i = 0; i < contents.length; i++) {
        render(el, contents[i]);
    }
};

const renderStateObject = (el, contents) => {
    const firstProperty = Object.keys(contents)[0];
    let child = document.createTextNode(lodash.get(contents, firstProperty, ''));
    subscribe(contents, (key, value) => {
        child.replaceData(0, child.length, value);
    });
    el.append(child);
};

const renderString = (el, contents) => {
    const child = document.createTextNode(contents);
    append(el, child);
};

const render = (el, contents) => {
    if (contents instanceof SVGElement) {
        return el.appendChild(contents)
    }
    if (isElement(contents)) {
        return append(el, contents)
    }
    if (lodash.isArray(contents)) {
        return renderArray(el, contents)
    }
    if (lodash.isObject(contents) && isState(contents)){
        return renderStateObject(el, contents)
    }
    if (lodash.isNumber(contents) || lodash.isString(contents)) {
        return renderString(el, contents)
    }
};

const setContents = (el, config) => {
    if (config.dangerouslySetInnerHtml || config.dangerouslySetInnerHTML) {
        el.innerHTML = config.dangerouslySetInnerHtml || config.dangerouslySetInnerHTML;
    } else {
        const contents = config.render || '';
        el.innerHTML = '';
        render(el, contents);
    }
};

var waitForRender = (fn, w=10) => setTimeout(fn, w);

var setStyle = (el, config) => {
    const style = config.style;

    const setProperty = (key, value) => {
        waitForRender(() => {
            if (key !== namespace) {
                el.style[key] = value;
            }
        });
    };

    if (lodash.isObject(style)) {
        if (isState(style)) {
            subscribe(style, (key, value) => {
                setProperty(key, value);
            });
        }
        Object.keys(style).forEach((key) => {
            setProperty(key, style[key]);
        });
    }
};

const INTERNAL_ATTRIBUTES = [
    namespace,
    'style',
    'tag',
    'render',
    'onLoad',
    'dangerouslysetinnerhtml',
    'dangerouslySetInnerHtml',
    'dangerouslySetInnerHTML',
];

const isSameFn = (a, b) => (
    lodash.isFunction(a)
    && lodash.isFunction(b)
    && a.toString() === b.toString()
);

var setRest = (el, config) => {
    lodash.forEach(config, (value, key) => {
        if (!lodash.includes(INTERNAL_ATTRIBUTES, key)) {
            const lcKey = key.toLowerCase();
            if (isSameFn(el[key], value) || isSameFn(el[lcKey], value)) {
                return
            }
            if (el[lcKey] === null) {
                el[lcKey] = value;
                return
            }
            if (el[key] === null) {
                el[key] = value;
                return
            }
            if (value === null) {
              el.removeAttribute(key);
              return
            }
            el.setAttribute(key, value);
        }
    });
};

const isConfig = args => (
    (
        !lodash.isUndefined(args)
        && !lodash.isNull(args)
        && !lodash.isString(args)
        && lodash.isObject(args)
        && !lodash.isArray(args)
        && !isDomNode(args)
    ) || (
        lodash.isFunction(args)
        && isConfig(args())
    )
);

const resolveConfig = (config) => (
    lodash.isFunction(config)
        ? config()
        : config
);

const render$1 = (el, config) => {
    setRest(el, config);
    setContents(el, config);
    setStyle(el, config);
    return el
};

const getNode = (config) => {
    const resolvedConfig = resolveConfig(config);
    const el = createElement(resolvedConfig);
    return render$1(el, resolvedConfig)
};

const handleOnLoad = (el, config) => {
    const resolvedConfig = resolveConfig(config);
    if (lodash.isFunction(resolvedConfig.onLoad)) {
        waitForRender(() => {
            resolvedConfig.onLoad(el);
        });
    }
};

const watchStates = (el, config, states) => {
    states.forEach((state) => {
        subscribe(state, () => {
            const resolvedConfig = resolveConfig(config);
            el = render$1(el, resolvedConfig);
        });
    });
};

const DomNode = (config={}, states=[]) => {
    const el = getNode(config);
    handleOnLoad(el, config);
    watchStates(el, config, states);
    return el
};

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at " + i);
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at " + j);
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at " + j);
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at " + i);
            if (!pattern)
                throw new TypeError("Missing pattern at " + i);
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
    };
    var consumeText = function () {
        var result = "";
        var value;
        // tslint:disable-next-line
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Create path match function from `path-to-regexp` spec.
 */
function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
}
/**
 * Create a path match function from `path-to-regexp` output.
 */
function regexpToFunction(re, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.decode, decode = _a === void 0 ? function (x) { return x; } : _a;
    return function (pathname) {
        var m = re.exec(pathname);
        if (!m)
            return false;
        var path = m[0], index = m.index;
        var params = Object.create(null);
        var _loop_1 = function (i) {
            // tslint:disable-next-line
            if (m[i] === undefined)
                return "continue";
            var key = keys[i - 1];
            if (key.modifier === "*" || key.modifier === "+") {
                params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
                    return decode(value, key);
                });
            }
            else {
                params[key.name] = decode(m[i], key);
            }
        };
        for (var i = 1; i < m.length; i++) {
            _loop_1(i);
        }
        return { path: path, index: index, params: params };
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}
/**
 * Pull out keys from a regexp.
 */
function regexpToRegexp(path, keys) {
    if (!keys)
        return path;
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);
    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
        }
    }
    return path;
}
/**
 * Transform an array into a regexp.
 */
function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
}
/**
 * Create a path regexp from string input.
 */
function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 */
function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
    var route = start ? "^" : "";
    // Iterate over the tokens and create our regexp string.
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (typeof token === "string") {
            route += escapeString(encode(token));
        }
        else {
            var prefix = escapeString(encode(token.prefix));
            var suffix = escapeString(encode(token.suffix));
            if (token.pattern) {
                if (keys)
                    keys.push(token);
                if (prefix || suffix) {
                    if (token.modifier === "+" || token.modifier === "*") {
                        var mod = token.modifier === "*" ? "?" : "";
                        route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                    }
                    else {
                        route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                    }
                }
                else {
                    route += "(" + token.pattern + ")" + token.modifier;
                }
            }
            else {
                route += "(?:" + prefix + suffix + ")" + token.modifier;
            }
        }
    }
    if (end) {
        if (!strict)
            route += delimiter + "?";
        route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
    }
    else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === "string"
            ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
            : // tslint:disable-next-line
                endToken === undefined;
        if (!strict) {
            route += "(?:" + delimiter + "(?=" + endsWith + "))?";
        }
        if (!isEndDelimited) {
            route += "(?=" + delimiter + "|" + endsWith + ")";
        }
    }
    return new RegExp(route, flags(options));
}
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp)
        return regexpToRegexp(path, keys);
    if (Array.isArray(path))
        return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
}

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
var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
function stringifyPrimitive(v) {
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
}

function stringify (obj, sep, eq, name) {
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
}
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

function parse$1(qs, sep, eq, options) {
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
}var querystring = {
  encode: stringify,
  stringify: stringify,
  decode: parse$1,
  parse: parse$1
};

var qs = {
    parse: (search) => {
        search = search.replace(/^\?/, '');
        return querystring.parse(search)
    },
    stringify: obj => {
        return querystring.stringify(lodash.omitBy(obj, lodash.isUndefined))
    }
};

const getApp = () => lodash.get(window, namespace);
const getRouter = () => getApp().router;

const generateId = () => Math.random().toString(36).substr(2, 9);

var routerEvents = new EventManager();

const navigate = (path, routerEvents$1=routerEvents) => {
    window.history.pushState({path}, document.title, `${window.location.origin}${path}`);
    routerEvents$1.onChange();
};

var getRedirectHandler = routerEvents => (
    path => (
        waitForRender(() => {
            navigate(path, routerEvents);
        })
    )
);

const Link = ({ path, tag='a', ...rest }) => (
    DomNode({
        ...rest,
        tag,
        href: path || rest.href,
        onclick: e => {
            if (lodash.isString(path)) {
                e.preventDefault();
                navigate(path);
            }
        },
    })
);

const EmptyRoute = () => '';

const PAGE_NOT_FOUND = '/404';

class Router {
    constructor (routes, options = {}) {
        this.routes = routes || {};
        this.className = `arsnl-router-${generateId()}`;
        this.route = State({
            current: {
                params: {},
                component: this.get404(),
            },
        });
        this.onInit = options.onInit || lodash.noop;
        this.onBeforeRouteRender = options.onBeforeRouteRender || lodash.noop;
        this.onAfterRouteRender = options.onAfterRouteRender || lodash.noop;
        this.handleListeners();
        this.setRoute();
        this.subscribeToStateChanges();
        this.onInit();
    }
    subscribeToStateChanges () {
        window.addEventListener("popstate", () => {
            window.location.pathname = window.location.pathname; // eslint-disable-line
        });
    }
    handleListeners () {
        this.is = State({ listening: false });
        this.listener = () => {
            this.isRendered()
                ? this.setRoute()
                : this.is.listening = false;
        };
        subscribe(this.is, (key, value) => {
            value
                ? routerEvents.addListener(this.listener)
                : routerEvents.removeListener(this.listener);
        });
    }
    isRendered () {
        return !lodash.isNull(document.querySelector(`.${this.className}`))
    }
    findRoute (path) {
        const output = {};
        Object.keys(this.routes)
            .forEach((current) => {
                const matched = match(current, {
                    decode: decodeURIComponent
                })(path);
                if (matched) {
                    output.found = current;
                    output.params = matched.params;
                }
            });
        return output
    }
    get404 () {
        return lodash.get(this.routes, PAGE_NOT_FOUND, EmptyRoute)
    }
    setRoute () {
        const path = window.location.pathname;
        const { found, params } = this.findRoute(path);
        if (lodash.isFunction(this.onBeforeRouteRender)) {
            this.onBeforeRouteRender();
        }
        if (lodash.isFunction(this.onAfterRouteRender)) {
            waitForRender(() => this.onAfterRouteRender());
        }
        if (found) {
            this.route.current = {
                path,
                parts: path.split('/'),
                params,
                component: this.routes[found],
            };
        } else {
            this.route.current = {
                path,
                parts: path.split('/'),
                params,
                component: this.get404(),
            };
        }
    }
    setTitle (str) {
        const title = lodash.reject([getApp().title, str], lodash.isEmpty).join(' | ');
        document.title = title;
    }
    render () {
        return DomNode(() => {
            if (!this.is.listening) {
                this.is.listening = true;
            }
            return {
                class: this.className,
                render: this.route.current.component({
                    setTitle: str => this.setTitle(str),
                    params: this.route.current.params,
                    search: qs.parse(window.location.search),
                    redirect: getRedirectHandler(routerEvents),
                }),
            }
        }, [ this.route ])
    }
}

const build = tag => (
    (configOrRender, configOrTrackers) => {
        if (isConfig(configOrRender)) {
            return DomNode(() => {
                const {disabled, ...rest} = resolveConfig(configOrRender);
                const props = {
                    ...rest,
                    tag
                };
                if (disabled === true) {
                  props.disabled = true;
                }
                return props
            }, configOrTrackers)
        }

        if (isConfig(configOrTrackers)) {
            const {disabled, ...rest} = resolveConfig(configOrTrackers);
            const props = {
                ...rest,
                render: configOrRender,
                tag
            };
            if (disabled === true) {
              props.disabled = true;
            }
            return DomNode(props)
        }

        return DomNode({
            render: configOrRender,
            tag
        })
    }
);
const a =           build('a');
const abbr =        build('abbr');
const address =     build('address');
const area =        build('area');
const article =     build('article');
const aside =       build('aside');
const audio =       build('audio');
const b =           build('b');
const base =        build('base');
const bdi =         build('bdi');
const bdo =         build('bdo');
const blockquote =  build('blockquote');
const body =        build('body');
const br =          build('br');
const button =      build('button');
const canvas =      build('canvas');
const caption =     build('caption');
const cite =        build('cite');
const code =        build('code');
const col =         build('col');
const colgroup =    build('colgroup');
const command =     build('command');
const comment =     build('comment');
const datalist =    build('datalist');
const dd =          build('dd');
const del =         build('del');
const details =     build('details');
const dfn =         build('dfn');
const div =         build('div');
const dl =          build('dl');
const dt =          build('dt');
const em =          build('em');
const embed =       build('embed');
const fieldset =    build('fieldset');
const figcaption =  build('figcaption');
const figure =      build('figure');
const footer =      build('footer');
const form =        build('form');
const h1 =          build('h1');
const h2 =          build('h2');
const h3 =          build('h3');
const h4 =          build('h4');
const h5 =          build('h5');
const h6 =          build('h6');
const head =        build('head');
const header =      build('header');
const hgroup =      build('hgroup');
const hr =          build('hr');
const html =        build('html');
const i =           build('i');
const iframe =      build('iframe');
const img =         build('img');
const input =       build('input');
const ins =         build('ins');
const kbd =         build('kbd');
const keygen =      build('keygen');
const label =       build('label');
const legend =      build('legend');
const li =          build('li');
const link =        build('link');
const map$1 =         build('map');
const mark =        build('mark');
const menu =        build('menu');
const meta =        build('meta');
const meter =       build('meter');
const nav =         build('nav');
const noscript =    build('noscript');
const object =      build('object');
const ol =          build('ol');
const optgroup =    build('optgroup');
const option =      build('option');
const output =      build('output');
const p =           build('p');
const path =        build('svg:path');
const param =       build('param');
const pre =         build('pre');
const progress =    build('progress');
const q =           build('q');
const rp =          build('rp');
const rt =          build('rt');
const ruby =        build('ruby');
const s =           build('s');
const samp =        build('samp');
const script =      build('script');
const section =     build('section');
const select =      build('select');
const small =       build('small');
const source =      build('source');
const span =        build('span');
const strong =      build('strong');
const style =       build('style');
const sub =         build('sub');
const summary =     build('summary');
const sup =         build('sup');
// svg moved to bottom
const table =       build('table');
const tbody =       build('tbody');
const td =          build('td');
const textarea =    build('textarea');
const tfoot =       build('tfoot');
const th =          build('th');
const thead =       build('thead');
const time =        build('time');
const title =       build('title');
const tr =          build('tr');
const track =       build('track');
const u =           build('u');
const ul =          build('ul');
const _var =        build('var');
const video =       build('video');
const wbr =         build('wbr');

const svg = (...args) => {
    if (args.length < 3 && lodash.isString(args[0])) {
        const additionalProps = args[1];
        const htmlStr = args[0];
        const props = {};
        const attributes = htmlStr.match(/<svg [^>]+>/g)[0].match(/([a-zA-Z\-\:]+)="([a-zA-Z\d\.\_\s\;\-\:\/]+)"/g); // eslint-disable-line
        const middle = htmlStr.replace(/(<svg [^>]+>)|(<\/svg>)/g, '');
        for (var i = 0; i < attributes.length; i++) {
            const attr = attributes[i].split('=');
            props[attr[0]] = attr[1].replace(/"/g, '');
        }
        const el = build('svg')({
            preserveAspectRatio: "xMidYMid meet",
            viewBox: '0 0 32 32',
            ...props,
            ...additionalProps,
            dangerouslySetInnerHTML: middle
        });
        return el
    }
    return build('svg')(...args)
};

exports.App = App;
exports.DomNode = DomNode;
exports.Link = Link;
exports.Router = Router;
exports.State = State;
exports._var = _var;
exports.a = a;
exports.abbr = abbr;
exports.address = address;
exports.area = area;
exports.article = article;
exports.aside = aside;
exports.audio = audio;
exports.b = b;
exports.base = base;
exports.bdi = bdi;
exports.bdo = bdo;
exports.blockquote = blockquote;
exports.body = body;
exports.br = br;
exports.button = button;
exports.canvas = canvas;
exports.caption = caption;
exports.cite = cite;
exports.code = code;
exports.col = col;
exports.colgroup = colgroup;
exports.command = command;
exports.comment = comment;
exports.datalist = datalist;
exports.dd = dd;
exports.del = del;
exports.details = details;
exports.dfn = dfn;
exports.div = div;
exports.dl = dl;
exports.dt = dt;
exports.em = em;
exports.embed = embed;
exports.extract = extract;
exports.fieldset = fieldset;
exports.figcaption = figcaption;
exports.figure = figure;
exports.footer = footer;
exports.form = form;
exports.getApp = getApp;
exports.getRouter = getRouter;
exports.h1 = h1;
exports.h2 = h2;
exports.h3 = h3;
exports.h4 = h4;
exports.h5 = h5;
exports.h6 = h6;
exports.head = head;
exports.header = header;
exports.hgroup = hgroup;
exports.hr = hr;
exports.html = html;
exports.i = i;
exports.iframe = iframe;
exports.img = img;
exports.input = input;
exports.ins = ins;
exports.isConfig = isConfig;
exports.isDomNode = isDomNode;
exports.kbd = kbd;
exports.keygen = keygen;
exports.label = label;
exports.legend = legend;
exports.li = li;
exports.link = link;
exports.map = map$1;
exports.mark = mark;
exports.menu = menu;
exports.meta = meta;
exports.meter = meter;
exports.namespace = namespace;
exports.nav = nav;
exports.navigate = navigate;
exports.noscript = noscript;
exports.object = object;
exports.ol = ol;
exports.optgroup = optgroup;
exports.option = option;
exports.output = output;
exports.p = p;
exports.param = param;
exports.path = path;
exports.pre = pre;
exports.progress = progress;
exports.q = q;
exports.resolveConfig = resolveConfig;
exports.rp = rp;
exports.rt = rt;
exports.ruby = ruby;
exports.s = s;
exports.samp = samp;
exports.script = script;
exports.section = section;
exports.select = select;
exports.small = small;
exports.source = source;
exports.span = span;
exports.strong = strong;
exports.style = style;
exports.sub = sub;
exports.subscribe = subscribe;
exports.summary = summary;
exports.sup = sup;
exports.svg = svg;
exports.table = table;
exports.tbody = tbody;
exports.td = td;
exports.textarea = textarea;
exports.tfoot = tfoot;
exports.th = th;
exports.thead = thead;
exports.time = time;
exports.title = title;
exports.tr = tr;
exports.track = track;
exports.u = u;
exports.ul = ul;
exports.video = video;
exports.waitForRender = waitForRender;
exports.wbr = wbr;
