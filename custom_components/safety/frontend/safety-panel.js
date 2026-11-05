const P = globalThis, N = P.ShadowRoot && (P.ShadyCSS === void 0 || P.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, L = /* @__PURE__ */ Symbol(), I = /* @__PURE__ */ new WeakMap();
let tt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== L) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (N && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = I.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && I.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const rt = (o) => new tt(typeof o == "string" ? o : o + "", void 0, L), A = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, s, a) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[a + 1], o[0]);
  return new tt(e, o, L);
}, nt = (o, t) => {
  if (N) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = P.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, o.appendChild(i);
  }
}, K = N ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return rt(e);
})(o) : o;
const { is: ct, defineProperty: lt, getOwnPropertyDescriptor: dt, getOwnPropertyNames: ht, getOwnPropertySymbols: pt, getPrototypeOf: ut } = Object, U = globalThis, Z = U.trustedTypes, yt = Z ? Z.emptyScript : "", mt = U.reactiveElementPolyfillSupport, S = (o, t) => o, M = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? yt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, et = (o, t) => !ct(o, t), G = { attribute: !0, type: String, converter: M, reflect: !1, useDefault: !1, hasChanged: et };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), U.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let _ = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = G) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && lt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: a } = dt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: s, set(r) {
      const n = s?.call(this);
      a?.call(this, r), this.requestUpdate(t, n, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? G;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const t = ut(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const e = this.properties, i = [...ht(e), ...pt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(K(s));
    } else t !== void 0 && e.push(K(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return nt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : M).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), r = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : M;
      this._$Em = s;
      const n = r.fromAttribute(e, a.type);
      this[s] = n ?? this._$Ej?.get(s) ?? n, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, a) {
    if (t !== void 0) {
      const r = this.constructor;
      if (s === !1 && (a = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? et)(a, e) || i.useDefault && i.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: a }, r) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), a !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, a] of this._$Ep) this[s] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, a] of i) {
        const { wrapped: r } = a, n = this[s];
        r !== !0 || this._$AL.has(s) || n === void 0 || this.C(s, void 0, a, n);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[S("elementProperties")] = /* @__PURE__ */ new Map(), _[S("finalized")] = /* @__PURE__ */ new Map(), mt?.({ ReactiveElement: _ }), (U.reactiveElementVersions ??= []).push("2.1.2");
const D = globalThis, V = (o) => o, O = D.trustedTypes, q = O ? O.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, it = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, st = "?" + v, gt = `<${st}>`, $ = document, E = () => $.createComment(""), z = (o) => o === null || typeof o != "object" && typeof o != "function", B = Array.isArray, vt = (o) => B(o) || typeof o?.[Symbol.iterator] == "function", R = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, J = /-->/g, Y = />/g, f = RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), F = /'/g, Q = /"/g, at = /^(?:script|style|textarea|title)$/i, ft = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), h = ft(1), x = /* @__PURE__ */ Symbol.for("lit-noChange"), u = /* @__PURE__ */ Symbol.for("lit-nothing"), X = /* @__PURE__ */ new WeakMap(), b = $.createTreeWalker($, 129);
function ot(o, t) {
  if (!B(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return q !== void 0 ? q.createHTML(t) : t;
}
const bt = (o, t) => {
  const e = o.length - 1, i = [];
  let s, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = k;
  for (let n = 0; n < e; n++) {
    const c = o[n];
    let d, p, l = -1, m = 0;
    for (; m < c.length && (r.lastIndex = m, p = r.exec(c), p !== null); ) m = r.lastIndex, r === k ? p[1] === "!--" ? r = J : p[1] !== void 0 ? r = Y : p[2] !== void 0 ? (at.test(p[2]) && (s = RegExp("</" + p[2], "g")), r = f) : p[3] !== void 0 && (r = f) : r === f ? p[0] === ">" ? (r = s ?? k, l = -1) : p[1] === void 0 ? l = -2 : (l = r.lastIndex - p[2].length, d = p[1], r = p[3] === void 0 ? f : p[3] === '"' ? Q : F) : r === Q || r === F ? r = f : r === J || r === Y ? r = k : (r = f, s = void 0);
    const g = r === f && o[n + 1].startsWith("/>") ? " " : "";
    a += r === k ? c + gt : l >= 0 ? (i.push(d), c.slice(0, l) + it + c.slice(l) + v + g) : c + v + (l === -2 ? n : g);
  }
  return [ot(o, a + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class T {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let a = 0, r = 0;
    const n = t.length - 1, c = this.parts, [d, p] = bt(t, e);
    if (this.el = T.createElement(d, i), b.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = b.nextNode()) !== null && c.length < n; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(it)) {
          const m = p[r++], g = s.getAttribute(l).split(v), j = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: a, name: j[2], strings: g, ctor: j[1] === "." ? _t : j[1] === "?" ? xt : j[1] === "@" ? wt : H }), s.removeAttribute(l);
        } else l.startsWith(v) && (c.push({ type: 6, index: a }), s.removeAttribute(l));
        if (at.test(s.tagName)) {
          const l = s.textContent.split(v), m = l.length - 1;
          if (m > 0) {
            s.textContent = O ? O.emptyScript : "";
            for (let g = 0; g < m; g++) s.append(l[g], E()), b.nextNode(), c.push({ type: 2, index: ++a });
            s.append(l[m], E());
          }
        }
      } else if (s.nodeType === 8) if (s.data === st) c.push({ type: 2, index: a });
      else {
        let l = -1;
        for (; (l = s.data.indexOf(v, l + 1)) !== -1; ) c.push({ type: 7, index: a }), l += v.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = $.createElement("template");
    return i.innerHTML = t, i;
  }
}
function w(o, t, e = o, i) {
  if (t === x) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const a = z(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(o), s._$AT(o, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = w(o, s._$AS(o, t.values), s, i)), t;
}
class $t {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? $).importNode(e, !0);
    b.currentNode = s;
    let a = b.nextNode(), r = 0, n = 0, c = i[0];
    for (; c !== void 0; ) {
      if (r === c.index) {
        let d;
        c.type === 2 ? d = new C(a, a.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(a, c.name, c.strings, this, t) : c.type === 6 && (d = new At(a, this, t)), this._$AV.push(d), c = i[++n];
      }
      r !== c?.index && (a = b.nextNode(), r++);
    }
    return b.currentNode = $, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class C {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = w(this, t, e), z(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : vt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && z(this._$AH) ? this._$AA.nextSibling.data = t : this.T($.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = T.createElement(ot(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const a = new $t(s, this), r = a.u(this.options);
      a.p(e), this.T(r), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = X.get(t.strings);
    return e === void 0 && X.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    B(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const a of t) s === e.length ? e.push(i = new C(this.O(E()), this.O(E()), this, this.options)) : i = e[s], i._$AI(a), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = V(t).nextSibling;
      V(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, a) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, s) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) t = w(this, t, e, 0), r = !z(t) || t !== this._$AH && t !== x, r && (this._$AH = t);
    else {
      const n = t;
      let c, d;
      for (t = a[0], c = 0; c < a.length - 1; c++) d = w(this, n[i + c], e, c), d === x && (d = this._$AH[c]), r ||= !z(d) || d !== this._$AH[c], d === u ? t = u : t !== u && (t += (d ?? "") + a[c + 1]), this._$AH[c] = d;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class _t extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class xt extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class wt extends H {
  constructor(t, e, i, s, a) {
    super(t, e, i, s, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? u) === x) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class At {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
}
const kt = D.litHtmlPolyfillSupport;
kt?.(T, C), (D.litHtmlVersions ??= []).push("3.3.2");
const St = (o, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = e?.renderBefore ?? null;
    i._$litPart$ = s = new C(t.insertBefore(E(), a), a, void 0, e ?? {});
  }
  return s._$AI(o), s;
};
const W = globalThis;
class y extends _ {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = St(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
}
y._$litElement$ = !0, y.finalized = !0, W.litElementHydrateSupport?.({ LitElement: y });
const Et = W.litElementPolyfillSupport;
Et?.({ LitElement: y });
(W.litElementVersions ??= []).push("4.2.2");
class zt extends y {
  static properties = { hass: { type: Object } };
  static styles = A`
    :host { display: block; padding: 20px; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .tile { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 160px; text-align: center; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--card-background-color); }
    .tile ha-icon { --mdc-icon-size: 40px; color: var(--primary-color); margin-bottom: 8px; }
    .tile-value { font-size: 24px; font-weight: bold; }
    .tile-label { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; margin-top: 4px; }
    .status-ok { color: var(--success-color, #4caf50); }
    .status-error { color: var(--error-color, #f44336); }
    ha-card { border-radius: 12px; margin-top: 20px; }
    .card-content { padding: 16px; }
    .danger-btn { --mdc-theme-primary: var(--error-color); }
  `;
  _getEntity(t, e) {
    return this.hass ? Object.keys(this.hass.states).find((i) => i.startsWith(`${t}.`) && e.some((s) => i.toLowerCase().includes(s))) : null;
  }
  render() {
    const t = this._getEntity("sensor", ["safety", "status"]), e = t ? this.hass.states[t] : null, i = e?.attributes?.active_hazards ? Object.keys(e.attributes.active_hazards).length : 0;
    return h`
      <div class="summary-grid">
        <div class="tile"><ha-icon icon="mdi:shield-check-outline"></ha-icon><div class="tile-value ${i > 0 ? "status-error" : "status-ok"}">${100 - i * 25}%</div><div class="tile-label">Safety Score</div></div>
        <div class="tile"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><div class="tile-value ${i > 0 ? "status-error" : ""}">${i}</div><div class="tile-label">Aktywne Zagrożenia</div></div>
        <div class="tile"><ha-icon icon="mdi:pulse"></ha-icon><div class="tile-value">${e ? this.hass.formatEntityState(e) : "Bezpiecznie"}</div><div class="tile-label">Status Systemu</div></div>
        <div class="tile"><ha-icon icon="mdi:finance"></ha-icon><div class="tile-value status-ok">Stabilny</div><div class="tile-label">Analiza Ryzyka</div></div>
      </div>
      <ha-card header="Zarządzanie Kryzysowe">
        <div class="card-content">
          <ha-button raised class="danger-btn" style="width: 100%" @click=${() => this.hass.callService("button", "press", { entity_id: this._getEntity("button", ["other", "test_action"]) })}>🚨 ODWOŁAJ WSZYSTKIE ALARMY</ha-button>
        </div>
      </ha-card>
    `;
  }
}
customElements.define("tab-summary", zt);
class Tt extends y {
  static properties = {
    hass: { type: Object },
    _currentSubTab: { type: String, state: !0 },
    _dialogState: { type: Object, state: !0 }
  };
  constructor() {
    super(), this._currentSubTab = "water", this._dialogState = null, this.hazardTypes = [
      { id: "water", name: "Woda", icon: "mdi:water" },
      { id: "smoke", name: "Pożar", icon: "mdi:fire" },
      { id: "gas", name: "Gazy", icon: "mdi:gas-cylinder" },
      { id: "temperature", name: "Temperatura", icon: "mdi:thermometer" }
    ], this.defaultMessages = {
      water: "Wykryto zalanie. System podejmuje akcje ratunkowe!",
      smoke: "Wykryto dym! Opuść zagrożony obszar.",
      gas: "Wykryto ulatniający się gaz lub czad!",
      temperature: "Krytyczna temperatura w budynku!"
    };
  }
  static styles = A`
    :host { display: block; padding: 20px; }
    
    .top-bar { display: flex; align-items: center; justify-content: space-between; background-color: var(--secondary-background-color); border-bottom: 1px solid var(--divider-color); margin: -20px -20px 20px -20px; padding: 0 10px; }
    .sub-tabs { display: flex; gap: 8px; }
    .sub-tab { padding: 10px 16px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; color: var(--secondary-text-color); border-radius: 20px 20px 0 0; margin-top: 8px; transition: 0.2s; }
    .sub-tab.active { background-color: var(--primary-background-color); color: var(--primary-color); font-weight: bold; border: 1px solid var(--divider-color); border-bottom: none; }
    
    .auto-config-box { display: flex; align-items: center; gap: 12px; padding-right: 16px; }
    .auto-config-label { font-size: 13px; font-weight: 500; color: var(--primary-text-color); display: flex; align-items: center; gap: 6px; }

    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 100; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
    .modal-card { background: var(--card-background-color); padding: 24px; border-radius: 12px; max-width: 450px; width: 90%; box-shadow: 0 8px 24px rgba(0,0,0,0.3); border: 1px solid var(--divider-color); }
    .modal-title { font-size: 18px; font-weight: 500; margin-bottom: 12px; color: var(--primary-text-color); display: flex; align-items: center; gap: 8px; }
    .modal-text { font-size: 14px; color: var(--secondary-text-color); margin-bottom: 24px; line-height: 1.5; white-space: pre-wrap; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; }

    .danger-btn { --mdc-theme-primary: var(--error-color); }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
    
    .ha-automation-card { border: 1px solid var(--divider-color, #444); border-radius: 12px; margin-bottom: 16px; background: var(--card-background-color, #1c1c1c); overflow: hidden; }
    .ha-automation-header { padding: 16px; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 16px; color: var(--primary-text-color); }
    
    .ha-automation-body { padding: 0 16px 16px 16px; display: flex; flex-direction: column; gap: 12px; }
    
    .ha-automation-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .ha-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 16px; background: var(--secondary-background-color, rgba(120, 120, 120, 0.1)); font-size: 13px; border: 1px solid var(--divider-color, #444); color: var(--primary-text-color); transition: 0.2s; }
    .ha-chip ha-icon.chip-icon { --mdc-icon-size: 16px; color: var(--primary-color, #03a9f4); }
    .ha-chip span { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .chip-close { cursor: pointer; color: var(--secondary-text-color); margin-left: 4px; padding: 2px; border-radius: 50%; --mdc-icon-size: 16px; transition: 0.2s; }
    .chip-close:hover { color: var(--error-color); background: rgba(244, 67, 54, 0.1); }
    
    .ha-picker-container { margin-top: 4px; }
    .locked-text { font-size: 12px; color: var(--warning-color); display: flex; align-items: center; gap: 4px; padding: 8px 16px; background: rgba(255, 152, 0, 0.1); border-radius: 8px; margin-bottom: 8px; }
  `;
  _getEntity(t, e) {
    return this.hass ? Object.keys(this.hass.states).find((i) => i.startsWith(`${t}.`) && e.some((s) => i.toLowerCase().includes(s))) : null;
  }
  _getCatKeys(t) {
    return { water: ["woda"], smoke: ["pozar", "smoke"], gas: ["gaz"], temperature: ["temp"] }[t] || [t];
  }
  _saveConfig(t, e, i) {
    this.hass.callService("safety", "update_settings", { category: t, key: e, value: i });
  }
  _addEntity(t, e, i, s) {
    !i || s.includes(i) || this._saveConfig(t, e, [...s, i]);
  }
  _removeEntity(t, e, i, s) {
    this._saveConfig(t, e, s.filter((a) => a !== i));
  }
  _pressButton(t) {
    t && this.hass.states[t] ? this.hass.callService("button", "press", { entity_id: t }) : console.error("Nie znaleziono encji przycisku: ", t);
  }
  _handleAutoConfigToggle(t, e) {
    t.preventDefault(), t.target.checked = e;
    const i = this._getEntity("switch", ["auto_config", "autokonfiguracja", "auto"]), s = this._currentSubTab, a = this._getEntity("sensor", ["safety", "status"]), n = (a ? this.hass.states[a] : null)?.attributes?.category_config?.[s] || {};
    let c = "";
    if (e) {
      const d = (n.sensors || []).map((l) => this.hass.states[l]?.attributes?.friendly_name || l).join(`
• `) || "Brak", p = (n.actuators || []).map((l) => this.hass.states[l]?.attributes?.friendly_name || l).join(`
• `) || "Brak";
      c = `Czy na pewno chcesz wyłączyć Auto-Konfigurację?

Przejmujesz ręczną kontrolę nad systemem. Obecne ustawienia zostaną zachowane jako punkt wyjścia:

Czujniki:
• ${d}

Urządzenia:
• ${p}`;
    } else
      c = `Czy na pewno chcesz włączyć Auto-Konfigurację?

⚠️ UWAGA: Twoje ręczne ustawienia dla wszystkich kategorii zostaną skasowane i zastąpione automatycznymi parametrami wyliczonymi przez system!`;
    this._dialogState = {
      action: e ? "turn_off" : "turn_on",
      entityId: i,
      text: c,
      isTurningOn: !e
    };
  }
  _confirmDialog() {
    this._dialogState && (this._dialogState.entityId ? this.hass.callService("switch", this._dialogState.action, { entity_id: this._dialogState.entityId }) : this.hass.callService("safety", "update_settings", {
      category: "global",
      key: "auto_config",
      value: this._dialogState.isTurningOn
    }), this._dialogState = null);
  }
  _closeDialog() {
    this._dialogState = null;
  }
  _renderEntityList(t, e, i, s, a, r, n = !1) {
    const c = r || [];
    return h`
      <div class="ha-automation-card">
        <div class="ha-automation-header">
          <ha-icon icon=${s} style="color: var(--primary-text-color);"></ha-icon> ${i}
          ${n ? h`<ha-icon icon="mdi:shield-lock-outline" style="margin-left:auto; color:var(--warning-color);" title="Auto-konfiguracja aktywna"></ha-icon>` : ""}
        </div>
        
        <div class="ha-automation-body">
          ${n ? h`
            <div class="locked-text">
              <ha-icon icon="mdi:shield-lock-outline" style="--mdc-icon-size: 16px;"></ha-icon> 
              Tryb Auto: Zarządzane przez system.
            </div>
          ` : ""}

          ${c.length > 0 ? h`
            <div class="ha-automation-chips">
              ${c.map((d) => {
      const p = this.hass.states[d];
      return h`
                  <div class="ha-chip" title="${d}">
                    <ha-icon icon="${p?.attributes?.icon || "mdi:bookmark"}" class="chip-icon"></ha-icon>
                    <span>${p?.attributes?.friendly_name || d}</span>
                    ${n ? "" : h`<ha-icon icon="mdi:close" class="chip-close" @click=${() => this._removeEntity(t, e, d, c)}></ha-icon>`}
                  </div>
                `;
    })}
            </div>
          ` : ""}

          ${n ? "" : h`
            <div class="ha-picker-container">
              <ha-entity-picker 
                .hass=${this.hass} 
                .includeDomains=${a} 
                label="➕ Dodaj encję" 
                @value-changed=${(d) => {
      d.detail.value && (this._addEntity(t, e, d.detail.value, c), setTimeout(() => d.target.value = "", 50), this.requestUpdate());
    }}>
              </ha-entity-picker>
            </div>
          `}
        </div>
      </div>
    `;
  }
  render() {
    const t = this._currentSubTab;
    this._getCatKeys(t);
    const e = this._getEntity("sensor", ["safety", "status"]), i = e ? this.hass.states[e] : null, s = i?.attributes?.category_config?.[t] || {}, a = this._getEntity("switch", ["auto_config", "autokonfiguracja", "auto"]);
    let r = !1;
    return a && this.hass.states[a] ? r = this.hass.states[a].state === "on" : i && i.attributes && i.attributes.auto_config !== void 0 && (r = i.attributes.auto_config === !0), h`
      <div style="display: none;">
        <ha-selector .hass=${this.hass} .selector=${{ entity: { multiple: !1 } }}></ha-selector>
      </div>

      ${this._dialogState ? h`
        <div class="modal-overlay">
          <div class="modal-card">
            <div class="modal-title">
              <ha-icon icon="${this._dialogState.isTurningOn ? "mdi:shield-lock-outline" : "mdi:shield-lock-open-outline"}" style="color: var(--primary-color);"></ha-icon>
              ${this._dialogState.isTurningOn ? "Włącz Auto-Konfigurację" : "Wyłącz Auto-Konfigurację"}
            </div>
            <div class="modal-text">${this._dialogState.text}</div>
            <div class="modal-actions">
              <ha-button @click=${this._closeDialog}>Anuluj</ha-button>
              <ha-button raised class="${this._dialogState.isTurningOn ? "danger-btn" : ""}" @click=${this._confirmDialog}>
                ${this._dialogState.isTurningOn ? "Tak, nadpisz i włącz" : "Przejmij kontrolę"}
              </ha-button>
            </div>
          </div>
        </div>
      ` : ""}

      <div class="top-bar">
        <div class="sub-tabs">
          ${this.hazardTypes.map((n) => h`
            <div class="sub-tab ${this._currentSubTab === n.id ? "active" : ""}" @click="${() => this._currentSubTab = n.id}">
              <ha-icon icon="${n.icon}" style="--mdc-icon-size: 18px;"></ha-icon> ${n.name}
            </div>
          `)}
        </div>
        <div class="auto-config-box">
          <div class="auto-config-label">
            <ha-icon icon="${r ? "mdi:shield-lock-outline" : "mdi:shield-lock-open-outline"}" style="color: ${r ? "var(--primary-color)" : "var(--secondary-text-color)"};"></ha-icon>
            Auto-Konfiguracja
          </div>
          <ha-switch .checked=${r} @change=${(n) => this._handleAutoConfigToggle(n, r)}></ha-switch>
        </div>
      </div>

      ${this._renderEntityList(t, "sensors", "Czujniki", "mdi:radar", ["binary_sensor", "sensor"], s.sensors, r)}
      ${this._renderEntityList(t, "actuators", "Urządzenia", "mdi:cog", ["switch", "valve", "cover", "fan", "climate"], s.actuators, r)}
      
      <div class="ha-automation-card">
        <div class="ha-automation-header"><ha-icon icon="mdi:bell-badge-outline" style="color: var(--primary-text-color);"></ha-icon> Powiadomienia systemowe</div>
        <div class="ha-automation-body" style="padding-top: 0;">
          <div class="row">
            <div><div style="font-weight: 500;">Powiadomienia w HA</div><div style="font-size:12px; color:var(--secondary-text-color)">Persistent Notification w interfejsie</div></div>
            <ha-switch .checked=${s.notify_ha ?? !0} @change=${(n) => this._saveConfig(t, "notify_ha", n.target.checked)}></ha-switch>
          </div>
        </div>
      </div>

      ${this._renderEntityList(t, "notify_push", "Powiadomienia (Push)", "mdi:cellphone", ["notify"], s.notify_push, !1)}
      ${this._renderEntityList(t, "notify_tts", "Głośniki (TTS)", "mdi:speaker", ["media_player"], s.notify_tts, !1)}
      ${this._renderEntityList(t, "notify_sirens", "Syreny Alarmowe", "mdi:bullhorn", ["siren"], s.notify_sirens, !1)}
      ${this._renderEntityList(t, "notify_lights", "Światła Alarmowe", "mdi:lightbulb", ["light"], s.notify_lights, !1)}
      ${this._renderEntityList(t, "actions", "Automatyzacje i Skrypty", "mdi:play-circle", ["script", "scene", "automation"], s.actions, !1)}

      <div class="ha-automation-card">
        <div class="ha-automation-header"><ha-icon icon="mdi:flask" style="color: var(--primary-text-color);"></ha-icon> Zarządzanie i Testy</div>
        <div class="ha-automation-body" style="padding-top: 0;">
          <div style="font-weight: 500; margin-bottom: 8px;">Własna treść wiadomości</div>
          <div style="display:flex; gap:12px;">
            <input type="text" id="msg-${t}" .value="${s.custom_msg || ""}" placeholder="${this.defaultMessages[t]}" style="flex:1; padding:10px; border-radius:4px; border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color);">
            <ha-button outlined @click="${() => {
      const n = this.shadowRoot.getElementById(`msg-${t}`).value;
      this._saveConfig(t, "custom_msg", n);
    }}">Zapisz</ha-button>
          </div>
          <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 16px;">
            <ha-button outlined @click="${() => this._pressButton(this._getEntity("button", [t, "test_notify"]))}">Test Powiadomień</ha-button>
            <ha-button class="danger-btn" raised @click="${() => this._pressButton(this._getEntity("button", [t, "test_action"]))}">Pełen Test</ha-button>
            <ha-button outlined @click="${() => this._pressButton(this._getEntity("button", [t, "odwolaj"]))}">Odwołaj</ha-button>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define("tab-hazards", Tt);
class Ct extends y {
  static styles = A`
    :host { display: block; padding: 20px; }
    ha-card { border-radius: 12px; }
    .ai-row { display: flex; align-items: center; gap: 20px; padding: 16px; border-bottom: 1px solid var(--divider-color); }
    .ai-row:last-child { border-bottom: none; }
    .ai-icon { --mdc-icon-size: 32px; color: var(--primary-color); background: var(--secondary-background-color); padding: 10px; border-radius: 50%; }
  `;
  render() {
    return h`
      <ha-card header="Analiza AI Predictive Safety">
        <div class="ai-row"><ha-icon class="ai-icon" icon="mdi:brain"></ha-icon><div><div style="font-weight:bold">Predykcja Zagrożeń (24h)</div><div style="color:var(--secondary-text-color)">Ryzyko incydentu ocenione na niskie (1.2%).</div></div></div>
        <div class="ai-row"><ha-icon class="ai-icon" icon="mdi:chart-timeline-variant"></ha-icon><div><div style="font-weight:bold">Analiza Trendów</div><div style="color:var(--secondary-text-color)">Brak anomalii w odczytach sensorów.</div></div></div>
        <div class="ai-row"><ha-icon class="ai-icon" icon="mdi:lightbulb-auto"></ha-icon><div><div style="font-weight:bold">Rekomendacje</div><div style="color:var(--secondary-text-color)">Zalecany test okresowy zaworu głównego wody.</div></div></div>
      </ha-card>
    `;
  }
}
customElements.define("tab-ai", Ct);
class jt extends y {
  static styles = A`
    :host { display: block; padding: 20px; }
    ha-card { border-radius: 12px; }
    .card-content { padding: 16px; }
  `;
  render() {
    return h`
      <ha-card header="Status Systemu">
        <div class="card-content">
          <div style="background: var(--secondary-background-color); height: 400px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px dashed var(--divider-color);">
            <svg viewBox="0 0 400 200" width="100%">
              <rect x="50" y="20" width="300" height="150" fill="none" stroke="var(--primary-text-color)" stroke-width="2" opacity="0.3"/>
              <text x="150" y="100" fill="var(--secondary-text-color)">Rzut Domu (SVG)</text>
            </svg>
          </div>
        </div>
      </ha-card>
    `;
  }
}
customElements.define("tab-status", jt);
class Pt extends y {
  static properties = { hass: { type: Object } };
  static styles = A`
    :host { display: block; padding: 20px; }
    ha-card { border-radius: 12px; margin-bottom: 24px; }
    .card-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
    .row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--divider-color); }
    .row:last-child { border-bottom: none; padding-bottom: 0; }

    .ha-automation-card { border: 1px solid var(--divider-color, #444); border-radius: 12px; margin-bottom: 16px; background: var(--card-background-color, #1c1c1c); overflow: hidden; }
    .ha-automation-header { padding: 16px; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 16px; color: var(--primary-text-color); }
    .ha-automation-body { padding: 0 16px 16px 16px; display: flex; flex-direction: column; gap: 12px; }
    .ha-automation-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .ha-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 16px; background: var(--secondary-background-color, rgba(120, 120, 120, 0.1)); font-size: 13px; border: 1px solid var(--divider-color, #444); color: var(--primary-text-color); }
    .ha-chip ha-icon.chip-icon { --mdc-icon-size: 16px; color: var(--primary-color, #03a9f4); }
    .chip-close { cursor: pointer; color: var(--secondary-text-color); margin-left: 4px; --mdc-icon-size: 16px; }
    .ha-picker-container { margin-top: 4px; }
  `;
  _getEntity(t, e) {
    return this.hass ? Object.keys(this.hass.states).find((i) => {
      const s = i.startsWith(`${t}.`), a = e.some((r) => i.toLowerCase().includes(r.toLowerCase()));
      return s && a;
    }) : null;
  }
  _addEntity(t, e, i) {
    !e || i.includes(e) || this.hass.callService("safety", "update_settings", { category: "global", key: t, value: [...i, e] });
  }
  _removeEntity(t, e, i) {
    this.hass.callService("safety", "update_settings", { category: "global", key: t, value: i.filter((s) => s !== e) });
  }
  _renderSwitch(t, e, i, s) {
    if (!s || !this.hass.states[s]) return h``;
    const a = this.hass.states[s].state === "on";
    return h`
      <div class="row">
        <div style="display:flex; align-items:center; gap:12px;">
          <ha-icon icon="${t}" style="color: ${a ? "var(--primary-color)" : "var(--secondary-text-color)"}"></ha-icon>
          <div><div style="font-weight: 500;">${e}</div><div style="font-size:11px; color:var(--secondary-text-color)">${i}</div></div>
        </div>
        <ha-switch .checked=${a} @change=${() => this.hass.callService("switch", a ? "turn_off" : "turn_on", { entity_id: s })}></ha-switch>
      </div>
    `;
  }
  _renderEntityList(t, e, i, s, a) {
    const r = a || [];
    return h`
      <div class="ha-automation-card">
        <div class="ha-automation-header">
          <ha-icon icon=${i} style="color: var(--primary-text-color);"></ha-icon> ${e}
        </div>
        <div class="ha-automation-body">
          ${r.length > 0 ? h`
            <div class="ha-automation-chips">
              ${r.map((n) => {
      const c = this.hass.states[n];
      return h`
                  <div class="ha-chip">
                    <ha-icon icon="${c?.attributes?.icon || "mdi:bookmark"}" class="chip-icon"></ha-icon>
                    <span>${c?.attributes?.friendly_name || n}</span>
                    <ha-icon icon="mdi:close" class="chip-close" @click=${() => this._removeEntity(t, n, r)}></ha-icon>
                  </div>`;
    })}
            </div>` : ""}
          <div class="ha-picker-container">
            <ha-entity-picker .hass=${this.hass} .includeDomains=${s} label="➕ Dodaj encję" @value-changed=${(n) => {
      n.detail.value && (this._addEntity(t, n.detail.value, r), setTimeout(() => n.target.value = "", 50));
    }}></ha-entity-picker>
          </div>
        </div>
      </div>
    `;
  }
  render() {
    const t = this._getEntity("sensor", ["safety", "status"]), e = this.hass.states[t]?.attributes?.category_config?.global || {};
    return h`
      <ha-card header="Globalne Tryby Operacyjne">
        <div class="card-content">
          ${this._renderSwitch(
      "mdi:shield-account-outline",
      "Geolokalizacja",
      "Wycisz TTS, gdy nikogo nie ma w domu",
      this._getEntity("switch", ["safety", "geolocation"])
    )}

          ${this._renderSwitch(
      "mdi:shield-off-outline",
      "Tryb Serwisowy",
      "Tymczasowe zawieszenie wszystkich alertów",
      this._getEntity("switch", ["safety", "global_service"])
    )}

          ${this._renderSwitch(
      "mdi:shield-lock-outline",
      "Auto-Konfiguracja",
      "Automatyczne dobieranie sensorów",
      this._getEntity("switch", ["safety", "auto_config"])
    )}
        </div>
      </ha-card>

      <div style="margin-top: 32px; margin-bottom: 12px; font-size: 16px; font-weight: 500; padding-left: 8px; color: var(--primary-text-color);">
        Domyślne Kanały Powiadomień
      </div>
      
      ${this._renderEntityList("push_devices", "Globalne Telefony (Push)", "mdi:cellphone", ["notify"], e.push_devices)}
      ${this._renderEntityList("tts_devices", "Globalne Głośniki (TTS)", "mdi:speaker", ["media_player"], e.tts_devices)}
    `;
  }
}
customElements.define("tab-settings", Pt);
class Ot extends y {
  static properties = {
    hass: { type: Object },
    _currentTab: { type: String, state: !0 }
  };
  constructor() {
    super(), this._currentTab = "summary", this.tabs = [
      { id: "summary", name: "Podsumowanie", icon: "mdi:shield-home-outline" },
      { id: "sensors", name: "Zagrożenia", icon: "mdi:shield-search" },
      { id: "ai", name: "AI Analytics", icon: "mdi:shield-sync" },
      { id: "status", name: "Status", icon: "mdi:shield-star-outline" },
      { id: "settings", name: "Ustawienia", icon: "mdi:shield-edit-outline" }
    ];
  }
  static styles = A`
    :host { display: flex; flex-direction: column; height: 100vh; background-color: var(--primary-background-color); color: var(--primary-text-color); font-family: Roboto, sans-serif; }
    .header { background-color: var(--app-header-background-color, var(--primary-color)); color: white; font-size: 20px; padding: 16px 24px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .tabs { display: flex; background-color: var(--card-background-color); border-bottom: 1px solid var(--divider-color); overflow-x: auto; }
    .tab { padding: 16px 20px; cursor: pointer; font-size: 13px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; color: var(--secondary-text-color); border-bottom: 3px solid transparent; transition: 0.2s; white-space: nowrap; }
    .tab.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .content { flex: 1; overflow-y: auto; background-color: var(--primary-background-color); }
  `;
  render() {
    if (!this.hass) return h`<div>Loading...</div>`;
    const t = this.hass.localize("component.safety.title") || "Safety";
    return h`
      <div class="header">
        <ha-icon icon="mdi:shield-check-outline"></ha-icon> 
        ${t}
      </div>

      <div class="tabs">
        ${this.tabs.map((e) => h`
          <div class="tab ${this._currentTab === e.id ? "active" : ""}" 
               @click=${() => this._currentTab = e.id}>
            <ha-icon icon="${e.icon}" style="--mdc-icon-size: 18px;"></ha-icon>
            ${e.name}
          </div>
        `)}
      </div>

      <div class="content">
        ${this._renderTabContent()}
      </div>
   
      `;
  }
  _renderTabContent() {
    switch (this._currentTab) {
      case "summary":
        return h`<tab-summary .hass=${this.hass}></tab-summary>`;
      case "sensors":
        return h`<tab-hazards .hass=${this.hass}></tab-hazards>`;
      case "ai":
        return h`<tab-ai .hass=${this.hass}></tab-ai>`;
      case "status":
        return h`<tab-status .hass=${this.hass}></tab-status>`;
      case "settings":
        return h`<tab-settings .hass=${this.hass}></tab-settings>`;
      default:
        return h`<tab-summary .hass=${this.hass}></tab-summary>`;
    }
  }
}
customElements.define("safety-panel", Ot);
