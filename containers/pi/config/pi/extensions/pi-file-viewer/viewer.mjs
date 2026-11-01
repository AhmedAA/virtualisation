import { createRequire as __piCreateRequire } from "node:module"; const require = __piCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a, b2) => (typeof require !== "undefined" ? require : a)[b2]
}) : x2)(function(x2) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
    var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
    var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
    var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
    var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
    var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
    var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path) {
      const ctrl = callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visit_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = visit_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path) {
      const ctrl = await callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visitAsync_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path) {
      if (typeof visitor === "function")
        return visitor(key, node, path);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
      return void 0;
    }
    function replaceNode(key, path, node) {
      const parent = path[path.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt2 = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt2} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k2 of Array.from(val.keys())) {
            const v0 = val.get(k2);
            const v1 = applyReviver(reviver, val, k2, v0);
            if (v1 === void 0)
              val.delete(k2);
            else if (v1 !== v0)
              val.set(k2, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k2, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k2, v0);
            if (v1 === void 0)
              delete val[k2];
            else if (v1 !== v0)
              val[k2] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v2, i) => toJS(v2, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        if (found && ctx) {
          const { anchors: anchors2, doc: doc2, maxAliasCount } = ctx;
          let data = anchors2.get(found);
          if (!data) {
            toJS.toJS(found, null, ctx);
            data = anchors2.get(found);
          }
          if (data?.res === void 0) {
            const msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
              data.aliasCount = getAliasCount(doc2, found, anchors2);
            if (data.count * data.aliasCount > maxAliasCount) {
              const msg = "Excessive alias count indicates a resource exhaustion attack";
              throw new ReferenceError(msg);
            }
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const source = this.resolve(ctx.doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path, value) {
      let v2 = value;
      for (let i = path.length - 1; i >= 0; --i) {
        const k2 = path[i];
        if (typeof k2 === "number" && Number.isInteger(k2) && k2 >= 0) {
          const a = [];
          a[k2] = v2;
          v2 = a;
        } else {
          v2 = /* @__PURE__ */ new Map([[k2, v2]]);
        }
      }
      return createNode.createNode(v2, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it2) => identity.isNode(it2) || identity.isPair(it2) ? it2.clone(schema) : it2);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path, value) {
        if (isEmptyPath(path))
          this.add(value);
        else {
          const [key, ...rest] = path;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j2 = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j2])
                return text;
              folds.push(j2);
              escapedFolds[j2] = true;
              end = j2 + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it2 of source.items)
          mergeValue(ctx, map, it2);
      else if (Array.isArray(source))
        for (const it2 of source)
          mergeValue(ctx, map, it2);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k2 = createNode.createNode(key, void 0, ctx);
      const v2 = createNode.createNode(value, void 0, ctx);
      return new Pair(k2, v2);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_2, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k2 = identity.isScalar(key) ? key.value : key;
      for (const it2 of items) {
        if (identity.isPair(it2)) {
          if (it2.key === key || it2.key === k2)
            return it2;
          if (identity.isScalar(it2.key) && it2.key.value === k2)
            return it2;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it2 = findPair(this.items, key);
        if (!it2)
          return false;
        const del = this.items.splice(this.items.indexOf(it2), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it2 = findPair(this.items, key);
        const node = it2?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_2, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it2 = this.items[idx];
        return !keepScalar && identity.isScalar(it2) ? it2.value : it2;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_2, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it2 of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it2 : String(i++);
              it2 = replacer.call(obj, key, it2);
            }
            seq.items.push(createNode.createNode(it2, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it2 of iterable) {
          if (typeof replacer === "function")
            it2 = replacer.call(iterable, String(i++), it2);
          let key, value;
          if (Array.isArray(it2)) {
            if (it2.length === 2) {
              key = it2[0];
              value = it2[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it2}`);
          } else if (it2 && it2 instanceof Object) {
            const keys = Object.keys(it2);
            if (keys.length === 1) {
              key = keys[0];
              value = it2[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it2;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_2, ctx) {
        if (!ctx)
          return super.toJSON(_2);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f2 = str.substring(dot + 1).replace(/_/g, "");
          if (f2[f2.length - 1] === "0")
            node.minFractionDigits = f2.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_2, ctx) {
        return super.toJSON(_2, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b2) => a.key < b2.key ? -1 : a.key > b2.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v2) => typeof v2 === "number" || v2 instanceof String || v2 instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k2 = this.createNode(key, null, options);
        const v2 = this.createNode(value, null, options);
        return new Pair.Pair(k2, v2);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path) {
        if (Collection.isEmptyPath(path))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        if (Collection.isEmptyPath(path)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st2 of key.end)
              if (st2.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it2 of key.items) {
            for (const st2 of it2.start)
              if (st2.type === "newline")
                return true;
            if (it2.sep) {
              for (const st2 of it2.sep)
                if (st2.type === "newline")
                  return true;
            }
            if (containsNewline(it2.key) || containsNewline(it2.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b2) => a === b2 || identity.isScalar(a) && identity.isScalar(b2) && a.value === b2.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st2 of start) {
              switch (st2.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st2.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (const st2 of sep) {
                  if (st2 === valueProps.found)
                    break;
                  if (st2.type === "newline") {
                    onError(st2, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce2, ...ee2] = fc.end;
      let cePos = offset;
      if (ce2?.source === expectedEnd)
        cePos = ce2.offset + ce2.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce2 && ce2.source.length !== 1)
          ee2.unshift(ce2);
      }
      if (ee2.length > 0) {
        const end = resolveEnd.resolveEnd(ee2, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt2 = ctx.schema.knownTags[tagName];
        if (kt2?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt2, { default: false }));
          tag = kt2;
        } else {
          if (kt2) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt2.tag} used for ${expType} collection, but expects ${kt2.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m2 = first.match(/^( *)/);
      const line0 = m2?.[1] ? [m2[1], first.slice(m2[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      const line = /(.*?)\r?\n/sy;
      let match = line.exec(source);
      if (!match)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$");
        trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/;
        trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match[1].replace(trimEnd, "");
      let sep = " ";
      let pos = line.lastIndex;
      while (match = line.exec(source)) {
        const lm = match[1].replace(trimBoth, "");
        if (lm === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + lm;
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt2 = schema.knownTags[tagName];
      if (kt2 && !kt2.collection) {
        schema.tags.push(Object.assign({}, kt2, { default: false, test: void 0 }));
        return kt2;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st2 = before[i];
          switch (st2.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st2.source.length;
              continue;
          }
          st2 = before[++i];
          while (st2?.type === "space") {
            offset += st2.source.length;
            st2 = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it2 = dc.items[0];
            if (identity.isPair(it2))
              it2 = it2.key;
            const cb = it2.commentBefore;
            it2.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he2 = source.indexOf("\n");
          const head = source.substring(0, he2);
          const body = source.substring(he2 + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he2 = source.indexOf("\n");
      const head = source.substring(0, he2);
      const body = source.substring(he2 + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st2 of end)
          switch (st2.type) {
            case "space":
            case "comment":
              props.push(st2);
              break;
            case "newline":
              props.push(st2);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st2) => st2.type === "space" || st2.type === "comment" || st2.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st2 of token.end)
            res += st2.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st2 of token.end)
              res += st2.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st2 of token.end)
              res += st2.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (const st2 of start)
        res += st2.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st2 of sep)
          res += st2.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path) => {
      let item = cst;
      for (const [field, index] of path) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path) => {
      const parent = visit.itemAtPath(cst, path.slice(0, -1));
      const field = path[path.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path, item, visitor) {
      let ctrl = visitor(item, path);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt2 = this.buffer.substr(offset, 3);
          if ((dt2 === "---" || dt2 === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it2 = parent.items[parent.items.length - 1];
          return it2.sep ?? it2.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it2 of fc.items) {
          if (it2.sep && !it2.value && !includesToken(it2.start, "explicit-key-ind") && !includesToken(it2.sep, "map-value-ind")) {
            if (it2.key)
              it2.value = it2.key;
            delete it2.key;
            if (isFlowToken(it2.value)) {
              if (it2.value.end)
                arrayPushArray(it2.value.end, it2.sep);
              else
                it2.value.end = it2.sep;
            } else
              arrayPushArray(it2.start, it2.sep);
            delete it2.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st2 = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st2;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it2 = top.items[top.items.length - 1];
              if (it2.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it2.sep) {
                it2.value = token;
              } else {
                Object.assign(it2, { key: token, sep: [] });
                this.onKeyLine = !it2.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it2 = top.items[top.items.length - 1];
              if (it2.value)
                top.items.push({ start: [], value: token });
              else
                it2.value = token;
              break;
            }
            case "flow-collection": {
              const it2 = top.items[top.items.length - 1];
              if (!it2 || it2.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it2.sep)
                it2.value = token;
              else
                Object.assign(it2, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st2) => st2.type !== "comment" || st2.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it2 = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it2.value) {
              const end = "end" in it2.value ? it2.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it2.sep) {
              it2.sep.push(this.sourceToken);
            } else {
              it2.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it2.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it2.sep) {
              it2.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it2.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it2.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it2.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it2.sep || it2.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it2.sep && !it2.value) {
            const nl = [];
            for (let i = 0; i < it2.sep.length; ++i) {
              const st2 = it2.sep[i];
              switch (st2.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st2.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it2.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it2.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it2.sep) {
                it2.sep.push(this.sourceToken);
              } else {
                it2.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it2.sep && !it2.explicitKey) {
                it2.start.push(this.sourceToken);
                it2.explicitKey = true;
              } else if (atNextItem || it2.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it2.explicitKey) {
                if (!it2.sep) {
                  if (includesToken(it2.start, "newline")) {
                    Object.assign(it2, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it2.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it2.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it2.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it2.key) && !includesToken(it2.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it2.start);
                  const key = it2.key;
                  const sep = it2.sep;
                  sep.push(this.sourceToken);
                  delete it2.key;
                  delete it2.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it2.sep = it2.sep.concat(start, this.sourceToken);
                } else {
                  it2.sep.push(this.sourceToken);
                }
              } else {
                if (!it2.sep) {
                  Object.assign(it2, { key: null, sep: [this.sourceToken] });
                } else if (it2.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it2.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it2.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it2.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it2.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it2, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it2.explicitKey && it2.sep && !includesToken(it2.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it2 = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it2.value) {
              const end = "end" in it2.value ? it2.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it2.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it2.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it2.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it2.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it2.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it2.value || this.indent <= seq.indent)
              break;
            it2.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it2.value || includesToken(it2.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it2.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it2 = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it2 || it2.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it2.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it2 || it2.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it2.sep)
                it2.sep.push(this.sourceToken);
              else
                Object.assign(it2, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it2 || it2.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it2.sep)
                it2.sep.push(this.sourceToken);
              else
                it2.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it2 || it2.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it2.sep)
                this.stack.push(fs);
              else
                Object.assign(it2, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st2) => st2.type === "newline" || st2.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// index.ts
import { open } from "node:fs/promises";
import { isAbsolute, resolve as resolve2 } from "node:path";

// node_modules/marked/lib/marked.esm.js
function A() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var R = A();
function j(l3) {
  R = l3;
}
var z = { exec: () => null };
function I(l3) {
  let e = [];
  return (t) => {
    let n = Math.max(0, Math.min(3, t - 1)), s = e[n];
    return s || (s = l3(n), e[n] = s), s;
  };
}
function k(l3, e = "") {
  let t = typeof l3 == "string" ? l3 : l3.source, n = { replace: (s, r) => {
    let i = typeof r == "string" ? r : r.source;
    return i = i.replace(m.caret, "$1"), t = t.replace(s, i), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var Oe = ((l3 = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + l3);
  } catch {
    return false;
  }
})();
var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (l3) => new RegExp(`^( {0,3}${l3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: I((l3) => new RegExp(`^ {0,${l3}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: I((l3) => new RegExp(`^ {0,${l3}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)), fencesBeginRegex: I((l3) => new RegExp(`^ {0,${l3}}(?:\`\`\`|~~~)`)), headingBeginRegex: I((l3) => new RegExp(`^ {0,${l3}}#`)), htmlBeginRegex: I((l3) => new RegExp(`^ {0,${l3}}<(?:[a-z].*>|!--)`, "i")), blockquoteBeginRegex: I((l3) => new RegExp(`^ {0,${l3}}>`)) };
var Te = /^(?:[ \t]*(?:\n|$))+/;
var we = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var ye = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var q = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var Pe = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var U = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
var oe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var ae = k(oe).replace(/bull/g, U).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var Se = k(oe).replace(/bull/g, U).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var K = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/;
var _e = /^[^\n]+/;
var W = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var $e = k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", W).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var Le = k(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, U).getRegex();
var Q = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var X = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var Ee = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", X).replace("tag", Q).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var le = (l3) => k(K).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", l3).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex();
var ze = le(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/);
var Me = le(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/);
var Ae = k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Me).getRegex();
var J = { blockquote: Ae, code: we, def: $e, fences: ye, heading: Pe, hr: q, html: Ee, lheading: ae, list: Le, newline: Te, paragraph: ze, table: z, text: _e };
var se = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex();
var Ie = { ...J, lheading: Se, table: se, paragraph: k(K).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex() };
var Ce = { ...J, html: k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", X).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: z, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k(K).replace("hr", q).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ae).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var Be = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var De = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var ue = /^( {2,}|\\)\n(?!\s*$)/;
var qe = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var _ = /[\p{P}\p{S}]/u;
var C = /[\s\p{P}\p{S}]/u;
var v = /[^\s\p{P}\p{S}]/u;
var ve = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, C).getRegex();
var He = /[\p{Pi}\p{Ps}"']/u;
var pe = /(?!~)[\p{P}\p{S}]/u;
var Ze = /(?!~)[\s\p{P}\p{S}]/u;
var Ge = /(?:[^\s\p{P}\p{S}]|~)/u;
var Qe = k(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Oe ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ce = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
var Ne = k(ce, "u").replace(/punct/g, _).getRegex();
var je = k(ce, "u").replace(/punct/g, pe).getRegex();
var Fe = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/;
var Ue = k(Fe, "u").replace(/openQuote/g, He).replace(/punct/g, _).getRegex();
var he = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var Ke = k(he, "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var We = k(he, "gu").replace(/notPunctSpace/g, Ge).replace(/punctSpace/g, Ze).replace(/punct/g, pe).getRegex();
var Xe = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)";
var Je = k(Xe, "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var Ve = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var Ye = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)";
var et = k(Ye, "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var tt = k(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, _).getRegex();
var nt = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
var rt = k(nt, "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
var st = k(/\\(punct)/, "gu").replace(/punct/g, _).getRegex();
var it = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var ot = k(X).replace("(?:-->|$)", "-->").getRegex();
var at = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ot).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var G = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/;
var lt = k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", G).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var ke = k(/^!?\[(label)\]\[(ref)\]/).replace("label", G).replace("ref", W).getRegex();
var de = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", W).getRegex();
var ut = k("reflink|nolink(?!\\()", "g").replace("reflink", ke).replace("nolink", de).getRegex();
var ie = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var V = { _backpedal: z, anyPunctuation: st, autolink: it, blockSkip: Qe, br: ue, code: De, del: z, delLDelim: z, delRDelim: z, emStrongLDelim: Ne, emStrongRDelimAst: Ke, emStrongRDelimUnd: Ve, escape: Be, link: lt, nolink: de, punctuation: ve, reflink: ke, reflinkSearch: ut, tag: at, text: qe, url: z };
var pt = { ...V, emStrongLDelim: Ue, emStrongRDelimAst: Je, emStrongRDelimUnd: et, link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", G).getRegex(), reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", G).getRegex() };
var F = { ...V, emStrongRDelimAst: We, emStrongLDelim: je, delLDelim: tt, delRDelim: rt, url: k(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ie).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: k(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ie).getRegex() };
var ct = { ...F, br: k(ue).replace("{2,}", "*").getRegex(), text: k(F.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var H = { normal: J, gfm: Ie, pedantic: Ce };
var B = { normal: V, gfm: F, breaks: ct, pedantic: pt };
var ht = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ge = (l3) => ht[l3];
function T(l3, e) {
  if (e) {
    if (m.escapeTest.test(l3)) return l3.replace(m.escapeReplace, ge);
  } else if (m.escapeTestNoEncode.test(l3)) return l3.replace(m.escapeReplaceNoEncode, ge);
  return l3;
}
function Y(l3) {
  try {
    l3 = encodeURI(l3).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return l3;
}
function ee(l3, e) {
  let t = l3.replace(m.findPipe, (r, i, o) => {
    let u = false, a = i;
    for (; --a >= 0 && o[a] === "\\"; ) u = !u;
    return u ? "|" : " |";
  }), n = t.split(m.splitPipe), s = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; s < n.length; s++) n[s] = n[s].trim().replace(m.slashPipe, "|");
  return n;
}
function $(l3, e, t) {
  let n = l3.length;
  if (n === 0) return "";
  let s = 0;
  for (; s < n; ) {
    let r = l3.charAt(n - s - 1);
    if (r === e && !t) s++;
    else if (r !== e && t) s++;
    else break;
  }
  return l3.slice(0, n - s);
}
function te(l3) {
  let e = l3.split(`
`), t = e.length - 1;
  for (; t >= 0 && m.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? l3 : e.slice(0, t + 1).join(`
`);
}
function fe(l3, e) {
  if (l3.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let n = 0; n < l3.length; n++) if (l3[n] === "\\") n++;
  else if (l3[n] === e[0]) t++;
  else if (l3[n] === e[1] && (t--, t < 0)) return n;
  return t > 0 ? -2 : -1;
}
function me(l3, e = 0) {
  let t = e, n = "";
  for (let s of l3) if (s === "	") {
    let r = 4 - t % 4;
    n += " ".repeat(r), t += r;
  } else n += s, t++;
  return n;
}
function xe(l3, e, t, n, s) {
  let r = e.href, i = e.title || null, o = l3[1].replace(s.other.outputLinkReplace, "$1"), u = l3[0].charAt(0) === "!";
  n.state.inLink = true;
  let a = n.state.linkEmitted, p = n.state.inRawBlock;
  n.state.linkEmitted = false;
  let c = n.inlineTokens(o), h = n.state.linkEmitted;
  if (n.state.linkEmitted = a, n.state.inLink = false, !u) {
    if (h) {
      n.state.inRawBlock = p;
      return;
    }
    n.state.linkEmitted = true;
  }
  return { type: u ? "image" : "link", raw: t, href: r, title: i, text: o, tokens: c };
}
function kt(l3, e, t) {
  let n = l3.match(t.other.indentCodeCompensation);
  if (n === null) return e;
  let s = n[1];
  return e.split(`
`).map((r) => {
    let i = r.match(t.other.beginningSpace);
    if (i === null) return r;
    let [o] = i;
    return o.length >= s.length ? r.slice(s.length) : r;
  }).join(`
`);
}
var y = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || R;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = this.options.pedantic ? t[0] : te(t[0]), s = n.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: n, codeBlockStyle: "indented", text: s };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], s = kt(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: s };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = $(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: $(t[0], `
`), depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: $(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = $(t[0], `
`).split(`
`), s = "", r = "", i = [];
      for (; n.length > 0; ) {
        let o = false, u = [], a;
        for (a = 0; a < n.length; a++) if (this.rules.other.blockquoteStart.test(n[a])) u.push(n[a]), o = true;
        else if (!o) u.push(n[a]);
        else break;
        n = n.slice(a);
        let p = u.join(`
`), c = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${p}` : p, r = r ? `${r}
${c}` : c;
        let h = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(c, i, true), this.lexer.state.top = h, n.length === 0) break;
        let d = i.at(-1);
        if (d?.type === "code") break;
        if (d?.type === "blockquote") {
          let O = d, g = n.join(`
`), w = O.raw + `
` + g.replace(this.rules.other.blockquoteSetextReplace2, ""), E = this.blockquote(w);
          i[i.length - 1] = E, s = `${s}
${g}`, r = r.substring(0, r.length - O.text.length) + E.text;
          break;
        } else if (d?.type === "list") {
          let O = d, g = O.raw + `
` + n.join(`
`), w = this.list(g);
          i[i.length - 1] = w, s = s.substring(0, s.length - d.raw.length) + w.raw, r = r.substring(0, r.length - O.raw.length) + w.raw, n = g.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: i, text: r };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), s = n.length > 1, r = { type: "list", raw: "", ordered: s, start: s ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      let i = this.rules.other.listItemRegex(n), o = false;
      for (; e; ) {
        let a = false, p = "", c = "";
        if (!(t = i.exec(e)) || this.rules.block.hr.test(e)) break;
        p = t[0], e = e.substring(p.length);
        let h = me(t[2].split(`
`, 1)[0], t[1].length), d = e.split(`
`, 1)[0], O = !h.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, c = h.trimStart()) : O ? g = t[1].length + 1 : (g = h.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c = h.slice(g), g += t[1].length), O && this.rules.other.blankLine.test(d) && (p += d + `
`, e = e.substring(d.length + 1), a = true), !a) {
          let w = this.rules.other.nextBulletRegex(g), E = this.rules.other.hrRegex(g), ne = this.rules.other.fencesBeginRegex(g), re = this.rules.other.headingBeginRegex(g), be = this.rules.other.htmlBeginRegex(g), Re = this.rules.other.blockquoteBeginRegex(g);
          for (; e; ) {
            let N = e.split(`
`, 1)[0], D;
            if (d = N, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), D = d) : D = d.replace(this.rules.other.tabCharGlobal, "    "), ne.test(d) || re.test(d) || be.test(d) || Re.test(d) || w.test(d) || E.test(d)) break;
            if (D.search(this.rules.other.nonSpaceChar) >= g || !d.trim()) c += `
` + D.slice(g);
            else {
              if (O || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ne.test(h) || re.test(h) || E.test(h)) break;
              c += `
` + d;
            }
            O = !d.trim(), p += N + `
`, e = e.substring(N.length + 1), h = D.slice(g);
          }
        }
        r.loose || (o ? r.loose = true : this.rules.other.doubleBlankLine.test(p) && (o = true)), r.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: false, text: c, tokens: [] }), r.raw += p;
      }
      let u = r.items.at(-1);
      if (u) u.raw = u.raw.trimEnd(), u.text = u.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let a of r.items) if (this.lexer.state.top = false, a.tokens = this.lexer.blockTokens(a.text, []), !r.loose) {
        let p = a.tokens.filter((h) => h.type === "space"), c = p.length > 0 && p.some((h) => this.rules.other.anyLine.test(h.raw));
        r.loose = c;
      }
      for (let a of r.items) {
        let p = a.tokens[0];
        if (a.task && (p?.type === "text" || p?.type === "paragraph")) {
          a.text = a.text.replace(this.rules.other.listReplaceTask, ""), p.raw = p.raw.replace(this.rules.other.listReplaceTask, ""), p.text = p.text.replace(this.rules.other.listReplaceTask, "");
          for (let h = this.lexer.inlineQueue.length - 1; h >= 0; h--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)) {
            this.lexer.inlineQueue[h].src = this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let c = this.rules.other.listTaskCheckbox.exec(a.raw);
          if (c) {
            let h = { type: "checkbox", raw: c[0] + " ", checked: c[0] !== "[ ]" };
            a.checked = h.checked, r.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = h.raw + a.tokens[0].raw, a.tokens[0].text = h.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(h)) : a.tokens.unshift({ type: "paragraph", raw: h.raw, text: h.raw, tokens: [h] }) : a.tokens.unshift(h);
          }
        } else a.task && (a.task = false);
      }
      if (r.loose) for (let a of r.items) {
        a.loose = true;
        for (let p of a.tokens) p.type === "text" && (p.type = "paragraph");
      }
      return r;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) {
      let n = te(t[0]);
      return { type: "html", block: true, raw: n, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: n };
    }
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: $(t[0], `
`), href: s, title: r };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = ee(t[1]), s = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: $(t[0], `
`), header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let o of s) this.rules.other.tableAlignRight.test(o) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? i.align.push("left") : i.align.push(null);
      for (let o = 0; o < n.length; o++) i.header.push({ text: n[o], tokens: this.lexer.inline(n[o]), header: true, align: i.align[o] });
      for (let o of r) i.rows.push(ee(o, i.header.length).map((u, a) => ({ text: u, tokens: this.lexer.inline(u), header: false, align: i.align[a] })));
      return i;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let n = t[1].trim();
      return { type: "heading", raw: $(t[0], `
`), depth: t[2].charAt(0) === "=" ? 1 : 2, text: n, tokens: this.lexer.inline(n) };
    }
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let i = $(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = fe(t[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let u = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + i;
          t[2] = t[2].substring(0, i), t[0] = t[0].substring(0, u).trim(), t[3] = "";
        }
      }
      let s = t[2], r = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], r = i[3]);
      } else r = t[3] ? t[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), xe(t, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = t[s.toLowerCase()];
      if (!r) {
        let i = n[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return xe(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(e);
    if (!s || !s[1] && !s[2] && !s[3] && !s[4] || s[4] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(s[1] || s[3] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let i = [...s[0]].length - 1, o, u, a = i, p = 0, c = s[0][0], h = n === c, d = c === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (d.lastIndex = 0, t = t.slice(-1 * e.length + i); (s = d.exec(t)) !== null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o) continue;
        if (u = [...o].length, s[3] || s[4]) {
          a += u;
          continue;
        } else if (s[5] || s[6]) {
          if (i % 3 && !((i + u) % 3)) {
            p += u;
            continue;
          }
          if (h) break;
        }
        if (a -= u, a > 0) continue;
        u = Math.min(u, u + a + p);
        let O = [...s[0]][0].length, g = e.slice(0, i + s.index + O + u);
        if (Math.min(i, u) % 2) {
          let E = g.slice(1, -1);
          return { type: "em", raw: g, text: E, tokens: this.lexer.inlineTokens(E) };
        }
        let w = g.slice(2, -2);
        return { type: "strong", raw: g, text: w, tokens: this.lexer.inlineTokens(w) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return s && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return { type: "br", raw: t[0] };
  }
  del(e, t, n = "") {
    let s = this.rules.inline.delLDelim.exec(e);
    if (!s) return;
    if (!(s[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let i = [...s[0]].length - 1, o, u, a = i, p = this.rules.inline.delRDelim;
      for (p.lastIndex = 0, t = t.slice(-1 * e.length + i); (s = p.exec(t)) !== null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o || (u = [...o].length, u !== i)) continue;
        if (s[3] || s[4]) {
          a += u;
          continue;
        }
        if (a -= u, a > 0) continue;
        u = Math.min(u, u + a);
        let c = [...s[0]][0].length, h = e.slice(0, i + s.index + c + u), d = h.slice(i, -i);
        return { type: "del", raw: h, text: d, tokens: this.lexer.inlineTokens(d) };
      }
    }
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, s;
      return t[2] === "@" ? (n = t[1], s = "mailto:" + n) : (n = t[1], s = n), { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, s;
      if (t[2] === "@") n = t[0], s = "mailto:" + n;
      else {
        let r;
        do
          r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (r !== t[0]);
        n = t[0], t[1] === "www." ? s = "http://" + t[0] : s = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
};
var x = class l {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || R, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, linkEmitted: false, top: true };
    let t = { other: m, block: H.normal, inline: B.normal };
    this.options.pedantic ? (t.block = H.pedantic, t.inline = B.pedantic) : this.options.gfm && (t.block = H.gfm, this.options.breaks ? t.inline = B.breaks : t.inline = B.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: H, inline: B };
  }
  static lex(e, t) {
    return new l(t).lex(e);
  }
  static lexInline(e, t) {
    return new l(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = false) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, ""));
    let s = 1 / 0;
    for (; e; ) {
      if (e.length < s) s = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      let r;
      if (this.options.extensions?.block?.some((o) => (r = o.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        r.raw.length === 1 && o !== void 0 ? o.raw += `
` : t.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.at(-1).src = o.text) : t.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let o = 1 / 0, u = e.slice(1), a;
        this.options.extensions.startBlock.forEach((p) => {
          a = p.call({ lexer: this }, u), typeof a == "number" && a >= 0 && (o = Math.min(o, a));
        }), o < 1 / 0 && o >= 0 && (i = e.substring(0, o + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        let o = t.at(-1);
        n && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return this.state.top = true, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  linkInText(e) {
    if (!e.includes("[")) return false;
    let t = this.tokenizer.rules.inline.link;
    for (let n of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(n[0]) && e.charAt(n.index - 1) !== "!") return true;
    for (let n of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
      let s = n[0], r = s.lastIndexOf("[");
      if (!(s.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, s.slice(r + 1, -1))) && !(r > 1 && this.linkInText(s.slice(1, r - 1)))) return true;
    }
    return false;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let n = e;
    if (this.tokens.links && e.includes("[")) {
      let o = this.tokenizer.rules.inline.reflinkSearch, u = (a) => {
        let p = a.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, a.slice(p + 1, -1))) return a;
        if (p > 1 && a.charAt(0) !== "!") {
          let c = a.slice(1, p - 1);
          if (this.linkInText(c)) return "[" + c.replace(o, u) + "][" + "a".repeat(a.length - p - 2) + "]";
        }
        return "[" + "a".repeat(a.length - 2) + "]";
      };
      n = n.replace(o, u);
    }
    n = n.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), n = n.replace(this.tokenizer.rules.inline.blockSkip, (o, u, a) => {
      let p = a ? a.length : 0;
      return o.slice(0, p) + "[" + "a".repeat(o.length - p - 2) + "]";
    }), n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let s = false, r = "", i = 1 / 0;
    for (; e; ) {
      if (e.length < i) i = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      s || (r = ""), s = false;
      let o;
      if (this.options.extensions?.inline?.some((a) => (o = a.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let a = t.at(-1);
        o.type === "text" && a?.type === "text" ? (a.raw += o.raw, a.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, n, r)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e, n, r)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let u = e;
      if (this.options.extensions?.startInline) {
        let a = 1 / 0, p = e.slice(1), c;
        this.options.extensions.startInline.forEach((h) => {
          c = h.call({ lexer: this }, p), typeof c == "number" && c >= 0 && (a = Math.min(a, c));
        }), a < 1 / 0 && a >= 0 && (u = e.substring(0, a + 1));
      }
      if (o = this.tokenizer.inlineText(u)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (r = o.raw.slice(-1)), s = true;
        let a = t.at(-1);
        a?.type === "text" ? (a.raw += o.raw, a.text += o.text) : t.push(o);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return t;
  }
  infiniteLoopError(e) {
    let t = "Infinite loop on byte: " + e;
    if (this.options.silent) console.error(t);
    else throw new Error(t);
  }
};
var P = class {
  options;
  parser;
  constructor(e) {
    this.options = e || R;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let s = (t || "").match(m.notSpaceStart)?.[0], r = e.replace(m.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + T(s) + '">' + (n ? r : T(r, true)) + `</code></pre>
` : "<pre><code>" + (n ? r : T(r, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let t = e.ordered, n = e.start, s = "";
    for (let o = 0; o < e.items.length; o++) {
      let u = e.items[o];
      s += this.listitem(u);
    }
    let r = t ? "ol" : "ul", i = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + i + `>
` + s + "</" + r + `>
`;
  }
  listitem(e) {
    return `<li>${this.parser.parse(e.tokens)}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let r = 0; r < e.header.length; r++) n += this.tablecell(e.header[r]);
    t += this.tablerow({ text: n });
    let s = "";
    for (let r = 0; r < e.rows.length; r++) {
      let i = e.rows[r];
      n = "";
      for (let o = 0; o < i.length; o++) n += this.tablecell(i[o]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${T(e, true)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let s = this.parser.parseInline(n), r = Y(e);
    if (r === null) return s;
    e = r;
    let i = '<a href="' + e + '"';
    return t && (i += ' title="' + T(t) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: e, title: t, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = Y(e);
    if (r === null) return T(n);
    e = r;
    let i = `<img src="${e}" alt="${T(n)}"`;
    return t && (i += ` title="${T(t)}"`), i += ">", i;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : T(e.text);
  }
};
var L = class {
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
  checkbox({ raw: e }) {
    return e;
  }
};
var b = class l2 {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || R, this.options.renderer = this.options.renderer || new P(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new L();
  }
  static parse(e, t) {
    return new l2(t).parse(e);
  }
  static parseInline(e, t) {
    return new l2(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let n = 0; n < e.length; n++) {
      let s = e[n];
      if (this.options.extensions?.renderers?.[s.type]) {
        let i = s, o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(i.type)) {
          t += o || "";
          continue;
        }
      }
      let r = s;
      switch (r.type) {
        case "space": {
          t += this.renderer.space(r);
          break;
        }
        case "hr": {
          t += this.renderer.hr(r);
          break;
        }
        case "heading": {
          t += this.renderer.heading(r);
          break;
        }
        case "code": {
          t += this.renderer.code(r);
          break;
        }
        case "table": {
          t += this.renderer.table(r);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(r);
          break;
        }
        case "list": {
          t += this.renderer.list(r);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(r);
          break;
        }
        case "html": {
          t += this.renderer.html(r);
          break;
        }
        case "def": {
          t += this.renderer.def(r);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(r);
          break;
        }
        case "text": {
          t += this.renderer.text(r);
          break;
        }
        default: {
          let i = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    this.renderer.parser = this;
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (this.options.extensions?.renderers?.[r.type]) {
        let o = this.options.extensions.renderers[r.type].call({ parser: this }, r);
        if (o !== false || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(r.type)) {
          n += o || "";
          continue;
        }
      }
      let i = r;
      switch (i.type) {
        case "escape": {
          n += t.text(i);
          break;
        }
        case "html": {
          n += t.html(i);
          break;
        }
        case "link": {
          n += t.link(i);
          break;
        }
        case "image": {
          n += t.image(i);
          break;
        }
        case "checkbox": {
          n += t.checkbox(i);
          break;
        }
        case "strong": {
          n += t.strong(i);
          break;
        }
        case "em": {
          n += t.em(i);
          break;
        }
        case "codespan": {
          n += t.codespan(i);
          break;
        }
        case "br": {
          n += t.br(i);
          break;
        }
        case "del": {
          n += t.del(i);
          break;
        }
        case "text": {
          n += t.text(i);
          break;
        }
        default: {
          let o = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
};
var S = class {
  options;
  block;
  constructor(e) {
    this.options = e || R;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  emStrongMask(e) {
    return e;
  }
  provideLexer(e = this.block) {
    return e ? x.lex : x.lexInline;
  }
  provideParser(e = this.block) {
    return e ? b.parse : b.parseInline;
  }
};
var Z = class {
  defaults = A();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b;
  Renderer = P;
  TextRenderer = L;
  Lexer = x;
  Tokenizer = y;
  Hooks = S;
  constructor(...e) {
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let s of e) switch (n = n.concat(t.call(this, s)), s.type) {
      case "table": {
        let r = s;
        for (let i of r.header) n = n.concat(this.walkTokens(i.tokens, t));
        for (let i of r.rows) for (let o of i) n = n.concat(this.walkTokens(o.tokens, t));
        break;
      }
      case "list": {
        let r = s;
        n = n.concat(this.walkTokens(r.items, t));
        break;
      }
      default: {
        let r = s;
        this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((i) => {
          let o = r[i].flat(1 / 0);
          n = n.concat(this.walkTokens(o, t));
        }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, t)));
      }
    }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let s = { ...n };
      if (s.async = this.defaults.async || s.async || false, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let i = t.renderers[r.name];
          i ? t.renderers[r.name] = function(...o) {
            let u = r.renderer.apply(this, o);
            return u === false && (u = i.apply(this, o)), u;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = t[r.level];
          i ? i.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), s.extensions = t), n.renderer) {
        let r = this.defaults.renderer || new P(this.defaults);
        for (let i in n.renderer) {
          if (!(i in r)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let o = i, u = n.renderer[o], a = r[o];
          r[o] = (...p) => {
            let c = u.apply(r, p);
            return c === false && (c = a.apply(r, p)), c || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new y(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let o = i, u = n.tokenizer[o], a = r[o];
          r[o] = (...p) => {
            let c = u.apply(r, p);
            return c === false && (c = a.apply(r, p)), c;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new S();
        for (let i in n.hooks) {
          if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let o = i, u = n.hooks[o], a = r[o];
          S.passThroughHooks.has(i) ? r[o] = (p) => {
            if (this.defaults.async && S.passThroughHooksRespectAsync.has(i)) return (async () => {
              let h = await u.call(r, p);
              return a.call(r, h);
            })();
            let c = u.call(r, p);
            return a.call(r, c);
          } : r[o] = (...p) => {
            if (this.defaults.async) return (async () => {
              let h = await u.apply(r, p);
              return h === false && (h = await a.apply(r, p)), h;
            })();
            let c = u.apply(r, p);
            return c === false && (c = a.apply(r, p)), c;
          };
        }
        s.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, i = n.walkTokens;
        s.walkTokens = function(o) {
          let u = [];
          return u.push(i.call(this, o)), r && (u = u.concat(r.call(this, o))), u;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return x.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return b.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, s) => {
      let r = { ...s }, i = { ...this.defaults, ...r }, o = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === true && r.async === false) return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null) return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string") return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
        let u = i.hooks ? await i.hooks.preprocess(n) : n, p = await (i.hooks ? await i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(u, i), c = i.hooks ? await i.hooks.processAllTokens(p) : p;
        i.walkTokens && await Promise.all(this.walkTokens(c, i.walkTokens));
        let d = await (i.hooks ? await i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(c, i);
        return i.hooks ? await i.hooks.postprocess(d) : d;
      })().catch(o);
      try {
        i.hooks && (n = i.hooks.preprocess(n));
        let a = (i.hooks ? i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(n, i);
        i.hooks && (a = i.hooks.processAllTokens(a)), i.walkTokens && this.walkTokens(a, i.walkTokens);
        let c = (i.hooks ? i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(a, i);
        return i.hooks && (c = i.hooks.postprocess(c)), c;
      } catch (u) {
        return o(u);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let s = "<p>An error occurred:</p><pre>" + T(n.message + "", true) + "</pre>";
        return t ? Promise.resolve(s) : s;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
};
var M = new Z();
function f(l3, e) {
  return M.parse(l3, e);
}
f.options = f.setOptions = function(l3) {
  return M.setOptions(l3), f.defaults = M.defaults, j(f.defaults), f;
};
f.getDefaults = A;
f.defaults = R;
function dt(...l3) {
  return M.use(...l3), f.defaults = M.defaults, j(f.defaults), f;
}
f.use = dt;
f.walkTokens = function(l3, e) {
  return M.walkTokens(l3, e);
};
f.parseInline = M.parseInline;
f.Parser = b;
f.parser = b.parse;
f.Renderer = P;
f.TextRenderer = L;
f.Lexer = x;
f.lexer = x.lex;
f.Tokenizer = y;
f.Hooks = S;
f.parse = f;
var nn = f.options;
var rn = f.setOptions;
var sn = f.walkTokens;
var on = f.parseInline;
var ln = b.parse;
var un = x.lex;

// node_modules/get-east-asian-width/lookup-data.js
var ambiguousMinimalCodePoint = 161;
var ambiguousMaximumCodePoint = 1114109;
var ambiguousRanges = [161, 161, 164, 164, 167, 168, 170, 170, 173, 174, 176, 180, 182, 186, 188, 191, 198, 198, 208, 208, 215, 216, 222, 225, 230, 230, 232, 234, 236, 237, 240, 240, 242, 243, 247, 250, 252, 252, 254, 254, 257, 257, 273, 273, 275, 275, 283, 283, 294, 295, 299, 299, 305, 307, 312, 312, 319, 322, 324, 324, 328, 331, 333, 333, 338, 339, 358, 359, 363, 363, 462, 462, 464, 464, 466, 466, 468, 468, 470, 470, 472, 472, 474, 474, 476, 476, 593, 593, 609, 609, 708, 708, 711, 711, 713, 715, 717, 717, 720, 720, 728, 731, 733, 733, 735, 735, 768, 879, 913, 929, 931, 937, 945, 961, 963, 969, 1025, 1025, 1040, 1103, 1105, 1105, 8208, 8208, 8211, 8214, 8216, 8217, 8220, 8221, 8224, 8226, 8228, 8231, 8240, 8240, 8242, 8243, 8245, 8245, 8251, 8251, 8254, 8254, 8308, 8308, 8319, 8319, 8321, 8324, 8364, 8364, 8451, 8451, 8453, 8453, 8457, 8457, 8467, 8467, 8470, 8470, 8481, 8482, 8486, 8486, 8491, 8491, 8531, 8532, 8539, 8542, 8544, 8555, 8560, 8569, 8585, 8585, 8592, 8601, 8632, 8633, 8658, 8658, 8660, 8660, 8679, 8679, 8704, 8704, 8706, 8707, 8711, 8712, 8715, 8715, 8719, 8719, 8721, 8721, 8725, 8725, 8730, 8730, 8733, 8736, 8739, 8739, 8741, 8741, 8743, 8748, 8750, 8750, 8756, 8759, 8764, 8765, 8776, 8776, 8780, 8780, 8786, 8786, 8800, 8801, 8804, 8807, 8810, 8811, 8814, 8815, 8834, 8835, 8838, 8839, 8853, 8853, 8857, 8857, 8869, 8869, 8895, 8895, 8978, 8978, 9312, 9449, 9451, 9547, 9552, 9587, 9600, 9615, 9618, 9621, 9632, 9633, 9635, 9641, 9650, 9651, 9654, 9655, 9660, 9661, 9664, 9665, 9670, 9672, 9675, 9675, 9678, 9681, 9698, 9701, 9711, 9711, 9733, 9734, 9737, 9737, 9742, 9743, 9756, 9756, 9758, 9758, 9792, 9792, 9794, 9794, 9824, 9825, 9827, 9829, 9831, 9834, 9836, 9837, 9839, 9839, 9886, 9887, 9919, 9919, 9926, 9933, 9935, 9939, 9941, 9953, 9955, 9955, 9960, 9961, 9963, 9969, 9972, 9972, 9974, 9977, 9979, 9980, 9982, 9983, 10045, 10045, 10102, 10111, 11094, 11097, 12872, 12879, 57344, 63743, 65024, 65039, 65533, 65533, 127232, 127242, 127248, 127277, 127280, 127337, 127344, 127373, 127375, 127376, 127387, 127404, 917760, 917999, 983040, 1048573, 1048576, 1114109];
var fullwidthMinimalCodePoint = 12288;
var fullwidthMaximumCodePoint = 65510;
var fullwidthRanges = [12288, 12288, 65281, 65376, 65504, 65510];
var wideMinimalCodePoint = 4352;
var wideMaximumCodePoint = 262141;
var wideRanges = [4352, 4447, 8986, 8987, 9001, 9002, 9193, 9196, 9200, 9200, 9203, 9203, 9725, 9726, 9748, 9749, 9776, 9783, 9800, 9811, 9855, 9855, 9866, 9871, 9875, 9875, 9889, 9889, 9898, 9899, 9917, 9918, 9924, 9925, 9934, 9934, 9940, 9940, 9962, 9962, 9970, 9971, 9973, 9973, 9978, 9978, 9981, 9981, 9989, 9989, 9994, 9995, 10024, 10024, 10060, 10060, 10062, 10062, 10067, 10069, 10071, 10071, 10133, 10135, 10160, 10160, 10175, 10175, 11035, 11036, 11088, 11088, 11093, 11093, 11904, 11929, 11931, 12019, 12032, 12245, 12272, 12287, 12289, 12350, 12353, 12438, 12441, 12543, 12549, 12591, 12593, 12686, 12688, 12773, 12783, 12830, 12832, 12871, 12880, 42124, 42128, 42182, 43360, 43388, 44032, 55203, 63744, 64255, 65040, 65049, 65072, 65106, 65108, 65126, 65128, 65131, 94176, 94180, 94192, 94198, 94208, 101589, 101631, 101662, 101760, 101874, 110576, 110579, 110581, 110587, 110589, 110590, 110592, 110882, 110898, 110898, 110928, 110930, 110933, 110933, 110948, 110951, 110960, 111355, 119552, 119638, 119648, 119670, 126980, 126980, 127183, 127183, 127374, 127374, 127377, 127386, 127488, 127490, 127504, 127547, 127552, 127560, 127568, 127569, 127584, 127589, 127744, 127776, 127789, 127797, 127799, 127868, 127870, 127891, 127904, 127946, 127951, 127955, 127968, 127984, 127988, 127988, 127992, 128062, 128064, 128064, 128066, 128252, 128255, 128317, 128331, 128334, 128336, 128359, 128378, 128378, 128405, 128406, 128420, 128420, 128507, 128591, 128640, 128709, 128716, 128716, 128720, 128722, 128725, 128728, 128732, 128735, 128747, 128748, 128756, 128764, 128992, 129003, 129008, 129008, 129292, 129338, 129340, 129349, 129351, 129535, 129648, 129660, 129664, 129674, 129678, 129734, 129736, 129736, 129741, 129756, 129759, 129770, 129775, 129784, 131072, 196605, 196608, 262141];

// node_modules/get-east-asian-width/utilities.js
var isInRange = (ranges, codePoint) => {
  let low = 0;
  let high = Math.floor(ranges.length / 2) - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const i = mid * 2;
    if (codePoint < ranges[i]) {
      high = mid - 1;
    } else if (codePoint > ranges[i + 1]) {
      low = mid + 1;
    } else {
      return true;
    }
  }
  return false;
};

// node_modules/get-east-asian-width/lookup.js
var commonCjkCodePoint = 19968;
var [wideFastPathStart, wideFastPathEnd] = /* @__PURE__ */ findWideFastPathRange(wideRanges);
function findWideFastPathRange(ranges) {
  let fastPathStart = ranges[0];
  let fastPathEnd = ranges[1];
  for (let index = 0; index < ranges.length; index += 2) {
    const start = ranges[index];
    const end = ranges[index + 1];
    if (commonCjkCodePoint >= start && commonCjkCodePoint <= end) {
      return [start, end];
    }
    if (end - start > fastPathEnd - fastPathStart) {
      fastPathStart = start;
      fastPathEnd = end;
    }
  }
  return [fastPathStart, fastPathEnd];
}
var isAmbiguous = (codePoint) => {
  if (codePoint < ambiguousMinimalCodePoint || codePoint > ambiguousMaximumCodePoint) {
    return false;
  }
  return isInRange(ambiguousRanges, codePoint);
};
var isFullWidth = (codePoint) => {
  if (codePoint < fullwidthMinimalCodePoint || codePoint > fullwidthMaximumCodePoint) {
    return false;
  }
  return isInRange(fullwidthRanges, codePoint);
};
var isWide = (codePoint) => {
  if (codePoint >= wideFastPathStart && codePoint <= wideFastPathEnd) {
    return true;
  }
  if (codePoint < wideMinimalCodePoint || codePoint > wideMaximumCodePoint) {
    return false;
  }
  return isInRange(wideRanges, codePoint);
};

// node_modules/get-east-asian-width/index.js
function validate(codePoint) {
  if (!Number.isSafeInteger(codePoint)) {
    throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
  }
}
function eastAsianWidth(codePoint, { ambiguousAsWide = false } = {}) {
  validate(codePoint);
  if (isFullWidth(codePoint) || isWide(codePoint) || ambiguousAsWide && isAmbiguous(codePoint)) {
    return 2;
  }
  return 1;
}

// node_modules/@earendil-works/pi-tui/dist/utils.js
var graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
var wordSegmenter = new Intl.Segmenter(void 0, { granularity: "word" });
function getGraphemeSegmenter() {
  return graphemeSegmenter;
}
function getWordSegmenter() {
  return wordSegmenter;
}
function couldBeEmoji(segment) {
  const cp = segment.codePointAt(0);
  return cp >= 126976 && cp <= 130047 || // Emoji and Pictograph
  cp >= 8960 && cp <= 9215 || // Misc technical
  cp >= 9728 && cp <= 10175 || // Misc symbols, dingbats
  cp >= 11088 && cp <= 11093 || // Specific stars/circles
  segment.includes("\uFE0F") || // Contains VS16 (emoji presentation selector)
  segment.length > 2;
}
var zeroWidthRegex = new RegExp("^(?:\\p{Default_Ignorable_Code_Point}|\\p{Control}|\\p{Mark}|\\p{Surrogate})+$", "v");
var leadingNonPrintingRegex = new RegExp("^[\\p{Default_Ignorable_Code_Point}\\p{Control}\\p{Format}\\p{Mark}\\p{Surrogate}]+", "v");
var nonPrintingCharRegex = new RegExp("^(?:\\p{Default_Ignorable_Code_Point}|\\p{Control}|\\p{Format}|\\p{Mark}|\\p{Surrogate})$", "v");
var markCharRegex = new RegExp("^\\p{Mark}$", "v");
var terminalSpacingMarkRegex = new RegExp("^(?:[\\p{Spacing_Mark}--[\\u1734\\u302E\\u302F]]|[\\u065F\\u0F7F\\u102B\\u102C\\u1031\\u1033-\\u1035\\u1038\\u103A-\\u103E])+$", "v");
var rgiEmojiRegex = new RegExp("^\\p{RGI_Emoji}$", "v");
var WIDTH_CACHE_SIZE = 512;
var widthCache = /* @__PURE__ */ new Map();
var cjkBreakRegex = /[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}\p{Script_Extensions=Hangul}\p{Script_Extensions=Bopomofo}]/u;
var cjkPunctuationRegex = new RegExp(`(?:(?=\\p{Punctuation})${cjkBreakRegex.source}|[\uFF0C\uFF0E\uFF1A\uFF1B\uFF01\uFF1F\uFF08\uFF09\uFF3B\uFF3D\uFF5B\uFF5D\u201C\u201D\u2018\u2019\u2026\u2014])`, "u");
var autocompleteSeparatorRegex = new RegExp(`(?:\\s|${cjkPunctuationRegex.source})`, "u");
var autocompleteBoundaryRegex = new RegExp(`(?:^|${autocompleteSeparatorRegex.source})`, "u");
function isPrintableAscii(str) {
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 32 || code > 126) {
      return false;
    }
  }
  return true;
}
function truncateFragmentToWidth(text, maxWidth) {
  if (maxWidth <= 0 || text.length === 0) {
    return { text: "", width: 0 };
  }
  if (isPrintableAscii(text)) {
    const clipped = text.slice(0, maxWidth);
    return { text: clipped, width: clipped.length };
  }
  const hasAnsi = text.includes("\x1B");
  const hasTabs = text.includes("	");
  if (!hasAnsi && !hasTabs) {
    let result2 = "";
    let width2 = 0;
    for (const { segment } of graphemeSegmenter.segment(text)) {
      const w = graphemeWidth(segment);
      if (width2 + w > maxWidth) {
        break;
      }
      result2 += segment;
      width2 += w;
    }
    return { text: result2, width: width2 };
  }
  let result = "";
  let width = 0;
  let i = 0;
  let pendingAnsi = "";
  while (i < text.length) {
    const ansi = extractAnsiCode(text, i);
    if (ansi) {
      pendingAnsi += ansi.code;
      i += ansi.length;
      continue;
    }
    if (text[i] === "	") {
      if (width + 3 > maxWidth) {
        break;
      }
      if (pendingAnsi) {
        result += pendingAnsi;
        pendingAnsi = "";
      }
      result += "	";
      width += 3;
      i++;
      continue;
    }
    let end = i;
    while (end < text.length && text[end] !== "	") {
      const nextAnsi = extractAnsiCode(text, end);
      if (nextAnsi) {
        break;
      }
      end++;
    }
    for (const { segment } of graphemeSegmenter.segment(text.slice(i, end))) {
      const w = graphemeWidth(segment);
      if (width + w > maxWidth) {
        return { text: result, width };
      }
      if (pendingAnsi) {
        result += pendingAnsi;
        pendingAnsi = "";
      }
      result += segment;
      width += w;
    }
    i = end;
  }
  return { text: result, width };
}
function finalizeTruncatedResult(prefix, prefixWidth, ellipsis, ellipsisWidth, maxWidth, pad) {
  const reset = "\x1B[0m";
  const hyperlinkClose = getActiveOsc8Close(prefix);
  const visibleWidth2 = prefixWidth + ellipsisWidth;
  let result;
  if (ellipsis.length > 0) {
    result = `${prefix}${hyperlinkClose}${reset}${ellipsis}${reset}`;
  } else {
    result = `${prefix}${hyperlinkClose}${reset}`;
  }
  return pad ? result + " ".repeat(Math.max(0, maxWidth - visibleWidth2)) : result;
}
function graphemeWidth(segment) {
  if (segment === "	") {
    return 3;
  }
  if (terminalSpacingMarkRegex.test(segment)) {
    return [...segment].length;
  }
  if (zeroWidthRegex.test(segment)) {
    return 0;
  }
  if (couldBeEmoji(segment) && rgiEmojiRegex.test(segment)) {
    return 2;
  }
  const base = segment.replace(leadingNonPrintingRegex, "");
  const cp = base.codePointAt(0);
  if (cp === void 0) {
    return 0;
  }
  if (cp >= 127462 && cp <= 127487) {
    return 2;
  }
  let width = eastAsianWidth(cp);
  let followsMark = false;
  const chars = [...base];
  for (const char of chars.slice(1)) {
    if (terminalSpacingMarkRegex.test(char)) {
      width += 1;
      followsMark = false;
    } else if (markCharRegex.test(char)) {
      followsMark = true;
    } else if (!nonPrintingCharRegex.test(char)) {
      const c = char.codePointAt(0);
      if (followsMark || c >= 65280 && c <= 65519) {
        width += eastAsianWidth(c);
      } else if (c === 3635 || c === 3763) {
        width += 1;
      }
      followsMark = false;
    }
  }
  return width;
}
function visibleWidth(str) {
  if (str.length === 0) {
    return 0;
  }
  if (isPrintableAscii(str)) {
    return str.length;
  }
  const cached = widthCache.get(str);
  if (cached !== void 0) {
    return cached;
  }
  let clean = str;
  if (str.includes("	")) {
    clean = clean.replace(/\t/g, "   ");
  }
  if (clean.includes("\x1B")) {
    let stripped = "";
    let i = 0;
    while (i < clean.length) {
      const ansi = extractAnsiCode(clean, i);
      if (ansi) {
        i += ansi.length;
        continue;
      }
      stripped += clean[i];
      i++;
    }
    clean = stripped;
  }
  let width = 0;
  for (const { segment } of graphemeSegmenter.segment(clean)) {
    width += graphemeWidth(segment);
  }
  if (widthCache.size >= WIDTH_CACHE_SIZE) {
    const firstKey = widthCache.keys().next().value;
    if (firstKey !== void 0) {
      widthCache.delete(firstKey);
    }
  }
  widthCache.set(str, width);
  return width;
}
function stripTerminalSequences(str) {
  if (!str.includes("\x1B"))
    return str;
  let result = "";
  let i = 0;
  while (i < str.length) {
    const ansi = extractAnsiCode(str, i);
    if (ansi) {
      i += ansi.length;
      continue;
    }
    result += str[i];
    i++;
  }
  return result;
}
function getGraphemeCellRange(line, column) {
  let currentCol = 0;
  let i = 0;
  while (i < line.length) {
    const ansi = extractAnsiCode(line, i);
    if (ansi) {
      i += ansi.length;
      continue;
    }
    let textEnd = i;
    while (textEnd < line.length && !extractAnsiCode(line, textEnd))
      textEnd++;
    for (const { segment } of graphemeSegmenter.segment(line.slice(i, textEnd))) {
      const width = graphemeWidth(segment);
      if (width > 0 && column >= currentCol && column < currentCol + width) {
        return { start: currentCol, end: currentCol + width };
      }
      currentCol += width;
    }
    i = textEnd;
  }
  return void 0;
}
function getOsc8LinkAtColumn(line, column) {
  let activeUrl;
  let currentCol = 0;
  let i = 0;
  while (i < line.length) {
    const ansi = extractAnsiCode(line, i);
    if (ansi) {
      const hyperlink2 = /^\x1b\]8;[^;]*;([^\x07\x1b]*)(?:\x07|\x1b\\)$/.exec(ansi.code);
      if (hyperlink2)
        activeUrl = hyperlink2[1] || void 0;
      i += ansi.length;
      continue;
    }
    let textEnd = i;
    while (textEnd < line.length && !extractAnsiCode(line, textEnd))
      textEnd++;
    for (const { segment } of graphemeSegmenter.segment(line.slice(i, textEnd))) {
      const width = segment === "	" ? 3 : graphemeWidth(segment);
      if (column >= currentCol && column < currentCol + width)
        return activeUrl;
      currentCol += width;
    }
    i = textEnd;
  }
  return void 0;
}
var THAI_LAO_AM_REGEX = /[\u0e33\u0eb3]/;
var THAI_LAO_AM_GLOBAL_REGEX = /[\u0e33\u0eb3]/g;
function normalizeTerminalOutput(str) {
  let normalized = str;
  if (THAI_LAO_AM_REGEX.test(normalized)) {
    normalized = normalized.replace(THAI_LAO_AM_GLOBAL_REGEX, (char) => char === "\u0E33" ? "\u0E4D\u0E32" : "\u0ECD\u0EB2");
  }
  if (!normalized.includes("	"))
    return normalized;
  let result = "";
  let i = 0;
  while (i < normalized.length) {
    const ansi = extractAnsiCode(normalized, i);
    if (ansi) {
      result += ansi.code;
      i += ansi.length;
      continue;
    }
    result += normalized[i] === "	" ? "   " : normalized[i];
    i++;
  }
  return result;
}
function extractAnsiCode(str, pos) {
  if (pos >= str.length || str[pos] !== "\x1B")
    return null;
  const next = str[pos + 1];
  if (next === "[") {
    let j2 = pos + 2;
    while (j2 < str.length && !/[mGKHJ]/.test(str[j2]))
      j2++;
    if (j2 < str.length)
      return { code: str.substring(pos, j2 + 1), length: j2 + 1 - pos };
    return null;
  }
  if (next === "]") {
    let j2 = pos + 2;
    while (j2 < str.length) {
      if (str[j2] === "\x07")
        return { code: str.substring(pos, j2 + 1), length: j2 + 1 - pos };
      if (str[j2] === "\x1B" && str[j2 + 1] === "\\")
        return { code: str.substring(pos, j2 + 2), length: j2 + 2 - pos };
      j2++;
    }
    return null;
  }
  if (next === "_") {
    let j2 = pos + 2;
    while (j2 < str.length) {
      if (str[j2] === "\x07")
        return { code: str.substring(pos, j2 + 1), length: j2 + 1 - pos };
      if (str[j2] === "\x1B" && str[j2 + 1] === "\\")
        return { code: str.substring(pos, j2 + 2), length: j2 + 2 - pos };
      j2++;
    }
    return null;
  }
  return null;
}
function parseOsc8Hyperlink(ansiCode) {
  if (!ansiCode.startsWith("\x1B]8;")) {
    return void 0;
  }
  const terminator = ansiCode.endsWith("\x07") ? "\x07" : "\x1B\\";
  const body = ansiCode.slice(4, terminator === "\x07" ? -1 : -2);
  const separatorIndex = body.indexOf(";");
  if (separatorIndex === -1) {
    return void 0;
  }
  const params = body.slice(0, separatorIndex);
  const url = body.slice(separatorIndex + 1);
  if (!url) {
    return null;
  }
  return { params, url, terminator };
}
function formatOsc8Hyperlink(hyperlink2) {
  return `\x1B]8;${hyperlink2.params};${hyperlink2.url}${hyperlink2.terminator}`;
}
function formatOsc8Close(terminator) {
  return `\x1B]8;;${terminator}`;
}
function getActiveOsc8Close(prefix) {
  if (!prefix.includes("\x1B]8;")) {
    return "";
  }
  let activeHyperlink = null;
  let i = 0;
  while (i < prefix.length) {
    const ansi = extractAnsiCode(prefix, i);
    if (ansi) {
      const hyperlink2 = parseOsc8Hyperlink(ansi.code);
      if (hyperlink2 !== void 0) {
        activeHyperlink = hyperlink2;
      }
      i += ansi.length;
    } else {
      i++;
    }
  }
  return activeHyperlink ? formatOsc8Close(activeHyperlink.terminator) : "";
}
var AnsiCodeTracker = class {
  // Track individual attributes separately so we can reset them specifically
  bold = false;
  dim = false;
  italic = false;
  underline = false;
  blink = false;
  inverse = false;
  hidden = false;
  strikethrough = false;
  fgColor = null;
  // Stores the full code like "31" or "38;5;240"
  bgColor = null;
  // Stores the full code like "41" or "48;5;240"
  activeHyperlink = null;
  process(ansiCode) {
    const hyperlink2 = parseOsc8Hyperlink(ansiCode);
    if (hyperlink2 !== void 0) {
      this.activeHyperlink = hyperlink2;
      return;
    }
    if (!ansiCode.endsWith("m")) {
      return;
    }
    const match = ansiCode.match(/\x1b\[([\d;]*)m/);
    if (!match)
      return;
    const params = match[1];
    if (params === "" || params === "0") {
      this.reset();
      return;
    }
    const parts = params.split(";");
    let i = 0;
    while (i < parts.length) {
      const code = Number.parseInt(parts[i], 10);
      if (code === 38 || code === 48) {
        if (parts[i + 1] === "5" && parts[i + 2] !== void 0) {
          const colorCode = `${parts[i]};${parts[i + 1]};${parts[i + 2]}`;
          if (code === 38) {
            this.fgColor = colorCode;
          } else {
            this.bgColor = colorCode;
          }
          i += 3;
          continue;
        } else if (parts[i + 1] === "2" && parts[i + 4] !== void 0) {
          const colorCode = `${parts[i]};${parts[i + 1]};${parts[i + 2]};${parts[i + 3]};${parts[i + 4]}`;
          if (code === 38) {
            this.fgColor = colorCode;
          } else {
            this.bgColor = colorCode;
          }
          i += 5;
          continue;
        }
      }
      switch (code) {
        case 0:
          this.reset();
          break;
        case 1:
          this.bold = true;
          break;
        case 2:
          this.dim = true;
          break;
        case 3:
          this.italic = true;
          break;
        case 4:
          this.underline = true;
          break;
        case 5:
          this.blink = true;
          break;
        case 7:
          this.inverse = true;
          break;
        case 8:
          this.hidden = true;
          break;
        case 9:
          this.strikethrough = true;
          break;
        case 21:
          this.bold = false;
          break;
        // Some terminals
        case 22:
          this.bold = false;
          this.dim = false;
          break;
        case 23:
          this.italic = false;
          break;
        case 24:
          this.underline = false;
          break;
        case 25:
          this.blink = false;
          break;
        case 27:
          this.inverse = false;
          break;
        case 28:
          this.hidden = false;
          break;
        case 29:
          this.strikethrough = false;
          break;
        case 39:
          this.fgColor = null;
          break;
        // Default fg
        case 49:
          this.bgColor = null;
          break;
        // Default bg
        default:
          if (code >= 30 && code <= 37 || code >= 90 && code <= 97) {
            this.fgColor = String(code);
          } else if (code >= 40 && code <= 47 || code >= 100 && code <= 107) {
            this.bgColor = String(code);
          }
          break;
      }
      i++;
    }
  }
  reset() {
    this.bold = false;
    this.dim = false;
    this.italic = false;
    this.underline = false;
    this.blink = false;
    this.inverse = false;
    this.hidden = false;
    this.strikethrough = false;
    this.fgColor = null;
    this.bgColor = null;
  }
  /** Clear all state for reuse. */
  clear() {
    this.reset();
    this.activeHyperlink = null;
  }
  getActiveCodes() {
    const codes = [];
    if (this.bold)
      codes.push("1");
    if (this.dim)
      codes.push("2");
    if (this.italic)
      codes.push("3");
    if (this.underline)
      codes.push("4");
    if (this.blink)
      codes.push("5");
    if (this.inverse)
      codes.push("7");
    if (this.hidden)
      codes.push("8");
    if (this.strikethrough)
      codes.push("9");
    if (this.fgColor)
      codes.push(this.fgColor);
    if (this.bgColor)
      codes.push(this.bgColor);
    let result = codes.length > 0 ? `\x1B[${codes.join(";")}m` : "";
    if (this.activeHyperlink) {
      result += formatOsc8Hyperlink(this.activeHyperlink);
    }
    return result;
  }
  getActiveBackgroundCode() {
    return this.bgColor ? `\x1B[${this.bgColor}m` : "";
  }
  hasActiveCodes() {
    return this.bold || this.dim || this.italic || this.underline || this.blink || this.inverse || this.hidden || this.strikethrough || this.fgColor !== null || this.bgColor !== null || this.activeHyperlink !== null;
  }
  /**
   * Get reset codes for attributes that need to be turned off at line end.
   * Underline must be closed to prevent bleeding into padding.
   * Active OSC 8 hyperlinks must be closed and re-opened on the next line.
   * Returns empty string if no attributes need closing.
   */
  getLineEndReset() {
    let result = "";
    if (this.underline) {
      result += "\x1B[24m";
    }
    if (this.activeHyperlink) {
      result += formatOsc8Close(this.activeHyperlink.terminator);
    }
    return result;
  }
};
function updateTrackerFromText(text, tracker) {
  let i = 0;
  while (i < text.length) {
    const ansiResult = extractAnsiCode(text, i);
    if (ansiResult) {
      tracker.process(ansiResult.code);
      i += ansiResult.length;
    } else {
      i++;
    }
  }
}
function getActiveBackgroundAnsi(text) {
  const tracker = new AnsiCodeTracker();
  updateTrackerFromText(text, tracker);
  return tracker.getActiveBackgroundCode();
}
function splitIntoTokensWithAnsi(text) {
  const tokens = [];
  let current = "";
  let pendingAnsi = "";
  let currentKind = null;
  let i = 0;
  const flushCurrent = () => {
    if (!current) {
      return;
    }
    tokens.push(current);
    current = "";
    currentKind = null;
  };
  while (i < text.length) {
    const ansiResult = extractAnsiCode(text, i);
    if (ansiResult) {
      pendingAnsi += ansiResult.code;
      i += ansiResult.length;
      continue;
    }
    let end = i;
    while (end < text.length && !extractAnsiCode(text, end)) {
      end++;
    }
    for (const { segment } of graphemeSegmenter.segment(text.slice(i, end))) {
      const segmentIsSpace = segment === " ";
      if (!segmentIsSpace && cjkBreakRegex.test(segment)) {
        flushCurrent();
        const token = pendingAnsi + segment;
        pendingAnsi = "";
        tokens.push(token);
        continue;
      }
      const segmentKind = segmentIsSpace ? "space" : "word";
      if (current && currentKind !== segmentKind) {
        flushCurrent();
      }
      if (pendingAnsi) {
        current += pendingAnsi;
        pendingAnsi = "";
      }
      currentKind = segmentKind;
      current += segment;
    }
    i = end;
  }
  if (pendingAnsi) {
    if (current) {
      current += pendingAnsi;
    } else if (tokens.length > 0) {
      tokens[tokens.length - 1] += pendingAnsi;
    } else {
      current = pendingAnsi;
    }
  }
  if (current) {
    tokens.push(current);
  }
  return tokens;
}
function wrapTextWithAnsi(text, width) {
  if (!text) {
    return [""];
  }
  const inputLines = text.split(/\r\n|\r|\n/);
  const result = [];
  const tracker = new AnsiCodeTracker();
  for (const inputLine of inputLines) {
    const prefix = result.length > 0 ? tracker.getActiveCodes() : "";
    const wrappedLines = wrapSingleLine(prefix + inputLine, width);
    for (const wrappedLine of wrappedLines) {
      result.push(wrappedLine);
    }
    updateTrackerFromText(inputLine, tracker);
  }
  return result.length > 0 ? result : [""];
}
function wrapSingleLine(line, width) {
  if (!line) {
    return [""];
  }
  const visibleLength = visibleWidth(line);
  if (visibleLength <= width) {
    return [line];
  }
  const wrapped = [];
  const tracker = new AnsiCodeTracker();
  const tokens = splitIntoTokensWithAnsi(line);
  let currentLine = "";
  let currentVisibleLength = 0;
  for (const token of tokens) {
    const tokenVisibleLength = visibleWidth(token);
    const isWhitespace = token.trim() === "";
    if (tokenVisibleLength > width && !isWhitespace) {
      if (currentLine) {
        const lineEndReset = tracker.getLineEndReset();
        if (lineEndReset) {
          currentLine += lineEndReset;
        }
        wrapped.push(currentLine);
        currentLine = "";
        currentVisibleLength = 0;
      }
      const broken = breakLongWord(token, width, tracker);
      for (let i = 0; i < broken.length - 1; i++) {
        wrapped.push(broken[i]);
      }
      currentLine = broken[broken.length - 1];
      currentVisibleLength = visibleWidth(currentLine);
      continue;
    }
    const totalNeeded = currentVisibleLength + tokenVisibleLength;
    if (totalNeeded > width && currentVisibleLength > 0) {
      let lineToWrap = currentLine.trimEnd();
      const lineEndReset = tracker.getLineEndReset();
      if (lineEndReset) {
        lineToWrap += lineEndReset;
      }
      wrapped.push(lineToWrap);
      if (isWhitespace) {
        currentLine = tracker.getActiveCodes();
        currentVisibleLength = 0;
      } else {
        currentLine = tracker.getActiveCodes() + token;
        currentVisibleLength = tokenVisibleLength;
      }
    } else {
      currentLine += token;
      currentVisibleLength += tokenVisibleLength;
    }
    updateTrackerFromText(token, tracker);
  }
  if (currentLine) {
    wrapped.push(currentLine);
  }
  return wrapped.length > 0 ? wrapped.map((line2) => line2.trimEnd()) : [""];
}
var PUNCTUATION_REGEX = /[(){}[\]<>.,;:'"!?+\-=*/\\|&%^$#@~`]/;
function isWhitespaceChar(char) {
  return /\s/.test(char);
}
function breakLongWord(word, width, tracker) {
  const lines = [];
  let currentLine = tracker.getActiveCodes();
  let currentWidth = 0;
  let i = 0;
  const segments = [];
  while (i < word.length) {
    const ansiResult = extractAnsiCode(word, i);
    if (ansiResult) {
      segments.push({ type: "ansi", value: ansiResult.code });
      i += ansiResult.length;
    } else {
      let end = i;
      while (end < word.length) {
        const nextAnsi = extractAnsiCode(word, end);
        if (nextAnsi)
          break;
        end++;
      }
      const textPortion = word.slice(i, end);
      for (const seg of graphemeSegmenter.segment(textPortion)) {
        segments.push({ type: "grapheme", value: seg.segment });
      }
      i = end;
    }
  }
  for (const seg of segments) {
    if (seg.type === "ansi") {
      currentLine += seg.value;
      tracker.process(seg.value);
      continue;
    }
    const grapheme = seg.value;
    if (!grapheme)
      continue;
    const graphemeWidth2 = visibleWidth(grapheme);
    if (currentWidth + graphemeWidth2 > width) {
      const lineEndReset = tracker.getLineEndReset();
      if (lineEndReset) {
        currentLine += lineEndReset;
      }
      lines.push(currentLine);
      currentLine = tracker.getActiveCodes();
      currentWidth = 0;
    }
    currentLine += grapheme;
    currentWidth += graphemeWidth2;
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.length > 0 ? lines : [""];
}
function applyBackgroundToLine(line, width, bgFn) {
  const visibleLen = visibleWidth(line);
  const paddingNeeded = Math.max(0, width - visibleLen);
  const padding = " ".repeat(paddingNeeded);
  const withPadding = line + padding;
  return bgFn(withPadding);
}
function truncateToWidth(text, maxWidth, ellipsis = "...", pad = false) {
  if (maxWidth <= 0) {
    return "";
  }
  if (text.length === 0) {
    return pad ? " ".repeat(maxWidth) : "";
  }
  const ellipsisWidth = visibleWidth(ellipsis);
  if (ellipsisWidth >= maxWidth) {
    const textWidth = visibleWidth(text);
    if (textWidth <= maxWidth) {
      return pad ? text + " ".repeat(maxWidth - textWidth) : text;
    }
    const clippedEllipsis = truncateFragmentToWidth(ellipsis, maxWidth);
    if (clippedEllipsis.width === 0) {
      return pad ? " ".repeat(maxWidth) : "";
    }
    return finalizeTruncatedResult("", 0, clippedEllipsis.text, clippedEllipsis.width, maxWidth, pad);
  }
  if (isPrintableAscii(text)) {
    if (text.length <= maxWidth) {
      return pad ? text + " ".repeat(maxWidth - text.length) : text;
    }
    const targetWidth2 = maxWidth - ellipsisWidth;
    return finalizeTruncatedResult(text.slice(0, targetWidth2), targetWidth2, ellipsis, ellipsisWidth, maxWidth, pad);
  }
  const targetWidth = maxWidth - ellipsisWidth;
  let result = "";
  let pendingAnsi = "";
  let visibleSoFar = 0;
  let keptWidth = 0;
  let keepContiguousPrefix = true;
  let overflowed = false;
  let exhaustedInput = false;
  const hasAnsi = text.includes("\x1B");
  const hasTabs = text.includes("	");
  if (!hasAnsi && !hasTabs) {
    for (const { segment } of graphemeSegmenter.segment(text)) {
      const width = graphemeWidth(segment);
      if (keepContiguousPrefix && keptWidth + width <= targetWidth) {
        result += segment;
        keptWidth += width;
      } else {
        keepContiguousPrefix = false;
      }
      visibleSoFar += width;
      if (visibleSoFar > maxWidth) {
        overflowed = true;
        break;
      }
    }
    exhaustedInput = !overflowed;
  } else {
    let i = 0;
    while (i < text.length) {
      const ansi = extractAnsiCode(text, i);
      if (ansi) {
        pendingAnsi += ansi.code;
        i += ansi.length;
        continue;
      }
      if (text[i] === "	") {
        if (keepContiguousPrefix && keptWidth + 3 <= targetWidth) {
          if (pendingAnsi) {
            result += pendingAnsi;
            pendingAnsi = "";
          }
          result += "	";
          keptWidth += 3;
        } else {
          keepContiguousPrefix = false;
          pendingAnsi = "";
        }
        visibleSoFar += 3;
        if (visibleSoFar > maxWidth) {
          overflowed = true;
          break;
        }
        i++;
        continue;
      }
      let end = i;
      while (end < text.length && text[end] !== "	") {
        const nextAnsi = extractAnsiCode(text, end);
        if (nextAnsi) {
          break;
        }
        end++;
      }
      for (const { segment } of graphemeSegmenter.segment(text.slice(i, end))) {
        const width = graphemeWidth(segment);
        if (keepContiguousPrefix && keptWidth + width <= targetWidth) {
          if (pendingAnsi) {
            result += pendingAnsi;
            pendingAnsi = "";
          }
          result += segment;
          keptWidth += width;
        } else {
          keepContiguousPrefix = false;
          pendingAnsi = "";
        }
        visibleSoFar += width;
        if (visibleSoFar > maxWidth) {
          overflowed = true;
          break;
        }
      }
      if (overflowed) {
        break;
      }
      i = end;
    }
    exhaustedInput = i >= text.length;
  }
  if (!overflowed && exhaustedInput) {
    return pad ? text + " ".repeat(Math.max(0, maxWidth - visibleSoFar)) : text;
  }
  return finalizeTruncatedResult(result, keptWidth, ellipsis, ellipsisWidth, maxWidth, pad);
}
function sliceByColumn(line, startCol, length, strict = false) {
  return sliceWithWidth(line, startCol, length, strict).text;
}
function sliceWithWidth(line, startCol, length, strict = false) {
  if (length <= 0)
    return { text: "", width: 0 };
  const endCol = startCol + length;
  let result = "", resultWidth = 0, currentCol = 0, i = 0, pendingAnsi = "";
  while (i < line.length) {
    const ansi = extractAnsiCode(line, i);
    if (ansi) {
      if (currentCol >= startCol && currentCol < endCol)
        result += ansi.code;
      else if (currentCol < startCol)
        pendingAnsi += ansi.code;
      i += ansi.length;
      continue;
    }
    let textEnd = i;
    while (textEnd < line.length && !extractAnsiCode(line, textEnd))
      textEnd++;
    for (const { segment } of graphemeSegmenter.segment(line.slice(i, textEnd))) {
      const w = graphemeWidth(segment);
      const inRange = currentCol >= startCol && currentCol < endCol;
      const fits = !strict || currentCol + w <= endCol;
      if (inRange && fits) {
        if (pendingAnsi) {
          result += pendingAnsi;
          pendingAnsi = "";
        }
        result += segment;
        resultWidth += w;
      }
      currentCol += w;
      if (currentCol >= endCol)
        break;
    }
    i = textEnd;
    if (currentCol >= endCol)
      break;
  }
  return { text: result, width: resultWidth };
}
var pooledStyleTracker = new AnsiCodeTracker();
function extractSegments(line, beforeEnd, afterStart, afterLen, strictAfter = false) {
  let before = "", beforeWidth = 0, after = "", afterWidth = 0;
  let currentCol = 0, i = 0;
  let pendingAnsiBefore = "";
  let afterStarted = false;
  const afterEnd = afterStart + afterLen;
  pooledStyleTracker.clear();
  while (i < line.length) {
    const ansi = extractAnsiCode(line, i);
    if (ansi) {
      pooledStyleTracker.process(ansi.code);
      if (currentCol < beforeEnd) {
        pendingAnsiBefore += ansi.code;
      } else if (currentCol >= afterStart && currentCol < afterEnd && afterStarted) {
        after += ansi.code;
      }
      i += ansi.length;
      continue;
    }
    let textEnd = i;
    while (textEnd < line.length && !extractAnsiCode(line, textEnd))
      textEnd++;
    for (const { segment } of graphemeSegmenter.segment(line.slice(i, textEnd))) {
      const w = graphemeWidth(segment);
      if (currentCol < beforeEnd && currentCol + w <= beforeEnd) {
        if (pendingAnsiBefore) {
          before += pendingAnsiBefore;
          pendingAnsiBefore = "";
        }
        before += segment;
        beforeWidth += w;
      } else if (currentCol >= afterStart && currentCol < afterEnd) {
        const fits = !strictAfter || currentCol + w <= afterEnd;
        if (fits) {
          if (!afterStarted) {
            after += pooledStyleTracker.getActiveCodes();
            afterStarted = true;
          }
          after += segment;
          afterWidth += w;
        }
      }
      currentCol += w;
      if (afterLen <= 0 ? currentCol >= beforeEnd : currentCol >= afterEnd)
        break;
    }
    i = textEnd;
    if (afterLen <= 0 ? currentCol >= beforeEnd : currentCol >= afterEnd)
      break;
  }
  return { before, beforeWidth, after, afterWidth };
}

// node_modules/@earendil-works/pi-tui/dist/autocomplete.js
var tokenStartRegex = new RegExp(`${autocompleteBoundaryRegex.source}$`, "u");

// node_modules/@earendil-works/pi-tui/dist/tui.js
import { performance } from "node:perf_hooks";

// node_modules/@earendil-works/pi-tui/dist/keys.js
var _kittyProtocolActive = false;
var SYMBOL_KEYS = /* @__PURE__ */ new Set([
  "`",
  "-",
  "=",
  "[",
  "]",
  "\\",
  ";",
  "'",
  ",",
  ".",
  "/",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "+",
  "|",
  "~",
  "{",
  "}",
  ":",
  "<",
  ">",
  "?"
]);
var MODIFIERS = {
  shift: 1,
  alt: 2,
  ctrl: 4,
  super: 8
};
var LOCK_MASK = 64 + 128;
var CODEPOINTS = {
  escape: 27,
  tab: 9,
  enter: 13,
  space: 32,
  backspace: 127,
  kpEnter: 57414
  // Numpad Enter (Kitty protocol)
};
var ARROW_CODEPOINTS = {
  up: -1,
  down: -2,
  right: -3,
  left: -4
};
var FUNCTIONAL_CODEPOINTS = {
  delete: -10,
  insert: -11,
  pageUp: -12,
  pageDown: -13,
  home: -14,
  end: -15
};
var KITTY_FUNCTIONAL_KEY_EQUIVALENTS = /* @__PURE__ */ new Map([
  [57399, 48],
  // KP_0 -> 0
  [57400, 49],
  // KP_1 -> 1
  [57401, 50],
  // KP_2 -> 2
  [57402, 51],
  // KP_3 -> 3
  [57403, 52],
  // KP_4 -> 4
  [57404, 53],
  // KP_5 -> 5
  [57405, 54],
  // KP_6 -> 6
  [57406, 55],
  // KP_7 -> 7
  [57407, 56],
  // KP_8 -> 8
  [57408, 57],
  // KP_9 -> 9
  [57409, 46],
  // KP_DECIMAL -> .
  [57410, 47],
  // KP_DIVIDE -> /
  [57411, 42],
  // KP_MULTIPLY -> *
  [57412, 45],
  // KP_SUBTRACT -> -
  [57413, 43],
  // KP_ADD -> +
  [57415, 61],
  // KP_EQUAL -> =
  [57416, 44],
  // KP_SEPARATOR -> ,
  [57417, ARROW_CODEPOINTS.left],
  [57418, ARROW_CODEPOINTS.right],
  [57419, ARROW_CODEPOINTS.up],
  [57420, ARROW_CODEPOINTS.down],
  [57421, FUNCTIONAL_CODEPOINTS.pageUp],
  [57422, FUNCTIONAL_CODEPOINTS.pageDown],
  [57423, FUNCTIONAL_CODEPOINTS.home],
  [57424, FUNCTIONAL_CODEPOINTS.end],
  [57425, FUNCTIONAL_CODEPOINTS.insert],
  [57426, FUNCTIONAL_CODEPOINTS.delete]
]);
function normalizeKittyFunctionalCodepoint(codepoint) {
  return KITTY_FUNCTIONAL_KEY_EQUIVALENTS.get(codepoint) ?? codepoint;
}
function normalizeShiftedLetterIdentityCodepoint(codepoint, modifier) {
  const effectiveModifier = modifier & ~LOCK_MASK;
  if ((effectiveModifier & MODIFIERS.shift) !== 0 && codepoint >= 65 && codepoint <= 90) {
    return codepoint + 32;
  }
  return codepoint;
}
var LEGACY_KEY_SEQUENCES = {
  up: ["\x1B[A", "\x1BOA"],
  down: ["\x1B[B", "\x1BOB"],
  right: ["\x1B[C", "\x1BOC"],
  left: ["\x1B[D", "\x1BOD"],
  home: ["\x1B[H", "\x1BOH", "\x1B[1~", "\x1B[7~"],
  end: ["\x1B[F", "\x1BOF", "\x1B[4~", "\x1B[8~"],
  insert: ["\x1B[2~"],
  delete: ["\x1B[3~"],
  pageUp: ["\x1B[5~", "\x1B[[5~"],
  pageDown: ["\x1B[6~", "\x1B[[6~"],
  clear: ["\x1B[E", "\x1BOE"],
  f1: ["\x1BOP", "\x1B[11~", "\x1B[[A"],
  f2: ["\x1BOQ", "\x1B[12~", "\x1B[[B"],
  f3: ["\x1BOR", "\x1B[13~", "\x1B[[C"],
  f4: ["\x1BOS", "\x1B[14~", "\x1B[[D"],
  f5: ["\x1B[15~", "\x1B[[E"],
  f6: ["\x1B[17~"],
  f7: ["\x1B[18~"],
  f8: ["\x1B[19~"],
  f9: ["\x1B[20~"],
  f10: ["\x1B[21~"],
  f11: ["\x1B[23~"],
  f12: ["\x1B[24~"]
};
var LEGACY_SHIFT_SEQUENCES = {
  up: ["\x1B[a"],
  down: ["\x1B[b"],
  right: ["\x1B[c"],
  left: ["\x1B[d"],
  clear: ["\x1B[e"],
  insert: ["\x1B[2$"],
  delete: ["\x1B[3$"],
  pageUp: ["\x1B[5$"],
  pageDown: ["\x1B[6$"],
  home: ["\x1B[7$"],
  end: ["\x1B[8$"]
};
var LEGACY_CTRL_SEQUENCES = {
  up: ["\x1BOa"],
  down: ["\x1BOb"],
  right: ["\x1BOc"],
  left: ["\x1BOd"],
  clear: ["\x1BOe"],
  insert: ["\x1B[2^"],
  delete: ["\x1B[3^"],
  pageUp: ["\x1B[5^"],
  pageDown: ["\x1B[6^"],
  home: ["\x1B[7^"],
  end: ["\x1B[8^"]
};
var matchesLegacySequence = (data, sequences) => sequences.includes(data);
var matchesLegacyModifierSequence = (data, key, modifier) => {
  if (modifier === MODIFIERS.shift) {
    return matchesLegacySequence(data, LEGACY_SHIFT_SEQUENCES[key]);
  }
  if (modifier === MODIFIERS.ctrl) {
    return matchesLegacySequence(data, LEGACY_CTRL_SEQUENCES[key]);
  }
  return false;
};
var _lastEventType = "press";
function isKeyRelease(data) {
  if (data.includes("\x1B[200~")) {
    return false;
  }
  if (data.includes(":3u") || data.includes(":3~") || data.includes(":3A") || data.includes(":3B") || data.includes(":3C") || data.includes(":3D") || data.includes(":3H") || data.includes(":3F")) {
    return true;
  }
  return false;
}
function parseEventType(eventTypeStr) {
  if (!eventTypeStr)
    return "press";
  const eventType = parseInt(eventTypeStr, 10);
  if (eventType === 2)
    return "repeat";
  if (eventType === 3)
    return "release";
  return "press";
}
function parseKittySequence(data) {
  const csiUMatch = data.match(/^\x1b\[(\d+)(?::(\d*))?(?::(\d+))?(?:;(\d+))?(?::(\d+))?u$/);
  if (csiUMatch) {
    const codepoint = parseInt(csiUMatch[1], 10);
    const shiftedKey = csiUMatch[2] && csiUMatch[2].length > 0 ? parseInt(csiUMatch[2], 10) : void 0;
    const baseLayoutKey = csiUMatch[3] ? parseInt(csiUMatch[3], 10) : void 0;
    const modValue = csiUMatch[4] ? parseInt(csiUMatch[4], 10) : 1;
    const eventType = parseEventType(csiUMatch[5]);
    _lastEventType = eventType;
    return { codepoint, shiftedKey, baseLayoutKey, modifier: modValue - 1, eventType };
  }
  const arrowMatch = data.match(/^\x1b\[1;(\d+)(?::(\d+))?([ABCD])$/);
  if (arrowMatch) {
    const modValue = parseInt(arrowMatch[1], 10);
    const eventType = parseEventType(arrowMatch[2]);
    const arrowCodes = { A: -1, B: -2, C: -3, D: -4 };
    _lastEventType = eventType;
    return { codepoint: arrowCodes[arrowMatch[3]], modifier: modValue - 1, eventType };
  }
  const funcMatch = data.match(/^\x1b\[(\d+)(?:;(\d+))?(?::(\d+))?~$/);
  if (funcMatch) {
    const keyNum = parseInt(funcMatch[1], 10);
    const modValue = funcMatch[2] ? parseInt(funcMatch[2], 10) : 1;
    const eventType = parseEventType(funcMatch[3]);
    const funcCodes = {
      2: FUNCTIONAL_CODEPOINTS.insert,
      3: FUNCTIONAL_CODEPOINTS.delete,
      5: FUNCTIONAL_CODEPOINTS.pageUp,
      6: FUNCTIONAL_CODEPOINTS.pageDown,
      7: FUNCTIONAL_CODEPOINTS.home,
      8: FUNCTIONAL_CODEPOINTS.end
    };
    const codepoint = funcCodes[keyNum];
    if (codepoint !== void 0) {
      _lastEventType = eventType;
      return { codepoint, modifier: modValue - 1, eventType };
    }
  }
  const homeEndMatch = data.match(/^\x1b\[1;(\d+)(?::(\d+))?([HF])$/);
  if (homeEndMatch) {
    const modValue = parseInt(homeEndMatch[1], 10);
    const eventType = parseEventType(homeEndMatch[2]);
    const codepoint = homeEndMatch[3] === "H" ? FUNCTIONAL_CODEPOINTS.home : FUNCTIONAL_CODEPOINTS.end;
    _lastEventType = eventType;
    return { codepoint, modifier: modValue - 1, eventType };
  }
  return null;
}
function matchesKittySequence(data, expectedCodepoint, expectedModifier) {
  const parsed = parseKittySequence(data);
  if (!parsed)
    return false;
  const actualMod = parsed.modifier & ~LOCK_MASK;
  const expectedMod = expectedModifier & ~LOCK_MASK;
  if (actualMod !== expectedMod)
    return false;
  const normalizedCodepoint = normalizeShiftedLetterIdentityCodepoint(normalizeKittyFunctionalCodepoint(parsed.codepoint), parsed.modifier);
  const normalizedExpectedCodepoint = normalizeShiftedLetterIdentityCodepoint(normalizeKittyFunctionalCodepoint(expectedCodepoint), expectedModifier);
  if (normalizedCodepoint === normalizedExpectedCodepoint)
    return true;
  if (parsed.baseLayoutKey !== void 0 && parsed.baseLayoutKey === expectedCodepoint) {
    const cp = normalizedCodepoint;
    const isLatinLetter = cp >= 97 && cp <= 122;
    const isKnownSymbol = SYMBOL_KEYS.has(String.fromCharCode(cp));
    if (!isLatinLetter && !isKnownSymbol)
      return true;
  }
  return false;
}
function parseModifyOtherKeysSequence(data) {
  const match = data.match(/^\x1b\[27;(\d+);(\d+)~$/);
  if (!match)
    return null;
  const modValue = parseInt(match[1], 10);
  const codepoint = parseInt(match[2], 10);
  return { codepoint, modifier: modValue - 1 };
}
function matchesModifyOtherKeys(data, expectedKeycode, expectedModifier) {
  const parsed = parseModifyOtherKeysSequence(data);
  if (!parsed)
    return false;
  return parsed.codepoint === expectedKeycode && parsed.modifier === expectedModifier;
}
function isWindowsTerminalSession() {
  return Boolean(process.env.WT_SESSION) && !process.env.SSH_CONNECTION && !process.env.SSH_CLIENT && !process.env.SSH_TTY;
}
function matchesRawBackspace(data, expectedModifier) {
  if (data === "\x7F")
    return expectedModifier === 0;
  if (data !== "\b")
    return false;
  return isWindowsTerminalSession() ? expectedModifier === MODIFIERS.ctrl : expectedModifier === 0;
}
function rawCtrlChar(key) {
  const char = key.toLowerCase();
  const code = char.charCodeAt(0);
  if (code >= 97 && code <= 122 || char === "[" || char === "\\" || char === "]" || char === "_") {
    return String.fromCharCode(code & 31);
  }
  if (char === "-") {
    return String.fromCharCode(31);
  }
  return null;
}
function isDigitKey(key) {
  return key >= "0" && key <= "9";
}
function matchesPrintableModifyOtherKeys(data, expectedKeycode, expectedModifier) {
  if (expectedModifier === 0)
    return false;
  const parsed = parseModifyOtherKeysSequence(data);
  if (!parsed || parsed.modifier !== expectedModifier)
    return false;
  return normalizeShiftedLetterIdentityCodepoint(parsed.codepoint, parsed.modifier) === normalizeShiftedLetterIdentityCodepoint(expectedKeycode, expectedModifier);
}
function parseKeyId(keyId) {
  const parts = keyId.toLowerCase().split("+");
  const key = parts[parts.length - 1];
  if (!key)
    return null;
  return {
    key,
    ctrl: parts.includes("ctrl"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
    super: parts.includes("super")
  };
}
function matchesKey(data, keyId) {
  const parsed = parseKeyId(keyId);
  if (!parsed)
    return false;
  const { key, ctrl, shift, alt, super: superModifier } = parsed;
  let modifier = 0;
  if (shift)
    modifier |= MODIFIERS.shift;
  if (alt)
    modifier |= MODIFIERS.alt;
  if (ctrl)
    modifier |= MODIFIERS.ctrl;
  if (superModifier)
    modifier |= MODIFIERS.super;
  switch (key) {
    case "escape":
    case "esc":
      if (modifier !== 0)
        return false;
      return data === "\x1B" || matchesKittySequence(data, CODEPOINTS.escape, 0) || matchesModifyOtherKeys(data, CODEPOINTS.escape, 0);
    case "space":
      if (!_kittyProtocolActive) {
        if (modifier === MODIFIERS.ctrl && data === "\0") {
          return true;
        }
        if (modifier === MODIFIERS.alt && data === "\x1B ") {
          return true;
        }
      }
      if (modifier === 0) {
        return data === " " || matchesKittySequence(data, CODEPOINTS.space, 0) || matchesModifyOtherKeys(data, CODEPOINTS.space, 0);
      }
      return matchesKittySequence(data, CODEPOINTS.space, modifier) || matchesModifyOtherKeys(data, CODEPOINTS.space, modifier);
    case "tab":
      if (modifier === MODIFIERS.shift) {
        return data === "\x1B[Z" || matchesKittySequence(data, CODEPOINTS.tab, MODIFIERS.shift) || matchesModifyOtherKeys(data, CODEPOINTS.tab, MODIFIERS.shift);
      }
      if (modifier === 0) {
        return data === "	" || matchesKittySequence(data, CODEPOINTS.tab, 0);
      }
      return matchesKittySequence(data, CODEPOINTS.tab, modifier) || matchesModifyOtherKeys(data, CODEPOINTS.tab, modifier);
    case "enter":
    case "return":
      if (modifier === MODIFIERS.shift) {
        if (matchesKittySequence(data, CODEPOINTS.enter, MODIFIERS.shift) || matchesKittySequence(data, CODEPOINTS.kpEnter, MODIFIERS.shift)) {
          return true;
        }
        if (matchesModifyOtherKeys(data, CODEPOINTS.enter, MODIFIERS.shift)) {
          return true;
        }
        if (_kittyProtocolActive) {
          return data === "\x1B\r" || data === "\n";
        }
        return false;
      }
      if (modifier === MODIFIERS.alt) {
        if (matchesKittySequence(data, CODEPOINTS.enter, MODIFIERS.alt) || matchesKittySequence(data, CODEPOINTS.kpEnter, MODIFIERS.alt)) {
          return true;
        }
        if (matchesModifyOtherKeys(data, CODEPOINTS.enter, MODIFIERS.alt)) {
          return true;
        }
        if (!_kittyProtocolActive) {
          return data === "\x1B\r";
        }
        return false;
      }
      if (modifier === 0) {
        return data === "\r" || !_kittyProtocolActive && data === "\n" || data === "\x1BOM" || // SS3 M (numpad enter in some terminals)
        matchesKittySequence(data, CODEPOINTS.enter, 0) || matchesKittySequence(data, CODEPOINTS.kpEnter, 0);
      }
      return matchesKittySequence(data, CODEPOINTS.enter, modifier) || matchesKittySequence(data, CODEPOINTS.kpEnter, modifier) || matchesModifyOtherKeys(data, CODEPOINTS.enter, modifier);
    case "backspace":
      if (modifier === MODIFIERS.alt) {
        if (data === "\x1B\x7F" || data === "\x1B\b") {
          return true;
        }
        return matchesKittySequence(data, CODEPOINTS.backspace, MODIFIERS.alt) || matchesModifyOtherKeys(data, CODEPOINTS.backspace, MODIFIERS.alt);
      }
      if (modifier === MODIFIERS.ctrl) {
        if (matchesRawBackspace(data, MODIFIERS.ctrl))
          return true;
        return matchesKittySequence(data, CODEPOINTS.backspace, MODIFIERS.ctrl) || matchesModifyOtherKeys(data, CODEPOINTS.backspace, MODIFIERS.ctrl);
      }
      if (modifier === 0) {
        return matchesRawBackspace(data, 0) || matchesKittySequence(data, CODEPOINTS.backspace, 0) || matchesModifyOtherKeys(data, CODEPOINTS.backspace, 0);
      }
      return matchesKittySequence(data, CODEPOINTS.backspace, modifier) || matchesModifyOtherKeys(data, CODEPOINTS.backspace, modifier);
    case "insert":
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.insert) || matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.insert, 0);
      }
      if (matchesLegacyModifierSequence(data, "insert", modifier)) {
        return true;
      }
      return matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.insert, modifier);
    case "delete":
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.delete) || matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.delete, 0);
      }
      if (matchesLegacyModifierSequence(data, "delete", modifier)) {
        return true;
      }
      return matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.delete, modifier);
    case "clear":
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.clear);
      }
      return matchesLegacyModifierSequence(data, "clear", modifier);
    case "home":
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.home) || matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.home, 0);
      }
      if (matchesLegacyModifierSequence(data, "home", modifier)) {
        return true;
      }
      return matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.home, modifier);
    case "end":
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.end) || matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.end, 0);
      }
      if (matchesLegacyModifierSequence(data, "end", modifier)) {
        return true;
      }
      return matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.end, modifier);
    case "pageup":
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.pageUp) || matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.pageUp, 0);
      }
      if (matchesLegacyModifierSequence(data, "pageUp", modifier)) {
        return true;
      }
      return matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.pageUp, modifier);
    case "pagedown":
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.pageDown) || matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.pageDown, 0);
      }
      if (matchesLegacyModifierSequence(data, "pageDown", modifier)) {
        return true;
      }
      return matchesKittySequence(data, FUNCTIONAL_CODEPOINTS.pageDown, modifier);
    case "up":
      if (modifier === MODIFIERS.alt) {
        return data === "\x1Bp" || matchesKittySequence(data, ARROW_CODEPOINTS.up, MODIFIERS.alt);
      }
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.up) || matchesKittySequence(data, ARROW_CODEPOINTS.up, 0);
      }
      if (matchesLegacyModifierSequence(data, "up", modifier)) {
        return true;
      }
      return matchesKittySequence(data, ARROW_CODEPOINTS.up, modifier);
    case "down":
      if (modifier === MODIFIERS.alt) {
        return data === "\x1Bn" || matchesKittySequence(data, ARROW_CODEPOINTS.down, MODIFIERS.alt);
      }
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.down) || matchesKittySequence(data, ARROW_CODEPOINTS.down, 0);
      }
      if (matchesLegacyModifierSequence(data, "down", modifier)) {
        return true;
      }
      return matchesKittySequence(data, ARROW_CODEPOINTS.down, modifier);
    case "left":
      if (modifier === MODIFIERS.alt) {
        return data === "\x1B[1;3D" || !_kittyProtocolActive && data === "\x1BB" || data === "\x1Bb" || matchesKittySequence(data, ARROW_CODEPOINTS.left, MODIFIERS.alt);
      }
      if (modifier === MODIFIERS.ctrl) {
        return data === "\x1B[1;5D" || matchesLegacyModifierSequence(data, "left", MODIFIERS.ctrl) || matchesKittySequence(data, ARROW_CODEPOINTS.left, MODIFIERS.ctrl);
      }
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.left) || matchesKittySequence(data, ARROW_CODEPOINTS.left, 0);
      }
      if (matchesLegacyModifierSequence(data, "left", modifier)) {
        return true;
      }
      return matchesKittySequence(data, ARROW_CODEPOINTS.left, modifier);
    case "right":
      if (modifier === MODIFIERS.alt) {
        return data === "\x1B[1;3C" || !_kittyProtocolActive && data === "\x1BF" || data === "\x1Bf" || matchesKittySequence(data, ARROW_CODEPOINTS.right, MODIFIERS.alt);
      }
      if (modifier === MODIFIERS.ctrl) {
        return data === "\x1B[1;5C" || matchesLegacyModifierSequence(data, "right", MODIFIERS.ctrl) || matchesKittySequence(data, ARROW_CODEPOINTS.right, MODIFIERS.ctrl);
      }
      if (modifier === 0) {
        return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES.right) || matchesKittySequence(data, ARROW_CODEPOINTS.right, 0);
      }
      if (matchesLegacyModifierSequence(data, "right", modifier)) {
        return true;
      }
      return matchesKittySequence(data, ARROW_CODEPOINTS.right, modifier);
    case "f1":
    case "f2":
    case "f3":
    case "f4":
    case "f5":
    case "f6":
    case "f7":
    case "f8":
    case "f9":
    case "f10":
    case "f11":
    case "f12": {
      if (modifier !== 0) {
        return false;
      }
      const functionKey = key;
      return matchesLegacySequence(data, LEGACY_KEY_SEQUENCES[functionKey]);
    }
  }
  if (key.length === 1 && (key >= "a" && key <= "z" || isDigitKey(key) || SYMBOL_KEYS.has(key))) {
    const codepoint = key.charCodeAt(0);
    const rawCtrl = rawCtrlChar(key);
    const isLetter = key >= "a" && key <= "z";
    const isDigit = isDigitKey(key);
    if (modifier === MODIFIERS.ctrl + MODIFIERS.alt && !_kittyProtocolActive && rawCtrl) {
      if (data === `\x1B${rawCtrl}`)
        return true;
    }
    if (modifier === MODIFIERS.alt && !_kittyProtocolActive && (isLetter || isDigit || SYMBOL_KEYS.has(key))) {
      if (data === `\x1B${key}`)
        return true;
    }
    if (modifier === MODIFIERS.ctrl) {
      if (rawCtrl && data === rawCtrl)
        return true;
      return matchesKittySequence(data, codepoint, MODIFIERS.ctrl) || matchesPrintableModifyOtherKeys(data, codepoint, MODIFIERS.ctrl);
    }
    if (modifier === MODIFIERS.shift + MODIFIERS.ctrl) {
      return matchesKittySequence(data, codepoint, MODIFIERS.shift + MODIFIERS.ctrl) || matchesPrintableModifyOtherKeys(data, codepoint, MODIFIERS.shift + MODIFIERS.ctrl);
    }
    if (modifier === MODIFIERS.shift) {
      if (isLetter && data === key.toUpperCase())
        return true;
      return matchesKittySequence(data, codepoint, MODIFIERS.shift) || matchesPrintableModifyOtherKeys(data, codepoint, MODIFIERS.shift);
    }
    if (modifier !== 0) {
      return matchesKittySequence(data, codepoint, modifier) || matchesPrintableModifyOtherKeys(data, codepoint, modifier);
    }
    return data === key || matchesKittySequence(data, codepoint, 0);
  }
  return false;
}
var KITTY_CSI_U_REGEX = /^\x1b\[(\d+)(?::(\d*))?(?::(\d+))?(?:;(\d+))?(?::(\d+))?u$/;
var KITTY_PRINTABLE_ALLOWED_MODIFIERS = MODIFIERS.shift | LOCK_MASK;
function decodeKittyPrintable(data) {
  const match = data.match(KITTY_CSI_U_REGEX);
  if (!match)
    return void 0;
  const codepoint = Number.parseInt(match[1] ?? "", 10);
  if (!Number.isFinite(codepoint))
    return void 0;
  const shiftedKey = match[2] && match[2].length > 0 ? Number.parseInt(match[2], 10) : void 0;
  const modValue = match[4] ? Number.parseInt(match[4], 10) : 1;
  const modifier = Number.isFinite(modValue) ? modValue - 1 : 0;
  if ((modifier & ~KITTY_PRINTABLE_ALLOWED_MODIFIERS) !== 0)
    return void 0;
  if (modifier & (MODIFIERS.alt | MODIFIERS.ctrl))
    return void 0;
  let effectiveCodepoint = codepoint;
  if (modifier & MODIFIERS.shift && typeof shiftedKey === "number") {
    effectiveCodepoint = shiftedKey;
  }
  effectiveCodepoint = normalizeKittyFunctionalCodepoint(effectiveCodepoint);
  if (!Number.isFinite(effectiveCodepoint) || effectiveCodepoint < 32)
    return void 0;
  try {
    return String.fromCodePoint(effectiveCodepoint);
  } catch {
    return void 0;
  }
}

// node_modules/@earendil-works/pi-tui/dist/terminal-colors.js
function hexToRgb(hex) {
  const normalized = hex.startsWith("#") ? hex.slice(1) : hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b2 = parseInt(normalized.slice(4, 6), 16);
  return { r, g, b: b2 };
}
function parseOscHexChannel(channel) {
  if (!/^[0-9a-f]+$/i.test(channel)) {
    return void 0;
  }
  const max = 16 ** channel.length - 1;
  if (max <= 0) {
    return void 0;
  }
  return Math.round(parseInt(channel, 16) / max * 255);
}
var OSC11_BACKGROUND_COLOR_RESPONSE_PATTERN = /^\x1b\]11;([^\x07\x1b]*)(?:\x07|\x1b\\)$/i;
var COLOR_SCHEME_REPORT_PATTERN = /^(?:\x1b\[\?997;(1|2)n)+$/;
function isOsc11BackgroundColorResponse(data) {
  return OSC11_BACKGROUND_COLOR_RESPONSE_PATTERN.test(data);
}
function parseOsc11BackgroundColor(data) {
  const match = data.match(OSC11_BACKGROUND_COLOR_RESPONSE_PATTERN);
  if (!match) {
    return void 0;
  }
  const value = match[1].trim();
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (/^[0-9a-f]{6}$/i.test(hex)) {
      return hexToRgb(value);
    }
    if (/^[0-9a-f]{12}$/i.test(hex)) {
      const r2 = parseOscHexChannel(hex.slice(0, 4));
      const g2 = parseOscHexChannel(hex.slice(4, 8));
      const b3 = parseOscHexChannel(hex.slice(8, 12));
      return r2 !== void 0 && g2 !== void 0 && b3 !== void 0 ? { r: r2, g: g2, b: b3 } : void 0;
    }
    return void 0;
  }
  const rgbValue = value.replace(/^rgba?:/i, "");
  const [red, green, blue] = rgbValue.split("/");
  if (red === void 0 || green === void 0 || blue === void 0) {
    return void 0;
  }
  const r = parseOscHexChannel(red);
  const g = parseOscHexChannel(green);
  const b2 = parseOscHexChannel(blue);
  return r !== void 0 && g !== void 0 && b2 !== void 0 ? { r, g, b: b2 } : void 0;
}
function parseTerminalColorSchemeReport(data) {
  const match = data.match(COLOR_SCHEME_REPORT_PATTERN);
  if (!match) {
    return void 0;
  }
  return match[1] === "2" ? "light" : "dark";
}

// node_modules/@earendil-works/pi-tui/dist/terminal-image.js
import { execSync } from "node:child_process";
var cachedCapabilities = null;
var capabilityOverrides = {};
var cellDimensions = { widthPx: 9, heightPx: 18 };
function setCellDimensions(dims) {
  cellDimensions = dims;
}
function probeTmuxHyperlinks() {
  try {
    const termfeatures = execSync("tmux display-message -p '#{client_termfeatures}'", {
      encoding: "utf8",
      timeout: 250,
      stdio: ["ignore", "pipe", "ignore"]
    });
    return termfeatures.split(",").map((feature) => feature.trim()).includes("hyperlinks");
  } catch {
    return false;
  }
}
function detectCapabilitiesFromEnvironment(tmuxForwardsHyperlink) {
  const termProgram = process.env.TERM_PROGRAM?.toLowerCase() || "";
  const terminalEmulator = process.env.TERMINAL_EMULATOR?.toLowerCase() || "";
  const term = process.env.TERM?.toLowerCase() || "";
  const colorTerm = process.env.COLORTERM?.toLowerCase() || "";
  const hasTrueColorHint = colorTerm === "truecolor" || colorTerm === "24bit";
  const isWindowsConsole = process.platform === "win32";
  if (process.env.TMUX || term.startsWith("tmux")) {
    return { images: null, trueColor: hasTrueColorHint, hyperlinks: tmuxForwardsHyperlink() };
  }
  if (term.startsWith("screen")) {
    return { images: null, trueColor: hasTrueColorHint, hyperlinks: false };
  }
  if (process.env.KITTY_WINDOW_ID || termProgram === "kitty") {
    return { images: "kitty", trueColor: true, hyperlinks: true };
  }
  if (termProgram === "ghostty" || term.includes("ghostty") || process.env.GHOSTTY_RESOURCES_DIR) {
    return { images: "kitty", trueColor: true, hyperlinks: true };
  }
  if (process.env.WEZTERM_PANE || termProgram === "wezterm") {
    return { images: "kitty", trueColor: true, hyperlinks: true };
  }
  if (termProgram === "warpterminal" || process.env.WARP_SESSION_ID || process.env.WARP_TERMINAL_SESSION_UUID) {
    return { images: "kitty", trueColor: true, hyperlinks: true };
  }
  if (process.env.ITERM_SESSION_ID || termProgram === "iterm.app") {
    return { images: "iterm2", trueColor: true, hyperlinks: true };
  }
  if (process.env.WT_SESSION) {
    return { images: null, trueColor: true, hyperlinks: true };
  }
  if (termProgram === "alacritty" || termProgram === "vscode" || termProgram === "zed") {
    return { images: null, trueColor: true, hyperlinks: true };
  }
  if (terminalEmulator === "jetbrains-jediterm") {
    return { images: null, trueColor: true, hyperlinks: false };
  }
  if (isWindowsConsole) {
    return { images: null, trueColor: true, hyperlinks: false };
  }
  return { images: null, trueColor: hasTrueColorHint, hyperlinks: false };
}
function parseBooleanCapabilityOverride(value) {
  return value === "1" ? true : value === "0" ? false : void 0;
}
function detectCapabilities(tmuxForwardsHyperlink = probeTmuxHyperlinks) {
  const hyperlinks = parseBooleanCapabilityOverride(process.env.PI_HYPERLINKS);
  const detected = detectCapabilitiesFromEnvironment(hyperlinks === void 0 ? tmuxForwardsHyperlink : () => hyperlinks);
  const imageProtocol = process.env.PI_IMAGE_PROTOCOL?.toLowerCase();
  const images = imageProtocol === "kitty" || imageProtocol === "iterm2" ? imageProtocol : imageProtocol === "none" || imageProtocol === "0" ? null : void 0;
  const trueColor = parseBooleanCapabilityOverride(process.env.PI_TRUE_COLOR);
  return {
    ...detected,
    ...images !== void 0 ? { images } : {},
    ...trueColor !== void 0 ? { trueColor } : {},
    ...hyperlinks !== void 0 ? { hyperlinks } : {}
  };
}
function getCapabilities() {
  if (!cachedCapabilities) {
    const hyperlinks = capabilityOverrides.hyperlinks;
    cachedCapabilities = {
      ...detectCapabilities(hyperlinks === void 0 ? void 0 : () => hyperlinks),
      ...capabilityOverrides
    };
  }
  return cachedCapabilities;
}
function setCapabilities(caps) {
  cachedCapabilities = caps;
}
var KITTY_PREFIX = "\x1B_G";
var ITERM2_PREFIX = "\x1B]1337;File=";
function isImageLine(line) {
  if (line.startsWith(KITTY_PREFIX) || line.startsWith(ITERM2_PREFIX)) {
    return true;
  }
  return line.includes(KITTY_PREFIX) || line.includes(ITERM2_PREFIX);
}
function deleteKittyImage(imageId) {
  return `\x1B_Ga=d,d=I,i=${imageId},q=2\x1B\\`;
}
function deleteAllKittyImages() {
  return "\x1B_Ga=d,d=A,q=2\x1B\\";
}
function deleteAllKittyPlacements() {
  return "\x1B_Ga=d,d=a,q=2\x1B\\";
}
var kittyImageMetadata = /* @__PURE__ */ new Map();
function getRegisteredKittyImageMetadata(line) {
  const controls = /\x1b_G([^;]*);/.exec(line)?.[1];
  if (!controls)
    return void 0;
  const imageId = /(?:^|,)i=(\d+)(?:,|$)/.exec(controls)?.[1];
  return imageId === void 0 ? void 0 : kittyImageMetadata.get(Number.parseInt(imageId, 10));
}
function getKittyImageMetadata(line) {
  const metadata = getRegisteredKittyImageMetadata(line);
  if (!metadata)
    return void 0;
  return {
    imageId: metadata.imageId,
    columns: metadata.columns,
    rows: metadata.rows,
    widthPx: metadata.widthPx,
    heightPx: metadata.heightPx
  };
}
var KITTY_PLACEMENT_CONTROL_KEYS = /* @__PURE__ */ new Set([
  "i",
  "p",
  "x",
  "y",
  "w",
  "h",
  "X",
  "Y",
  "c",
  "r",
  "C",
  "U",
  "z",
  "P",
  "Q",
  "H",
  "V"
]);
function getKittyImagePlacement(line) {
  const match = /\x1b_G([^;]*);/.exec(line);
  const metadata = getRegisteredKittyImageMetadata(line);
  if (!match || !metadata)
    return void 0;
  let commandStart = match.index;
  let commandControls = match[1];
  let transmissionEnd;
  while (true) {
    const terminator = line.indexOf("\x1B\\", commandStart + KITTY_PREFIX.length);
    if (terminator === -1)
      return void 0;
    transmissionEnd = terminator + 2;
    if (!/(?:^|,)m=1(?:,|$)/.test(commandControls))
      break;
    commandStart = transmissionEnd;
    if (!line.startsWith(KITTY_PREFIX, commandStart))
      return void 0;
    const controlsEnd = line.indexOf(";", commandStart + KITTY_PREFIX.length);
    if (controlsEnd === -1)
      return void 0;
    commandControls = line.slice(commandStart + KITTY_PREFIX.length, controlsEnd);
  }
  const controls = match[1].split(",").filter((control) => KITTY_PLACEMENT_CONTROL_KEYS.has(control.split("=", 1)[0] ?? ""));
  const sequence = `\x1B_Ga=p,q=2,${controls.join(",")}\x1B\\`;
  return {
    imageId: metadata.imageId,
    transmissionGeneration: metadata.transmissionGeneration,
    transmissionBytes: transmissionEnd - match.index,
    estimatedDecodedBytes: metadata.widthPx * metadata.heightPx * 4,
    sequence,
    replacementLine: `${line.slice(0, match.index)}${sequence}${line.slice(transmissionEnd)}`
  };
}
function cropKittyImageLine(line, hiddenRows, visibleRows) {
  const metadata = getKittyImageMetadata(line);
  const match = /\x1b_G([^;]*);/.exec(line);
  if (!metadata || !match || hiddenRows < 0 || hiddenRows >= metadata.rows || visibleRows <= 0)
    return line;
  const croppedRows = Math.min(visibleRows, metadata.rows - hiddenRows);
  if (hiddenRows === 0 && croppedRows === metadata.rows)
    return line;
  const sourceY = Math.floor(metadata.heightPx * hiddenRows / metadata.rows);
  const sourceEnd = Math.ceil(metadata.heightPx * (hiddenRows + croppedRows) / metadata.rows);
  const sourceHeight = Math.max(1, Math.min(metadata.heightPx, sourceEnd) - sourceY);
  const controls = match[1].split(",").filter((control) => !/^[yhr]=/.test(control));
  controls.push(`y=${sourceY}`, `h=${sourceHeight}`, `r=${croppedRows}`);
  return `${line.slice(0, match.index)}\x1B_G${controls.join(",")};${line.slice(match.index + match[0].length)}`;
}
function hyperlink(text, url) {
  return `\x1B]8;;${url}\x1B\\${text}\x1B]8;;\x1B\\`;
}

// node_modules/@earendil-works/pi-tui/dist/tui.js
function dispatchMouseEvent(component, event) {
  const result = component.handleMouse?.(event);
  if (!result)
    return void 0;
  if ("target" in result)
    return result;
  if (!result.handled && !result.capture && !result.focus)
    return void 0;
  return {
    ...result,
    handled: true,
    ...result.focus ? { focusTarget: component } : {},
    target: {
      component,
      originX: event.screenX - event.x,
      originY: event.screenY - event.y,
      width: event.width,
      height: event.height
    }
  };
}
function retargetMouseEvent(event, target) {
  return {
    ...event,
    x: event.screenX - target.originX,
    y: event.screenY - target.originY,
    width: target.width,
    height: target.height
  };
}
function isFocusable(component) {
  return component !== null && "focused" in component;
}
var CURSOR_MARKER = "\x1B_pi:c\x07";
function parseSizeValue(value, referenceSize) {
  if (value === void 0)
    return void 0;
  if (typeof value === "number")
    return value;
  const match = value.match(/^(\d+(?:\.\d+)?)%$/);
  if (match) {
    return Math.floor(referenceSize * parseFloat(match[1]) / 100);
  }
  return void 0;
}
var Container = class {
  children = [];
  mouseLayout;
  addChild(component) {
    this.children.push(component);
  }
  removeChild(component) {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
  clear() {
    this.children = [];
  }
  invalidate() {
    for (const child of this.children) {
      child.invalidate?.();
    }
  }
  handleMouse(event) {
    if (event.y < 0 || event.y >= event.height)
      return void 0;
    const mouseChildren = this.mouseLayout?.width === event.width ? this.mouseLayout.children : this.children.map((component) => ({ component, height: component.render(event.width).length }));
    let childY = 0;
    for (const { component: child, height: childHeight } of mouseChildren) {
      if (event.y >= childY && event.y < childY + childHeight) {
        const result = dispatchMouseEvent(child, {
          ...event,
          y: event.y - childY,
          height: childHeight
        });
        if (result?.focus && this.handleInput)
          return { ...result, focusTarget: this };
        return result;
      }
      childY += childHeight;
    }
    return void 0;
  }
  render(width) {
    const lines = [];
    const mouseChildren = [];
    for (const child of this.children) {
      const childLines = child.render(width);
      mouseChildren.push({ component: child, height: childLines.length });
      for (const line of childLines) {
        lines.push(line);
      }
    }
    this.mouseLayout = { width, children: mouseChildren };
    return lines;
  }
};
var SEGMENT_RESET = "\x1B[0m\x1B]8;;\x07";
function compositeTuiLine(baseLine, overlayLine, startCol, overlayWidth, totalWidth) {
  if (isImageLine(baseLine))
    return baseLine;
  const afterStart = startCol + overlayWidth;
  const base = extractSegments(baseLine, startCol, afterStart, totalWidth - afterStart, true);
  const overlay = sliceWithWidth(overlayLine, 0, overlayWidth, true);
  const beforePad = Math.max(0, startCol - base.beforeWidth);
  const overlayPad = Math.max(0, overlayWidth - overlay.width);
  const actualBeforeWidth = Math.max(startCol, base.beforeWidth);
  const actualOverlayWidth = Math.max(overlayWidth, overlay.width);
  const afterTarget = Math.max(0, totalWidth - actualBeforeWidth - actualOverlayWidth);
  const afterPad = Math.max(0, afterTarget - base.afterWidth);
  const result = base.before + " ".repeat(beforePad) + SEGMENT_RESET + overlay.text + " ".repeat(overlayPad) + SEGMENT_RESET + base.after + " ".repeat(afterPad);
  return visibleWidth(result) <= totalWidth ? result : sliceByColumn(result, 0, totalWidth, true);
}
var VIEWPORT_TUI = /* @__PURE__ */ Symbol.for("@earendil-works/pi-tui/viewport");
var TuiBase = class _TuiBase extends Container {
  terminal;
  focusedComponent = null;
  inputListeners = /* @__PURE__ */ new Set();
  /** Global callback for debug key (Shift+Ctrl+D). Called before input is forwarded to focused component. */
  onDebug;
  renderRequested = false;
  immediateRenderScheduled = false;
  renderTimer;
  lastRenderAt = 0;
  static MIN_RENDER_INTERVAL_MS = 16;
  showHardwareCursor = false;
  clearOnShrink = false;
  fullRedrawCount = 0;
  stopped = false;
  pendingOsc11BackgroundReplies = 0;
  pendingOsc11BackgroundQueries = [];
  terminalColorSchemeListeners = /* @__PURE__ */ new Set();
  terminalColorSchemeNotificationsEnabled = false;
  /** Directory for debug/crash logs. When undefined, debug logging is disabled and crash dumps fall back to the OS temp directory. */
  logDirectory;
  // Overlay stack for modal components rendered on top of base content
  focusOrderCounter = 0;
  overlayStack = [];
  renderedOverlayLayouts = [];
  get hasOverlayEntries() {
    return this.overlayStack.length > 0;
  }
  overlayFocusRestore = { status: "inactive" };
  constructor(terminal, showHardwareCursor, logDirectory) {
    super();
    this.terminal = terminal;
    this.logDirectory = logDirectory;
    if (showHardwareCursor !== void 0) {
      this.showHardwareCursor = showHardwareCursor;
    }
  }
  resetRenderState() {
  }
  beforeTerminalStart() {
  }
  afterTerminalStart() {
  }
  beforeTerminalStop(_options) {
  }
  afterTerminalStop(_options) {
  }
  get fullRedraws() {
    return this.fullRedrawCount;
  }
  getShowHardwareCursor() {
    return this.showHardwareCursor;
  }
  setShowHardwareCursor(enabled) {
    if (this.showHardwareCursor === enabled)
      return;
    this.showHardwareCursor = enabled;
    if (!enabled) {
      this.terminal.hideCursor();
    }
    this.requestRender();
  }
  getClearOnShrink() {
    return this.clearOnShrink;
  }
  /**
   * Set whether to trigger full re-render when content shrinks.
   * When true, empty rows are cleared when content shrinks.
   * When false (default), empty rows remain (reduces redraws on slower terminals).
   */
  setClearOnShrink(enabled) {
    this.clearOnShrink = enabled;
  }
  getFocusedComponent() {
    return this.focusedComponent;
  }
  setFocus(component) {
    this.setFocusInternal({ component, overlayFocusRestore: "clear" });
  }
  setFocusInternal({ component, overlayFocusRestore }) {
    const previousFocus = this.focusedComponent;
    let nextFocus = component;
    const previousFocusedOverlay = previousFocus ? this.overlayStack.find((entry) => entry.component === previousFocus && this.isOverlayVisible(entry)) : void 0;
    const nextFocusIsOverlay = nextFocus ? this.overlayStack.some((entry) => entry.component === nextFocus) : false;
    const restoreState = this.getVisibleOverlayFocusRestore();
    if (nextFocus && !nextFocusIsOverlay) {
      if (restoreState.status === "blocked" && restoreState.blockedBy === previousFocus) {
        if (restoreState.resume.status === "focus-target" || !this.isComponentMounted(restoreState.blockedBy)) {
          nextFocus = this.resolveBlockedOverlayFocusResume(restoreState);
        } else {
          this.overlayFocusRestore = {
            status: "blocked",
            overlay: restoreState.overlay,
            blockedBy: nextFocus,
            resume: restoreState.resume
          };
        }
      } else if (previousFocusedOverlay && restoreState.status !== "inactive" && restoreState.overlay === previousFocusedOverlay && !this.isOverlayFocusAncestor(previousFocusedOverlay, nextFocus)) {
        this.overlayFocusRestore = {
          status: "blocked",
          overlay: previousFocusedOverlay,
          blockedBy: nextFocus,
          resume: { status: "restore-overlay" }
        };
      }
    } else if (nextFocus === null) {
      if (restoreState.status === "blocked" && restoreState.blockedBy === previousFocus) {
        nextFocus = this.resolveBlockedOverlayFocusResume(restoreState);
      } else if (overlayFocusRestore === "clear") {
        this.clearOverlayFocusRestore();
      }
    }
    if (isFocusable(this.focusedComponent)) {
      this.focusedComponent.focused = false;
    }
    this.focusedComponent = nextFocus;
    if (isFocusable(nextFocus)) {
      nextFocus.focused = true;
    }
    const focusedOverlay = nextFocus ? this.overlayStack.find((entry) => entry.component === nextFocus && this.isOverlayVisible(entry)) : void 0;
    if (focusedOverlay) {
      this.overlayFocusRestore = { status: "eligible", overlay: focusedOverlay };
    }
  }
  clearOverlayFocusRestore() {
    this.overlayFocusRestore = { status: "inactive" };
  }
  clearOverlayFocusRestoreFor(overlay) {
    if (this.overlayFocusRestore.status !== "inactive" && this.overlayFocusRestore.overlay === overlay) {
      this.clearOverlayFocusRestore();
    }
  }
  resolveBlockedOverlayFocusResume(restoreState) {
    if (restoreState.resume.status === "restore-overlay")
      return restoreState.overlay.component;
    this.clearOverlayFocusRestore();
    return restoreState.resume.target;
  }
  getVisibleOverlayFocusRestore() {
    const restoreState = this.overlayFocusRestore;
    if (restoreState.status === "inactive")
      return restoreState;
    if (!this.overlayStack.includes(restoreState.overlay) || !this.isOverlayVisible(restoreState.overlay)) {
      return { status: "inactive" };
    }
    return restoreState;
  }
  isOverlayFocusAncestor(entry, component) {
    const visited = /* @__PURE__ */ new Set();
    let current = entry.preFocus;
    while (current && !visited.has(current)) {
      visited.add(current);
      if (current === component)
        return true;
      current = this.overlayStack.find((overlay) => overlay.component === current)?.preFocus ?? null;
    }
    return false;
  }
  retargetOverlayPreFocus(removed) {
    for (const overlay of this.overlayStack) {
      if (overlay !== removed && overlay.preFocus === removed.component) {
        overlay.preFocus = removed.preFocus;
      }
    }
  }
  getMountedRoots() {
    return this.children;
  }
  isComponentMounted(component) {
    return this.getMountedRoots().some((child) => this.containsComponent(child, component));
  }
  containsComponent(root, target) {
    if (root === target)
      return true;
    if (!(root instanceof Container))
      return false;
    return root.children.some((child) => this.containsComponent(child, target));
  }
  /**
   * Show an overlay component with configurable positioning and sizing.
   * Returns a handle to control the overlay's visibility.
   */
  showOverlay(component, options) {
    const entry = {
      component,
      ...options === void 0 ? {} : { options },
      preFocus: this.focusedComponent,
      hidden: false,
      focusOrder: ++this.focusOrderCounter
    };
    this.overlayStack.push(entry);
    if (!options?.nonCapturing && this.isOverlayVisible(entry)) {
      this.setFocus(component);
    }
    this.terminal.hideCursor();
    this.requestRender();
    return {
      hide: () => {
        const index = this.overlayStack.indexOf(entry);
        if (index !== -1) {
          this.clearOverlayFocusRestoreFor(entry);
          this.retargetOverlayPreFocus(entry);
          this.overlayStack.splice(index, 1);
          if (this.focusedComponent === component) {
            const topVisible = this.getTopmostVisibleOverlay();
            this.setFocus(topVisible?.component ?? entry.preFocus);
          }
          if (this.overlayStack.length === 0)
            this.terminal.hideCursor();
          this.requestRender();
        }
      },
      setHidden: (hidden) => {
        if (entry.hidden === hidden)
          return;
        entry.hidden = hidden;
        if (hidden) {
          this.clearOverlayFocusRestoreFor(entry);
          if (this.focusedComponent === component) {
            const topVisible = this.getTopmostVisibleOverlay();
            this.setFocus(topVisible?.component ?? entry.preFocus);
          }
        } else {
          if (!options?.nonCapturing && this.isOverlayVisible(entry)) {
            entry.focusOrder = ++this.focusOrderCounter;
            this.setFocus(component);
          }
        }
        this.requestRender();
      },
      isHidden: () => entry.hidden,
      focus: () => {
        if (!this.overlayStack.includes(entry) || !this.isOverlayVisible(entry))
          return;
        entry.focusOrder = ++this.focusOrderCounter;
        this.setFocus(component);
        this.requestRender();
      },
      unfocus: (unfocusOptions) => {
        const isFocused = this.focusedComponent === component;
        const restoreState = this.overlayFocusRestore;
        const hasPendingRestore = restoreState.status !== "inactive" && restoreState.overlay === entry;
        if (!isFocused && !hasPendingRestore)
          return;
        if (restoreState.status === "blocked" && restoreState.overlay === entry && this.focusedComponent === restoreState.blockedBy) {
          if (unfocusOptions) {
            this.overlayFocusRestore = {
              status: "blocked",
              overlay: entry,
              blockedBy: restoreState.blockedBy,
              resume: { status: "focus-target", target: unfocusOptions.target }
            };
          } else {
            this.clearOverlayFocusRestore();
          }
          this.requestRender();
          return;
        }
        this.clearOverlayFocusRestoreFor(entry);
        if (isFocused || unfocusOptions) {
          const topVisible = this.getTopmostVisibleOverlay();
          const fallbackTarget = topVisible && topVisible !== entry ? topVisible.component : entry.preFocus;
          this.setFocus(unfocusOptions ? unfocusOptions.target : fallbackTarget);
        }
        this.requestRender();
      },
      isFocused: () => this.focusedComponent === component,
      getBounds: () => {
        if (!this.overlayStack.includes(entry) || !this.isOverlayVisible(entry) || !entry.bounds)
          return void 0;
        return { ...entry.bounds };
      }
    };
  }
  /** Hide the topmost overlay and restore previous focus. */
  hideOverlay() {
    const overlay = this.overlayStack[this.overlayStack.length - 1];
    if (!overlay)
      return;
    this.clearOverlayFocusRestoreFor(overlay);
    this.retargetOverlayPreFocus(overlay);
    this.overlayStack.pop();
    if (this.focusedComponent === overlay.component) {
      const topVisible = this.getTopmostVisibleOverlay();
      this.setFocus(topVisible?.component ?? overlay.preFocus);
    }
    if (this.overlayStack.length === 0)
      this.terminal.hideCursor();
    this.requestRender();
  }
  /** Check if there are any visible overlays */
  hasOverlay() {
    return this.overlayStack.some((o) => this.isOverlayVisible(o));
  }
  /** Check if the focused component is a visible overlay */
  isOverlayFocused() {
    return this.overlayStack.some((entry) => entry.component === this.focusedComponent && this.isOverlayVisible(entry));
  }
  /** Keep overlay containers as keyboard focus owners when a nested control is clicked. */
  resolveMouseFocusTarget(component) {
    for (let index = this.overlayStack.length - 1; index >= 0; index--) {
      const overlay = this.overlayStack[index];
      if (this.isOverlayVisible(overlay) && this.containsComponent(overlay.component, component)) {
        return overlay.component;
      }
    }
    return component;
  }
  /** Dispatch to the visually topmost overlay under the pointer. */
  dispatchMouseToOverlay(event) {
    for (let index = this.renderedOverlayLayouts.length - 1; index >= 0; index--) {
      const layout = this.renderedOverlayLayouts[index];
      if (event.screenX < layout.col || event.screenX >= layout.col + layout.width || event.screenY < layout.row || event.screenY >= layout.row + layout.height) {
        continue;
      }
      const result = dispatchMouseEvent(layout.entry.component, {
        ...event,
        x: event.screenX - layout.col,
        y: event.screenY - layout.row,
        width: layout.width,
        height: layout.height
      });
      return result ? {
        hit: true,
        result: result.focus ? { ...result, focusTarget: layout.entry.component } : result
      } : { hit: true };
    }
    return { hit: false };
  }
  /** Check if an overlay entry is currently visible */
  isOverlayVisible(entry) {
    if (entry.hidden)
      return false;
    if (entry.options?.visible) {
      return entry.options.visible(this.terminal.columns, this.terminal.rows);
    }
    return true;
  }
  /** Find the visual-frontmost visible capturing overlay, if any */
  getTopmostVisibleOverlay() {
    let topmost;
    for (const overlay of this.overlayStack) {
      if (overlay.options?.nonCapturing || !this.isOverlayVisible(overlay))
        continue;
      if (!topmost || overlay.focusOrder > topmost.focusOrder) {
        topmost = overlay;
      }
    }
    return topmost;
  }
  invalidate() {
    for (const root of this.getMountedRoots())
      root.invalidate();
    for (const overlay of this.overlayStack)
      overlay.component.invalidate();
  }
  start() {
    this.stopped = false;
    this.beforeTerminalStart();
    this.terminal.start((data) => this.handleTerminalInput(data), () => this.requestRender());
    this.afterTerminalStart();
    this.terminal.hideCursor();
    if (this.terminalColorSchemeNotificationsEnabled) {
      this.terminal.write("\x1B[?2031h");
    }
    this.queryCellSize();
    this.requestRender();
  }
  addInputListener(listener) {
    this.inputListeners.add(listener);
    return () => {
      this.inputListeners.delete(listener);
    };
  }
  removeInputListener(listener) {
    this.inputListeners.delete(listener);
  }
  onTerminalColorSchemeChange(listener) {
    this.terminalColorSchemeListeners.add(listener);
    return () => {
      this.terminalColorSchemeListeners.delete(listener);
    };
  }
  setTerminalColorSchemeNotifications(enabled) {
    if (this.terminalColorSchemeNotificationsEnabled === enabled) {
      return;
    }
    this.terminalColorSchemeNotificationsEnabled = enabled;
    if (!this.stopped) {
      this.terminal.write(enabled ? "\x1B[?2031h" : "\x1B[?2031l");
    }
  }
  queryCellSize() {
    if (!getCapabilities().images) {
      return;
    }
    this.terminal.write("\x1B[16t");
  }
  stop(options = {}) {
    this.stopped = true;
    this.cancelRenderTimer();
    if (this.terminalColorSchemeNotificationsEnabled) {
      this.terminal.write("\x1B[?2031l");
    }
    this.beforeTerminalStop(options);
    this.terminal.showCursor();
    this.terminal.stop();
    this.afterTerminalStop(options);
  }
  renderNow(force = false) {
    if (force)
      this.resetRenderState();
    this.renderRequested = false;
    this.cancelRenderTimer();
    this.lastRenderAt = performance.now();
    this.doRender();
  }
  requestRender(force = false) {
    if (force) {
      this.resetRenderState();
      this.requestImmediateRender();
      return;
    }
    if (this.renderRequested)
      return;
    this.renderRequested = true;
    process.nextTick(() => this.scheduleRender());
  }
  requestImmediateRender() {
    this.cancelRenderTimer();
    this.renderRequested = true;
    if (this.immediateRenderScheduled)
      return;
    this.immediateRenderScheduled = true;
    process.nextTick(() => {
      this.immediateRenderScheduled = false;
      if (this.stopped || !this.renderRequested)
        return;
      this.cancelRenderTimer();
      this.renderRequested = false;
      this.lastRenderAt = performance.now();
      this.doRender();
    });
  }
  cancelRenderTimer() {
    if (!this.renderTimer)
      return;
    clearTimeout(this.renderTimer);
    this.renderTimer = void 0;
  }
  scheduleRender() {
    if (this.stopped || this.renderTimer || !this.renderRequested) {
      return;
    }
    const elapsed = performance.now() - this.lastRenderAt;
    const delay = Math.max(0, _TuiBase.MIN_RENDER_INTERVAL_MS - elapsed);
    this.renderTimer = setTimeout(() => {
      this.renderTimer = void 0;
      if (this.stopped || !this.renderRequested) {
        return;
      }
      this.renderRequested = false;
      this.lastRenderAt = performance.now();
      this.doRender();
      if (this.renderRequested) {
        this.scheduleRender();
      }
    }, delay);
  }
  handleTerminalInput(data) {
    if (this.consumeOsc11BackgroundResponse(data)) {
      return;
    }
    if (this.consumeTerminalColorSchemeReport(data)) {
      return;
    }
    if (this.inputListeners.size > 0) {
      let current = data;
      for (const listener of this.inputListeners) {
        const result = listener(current);
        if (result?.consume) {
          return;
        }
        if (result?.data !== void 0) {
          current = result.data;
        }
      }
      if (current.length === 0) {
        return;
      }
      data = current;
    }
    if (this.consumeCellSizeResponse(data)) {
      return;
    }
    if (matchesKey(data, "shift+ctrl+d") && this.onDebug) {
      this.onDebug();
      return;
    }
    const focusedOverlay = this.overlayStack.find((o) => o.component === this.focusedComponent);
    if (focusedOverlay && !this.isOverlayVisible(focusedOverlay)) {
      const topVisible = this.getTopmostVisibleOverlay();
      if (topVisible) {
        this.setFocus(topVisible.component);
      } else {
        this.setFocusInternal({ component: focusedOverlay.preFocus, overlayFocusRestore: "preserve" });
      }
    }
    const focusIsOverlay = this.overlayStack.some((o) => o.component === this.focusedComponent);
    if (!focusIsOverlay) {
      const restoreState = this.getVisibleOverlayFocusRestore();
      if (restoreState.status === "eligible") {
        this.setFocus(restoreState.overlay.component);
      } else if (restoreState.status === "blocked" && restoreState.blockedBy !== this.focusedComponent) {
        if (restoreState.resume.status === "restore-overlay") {
          this.setFocus(restoreState.overlay.component);
        } else {
          this.clearOverlayFocusRestore();
          this.setFocus(restoreState.resume.target);
        }
      }
    }
    if (this.focusedComponent?.handleInput) {
      if (isKeyRelease(data) && !this.focusedComponent.wantsKeyRelease) {
        return;
      }
      this.focusedComponent.handleInput(data);
      this.requestImmediateRender();
    }
  }
  consumeOsc11BackgroundResponse(data) {
    if (this.pendingOsc11BackgroundReplies <= 0) {
      return false;
    }
    if (!isOsc11BackgroundColorResponse(data)) {
      return false;
    }
    const rgb = parseOsc11BackgroundColor(data);
    this.pendingOsc11BackgroundReplies -= 1;
    const query = this.pendingOsc11BackgroundQueries.shift();
    if (query && !query.settled) {
      query.settled = true;
      if (query.timer) {
        clearTimeout(query.timer);
        query.timer = void 0;
      }
      query.resolve?.(rgb);
      query.resolve = void 0;
    }
    return true;
  }
  consumeTerminalColorSchemeReport(data) {
    const scheme = parseTerminalColorSchemeReport(data);
    if (!scheme) {
      return false;
    }
    for (const listener of this.terminalColorSchemeListeners) {
      listener(scheme);
    }
    return true;
  }
  consumeCellSizeResponse(data) {
    const match = data.match(/^\x1b\[6;(\d+);(\d+)t$/);
    if (!match) {
      return false;
    }
    const heightPx = parseInt(match[1], 10);
    const widthPx = parseInt(match[2], 10);
    if (heightPx <= 0 || widthPx <= 0) {
      return true;
    }
    setCellDimensions({ widthPx, heightPx });
    this.invalidate();
    this.requestRender();
    return true;
  }
  /**
   * Resolve overlay layout from options.
   * Returns { width, row, col, maxHeight } for rendering.
   */
  resolveOverlayLayout(options, overlayHeight, termWidth, termHeight) {
    const opt = options ?? {};
    const margin = typeof opt.margin === "number" ? { top: opt.margin, right: opt.margin, bottom: opt.margin, left: opt.margin } : opt.margin ?? {};
    const marginTop = Math.max(0, margin.top ?? 0);
    const marginRight = Math.max(0, margin.right ?? 0);
    const marginBottom = Math.max(0, margin.bottom ?? 0);
    const marginLeft = Math.max(0, margin.left ?? 0);
    const availWidth = Math.max(1, termWidth - marginLeft - marginRight);
    const availHeight = Math.max(1, termHeight - marginTop - marginBottom);
    let width = parseSizeValue(opt.width, termWidth) ?? Math.min(80, availWidth);
    if (opt.minWidth !== void 0) {
      width = Math.max(width, opt.minWidth);
    }
    width = Math.max(1, Math.min(width, availWidth));
    let maxHeight = parseSizeValue(opt.maxHeight, termHeight);
    if (maxHeight !== void 0) {
      maxHeight = Math.max(1, Math.min(maxHeight, availHeight));
    }
    const effectiveHeight = maxHeight !== void 0 ? Math.min(overlayHeight, maxHeight) : overlayHeight;
    let row;
    let col;
    if (opt.row !== void 0) {
      if (typeof opt.row === "string") {
        const match = opt.row.match(/^(\d+(?:\.\d+)?)%$/);
        if (match) {
          const maxRow = Math.max(0, availHeight - effectiveHeight);
          const percent = parseFloat(match[1]) / 100;
          row = marginTop + Math.floor(maxRow * percent);
        } else {
          row = this.resolveAnchorRow("center", effectiveHeight, availHeight, marginTop);
        }
      } else {
        row = opt.row;
      }
    } else {
      const anchor = opt.anchor ?? "center";
      row = this.resolveAnchorRow(anchor, effectiveHeight, availHeight, marginTop);
    }
    if (opt.col !== void 0) {
      if (typeof opt.col === "string") {
        const match = opt.col.match(/^(\d+(?:\.\d+)?)%$/);
        if (match) {
          const maxCol = Math.max(0, availWidth - width);
          const percent = parseFloat(match[1]) / 100;
          col = marginLeft + Math.floor(maxCol * percent);
        } else {
          col = this.resolveAnchorCol("center", width, availWidth, marginLeft);
        }
      } else {
        col = opt.col;
      }
    } else {
      const anchor = opt.anchor ?? "center";
      col = this.resolveAnchorCol(anchor, width, availWidth, marginLeft);
    }
    if (opt.offsetY !== void 0)
      row += opt.offsetY;
    if (opt.offsetX !== void 0)
      col += opt.offsetX;
    row = Math.max(marginTop, Math.min(row, termHeight - marginBottom - effectiveHeight));
    col = Math.max(marginLeft, Math.min(col, termWidth - marginRight - width));
    return { width, row, col, maxHeight };
  }
  resolveAnchorRow(anchor, height, availHeight, marginTop) {
    switch (anchor) {
      case "top-left":
      case "top-center":
      case "top-right":
        return marginTop;
      case "bottom-left":
      case "bottom-center":
      case "bottom-right":
        return marginTop + availHeight - height;
      case "left-center":
      case "center":
      case "right-center":
        return marginTop + Math.floor((availHeight - height) / 2);
    }
  }
  resolveAnchorCol(anchor, width, availWidth, marginLeft) {
    switch (anchor) {
      case "top-left":
      case "left-center":
      case "bottom-left":
        return marginLeft;
      case "top-right":
      case "right-center":
      case "bottom-right":
        return marginLeft + availWidth - width;
      case "top-center":
      case "center":
      case "bottom-center":
        return marginLeft + Math.floor((availWidth - width) / 2);
    }
  }
  /** Composite all overlays into content lines (sorted by focusOrder, higher = on top). */
  compositeOverlays(lines, termWidth, termHeight) {
    if (this.overlayStack.length === 0) {
      this.renderedOverlayLayouts = [];
      return lines;
    }
    const result = [...lines];
    for (const entry of this.overlayStack)
      entry.bounds = void 0;
    const rendered = [];
    let minLinesNeeded = result.length;
    const visibleEntries = this.overlayStack.filter((e) => this.isOverlayVisible(e));
    visibleEntries.sort((a, b2) => a.focusOrder - b2.focusOrder);
    for (const entry of visibleEntries) {
      const { component, options } = entry;
      const { width, maxHeight } = this.resolveOverlayLayout(options, 0, termWidth, termHeight);
      let overlayLines = component.render(width);
      if (maxHeight !== void 0 && overlayLines.length > maxHeight) {
        overlayLines = overlayLines.slice(0, maxHeight);
      }
      const { row, col } = this.resolveOverlayLayout(options, overlayLines.length, termWidth, termHeight);
      entry.bounds = { row, col, width, height: overlayLines.length };
      rendered.push({ entry, overlayLines, row, col, w: width });
      minLinesNeeded = Math.max(minLinesNeeded, row + overlayLines.length);
    }
    this.renderedOverlayLayouts = rendered.map(({ entry, row, col, w, overlayLines }) => ({
      entry,
      row,
      col,
      width: w,
      height: overlayLines.length
    }));
    const workingHeight = Math.max(result.length, termHeight, minLinesNeeded);
    while (result.length < workingHeight) {
      result.push("");
    }
    const viewportStart = Math.max(0, workingHeight - termHeight);
    for (const { overlayLines, row, col, w } of rendered) {
      for (let i = 0; i < overlayLines.length; i++) {
        const idx = viewportStart + row + i;
        if (idx >= 0 && idx < result.length) {
          const truncatedOverlayLine = visibleWidth(overlayLines[i]) > w ? sliceByColumn(overlayLines[i], 0, w, true) : overlayLines[i];
          result[idx] = this.compositeLineAt(result[idx], truncatedOverlayLine, col, w, termWidth);
        }
      }
    }
    return result;
  }
  applyLineResets(lines) {
    const reset = SEGMENT_RESET;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!isImageLine(line)) {
        lines[i] = normalizeTerminalOutput(line) + reset;
      }
    }
    return lines;
  }
  compositeLineAt(baseLine, overlayLine, startCol, overlayWidth, totalWidth) {
    return compositeTuiLine(baseLine, overlayLine, startCol, overlayWidth, totalWidth);
  }
  /**
   * Find and extract cursor position from rendered lines.
   * Searches for CURSOR_MARKER, calculates its position, and strips it from the output.
   * Only scans the bottom terminal height lines (visible viewport).
   * @param lines - Rendered lines to search
   * @param height - Terminal height (visible viewport size)
   * @returns Cursor position { row, col } or null if no marker found
   */
  extractCursorPosition(lines, height) {
    const viewportTop = Math.max(0, lines.length - height);
    for (let row = lines.length - 1; row >= viewportTop; row--) {
      const line = lines[row];
      const markerIndex = line.indexOf(CURSOR_MARKER);
      if (markerIndex !== -1) {
        const beforeMarker = line.slice(0, markerIndex);
        const col = visibleWidth(beforeMarker);
        lines[row] = line.slice(0, markerIndex) + line.slice(markerIndex + CURSOR_MARKER.length);
        return { row, col };
      }
    }
    return null;
  }
  /**
   * Query the terminal's default background color with OSC 11 (`ESC ] 11 ; ? BEL`).
   * @param timeoutMs Query timeout in milliseconds.
   * @returns Promise containing the parsed RGB color, or undefined if it times out or fails to parse.
   */
  queryTerminalBackgroundColor({ timeoutMs }) {
    return new Promise((resolve3) => {
      const query = {
        settled: false,
        resolve: resolve3,
        timer: void 0
      };
      query.timer = setTimeout(() => {
        if (query.settled) {
          return;
        }
        query.settled = true;
        query.timer = void 0;
        query.resolve?.(void 0);
        query.resolve = void 0;
      }, timeoutMs);
      this.pendingOsc11BackgroundQueries.push(query);
      this.pendingOsc11BackgroundReplies += 1;
      this.terminal.write("\x1B]11;?\x07");
    });
  }
  /**
   * Query the terminal's color-scheme preference with DSR (`CSI ? 996 n`).
   * Terminals that support the color palette notification protocol reply with
   * `CSI ? 997 ; 1 n` for dark or `CSI ? 997 ; 2 n` for light.
   */
  queryTerminalColorScheme({ timeoutMs }) {
    return new Promise((resolve3) => {
      let settled = false;
      let timer;
      let unsubscribe = () => {
      };
      const settle = (scheme) => {
        if (settled)
          return;
        settled = true;
        if (timer) {
          clearTimeout(timer);
          timer = void 0;
        }
        unsubscribe();
        resolve3(scheme);
      };
      unsubscribe = this.onTerminalColorSchemeChange(settle);
      timer = setTimeout(() => settle(void 0), timeoutMs);
      this.terminal.write("\x1B[?996n");
    });
  }
};

// node_modules/@earendil-works/pi-tui/dist/keybindings.js
var TUI_KEYBINDINGS = {
  "tui.editor.cursorUp": { defaultKeys: "up", description: "Move cursor up" },
  "tui.editor.cursorDown": { defaultKeys: "down", description: "Move cursor down" },
  "tui.editor.historyPrevious": {
    defaultKeys: [],
    description: "Select previous prompt history entry"
  },
  "tui.editor.historyNext": {
    defaultKeys: [],
    description: "Select next prompt history entry"
  },
  "tui.editor.cursorLeft": {
    defaultKeys: ["left", "ctrl+b"],
    description: "Move cursor left"
  },
  "tui.editor.cursorRight": {
    defaultKeys: ["right", "ctrl+f"],
    description: "Move cursor right"
  },
  "tui.editor.cursorWordLeft": {
    defaultKeys: ["alt+left", "ctrl+left", "alt+b"],
    description: "Move cursor word left"
  },
  "tui.editor.cursorWordRight": {
    defaultKeys: ["alt+right", "ctrl+right", "alt+f"],
    description: "Move cursor word right"
  },
  "tui.editor.cursorLineStart": {
    defaultKeys: ["home", "ctrl+home", "ctrl+a"],
    description: "Move to line start"
  },
  "tui.editor.cursorLineEnd": {
    defaultKeys: ["end", "ctrl+end", "ctrl+e"],
    description: "Move to line end"
  },
  "tui.editor.jumpForward": {
    defaultKeys: "ctrl+]",
    description: "Jump forward to character"
  },
  "tui.editor.jumpBackward": {
    defaultKeys: "ctrl+alt+]",
    description: "Jump backward to character"
  },
  "tui.editor.pageUp": { defaultKeys: ["pageUp", "ctrl+pageUp"], description: "Page up" },
  "tui.editor.pageDown": { defaultKeys: ["pageDown", "ctrl+pageDown"], description: "Page down" },
  "tui.editor.deleteCharBackward": {
    defaultKeys: "backspace",
    description: "Delete character backward"
  },
  "tui.editor.deleteCharForward": {
    defaultKeys: ["delete", "ctrl+d"],
    description: "Delete character forward"
  },
  "tui.editor.deleteWordBackward": {
    defaultKeys: ["ctrl+w", "alt+backspace"],
    description: "Delete word backward"
  },
  "tui.editor.deleteWordForward": {
    defaultKeys: ["alt+d", "alt+delete"],
    description: "Delete word forward"
  },
  "tui.editor.deleteToLineStart": {
    defaultKeys: "ctrl+u",
    description: "Delete to line start"
  },
  "tui.editor.deleteToLineEnd": {
    defaultKeys: "ctrl+k",
    description: "Delete to line end"
  },
  "tui.editor.yank": { defaultKeys: "ctrl+y", description: "Yank" },
  "tui.editor.yankPop": { defaultKeys: "alt+y", description: "Yank pop" },
  "tui.editor.undo": { defaultKeys: "ctrl+-", description: "Undo" },
  "tui.input.newLine": { defaultKeys: ["shift+enter", "ctrl+j"], description: "Insert newline" },
  "tui.input.submit": { defaultKeys: "enter", description: "Submit input" },
  "tui.input.tab": { defaultKeys: "tab", description: "Tab / autocomplete" },
  "tui.input.copy": { defaultKeys: "ctrl+c", description: "Copy selection" },
  "tui.select.up": { defaultKeys: "up", description: "Move selection up" },
  "tui.select.down": { defaultKeys: "down", description: "Move selection down" },
  "tui.select.pageUp": { defaultKeys: "pageUp", description: "Selection page up" },
  "tui.select.pageDown": {
    defaultKeys: "pageDown",
    description: "Selection page down"
  },
  "tui.select.confirm": { defaultKeys: "enter", description: "Confirm selection" },
  "tui.select.cancel": {
    defaultKeys: ["escape", "ctrl+c"],
    description: "Cancel selection"
  },
  // These intentionally shadow the unmodified editor bindings in fullscreen mode.
  "tui.altScreen.pageUp": {
    defaultKeys: "pageUp",
    description: "Scroll viewport up one page"
  },
  "tui.altScreen.pageDown": {
    defaultKeys: "pageDown",
    description: "Scroll viewport down one page"
  },
  "tui.altScreen.halfPageUp": {
    defaultKeys: [],
    description: "Scroll viewport up half a page"
  },
  "tui.altScreen.halfPageDown": {
    defaultKeys: [],
    description: "Scroll viewport down half a page"
  },
  "tui.altScreen.lineUp": {
    defaultKeys: [],
    description: "Scroll viewport up one line"
  },
  "tui.altScreen.lineDown": {
    defaultKeys: [],
    description: "Scroll viewport down one line"
  },
  "tui.altScreen.previousPrompt": {
    defaultKeys: ["ctrl+shift+up", "ctrl+up"],
    description: "Jump to previous semantic prompt"
  },
  "tui.altScreen.nextPrompt": {
    defaultKeys: ["ctrl+shift+down", "ctrl+down"],
    description: "Jump to next semantic prompt"
  },
  "tui.altScreen.search": {
    defaultKeys: "ctrl+shift+f",
    description: "Search the primary scroll view"
  },
  "tui.altScreen.searchNext": {
    defaultKeys: ["enter", "ctrl+g"],
    description: "Select the next search match"
  },
  "tui.altScreen.searchPrevious": {
    defaultKeys: ["shift+enter", "ctrl+shift+g"],
    description: "Select the previous search match"
  },
  "tui.altScreen.searchClose": {
    defaultKeys: "escape",
    description: "Close transcript search"
  },
  "tui.altScreen.top": { defaultKeys: "home", description: "Scroll viewport to top" },
  "tui.altScreen.bottom": { defaultKeys: "end", description: "Scroll viewport to bottom" }
};
function normalizeKeys(keys) {
  if (keys === void 0)
    return [];
  const keyList = Array.isArray(keys) ? keys : [keys];
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const key of keyList) {
    if (!seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
  }
  return result;
}
var KeybindingsManager = class {
  definitions;
  userBindings;
  keysById = /* @__PURE__ */ new Map();
  conflicts = [];
  constructor(definitions, userBindings = {}) {
    this.definitions = definitions;
    this.userBindings = userBindings;
    this.rebuild();
  }
  rebuild() {
    this.keysById.clear();
    this.conflicts = [];
    const userClaims = /* @__PURE__ */ new Map();
    for (const [keybinding, keys] of Object.entries(this.userBindings)) {
      if (!(keybinding in this.definitions))
        continue;
      for (const key of normalizeKeys(keys)) {
        const claimants = userClaims.get(key) ?? /* @__PURE__ */ new Set();
        claimants.add(keybinding);
        userClaims.set(key, claimants);
      }
    }
    for (const [key, keybindings] of userClaims) {
      if (keybindings.size > 1) {
        this.conflicts.push({ key, keybindings: [...keybindings] });
      }
    }
    for (const [id, definition] of Object.entries(this.definitions)) {
      const userKeys = this.userBindings[id];
      const keys = userKeys === void 0 ? normalizeKeys(definition.defaultKeys) : normalizeKeys(userKeys);
      this.keysById.set(id, keys);
    }
  }
  matches(data, keybinding) {
    const keys = this.keysById.get(keybinding) ?? [];
    for (const key of keys) {
      if (matchesKey(data, key))
        return true;
    }
    return false;
  }
  getKeys(keybinding) {
    return [...this.keysById.get(keybinding) ?? []];
  }
  getDefinition(keybinding) {
    return this.definitions[keybinding];
  }
  getConflicts() {
    return this.conflicts.map((conflict) => ({ ...conflict, keybindings: [...conflict.keybindings] }));
  }
  setUserBindings(userBindings) {
    this.userBindings = userBindings;
    this.rebuild();
  }
  getUserBindings() {
    return { ...this.userBindings };
  }
  getResolvedBindings() {
    const resolved = {};
    for (const id of Object.keys(this.definitions)) {
      const keys = this.keysById.get(id) ?? [];
      resolved[id] = keys.length === 1 ? keys[0] : [...keys];
    }
    return resolved;
  }
};
var globalKeybindings = null;
function getKeybindings() {
  if (!globalKeybindings) {
    globalKeybindings = new KeybindingsManager(TUI_KEYBINDINGS);
  }
  return globalKeybindings;
}

// node_modules/@earendil-works/pi-tui/dist/kill-ring.js
var KillRing = class {
  ring = [];
  /**
   * Add text to the kill ring.
   *
   * @param text - The killed text to add
   * @param opts - Push options
   * @param opts.prepend - If accumulating, prepend (backward deletion) or append (forward deletion)
   * @param opts.accumulate - Merge with the most recent entry instead of creating a new one
   */
  push(text, opts) {
    if (!text)
      return;
    if (opts.accumulate && this.ring.length > 0) {
      const last = this.ring.pop();
      this.ring.push(opts.prepend ? text + last : last + text);
    } else {
      this.ring.push(text);
    }
  }
  /** Get most recent entry without modifying the ring. */
  peek() {
    return this.ring.length > 0 ? this.ring[this.ring.length - 1] : void 0;
  }
  /** Move last entry to front (for yank-pop cycling). */
  rotate() {
    if (this.ring.length > 1) {
      const last = this.ring.pop();
      this.ring.unshift(last);
    }
  }
  get length() {
    return this.ring.length;
  }
};

// node_modules/@earendil-works/pi-tui/dist/undo-stack.js
var UndoStack = class {
  stack = [];
  /** Push a deep clone of the given state onto the stack. */
  push(state) {
    this.stack.push(structuredClone(state));
  }
  /** Pop and return the most recent snapshot, or undefined if empty. */
  pop() {
    return this.stack.pop();
  }
  /** Remove all snapshots. */
  clear() {
    this.stack.length = 0;
  }
  get length() {
    return this.stack.length;
  }
};

// node_modules/@earendil-works/pi-tui/dist/word-navigation.js
var wordSegmenter2 = getWordSegmenter();
function findWordBackward(text, cursor, options) {
  if (cursor <= 0)
    return 0;
  const textBeforeCursor = text.slice(0, cursor);
  const segmentFn = options?.segment;
  const isAtomic = options?.isAtomicSegment;
  const segments = segmentFn ? [...segmentFn(textBeforeCursor)] : [...wordSegmenter2.segment(textBeforeCursor)];
  let newCursor = cursor;
  while (segments.length > 0 && !isAtomic?.(segments[segments.length - 1]?.segment || "") && isWhitespaceChar(segments[segments.length - 1]?.segment || "")) {
    newCursor -= segments.pop()?.segment.length || 0;
  }
  if (segments.length === 0)
    return newCursor;
  const last = segments[segments.length - 1];
  if (isAtomic?.(last.segment)) {
    newCursor -= last.segment.length;
  } else if (last.isWordLike) {
    const segment = last.segment;
    const matches = [...segment.matchAll(new RegExp(PUNCTUATION_REGEX, "g"))];
    if (matches.length <= 0) {
      newCursor -= segment.length;
    } else {
      const lastMatch = matches[matches.length - 1];
      newCursor -= segment.length - (lastMatch.index + lastMatch[0].length);
    }
  } else {
    while (segments.length > 0 && !isAtomic?.(segments[segments.length - 1]?.segment || "") && !segments[segments.length - 1]?.isWordLike && !isWhitespaceChar(segments[segments.length - 1]?.segment || "")) {
      newCursor -= segments.pop()?.segment.length || 0;
    }
  }
  return newCursor;
}
function findWordForward(text, cursor, options) {
  if (cursor >= text.length)
    return text.length;
  const textAfterCursor = text.slice(cursor);
  const segmentFn = options?.segment;
  const isAtomic = options?.isAtomicSegment;
  const segments = segmentFn ? segmentFn(textAfterCursor) : wordSegmenter2.segment(textAfterCursor);
  const iterator = segments[Symbol.iterator]();
  let next = iterator.next();
  let newCursor = cursor;
  while (!next.done && !isAtomic?.(next.value.segment) && isWhitespaceChar(next.value.segment)) {
    newCursor += next.value.segment.length;
    next = iterator.next();
  }
  if (next.done)
    return newCursor;
  if (isAtomic?.(next.value.segment)) {
    newCursor += next.value.segment.length;
  } else if (next.value.isWordLike) {
    newCursor += PUNCTUATION_REGEX.exec(next.value.segment)?.index ?? next.value.segment.length;
  } else {
    while (!next.done && !isAtomic?.(next.value.segment) && !next.value.isWordLike && !isWhitespaceChar(next.value.segment)) {
      newCursor += next.value.segment.length;
      next = iterator.next();
    }
  }
  return newCursor;
}

// node_modules/@earendil-works/pi-tui/dist/components/editor.js
var graphemeSegmenter2 = getGraphemeSegmenter();
var wordSegmenter3 = getWordSegmenter();
var unquotedAutocompleteSuffixRegex = new RegExp(`(?:(?!${autocompleteSeparatorRegex.source}).)*`, "u");

// node_modules/@earendil-works/pi-tui/dist/layout-node.js
var LAYOUT_NODE = /* @__PURE__ */ Symbol.for("@earendil-works/pi-tui/layout-node");
function getLayoutNode(component) {
  const candidate = component;
  return typeof candidate[LAYOUT_NODE] === "function" ? candidate[LAYOUT_NODE]() : void 0;
}

// node_modules/@earendil-works/pi-tui/dist/components/stack.js
function isStackEntry(child) {
  return !("render" in child);
}
function normalizeSize(value, fallback) {
  return value === void 0 || !Number.isFinite(value) ? fallback : Math.max(0, Math.floor(value));
}
var Stack = class extends Container {
  entries = [];
  gap;
  align;
  constructor(children = [], options = {}) {
    super();
    this.gap = normalizeSize(options.gap, 0);
    this.align = options.align ?? "stretch";
    for (const child of children) {
      if (isStackEntry(child))
        this.addChild(child.component, child);
      else
        this.addChild(child);
    }
  }
  addChild(component, options = {}) {
    super.addChild(component);
    this.entries.push({
      component,
      ...options.basis === void 0 ? {} : { basis: options.basis },
      ...options.grow === void 0 ? {} : { grow: normalizeSize(options.grow, 0) },
      ...options.shrink === void 0 ? {} : { shrink: normalizeSize(options.shrink, 1) },
      ...options.minSize === void 0 ? {} : { minSize: normalizeSize(options.minSize, 0) },
      ...options.maxSize === void 0 ? {} : { maxSize: normalizeSize(options.maxSize, Number.MAX_SAFE_INTEGER) },
      ...options.visible === void 0 ? {} : { visible: options.visible }
    });
  }
  removeChild(component) {
    super.removeChild(component);
    const index = this.entries.findIndex((entry) => entry.component === component);
    if (index !== -1)
      this.entries.splice(index, 1);
  }
  clear() {
    super.clear();
    this.entries.length = 0;
  }
  [LAYOUT_NODE]() {
    return {
      type: this.layoutType,
      entries: this.entries,
      gap: this.gap,
      align: this.align
    };
  }
};
function visibleStackEntries(entries, viewport) {
  return entries.filter((entry) => entry.visible?.(viewport) ?? true);
}
function clampSize(size, entry) {
  const min = Math.max(0, Math.floor(entry.minSize ?? 0));
  const max = Math.max(min, Math.floor(entry.maxSize ?? Number.MAX_SAFE_INTEGER));
  return Math.max(min, Math.min(max, Math.max(0, Math.floor(size))));
}
function distribute(sizes, entries, amount, mode) {
  let remaining = amount;
  while (remaining > 0) {
    const candidates = entries.map((entry, index) => ({ entry, index })).filter(({ entry, index }) => {
      if (mode === "grow") {
        return (entry.grow ?? 0) > 0 && sizes[index] < (entry.maxSize ?? Number.MAX_SAFE_INTEGER);
      }
      return (entry.shrink ?? 1) > 0 && sizes[index] > (entry.minSize ?? 0);
    });
    if (candidates.length === 0)
      return;
    const totalWeight = candidates.reduce((sum, { entry, index }) => {
      return sum + (mode === "grow" ? entry.grow ?? 0 : (entry.shrink ?? 1) * Math.max(1, sizes[index]));
    }, 0);
    let distributed = 0;
    for (const { entry, index } of candidates) {
      if (remaining <= 0)
        break;
      const weight = mode === "grow" ? entry.grow ?? 0 : (entry.shrink ?? 1) * Math.max(1, sizes[index]);
      const proposed = Math.max(1, Math.floor(remaining * weight / totalWeight));
      const capacity = mode === "grow" ? (entry.maxSize ?? Number.MAX_SAFE_INTEGER) - sizes[index] : sizes[index] - (entry.minSize ?? 0);
      const delta = Math.min(remaining, proposed, capacity);
      if (delta <= 0)
        continue;
      sizes[index] = sizes[index] + (mode === "grow" ? delta : -delta);
      remaining -= delta;
      distributed += delta;
    }
    if (distributed === 0)
      return;
  }
}
function allocateStackSizes(entries, intrinsicSizes, availableSize, gap) {
  const sizes = entries.map((entry, index) => clampSize(entry.basis === void 0 || entry.basis === "auto" ? intrinsicSizes[index] ?? 0 : entry.basis, entry));
  if (availableSize === void 0)
    return sizes;
  const contentSize = Math.max(0, Math.floor(availableSize) - Math.max(0, entries.length - 1) * gap);
  const total = sizes.reduce((sum, size) => sum + size, 0);
  if (total < contentSize)
    distribute(sizes, entries, contentSize - total, "grow");
  else if (total > contentSize)
    distribute(sizes, entries, total - contentSize, "shrink");
  return sizes;
}

// node_modules/@earendil-works/pi-tui/dist/components/input.js
var segmenter = getGraphemeSegmenter();
var Input = class {
  value = "";
  cursor = 0;
  // Cursor position in the value
  prompt;
  placeholder;
  placeholderStyle;
  renderedStartColumn = 0;
  onSubmit;
  onEscape;
  /** Focusable interface - set by TUI when focus changes */
  focused = false;
  // Bracketed paste mode buffering
  pasteBuffer = "";
  isInPaste = false;
  // Kill ring for Emacs-style kill/yank operations
  killRing = new KillRing();
  lastAction = null;
  // Undo support
  undoStack = new UndoStack();
  constructor(options = {}) {
    this.prompt = options.prompt ?? "> ";
    this.placeholder = options.placeholder ?? "";
    this.placeholderStyle = options.placeholderStyle ?? ((text) => text);
  }
  getValue() {
    return this.value;
  }
  setValue(value) {
    this.value = value;
    this.cursor = Math.min(this.cursor, value.length);
  }
  handleInput(data) {
    if (data.includes("\x1B[200~")) {
      this.isInPaste = true;
      this.pasteBuffer = "";
      data = data.replace("\x1B[200~", "");
    }
    if (this.isInPaste) {
      this.pasteBuffer += data;
      const endIndex = this.pasteBuffer.indexOf("\x1B[201~");
      if (endIndex !== -1) {
        const pasteContent = this.pasteBuffer.substring(0, endIndex);
        this.handlePaste(pasteContent);
        this.isInPaste = false;
        const remaining = this.pasteBuffer.substring(endIndex + 6);
        this.pasteBuffer = "";
        if (remaining) {
          this.handleInput(remaining);
        }
      }
      return;
    }
    const kb = getKeybindings();
    if (kb.matches(data, "tui.select.cancel")) {
      if (this.onEscape)
        this.onEscape();
      return;
    }
    if (kb.matches(data, "tui.editor.undo")) {
      this.undo();
      return;
    }
    if (kb.matches(data, "tui.input.submit") || data === "\n") {
      if (this.onSubmit)
        this.onSubmit(this.value);
      return;
    }
    if (kb.matches(data, "tui.editor.deleteCharBackward")) {
      this.handleBackspace();
      return;
    }
    if (kb.matches(data, "tui.editor.deleteCharForward")) {
      this.handleForwardDelete();
      return;
    }
    if (kb.matches(data, "tui.editor.deleteWordBackward")) {
      this.deleteWordBackwards();
      return;
    }
    if (kb.matches(data, "tui.editor.deleteWordForward")) {
      this.deleteWordForward();
      return;
    }
    if (kb.matches(data, "tui.editor.deleteToLineStart")) {
      this.deleteToLineStart();
      return;
    }
    if (kb.matches(data, "tui.editor.deleteToLineEnd")) {
      this.deleteToLineEnd();
      return;
    }
    if (kb.matches(data, "tui.editor.yank")) {
      this.yank();
      return;
    }
    if (kb.matches(data, "tui.editor.yankPop")) {
      this.yankPop();
      return;
    }
    if (kb.matches(data, "tui.editor.cursorLeft")) {
      this.lastAction = null;
      if (this.cursor > 0) {
        const beforeCursor = this.value.slice(0, this.cursor);
        const graphemes = [...segmenter.segment(beforeCursor)];
        const lastGrapheme = graphemes[graphemes.length - 1];
        this.cursor -= lastGrapheme ? lastGrapheme.segment.length : 1;
      }
      return;
    }
    if (kb.matches(data, "tui.editor.cursorRight")) {
      this.lastAction = null;
      if (this.cursor < this.value.length) {
        const afterCursor = this.value.slice(this.cursor);
        const graphemes = [...segmenter.segment(afterCursor)];
        const firstGrapheme = graphemes[0];
        this.cursor += firstGrapheme ? firstGrapheme.segment.length : 1;
      }
      return;
    }
    if (kb.matches(data, "tui.editor.cursorLineStart")) {
      this.lastAction = null;
      this.cursor = 0;
      return;
    }
    if (kb.matches(data, "tui.editor.cursorLineEnd")) {
      this.lastAction = null;
      this.cursor = this.value.length;
      return;
    }
    if (kb.matches(data, "tui.editor.cursorWordLeft")) {
      this.moveWordBackwards();
      return;
    }
    if (kb.matches(data, "tui.editor.cursorWordRight")) {
      this.moveWordForwards();
      return;
    }
    const kittyPrintable = decodeKittyPrintable(data);
    if (kittyPrintable !== void 0) {
      this.insertCharacter(kittyPrintable);
      return;
    }
    const hasControlChars = [...data].some((ch) => {
      const code = ch.charCodeAt(0);
      return code < 32 || code === 127 || code >= 128 && code <= 159;
    });
    if (!hasControlChars) {
      this.insertCharacter(data);
    }
  }
  handleMouse(event) {
    if (event.type !== "press" || event.button !== "left" || event.y !== 0)
      return void 0;
    const visibleColumn = Math.max(0, event.x - 2);
    const targetColumn = this.renderedStartColumn + visibleColumn;
    let currentColumn = 0;
    this.cursor = this.value.length;
    for (const grapheme of segmenter.segment(this.value)) {
      const nextColumn = currentColumn + visibleWidth(grapheme.segment);
      if (targetColumn < nextColumn) {
        this.cursor = grapheme.index;
        break;
      }
      currentColumn = nextColumn;
    }
    this.lastAction = null;
    return { handled: true, focus: true };
  }
  insertCharacter(char) {
    if (isWhitespaceChar(char) || this.lastAction !== "type-word") {
      this.pushUndo();
    }
    this.lastAction = "type-word";
    this.value = this.value.slice(0, this.cursor) + char + this.value.slice(this.cursor);
    this.cursor += char.length;
  }
  handleBackspace() {
    this.lastAction = null;
    if (this.cursor > 0) {
      this.pushUndo();
      const beforeCursor = this.value.slice(0, this.cursor);
      const graphemes = [...segmenter.segment(beforeCursor)];
      const lastGrapheme = graphemes[graphemes.length - 1];
      const graphemeLength = lastGrapheme ? lastGrapheme.segment.length : 1;
      this.value = this.value.slice(0, this.cursor - graphemeLength) + this.value.slice(this.cursor);
      this.cursor -= graphemeLength;
    }
  }
  handleForwardDelete() {
    this.lastAction = null;
    if (this.cursor < this.value.length) {
      this.pushUndo();
      const afterCursor = this.value.slice(this.cursor);
      const graphemes = [...segmenter.segment(afterCursor)];
      const firstGrapheme = graphemes[0];
      const graphemeLength = firstGrapheme ? firstGrapheme.segment.length : 1;
      this.value = this.value.slice(0, this.cursor) + this.value.slice(this.cursor + graphemeLength);
    }
  }
  deleteToLineStart() {
    if (this.cursor === 0)
      return;
    this.pushUndo();
    const deletedText = this.value.slice(0, this.cursor);
    this.killRing.push(deletedText, { prepend: true, accumulate: this.lastAction === "kill" });
    this.lastAction = "kill";
    this.value = this.value.slice(this.cursor);
    this.cursor = 0;
  }
  deleteToLineEnd() {
    if (this.cursor >= this.value.length)
      return;
    this.pushUndo();
    const deletedText = this.value.slice(this.cursor);
    this.killRing.push(deletedText, { prepend: false, accumulate: this.lastAction === "kill" });
    this.lastAction = "kill";
    this.value = this.value.slice(0, this.cursor);
  }
  deleteWordBackwards() {
    if (this.cursor === 0)
      return;
    const wasKill = this.lastAction === "kill";
    this.pushUndo();
    const oldCursor = this.cursor;
    this.moveWordBackwards();
    const deleteFrom = this.cursor;
    this.cursor = oldCursor;
    const deletedText = this.value.slice(deleteFrom, this.cursor);
    this.killRing.push(deletedText, { prepend: true, accumulate: wasKill });
    this.lastAction = "kill";
    this.value = this.value.slice(0, deleteFrom) + this.value.slice(this.cursor);
    this.cursor = deleteFrom;
  }
  deleteWordForward() {
    if (this.cursor >= this.value.length)
      return;
    const wasKill = this.lastAction === "kill";
    this.pushUndo();
    const oldCursor = this.cursor;
    this.moveWordForwards();
    const deleteTo = this.cursor;
    this.cursor = oldCursor;
    const deletedText = this.value.slice(this.cursor, deleteTo);
    this.killRing.push(deletedText, { prepend: false, accumulate: wasKill });
    this.lastAction = "kill";
    this.value = this.value.slice(0, this.cursor) + this.value.slice(deleteTo);
  }
  yank() {
    const text = this.killRing.peek();
    if (!text)
      return;
    this.pushUndo();
    this.value = this.value.slice(0, this.cursor) + text + this.value.slice(this.cursor);
    this.cursor += text.length;
    this.lastAction = "yank";
  }
  yankPop() {
    if (this.lastAction !== "yank" || this.killRing.length <= 1)
      return;
    this.pushUndo();
    const prevText = this.killRing.peek() || "";
    this.value = this.value.slice(0, this.cursor - prevText.length) + this.value.slice(this.cursor);
    this.cursor -= prevText.length;
    this.killRing.rotate();
    const text = this.killRing.peek() || "";
    this.value = this.value.slice(0, this.cursor) + text + this.value.slice(this.cursor);
    this.cursor += text.length;
    this.lastAction = "yank";
  }
  pushUndo() {
    this.undoStack.push({ value: this.value, cursor: this.cursor });
  }
  undo() {
    const snapshot = this.undoStack.pop();
    if (!snapshot)
      return;
    this.value = snapshot.value;
    this.cursor = snapshot.cursor;
    this.lastAction = null;
  }
  moveWordBackwards() {
    if (this.cursor === 0)
      return;
    this.lastAction = null;
    this.cursor = findWordBackward(this.value, this.cursor);
  }
  moveWordForwards() {
    if (this.cursor >= this.value.length)
      return;
    this.lastAction = null;
    this.cursor = findWordForward(this.value, this.cursor);
  }
  handlePaste(pastedText) {
    this.lastAction = null;
    this.pushUndo();
    const cleanText = pastedText.replace(/\r\n/g, "").replace(/\r/g, "").replace(/\n/g, "").replace(/\t/g, "    ");
    this.value = this.value.slice(0, this.cursor) + cleanText + this.value.slice(this.cursor);
    this.cursor += cleanText.length;
  }
  invalidate() {
  }
  render(width) {
    const availableWidth = width - visibleWidth(this.prompt);
    if (availableWidth <= 0) {
      return [truncateToWidth(this.prompt, width, "")];
    }
    if (this.value.length === 0 && this.placeholder) {
      const placeholder = truncateToWidth(this.placeholder, availableWidth, "");
      const graphemes2 = [...segmenter.segment(placeholder)];
      const atCursor2 = graphemes2[0]?.segment ?? " ";
      const afterCursor2 = placeholder.slice(atCursor2.length);
      const marker2 = this.focused ? CURSOR_MARKER : "";
      const cursorChar2 = `\x1B[7m${this.placeholderStyle(atCursor2)}\x1B[27m`;
      const textWithCursor2 = marker2 + cursorChar2 + this.placeholderStyle(afterCursor2);
      const padding2 = " ".repeat(Math.max(0, availableWidth - visibleWidth(textWithCursor2)));
      return [this.prompt + textWithCursor2 + padding2];
    }
    let visibleText = "";
    let cursorDisplay = this.cursor;
    this.renderedStartColumn = 0;
    const totalWidth = visibleWidth(this.value);
    if (totalWidth < availableWidth) {
      visibleText = this.value;
    } else {
      const scrollWidth = this.cursor === this.value.length ? availableWidth - 1 : availableWidth;
      const cursorCol = visibleWidth(this.value.slice(0, this.cursor));
      if (scrollWidth > 0) {
        const halfWidth = Math.floor(scrollWidth / 2);
        let startCol = 0;
        if (cursorCol < halfWidth) {
          startCol = 0;
        } else if (cursorCol > totalWidth - halfWidth) {
          startCol = Math.max(0, totalWidth - scrollWidth);
        } else {
          startCol = Math.max(0, cursorCol - halfWidth);
        }
        this.renderedStartColumn = startCol;
        visibleText = sliceByColumn(this.value, startCol, scrollWidth, true);
        const beforeCursor2 = sliceByColumn(this.value, startCol, Math.max(0, cursorCol - startCol), true);
        cursorDisplay = beforeCursor2.length;
      } else {
        visibleText = "";
        cursorDisplay = 0;
      }
    }
    const graphemes = [...segmenter.segment(visibleText.slice(cursorDisplay))];
    const cursorGrapheme = graphemes[0];
    const beforeCursor = visibleText.slice(0, cursorDisplay);
    const atCursor = cursorGrapheme?.segment ?? " ";
    const afterCursor = visibleText.slice(cursorDisplay + atCursor.length);
    const marker = this.focused ? CURSOR_MARKER : "";
    const cursorChar = `\x1B[7m${atCursor}\x1B[27m`;
    const textWithCursor = beforeCursor + marker + cursorChar + afterCursor;
    const visualLength = visibleWidth(textWithCursor);
    const padding = " ".repeat(Math.max(0, availableWidth - visualLength));
    const line = this.prompt + textWithCursor + padding;
    return [line];
  }
};

// node_modules/@earendil-works/pi-tui/dist/latex.js
var SYMBOLS = {
  alpha: "\u03B1",
  beta: "\u03B2",
  gamma: "\u03B3",
  delta: "\u03B4",
  epsilon: "\u03F5",
  varepsilon: "\u03B5",
  zeta: "\u03B6",
  eta: "\u03B7",
  theta: "\u03B8",
  vartheta: "\u03D1",
  iota: "\u03B9",
  kappa: "\u03BA",
  varkappa: "\u03F0",
  lambda: "\u03BB",
  mu: "\u03BC",
  nu: "\u03BD",
  xi: "\u03BE",
  pi: "\u03C0",
  varpi: "\u03D6",
  rho: "\u03C1",
  varrho: "\u03F1",
  sigma: "\u03C3",
  varsigma: "\u03C2",
  tau: "\u03C4",
  upsilon: "\u03C5",
  phi: "\u03D5",
  varphi: "\u03C6",
  chi: "\u03C7",
  psi: "\u03C8",
  omega: "\u03C9",
  Gamma: "\u0393",
  Delta: "\u0394",
  Theta: "\u0398",
  Lambda: "\u039B",
  Xi: "\u039E",
  Pi: "\u03A0",
  Sigma: "\u03A3",
  Upsilon: "\u03A5",
  Phi: "\u03A6",
  Psi: "\u03A8",
  Omega: "\u03A9",
  pm: "\xB1",
  mp: "\u2213",
  times: "\xD7",
  div: "\xF7",
  cdot: "\xB7",
  ast: "\u2217",
  star: "\u22C6",
  circ: "\u2218",
  bullet: "\u2022",
  oplus: "\u2295",
  ominus: "\u2296",
  otimes: "\u2297",
  oslash: "\u2298",
  odot: "\u2299",
  bigcirc: "\u25CB",
  dagger: "\u2020",
  ddagger: "\u2021",
  amalg: "\u2A3F",
  uplus: "\u228E",
  sqcap: "\u2293",
  sqcup: "\u2294",
  bowtie: "\u22C8",
  Join: "\u22C8",
  ltimes: "\u22C9",
  rtimes: "\u22CA",
  leftouterjoin: "\u27D5",
  rightouterjoin: "\u27D6",
  fullouterjoin: "\u27D7",
  triangleleft: "\u25C1",
  triangleright: "\u25B7",
  wr: "\u2240",
  cap: "\u2229",
  cup: "\u222A",
  bigcap: "\u22C2",
  bigcup: "\u22C3",
  bigwedge: "\u22C0",
  bigvee: "\u22C1",
  bigsqcup: "\u2A06",
  biguplus: "\u2A04",
  bigoplus: "\u2A01",
  bigotimes: "\u2A02",
  bigodot: "\u2A00",
  setminus: "\u2216",
  in: "\u2208",
  notin: "\u2209",
  ni: "\u220B",
  subset: "\u2282",
  supset: "\u2283",
  subseteq: "\u2286",
  supseteq: "\u2287",
  sqsubset: "\u228F",
  sqsupset: "\u2290",
  sqsubseteq: "\u2291",
  sqsupseteq: "\u2292",
  prec: "\u227A",
  preceq: "\u227C",
  succ: "\u227B",
  succeq: "\u227D",
  ll: "\u226A",
  gg: "\u226B",
  le: "\u2264",
  leq: "\u2264",
  leqslant: "\u2264",
  ge: "\u2265",
  geq: "\u2265",
  geqslant: "\u2265",
  ne: "\u2260",
  neq: "\u2260",
  equiv: "\u2261",
  approx: "\u2248",
  sim: "\u223C",
  simeq: "\u2243",
  cong: "\u2245",
  asymp: "\u224D",
  doteq: "\u2250",
  propto: "\u221D",
  parallel: "\u2225",
  perp: "\u22A5",
  mid: "\u2223",
  vdash: "\u22A2",
  dashv: "\u22A3",
  models: "\u22A8",
  Vdash: "\u22A9",
  Vvdash: "\u22AA",
  nvdash: "\u22AC",
  nvDash: "\u22AD",
  forall: "\u2200",
  exists: "\u2203",
  nexists: "\u2204",
  neg: "\xAC",
  land: "\u2227",
  wedge: "\u2227",
  lor: "\u2228",
  vee: "\u2228",
  to: "\u2192",
  rightarrow: "\u2192",
  longrightarrow: "\u2192",
  leftarrow: "\u2190",
  longleftarrow: "\u2190",
  gets: "\u2190",
  leftrightarrow: "\u2194",
  longleftrightarrow: "\u2194",
  hookleftarrow: "\u21A9",
  hookrightarrow: "\u21AA",
  twoheadleftarrow: "\u219E",
  twoheadrightarrow: "\u21A0",
  leftharpoonup: "\u21BC",
  leftharpoondown: "\u21BD",
  rightharpoonup: "\u21C0",
  rightharpoondown: "\u21C1",
  rightleftharpoons: "\u21CC",
  leftrightharpoons: "\u21CB",
  nearrow: "\u2197",
  searrow: "\u2198",
  swarrow: "\u2199",
  nwarrow: "\u2196",
  rightsquigarrow: "\u21DD",
  leadsto: "\u21DD",
  Rightarrow: "\u21D2",
  Longrightarrow: "\u21D2",
  Leftarrow: "\u21D0",
  Longleftarrow: "\u21D0",
  Leftrightarrow: "\u21D4",
  Longleftrightarrow: "\u21D4",
  implies: "\u21D2",
  iff: "\u21D4",
  mapsto: "\u21A6",
  longmapsto: "\u21A6",
  uparrow: "\u2191",
  downarrow: "\u2193",
  partial: "\u2202",
  nabla: "\u2207",
  int: "\u222B",
  iint: "\u222C",
  iiint: "\u222D",
  oint: "\u222E",
  sum: "\u2211",
  prod: "\u220F",
  coprod: "\u2210",
  infty: "\u221E",
  emptyset: "\u2205",
  varnothing: "\u2205",
  angle: "\u2220",
  therefore: "\u2234",
  because: "\u2235",
  aleph: "\u2135",
  beth: "\u2136",
  gimel: "\u2137",
  daleth: "\u2138",
  top: "\u22A4",
  bot: "\u22A5",
  triangle: "\u25B3",
  square: "\u25A1",
  lozenge: "\u25CA",
  checkmark: "\u2713",
  complement: "\u2201",
  wp: "\u2118",
  prime: "\u2032",
  ldots: "\u2026",
  dots: "\u2026",
  cdots: "\u22EF",
  vdots: "\u22EE",
  ddots: "\u22F1",
  ell: "\u2113",
  hbar: "\u210F",
  Im: "\u2111",
  Re: "\u211C",
  langle: "\u27E8",
  rangle: "\u27E9",
  vert: "|",
  lvert: "|",
  rvert: "|",
  Vert: "\u2016",
  lVert: "\u2016",
  rVert: "\u2016",
  lbrace: "{",
  rbrace: "}",
  backslash: "\\",
  lfloor: "\u230A",
  rfloor: "\u230B",
  lceil: "\u2308",
  rceil: "\u2309",
  colon: ":"
};
var NAMED_OPERATORS = /* @__PURE__ */ new Set([
  "arccos",
  "arcsin",
  "arctan",
  "arg",
  "cos",
  "cosh",
  "cot",
  "coth",
  "csc",
  "deg",
  "det",
  "dim",
  "exp",
  "gcd",
  "hom",
  "inf",
  "ker",
  "lg",
  "lim",
  "liminf",
  "limsup",
  "ln",
  "log",
  "max",
  "min",
  "Pr",
  "sec",
  "sin",
  "sinh",
  "sup",
  "tan",
  "tanh"
]);
var LIMIT_OPERATORS = /* @__PURE__ */ new Set([
  "argmax",
  "argmin",
  "inf",
  "injlim",
  "lim",
  "liminf",
  "limsup",
  "max",
  "min",
  "projlim",
  "sup"
]);
var DISPLAY_LIMIT_SYMBOLS = /* @__PURE__ */ new Set([
  "bigcap",
  "bigcup",
  "bigodot",
  "bigoplus",
  "bigotimes",
  "bigsqcup",
  "biguplus",
  "bigvee",
  "bigwedge",
  "coprod",
  "int",
  "iint",
  "iiint",
  "oint",
  "prod",
  "sum"
]);
var RELATION_COMMANDS = /* @__PURE__ */ new Set([
  "Leftarrow",
  "Leftrightarrow",
  "Longleftarrow",
  "Longleftrightarrow",
  "Longrightarrow",
  "Rightarrow",
  "Join",
  "Vdash",
  "Vvdash",
  "approx",
  "asymp",
  "bowtie",
  "cong",
  "dashv",
  "fullouterjoin",
  "doteq",
  "downarrow",
  "equiv",
  "ge",
  "geq",
  "geqslant",
  "gets",
  "gg",
  "hookleftarrow",
  "hookrightarrow",
  "iff",
  "implies",
  "in",
  "leadsto",
  "le",
  "leftarrow",
  "leftharpoondown",
  "leftharpoonup",
  "leftrightarrow",
  "leftrightharpoons",
  "leftouterjoin",
  "leq",
  "leqslant",
  "ll",
  "longleftarrow",
  "longleftrightarrow",
  "longmapsto",
  "longrightarrow",
  "ltimes",
  "mapsto",
  "mid",
  "models",
  "ne",
  "nearrow",
  "neq",
  "ni",
  "notin",
  "nvdash",
  "nvDash",
  "nwarrow",
  "parallel",
  "perp",
  "prec",
  "preceq",
  "propto",
  "rightharpoondown",
  "rightharpoonup",
  "rightleftharpoons",
  "rightouterjoin",
  "rightarrow",
  "rightsquigarrow",
  "rtimes",
  "searrow",
  "sim",
  "simeq",
  "sqsubset",
  "sqsubseteq",
  "sqsupset",
  "sqsupseteq",
  "subset",
  "subseteq",
  "succ",
  "succeq",
  "supset",
  "supseteq",
  "swarrow",
  "to",
  "triangleleft",
  "triangleright",
  "twoheadleftarrow",
  "twoheadrightarrow",
  "uparrow",
  "vdash"
]);
var NEGATED_SYMBOLS = {
  "<": "\u226E",
  ">": "\u226F",
  "=": "\u2260",
  "\u2208": "\u2209",
  "\u220B": "\u220C",
  "\u2223": "\u2224",
  "\u2225": "\u2226",
  "\u223C": "\u2241",
  "\u2243": "\u2244",
  "\u2245": "\u2247",
  "\u2248": "\u2249",
  "\u2261": "\u2262",
  "\u2264": "\u2270",
  "\u2265": "\u2271",
  "\u227A": "\u2280",
  "\u227B": "\u2281",
  "\u2282": "\u2284",
  "\u2283": "\u2285",
  "\u2286": "\u2288",
  "\u2287": "\u2289",
  "\u22A2": "\u22AC",
  "\u22A8": "\u22AD",
  "\u2194": "\u21AE",
  "\u2190": "\u219A",
  "\u2192": "\u219B",
  "\u21D2": "\u21CF",
  "\u21D0": "\u21CD",
  "\u21D4": "\u21CE",
  "\u227C": "\u22E0",
  "\u227D": "\u22E1"
};
var BLACKBOARD = {
  C: "\u2102",
  H: "\u210D",
  N: "\u2115",
  P: "\u2119",
  Q: "\u211A",
  R: "\u211D",
  Z: "\u2124"
};
var SUPERSCRIPTS = {
  "0": "\u2070",
  "1": "\xB9",
  "2": "\xB2",
  "3": "\xB3",
  "4": "\u2074",
  "5": "\u2075",
  "6": "\u2076",
  "7": "\u2077",
  "8": "\u2078",
  "9": "\u2079",
  "+": "\u207A",
  "-": "\u207B",
  "=": "\u207C",
  "(": "\u207D",
  ")": "\u207E",
  a: "\u1D43",
  b: "\u1D47",
  c: "\u1D9C",
  d: "\u1D48",
  e: "\u1D49",
  f: "\u1DA0",
  g: "\u1D4D",
  h: "\u02B0",
  i: "\u2071",
  j: "\u02B2",
  k: "\u1D4F",
  l: "\u02E1",
  m: "\u1D50",
  n: "\u207F",
  o: "\u1D52",
  p: "\u1D56",
  r: "\u02B3",
  s: "\u02E2",
  t: "\u1D57",
  u: "\u1D58",
  v: "\u1D5B",
  w: "\u02B7",
  x: "\u02E3",
  y: "\u02B8",
  z: "\u1DBB"
};
var SUBSCRIPTS = {
  "0": "\u2080",
  "1": "\u2081",
  "2": "\u2082",
  "3": "\u2083",
  "4": "\u2084",
  "5": "\u2085",
  "6": "\u2086",
  "7": "\u2087",
  "8": "\u2088",
  "9": "\u2089",
  "+": "\u208A",
  "-": "\u208B",
  "=": "\u208C",
  "(": "\u208D",
  ")": "\u208E",
  a: "\u2090",
  e: "\u2091",
  h: "\u2095",
  i: "\u1D62",
  j: "\u2C7C",
  k: "\u2096",
  l: "\u2097",
  m: "\u2098",
  n: "\u2099",
  o: "\u2092",
  p: "\u209A",
  r: "\u1D63",
  s: "\u209B",
  t: "\u209C",
  u: "\u1D64",
  v: "\u1D65",
  x: "\u2093"
};
var SPACING_COMMANDS = /* @__PURE__ */ new Set([
  ",",
  ":",
  ";",
  " ",
  ">",
  "enspace",
  "enskip",
  "medspace",
  "quad",
  "qquad",
  "thickspace",
  "thinspace"
]);
var NEGATIVE_SPACING_COMMANDS = /* @__PURE__ */ new Set(["!", "negmedspace", "negthickspace", "negthinspace"]);
var NEGATIVE_SPACE = "\0";
var FONT_SWITCH_COMMANDS = /* @__PURE__ */ new Set(["bf", "cal", "it", "rm", "sf", "sl", "tt"]);
var IGNORED_COMMANDS = /* @__PURE__ */ new Set([
  "displaystyle",
  "limits",
  "nolimits",
  "scriptstyle",
  "scriptscriptstyle",
  "textstyle"
]);
var SIZE_COMMANDS = /* @__PURE__ */ new Set([
  "big",
  "Big",
  "bigg",
  "Bigg",
  "bigl",
  "Bigl",
  "biggl",
  "Biggl",
  "bigr",
  "Bigr",
  "biggr",
  "Biggr"
]);
var PLAIN_WRAPPERS = /* @__PURE__ */ new Set([
  "emph",
  "mathcal",
  "mathbf",
  "mathfrak",
  "mathit",
  "mathrm",
  "mathnormal",
  "mathscr",
  "mathsf",
  "mathtt",
  "mathup",
  "mbox",
  "overbrace",
  "pmb",
  "smash",
  "substack",
  "text",
  "textbf",
  "textit",
  "textmd",
  "textnormal",
  "textrm",
  "textsc",
  "textsf",
  "textsl",
  "texttt",
  "textup",
  "underbrace",
  "bm",
  "boldsymbol"
]);
var ACCENTS = {
  acute: "\u0301",
  bar: "\u0305",
  breve: "\u0306",
  check: "\u030C",
  ddot: "\u0308",
  dot: "\u0307",
  grave: "\u0300",
  hat: "\u0302",
  mathring: "\u030A",
  overleftarrow: "\u20D6",
  overleftrightarrow: "\u20E1",
  overline: "\u0305",
  overrightarrow: "\u20D7",
  tilde: "\u0303",
  underline: "\u0332",
  vec: "\u20D7",
  widehat: "\u0302",
  widetilde: "\u0303"
};
function replaceCharacters(value, replacements) {
  let result = "";
  for (const character of value) {
    const replacement = replacements[character];
    if (replacement === void 0) {
      return void 0;
    }
    result += replacement;
  }
  return result;
}
function normalizeScriptValue(value) {
  return value.trim().replace(/\s*([=+-])\s*/g, "$1");
}
function formatUnicodeScript(value, kind) {
  return replaceCharacters(normalizeScriptValue(value), kind === "sub" ? SUBSCRIPTS : SUPERSCRIPTS);
}
function formatScript(value, kind) {
  value = normalizeScriptValue(value);
  const unicode = formatUnicodeScript(value, kind);
  if (unicode !== void 0) {
    return unicode;
  }
  const prefix = kind === "sub" ? "_" : "^";
  if (Array.from(value).length === 1 || kind === "sub" && /^[A-Za-z]+$/.test(value)) {
    return `${prefix}${value}`;
  }
  return `${prefix}(${value})`;
}
function formatFraction(numerator, denominator) {
  numerator = numerator.trim();
  denominator = denominator.trim();
  const simpleNumerator = /^[\p{L}\p{N}.]+$/u.test(numerator);
  const simpleDenominator = /^[\p{N}.]+$/u.test(denominator) || Array.from(denominator).length === 1;
  return `${simpleNumerator ? numerator : `(${numerator})`}/${simpleDenominator ? denominator : `(${denominator})`}`;
}
function formatRoot(value, symbol = "\u221A") {
  value = value.trim();
  return /^[\p{L}\p{N}.]+$/u.test(value) ? `${symbol}${value}` : `${symbol}(${value})`;
}
var NAMED_OPERATOR_START = "\u{F0004}";
var NAMED_OPERATOR_END = "\u{F0005}";
var NAMED_OPERATOR_LEFT_SPACING_PATTERN = /(?<=[\p{L}\p{N})\]}\u{f0001}])\u{f0004}/gu;
var NAMED_OPERATOR_RIGHT_SPACING_PATTERN = /\u{f0005}(?=[\p{L}\p{N}√\u{f0000}])/gu;
function normalizeOutput(value) {
  return value.replace(NAMED_OPERATOR_LEFT_SPACING_PATTERN, " ").replaceAll(NAMED_OPERATOR_START, "").replace(NAMED_OPERATOR_RIGHT_SPACING_PATTERN, " ").replaceAll(NAMED_OPERATOR_END, "").split("\n").map((line) => line.replace(/[ \t]+/g, " ").trim()).filter((line, index, lines) => line.length > 0 || index > 0 && index < lines.length - 1).join("\n").trim();
}
var LAYOUT_MARKER_START = "\u{F0000}";
var LAYOUT_MARKER_END = "\u{F0001}";
var LAYOUT_MARKER_PATTERN = /\u{f0000}(\d+)\u{f0001}/gu;
var TRAILING_LAYOUT_MARKER_PATTERN = /\u{f0000}(\d+)\u{f0001}$/u;
var PROTECTED_SPACE = "\u{F0002}";
function padLayoutLine(line, width, centered = false) {
  const padding = Math.max(0, width - visibleWidth(line));
  const left = centered ? Math.floor(padding / 2) : 0;
  return `${" ".repeat(left)}${line}${" ".repeat(padding - left)}`;
}
function joinLayouts(layouts) {
  if (layouts.length === 0) {
    return { lines: [""], width: 0, baseline: 0 };
  }
  const baseline = Math.max(...layouts.map((layout) => layout.baseline));
  const below = Math.max(...layouts.map((layout) => layout.lines.length - layout.baseline - 1));
  const lines = [];
  for (let row = 0; row <= baseline + below; row++) {
    let line = "";
    for (const layout of layouts) {
      const sourceRow = row - baseline + layout.baseline;
      line += sourceRow >= 0 && sourceRow < layout.lines.length ? padLayoutLine(layout.lines[sourceRow] ?? "", layout.width) : " ".repeat(layout.width);
    }
    lines.push(line.trimEnd());
  }
  return {
    lines,
    width: layouts.reduce((width, layout) => width + layout.width, 0),
    baseline
  };
}
function renderLayout(source, nodes) {
  const renderedLines = [];
  let firstBaseline = 0;
  for (const sourceLine of source.split("\n")) {
    const layouts = [];
    let position = 0;
    let previousNode;
    for (const match of sourceLine.matchAll(LAYOUT_MARKER_PATTERN)) {
      const index = match.index;
      const node = nodes[Number(match[1])];
      if (!node) {
        continue;
      }
      if (index > position) {
        const sliced = sourceLine.slice(position, index);
        const trimmed = (previousNode ? sliced.trimStart() : sliced).trimEnd();
        const preserveLeadingSpace = previousNode?.type === "matrix" && /^\s/.test(sliced);
        const preserveTrailingSpace = node.type === "matrix" && /\s$/.test(sliced);
        const text = trimmed ? `${preserveLeadingSpace ? " " : ""}${trimmed}${preserveTrailingSpace ? " " : ""}` : preserveLeadingSpace || preserveTrailingSpace ? " " : "";
        layouts.push({ lines: [text], width: visibleWidth(text), baseline: 0 });
      }
      if (node.type === "fraction") {
        const numerator = renderLayout(node.numerator, nodes);
        const denominator = renderLayout(node.denominator, nodes);
        const contentWidth = Math.max(numerator.width, denominator.width, 1);
        const width = contentWidth + 2;
        layouts.push({
          lines: [
            ...numerator.lines.map((line) => padLayoutLine(line, width, true)),
            ` ${"\u2500".repeat(contentWidth)} `,
            ...denominator.lines.map((line) => padLayoutLine(line, width, true))
          ],
          width,
          baseline: numerator.lines.length
        });
      } else if (node.type === "operator") {
        const contentWidth = Math.max(visibleWidth(node.operator), node.lower === void 0 ? 0 : visibleWidth(node.lower), node.upper === void 0 ? 0 : visibleWidth(node.upper));
        const lines = [];
        if (node.upper !== void 0) {
          lines.push(`${padLayoutLine(node.upper, contentWidth, true)} `);
        }
        lines.push(`${padLayoutLine(node.operator, contentWidth, true)} `);
        if (node.lower !== void 0) {
          lines.push(`${padLayoutLine(node.lower, contentWidth, true)} `);
        }
        layouts.push({
          lines,
          width: contentWidth + 1,
          baseline: node.upper === void 0 ? 0 : 1
        });
      } else if (node.type === "script") {
        const upper = node.upper === void 0 ? void 0 : renderLayout(node.upper, nodes);
        const lower = node.lower === void 0 ? void 0 : renderLayout(node.lower, nodes);
        const width = Math.max(upper?.width ?? 0, lower?.width ?? 0);
        layouts.push({
          lines: [
            ...upper?.lines.map((line) => padLayoutLine(line, width)) ?? [],
            " ".repeat(width),
            ...lower?.lines.map((line) => padLayoutLine(line, width)) ?? []
          ],
          width,
          baseline: upper?.lines.length ?? 0
        });
      } else {
        const width = Math.max(0, ...node.lines.map((line) => visibleWidth(line)));
        layouts.push({
          lines: node.lines.map((line) => padLayoutLine(line, width)),
          width,
          baseline: node.baseline
        });
      }
      position = index + match[0].length;
      previousNode = node;
    }
    if (position < sourceLine.length) {
      const sliced = sourceLine.slice(position);
      const trimmed = previousNode ? sliced.trimStart() : sliced;
      const text = previousNode?.type === "matrix" && /^\s/.test(sliced) ? ` ${trimmed}` : trimmed;
      layouts.push({ lines: [text], width: visibleWidth(text), baseline: 0 });
    }
    const lineLayout = joinLayouts(layouts);
    if (renderedLines.length === 0) {
      firstBaseline = lineLayout.baseline;
    }
    renderedLines.push(...lineLayout.lines);
  }
  return {
    lines: renderedLines,
    width: Math.max(0, ...renderedLines.map((line) => visibleWidth(line))),
    baseline: firstBaseline
  };
}
var LatexParser = class _LatexParser {
  source;
  layoutNodes;
  display;
  position = 0;
  supported = true;
  stackFractions = true;
  scriptDepth = 0;
  constructor(source, layoutNodes, display) {
    this.source = source;
    this.layoutNodes = layoutNodes;
    this.display = display;
  }
  render() {
    const rendered = this.parseSequence();
    if (!this.supported || this.position !== this.source.length) {
      return void 0;
    }
    return normalizeOutput(rendered);
  }
  parseSequence(endCharacter) {
    let result = "";
    while (this.position < this.source.length) {
      const character = this.source[this.position];
      if (endCharacter && character === endCharacter) {
        this.position++;
        return result;
      }
      if (character === "}") {
        this.supported = false;
        return result;
      }
      if (character === "{") {
        this.position++;
        result += this.parseSequence("}");
        continue;
      }
      if (character === "\\") {
        const command = this.parseCommand();
        if (command === NEGATIVE_SPACE) {
          result = result.trimEnd();
          if (result.endsWith(NAMED_OPERATOR_END)) {
            result = result.slice(0, -NAMED_OPERATOR_END.length);
          }
        } else {
          result += command;
        }
        continue;
      }
      if (character === "^" || character === "_") {
        this.position++;
        result = result.trimEnd();
        const script = this.parseScripts(character);
        if (result.endsWith(NAMED_OPERATOR_END)) {
          result = `${result.slice(0, -NAMED_OPERATOR_END.length)}${script}${NAMED_OPERATOR_END}`;
        } else {
          result += script;
        }
        continue;
      }
      if (/\s/.test(character)) {
        result += this.parseWhitespace();
        continue;
      }
      if (character === "=" || character === "<" || character === ">") {
        result = `${result.trimEnd()} ${character} `;
        this.position++;
        continue;
      }
      if (character === "&") {
        this.position++;
        continue;
      }
      if (character === "~") {
        this.position++;
        result += " ";
        continue;
      }
      if (character === ".") {
        const marker = TRAILING_LAYOUT_MARKER_PATTERN.exec(result);
        const node = marker ? this.layoutNodes[Number(marker[1])] : void 0;
        if (node?.type === "matrix") {
          const lastLine = node.lines.length - 1;
          node.lines[lastLine] = `${node.lines[lastLine] ?? ""}${character}`;
          this.position++;
          continue;
        }
      }
      result += character;
      this.position++;
    }
    if (endCharacter) {
      this.supported = false;
    }
    return result;
  }
  parseScripts(initialMarker) {
    const scripts = {};
    const order = [];
    const parse = (marker) => {
      const kind = marker === "_" ? "sub" : "sup";
      this.scriptDepth++;
      try {
        scripts[kind] = this.parseRequiredArgument(false);
      } finally {
        this.scriptDepth--;
      }
      order.push(kind);
    };
    parse(initialMarker);
    let nextPosition = this.position;
    while (nextPosition < this.source.length && /\s/.test(this.source[nextPosition] ?? "")) {
      nextPosition++;
    }
    const nextMarker = this.source[nextPosition];
    if ((nextMarker === "^" || nextMarker === "_") && nextMarker !== initialMarker) {
      this.position = nextPosition + 1;
      parse(nextMarker);
    }
    const subUnicode = scripts.sub === void 0 ? void 0 : formatUnicodeScript(scripts.sub, "sub");
    const supUnicode = scripts.sup === void 0 ? void 0 : formatUnicodeScript(scripts.sup, "sup");
    const canUseLayout = ![scripts.sub, scripts.sup].some((value) => value !== void 0 && (value.includes("/") || !value.includes(LAYOUT_MARKER_START) && Array.from(value).length > 1 && !/[A-Z*∗]/.test(value)));
    const needsLayout = this.display && canUseLayout && (this.scriptDepth > 0 || scripts.sub !== void 0 && subUnicode === void 0 || scripts.sup !== void 0 && supUnicode === void 0);
    if (!needsLayout) {
      return order.map((kind) => kind === "sub" ? subUnicode ?? formatScript(scripts.sub ?? "", kind) : supUnicode ?? formatScript(scripts.sup ?? "", kind)).join("");
    }
    const index = this.layoutNodes.push({
      type: "script",
      lower: scripts.sub === void 0 ? void 0 : normalizeOutput(scripts.sub),
      upper: scripts.sup === void 0 ? void 0 : normalizeOutput(scripts.sup)
    }) - 1;
    return `${LAYOUT_MARKER_START}${index}${LAYOUT_MARKER_END}`;
  }
  parseWhitespace() {
    while (this.position < this.source.length && /\s/.test(this.source[this.position] ?? "")) {
      this.position++;
    }
    return " ";
  }
  parseCommand() {
    this.position++;
    if (this.position >= this.source.length) {
      this.supported = false;
      return "";
    }
    let command = "";
    const first = this.source[this.position] ?? "";
    if (first === "\n" || first === "\r") {
      this.position++;
      if (first === "\r" && this.source[this.position] === "\n") {
        this.position++;
      }
      return " ";
    }
    if (/[A-Za-z]/.test(first)) {
      const start = this.position;
      while (this.position < this.source.length && /[A-Za-z]/.test(this.source[this.position] ?? "")) {
        this.position++;
      }
      command = this.source.slice(start, this.position);
    } else {
      command = first;
      this.position++;
    }
    if (command === "\\") {
      return "\n";
    }
    if (SPACING_COMMANDS.has(command)) {
      return " ";
    }
    if (NEGATIVE_SPACING_COMMANDS.has(command)) {
      return NEGATIVE_SPACE;
    }
    if (FONT_SWITCH_COMMANDS.has(command)) {
      while (this.position < this.source.length && /\s/.test(this.source[this.position] ?? "")) {
        this.position++;
      }
      return "";
    }
    if (IGNORED_COMMANDS.has(command)) {
      return "";
    }
    if (command === "{" || command === "}" || command === "$" || command === "%" || command === "#" || command === "_" || command === "&") {
      return command;
    }
    if (command === "|") {
      return "\u2016";
    }
    if (command === "not") {
      const value = this.parseRequiredArgument(false).trim();
      const negated = NEGATED_SYMBOLS[value];
      if (negated !== void 0) {
        return ` ${negated} `;
      }
      const characters = Array.from(value);
      if (characters.length === 0) {
        this.supported = false;
        return "";
      }
      return ` ${characters[0]}\u0338${characters.slice(1).join("")} `;
    }
    if (LIMIT_OPERATORS.has(command)) {
      return this.parseOperator(command, "bracket", true, true);
    }
    const symbol = SYMBOLS[command];
    if (symbol !== void 0) {
      if (DISPLAY_LIMIT_SYMBOLS.has(command)) {
        return this.parseOperator(symbol, "script", true);
      }
      return command === "cdot" || command === "times" || RELATION_COMMANDS.has(command) ? ` ${symbol} ` : symbol;
    }
    if (NAMED_OPERATORS.has(command)) {
      return `${NAMED_OPERATOR_START}${command}${NAMED_OPERATOR_END}`;
    }
    if (SIZE_COMMANDS.has(command)) {
      return "";
    }
    if (command === "left" || command === "middle" || command === "right") {
      if (this.source[this.position] === ".") {
        this.position++;
      }
      return "";
    }
    if (command === "frac" || command === "dfrac" || command === "tfrac") {
      const shouldStack = this.display && this.stackFractions && command !== "tfrac";
      const numerator = this.parseRequiredArgument(!shouldStack);
      const denominator = this.parseRequiredArgument(!shouldStack);
      if (shouldStack) {
        const index = this.layoutNodes.push({
          type: "fraction",
          numerator: normalizeOutput(numerator),
          denominator: normalizeOutput(denominator)
        }) - 1;
        return `${LAYOUT_MARKER_START}${index}${LAYOUT_MARKER_END}`;
      }
      return formatFraction(numerator, denominator);
    }
    if (command === "sqrt") {
      const degree = this.parseOptionalArgument()?.trim();
      const value = this.parseRequiredArgument();
      if (degree === void 0 || degree === "2") {
        return formatRoot(value);
      }
      if (degree === "3") {
        return formatRoot(value, "\u221B");
      }
      if (degree === "4") {
        return formatRoot(value, "\u221C");
      }
      return `${formatScript(degree, "sup")}${formatRoot(value)}`;
    }
    if (command === "boxed" || command === "fbox") {
      return `[${this.parseRequiredArgument().trim()}]`;
    }
    if (command === "binom" || command === "dbinom" || command === "tbinom") {
      return `(${this.parseRequiredArgument()} choose ${this.parseRequiredArgument()})`;
    }
    const accent = ACCENTS[command];
    if (accent !== void 0) {
      const value = this.parseRequiredArgument();
      return Array.from(value).length === 1 ? `${value}${accent}` : `${command}(${value})`;
    }
    if (command === "mathbb") {
      const value = this.parseRequiredArgument();
      return Array.from(value, (character) => BLACKBOARD[character] ?? character).join("");
    }
    if (command === "operatorname") {
      const starred = this.source[this.position] === "*";
      if (starred) {
        this.position++;
      }
      const operator = normalizeOutput(this.parseRequiredArgument()).trim();
      return this.parseOperator(operator, "bracket", starred, true);
    }
    if (command === "mod" || command === "bmod") {
      return " mod ";
    }
    if (command === "pmod" || command === "pod") {
      const value = this.parseRequiredArgument().trim();
      return command === "pmod" ? ` (mod ${value})` : ` (${value})`;
    }
    if (command === "overset" || command === "stackrel") {
      const upper = this.parseRequiredArgument();
      const value = this.parseRequiredArgument().trim();
      return `${value}${formatScript(upper, "sup")}`;
    }
    if (command === "underset") {
      const lower = this.parseRequiredArgument();
      const value = this.parseRequiredArgument().trim();
      return `${value}${formatScript(lower, "sub")}`;
    }
    if (PLAIN_WRAPPERS.has(command)) {
      const value = this.parseRequiredArgument();
      return command.startsWith("text") || command === "mbox" ? value : value.trim();
    }
    if (command === "begin") {
      return this.parseEnvironment();
    }
    if (command === "end") {
      this.supported = false;
      return "";
    }
    this.supported = false;
    return `\\${command}`;
  }
  parseOperator(operator, inlineLowerStyle, displayLimits, spaced = false) {
    let useDisplayLimits = displayLimits;
    let modifierPosition = this.position;
    while (modifierPosition < this.source.length && /[ \t]/.test(this.source[modifierPosition] ?? "")) {
      modifierPosition++;
    }
    const modifier = /^\\(limits|nolimits)(?![A-Za-z])/.exec(this.source.slice(modifierPosition));
    if (modifier) {
      useDisplayLimits = modifier[1] === "limits";
      this.position = modifierPosition + modifier[0].length;
    }
    let lower;
    let upper;
    while (true) {
      let scriptPosition = this.position;
      while (scriptPosition < this.source.length && /[ \t]/.test(this.source[scriptPosition] ?? "")) {
        scriptPosition++;
      }
      const kind = this.source[scriptPosition];
      if (kind !== "_" && kind !== "^") {
        break;
      }
      this.position = scriptPosition + 1;
      const value = normalizeOutput(this.parseRequiredArgument(false)).replaceAll(" ", "");
      if (kind === "_") {
        if (lower !== void 0) {
          this.supported = false;
        }
        lower = value;
      } else {
        if (upper !== void 0) {
          this.supported = false;
        }
        upper = value;
      }
    }
    if (this.display && useDisplayLimits && (lower !== void 0 || upper !== void 0)) {
      const index = this.layoutNodes.push({ type: "operator", operator, lower, upper }) - 1;
      return `${LAYOUT_MARKER_START}${index}${LAYOUT_MARKER_END}`;
    }
    let rendered = operator;
    if (lower !== void 0) {
      rendered += inlineLowerStyle === "bracket" ? `[${lower}]` : formatScript(lower, "sub");
    }
    if (upper !== void 0) {
      rendered += formatScript(upper, "sup");
    }
    return spaced ? ` ${rendered} ` : rendered;
  }
  parseRequiredArgument(stackFractions = true) {
    const previousStackFractions = this.stackFractions;
    this.stackFractions = previousStackFractions && stackFractions;
    const value = this.parseRequiredArgumentValue();
    this.stackFractions = previousStackFractions;
    return value;
  }
  parseRequiredArgumentValue() {
    while (this.position < this.source.length && /\s/.test(this.source[this.position] ?? "")) {
      this.position++;
    }
    if (this.position >= this.source.length) {
      this.supported = false;
      return "";
    }
    if (this.source[this.position] === "{") {
      this.position++;
      return this.parseSequence("}");
    }
    if (this.source[this.position] === "\\") {
      return this.parseCommand();
    }
    const value = this.source[this.position] ?? "";
    this.position++;
    return value;
  }
  parseOptionalArgument() {
    while (this.position < this.source.length && /[ \t]/.test(this.source[this.position] ?? "")) {
      this.position++;
    }
    if (this.source[this.position] !== "[") {
      return void 0;
    }
    const end = this.source.indexOf("]", this.position + 1);
    if (end < 0) {
      this.supported = false;
      return void 0;
    }
    const value = this.source.slice(this.position + 1, end);
    this.position = end + 1;
    return this.renderNested(value);
  }
  readRawGroup() {
    while (this.position < this.source.length && /[ \t]/.test(this.source[this.position] ?? "")) {
      this.position++;
    }
    if (this.source[this.position] !== "{") {
      this.supported = false;
      return void 0;
    }
    const start = ++this.position;
    let depth = 1;
    while (this.position < this.source.length) {
      const character = this.source[this.position];
      if (character === "\\") {
        this.position += 2;
        continue;
      }
      if (character === "{")
        depth++;
      if (character === "}")
        depth--;
      if (depth === 0) {
        const value = this.source.slice(start, this.position);
        this.position++;
        return value;
      }
      this.position++;
    }
    this.supported = false;
    return void 0;
  }
  splitEnvironmentRows(body) {
    return body.split(/\\\\(?:\[[^\]\n]*\])?/);
  }
  parseEnvironment() {
    const environment = this.readRawGroup();
    if (!environment) {
      return "";
    }
    const endMarker = `\\end{${environment}}`;
    const end = this.source.indexOf(endMarker, this.position);
    if (end < 0) {
      this.supported = false;
      return "";
    }
    const body = this.source.slice(this.position, end);
    this.position = end + endMarker.length;
    if (environment === "equation" || environment === "equation*" || environment === "displaymath") {
      return this.renderNested(body).trim();
    }
    if (environment === "aligned" || environment === "align" || environment === "align*" || environment === "alignedat" || environment === "alignat" || environment === "alignat*" || environment === "gather" || environment === "gathered" || environment === "multline" || environment === "multline*" || environment === "split") {
      const alignedAt = ["alignedat", "alignat", "alignat*"].includes(environment);
      const alignedBody = alignedAt ? body.replace(/^\s*\{[^}]*\}/, "") : body;
      return this.splitEnvironmentRows(alignedBody).map((row) => {
        const cells = row.split("&");
        const source = alignedAt ? Array.from({ length: Math.ceil(cells.length / 2) }, (_2, index) => cells.slice(index * 2, index * 2 + 2).join("")).join(" ") : cells.join("");
        return this.renderNested(source).trim();
      }).filter(Boolean).join("\n");
    }
    if (environment === "cases" || environment === "cases*") {
      return this.renderCases(body);
    }
    if (["array", "matrix", "smallmatrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix"].includes(environment)) {
      const matrixBody = environment === "array" ? body.replace(/^\s*\{[^}]*\}/, "") : body;
      return this.renderMatrix(environment, matrixBody);
    }
    this.supported = false;
    return body;
  }
  renderCases(body) {
    const rows = this.splitEnvironmentRows(body).map((row) => row.split("&").map((cell) => this.renderNested(cell, false).trim())).filter((row) => row.some(Boolean));
    const valueWidth = Math.max(0, ...rows.map((row) => visibleWidth((row[0] ?? "").replace(/,\s*$/, ""))));
    const contents = rows.map((row) => {
      const value = (row[0] ?? "").replace(/,\s*$/, "");
      const condition = row[1] ?? "";
      if (!condition) {
        return value;
      }
      const conditionPrefix = /^(?:if|when|for|otherwise)\b/i.test(condition) ? " " : " if ";
      return `${value}${PROTECTED_SPACE.repeat(valueWidth - visibleWidth(value))}${conditionPrefix}${condition}`;
    });
    if (contents.length <= 1) {
      return contents.length === 0 ? "" : `\u23A7 ${contents[0]}`;
    }
    const middle = Math.floor(contents.length / 2);
    const visualRows = [...contents];
    if (contents.length % 2 === 0) {
      visualRows.splice(middle, 0, void 0);
    }
    const lines = visualRows.map((content, index2) => {
      const delimiter = index2 === 0 ? "\u23A7" : index2 === visualRows.length - 1 ? "\u23A9" : "\u23A8";
      return content === void 0 ? delimiter : `${delimiter} ${content}`;
    });
    const index = this.layoutNodes.push({ type: "matrix", lines, baseline: middle }) - 1;
    return `${LAYOUT_MARKER_START}${index}${LAYOUT_MARKER_END}`;
  }
  renderMatrix(environment, body) {
    const matrix = this.splitEnvironmentRows(body).map((row) => row.split("&").map((cell) => this.renderNested(cell, false).trim())).filter((row) => row.some(Boolean));
    const columnCount = Math.max(0, ...matrix.map((row) => row.length));
    const columnWidths = Array.from({ length: columnCount }, (_2, column) => Math.max(0, ...matrix.map((row) => visibleWidth(row[column] ?? ""))));
    const rows = matrix.map((row) => Array.from({ length: columnCount }, (_2, column) => {
      const cell = row[column] ?? "";
      return `${cell}${PROTECTED_SPACE.repeat(Math.max(0, (columnWidths[column] ?? 0) - visibleWidth(cell)))}`;
    }).join(" \u2502 "));
    let lines;
    if (environment === "array" || environment === "matrix" || environment === "smallmatrix") {
      lines = rows;
    } else {
      const delimiters = {
        pmatrix: ["\u239B", "\u239E", "\u239C", "\u239F", "\u239D", "\u23A0"],
        bmatrix: ["\u23A1", "\u23A4", "\u23A2", "\u23A5", "\u23A3", "\u23A6"],
        Bmatrix: ["\u23A7", "\u23AB", "\u23A8", "\u23AC", "\u23A9", "\u23AD"],
        vmatrix: ["\u2502", "\u2502", "\u2502", "\u2502", "\u2502", "\u2502"],
        Vmatrix: ["\u2551", "\u2551", "\u2551", "\u2551", "\u2551", "\u2551"]
      };
      const delimiter = delimiters[environment];
      if (!delimiter) {
        this.supported = false;
        return rows.join("\n");
      }
      lines = rows.map((row, index2) => {
        const left = index2 === 0 ? delimiter[0] : index2 === rows.length - 1 ? delimiter[4] : delimiter[2];
        const right = index2 === 0 ? delimiter[1] : index2 === rows.length - 1 ? delimiter[5] : delimiter[3];
        return `${left} ${row} ${right}`;
      });
    }
    if (lines.length <= 1) {
      return lines[0] ?? "";
    }
    const index = this.layoutNodes.push({ type: "matrix", lines, baseline: 0 }) - 1;
    return `${LAYOUT_MARKER_START}${index}${LAYOUT_MARKER_END}`;
  }
  renderNested(source, stackFractions = true) {
    const rendered = new _LatexParser(source, this.layoutNodes, this.display && stackFractions).render();
    if (rendered === void 0) {
      this.supported = false;
      return source;
    }
    return rendered;
  }
};
function renderLatex(source, options = {}) {
  const layoutNodes = [];
  const rendered = new LatexParser(source, layoutNodes, options.display === true).render();
  if (rendered === void 0) {
    return void 0;
  }
  if (layoutNodes.length === 0) {
    return rendered.replaceAll(PROTECTED_SPACE, " ");
  }
  const lines = renderLayout(rendered, layoutNodes).lines;
  const indentation = Math.min(...lines.filter((line) => line.trim()).map((line) => line.length - line.trimStart().length));
  return lines.map((line) => line.slice(indentation).trimEnd()).join("\n").trimEnd().replaceAll(PROTECTED_SPACE, " ");
}

// node_modules/@earendil-works/pi-tui/dist/components/markdown.js
var STRICT_STRIKETHROUGH_REGEX = /^(~~)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/;
var StrictStrikethroughTokenizer = class extends y {
  del(src) {
    const match = STRICT_STRIKETHROUGH_REGEX.exec(src);
    if (!match) {
      return void 0;
    }
    const text = match[2];
    return {
      type: "del",
      raw: match[0],
      text,
      tokens: this.lexer.inlineTokens(text)
    };
  }
};
function isEscaped(source, index) {
  let backslashes = 0;
  for (let position = index - 1; position >= 0 && source[position] === "\\"; position--) {
    backslashes++;
  }
  return backslashes % 2 === 1;
}
function findClosingDelimiter(source, closing, start) {
  let index = source.indexOf(closing, start);
  while (index >= 0 && isEscaped(source, index)) {
    index = source.indexOf(closing, index + closing.length);
  }
  return index;
}
function looksLikePendingDollarMath(source) {
  return /\\[A-Za-z]+|[_^=+*/<>()[\]|±≤≥≠≈∈→⇒∞∫∑√-]/.test(source);
}
function tokenizeInlineLatex(source) {
  let opening = "";
  let closing = "";
  if (source.startsWith("$$")) {
    opening = "$$";
    closing = "$$";
  } else if (source.startsWith("\\(")) {
    opening = "\\(";
    closing = "\\)";
  } else if (source.startsWith("\\[")) {
    opening = "\\[";
    closing = "\\]";
  } else if (source.startsWith("$") && !/^\$\s/.test(source)) {
    opening = "$";
    closing = "$";
  } else {
    return void 0;
  }
  const closingIndex = findClosingDelimiter(source, closing, opening.length);
  if (closingIndex >= 0 && opening === "$" && (/\s$/.test(source.slice(opening.length, closingIndex)) || /^\d/.test(source.slice(closingIndex + 1)) || /^[A-Z_][A-Z0-9_]*(?:[^A-Za-z0-9_\s])?$/.test(source.slice(opening.length, closingIndex)) && /^[A-Za-z_][A-Za-z0-9_]*/.test(source.slice(closingIndex + 1)) || source.slice(opening.length, closingIndex).includes("`"))) {
    return void 0;
  }
  if (closingIndex < 0) {
    const pendingSource = source.slice(opening.length);
    if (opening.startsWith("\\") || looksLikePendingDollarMath(pendingSource)) {
      return { type: "latex", raw: source, text: pendingSource, pending: true };
    }
    return void 0;
  }
  const text = source.slice(opening.length, closingIndex);
  if (!text || text.includes("\n")) {
    return void 0;
  }
  const raw = source.slice(0, closingIndex + closing.length);
  return { type: "latex", raw, text };
}
function tokenizeBlockLatex(source) {
  const dollarMatch = /^ {0,3}\$\$[ \t]*(?:\n)?([\s\S]*?)\$\$[ \t]*(?:\n|$)/.exec(source);
  if (dollarMatch?.[1]) {
    return { type: "latexBlock", raw: dollarMatch[0], text: dollarMatch[1].trim() };
  }
  const bracketMatch = /^ {0,3}\\\[[ \t]*(?:\n)?([\s\S]*?)\\\][ \t]*(?:\n|$)/.exec(source);
  if (bracketMatch?.[1]) {
    return { type: "latexBlock", raw: bracketMatch[0], text: bracketMatch[1].trim() };
  }
  const pendingBracket = /^ {0,3}\\\[[ \t]*(?:\n)?([\s\S]*)$/.exec(source);
  if (pendingBracket) {
    return { type: "latexBlock", raw: pendingBracket[0], text: pendingBracket[1], pending: true };
  }
  const pendingDollar = /^ {0,3}\$\$[ \t]*(?:\n)?([\s\S]*)$/.exec(source);
  if (pendingDollar?.[1] && looksLikePendingDollarMath(pendingDollar[1])) {
    return { type: "latexBlock", raw: pendingDollar[0], text: pendingDollar[1], pending: true };
  }
  return void 0;
}
var LATEX_MARKDOWN_EXTENSIONS = [
  {
    name: "latexBlock",
    level: "block",
    start(source) {
      const match = /(?:^|\n) {0,3}(?:\$\$|\\\[)/.exec(source);
      return match ? match.index + (match[0].startsWith("\n") ? 1 : 0) : void 0;
    },
    tokenizer: tokenizeBlockLatex
  },
  {
    name: "latex",
    level: "inline",
    start(source) {
      const indices = [source.indexOf("$"), source.indexOf("\\("), source.indexOf("\\[")].filter((index) => index >= 0);
      return indices.length > 0 ? Math.min(...indices) : void 0;
    },
    tokenizer: tokenizeInlineLatex
  }
];
function trimPartialClosingFences(tokens) {
  const token = tokens[tokens.length - 1];
  if (token?.type === "list") {
    trimPartialClosingFences(token.items[token.items.length - 1]?.tokens ?? []);
    return;
  }
  if (token?.type === "blockquote") {
    trimPartialClosingFences(token.tokens ?? []);
    return;
  }
  if (token?.type !== "code") {
    return;
  }
  const marker = /^(`{3,}|~{3,})/.exec(token.raw)?.[1];
  const lastLine = token.raw.split("\n").pop();
  if (!marker || !lastLine || lastLine.length >= marker.length || lastLine !== marker[0]?.repeat(lastLine.length)) {
    return;
  }
  token.text = token.text.slice(0, -lastLine.length).replace(/\n$/, "");
}
var markdownParser = new Z();
markdownParser.setOptions({
  tokenizer: new StrictStrikethroughTokenizer()
});
markdownParser.use({ extensions: [...LATEX_MARKDOWN_EXTENSIONS] });
var Markdown = class {
  text;
  paddingX;
  // Left/right padding
  paddingY;
  // Top/bottom padding
  defaultTextStyle;
  theme;
  options;
  defaultStylePrefix;
  // Cache for rendered output
  cachedText;
  cachedWidth;
  cachedLines;
  constructor(text, paddingX, paddingY, theme, defaultTextStyle, options) {
    this.text = text;
    this.paddingX = paddingX;
    this.paddingY = paddingY;
    this.theme = theme;
    this.defaultTextStyle = defaultTextStyle;
    this.options = options ? { ...options } : {};
  }
  setText(text) {
    this.text = text;
    this.invalidate();
  }
  invalidate() {
    this.cachedText = void 0;
    this.cachedWidth = void 0;
    this.cachedLines = void 0;
  }
  render(width) {
    if (this.cachedLines && this.cachedText === this.text && this.cachedWidth === width) {
      return this.cachedLines;
    }
    const contentWidth = Math.max(1, width - this.paddingX * 2);
    const text = this.options.transform?.(this.text, contentWidth) ?? this.text;
    if (!text || text.trim() === "") {
      const result2 = [];
      this.cachedText = this.text;
      this.cachedWidth = width;
      this.cachedLines = result2;
      return result2;
    }
    const normalizedText = text.replace(/\t/g, "   ");
    const tokens = markdownParser.lexer(normalizedText);
    trimPartialClosingFences(tokens);
    const renderedLines = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const nextToken = tokens[i + 1];
      const tokenLines = this.renderToken(token, contentWidth, nextToken?.type);
      for (const tokenLine of tokenLines) {
        renderedLines.push(tokenLine);
      }
    }
    const wrappedLines = [];
    for (const line of renderedLines) {
      if (isImageLine(line)) {
        wrappedLines.push(line);
      } else {
        for (const wrappedLine of wrapTextWithAnsi(line, contentWidth)) {
          wrappedLines.push(wrappedLine);
        }
      }
    }
    const leftMargin = " ".repeat(this.paddingX);
    const rightMargin = " ".repeat(this.paddingX);
    const bgFn = this.defaultTextStyle?.bgColor;
    const contentLines = [];
    for (const line of wrappedLines) {
      if (isImageLine(line)) {
        contentLines.push(line);
        continue;
      }
      const lineWithMargins = leftMargin + line + rightMargin;
      if (bgFn) {
        contentLines.push(applyBackgroundToLine(lineWithMargins, width, bgFn));
      } else {
        const visibleLen = visibleWidth(lineWithMargins);
        const paddingNeeded = Math.max(0, width - visibleLen);
        contentLines.push(lineWithMargins + " ".repeat(paddingNeeded));
      }
    }
    const emptyLine = " ".repeat(width);
    const emptyLines = [];
    for (let i = 0; i < this.paddingY; i++) {
      const line = bgFn ? applyBackgroundToLine(emptyLine, width, bgFn) : emptyLine;
      emptyLines.push(line);
    }
    const result = emptyLines.concat(contentLines, emptyLines);
    this.cachedText = this.text;
    this.cachedWidth = width;
    this.cachedLines = result;
    return result.length > 0 ? result : [""];
  }
  /**
   * Apply default text style to a string.
   * This is the base styling applied to all text content.
   * NOTE: Background color is NOT applied here - it's applied at the padding stage
   * to ensure it extends to the full line width.
   */
  applyDefaultStyle(text) {
    if (!this.defaultTextStyle) {
      return text;
    }
    let styled = text;
    if (this.defaultTextStyle.color) {
      styled = this.defaultTextStyle.color(styled);
    }
    if (this.defaultTextStyle.bold) {
      styled = this.theme.bold(styled);
    }
    if (this.defaultTextStyle.italic) {
      styled = this.theme.italic(styled);
    }
    if (this.defaultTextStyle.strikethrough) {
      styled = this.theme.strikethrough(styled);
    }
    if (this.defaultTextStyle.underline) {
      styled = this.theme.underline(styled);
    }
    return styled;
  }
  getDefaultStylePrefix() {
    if (!this.defaultTextStyle) {
      return "";
    }
    if (this.defaultStylePrefix !== void 0) {
      return this.defaultStylePrefix;
    }
    const sentinel = "\0";
    let styled = sentinel;
    if (this.defaultTextStyle.color) {
      styled = this.defaultTextStyle.color(styled);
    }
    if (this.defaultTextStyle.bold) {
      styled = this.theme.bold(styled);
    }
    if (this.defaultTextStyle.italic) {
      styled = this.theme.italic(styled);
    }
    if (this.defaultTextStyle.strikethrough) {
      styled = this.theme.strikethrough(styled);
    }
    if (this.defaultTextStyle.underline) {
      styled = this.theme.underline(styled);
    }
    const sentinelIndex = styled.indexOf(sentinel);
    this.defaultStylePrefix = sentinelIndex >= 0 ? styled.slice(0, sentinelIndex) : "";
    return this.defaultStylePrefix;
  }
  getStylePrefix(styleFn) {
    const sentinel = "\0";
    const styled = styleFn(sentinel);
    const sentinelIndex = styled.indexOf(sentinel);
    return sentinelIndex >= 0 ? styled.slice(0, sentinelIndex) : "";
  }
  getDefaultInlineStyleContext() {
    return {
      applyText: (text) => this.applyDefaultStyle(text),
      stylePrefix: this.getDefaultStylePrefix()
    };
  }
  renderToken(token, width, nextTokenType, styleContext) {
    const lines = [];
    switch (token.type) {
      case "heading": {
        const headingLevel = token.depth;
        const headingPrefix = `${"#".repeat(headingLevel)} `;
        let headingStyleFn;
        if (headingLevel === 1) {
          headingStyleFn = (text) => this.theme.heading(this.theme.bold(this.theme.underline(text)));
        } else {
          headingStyleFn = (text) => this.theme.heading(this.theme.bold(text));
        }
        const headingStyleContext = {
          applyText: headingStyleFn,
          stylePrefix: this.getStylePrefix(headingStyleFn)
        };
        const headingText = this.renderInlineTokens(token.tokens || [], headingStyleContext);
        const styledHeading = headingLevel >= 3 ? headingStyleFn(headingPrefix) + headingText : headingText;
        lines.push(styledHeading);
        if (nextTokenType && nextTokenType !== "space") {
          lines.push("");
        }
        break;
      }
      case "paragraph": {
        const paragraphText = this.renderInlineTokens(token.tokens || [], styleContext);
        lines.push(paragraphText);
        if (nextTokenType && nextTokenType !== "list" && nextTokenType !== "space") {
          lines.push("");
        }
        break;
      }
      case "text":
        lines.push(this.renderInlineTokens([token], styleContext));
        break;
      case "latexBlock": {
        const latexToken = token;
        const rendered = !latexToken.pending && this.options.renderLatex !== false ? renderLatex(latexToken.text, { display: true }) ?? latexToken.raw.trim() : latexToken.raw.trim();
        for (const line of rendered.split("\n")) {
          lines.push(this.applyDefaultStyle(line));
        }
        if (nextTokenType && nextTokenType !== "space") {
          lines.push("");
        }
        break;
      }
      case "code": {
        const indent = this.theme.codeBlockIndent ?? "  ";
        lines.push(this.theme.codeBlockBorder(`\`\`\`${token.lang || ""}`));
        if (this.theme.highlightCode) {
          const highlightedLines = this.theme.highlightCode(token.text, token.lang);
          for (const hlLine of highlightedLines) {
            lines.push(`${indent}${hlLine}`);
          }
        } else {
          const codeLines = token.text.split("\n");
          for (const codeLine of codeLines) {
            lines.push(`${indent}${this.theme.codeBlock(codeLine)}`);
          }
        }
        lines.push(this.theme.codeBlockBorder("```"));
        if (nextTokenType && nextTokenType !== "space") {
          lines.push("");
        }
        break;
      }
      case "list": {
        const listLines = this.renderList(token, 0, width, styleContext);
        lines.push(...listLines);
        break;
      }
      case "table": {
        const tableLines = this.renderTable(token, width, nextTokenType, styleContext);
        lines.push(...tableLines);
        break;
      }
      case "blockquote": {
        const quoteStyle = (text) => this.theme.quote(this.theme.italic(text));
        const quoteStylePrefix = this.getStylePrefix(quoteStyle);
        const applyQuoteStyle = (line) => {
          if (!quoteStylePrefix) {
            return quoteStyle(line);
          }
          const lineWithReappliedStyle = line.replace(/\x1b\[0m/g, `\x1B[0m${quoteStylePrefix}`);
          return quoteStyle(lineWithReappliedStyle);
        };
        const quoteContentWidth = Math.max(1, width - 2);
        const quoteInlineStyleContext = {
          applyText: (text) => text,
          stylePrefix: quoteStylePrefix
        };
        const quoteTokens = token.tokens || [];
        const renderedQuoteLines = [];
        for (let i = 0; i < quoteTokens.length; i++) {
          const quoteToken = quoteTokens[i];
          const nextQuoteToken = quoteTokens[i + 1];
          renderedQuoteLines.push(...this.renderToken(quoteToken, quoteContentWidth, nextQuoteToken?.type, quoteInlineStyleContext));
        }
        while (renderedQuoteLines.length > 0 && renderedQuoteLines[renderedQuoteLines.length - 1] === "") {
          renderedQuoteLines.pop();
        }
        for (const quoteLine of renderedQuoteLines) {
          const styledLine = applyQuoteStyle(quoteLine);
          const wrappedLines = wrapTextWithAnsi(styledLine, quoteContentWidth);
          for (const wrappedLine of wrappedLines) {
            lines.push(this.theme.quoteBorder("\u2502 ") + wrappedLine);
          }
        }
        if (nextTokenType && nextTokenType !== "space") {
          lines.push("");
        }
        break;
      }
      case "hr":
        lines.push(this.theme.hr("\u2500".repeat(Math.min(width, 80))));
        if (nextTokenType && nextTokenType !== "space") {
          lines.push("");
        }
        break;
      case "html":
        if ("raw" in token && typeof token.raw === "string") {
          lines.push(this.applyDefaultStyle(token.raw.trim()));
        }
        break;
      case "space":
        lines.push("");
        break;
      default:
        if ("text" in token && typeof token.text === "string") {
          lines.push(token.text);
        }
    }
    return lines;
  }
  renderInlineTokens(tokens, styleContext) {
    let result = "";
    const resolvedStyleContext = styleContext ?? this.getDefaultInlineStyleContext();
    const { applyText, stylePrefix } = resolvedStyleContext;
    const applyTextWithNewlines = (text) => {
      const segments = text.split("\n");
      return segments.map((segment) => applyText(segment)).join("\n");
    };
    for (const token of tokens) {
      switch (token.type) {
        case "latex": {
          const latexToken = token;
          const rendered = !latexToken.pending && this.options.renderLatex !== false ? renderLatex(latexToken.text) ?? latexToken.raw : latexToken.raw;
          result += applyTextWithNewlines(rendered);
          break;
        }
        case "escape":
          result += applyTextWithNewlines(this.options.preserveBackslashEscapes ? token.raw : token.text);
          break;
        case "text":
          if (token.tokens && token.tokens.length > 0) {
            result += this.renderInlineTokens(token.tokens, resolvedStyleContext);
          } else {
            result += applyTextWithNewlines(token.text);
          }
          break;
        case "paragraph":
          result += this.renderInlineTokens(token.tokens || [], resolvedStyleContext);
          break;
        case "strong": {
          const boldContent = this.renderInlineTokens(token.tokens || [], resolvedStyleContext);
          result += this.theme.bold(boldContent) + stylePrefix;
          break;
        }
        case "em": {
          const italicContent = this.renderInlineTokens(token.tokens || [], resolvedStyleContext);
          result += this.theme.italic(italicContent) + stylePrefix;
          break;
        }
        case "codespan":
          result += this.theme.code(token.text) + stylePrefix;
          break;
        case "link": {
          const linkText = this.renderInlineTokens(token.tokens || [], resolvedStyleContext);
          const styledLink = this.theme.link(this.theme.underline(linkText));
          if (getCapabilities().hyperlinks) {
            result += hyperlink(styledLink, token.href) + stylePrefix;
          } else {
            const hrefForComparison = token.href.startsWith("mailto:") ? token.href.slice(7) : token.href;
            if (token.text === token.href || token.text === hrefForComparison) {
              result += styledLink + stylePrefix;
            } else {
              result += styledLink + this.theme.linkUrl(` (${token.href})`) + stylePrefix;
            }
          }
          break;
        }
        case "br":
          result += "\n";
          break;
        case "del": {
          const delContent = this.renderInlineTokens(token.tokens || [], resolvedStyleContext);
          result += this.theme.strikethrough(delContent) + stylePrefix;
          break;
        }
        case "html":
          if ("raw" in token && typeof token.raw === "string") {
            result += applyTextWithNewlines(token.raw);
          }
          break;
        default:
          if ("text" in token && typeof token.text === "string") {
            result += applyTextWithNewlines(token.text);
          }
      }
    }
    while (stylePrefix && result.endsWith(stylePrefix)) {
      result = result.slice(0, -stylePrefix.length);
    }
    return result;
  }
  getOrderedListMarker(item) {
    const match = /^(?: {0,3})(\d{1,9}[.)])[ \t]+/.exec(item.raw);
    return match ? `${match[1]} ` : void 0;
  }
  getUnorderedListMarker(item) {
    const match = /^(?: {0,3})([-+*])(?:[ \t]+|(?=\r?\n|$))/.exec(item.raw);
    return match ? `${match[1]} ` : void 0;
  }
  /**
   * Render a list with proper nesting support
   */
  renderList(token, depth, width, styleContext) {
    const lines = [];
    const indent = "    ".repeat(depth);
    const startNumber = typeof token.start === "number" ? token.start : 1;
    for (let i = 0; i < token.items.length; i++) {
      const item = token.items[i];
      const isLastItem = i === token.items.length - 1;
      const bullet = token.ordered ? this.options.preserveOrderedListMarkers ? this.getOrderedListMarker(item) ?? `${startNumber + i}. ` : `${startNumber + i}. ` : this.options.preserveOrderedListMarkers ? this.getUnorderedListMarker(item) ?? "- " : "- ";
      const taskMarker = item.task ? `[${item.checked ? "x" : " "}] ` : "";
      const marker = bullet + taskMarker;
      const firstPrefix = indent + this.theme.listBullet(marker);
      const continuationPrefix = indent + " ".repeat(visibleWidth(marker));
      const itemWidth = Math.max(1, width - visibleWidth(firstPrefix));
      let renderedAnyLine = false;
      for (const itemToken of item.tokens) {
        if (itemToken.type === "list") {
          lines.push(...this.renderList(itemToken, depth + 1, width, styleContext));
          renderedAnyLine = true;
          continue;
        }
        const itemLines = this.renderToken(itemToken, itemWidth, void 0, styleContext);
        for (const line of itemLines) {
          for (const wrappedLine of wrapTextWithAnsi(line, itemWidth)) {
            const linePrefix = renderedAnyLine ? continuationPrefix : firstPrefix;
            lines.push(linePrefix + wrappedLine);
            renderedAnyLine = true;
          }
        }
      }
      if (!renderedAnyLine) {
        lines.push(firstPrefix);
      }
      if (token.loose && !isLastItem) {
        lines.push("");
      }
    }
    return lines;
  }
  /**
   * Get the visible width of the longest word in a string.
   */
  getLongestWordWidth(text, maxWidth) {
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    let longest = 0;
    for (const word of words) {
      longest = Math.max(longest, visibleWidth(word));
    }
    if (maxWidth === void 0) {
      return longest;
    }
    return Math.min(longest, maxWidth);
  }
  /**
   * Wrap a table cell to fit into a column.
   *
   * Delegates to wrapTextWithAnsi() so ANSI codes + long tokens are handled
   * consistently with the rest of the renderer.
   */
  wrapCellText(text, maxWidth, stylePrefix = "") {
    const lines = wrapTextWithAnsi(text, Math.max(1, maxWidth));
    return lines.map((line, index) => {
      const styleReset = index < lines.length - 1 ? "\x1B[22;23;24;25;27;28;29;39m" : "";
      return `${line}${styleReset}${stylePrefix}`;
    });
  }
  /**
   * Render a table with width-aware cell wrapping.
   * Cells that don't fit are wrapped to multiple lines.
   */
  renderTable(token, availableWidth, nextTokenType, styleContext) {
    const lines = [];
    const numCols = token.header.length;
    if (numCols === 0) {
      return lines;
    }
    const borderOverhead = 3 * numCols + 1;
    const availableForCells = availableWidth - borderOverhead;
    if (availableForCells < numCols) {
      const fallbackLines = token.raw ? wrapTextWithAnsi(token.raw, availableWidth) : [];
      if (nextTokenType && nextTokenType !== "space") {
        fallbackLines.push("");
      }
      return fallbackLines;
    }
    const maxUnbrokenWordWidth = 30;
    const naturalWidths = [];
    const minWordWidths = [];
    for (let i = 0; i < numCols; i++) {
      const headerText = this.renderInlineTokens(token.header[i].tokens || [], styleContext);
      naturalWidths[i] = visibleWidth(headerText);
      minWordWidths[i] = Math.max(1, this.getLongestWordWidth(headerText, maxUnbrokenWordWidth));
    }
    for (const row of token.rows) {
      for (let i = 0; i < row.length; i++) {
        const cellText = this.renderInlineTokens(row[i].tokens || [], styleContext);
        naturalWidths[i] = Math.max(naturalWidths[i] || 0, visibleWidth(cellText));
        minWordWidths[i] = Math.max(minWordWidths[i] || 1, this.getLongestWordWidth(cellText, maxUnbrokenWordWidth));
      }
    }
    let minColumnWidths = minWordWidths;
    let minCellsWidth = minColumnWidths.reduce((a, b2) => a + b2, 0);
    if (minCellsWidth > availableForCells) {
      minColumnWidths = new Array(numCols).fill(1);
      const remaining = availableForCells - numCols;
      if (remaining > 0) {
        const totalWeight = minWordWidths.reduce((total, width) => total + Math.max(0, width - 1), 0);
        const growth = minWordWidths.map((width) => {
          const weight = Math.max(0, width - 1);
          return totalWeight > 0 ? Math.floor(weight / totalWeight * remaining) : 0;
        });
        for (let i = 0; i < numCols; i++) {
          minColumnWidths[i] += growth[i] ?? 0;
        }
        const allocated = growth.reduce((total, width) => total + width, 0);
        let leftover = remaining - allocated;
        for (let i = 0; leftover > 0 && i < numCols; i++) {
          minColumnWidths[i]++;
          leftover--;
        }
      }
      minCellsWidth = minColumnWidths.reduce((a, b2) => a + b2, 0);
    }
    const totalNaturalWidth = naturalWidths.reduce((a, b2) => a + b2, 0) + borderOverhead;
    let columnWidths;
    if (totalNaturalWidth <= availableWidth) {
      columnWidths = naturalWidths.map((width, index) => Math.max(width, minColumnWidths[index]));
    } else {
      const totalGrowPotential = naturalWidths.reduce((total, width, index) => {
        return total + Math.max(0, width - minColumnWidths[index]);
      }, 0);
      const extraWidth = Math.max(0, availableForCells - minCellsWidth);
      columnWidths = minColumnWidths.map((minWidth, index) => {
        const naturalWidth = naturalWidths[index];
        const minWidthDelta = Math.max(0, naturalWidth - minWidth);
        let grow = 0;
        if (totalGrowPotential > 0) {
          grow = Math.floor(minWidthDelta / totalGrowPotential * extraWidth);
        }
        return minWidth + grow;
      });
      const allocated = columnWidths.reduce((a, b2) => a + b2, 0);
      let remaining = availableForCells - allocated;
      while (remaining > 0) {
        let grew = false;
        for (let i = 0; i < numCols && remaining > 0; i++) {
          if (columnWidths[i] < naturalWidths[i]) {
            columnWidths[i]++;
            remaining--;
            grew = true;
          }
        }
        if (!grew) {
          break;
        }
      }
    }
    const topBorderCells = columnWidths.map((w) => "\u2500".repeat(w));
    lines.push(`\u250C\u2500${topBorderCells.join("\u2500\u252C\u2500")}\u2500\u2510`);
    const headerCellLines = token.header.map((cell, i) => {
      const text = this.renderInlineTokens(cell.tokens || [], styleContext);
      return this.wrapCellText(text, columnWidths[i], styleContext?.stylePrefix);
    });
    const headerLineCount = Math.max(...headerCellLines.map((c) => c.length));
    for (let lineIdx = 0; lineIdx < headerLineCount; lineIdx++) {
      const rowParts = headerCellLines.map((cellLines, colIdx) => {
        const text = cellLines[lineIdx] || "";
        const padded = text + " ".repeat(Math.max(0, columnWidths[colIdx] - visibleWidth(text)));
        return this.theme.bold(padded);
      });
      lines.push(`\u2502 ${rowParts.join(" \u2502 ")} \u2502`);
    }
    const separatorCells = columnWidths.map((w) => "\u2500".repeat(w));
    const separatorLine = `\u251C\u2500${separatorCells.join("\u2500\u253C\u2500")}\u2500\u2524`;
    lines.push(separatorLine);
    for (let rowIndex = 0; rowIndex < token.rows.length; rowIndex++) {
      const row = token.rows[rowIndex];
      const rowCellLines = row.map((cell, i) => {
        const text = this.renderInlineTokens(cell.tokens || [], styleContext);
        return this.wrapCellText(text, columnWidths[i], styleContext?.stylePrefix);
      });
      const rowLineCount = Math.max(...rowCellLines.map((c) => c.length));
      for (let lineIdx = 0; lineIdx < rowLineCount; lineIdx++) {
        const rowParts = rowCellLines.map((cellLines, colIdx) => {
          const text = cellLines[lineIdx] || "";
          return text + " ".repeat(Math.max(0, columnWidths[colIdx] - visibleWidth(text)));
        });
        lines.push(`\u2502 ${rowParts.join(" \u2502 ")} \u2502`);
      }
      if (rowIndex < token.rows.length - 1) {
        lines.push(separatorLine);
      }
    }
    const bottomBorderCells = columnWidths.map((w) => "\u2500".repeat(w));
    lines.push(`\u2514\u2500${bottomBorderCells.join("\u2500\u2534\u2500")}\u2500\u2518`);
    if (nextTokenType && nextTokenType !== "space") {
      lines.push("");
    }
    return lines;
  }
};

// node_modules/@earendil-works/pi-tui/dist/components/scroll-view.js
var ScrollView = class extends Container {
  child;
  followEnd;
  primary;
  overscroll;
  scrollbarTrackStyle;
  scrollbarThumbStyle;
  currentScrollbar;
  scrollbarHideDelayMs;
  currentScrollTop = 0;
  contentHeight = 0;
  currentViewportHeight = 0;
  followingEnd;
  followSuppressedAtEnd = false;
  requestRenderCallback;
  transientScrollbarVisible = false;
  scrollbarActive = false;
  scrollbarHideTimer;
  constructor(component, options = {}) {
    super();
    if (options.axis !== void 0 && options.axis !== "vertical") {
      throw new Error(`Unsupported ScrollView axis: ${options.axis}`);
    }
    this.child = component;
    this.children.push(component);
    this.followEnd = (options.follow ?? "none") === "end";
    this.followingEnd = this.followEnd;
    this.primary = options.primary ?? false;
    this.overscroll = options.overscroll ?? "chain";
    this.currentScrollbar = options.scrollbar ?? "hidden";
    this.scrollbarTrackStyle = options.scrollbarTrackStyle ?? ((text) => `\x1B[90m${text}\x1B[39m`);
    this.scrollbarThumbStyle = options.scrollbarThumbStyle ?? ((text) => `\x1B[37m${text}\x1B[39m`);
    this.scrollbarHideDelayMs = Math.max(0, Math.floor(options.scrollbarHideDelayMs ?? 1e3));
  }
  get scrollTop() {
    return this.currentScrollTop;
  }
  get isFollowingEnd() {
    return this.followingEnd;
  }
  get viewportHeight() {
    return this.currentViewportHeight;
  }
  get scrollbar() {
    return this.currentScrollbar;
  }
  get isScrollbarVisible() {
    if (this.scrollbar === "always")
      return this.currentViewportHeight > 0;
    return this.scrollbar === "auto" && this.contentHeight > this.currentViewportHeight && this.transientScrollbarVisible;
  }
  get isScrollbarActive() {
    return this.scrollbarActive;
  }
  setScrollbar(scrollbar) {
    if (scrollbar === this.currentScrollbar)
      return;
    this.currentScrollbar = scrollbar;
    if (scrollbar !== "auto")
      this.hideTransientScrollbar();
    else if (this.scrollbarActive)
      this.markScrollbarActivity();
    this.requestRenderCallback?.();
  }
  getContentWidth(width) {
    return this.scrollbar === "always" && width > 1 ? width - 1 : width;
  }
  markScrollbarActivity() {
    if (this.scrollbar !== "auto" || this.contentHeight <= this.currentViewportHeight)
      return;
    this.transientScrollbarVisible = true;
    if (this.scrollbarHideTimer) {
      clearTimeout(this.scrollbarHideTimer);
      this.scrollbarHideTimer = void 0;
    }
    if (this.scrollbarActive)
      return;
    this.scrollbarHideTimer = setTimeout(() => {
      this.scrollbarHideTimer = void 0;
      this.transientScrollbarVisible = false;
      this.requestRenderCallback?.();
    }, this.scrollbarHideDelayMs);
    this.scrollbarHideTimer.unref();
  }
  hideTransientScrollbar() {
    this.transientScrollbarVisible = false;
    if (!this.scrollbarHideTimer)
      return;
    clearTimeout(this.scrollbarHideTimer);
    this.scrollbarHideTimer = void 0;
  }
  setScrollbarActive(active) {
    if (active === this.scrollbarActive)
      return;
    this.scrollbarActive = active;
    this.markScrollbarActivity();
    this.requestRenderCallback?.();
  }
  scrollTo(scrollTop, options = {}) {
    const requested = Number.isFinite(scrollTop) ? Math.trunc(scrollTop) : this.currentScrollTop;
    const maxScrollTop = Math.max(0, this.contentHeight - this.currentViewportHeight);
    const next = Math.max(0, Math.min(maxScrollTop, requested));
    const nextFollowSuppressedAtEnd = options.disableFollow === true && next === maxScrollTop;
    const nextFollowingEnd = !nextFollowSuppressedAtEnd && this.followEnd && next === maxScrollTop;
    if (next === this.currentScrollTop && nextFollowingEnd === this.followingEnd && nextFollowSuppressedAtEnd === this.followSuppressedAtEnd) {
      return;
    }
    const moved = next !== this.currentScrollTop;
    this.currentScrollTop = next;
    this.followingEnd = nextFollowingEnd;
    this.followSuppressedAtEnd = nextFollowSuppressedAtEnd;
    if (moved)
      this.markScrollbarActivity();
    this.requestRenderCallback?.();
  }
  scrollBy(lines) {
    const requested = Number.isFinite(lines) ? Math.trunc(lines) : 0;
    if (requested === 0)
      return 0;
    const maxScrollTop = Math.max(0, this.contentHeight - this.currentViewportHeight);
    const start = this.followingEnd ? maxScrollTop : this.currentScrollTop;
    const next = Math.max(0, Math.min(maxScrollTop, start + requested));
    const moved = next - start;
    const wasFollowingEnd = this.followingEnd;
    this.currentScrollTop = next;
    this.followingEnd = this.followEnd && next === maxScrollTop;
    this.followSuppressedAtEnd = false;
    if (moved !== 0)
      this.markScrollbarActivity();
    if (moved !== 0 || this.followingEnd !== wasFollowingEnd)
      this.requestRenderCallback?.();
    return requested - moved;
  }
  scrollToStart() {
    const changed = this.currentScrollTop !== 0 || this.followingEnd !== (this.followEnd && this.contentHeight <= this.currentViewportHeight);
    this.currentScrollTop = 0;
    this.followingEnd = this.followEnd && this.contentHeight <= this.currentViewportHeight;
    this.followSuppressedAtEnd = false;
    if (changed) {
      this.markScrollbarActivity();
      this.requestRenderCallback?.();
    }
  }
  scrollToEnd() {
    const next = Math.max(0, this.contentHeight - this.currentViewportHeight);
    const changed = this.currentScrollTop !== next || this.followingEnd !== this.followEnd;
    this.currentScrollTop = next;
    this.followingEnd = this.followEnd;
    this.followSuppressedAtEnd = false;
    if (changed) {
      this.markScrollbarActivity();
      this.requestRenderCallback?.();
    }
  }
  updateLayout(contentHeight, viewportHeight, requestRender) {
    this.contentHeight = Math.max(0, Math.floor(contentHeight));
    this.currentViewportHeight = Math.max(0, Math.floor(viewportHeight));
    this.requestRenderCallback = requestRender;
    const maxScrollTop = Math.max(0, this.contentHeight - this.currentViewportHeight);
    if (this.followingEnd)
      this.currentScrollTop = maxScrollTop;
    else
      this.currentScrollTop = Math.max(0, Math.min(this.currentScrollTop, maxScrollTop));
    if (this.currentScrollTop < maxScrollTop)
      this.followSuppressedAtEnd = false;
    if (this.followEnd && this.currentScrollTop === maxScrollTop && !this.followSuppressedAtEnd) {
      this.followingEnd = true;
    }
    if (this.contentHeight <= this.currentViewportHeight)
      this.hideTransientScrollbar();
  }
  addChild(_component) {
    throw new Error("ScrollView has exactly one child");
  }
  removeChild(_component) {
    throw new Error("ScrollView child cannot be removed");
  }
  clear() {
    throw new Error("ScrollView child cannot be cleared");
  }
  render(width) {
    const contentWidth = this.getContentWidth(width);
    const lines = this.child.render(contentWidth);
    return contentWidth === width ? lines : lines.map((line) => `${line} `);
  }
  [LAYOUT_NODE]() {
    return { type: "scroll", component: this.child, state: this };
  }
};

// node_modules/@earendil-works/pi-tui/dist/native-platform.js
import { createRequire as createRequire2 } from "node:module";

// node_modules/@earendil-works/pi-tui/dist/native-module-path.js
import { createRequire } from "node:module";
var moduleRequire = createRequire(import.meta.url);

// node_modules/@earendil-works/pi-tui/dist/native-platform.js
var cjsRequire = createRequire2(import.meta.url);

// node_modules/@earendil-works/pi-tui/dist/terminal.js
var DESIRED_KITTY_KEYBOARD_PROTOCOL_FLAGS = 7;
var KITTY_KEYBOARD_PROTOCOL_QUERY = `\x1B[>${DESIRED_KITTY_KEYBOARD_PROTOCOL_FLAGS}u\x1B[?u\x1B[c`;

// node_modules/@earendil-works/pi-tui/dist/alt-screen-search.js
var segmenter2 = getGraphemeSegmenter();
var PRINTABLE_ASCII = /^[\x20-\x7e]*$/;
function buildSearchCorpus(lines) {
  const chunks = [];
  const spans = [];
  let textLength = 0;
  let pendingSeparator = false;
  const appendSeparator = () => {
    if (!pendingSeparator)
      return;
    chunks.push(" ");
    textLength += 1;
    pendingSeparator = false;
  };
  for (let row = 0; row < lines.length; row++) {
    const line = stripTerminalSequences(lines[row] ?? "");
    let column = 0;
    if (PRINTABLE_ASCII.test(line)) {
      let index = 0;
      while (index < line.length) {
        if (line.charCodeAt(index) === 32) {
          if (textLength > 0)
            pendingSeparator = true;
          column += 1;
          index += 1;
          continue;
        }
        let end = index + 1;
        while (end < line.length && line.charCodeAt(end) !== 32)
          end += 1;
        appendSeparator();
        const text = line.slice(index, end);
        chunks.push(text);
        spans.push({
          textStart: textLength,
          textEnd: textLength + text.length,
          row,
          startCol: column,
          endCol: column + text.length,
          linearColumns: true
        });
        textLength += text.length;
        column += text.length;
        index = end;
      }
    } else {
      for (const grapheme of segmenter2.segment(line)) {
        const text = grapheme.segment;
        const width = visibleWidth(text);
        if (/^\s+$/u.test(text)) {
          if (textLength > 0)
            pendingSeparator = true;
          column += width;
          continue;
        }
        appendSeparator();
        chunks.push(text);
        spans.push({
          textStart: textLength,
          textEnd: textLength + text.length,
          row,
          startCol: column,
          endCol: column + width,
          linearColumns: false
        });
        textLength += text.length;
        column += width;
      }
    }
    if (textLength > 0)
      pendingSeparator = true;
  }
  return { text: chunks.join(""), spans };
}
function normalizeQuery(query) {
  return query.replace(/\s+/gu, " ").trim();
}
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function findSearchCorpusMatches(corpus, normalizedQuery) {
  if (!normalizedQuery)
    return [];
  const expression = new RegExp(escapeRegExp(normalizedQuery), "giu");
  const matches = [];
  let spanIndex = 0;
  for (const match of corpus.text.matchAll(expression)) {
    const start = match.index;
    const end = start + match[0].length;
    while (spanIndex < corpus.spans.length && corpus.spans[spanIndex].textEnd <= start)
      spanIndex += 1;
    const segments = [];
    for (let index = spanIndex; index < corpus.spans.length; index++) {
      const span = corpus.spans[index];
      if (span.textStart >= end)
        break;
      if (span.textEnd <= start)
        continue;
      const startCol = span.linearColumns ? span.startCol + Math.max(start, span.textStart) - span.textStart : span.startCol;
      const endCol = span.linearColumns ? span.startCol + Math.min(end, span.textEnd) - span.textStart : span.endCol;
      const previous = segments[segments.length - 1];
      if (previous && previous.row === span.row && startCol <= previous.endCol) {
        previous.endCol = Math.max(previous.endCol, endCol);
      } else {
        segments.push({ row: span.row, startCol, endCol });
      }
    }
    while (spanIndex < corpus.spans.length && corpus.spans[spanIndex].textEnd <= end)
      spanIndex += 1;
    if (segments.length > 0)
      matches.push({ segments });
  }
  return matches;
}
var AltScreenSearchIndex = class {
  sourceLines;
  corpus;
  normalizedQuery;
  matches = [];
  search(lines, query) {
    let sourceChanged = this.sourceLines?.length !== lines.length;
    if (!sourceChanged && this.sourceLines) {
      for (let index = 0; index < lines.length; index++) {
        if (this.sourceLines[index] === lines[index])
          continue;
        sourceChanged = true;
        break;
      }
    }
    if (sourceChanged || !this.corpus) {
      this.sourceLines = Array.from(lines);
      this.corpus = buildSearchCorpus(lines);
    }
    const normalizedQuery = normalizeQuery(query);
    const changed = sourceChanged || normalizedQuery !== this.normalizedQuery;
    if (changed) {
      this.normalizedQuery = normalizedQuery;
      this.matches = findSearchCorpusMatches(this.corpus, normalizedQuery);
    }
    return { matches: this.matches, changed };
  }
};
function getAltScreenSearchMatchKey(match) {
  const first = match.segments[0];
  const last = match.segments[match.segments.length - 1];
  return first && last ? `${first.row}:${first.startCol}:${last.row}:${last.endCol}` : "";
}
var AltScreenSearchComponent = class {
  input = new Input({
    prompt: " ",
    placeholder: "Find in transcript",
    placeholderStyle: (text) => `\x1B[2m${text}\x1B[22m`
  });
  onQueryChange;
  navigationButtonStyle;
  resultCount = 0;
  resultIndex = -1;
  previousButtonStart = -1;
  previousButtonEnd = -1;
  nextButtonStart = -1;
  nextButtonEnd = -1;
  hoveredNavigationDirection;
  _focused = false;
  constructor(onQueryChange, navigationButtonStyle = (text) => text) {
    this.onQueryChange = onQueryChange;
    this.navigationButtonStyle = navigationButtonStyle;
  }
  get focused() {
    return this._focused;
  }
  set focused(value) {
    this._focused = value;
    this.input.focused = value;
  }
  setResult(index, count) {
    this.resultIndex = index;
    this.resultCount = count;
  }
  getNavigationDirectionAt(row, column) {
    if (row !== 2)
      return void 0;
    if (column >= this.previousButtonStart && column < this.previousButtonEnd)
      return -1;
    if (column >= this.nextButtonStart && column < this.nextButtonEnd)
      return 1;
    return void 0;
  }
  setHoveredNavigationDirection(direction) {
    if (direction === this.hoveredNavigationDirection)
      return false;
    this.hoveredNavigationDirection = direction;
    return true;
  }
  handleInput(data) {
    const previous = this.input.getValue();
    this.input.handleInput(data);
    const query = this.input.getValue();
    if (query !== previous)
      this.onQueryChange(query);
  }
  invalidate() {
    this.input.invalidate();
  }
  render(width) {
    const safeWidth = Math.max(1, width);
    const innerWidth = Math.max(0, safeWidth - 2);
    const formatKey = (key) => key ? key.split("+").map((part) => {
      if (process.platform === "darwin" && part.toLowerCase() === "alt")
        return "Option";
      return part.charAt(0).toUpperCase() + part.slice(1);
    }).join("+") : "Unbound";
    const keybindings = getKeybindings();
    const previousKey = formatKey(keybindings.getKeys("tui.altScreen.searchPrevious")[0]);
    const nextKey = formatKey(keybindings.getKeys("tui.altScreen.searchNext")[0]);
    const query = this.input.getValue();
    const result = !query ? "" : this.resultCount === 0 ? "No matches" : `${this.resultIndex + 1}/${this.resultCount}`;
    const resultSpace = Math.max(0, innerWidth - 3);
    const visibleResult = truncateToWidth(result, resultSpace, "");
    const resultText = visibleResult ? `\x1B[2m ${visibleResult} \x1B[22m` : "";
    const inputWidth = Math.max(0, innerWidth - visibleWidth(resultText));
    const inputLine = truncateToWidth(this.input.render(Math.max(1, inputWidth))[0] ?? "", inputWidth, "");
    const inputPadding = " ".repeat(Math.max(0, inputWidth - visibleWidth(inputLine)));
    const content = `${inputLine}${inputPadding}${resultText}`;
    let previousButton = `\u2191 ${previousKey}`;
    let nextButton = `\u2193 ${nextKey}`;
    let separator = " \xB7 ";
    const outerGapWidth = 1;
    const availableControlsWidth = Math.max(0, innerWidth - outerGapWidth * 2 - 1);
    let controlsWidth = visibleWidth(previousButton) + visibleWidth(separator) + visibleWidth(nextButton);
    if (controlsWidth > availableControlsWidth) {
      previousButton = "\u2191";
      nextButton = "\u2193";
      separator = " ";
      controlsWidth = visibleWidth(previousButton) + visibleWidth(separator) + visibleWidth(nextButton);
    }
    const showButtons = controlsWidth <= availableControlsWidth;
    const renderedButtons = showButtons ? this.navigationButtonStyle(previousButton, this.hoveredNavigationDirection === -1) + separator + this.navigationButtonStyle(nextButton, this.hoveredNavigationDirection === 1) : "";
    const outerGapsWidth = showButtons ? outerGapWidth * 2 : 0;
    const rightRuleWidth = renderedButtons && innerWidth > controlsWidth + outerGapsWidth ? 1 : 0;
    const leftRuleWidth = Math.max(0, innerWidth - (showButtons ? controlsWidth : 0) - outerGapsWidth - rightRuleWidth);
    const previousStart = 1 + leftRuleWidth + outerGapWidth;
    this.previousButtonStart = showButtons ? previousStart : -1;
    this.previousButtonEnd = showButtons ? previousStart + visibleWidth(previousButton) : -1;
    this.nextButtonStart = showButtons ? this.previousButtonEnd + visibleWidth(separator) : -1;
    this.nextButtonEnd = showButtons ? this.nextButtonStart + visibleWidth(nextButton) : -1;
    if (safeWidth === 1)
      return ["\u250C", "\u2502", "\u2514"];
    return [
      `\u250C${"\u2500".repeat(innerWidth)}\u2510`,
      `\u2502${content}\u2502`,
      `\u2514${"\u2500".repeat(leftRuleWidth)}${renderedButtons ? " " : ""}${renderedButtons}${renderedButtons ? " " : ""}${"\u2500".repeat(rightRuleWidth)}\u2518`
    ];
  }
};

// node_modules/@earendil-works/pi-tui/dist/components/alt-screen-flash.js
var DEFAULT_DURATION_MS = 1e3;
var AltScreenFlashContainer = class {
  entries = [];
  nextId = 0;
  requestRender;
  constructor(requestRender) {
    this.requestRender = requestRender;
  }
  flash(message, durationMs = DEFAULT_DURATION_MS) {
    const id = this.nextId++;
    const timer = setTimeout(() => {
      const index = this.entries.findIndex((entry) => entry.id === id);
      if (index === -1)
        return;
      this.entries.splice(index, 1);
      this.requestRender();
    }, Math.max(0, durationMs));
    timer.unref();
    this.entries.push({ id, message, timer });
    this.requestRender();
  }
  dispose() {
    for (const entry of this.entries)
      clearTimeout(entry.timer);
    this.entries.length = 0;
  }
  invalidate() {
  }
  render(width) {
    return this.entries.map((entry) => {
      const message = truncateToWidth(` ${entry.message} `, width, "");
      return `\x1B[7m${message}\x1B[27m`;
    });
  }
};

// node_modules/@earendil-works/pi-tui/dist/layout.js
var OSC133_ZONE_PREFIX = /^(?:\x1b\]133;[ABC](?:\x07|\x1b\\))+/;
function intersect(a, b2) {
  const x2 = Math.max(a.x, b2.x);
  const y2 = Math.max(a.y, b2.y);
  const right = Math.min(a.x + a.width, b2.x + b2.width);
  const bottom = Math.min(a.y + a.height, b2.y + b2.height);
  return { x: x2, y: y2, width: Math.max(0, right - x2), height: Math.max(0, bottom - y2) };
}
function renderCached(context, component, width) {
  const safeWidth = Math.max(1, Math.floor(width));
  let widths = context.renderCache.get(component);
  if (!widths) {
    widths = /* @__PURE__ */ new Map();
    context.renderCache.set(component, widths);
  }
  let lines = widths.get(safeWidth);
  if (!lines) {
    lines = component.render(safeWidth);
    widths.set(safeWidth, lines);
  }
  return lines;
}
function measureHeight(context, component, width) {
  return renderCached(context, component, width).length;
}
function measureWidth(context, component, width) {
  return renderCached(context, component, width).reduce((max, line) => Math.max(max, visibleWidth(line)), 0);
}
function withParent(box, parent) {
  box.parent = parent;
  return box;
}
function translateBox(box, deltaY) {
  box.rect.y += deltaY;
  for (const child of box.children)
    translateBox(child, deltaY);
}
function updateClips(box, parentClip) {
  box.clip = intersect(parentClip, box.rect);
  for (const child of box.children)
    updateClips(child, box.clip);
}
function layoutComponent(context, component, x2, y2, width, height, clip) {
  const safeWidth = Math.max(1, Math.floor(width));
  const node = getLayoutNode(component);
  if (!node) {
    const lines = renderCached(context, component, safeWidth);
    const allocatedHeight2 = height === void 0 ? lines.length : Math.max(0, Math.floor(height));
    let lineOffset = 0;
    if (lines.length > allocatedHeight2 && allocatedHeight2 > 0) {
      const cursorLine = lines.findIndex((line) => line.includes(CURSOR_MARKER));
      if (cursorLine >= allocatedHeight2)
        lineOffset = cursorLine - allocatedHeight2 + 1;
    }
    return {
      component,
      rect: { x: x2, y: y2, width: safeWidth, height: allocatedHeight2 },
      clip: intersect(clip, { x: x2, y: y2, width: safeWidth, height: allocatedHeight2 }),
      children: [],
      lines,
      lineOffset,
      layer: 0
    };
  }
  if (node.type === "scroll") {
    const previousScrollTop = node.state.scrollTop;
    const contentWidth = node.state.getContentWidth(safeWidth);
    const childBox = layoutComponent(context, node.component, x2, y2 - previousScrollTop, contentWidth, void 0, clip);
    const contentHeight = childBox.rect.height;
    const viewportHeight = height === void 0 ? contentHeight : Math.max(0, Math.floor(height));
    node.state.updateLayout(contentHeight, viewportHeight, context.requestRender);
    translateBox(childBox, previousScrollTop - node.state.scrollTop);
    const scrollView = node.state;
    if (node.state.primary || !context.primaryScrollView)
      context.primaryScrollView = scrollView;
    const rect2 = { x: x2, y: y2, width: safeWidth, height: viewportHeight };
    const childClip = intersect(clip, rect2);
    const box2 = {
      component,
      rect: rect2,
      clip: childClip,
      children: [childBox],
      scrollView,
      scrollContentLines: renderCached(context, node.component, contentWidth),
      layer: 0
    };
    childBox.parent = box2;
    updateClips(childBox, childClip);
    return box2;
  }
  const entries = visibleStackEntries(node.entries, context.viewport);
  const gapTotal = Math.max(0, entries.length - 1) * node.gap;
  if (node.type === "vstack") {
    const intrinsicHeights2 = entries.map((entry) => typeof entry.basis === "number" ? entry.basis : measureHeight(context, entry.component, safeWidth));
    const sizes = allocateStackSizes(entries, intrinsicHeights2, height, node.gap);
    const naturalHeight = sizes.reduce((sum, size) => sum + size, 0) + gapTotal;
    const allocatedHeight2 = height === void 0 ? naturalHeight : Math.max(0, Math.floor(height));
    const rect2 = { x: x2, y: y2, width: safeWidth, height: allocatedHeight2 };
    const box2 = {
      component,
      rect: rect2,
      clip: intersect(clip, rect2),
      children: [],
      layer: 0
    };
    let childY = y2;
    for (let index = 0; index < entries.length; index++) {
      box2.children.push(withParent(layoutComponent(context, entries[index].component, x2, childY, safeWidth, sizes[index], box2.clip), box2));
      childY += sizes[index] + node.gap;
    }
    return box2;
  }
  const intrinsicWidths = entries.map((entry) => typeof entry.basis === "number" ? entry.basis : measureWidth(context, entry.component, safeWidth));
  const widths = allocateStackSizes(entries, intrinsicWidths, safeWidth, node.gap);
  const intrinsicHeights = entries.map((entry, index) => measureHeight(context, entry.component, Math.max(1, widths[index])));
  const allocatedHeight = height === void 0 ? intrinsicHeights.reduce((max, childHeight) => Math.max(max, childHeight), 0) : Math.max(0, height);
  const rect = { x: x2, y: y2, width: safeWidth, height: allocatedHeight };
  const box = {
    component,
    rect,
    clip: intersect(clip, rect),
    children: [],
    layer: 0
  };
  let childX = x2;
  for (let index = 0; index < entries.length; index++) {
    const naturalChildHeight = intrinsicHeights[index];
    const childHeight = node.align === "stretch" ? allocatedHeight : Math.min(allocatedHeight, naturalChildHeight);
    let childY = y2;
    if (node.align === "center")
      childY += Math.floor((allocatedHeight - childHeight) / 2);
    else if (node.align === "end")
      childY += allocatedHeight - childHeight;
    const childWidth = widths[index];
    if (childWidth === 0) {
      box.children.push({
        component: entries[index].component,
        rect: { x: childX, y: childY, width: 0, height: childHeight },
        clip: { x: childX, y: childY, width: 0, height: 0 },
        children: [],
        parent: box,
        layer: 0
      });
    } else {
      box.children.push(withParent(layoutComponent(context, entries[index].component, childX, childY, childWidth, childHeight, box.clip), box));
    }
    childX += childWidth + node.gap;
  }
  return box;
}
function replaceScrollbarCell(line, column, totalWidth, replacement, preserveTargetBackground) {
  if (isImageLine(line))
    return line;
  const graphemeRange = getGraphemeCellRange(line, column);
  const start = graphemeRange?.start ?? column;
  const end = graphemeRange?.end ?? column + 1;
  const before = sliceByColumn(line, 0, start, true);
  const target = sliceByColumn(line, start, end - start, true);
  const after = sliceByColumn(line, end, Math.max(0, totalWidth - end), true);
  let targetPrefix = "";
  let targetIndex = 0;
  while (targetIndex < target.length) {
    const ansi = extractAnsiCode(target, targetIndex);
    if (!ansi)
      break;
    targetPrefix += ansi.code;
    targetIndex += ansi.length;
  }
  const beforePadding = " ".repeat(Math.max(0, start - visibleWidth(before)));
  const cellPaddingBefore = " ".repeat(Math.max(0, column - start));
  const cellPaddingAfter = " ".repeat(Math.max(0, end - column - 1));
  const targetStyle = `\x1B[0m\x1B]8;;\x07${preserveTargetBackground ? getActiveBackgroundAnsi(targetPrefix) : ""}`;
  return `${before}${beforePadding}${targetStyle}${cellPaddingBefore}${replacement}${cellPaddingAfter}${after}`;
}
function getScrollbarGeometry(box, includeHiddenAuto = false) {
  if (!box.scrollView || box.rect.width <= 0 || box.rect.height <= 0)
    return void 0;
  const contentHeight = box.children[0]?.rect.height ?? box.scrollContentLines?.length ?? 0;
  const trackHeight = box.rect.height;
  const canRevealHiddenAuto = includeHiddenAuto && box.scrollView.scrollbar === "auto" && contentHeight > trackHeight;
  if (!box.scrollView.isScrollbarVisible && !canRevealHiddenAuto)
    return void 0;
  const minThumbHeight = Math.min(2, trackHeight);
  const thumbHeight = Math.max(minThumbHeight, Math.min(trackHeight, Math.round(trackHeight * trackHeight / contentHeight)));
  const maxScrollTop = Math.max(0, contentHeight - trackHeight);
  const maxThumbTop = trackHeight - thumbHeight;
  const thumbOffset = maxScrollTop === 0 ? 0 : Math.round(box.scrollView.scrollTop / maxScrollTop * maxThumbTop);
  const column = box.rect.x + box.rect.width - 1;
  if (column < box.clip.x || column >= box.clip.x + box.clip.width)
    return void 0;
  return {
    column,
    trackTop: box.rect.y,
    trackHeight,
    thumbTop: box.rect.y + thumbOffset,
    thumbHeight,
    maxScrollTop
  };
}
function paintScrollbar(box, screen, totalWidth) {
  const geometry = getScrollbarGeometry(box);
  if (!geometry || !box.scrollView)
    return;
  for (let offset = 0; offset < geometry.trackHeight; offset++) {
    const row = geometry.trackTop + offset;
    if (row < box.clip.y || row >= box.clip.y + box.clip.height || row < 0 || row >= screen.length)
      continue;
    const isThumb = row >= geometry.thumbTop && row < geometry.thumbTop + geometry.thumbHeight;
    const replacement = isThumb ? box.scrollView.scrollbarThumbStyle(box.scrollView.isScrollbarActive ? "\u2588" : "\u2503") : box.scrollView.scrollbarTrackStyle("\u2502");
    screen[row] = replaceScrollbarCell(screen[row] ?? "", geometry.column, totalWidth, replacement, box.scrollView.scrollbar !== "always");
  }
}
function paintBox(box, screen, totalWidth) {
  if (box.lines) {
    const offset = box.lineOffset ?? 0;
    const firstRow = Math.max(box.rect.y, box.clip.y, 0);
    const lastRow = Math.min(box.rect.y + box.rect.height, box.clip.y + box.clip.height, screen.length);
    for (let row = firstRow; row < lastRow; row++) {
      const sourceLine = box.lines[offset + row - box.rect.y];
      if (sourceLine === void 0)
        continue;
      let line = sourceLine.replace(OSC133_ZONE_PREFIX, "");
      const imageMetadata = getKittyImageMetadata(line);
      if (imageMetadata) {
        const clipBottom = Math.min(screen.length, box.clip.y + box.clip.height);
        const visibleRows = Math.min(imageMetadata.rows, clipBottom - row);
        if (visibleRows < imageMetadata.rows)
          line = cropKittyImageLine(line, 0, visibleRows);
      }
      if (box.rect.x === 0 && box.rect.width >= totalWidth && (isImageLine(line) || !screen[row])) {
        screen[row] = line;
      } else {
        screen[row] = compositeTuiLine(screen[row] ?? "", line, box.rect.x, box.rect.width, totalWidth);
      }
    }
  }
  for (const child of box.children)
    paintBox(child, screen, totalWidth);
  if (box.scrollView && box.scrollContentLines && box.scrollView.scrollTop > 0 && box.rect.height > 0) {
    for (let imageRow = box.scrollView.scrollTop - 1; imageRow >= 0; imageRow--) {
      const imageLine = box.scrollContentLines[imageRow] ?? "";
      const metadata = getKittyImageMetadata(imageLine);
      if (metadata) {
        const hiddenRows = box.scrollView.scrollTop - imageRow;
        if (hiddenRows < metadata.rows) {
          const visibleRows = Math.min(box.rect.height, metadata.rows - hiddenRows);
          const cropped = cropKittyImageLine(imageLine, hiddenRows, visibleRows);
          if (box.rect.x === 0 && box.rect.width >= totalWidth)
            screen[box.rect.y] = cropped;
        }
        break;
      }
      if (imageLine !== "")
        break;
    }
  }
  paintScrollbar(box, screen, totalWidth);
}
function renderLayoutFrame(root, width, height, requestRender) {
  const safeWidth = Math.max(1, Math.floor(width));
  const safeHeight = Math.max(1, Math.floor(height));
  const context = {
    viewport: { width: safeWidth, height: safeHeight },
    renderCache: /* @__PURE__ */ new Map(),
    requestRender,
    primaryScrollView: void 0
  };
  const rootBox = layoutComponent(context, root, 0, 0, safeWidth, safeHeight, {
    x: 0,
    y: 0,
    width: safeWidth,
    height: safeHeight
  });
  const lines = Array.from({ length: safeHeight }, () => "");
  paintBox(rootBox, lines, safeWidth);
  return {
    root: rootBox,
    width: safeWidth,
    height: safeHeight,
    lines,
    ...context.primaryScrollView === void 0 ? {} : { primaryScrollView: context.primaryScrollView }
  };
}
function containsPoint(rect, x2, y2) {
  return x2 >= rect.x && x2 < rect.x + rect.width && y2 >= rect.y && y2 < rect.y + rect.height;
}
function getLayoutBoxesAt(frame, x2, y2) {
  const result = [];
  const visit = (box, depth) => {
    if (!containsPoint(box.clip, x2, y2))
      return;
    result.push({ box, depth });
    for (const child of box.children)
      visit(child, depth + 1);
  };
  visit(frame.root, 0);
  result.sort((a, b2) => b2.box.layer - a.box.layer || b2.depth - a.depth);
  return result.map(({ box }) => box);
}
function getScrollViewBox(frame, scrollView) {
  const visit = (box) => {
    if (box.scrollView === scrollView)
      return box;
    for (const child of box.children) {
      const match = visit(child);
      if (match)
        return match;
    }
    return void 0;
  };
  return visit(frame.root);
}
function getScrollViewsAt(frame, x2, y2) {
  const result = [];
  const visit = (box, depth) => {
    if (!containsPoint(box.clip, x2, y2))
      return;
    if (box.scrollView && containsPoint(box.rect, x2, y2))
      result.push({ scrollView: box.scrollView, depth });
    for (const child of box.children)
      visit(child, depth + 1);
  };
  visit(frame.root, 0);
  result.sort((a, b2) => b2.depth - a.depth);
  return result.map((entry) => entry.scrollView);
}

// node_modules/@earendil-works/pi-tui/dist/tui-alt-screen.js
var ENTER_ALT_SCREEN = "\x1B[?1049h";
var EXIT_ALT_SCREEN = "\x1B[?1049l";
var DISABLE_AUTOWRAP = "\x1B[?7l";
var ENABLE_AUTOWRAP = "\x1B[?7h";
var ENABLE_BUTTON_MOTION_MOUSE = "\x1B[?1000h\x1B[?1002h\x1B[?1004h\x1B[?1006h";
var ENABLE_ALL_MOTION_MOUSE = "\x1B[?1000h\x1B[?1002h\x1B[?1003h\x1B[?1004h\x1B[?1006h";
var DISABLE_MOUSE = "\x1B[?1006l\x1B[?1004l\x1B[?1003l\x1B[?1002l\x1B[?1000l";
var FOCUS_IN = "\x1B[I";
var FOCUS_OUT = "\x1B[O";
var BEGIN_SYNCHRONIZED_OUTPUT = "\x1B[?2026h";
var END_SYNCHRONIZED_OUTPUT = "\x1B[?2026l";
var OSC133_ZONE_PREFIX2 = /^(?:\x1b\]133;[ABC](?:\x07|\x1b\\))+/;
var OSC133_PROMPT_START = /^\x1b\]133;A(?:\x07|\x1b\\)/;
var PAGE_SCROLL_OVERLAP = 4;
var ALT_WHEEL_SCROLL_MULTIPLIER = 5;
var MAX_CACHED_OFFSCREEN_KITTY_IMAGES = 16;
var MAX_CACHED_OFFSCREEN_KITTY_TRANSMISSION_BYTES = 32 * 1024 * 1024;
var MAX_CACHED_OFFSCREEN_KITTY_DECODED_BYTES = 64 * 1024 * 1024;
var DOUBLE_CLICK_INTERVAL_MS = 500;
var COPY_ERROR_FLASH_DURATION_MS = 5e3;
var TERMINAL_WORD_SELECTION_JOINERS = /* @__PURE__ */ new Set(["/", "-"]);
var wordSegmenter4 = getWordSegmenter();
var TuiAltScreen = class extends TuiBase {
  mode = "fullscreen";
  [VIEWPORT_TUI] = true;
  previousScreen = [];
  lastDocument = [];
  previousScreenWidth = 0;
  previousScreenHeight = 0;
  layoutRoot;
  currentLayout;
  implicitDocument;
  implicitScrollView;
  flashes;
  altScreenActive = false;
  imageProtocol = null;
  savedCapabilities;
  uploadedKittyImages = /* @__PURE__ */ new Map();
  selectionAnchor;
  selectionFocus;
  selectionGranularity = "character";
  selectionInitialRange;
  lastClick;
  selectionDragPointer;
  selectionAutoScrollDirection = 0;
  selectionAutoScrollTimer;
  selectionPressActive = false;
  scrollbarDrag;
  scrollbarHover;
  scrollToEndIndicatorRect;
  activeSearch;
  pressedUrl;
  selectionDragged = false;
  mouseCapture;
  mousePressTarget;
  mousePressPoint;
  mousePressMoved = false;
  lastComponentClick;
  wheelScrollLines;
  mouseEnabled;
  searchMatchStyle;
  searchCurrentMatchStyle;
  searchNavigationButtonStyle;
  scrollToEndIndicator;
  openUrl;
  onRightClickPaste;
  copyOnSelect;
  copySelection;
  constructor(terminal, showHardwareCursor, logDirectory, options = {}) {
    super(terminal, showHardwareCursor, logDirectory);
    this.implicitDocument = {
      render: (width) => super.render(width),
      handleMouse: (event) => super.handleMouse(event),
      invalidate: () => {
        for (const child of this.children)
          child.invalidate();
      }
    };
    this.implicitScrollView = new ScrollView(this.implicitDocument, { follow: "end", primary: true });
    this.flashes = new AltScreenFlashContainer(() => this.requestRender());
    this.wheelScrollLines = Math.max(1, Math.floor(options.wheelScrollLines ?? 1));
    this.mouseEnabled = options.mouse ?? true;
    this.searchMatchStyle = options.searchMatchStyle ?? ((text) => `\x1B[4m${text}\x1B[24m`);
    this.searchCurrentMatchStyle = options.searchCurrentMatchStyle ?? ((text) => `\x1B[1;7m${text}\x1B[22;27m`);
    this.searchNavigationButtonStyle = options.searchNavigationButtonStyle ?? ((text) => text);
    this.scrollToEndIndicator = options.scrollToEndIndicator;
    this.openUrl = options.openUrl;
    this.onRightClickPaste = options.onRightClickPaste;
    this.copyOnSelect = options.copyOnSelect ?? true;
    this.copySelection = options.copySelection;
    this.addInputListener((data) => this.handleViewportInput(data));
  }
  get viewportTop() {
    return this.getPrimaryScrollView().scrollTop;
  }
  get isFollowingOutput() {
    return this.getPrimaryScrollView().isFollowingEnd;
  }
  getCopyOnSelect() {
    return this.copyOnSelect;
  }
  setCopyOnSelect(enabled) {
    this.copyOnSelect = enabled;
  }
  /** Whether the fullscreen viewport has a non-empty active text selection. */
  hasActiveSelection() {
    return this.getActiveSelectionText() !== void 0;
  }
  /** Copy the active fullscreen text selection, if any, using the configured selection clipboard path. */
  async copyActiveSelectionToClipboard() {
    const text = this.getActiveSelectionText();
    if (!text)
      return false;
    return this.copyTextToClipboard(text);
  }
  setLayoutRoot(component) {
    if (this.layoutRoot === component)
      return;
    this.layoutRoot = component;
    this.currentLayout = void 0;
    this.requestRender();
  }
  render(width) {
    return this.layoutRoot?.render(width) ?? super.render(width);
  }
  getMountedRoots() {
    return this.layoutRoot ? [this.layoutRoot] : this.children;
  }
  getPrimaryScrollView() {
    return this.currentLayout?.primaryScrollView ?? this.implicitScrollView;
  }
  beforeTerminalStart() {
    this.stopSelectionAutoScroll();
    this.selectionPressActive = false;
    this.stopScrollbarHover();
    this.stopScrollbarDrag();
    this.flashes.dispose();
    this.altScreenActive = true;
    const capabilities = getCapabilities();
    this.imageProtocol = capabilities.images;
    this.uploadedKittyImages.clear();
    if (capabilities.images === "iterm2") {
      this.savedCapabilities = capabilities;
      setCapabilities({ ...capabilities, images: null });
      this.invalidate();
    }
    this.lastDocument = [];
    this.selectionAnchor = void 0;
    this.selectionFocus = void 0;
    this.selectionGranularity = "character";
    this.selectionInitialRange = void 0;
    this.lastClick = void 0;
    this.pressedUrl = void 0;
    this.selectionDragged = false;
    this.clearComponentMouseGesture();
    this.lastComponentClick = void 0;
    this.resetRenderState();
    const term = process.env.TERM?.toLowerCase() ?? "";
    const mouseSequence = process.env.TMUX !== void 0 || process.env.ZELLIJ !== void 0 || process.env.STY !== void 0 || term.startsWith("tmux") || term.startsWith("screen") ? ENABLE_BUTTON_MOTION_MOUSE : ENABLE_ALL_MOTION_MOUSE;
    this.terminal.write(`${ENTER_ALT_SCREEN}${DISABLE_AUTOWRAP}${this.mouseEnabled ? mouseSequence : ""}\x1B[2J\x1B[H\x1B[?25l`);
  }
  beforeTerminalStop(_options) {
    this.closeSearch();
    this.stopSelectionAutoScroll();
    this.selectionPressActive = false;
    this.stopScrollbarHover();
    this.stopScrollbarDrag();
    this.clearComponentMouseGesture();
    this.flashes.dispose();
    if (!this.altScreenActive)
      return;
    this.terminal.write(`${BEGIN_SYNCHRONIZED_OUTPUT}${this.deleteKittyImages()}${this.mouseEnabled ? DISABLE_MOUSE : ""}${ENABLE_AUTOWRAP}${END_SYNCHRONIZED_OUTPUT}`);
    this.uploadedKittyImages.clear();
  }
  afterTerminalStop(options) {
    if (!this.altScreenActive)
      return;
    this.altScreenActive = false;
    if (options.preserveScreen) {
      this.terminal.write(`${BEGIN_SYNCHRONIZED_OUTPUT}${EXIT_ALT_SCREEN}\x1B[?25h${END_SYNCHRONIZED_OUTPUT}`);
    } else {
      const width = Math.max(1, this.terminal.columns);
      const documentLines = this.render(width).map((line) => line.replace(OSC133_ZONE_PREFIX2, ""));
      this.lastDocument = this.applyLineResets(documentLines.map((line) => line.replaceAll(CURSOR_MARKER, ""))).map((line) => isImageLine(line) || visibleWidth(line) <= width ? line : sliceByColumn(line, 0, width, true));
      let buffer = `${BEGIN_SYNCHRONIZED_OUTPUT}${EXIT_ALT_SCREEN}${DISABLE_AUTOWRAP}`;
      for (let row = 0; row < this.lastDocument.length; row++) {
        if (row > 0)
          buffer += "\r\n";
        buffer += `\r\x1B[2K${this.lastDocument[row] ?? ""}`;
      }
      buffer += `\x1B[0m${ENABLE_AUTOWRAP}\r
\x1B[?25h${END_SYNCHRONIZED_OUTPUT}`;
      this.terminal.write(buffer);
    }
    if (this.savedCapabilities) {
      setCapabilities(this.savedCapabilities);
      this.savedCapabilities = void 0;
    }
  }
  deleteKittyImages() {
    return this.imageProtocol === "kitty" ? deleteAllKittyImages() : "";
  }
  prepareKittyScreen(screen) {
    const visibleImageIds = /* @__PURE__ */ new Set();
    const lines = screen.map((line) => {
      const placement = getKittyImagePlacement(line);
      if (!placement)
        return line;
      visibleImageIds.add(placement.imageId);
      const cachedImage = this.uploadedKittyImages.get(placement.imageId);
      const nextCachedImage = {
        transmissionGeneration: placement.transmissionGeneration,
        transmissionBytes: placement.transmissionBytes,
        estimatedDecodedBytes: placement.estimatedDecodedBytes
      };
      if (cachedImage)
        this.uploadedKittyImages.delete(placement.imageId);
      this.uploadedKittyImages.set(placement.imageId, nextCachedImage);
      return cachedImage?.transmissionGeneration === placement.transmissionGeneration ? placement.replacementLine : line;
    });
    let cachedOffscreenImageCount = 0;
    let cachedOffscreenTransmissionBytes = 0;
    let cachedOffscreenDecodedBytes = 0;
    for (const [imageId, cachedImage] of this.uploadedKittyImages) {
      if (visibleImageIds.has(imageId))
        continue;
      cachedOffscreenImageCount += 1;
      cachedOffscreenTransmissionBytes += cachedImage.transmissionBytes;
      cachedOffscreenDecodedBytes += cachedImage.estimatedDecodedBytes;
    }
    let evictedImageDeletion = "";
    for (const [imageId, cachedImage] of this.uploadedKittyImages) {
      if (cachedOffscreenImageCount <= MAX_CACHED_OFFSCREEN_KITTY_IMAGES && cachedOffscreenTransmissionBytes <= MAX_CACHED_OFFSCREEN_KITTY_TRANSMISSION_BYTES && cachedOffscreenDecodedBytes <= MAX_CACHED_OFFSCREEN_KITTY_DECODED_BYTES) {
        break;
      }
      if (visibleImageIds.has(imageId))
        continue;
      evictedImageDeletion += deleteKittyImage(imageId);
      this.uploadedKittyImages.delete(imageId);
      cachedOffscreenImageCount -= 1;
      cachedOffscreenTransmissionBytes -= cachedImage.transmissionBytes;
      cachedOffscreenDecodedBytes -= cachedImage.estimatedDecodedBytes;
    }
    return { lines, evictedImageDeletion };
  }
  resetRenderState() {
    this.previousScreen = [];
    this.previousScreenWidth = 0;
    this.previousScreenHeight = 0;
    this.currentLayout = void 0;
  }
  scrollBy(lines) {
    this.getPrimaryScrollView().scrollBy(lines);
    this.requestRender();
  }
  scrollToTop() {
    this.getPrimaryScrollView().scrollToStart();
    this.requestRender();
  }
  scrollToBottom() {
    this.getPrimaryScrollView().scrollToEnd();
    this.requestRender();
  }
  scrollToPrompt(direction) {
    if (!this.currentLayout)
      return;
    const scrollView = this.getPrimaryScrollView();
    const lines = getScrollViewBox(this.currentLayout, scrollView)?.scrollContentLines;
    if (!lines)
      return;
    for (let row = scrollView.scrollTop + direction; row >= 0 && row < lines.length; row += direction) {
      if (!OSC133_PROMPT_START.test(lines[row] ?? ""))
        continue;
      scrollView.scrollTo(row);
      this.requestRender();
      return;
    }
  }
  toggleSearch() {
    if (this.activeSearch) {
      this.closeSearch();
      return;
    }
    const component = new AltScreenSearchComponent((query) => this.updateSearchQuery(query), this.searchNavigationButtonStyle);
    const search = {
      component,
      index: new AltScreenSearchIndex(),
      query: "",
      matches: [],
      selectedIndex: -1,
      anchorRow: this.getPrimaryScrollView().scrollTop,
      selectionMode: "query"
    };
    this.activeSearch = search;
    search.overlay = this.showOverlay(component, {
      anchor: "top-right",
      width: "40%",
      minWidth: 32,
      margin: 1
    });
  }
  closeSearch() {
    const search = this.activeSearch;
    if (!search)
      return;
    this.activeSearch = void 0;
    search.overlay?.hide();
    this.requestRender();
  }
  updateSearchQuery(query) {
    const search = this.activeSearch;
    if (!search || query === search.query)
      return;
    const selected = search.matches[search.selectedIndex];
    search.anchorRow = selected?.segments[0]?.row ?? this.getPrimaryScrollView().scrollTop;
    search.query = query;
    search.selectionMode = "query";
    search.component.setResult(-1, 0);
    this.requestRender();
  }
  navigateSearch(direction) {
    const search = this.activeSearch;
    if (!search?.query)
      return;
    search.selectionMode = direction < 0 ? "previous" : "next";
    this.requestRender();
  }
  getSearchNavigationDirectionAt(x2, y2) {
    const search = this.activeSearch;
    const bounds = search?.overlay?.getBounds();
    if (!search || !bounds)
      return void 0;
    if (x2 < bounds.col || x2 >= bounds.col + bounds.width || y2 < bounds.row || y2 >= bounds.row + bounds.height) {
      return void 0;
    }
    return search.component.getNavigationDirectionAt(y2 - bounds.row, x2 - bounds.col);
  }
  handleSearchMouseEvent(event) {
    const search = this.activeSearch;
    if (!search)
      return false;
    const direction = this.getSearchNavigationDirectionAt(event.x, event.y);
    if (search.component.setHoveredNavigationDirection(direction))
      this.requestRender();
    if (direction === void 0 || event.release || (event.button & 32) !== 0 || (event.button & 3) !== 0) {
      return false;
    }
    this.navigateSearch(direction);
    return true;
  }
  refreshSearch(layout) {
    const search = this.activeSearch;
    if (!search)
      return false;
    const scrollView = layout.primaryScrollView ?? this.implicitScrollView;
    const box = getScrollViewBox(layout, scrollView);
    const lines = box?.scrollContentLines;
    if (!lines || !search.query.trim()) {
      search.matches = [];
      search.selectedIndex = -1;
      search.selectedKey = void 0;
      search.selectionMode = "retain";
      search.component.setResult(-1, 0);
      return false;
    }
    const shouldRevealSelection = search.selectionMode !== "retain";
    const result = search.index.search(lines, search.query);
    const matches = result.matches;
    search.matches = matches;
    if (!result.changed && search.selectionMode === "retain")
      return false;
    const exactIndex = result.changed ? search.selectedKey ? matches.findIndex((match) => getAltScreenSearchMatchKey(match) === search.selectedKey) : -1 : search.selectedIndex;
    let selectedIndex = -1;
    if (matches.length > 0) {
      if (search.selectionMode === "query") {
        let low = 0;
        let high = matches.length;
        while (low < high) {
          const middle = low + Math.floor((high - low) / 2);
          if ((matches[middle].segments[0]?.row ?? 0) < search.anchorRow)
            low = middle + 1;
          else
            high = middle;
        }
        selectedIndex = low < matches.length ? low : 0;
      } else if (search.selectionMode === "next") {
        const baseIndex = exactIndex >= 0 ? exactIndex : Math.min(search.selectedIndex, matches.length - 1);
        selectedIndex = baseIndex < 0 ? 0 : (baseIndex + 1) % matches.length;
      } else if (search.selectionMode === "previous") {
        const baseIndex = exactIndex >= 0 ? exactIndex : Math.min(search.selectedIndex, matches.length - 1);
        selectedIndex = baseIndex < 0 ? matches.length - 1 : (baseIndex - 1 + matches.length) % matches.length;
      } else {
        selectedIndex = exactIndex >= 0 ? exactIndex : Math.min(Math.max(0, search.selectedIndex), matches.length - 1);
      }
    }
    search.selectedIndex = selectedIndex;
    search.selectedKey = selectedIndex >= 0 ? getAltScreenSearchMatchKey(matches[selectedIndex]) : void 0;
    search.selectionMode = "retain";
    search.component.setResult(selectedIndex, matches.length);
    if (!shouldRevealSelection)
      return false;
    const selected = matches[selectedIndex];
    const firstSegment = selected?.segments[0];
    const lastSegment = selected?.segments[selected.segments.length - 1];
    if (!box || !firstSegment || !lastSegment || scrollView.viewportHeight <= 0)
      return false;
    const before = scrollView.scrollTop;
    const visibleBottom = before + scrollView.viewportHeight - 1;
    let target = before;
    if (firstSegment.row < before || lastSegment.row > visibleBottom) {
      target = firstSegment.row - Math.floor(scrollView.viewportHeight / 3);
    }
    scrollView.scrollTo(target, { disableFollow: true });
    return scrollView.scrollTop !== before;
  }
  /** Show a transient message in the alternate-screen flash stack. */
  flash(message, durationMs) {
    this.flashes.flash(message, durationMs);
  }
  shouldDeferViewportInputToOverlay() {
    return this.isOverlayFocused() && this.activeSearch?.overlay?.isFocused() !== true;
  }
  clearComponentMouseGesture() {
    this.mouseCapture = void 0;
    this.mousePressTarget = void 0;
    this.mousePressPoint = void 0;
    this.mousePressMoved = false;
  }
  handleViewportInput(data) {
    if (data === FOCUS_OUT) {
      const hadActiveSelection = this.selectionPressActive;
      const hadNonEmptyActiveSelection = hadActiveSelection && this.getSelectionBounds() !== void 0;
      this.selectionPressActive = false;
      this.stopSelectionAutoScroll();
      this.stopScrollbarHover();
      if (this.activeSearch?.component.setHoveredNavigationDirection(void 0))
        this.requestRender();
      this.stopScrollbarDrag();
      this.pressedUrl = void 0;
      this.selectionDragged = false;
      this.clearComponentMouseGesture();
      this.lastComponentClick = void 0;
      if (hadActiveSelection) {
        this.selectionAnchor = void 0;
        this.selectionFocus = void 0;
        this.selectionGranularity = "character";
        this.selectionInitialRange = void 0;
        if (hadNonEmptyActiveSelection)
          this.requestRender();
      }
      this.lastClick = void 0;
      return { consume: true };
    }
    if (data === FOCUS_IN)
      return { consume: true };
    const wheelEvent = this.parseWheelEvent(data);
    if (wheelEvent) {
      const event = this.createMouseEvent("wheel", wheelEvent.button, wheelEvent.x, wheelEvent.y, {
        wheelDelta: wheelEvent.direction * this.getWheelScrollLines(wheelEvent.button)
      });
      const overlay = this.dispatchMouseToOverlay(event);
      const result = overlay.result ?? (overlay.hit ? void 0 : this.dispatchMouseToLayout(event));
      if (result) {
        if (this.applyMouseDispatchResult(event, result))
          this.requestRender();
        return { consume: true };
      }
      if (this.shouldDeferViewportInputToOverlay())
        return void 0;
      this.routeWheel(wheelEvent);
      return { consume: true };
    }
    const mouseEvent = this.parseSgrMouseEvent(data);
    if (mouseEvent) {
      this.handleMouseEvent(mouseEvent);
      return { consume: true };
    }
    if (this.isMouseSequence(data))
      return { consume: true };
    const keybindings = getKeybindings();
    const isRelease = isKeyRelease(data);
    if (keybindings.matches(data, "tui.altScreen.search")) {
      if (!isRelease)
        this.toggleSearch();
      return { consume: true };
    }
    if (this.activeSearch?.overlay?.isFocused()) {
      if (keybindings.matches(data, "tui.altScreen.searchNext")) {
        if (!isRelease)
          this.navigateSearch(1);
        return { consume: true };
      }
      if (keybindings.matches(data, "tui.altScreen.searchPrevious")) {
        if (!isRelease)
          this.navigateSearch(-1);
        return { consume: true };
      }
      if (keybindings.matches(data, "tui.altScreen.searchClose")) {
        if (!isRelease)
          this.closeSearch();
        return { consume: true };
      }
    }
    if (this.shouldDeferViewportInputToOverlay())
      return void 0;
    if (keybindings.matches(data, "tui.altScreen.pageUp")) {
      if (!isRelease) {
        this.scrollBy(-Math.max(1, this.getPrimaryScrollView().viewportHeight - PAGE_SCROLL_OVERLAP));
      }
      return { consume: true };
    }
    if (keybindings.matches(data, "tui.altScreen.pageDown")) {
      if (!isRelease) {
        this.scrollBy(Math.max(1, this.getPrimaryScrollView().viewportHeight - PAGE_SCROLL_OVERLAP));
      }
      return { consume: true };
    }
    if (keybindings.matches(data, "tui.altScreen.halfPageUp")) {
      if (!isRelease)
        this.scrollBy(-Math.max(1, Math.floor(this.getPrimaryScrollView().viewportHeight / 2)));
      return { consume: true };
    }
    if (keybindings.matches(data, "tui.altScreen.halfPageDown")) {
      if (!isRelease)
        this.scrollBy(Math.max(1, Math.floor(this.getPrimaryScrollView().viewportHeight / 2)));
      return { consume: true };
    }
    if (keybindings.matches(data, "tui.altScreen.lineUp")) {
      if (!isRelease)
        this.scrollBy(-1);
      return { consume: true };
    }
    if (keybindings.matches(data, "tui.altScreen.lineDown")) {
      if (!isRelease)
        this.scrollBy(1);
      return { consume: true };
    }
    if (keybindings.matches(data, "tui.altScreen.previousPrompt")) {
      if (!isRelease)
        this.scrollToPrompt(-1);
      return { consume: true };
    }
    if (keybindings.matches(data, "tui.altScreen.nextPrompt")) {
      if (!isRelease)
        this.scrollToPrompt(1);
      return { consume: true };
    }
    if (keybindings.matches(data, "tui.altScreen.top")) {
      if (!isRelease)
        this.scrollToTop();
      return { consume: true };
    }
    if (keybindings.matches(data, "tui.altScreen.bottom")) {
      if (!isRelease)
        this.scrollToBottom();
      return { consume: true };
    }
    return void 0;
  }
  decodeMouseButton(button) {
    switch (button & 3) {
      case 0:
        return "left";
      case 1:
        return "middle";
      case 2:
        return "right";
      default:
        return "none";
    }
  }
  createMouseEvent(type, button, x2, y2, extra = {}) {
    return {
      type,
      button: type === "wheel" ? "none" : this.decodeMouseButton(button),
      x: x2,
      y: y2,
      screenX: x2,
      screenY: y2,
      width: Math.max(1, this.terminal.columns),
      height: Math.max(1, this.terminal.rows),
      shift: (button & 4) !== 0,
      alt: (button & 8) !== 0,
      ctrl: (button & 16) !== 0,
      ...extra.wheelDelta === void 0 ? {} : { wheelDelta: extra.wheelDelta },
      ...extra.clickCount === void 0 ? {} : { clickCount: extra.clickCount }
    };
  }
  dispatchMouseToLayout(event) {
    if (!this.currentLayout)
      return void 0;
    const visited = /* @__PURE__ */ new Set();
    const boxes = getLayoutBoxesAt(this.currentLayout, event.screenX, event.screenY);
    for (const box of boxes) {
      if (visited.has(box.component))
        continue;
      if (getLayoutNode(box.component) && box.component.handleMouse === Container.prototype.handleMouse)
        continue;
      visited.add(box.component);
      const result = dispatchMouseEvent(box.component, {
        ...event,
        x: event.screenX - box.rect.x,
        y: event.screenY - box.rect.y,
        width: box.rect.width,
        height: box.rect.height
      });
      if (result)
        return result;
    }
    return void 0;
  }
  applyMouseDispatchResult(event, result) {
    const focusTarget = this.resolveMouseFocusTarget(result.focusTarget ?? result.target.component);
    const focusChanged = result.focus === true && this.getFocusedComponent() !== focusTarget;
    if (result.focus)
      this.setFocus(focusTarget);
    if (result.capture)
      this.mouseCapture = result.target;
    return result.render ?? (focusChanged || event.type === "press" || event.type === "click" || event.type === "drag" || event.type === "wheel");
  }
  dispatchMouseToTarget(event, target) {
    return dispatchMouseEvent(target.component, retargetMouseEvent(event, target));
  }
  getComponentClickCount(target, x2, y2) {
    const now = Date.now();
    const previous = this.lastComponentClick;
    const count = previous && now - previous.timestamp <= DOUBLE_CLICK_INTERVAL_MS && previous.component === target.component && previous.x === x2 && previous.y === y2 ? previous.count % 3 + 1 : 1;
    this.lastComponentClick = { timestamp: now, count, component: target.component, x: x2, y: y2 };
    return count;
  }
  clearTextSelection() {
    this.stopSelectionAutoScroll();
    this.selectionPressActive = false;
    this.selectionAnchor = void 0;
    this.selectionFocus = void 0;
    this.selectionGranularity = "character";
    this.selectionInitialRange = void 0;
    this.pressedUrl = void 0;
    this.selectionDragged = false;
  }
  handleMouseEvent(raw) {
    const isMotion = (raw.button & 32) !== 0;
    const type = raw.release ? "release" : isMotion ? this.decodeMouseButton(raw.button) === "none" ? "move" : "drag" : "press";
    const event = this.createMouseEvent(type, raw.button, raw.x, raw.y);
    if (this.mouseCapture || this.mousePressTarget) {
      const target = this.mouseCapture ?? this.mousePressTarget;
      if (this.mousePressPoint && (raw.x !== this.mousePressPoint.x || raw.y !== this.mousePressPoint.y)) {
        this.mousePressMoved = true;
        this.lastComponentClick = void 0;
      }
      let render = false;
      const targetResult = this.dispatchMouseToTarget(event, target);
      if (targetResult)
        render = this.applyMouseDispatchResult(event, targetResult);
      if (raw.release) {
        if (!this.mousePressMoved && this.mousePressPoint?.x === raw.x && this.mousePressPoint.y === raw.y) {
          const clickEvent = this.createMouseEvent("click", raw.button, raw.x, raw.y, {
            clickCount: this.getComponentClickCount(target, raw.x, raw.y)
          });
          const clickResult = this.dispatchMouseToTarget(clickEvent, target);
          if (clickResult)
            render = this.applyMouseDispatchResult(clickEvent, clickResult) || render;
        }
        this.clearComponentMouseGesture();
      }
      if (render)
        this.requestRender();
      return;
    }
    if (this.handleSearchMouseEvent(raw))
      return;
    const overlay = this.dispatchMouseToOverlay(event);
    if (!overlay.hit) {
      if (this.handleScrollToEndIndicatorMouseEvent(raw))
        return;
      const scrollbarHandled = this.handleScrollbarMouseEvent(raw);
      if (!this.scrollbarDrag)
        this.updateScrollbarHover(raw.x, raw.y);
      if (scrollbarHandled)
        return;
    } else {
      this.stopScrollbarHover();
    }
    const result = overlay.result ?? (overlay.hit ? void 0 : this.dispatchMouseToLayout(event));
    if (result) {
      const render = this.applyMouseDispatchResult(event, result);
      if (type === "press") {
        this.clearTextSelection();
        this.mousePressTarget = result.target;
        this.mousePressPoint = { x: raw.x, y: raw.y };
        this.mousePressMoved = false;
      }
      if (render)
        this.requestRender();
      return;
    }
    if (this.handleRightClickPaste(raw))
      return;
    this.handleSelectionMouseEvent(raw);
  }
  parseWheelEvent(data) {
    const sgr = /^\x1b\[<(\d+);(\d+);(\d+)[Mm]$/.exec(data);
    if (sgr) {
      const button = Number.parseInt(sgr[1], 10);
      if ((button & 64) === 0)
        return void 0;
      const direction = button & 3;
      if (direction !== 0 && direction !== 1)
        return void 0;
      return {
        direction: direction === 0 ? -1 : 1,
        x: Number.parseInt(sgr[2], 10) - 1,
        y: Number.parseInt(sgr[3], 10) - 1,
        button
      };
    }
    if (data.length === 6 && data.startsWith("\x1B[M")) {
      const button = data.charCodeAt(3) - 32;
      if ((button & 64) === 0)
        return void 0;
      const direction = button & 3;
      if (direction !== 0 && direction !== 1)
        return void 0;
      return {
        direction: direction === 0 ? -1 : 1,
        x: data.charCodeAt(4) - 33,
        y: data.charCodeAt(5) - 33,
        button
      };
    }
    return void 0;
  }
  getWheelScrollLines(button) {
    return (button & 8) !== 0 ? this.wheelScrollLines * ALT_WHEEL_SCROLL_MULTIPLIER : this.wheelScrollLines;
  }
  routeWheel(event) {
    let remaining = event.direction * this.getWheelScrollLines(event.button);
    const seen = /* @__PURE__ */ new Set();
    for (const scrollView of this.currentLayout ? getScrollViewsAt(this.currentLayout, event.x, event.y) : []) {
      seen.add(scrollView);
      remaining = scrollView.scrollBy(remaining);
      if (remaining === 0 || scrollView.overscroll === "contain")
        break;
    }
    const primary = this.getPrimaryScrollView();
    if (remaining !== 0 && !seen.has(primary))
      primary.scrollBy(remaining);
    this.updateScrollbarHover(event.x, event.y);
    this.requestRender();
  }
  parseSgrMouseEvent(data) {
    const match = /^\x1b\[<(\d+);(\d+);(\d+)([Mm])$/.exec(data);
    if (!match)
      return void 0;
    return {
      button: Number.parseInt(match[1], 10),
      x: Number.parseInt(match[2], 10) - 1,
      y: Number.parseInt(match[3], 10) - 1,
      release: match[4] === "m"
    };
  }
  handleRightClickPaste(event) {
    if (!this.onRightClickPaste || process.platform !== "win32" || process.env.TERM_PROGRAM?.toLowerCase() === "vscode" || event.release || event.button !== 2) {
      return false;
    }
    try {
      this.onRightClickPaste();
    } catch {
    }
    return true;
  }
  handleScrollToEndIndicatorMouseEvent(event) {
    const rect = this.scrollToEndIndicatorRect;
    if (!rect || event.release || (event.button & 32) !== 0 || (event.button & 3) !== 0)
      return false;
    if (event.y !== rect.row || event.x < rect.column || event.x >= rect.column + rect.width)
      return false;
    this.scrollToBottom();
    return true;
  }
  getScrollbarTargetAt(x2, y2, includeHiddenAuto = false) {
    if (this.hasOverlay() || !this.currentLayout)
      return void 0;
    for (const scrollView of getScrollViewsAt(this.currentLayout, x2, y2)) {
      const box = getScrollViewBox(this.currentLayout, scrollView);
      const geometry = box ? getScrollbarGeometry(box, includeHiddenAuto) : void 0;
      if (geometry && x2 === geometry.column && y2 >= geometry.trackTop && y2 < geometry.trackTop + geometry.trackHeight) {
        return { scrollView, geometry };
      }
    }
    return void 0;
  }
  setScrollbarHover(scrollView) {
    if (scrollView === this.scrollbarHover)
      return;
    this.scrollbarHover?.setScrollbarActive(false);
    this.scrollbarHover = scrollView;
    this.scrollbarHover?.setScrollbarActive(true);
  }
  updateScrollbarHover(x2, y2) {
    this.setScrollbarHover(this.getScrollbarTargetAt(x2, y2, true)?.scrollView);
  }
  stopScrollbarHover() {
    this.setScrollbarHover(void 0);
  }
  scrollScrollbarToPointer(scrollView, geometry, pointerY, grabOffset) {
    const maxThumbOffset = geometry.trackHeight - geometry.thumbHeight;
    const thumbOffset = Math.max(0, Math.min(maxThumbOffset, pointerY - geometry.trackTop - grabOffset));
    const scrollTop = maxThumbOffset === 0 ? 0 : Math.round(thumbOffset / maxThumbOffset * geometry.maxScrollTop);
    scrollView.scrollTo(scrollTop);
  }
  handleScrollbarMouseEvent(event) {
    if (this.scrollbarDrag) {
      if (event.release) {
        this.stopScrollbarDrag();
        return true;
      }
      const box = this.currentLayout ? getScrollViewBox(this.currentLayout, this.scrollbarDrag.scrollView) : void 0;
      const geometry = box ? getScrollbarGeometry(box) : void 0;
      if (geometry) {
        this.scrollScrollbarToPointer(this.scrollbarDrag.scrollView, geometry, event.y, this.scrollbarDrag.grabOffset);
      }
      return true;
    }
    if (event.release || (event.button & 32) !== 0 || (event.button & 3) !== 0)
      return false;
    const target = this.getScrollbarTargetAt(event.x, event.y);
    if (!target)
      return false;
    this.stopSelectionAutoScroll();
    this.selectionPressActive = false;
    this.selectionAnchor = void 0;
    this.selectionFocus = void 0;
    this.selectionGranularity = "character";
    this.selectionInitialRange = void 0;
    this.lastClick = void 0;
    this.pressedUrl = void 0;
    this.selectionDragged = false;
    this.setScrollbarHover(target.scrollView);
    const onThumb = event.y >= target.geometry.thumbTop && event.y < target.geometry.thumbTop + target.geometry.thumbHeight;
    const grabOffset = onThumb ? event.y - target.geometry.thumbTop : Math.floor(target.geometry.thumbHeight / 2);
    if (!onThumb)
      this.scrollScrollbarToPointer(target.scrollView, target.geometry, event.y, grabOffset);
    this.scrollbarDrag = {
      scrollView: target.scrollView,
      grabOffset
    };
    return true;
  }
  stopScrollbarDrag() {
    this.scrollbarDrag = void 0;
  }
  getScrollSelectionPoint(scrollView, x2, y2) {
    if (!this.currentLayout)
      return void 0;
    const box = getScrollViewBox(this.currentLayout, scrollView);
    if (!box || box.rect.height <= 0 || box.clip.height <= 0)
      return void 0;
    const visibleTop = Math.max(0, box.rect.y, box.clip.y);
    const visibleBottom = Math.min(this.terminal.rows - 1, box.rect.y + box.rect.height - 1, box.clip.y + box.clip.height - 1);
    if (visibleBottom < visibleTop)
      return void 0;
    const pointerRow = Math.max(visibleTop, Math.min(visibleBottom, y2));
    const maxContentRow = Math.max(0, (box.scrollContentLines?.length ?? 1) - 1);
    return {
      row: Math.max(0, Math.min(maxContentRow, scrollView.scrollTop + pointerRow - box.rect.y)),
      col: Math.max(0, Math.min(box.rect.width - 1, x2 - box.rect.x)),
      scrollView
    };
  }
  getSelectionPoint(event, scrollView) {
    if (scrollView) {
      const point = this.getScrollSelectionPoint(scrollView, event.x, event.y);
      if (point)
        return point;
    }
    return {
      row: Math.max(0, Math.min(this.terminal.rows - 1, event.y)),
      col: Math.max(0, Math.min(this.terminal.columns - 1, event.x))
    };
  }
  getSelectionSourceLine(point) {
    if (point.scrollView && this.currentLayout) {
      const lines = getScrollViewBox(this.currentLayout, point.scrollView)?.scrollContentLines;
      if (lines)
        return lines[point.row] ?? "";
    }
    return this.previousScreen[point.row] ?? "";
  }
  getWordSelection(point) {
    const line = stripTerminalSequences(this.getSelectionSourceLine(point));
    const segments = [];
    let start = 0;
    for (const segment of wordSegmenter4.segment(line)) {
      const end = start + visibleWidth(segment.segment);
      const joiner = TERMINAL_WORD_SELECTION_JOINERS.has(segment.segment);
      segments.push({ start, end, selectable: segment.isWordLike === true || joiner, joiner });
      start = end;
    }
    const clickedSegmentIndex = segments.findIndex((segment) => point.col >= segment.start && point.col < segment.end);
    if (clickedSegmentIndex < 0)
      return void 0;
    const canJoin = (left, right) => left.selectable && right.selectable && (left.joiner || right.joiner);
    let selectionStart = segments[clickedSegmentIndex].start;
    let selectionEnd = segments[clickedSegmentIndex].end;
    for (let index = clickedSegmentIndex; index > 0 && canJoin(segments[index - 1], segments[index]); index--) {
      selectionStart = segments[index - 1].start;
    }
    for (let index = clickedSegmentIndex; index < segments.length - 1 && canJoin(segments[index], segments[index + 1]); index++) {
      selectionEnd = segments[index + 1].end;
    }
    return {
      start: { ...point, col: selectionStart },
      end: { ...point, col: selectionEnd, boundary: true }
    };
  }
  getLineSelection(point) {
    return {
      start: { ...point, col: 0 },
      end: { ...point, col: visibleWidth(this.getSelectionSourceLine(point)), boundary: true }
    };
  }
  updateSelectionFocus(point) {
    if (this.selectionGranularity === "character" || !this.selectionInitialRange) {
      this.selectionFocus = point;
      return;
    }
    const range = this.selectionGranularity === "word" ? this.getWordSelection(point) : this.getLineSelection(point);
    if (!range)
      return;
    const initial = this.selectionInitialRange;
    const targetBeforeInitial = range.start.row < initial.start.row || range.start.row === initial.start.row && range.start.col < initial.start.col;
    if (targetBeforeInitial) {
      this.selectionAnchor = initial.end;
      this.selectionFocus = range.start;
    } else {
      this.selectionAnchor = initial.start;
      this.selectionFocus = range.end;
    }
  }
  getClickCount(point, word) {
    const now = Date.now();
    const previous = this.lastClick;
    const count = word && previous && now - previous.timestamp <= DOUBLE_CLICK_INTERVAL_MS && previous.row === point.row && previous.scrollView === point.scrollView && previous.wordStart === word.start.col && previous.wordEnd === word.end.col ? previous.count % 3 + 1 : 1;
    this.lastClick = word ? {
      timestamp: now,
      count,
      row: point.row,
      scrollView: point.scrollView,
      wordStart: word.start.col,
      wordEnd: word.end.col
    } : void 0;
    return count;
  }
  updateSelectionAutoScroll(event) {
    const scrollView = this.selectionAnchor?.scrollView;
    if (!scrollView || !this.currentLayout) {
      this.stopSelectionAutoScroll();
      return;
    }
    const box = getScrollViewBox(this.currentLayout, scrollView);
    if (!box || box.rect.height <= 0 || box.clip.height <= 0) {
      this.stopSelectionAutoScroll();
      return;
    }
    const visibleTop = Math.max(0, box.rect.y, box.clip.y);
    const visibleBottom = Math.min(this.terminal.rows - 1, box.rect.y + box.rect.height - 1, box.clip.y + box.clip.height - 1);
    this.selectionDragPointer = { x: event.x, y: event.y };
    this.selectionAutoScrollDirection = event.y <= visibleTop ? -1 : event.y >= visibleBottom ? 1 : 0;
    if (this.selectionAutoScrollDirection === 0) {
      this.stopSelectionAutoScroll();
      return;
    }
    if (this.selectionAutoScrollTimer)
      return;
    this.selectionAutoScrollTimer = setInterval(() => this.autoScrollSelection(), 50);
    this.selectionAutoScrollTimer.unref();
  }
  autoScrollSelection() {
    const scrollView = this.selectionAnchor?.scrollView;
    const pointer = this.selectionDragPointer;
    const direction = this.selectionAutoScrollDirection;
    if (!scrollView || !pointer || direction === 0) {
      this.stopSelectionAutoScroll();
      return;
    }
    const remaining = scrollView.scrollBy(direction);
    if (remaining === direction) {
      this.stopSelectionAutoScroll();
      return;
    }
    const point = this.getScrollSelectionPoint(scrollView, pointer.x, pointer.y);
    if (point)
      this.updateSelectionFocus(point);
    this.requestRender();
  }
  stopSelectionAutoScroll() {
    if (this.selectionAutoScrollTimer) {
      clearInterval(this.selectionAutoScrollTimer);
      this.selectionAutoScrollTimer = void 0;
    }
    this.selectionAutoScrollDirection = 0;
    this.selectionDragPointer = void 0;
  }
  handleSelectionMouseEvent(event) {
    const button = event.button & 3;
    if (button !== 0 && !(event.release && button === 3))
      return;
    const anchorScrollView = this.selectionAnchor?.scrollView;
    const point = this.getSelectionPoint(event, anchorScrollView);
    if (event.release) {
      if (!this.selectionPressActive)
        return;
      this.selectionPressActive = false;
      this.stopSelectionAutoScroll();
      if (!this.selectionAnchor)
        return;
      this.updateSelectionFocus(point);
      const isClick = !this.selectionDragged && this.selectionAnchor.scrollView === point.scrollView && this.selectionAnchor.row === point.row && this.selectionAnchor.col === point.col;
      const clickedUrl = isClick ? this.pressedUrl : void 0;
      this.pressedUrl = void 0;
      if (clickedUrl && this.openUrl) {
        this.selectionAnchor = void 0;
        this.selectionFocus = void 0;
        try {
          this.openUrl(clickedUrl);
        } catch {
        }
        this.requestRender();
        return;
      }
      if (isClick) {
        const clickEvent = this.createMouseEvent("click", event.button, event.x, event.y, {
          clickCount: this.lastClick?.count ?? 1
        });
        const overlay = this.dispatchMouseToOverlay(clickEvent);
        const result = overlay.result ?? (overlay.hit ? void 0 : this.dispatchMouseToLayout(clickEvent));
        if (result) {
          const render = this.applyMouseDispatchResult(clickEvent, result);
          this.clearTextSelection();
          if (render)
            this.requestRender();
          return;
        }
      }
      if (this.copyOnSelect)
        void this.copySelectionToClipboard();
      this.requestRender();
      return;
    }
    if ((event.button & 32) !== 0) {
      if (!this.selectionPressActive || !this.selectionAnchor)
        return;
      this.selectionDragged = true;
      this.lastClick = void 0;
      this.pressedUrl = void 0;
      this.updateSelectionFocus(point);
      this.updateSelectionAutoScroll(event);
      this.requestRender();
      return;
    }
    this.stopSelectionAutoScroll();
    this.selectionPressActive = true;
    const scrollView = !this.hasOverlay() && this.currentLayout ? getScrollViewsAt(this.currentLayout, event.x, event.y)[0] : void 0;
    const anchor = this.getSelectionPoint(event, scrollView);
    const word = this.getWordSelection(anchor);
    const clickCount = this.getClickCount(anchor, word);
    const range = clickCount === 2 ? word : clickCount === 3 ? this.getLineSelection(anchor) : void 0;
    this.selectionGranularity = range ? clickCount === 2 ? "word" : "line" : "character";
    this.selectionInitialRange = range;
    this.selectionAnchor = range?.start ?? anchor;
    this.selectionFocus = range?.end ?? anchor;
    this.selectionDragged = false;
    this.pressedUrl = range ? void 0 : getOsc8LinkAtColumn(this.previousScreen[Math.max(0, Math.min(this.terminal.rows - 1, event.y))] ?? "", Math.max(0, Math.min(this.terminal.columns - 1, event.x)));
    this.requestRender();
  }
  getSelectionBounds() {
    if (!this.selectionAnchor || !this.selectionFocus)
      return void 0;
    if (this.selectionAnchor.scrollView !== this.selectionFocus.scrollView)
      return void 0;
    const anchorBeforeFocus = this.selectionAnchor.row < this.selectionFocus.row || this.selectionAnchor.row === this.selectionFocus.row && this.selectionAnchor.col < this.selectionFocus.col;
    if (this.selectionAnchor.row === this.selectionFocus.row && this.selectionAnchor.col === this.selectionFocus.col) {
      return void 0;
    }
    return anchorBeforeFocus ? { start: this.selectionAnchor, end: this.selectionFocus } : { start: this.selectionFocus, end: this.selectionAnchor };
  }
  getSelectionColumns(line, row, selection, minColumn = 0, maxColumn = visibleWidth(line)) {
    const lineWidth = visibleWidth(line);
    let start = Math.max(0, minColumn);
    let end = Math.min(lineWidth, maxColumn);
    if (row === selection.start.row) {
      start = getGraphemeCellRange(line, selection.start.col)?.start ?? Math.min(selection.start.col, lineWidth);
    }
    if (row === selection.end.row) {
      end = selection.end.boundary ? Math.min(selection.end.col, lineWidth) : getGraphemeCellRange(line, selection.end.col)?.end ?? Math.min(selection.end.col + 1, lineWidth);
    }
    return { start: Math.max(minColumn, start), end: Math.min(maxColumn, end) };
  }
  getActiveSelectionText() {
    const selection = this.getSelectionBounds();
    if (!selection)
      return void 0;
    let sourceLines = this.previousScreen;
    if (selection.start.scrollView) {
      if (!this.currentLayout)
        return void 0;
      const box = getScrollViewBox(this.currentLayout, selection.start.scrollView);
      if (!box?.scrollContentLines)
        return void 0;
      sourceLines = box.scrollContentLines;
    }
    const lines = [];
    for (let row = selection.start.row; row <= selection.end.row; row++) {
      const line = sourceLines[row] ?? "";
      const columns = this.getSelectionColumns(line, row, selection);
      lines.push(stripTerminalSequences(sliceByColumn(line, columns.start, Math.max(0, columns.end - columns.start), true)).trimEnd());
    }
    const text = lines.join("\n");
    return text.length === 0 ? void 0 : text;
  }
  async copySelectionToClipboard() {
    const text = this.getActiveSelectionText();
    if (!text)
      return false;
    return this.copyTextToClipboard(text);
  }
  async copyTextToClipboard(text) {
    if (this.copySelection) {
      const result = await this.copySelection(text);
      const ok = result === true;
      this.flash(ok ? "Copied!" : typeof result === "string" ? result : "Copy failed", ok ? void 0 : COPY_ERROR_FLASH_DURATION_MS);
      return ok;
    }
    this.terminal.write(`\x1B]52;c;${Buffer.from(text).toString("base64")}\x07`);
    this.flash("Copied!");
    return true;
  }
  applySearchTextHighlight(text, current) {
    const style = current ? this.searchCurrentMatchStyle : this.searchMatchStyle;
    let result = "";
    let plainStart = 0;
    let index = 0;
    while (index < text.length) {
      const ansi = extractAnsiCode(text, index);
      if (!ansi) {
        index += 1;
        continue;
      }
      if (index > plainStart)
        result += style(text.slice(plainStart, index));
      result += ansi.code;
      index += ansi.length;
      plainStart = index;
    }
    if (plainStart < text.length)
      result += style(text.slice(plainStart));
    return result;
  }
  applySearchHighlights(screen, layout) {
    const search = this.activeSearch;
    if (!search || search.selectedIndex < 0 || search.matches.length === 0)
      return screen;
    const scrollView = layout.primaryScrollView ?? this.implicitScrollView;
    const box = getScrollViewBox(layout, scrollView);
    if (!box)
      return screen;
    const rangesByRow = /* @__PURE__ */ new Map();
    const scrollbarColumn = getScrollbarGeometry(box)?.column;
    const minRow = Math.max(0, box.rect.y, box.clip.y);
    const maxRow = Math.min(screen.length, box.rect.y + box.rect.height, box.clip.y + box.clip.height);
    const minColumn = Math.max(0, box.rect.x, box.clip.x);
    const maxColumn = Math.min(this.terminal.columns, box.rect.x + box.rect.width, box.clip.x + box.clip.width, scrollbarColumn ?? Number.POSITIVE_INFINITY);
    const minContentRow = scrollView.scrollTop + minRow - box.rect.y;
    const maxContentRow = scrollView.scrollTop + maxRow - box.rect.y - 1;
    let low = 0;
    let high = search.matches.length;
    while (low < high) {
      const middle = low + Math.floor((high - low) / 2);
      const match = search.matches[middle];
      const lastRow = match.segments[match.segments.length - 1]?.row ?? -1;
      if (lastRow < minContentRow)
        low = middle + 1;
      else
        high = middle;
    }
    for (let matchIndex = low; matchIndex < search.matches.length; matchIndex++) {
      const match = search.matches[matchIndex];
      if ((match.segments[0]?.row ?? 0) > maxContentRow)
        break;
      for (const segment of match.segments) {
        const row = box.rect.y + segment.row - scrollView.scrollTop;
        if (row < minRow || row >= maxRow)
          continue;
        const startCol = Math.max(minColumn, box.rect.x + segment.startCol);
        const endCol = Math.min(maxColumn, box.rect.x + segment.endCol);
        if (endCol <= startCol)
          continue;
        const ranges = rangesByRow.get(row) ?? [];
        ranges.push({ startCol, endCol, current: matchIndex === search.selectedIndex });
        rangesByRow.set(row, ranges);
      }
    }
    const result = [...screen];
    for (const [row, ranges] of rangesByRow) {
      let line = result[row] ?? "";
      if (isImageLine(line))
        continue;
      const lineWidth = visibleWidth(line);
      for (const range of ranges.sort((a, b2) => b2.startCol - a.startCol)) {
        const startCol = Math.min(range.startCol, lineWidth);
        const endCol = Math.min(range.endCol, lineWidth);
        if (endCol <= startCol)
          continue;
        const before = sliceByColumn(line, 0, startCol, true);
        const highlighted = sliceByColumn(line, startCol, endCol - startCol, true);
        const after = sliceByColumn(line, endCol, Math.max(0, lineWidth - endCol), true);
        line = `${before}${this.applySearchTextHighlight(highlighted, range.current)}${after}`;
      }
      result[row] = line;
    }
    return result;
  }
  applySelectionHighlight(text) {
    let result = "\x1B[7m";
    let index = 0;
    while (index < text.length) {
      const ansi = extractAnsiCode(text, index);
      if (!ansi) {
        result += text[index];
        index += 1;
        continue;
      }
      result += ansi.code;
      if (ansi.code.endsWith("m"))
        result += "\x1B[7m";
      index += ansi.length;
    }
    return `${result}\x1B[27m`;
  }
  applySelection(screen, layout = this.currentLayout) {
    const selection = this.getSelectionBounds();
    if (!selection)
      return screen;
    let screenSelection = selection;
    let minRow = 0;
    let maxRow = screen.length - 1;
    let minColumn = 0;
    let maxColumn = this.terminal.columns;
    if (selection.start.scrollView) {
      if (!layout)
        return screen;
      const box = getScrollViewBox(layout, selection.start.scrollView);
      if (!box)
        return screen;
      minRow = Math.max(0, box.rect.y, box.clip.y);
      maxRow = Math.min(screen.length - 1, box.rect.y + box.rect.height - 1, box.clip.y + box.clip.height - 1);
      minColumn = Math.max(0, box.rect.x, box.clip.x);
      maxColumn = Math.min(this.terminal.columns, box.rect.x + box.rect.width, box.clip.x + box.clip.width);
      screenSelection = {
        start: {
          ...selection.start,
          row: box.rect.y + selection.start.row - selection.start.scrollView.scrollTop,
          col: box.rect.x + selection.start.col
        },
        end: {
          ...selection.end,
          row: box.rect.y + selection.end.row - selection.start.scrollView.scrollTop,
          col: box.rect.x + selection.end.col
        }
      };
    }
    return screen.map((line, row) => {
      if (row < minRow || row > maxRow || row < screenSelection.start.row || row > screenSelection.end.row || isImageLine(line)) {
        return line;
      }
      const lineWidth = visibleWidth(line);
      const columns = this.getSelectionColumns(line, row, screenSelection, minColumn, maxColumn);
      if (columns.end <= columns.start)
        return line;
      const before = sliceByColumn(line, 0, columns.start, true);
      const selected = sliceByColumn(line, columns.start, columns.end - columns.start, true);
      const after = sliceByColumn(line, columns.end, Math.max(0, lineWidth - columns.end), true);
      return `${before}${this.applySelectionHighlight(selected)}${after}`;
    });
  }
  isMouseSequence(data) {
    return /^\x1b\[<\d+;\d+;\d+[Mm]$/.test(data) || data.length === 6 && data.startsWith("\x1B[M");
  }
  compositeScrollToEndIndicator(screen, layout, width) {
    this.scrollToEndIndicatorRect = void 0;
    const scrollView = layout.primaryScrollView ?? this.implicitScrollView;
    if (!this.scrollToEndIndicator || !scrollView.followEnd || scrollView.isFollowingEnd)
      return screen;
    const box = getScrollViewBox(layout, scrollView);
    const clip = box?.clip;
    if (!clip || clip.width <= 0 || clip.height <= 0)
      return screen;
    const row = clip.y + clip.height - 1;
    if (row >= screen.length || isImageLine(screen[row] ?? ""))
      return screen;
    const scrollbarColumn = box ? getScrollbarGeometry(box)?.column : void 0;
    const label = truncateToWidth(this.scrollToEndIndicator(), clip.width, "");
    const labelWidth = visibleWidth(label);
    const column = clip.x + Math.floor((clip.width - labelWidth) / 2);
    const rightEdge = scrollbarColumn ?? clip.x + clip.width;
    const availableWidth = Math.max(0, rightEdge - column);
    const text = truncateToWidth(label, availableWidth, "");
    const textWidth = visibleWidth(text);
    if (textWidth === 0)
      return screen;
    const result = [...screen];
    result[row] = compositeTuiLine(result[row] ?? "", text, column, textWidth, width);
    this.scrollToEndIndicatorRect = { row, column, width: textWidth };
    return result;
  }
  compositeFlashes(screen, width, height) {
    const flashLines = this.flashes.render(width).slice(-height);
    if (flashLines.length === 0)
      return screen;
    const result = [...screen];
    while (result.length < height)
      result.push("");
    for (let row = 0; row < flashLines.length; row++) {
      const line = flashLines[row];
      const flashWidth = visibleWidth(line);
      if (flashWidth === 0)
        continue;
      result[row] = compositeTuiLine(result[row] ?? "", line, width - flashWidth, flashWidth, width);
    }
    return result;
  }
  doRender() {
    if (this.stopped || !this.altScreenActive)
      return;
    const width = Math.max(1, this.terminal.columns);
    const height = Math.max(1, this.terminal.rows);
    const root = this.layoutRoot ?? this.implicitScrollView;
    let nextLayout = renderLayoutFrame(root, width, height, () => this.requestRender());
    if (this.refreshSearch(nextLayout)) {
      nextLayout = renderLayoutFrame(root, width, height, () => this.requestRender());
    }
    let screen = nextLayout.lines.map((line) => line.replace(OSC133_ZONE_PREFIX2, ""));
    screen = this.applySearchHighlights(screen, nextLayout);
    screen = this.compositeScrollToEndIndicator(screen, nextLayout, width);
    screen = this.compositeOverlays(screen, width, height);
    if (screen.length > height)
      screen = screen.slice(screen.length - height);
    screen = this.applySelection(screen, nextLayout);
    screen = this.compositeFlashes(screen, width, height);
    const cursorPos = this.extractCursorPosition(screen, height);
    screen = this.applyLineResets(screen).map((line) => {
      if (isImageLine(line) || visibleWidth(line) <= width)
        return line;
      return sliceByColumn(line, 0, width, true);
    });
    const fullRedraw = this.previousScreen.length === 0 || this.previousScreenWidth !== width || this.previousScreenHeight !== height;
    const imagesNeedRedraw = screen.some((line, row) => line !== this.previousScreen[row] && (isImageLine(line) || isImageLine(this.previousScreen[row] ?? "")));
    const redrawImages = fullRedraw || imagesNeedRedraw;
    const hadUploadedKittyImages = this.uploadedKittyImages.size > 0;
    const preparedKittyScreen = redrawImages && this.imageProtocol === "kitty" ? this.prepareKittyScreen(screen) : { lines: screen, evictedImageDeletion: "" };
    let buffer = BEGIN_SYNCHRONIZED_OUTPUT;
    if (fullRedraw) {
      this.fullRedrawCount += 1;
      const clearImages = this.imageProtocol === "kitty" && hadUploadedKittyImages ? deleteAllKittyPlacements() : this.deleteKittyImages();
      buffer += `${clearImages}\x1B[2J`;
    } else if (imagesNeedRedraw) {
      if (this.imageProtocol === "iterm2")
        buffer += "\x1B[2J";
      else if (this.imageProtocol === "kitty")
        buffer += deleteAllKittyPlacements();
    }
    buffer += preparedKittyScreen.evictedImageDeletion;
    const clearRowsBeforeKittyImages = redrawImages && this.imageProtocol === "kitty" && screen.some(isImageLine) && (Boolean(process.env.WEZTERM_PANE) || process.env.TERM_PROGRAM?.toLowerCase() === "wezterm");
    if (clearRowsBeforeKittyImages) {
      for (let row = 0; row < height; row++) {
        if (!fullRedraw && !imagesNeedRedraw && screen[row] === this.previousScreen[row])
          continue;
        buffer += `\x1B[${row + 1};1H\x1B[2K`;
      }
    }
    for (let row = 0; row < height; row++) {
      if (!fullRedraw && !imagesNeedRedraw && screen[row] === this.previousScreen[row])
        continue;
      buffer += `\x1B[${row + 1};1H${clearRowsBeforeKittyImages ? "" : "\x1B[2K"}${preparedKittyScreen.lines[row] ?? ""}`;
    }
    if (cursorPos) {
      buffer += `\x1B[${cursorPos.row + 1};${Math.min(width, cursorPos.col) + 1}H`;
      buffer += this.getShowHardwareCursor() ? "\x1B[?25h" : "\x1B[?25l";
    } else {
      buffer += "\x1B[?25l";
    }
    buffer += END_SYNCHRONIZED_OUTPUT;
    this.terminal.write(buffer);
    this.previousScreen = screen;
    this.previousScreenWidth = width;
    this.previousScreenHeight = height;
    this.currentLayout = nextLayout;
  }
};

// node_modules/@earendil-works/pi-tui/dist/tui-main-screen.js
var MAX_RENDER_WRITE_CHARS = 1024 * 1024;

// formats.ts
var import_yaml = __toESM(require_dist(), 1);
import { extname } from "node:path";
var formats = [
  {
    label: "Markdown",
    extensions: [".md", ".markdown"],
    presentation: "markdown",
    format: (source) => source
  },
  {
    label: "JSON",
    extensions: [".json"],
    presentation: "text",
    format: (source) => JSON.stringify(JSON.parse(source), null, 2)
  },
  {
    label: "YAML",
    extensions: [".yaml", ".yml"],
    presentation: "text",
    format: (source) => {
      const doc = import_yaml.default.parseDocument(source, { uniqueKeys: true });
      if (doc.errors.length) throw doc.errors[0];
      return source;
    }
  },
  {
    label: "Plain text",
    extensions: [".txt"],
    presentation: "text",
    format: (source) => source
  }
];
function getFormat(filePath) {
  const suffix = extname(filePath).toLowerCase();
  return formats.find((format) => format.extensions.includes(suffix)) ?? formats[formats.length - 1];
}

// picker.ts
import { readdir } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
async function listDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const items = entries.filter((entry) => entry.isDirectory() || entry.isFile()).map((entry) => ({
    name: entry.name,
    kind: entry.isDirectory() ? "directory" : "file",
    path: join(directory, entry.name)
  }));
  items.sort((a, b2) => {
    if (a.kind !== b2.kind) return a.kind === "directory" ? -1 : 1;
    return a.name.localeCompare(b2.name, void 0, { numeric: true, sensitivity: "base" });
  });
  if (dirname(directory) !== directory) items.unshift({ name: "..", kind: "parent", path: dirname(directory) });
  return items;
}
var PickerState = class {
  directory;
  entries = [];
  selected = 0;
  error;
  constructor(directory) {
    this.directory = resolve(directory);
  }
  async refresh(preferredName) {
    const previousName = preferredName ?? this.entries[this.selected]?.name;
    try {
      this.entries = await listDirectory(this.directory);
      this.error = void 0;
      this.selected = Math.max(0, this.entries.findIndex((entry) => entry.name === previousName));
    } catch (error) {
      this.entries = [];
      this.selected = 0;
      this.error = error instanceof Error ? error.message : String(error);
    }
  }
  move(delta) {
    this.selected = Math.max(0, Math.min(this.entries.length - 1, this.selected + delta));
  }
  /** Returns a selected file path; entering folders keeps the picker open. */
  async enter() {
    const entry = this.entries[this.selected];
    if (!entry) return void 0;
    if (entry.kind === "file") return entry.path;
    const previous = this.directory;
    this.directory = entry.path;
    await this.refresh(entry.kind === "parent" ? basename(previous) : void 0);
    if (this.error) {
      this.directory = previous;
      await this.refresh(entry.name);
    }
    return void 0;
  }
  async up() {
    if (dirname(this.directory) === this.directory) return;
    const previous = this.directory;
    this.directory = dirname(previous);
    await this.refresh(basename(previous));
    if (this.error) {
      this.directory = previous;
      await this.refresh();
    }
  }
};
function safe(text) {
  return text.replace(/[\x00-\x1f\x7f-\x9f]/g, "\uFFFD");
}
var FilePicker = class {
  offset = 0;
  tui;
  theme;
  state;
  done;
  busy = false;
  constructor(tui, theme, state, done) {
    this.tui = tui;
    this.theme = theme;
    this.state = state;
    this.done = done;
  }
  invalidate() {
  }
  handleInput(key) {
    if (matchesKey(key, "escape") || matchesKey(key, "q")) return this.done(void 0);
    if (this.busy) return;
    const page = Math.max(1, Math.min(22, Math.floor(this.tui.terminal.rows * 0.9) - 5));
    if (matchesKey(key, "up") || matchesKey(key, "k")) this.state.move(-1);
    else if (matchesKey(key, "down") || matchesKey(key, "j")) this.state.move(1);
    else if (matchesKey(key, "pageUp")) this.state.move(-page);
    else if (matchesKey(key, "pageDown")) this.state.move(page);
    else if (matchesKey(key, "home")) this.state.selected = 0;
    else if (matchesKey(key, "end")) this.state.selected = Math.max(0, this.state.entries.length - 1);
    else if (matchesKey(key, "backspace") || matchesKey(key, "left")) this.navigate(() => this.state.up());
    else if (matchesKey(key, "enter") || matchesKey(key, "right")) {
      this.navigate(async () => {
        const path = await this.state.enter();
        if (path) this.done(path);
      });
    }
    this.tui.requestRender();
  }
  navigate(action) {
    this.busy = true;
    void action().catch((error) => {
      this.state.error = error instanceof Error ? error.message : String(error);
    }).finally(() => {
      this.busy = false;
      this.offset = 0;
      this.tui.requestRender();
    });
  }
  render(width) {
    const w = Math.max(4, width);
    const inner = Math.max(0, w - 4);
    const page = Math.max(1, Math.min(22, Math.floor(this.tui.terminal.rows * 0.9) - 5));
    const total = this.state.entries.length;
    this.offset = Math.max(0, Math.min(this.offset, Math.max(0, total - page)));
    if (this.state.selected < this.offset) this.offset = this.state.selected;
    if (this.state.selected >= this.offset + page) this.offset = this.state.selected - page + 1;
    const row = (value) => {
      const text = truncateToWidth(value, inner);
      return this.theme.fg("border", "\u2502") + " " + text + " ".repeat(Math.max(0, w - 3 - visibleWidth(text))) + this.theme.fg("border", "\u2502");
    };
    const result = [
      this.theme.fg("border", `\u256D${"\u2500".repeat(w - 2)}\u256E`),
      row(this.theme.fg("accent", safe(this.state.directory)))
    ];
    if (this.state.error) result.push(row(this.theme.fg("error", safe(this.state.error))));
    if (!total) result.push(row(this.theme.fg("dim", this.state.error ? "Cannot list directory" : "No files in this directory")));
    for (let i = this.offset; i < Math.min(total, this.offset + page); i++) {
      const entry = this.state.entries[i];
      const text = `${i === this.state.selected ? "\u276F" : " "} ${safe(entry.name)}${entry.kind === "directory" ? "/" : ""}`;
      result.push(row(i === this.state.selected ? this.theme.fg("accent", text) : text));
    }
    result.push(row(this.theme.fg("dim", `\u2191\u2193 select  Enter open  \u2190 parent  Esc close  ${total ? `${this.state.selected + 1}/${total}` : ""}`)));
    result.push(this.theme.fg("border", `\u2570${"\u2500".repeat(w - 2)}\u256F`));
    return result;
  }
};

// index.ts
var MAX_BYTES = 2 * 1024 * 1024;
function markdownTheme(theme) {
  return {
    heading: (text) => theme.fg("mdHeading", text),
    link: (text) => theme.fg("mdLink", text),
    linkUrl: (text) => theme.fg("mdLinkUrl", text),
    code: (text) => theme.fg("mdCode", text),
    codeBlock: (text) => theme.fg("mdCodeBlock", text),
    codeBlockBorder: (text) => theme.fg("mdCodeBlockBorder", text),
    quote: (text) => theme.fg("mdQuote", text),
    quoteBorder: (text) => theme.fg("mdQuoteBorder", text),
    hr: (text) => theme.fg("mdHr", text),
    listBullet: (text) => theme.fg("mdListBullet", text),
    bold: (text) => theme.bold(text),
    italic: (text) => theme.italic(text),
    underline: (text) => theme.underline(text),
    strikethrough: (text) => theme.strikethrough(text)
  };
}
async function loadFile(path) {
  const file = await open(path, "r");
  try {
    const stats = await file.stat();
    if (!stats.isFile()) throw new Error("Not a regular file");
    if (stats.size > MAX_BYTES) throw new Error("File exceeds the 2 MiB viewer limit");
    const buffer = Buffer.alloc(MAX_BYTES + 1);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await file.read(buffer, length, buffer.length - length, length);
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > MAX_BYTES) throw new Error("File exceeds the 2 MiB viewer limit");
    if (buffer.subarray(0, length).includes(0)) throw new Error("Binary files cannot be viewed");
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer.subarray(0, length));
  } finally {
    await file.close();
  }
}
function resolveArgument(argument, cwd) {
  let path = argument.trim();
  if (path.length >= 2 && (path[0] === '"' && path.at(-1) === '"' || path[0] === "'" && path.at(-1) === "'")) {
    path = path.slice(1, -1);
  }
  if (!path) throw new Error("Usage: /view <file-path>");
  return isAbsolute(path) ? path : resolve2(cwd, path);
}
var FileViewer = class {
  offset = 0;
  markdown;
  height;
  tui;
  theme;
  title;
  content;
  close;
  cachedWidth = 0;
  cachedBody;
  constructor(tui, theme, title, content, format, close) {
    this.tui = tui;
    this.theme = theme;
    this.title = title;
    this.content = content;
    this.close = close;
    this.height = 32;
    if (format.presentation === "markdown") this.markdown = new Markdown(content, 0, 0, markdownTheme(theme));
  }
  invalidate() {
    this.markdown?.invalidate();
    this.cachedBody = void 0;
  }
  handleInput(data) {
    if (matchesKey(data, "escape") || matchesKey(data, "q")) return this.close();
    if (matchesKey(data, "up") || matchesKey(data, "k")) this.offset -= 1;
    else if (matchesKey(data, "down") || matchesKey(data, "j")) this.offset += 1;
    else if (matchesKey(data, "pageUp")) this.offset -= Math.min(this.height, Math.max(1, this.tui.terminal.rows - 8));
    else if (matchesKey(data, "pageDown")) this.offset += Math.min(this.height, Math.max(1, this.tui.terminal.rows - 8));
    else if (matchesKey(data, "home")) this.offset = 0;
    else if (matchesKey(data, "end")) this.offset = Number.MAX_SAFE_INTEGER;
    this.tui.requestRender();
  }
  render(width) {
    const w = Math.max(4, width);
    const inner = Math.max(1, w - 4);
    if (!this.cachedBody || this.cachedWidth !== inner) {
      this.cachedWidth = inner;
      this.cachedBody = this.markdown ? this.markdown.render(inner) : this.content.split("\n").flatMap((line) => wrapTextWithAnsi(line.replaceAll("	", "    "), inner));
    }
    const body = this.cachedBody;
    const total = Math.max(1, body.length);
    const viewport = Math.min(this.height, total, Math.max(1, Math.floor(this.tui.terminal.rows * 0.9) - 4));
    this.offset = Math.max(0, Math.min(this.offset, total - viewport));
    const top = this.theme.fg("border", `\u256D${"\u2500".repeat(Math.max(0, w - 2))}\u256E`);
    const bottom = this.theme.fg("border", `\u2570${"\u2500".repeat(Math.max(0, w - 2))}\u256F`);
    const row = (value) => {
      const visible = truncateToWidth(value, Math.max(0, w - 4));
      return this.theme.fg("border", "\u2502") + " " + visible + " ".repeat(Math.max(0, w - 3 - visibleWidth(visible))) + this.theme.fg("border", "\u2502");
    };
    const result = [top, row(this.theme.fg("accent", truncateToWidth(this.title, inner)))];
    for (let i = 0; i < viewport; i++) result.push(row(body[this.offset + i] ?? ""));
    result.push(row(this.theme.fg("dim", `${this.offset + 1}\u2013${this.offset + viewport}/${total}  \u2191\u2193 PgUp/PgDn Home/End  Esc/q close`)));
    result.push(bottom);
    return result;
  }
};
function index_default(pi) {
  pi.registerCommand("view", {
    description: "Pick a file to inspect: /view [file-path]",
    handler: async (args, ctx) => {
      if (ctx.mode !== "tui") {
        ctx.ui.notify("/view requires interactive terminal mode", "warning");
        return;
      }
      const overlayOptions = { overlay: true, overlayOptions: { anchor: "center", width: "85%", maxHeight: "90%" } };
      const showFile = async (path) => {
        const format = getFormat(path);
        const content = format.format(await loadFile(path)).replace(/\r\n/g, "\n").replace(/[\x00-\x08\x0b\x0c\x0d\x0e-\x1f\x7f-\x9f]/g, "\uFFFD");
        const safeTitle = `${path.replace(/[\x00-\x1f\x7f-\x9f]/g, "\uFFFD")}  [${format.label}, read-only]`;
        await ctx.ui.custom(
          (tui, theme, _keys, done) => new FileViewer(tui, theme, safeTitle, content, format, () => done()),
          overlayOptions
        );
      };
      if (args.trim()) {
        try {
          await showFile(resolveArgument(args, ctx.cwd));
        } catch (error) {
          ctx.ui.notify(`Cannot view file: ${error instanceof Error ? error.message : String(error)}`, "error");
        }
        return;
      }
      const picker = new PickerState(ctx.cwd);
      await picker.refresh();
      while (true) {
        const path = await ctx.ui.custom(
          (tui, theme, _keys, done) => new FilePicker(tui, theme, picker, done),
          overlayOptions
        );
        if (!path) break;
        try {
          await showFile(path);
        } catch (error) {
          ctx.ui.notify(`Cannot view file: ${error instanceof Error ? error.message : String(error)}`, "error");
        }
        await picker.refresh();
      }
    }
  });
}
export {
  index_default as default,
  loadFile,
  resolveArgument
};
