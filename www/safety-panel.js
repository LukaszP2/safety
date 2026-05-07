const R=globalThis,W=R.ShadowRoot&&(R.ShadyCSS===void 0||R.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,F=Symbol(),Z=new WeakMap;let dt=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==F)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(W&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Z.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Z.set(e,t))}return t}toString(){return this.cssText}};const Pt=r=>new dt(typeof r=="string"?r:r+"",void 0,F),u=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new dt(e,r,F)},Mt=(r,t)=>{if(W)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=R.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Y=W?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Pt(e)})(r):r;const{is:Dt,defineProperty:Rt,getOwnPropertyDescriptor:Nt,getOwnPropertyNames:Ut,getOwnPropertySymbols:Lt,getPrototypeOf:Ht}=Object,H=globalThis,J=H.trustedTypes,It=J?J.emptyScript:"",Bt=H.reactiveElementPolyfillSupport,C=(r,t)=>r,K={toAttribute(r,t){switch(t){case Boolean:r=r?It:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ht=(r,t)=>!Dt(r,t),Q={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:ht};Symbol.metadata??=Symbol("metadata"),H.litPropertyMetadata??=new WeakMap;let S=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Q){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Rt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:a}=Nt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){const n=i?.call(this);a?.call(this,o),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Q}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;const t=Ht(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){const e=this.properties,s=[...Ut(e),...Lt(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Y(i))}else t!==void 0&&e.push(Y(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Mt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const a=(s.converter?.toAttribute!==void 0?s.converter:K).toAttribute(e,s.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:K;this._$Em=i;const n=o.fromAttribute(e,a.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,a){if(t!==void 0){const o=this.constructor;if(i===!1&&(a=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??ht)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),a!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:o}=a,n=this[i];o!==!0||this._$AL.has(i)||n===void 0||this.C(i,void 0,a,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[C("elementProperties")]=new Map,S[C("finalized")]=new Map,Bt?.({ReactiveElement:S}),(H.reactiveElementVersions??=[]).push("2.1.2");const q=globalThis,X=r=>r,U=q.trustedTypes,tt=U?U.createPolicy("lit-html",{createHTML:r=>r}):void 0,pt="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,ut="?"+x,Kt=`<${ut}>`,k=document,O=()=>k.createComment(""),j=r=>r===null||typeof r!="object"&&typeof r!="function",V=Array.isArray,Wt=r=>V(r)||typeof r?.[Symbol.iterator]=="function",B=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,et=/-->/g,it=/>/g,$=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),st=/'/g,at=/"/g,mt=/^(?:script|style|textarea|title)$/i,Ft=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),l=Ft(1),z=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),ot=new WeakMap,w=k.createTreeWalker(k,129);function gt(r,t){if(!V(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return tt!==void 0?tt.createHTML(t):t}const qt=(r,t)=>{const e=r.length-1,s=[];let i,a=t===2?"<svg>":t===3?"<math>":"",o=T;for(let n=0;n<e;n++){const c=r[n];let p,d,h=-1,y=0;for(;y<c.length&&(o.lastIndex=y,d=o.exec(c),d!==null);)y=o.lastIndex,o===T?d[1]==="!--"?o=et:d[1]!==void 0?o=it:d[2]!==void 0?(mt.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=$):d[3]!==void 0&&(o=$):o===$?d[0]===">"?(o=i??T,h=-1):d[1]===void 0?h=-2:(h=o.lastIndex-d[2].length,p=d[1],o=d[3]===void 0?$:d[3]==='"'?at:st):o===at||o===st?o=$:o===et||o===it?o=T:(o=$,i=void 0);const g=o===$&&r[n+1].startsWith("/>")?" ":"";a+=o===T?c+Kt:h>=0?(s.push(p),c.slice(0,h)+pt+c.slice(h)+x+g):c+x+(h===-2?n:g)}return[gt(r,a+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class P{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let a=0,o=0;const n=t.length-1,c=this.parts,[p,d]=qt(t,e);if(this.el=P.createElement(p,s),w.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=w.nextNode())!==null&&c.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(pt)){const y=d[o++],g=i.getAttribute(h).split(x),b=/([.?@])?(.*)/.exec(y);c.push({type:1,index:a,name:b[2],strings:g,ctor:b[1]==="."?Gt:b[1]==="?"?Zt:b[1]==="@"?Yt:I}),i.removeAttribute(h)}else h.startsWith(x)&&(c.push({type:6,index:a}),i.removeAttribute(h));if(mt.test(i.tagName)){const h=i.textContent.split(x),y=h.length-1;if(y>0){i.textContent=U?U.emptyScript:"";for(let g=0;g<y;g++)i.append(h[g],O()),w.nextNode(),c.push({type:2,index:++a});i.append(h[y],O())}}}else if(i.nodeType===8)if(i.data===ut)c.push({type:2,index:a});else{let h=-1;for(;(h=i.data.indexOf(x,h+1))!==-1;)c.push({type:7,index:a}),h+=x.length-1}a++}}static createElement(t,e){const s=k.createElement("template");return s.innerHTML=t,s}}function E(r,t,e=r,s){if(t===z)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl;const a=j(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=E(r,i._$AS(r,t.values),i,s)),t}class Vt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);w.currentNode=i;let a=w.nextNode(),o=0,n=0,c=s[0];for(;c!==void 0;){if(o===c.index){let p;c.type===2?p=new M(a,a.nextSibling,this,t):c.type===1?p=new c.ctor(a,c.name,c.strings,this,t):c.type===6&&(p=new Jt(a,this,t)),this._$AV.push(p),c=s[++n]}o!==c?.index&&(a=w.nextNode(),o++)}return w.currentNode=k,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class M{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),j(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Wt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&j(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=P.createElement(gt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const a=new Vt(i,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(t){let e=ot.get(t.strings);return e===void 0&&ot.set(t.strings,e=new P(t)),e}k(t){V(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const a of t)i===e.length?e.push(s=new M(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(a),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=X(t).nextSibling;X(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class I{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,a){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=f}_$AI(t,e=this,s,i){const a=this.strings;let o=!1;if(a===void 0)t=E(this,t,e,0),o=!j(t)||t!==this._$AH&&t!==z,o&&(this._$AH=t);else{const n=t;let c,p;for(t=a[0],c=0;c<a.length-1;c++)p=E(this,n[s+c],e,c),p===z&&(p=this._$AH[c]),o||=!j(p)||p!==this._$AH[c],p===f?t=f:t!==f&&(t+=(p??"")+a[c+1]),this._$AH[c]=p}o&&!i&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Gt extends I{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}}class Zt extends I{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}}class Yt extends I{constructor(t,e,s,i,a){super(t,e,s,i,a),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??f)===z)return;const s=this._$AH,i=t===f&&s!==f||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==f&&(s===f||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Jt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}}const Qt=q.litHtmlPolyfillSupport;Qt?.(P,M),(q.litHtmlVersions??=[]).push("3.3.2");const Xt=(r,t,e)=>{const s=e?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const a=e?.renderBefore??null;s._$litPart$=i=new M(t.insertBefore(O(),a),a,void 0,e??{})}return i._$AI(r),i};const G=globalThis;class v extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Xt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}}v._$litElement$=!0,v.finalized=!0,G.litElementHydrateSupport?.({LitElement:v});const te=G.litElementPolyfillSupport;te?.({LitElement:v});(G.litElementVersions??=[]).push("4.2.2");const ee="modulepreload",ie=function(r){return"/"+r},rt={},nt=function(t,e,s){let i=Promise.resolve();if(e&&e.length>0){let p=function(d){return Promise.all(d.map(h=>Promise.resolve(h).then(y=>({status:"fulfilled",value:y}),y=>({status:"rejected",reason:y}))))};var o=p;document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),c=n?.nonce||n?.getAttribute("nonce");i=p(e.map(d=>{if(d=ie(d),d in rt)return;rt[d]=!0;const h=d.endsWith(".css"),y=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${y}`))return;const g=document.createElement("link");if(g.rel=h?"stylesheet":ee,h||(g.as="script"),g.crossOrigin="",g.href=d,c&&g.setAttribute("nonce",c),document.head.appendChild(g),h)return new Promise((b,D)=>{g.addEventListener("load",b),g.addEventListener("error",()=>D(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(n){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=n,window.dispatchEvent(c),!c.defaultPrevented)throw n}return i.then(n=>{for(const c of n||[])c.status==="rejected"&&a(c.reason);return t().catch(a)})},ft={title:"Safety System",loading:"Loading..."},yt={summary:"Summary",hazards:"Hazards",analytics:"Analytics",status:"Status",settings:"Settings"},_t={system_status:"System Status",active_hazards:"Active Hazards",sensor_failures:"Sensor Failures",low_battery:"Low Battery",safety_score:"Safety Score",recent_activity:"Recent Activity",no_activity:"No system events",no_data:"No data",ai_analysis:"AI Analysis",ai_detected:"Detected",ai_clear:"Clear",actions:"Actions",maintenance_enable:"Enable maintenance mode",maintenance_on:"MAINTENANCE MODE: ON",close_water:"Close water",dismiss_alerts:"Dismiss alarms",battery:"Sensor Health",offline_sensors:"Offline Sensors",offline:"Offline",battery_ok:"All sensors healthy"},vt={addEntity:"➕ Add entity",sensors:"Sensors",actuators:"Devices",matrix:"Home Modes Matrix",channels:"Notification Channels",messages:"Tags & Messages",sensors_card:"Detection Sensors",actuators_card:"Execution Devices",predictions_card:"Prediction Entities",predictions_title:"Prediction Entities",locked_auto:"Editing locked. System selects sensors automatically.",locked_auto_pred:"Prediction editing locked. Managed automatically.",locked_global:"Editing locked by global settings.",goto_settings:"Go to settings",test_notify:"Test notifications",test_alarm:"Simulate alarm",dismiss:"Dismiss alarm",sensorIcon:"mdi:radar",actuatorIcon:"mdi:lightbulb-group",none:"None",categories:{water:"Water",fire:"Fire",gas:"Gas",temperature:"Temperature",power:"Power"}},bt={score_title:"Safety Score",trend_title:"Safety Trend",audit_title:"Home Safety Audit",predictions_title:"Hazard Prediction",reco_title:"Recommendations & Goals",trend_improving:"Improving",trend_stable:"Stable",trend_declining:"Declining",status_very_safe:"Very Safe",status_good:"Good",status_medium:"Medium",status_low:"Low",cat_fire:"Fire",cat_water:"Water",cat_gas:"Gas",cat_env:"Environment",cat_power:"Power",cat_coverage:"Sensor Coverage",pred_mold:"Mold Risk",pred_freeze:"Freeze Risk",pred_overheat:"Overheat Risk",pred_power:"Power Instability",pred_leak:"Moisture Rising",no_predictions:"No long-term hazards detected.",target_score:"Target Safety Score:",missing_to_reach:"Missing to reach ({target}):",buy_now:"Buy hardware",freeze_risk:"Freeze Risk",overheat_risk:"Overheat Risk",monitoring_safe:"Normal state (Monitored)"},xt={system_management:"System Management",service_mode:"Service Mode",service_mode_desc:"Temporarily pause all alerts",auto_config_sensors:"Auto-Config Sensors",auto_config_sensors_desc:"Automatically discover sensors",auto_config_actuators:"Auto-Config Actuators",auto_config_actuators_desc:"Automatically discover actuators",predictions_title:"AI Hazard Predictions",auto_predictions:"Auto-Config Predictions",auto_predictions_desc:"Automatically assign prediction entities",home_modes:"Home Modes",alarm_integration:"Alarm Integration",select_alarm:"Select alarm panel...",selected:"Selected:",auto_selected:"Auto-selected:",custom_modes:"Custom",use_presence:"Use presence detection",select_zone:"Select zone...",use_night_mode:"Use night mode",night_start:"Night start",night_end:"Night end",global_matrix_title:"Global Mode Matrix",global_matrix_desc:"Overrides hazard mode settings",default_channels:"Default Notification Channels",global_messages:"Global Messages",popup_yes:"Yes",popup_cancel:"Cancel"},$t={ha_title:"Home Assistant UI",ha_persistent:"Persistent Notification",ha_persistent_desc:"Bell icon in sidebar",push_title:"Push Notifications",push_dnd:"Bypass Do Not Disturb",tts_title:"Speakers",volume:"Volume",tts_repeat:"Repeat message",tts_interval:"Repeat interval",siren_title:"Sirens",light_title:"Alarm Lights",light_effect:"Flash effect",script_title:"Automations & Scripts",script_skip:"Skip conditions",title:"Default notification channels"},wt={title_label:"Notification Title",msg_label:"Notification Message",insert:"Insert:",sensor:"Sensor",area:"Area",device:"Device",time:"Time",global_title:"Global Messages",title:"Title",message:"Message",preview:"Preview"},kt={mode:"Mode",home:"Home",away:"Away",night:"Night",vacation:"Vacation",prediction:"Prediction",actuators:"Devices",notify_ha:"HA Notifications",push:"Mobile",tts:"Speakers",sirens:"Sirens",lights:"Lights",automations:"Scripts"},St={add_entity:"Add entity..."},zt={remove:"Remove",cancel:"Cancel",ok:"OK",yes:"Yes",no:"No"},Et={title:"AI Hazard Predictions",auto_config:"Automatic prediction configuration",auto_config_desc:"Automatically assign prediction entities to hazards"},At={title:"System management",confirm:"Yes, continue",cancel:"Cancel",service_mode:"Service mode",service_mode_desc:"Temporarily disable all alerts",auto_sensors:"Automatic sensor configuration",auto_sensors_desc:"Lock manual editing. The system will rediscover sensors",auto_actuators:"Automatic device configuration",auto_actuators_desc:"Lock manual editing. The system will rediscover actuators",popup_sensors_title:"Automatic sensor configuration",popup_sensors_text:"Enabling this option will remove your manually selected sensors and replace them with automatically discovered ones from Home Assistant.",popup_actuators_title:"Automatic device configuration",popup_actuators_text:"Enabling this option will remove your manually selected actuators and replace them with automatically discovered ones."},Tt={smoke_sensor:"Smoke Sensor",water_leak_sensor:"Water Leak Sensor",co_detector:"CO Detector",temperature_sensor:"Temperature Sensor",power_meter:"Power Meter"},Ct={offline:"Offline",no_response_days:"{{days}}d no response",unassigned_area:"Unassigned",other_rooms:"Other",rooms:"Rooms"},L={panel:ft,tabs:yt,summary:_t,hazards:vt,analytics:bt,settings:xt,channels:$t,messages:wt,matrix:kt,list:St,actions:zt,predictions:Et,system:At,devices:Tt,status:Ct},se=Object.freeze(Object.defineProperty({__proto__:null,actions:zt,analytics:bt,channels:$t,default:L,devices:Tt,hazards:vt,list:St,matrix:kt,messages:wt,panel:ft,predictions:Et,settings:xt,status:Ct,summary:_t,system:At,tabs:yt},Symbol.toStringTag,{value:"Module"})),ct=Object.assign({"./locales/en.json":()=>nt(()=>Promise.resolve().then(()=>se),void 0),"./locales/pl.json":()=>nt(()=>import("./assets/pl-BQoz6yEp.js"),[])});let lt="",N={};async function ae(r){if(lt===r)return;const t=`./locales/${r}.json`;try{if(ct[t]){const e=await ct[t]();N=e.default||e}else N=L;lt=r,window.dispatchEvent(new CustomEvent("language-loaded"))}catch{N=L,window.dispatchEvent(new CustomEvent("language-loaded"))}}function m(r,t,e={}){const s=r.split(".");let i=N;for(const o of s){if(i==null)break;i=i[o]}if(i==null){i=L;for(const o of s){if(i==null)break;i=i[o]}}let a=i||r;return e&&Object.keys(e).length>0&&Object.entries(e).forEach(([o,n])=>{a=a.replace(new RegExp(`{{${o}}}`,"g"),n)}),a}class _ extends v{static properties={hass:{type:Object}};tt(t,e={}){return m(t,this.hass,e)}ha(t,e=null,s=null){if(this.hass?.localize){const i=this.hass.localize(t,s);if(i&&i!==t)return i}return e?this.tt(e,s):t}entityName(t){const e=this.hass?.states?.[t];return e?e.attributes?.friendly_name||t.split(".").pop().replaceAll("_"," "):t}areaName(t){const e=this.hass?.areas?.[t]||this.hass?.areaRegistry?.[t];return e?e.name:t}deviceName(t){const e=this.hass?.devices?.[t]||this.hass?.deviceRegistry?.[t];return e?e.name_by_user||e.name:t}integrationName(t){if(this.hass?.localize){const e=this.hass.localize(`component.${t}.title`);if(e&&e!==t)return e}return t}connectedCallback(){super.connectedCallback(),this._onLangLoaded=()=>this.requestUpdate(),window.addEventListener("language-loaded",this._onLangLoaded)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("language-loaded",this._onLangLoaded)}updated(t){super.updated(t),t.has("hass")&&this.hass?.language&&ae(this.hass.language)}}class oe extends _{static properties={hass:{type:Object}};static styles=u`

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
gap:16px;
margin-bottom:24px;
}

.tile{
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
height:130px;
text-align:center;
cursor:pointer;

transition:
transform 0.2s cubic-bezier(0.25,0.8,0.25,1),
border-color 0.2s;
}

.tile:hover{
transform:translateY(-4px);
border-color:var(--primary-color);
}

.tile:active{
transform:translateY(2px);
}

.tile ha-icon{
--mdc-icon-size:36px;
margin-bottom:8px;
}

.value{
font-size:28px;
font-weight:bold;
line-height:1.2;
}

.label{
font-size:11px;
color:var(--secondary-text-color);
text-transform:uppercase;
margin-top:6px;
letter-spacing:0.5px;
font-weight:500;
}

/* STATUS COLORS */

.ok{
color:var(--success-color,#4caf50);
}

.error{
color:var(--error-color,#f44336);
}

.warning{
color:var(--warning-color,#ff9800);
}

`;_getMainSensor(){const t=Object.keys(this.hass.states).find(e=>e.startsWith("sensor.")&&this.hass.states[e].attributes?.unique_key==="status");return t?this.hass.states[t]:null}_getMonitoredEntities(){const t=this._getMainSensor();if(!t)return[];const e=t.attributes.category_config||{},s=new Set;return Object.values(e).forEach(i=>{i.sensors?.forEach(a=>s.add(a)),i.actuators?.forEach(a=>s.add(a)),i.sirens?.forEach(a=>s.add(a))}),[...s]}_getStats(){const t=this._getMonitoredEntities();let e=0,s=0;return t.forEach(i=>{const a=this.hass.states[i];if(!a)return;["unknown","unavailable"].includes(a.state)&&e++;const o=a.attributes.battery_level??a.attributes.battery;o!==void 0&&o<=25&&s++}),{offline:e,lowBat:s}}render(){const t=this._getMainSensor(),e=t?.attributes?.active_alerts?.length||0,s=t?.state==="service_mode",i=this._getStats(),a=Math.max(0,100-e*25),o=t?this.hass.formatEntityState(t):this.tt("summary.no_data");let n="ok",c="mdi:shield-home-outline";return s?(n="warning",c="mdi:shield-off"):e>0&&(n="error",c="mdi:shield-alert-outline"),l`

<div class="grid">

<ha-card outlined class="tile">

<ha-icon
icon="${c}"
class="${n}">
</ha-icon>

<div class="value ${n}">
${o}
</div>

<div class="label">
${this.tt("summary.system_status")}
</div>

</ha-card>


<ha-card outlined class="tile">

<ha-icon
icon="mdi:alert-circle-outline"
class="${e>0?"error":""}">
</ha-icon>

<div class="value ${e>0?"error":"ok"}">
${e}
</div>

<div class="label">
${this.tt("summary.active_hazards")}
</div>

</ha-card>


<ha-card outlined class="tile">

<ha-icon
icon="${i.offline>0?"mdi:shield-alert-outline":"mdi:shield-check-outline"}"
class="${i.offline>0?"warning":"ok"}">
</ha-icon>

<div class="value ${i.offline>0?"warning":"ok"}">
${i.offline}
</div>

<div class="label">
${this.tt("summary.sensor_failures")}
</div>

</ha-card>


<ha-card outlined class="tile">

<ha-icon
icon="${i.lowBat>0?"mdi:battery-alert":"mdi:battery-check"}"
class="${i.lowBat>0?"error":"ok"}">
</ha-icon>

<div class="value ${i.lowBat>0?"error":"ok"}">
${i.lowBat}
</div>

<div class="label">
${this.tt("summary.low_battery")}
</div>

</ha-card>


<ha-card outlined class="tile">

<ha-icon
icon="mdi:shield-check-outline"
class="${a<100?a<50?"error":"warning":"ok"}">
</ha-icon>

<div class="value ${a<100?a<50?"error":"warning":"ok"}">

${a}%

</div>

<div class="label">
${this.tt("summary.safety_score")}
</div>

</ha-card>
<ha-card outlined class="tile">

  <ha-icon
    icon="mdi:brain"
    class="${e>0?"error":"ok"}">
  </ha-icon>

  <div class="value ${e>0?"error":"ok"}">
    ${e>0?this.tt("summary.ai_detected"):this.tt("summary.ai_clear")}
  </div>

  <div class="label">
    ${this.tt("summary.ai_analysis")}
  </div>

</ha-card>
</div>

`}}customElements.define("summary-badges",oe);class re extends _{static properties={hass:{type:Object}};static styles=u`

.list-item{
display:flex;
align-items:center;
padding:10px 0;
border-bottom:1px solid var(--divider-color);
}

.list-item:last-child{
border-bottom:none;
}

.item-time{
font-size:12px;
color:var(--secondary-text-color);
min-width:50px;
}

.item-name{
flex-grow:1;
margin-left:12px;
font-size:14px;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
cursor:pointer;
}

.item-value{
font-size:14px;
font-weight:500;
}

.empty-state{
text-align:center;
color:var(--secondary-text-color);
padding:20px;
font-style:italic;
}

.icon{
color:var(--secondary-text-color);
margin-left:6px;
}

`;_getSelectedEntities(){const t=this._getStatusSensorId();if(!t)return[];const e=this.hass.states[t]?.attributes?.category_config;if(!e)return[];const s=[];return["water","fire","gas","temperature","power"].forEach(i=>{const a=e[i];a&&(Array.isArray(a.sensors)&&s.push(...a.sensors),Array.isArray(a.actuators)&&s.push(...a.actuators))}),s}_getStatusSensorId(){return this.hass?Object.keys(this.hass.states).find(t=>{const e=this.hass.states[t]?.attributes||{};return t.startsWith("sensor.")&&e.unique_key==="status"}):null}_getRecent(){const t=this._getSelectedEntities(),e=[];return t.forEach(s=>{const i=this.hass.states[s];!i||!i.last_changed||e.push({id:s,name:i.attributes.friendly_name||s,state:this.hass.formatEntityState(i),last_changed:new Date(i.last_changed)})}),e.sort((s,i)=>i.last_changed-s.last_changed).slice(0,5)}_openMoreInfo(t){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}render(){const t=this._getRecent();return l`

<ha-card
header="${this.tt("summary.recent_activity")}">

<div class="card-content">

${t.length>0?t.map(e=>l`

<div class="list-item">

<span class="item-time">

${e.last_changed.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}

</span>

<ha-icon
icon="mdi:history"
class="icon">
</ha-icon>

<span
class="item-name"
@click=${()=>this._openMoreInfo(e.id)}>

${e.name}

</span>

<span class="item-value">

${e.state}

</span>

</div>

`):l`

<div class="empty-state">

${this.tt("summary.no_activity")}

</div>

`}

</div>

</ha-card>

`}}customElements.define("summary-recent-sensors",re);class ne extends _{static properties={hass:{type:Object}};static styles=u`

.action-btn{
width:100%;
margin-bottom:12px;
}

.action-btn:last-child{
margin-bottom:0;
}

.danger-btn{
--mdc-theme-primary:var(--error-color);
}

.warning-btn{
--mdc-theme-primary:var(--warning-color);
}

`;_findEntity(t,e){return Object.keys(this.hass.states).find(s=>s.startsWith(t+".")&&e.some(i=>s.includes(i)))}render(){const t=this._findEntity("button",["dismiss","alarm"]),e=this._findEntity("switch",["service","maintenance"]),s=e?this.hass.states[e].state==="on":!1;return l`

<ha-card header="${this.tt("summary.actions")}">

<div class="card-content">

<ha-button
raised
class="action-btn warning-btn"
@click=${()=>{e&&this.hass.callService("switch","toggle",{entity_id:e})}}>

<ha-icon
slot="icon"
icon="${s?"mdi:wrench":"mdi:wrench-outline"}">
</ha-icon>

${s?this.tt("summary.maintenance_on"):this.tt("summary.maintenance_enable")}

</ha-button>


<ha-button
raised
class="action-btn"
@click=${()=>console.log("close water")}>

<ha-icon
slot="icon"
icon="mdi:pipe-valve">
</ha-icon>

${this.tt("summary.close_water")}

</ha-button>


<ha-button
raised
class="action-btn danger-btn"
@click=${()=>{t&&this.hass.callService("button","press",{entity_id:t})}}>

<ha-icon
slot="icon"
icon="mdi:alert-octagon">
</ha-icon>

${this.tt("summary.dismiss_alerts")}

</ha-button>

</div>

</ha-card>

`}}customElements.define("summary-actions",ne);class ce extends _{static properties={hass:{type:Object}};static styles=u`

.list-item{
display:flex;
align-items:center;
padding:10px 0;
border-bottom:1px solid var(--divider-color);
cursor:pointer;
}

.list-item:last-child{
border-bottom:none;
}

.item-name{
flex-grow:1;
font-size:14px;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
}

.item-value{
font-size:14px;
font-weight:500;
}

.status-error{
color:var(--error-color,#f44336);
}

.status-warning{
color:var(--warning-color,#ff9800);
}

.status-ok{
color:var(--success-color,#4caf50);
}

.empty-state{
text-align:center;
color:var(--secondary-text-color);
padding:20px;
font-style:italic;
}

.big-icon{
font-size:32px;
margin-bottom:8px;
display:block;
}

.section-title{
font-size:12px;
text-transform:uppercase;
color:var(--secondary-text-color);
margin:8px 0;
}

`;_getMainSensor(){const t=Object.keys(this.hass.states).find(e=>e.startsWith("sensor.")&&this.hass.states[e].attributes?.unique_key==="status");return t?this.hass.states[t]:null}_getConfiguredSensors(){const t=this._getMainSensor();if(!t)return[];const e=t.attributes.category_config||{},s=new Set;return Object.values(e).forEach(i=>{i.sensors?.forEach(a=>s.add(a))}),[...s]}_getLowBattery(){const t=this._getConfiguredSensors(),e=[];return t.forEach(s=>{const i=this.hass.states[s];if(!i)return;const a=i.attributes.battery_level??i.attributes.battery;a!==void 0&&a<=25&&e.push({id:s,name:i.attributes.friendly_name||s,level:parseInt(a)})}),e.sort((s,i)=>s.level-i.level)}_getOfflineSensors(){const t=this._getConfiguredSensors(),e=[];return t.forEach(s=>{const i=this.hass.states[s];i&&["unknown","unavailable"].includes(i.state)&&e.push({id:s,name:i.attributes.friendly_name||s})}),e}_openMoreInfo(t){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}render(){const t=this._getLowBattery(),e=this._getOfflineSensors(),s=t.length>0||e.length>0;return l`

<ha-card
header="${this.tt("summary.battery")}">

<div class="card-content">

${s?l`

${t.length>0?l`

<div class="section-title">
${this.tt("summary.low_battery")}
</div>

${t.map(i=>l`

<div
class="list-item"
@click=${()=>this._openMoreInfo(i.id)}>

<ha-icon
icon="mdi:battery-alert"
class="status-error"
style="margin-right:12px;">
</ha-icon>

<span class="item-name">
${i.name}
</span>

<span class="item-value status-error">
${i.level}%
</span>

</div>

`)}
`:""}

${e.length>0?l`

<div class="section-title">
${this.tt("summary.offline_sensors")}
</div>

${e.map(i=>l`

<div
class="list-item"
@click=${()=>this._openMoreInfo(i.id)}>

<ha-icon
icon="mdi:lan-disconnect"
class="status-warning"
style="margin-right:12px;">
</ha-icon>

<span class="item-name">
${i.name}
</span>

<span class="item-value status-warning">
${this.tt("summary.offline")}
</span>

</div>

`)}
`:""}

`:l`

<div class="empty-state">

<ha-icon
icon="mdi:battery-check"
class="status-ok big-icon">
</ha-icon>

${this.tt("summary.battery_ok")}

</div>

`}

</div>

</ha-card>

`}}customElements.define("summary-battery",ce);class le extends _{static properties={hass:{type:Object}};static styles=u`
:host{
display:block;
padding:20px;
}

.sections{
display:grid;
grid-template-columns:2fr 1fr;
gap:16px;
}
`;render(){return l`

<summary-badges
.hass=${this.hass}>
</summary-badges>

<div class="sections">

<summary-recent-sensors
.hass=${this.hass}>
</summary-recent-sensors>

<div>

<summary-actions
.hass=${this.hass}>
</summary-actions>

<summary-battery
.hass=${this.hass}>
</summary-battery>

</div>

</div>

`}}customElements.define("tab-summary",le);class de extends _{static properties={matrix:{type:Object},isReadOnly:{type:Boolean},modeType:{type:String},showAway:{type:Boolean},showNight:{type:Boolean},showVacation:{type:Boolean},showPrediction:{type:Boolean}};_haOrTt(t,e){return this.hass?.localize?.(t)||this.tt(e)}_getModeLabel(t){const s={home:"armed_home",away:"armed_away",night:"armed_night",vacation:"armed_vacation"}[t];if(this.hass?.localize&&s){const i=this.hass.localize(`component.alarm_control_panel.entity_component._.state.${s}`);if(i){const a=i.match(/\((.*?)\)/);return a?a[1]:i}}return this.tt(`matrix.${t}`)}render(){const t=[{id:"home",show:!0},{id:"away",show:this.showAway},{id:"vacation",show:this.showVacation},{id:"night",show:this.showNight},{id:"prediction",show:this.showPrediction}].filter(i=>i.show).map(i=>({id:i.id,label:i.id==="prediction"?this.tt("matrix.prediction"):this._getModeLabel(i.id)})),e=[{id:"actuators",label:this.hass?.localize?.("ui.panel.config.devices.caption")||this.hass?.localize?.("ui.sidebar.config")||this.tt("matrix.actuators")},{id:"notify_ha",label:this.hass?.localize?.("ui.notification_drawer.title")||this.tt("matrix.notify_ha")},{id:"push",label:this.hass?.localize?.("ui.panel.config.mobile_app.caption")||this.tt("matrix.push")},{id:"tts",label:this.hass?.localize?.("component.media_player.entity_component._.name")||this.tt("matrix.tts")},{id:"sirens",label:this.hass?.localize?.("component.siren.entity_component._.name")||this.tt("matrix.sirens")},{id:"lights",label:this.hass?.localize?.("component.light.entity_component._.name")||this.tt("matrix.lights")},{id:"automations",label:this.hass?.localize?.("ui.panel.config.automation.caption")||this.hass?.localize?.("component.script.entity_component._.name")||this.tt("matrix.automations")}],s=this.matrix||{};return l`
      <div class="matrix-container ${this.isReadOnly?"readonly":""}">

        <table class="matrix-table">

          <thead>
            <tr>
              <th class="sticky-col">${this.tt("matrix.mode")}</th>
              ${e.map(i=>l`<th>${i.label}</th>`)}
            </tr>
          </thead>

          <tbody>

            ${t.map(i=>l`
              <tr>

                <td class="sticky-col">${i.label}</td>

                ${e.map(a=>l`
                  <td>

                    <ha-checkbox
                      .checked=${s[i.id]?s[i.id][a.id]!==!1:!0}

                      ?disabled=${this.isReadOnly}

                      @change=${o=>this._handleChange(i.id,a.id,o.target.checked)}
                    >
                    </ha-checkbox>

                  </td>
                `)}

              </tr>
            `)}

          </tbody>

        </table>

      </div>
    `}_handleChange(t,e,s){if(this.isReadOnly)return;const i=structuredClone(this.matrix||{});i[t]||(i[t]={}),i[t][e]=s,this.dispatchEvent(new CustomEvent("matrix-change",{detail:{matrix:i},bubbles:!0,composed:!0}))}static styles=u`

    .matrix-container {
      overflow: auto;
      margin-top: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      max-height: 420px;
    }

    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      min-width: 700px;
    }

    thead th {
      position: sticky;
      top: 0;
      background: var(--card-background-color);
      z-index: 3;
      padding: 12px 8px;
      border-bottom: 1px solid var(--divider-color);
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    .matrix-table td {
      text-align: center;
      padding: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .matrix-table td:first-child {
      text-align: left;
      padding-left: 16px;
      font-weight: 500;
    }

    .sticky-col {
      position: sticky;
      left: 0;
      background: var(--card-background-color);
      z-index: 2;
    }

    thead .sticky-col {
      z-index: 4;
    }

    .readonly {
      opacity: 0.6;
      pointer-events: none;
    }

  `}customElements.define("matrix-table",de);class he extends v{static properties={hass:{type:Object},title:{type:String},icon:{type:String},list:{type:Array},domains:{type:Array},isReadOnly:{type:Boolean},pickerPlaceholder:{type:String},category:{type:String},_isPickerOpen:{type:Boolean,state:!0},_pickerSearch:{type:String,state:!0}};constructor(){super(),this.list=[],this.domains=[],this.isReadOnly=!1,this.pickerPlaceholder="Dodaj urządzenie do listy...",this.category=null,this._isPickerOpen=!1,this._pickerSearch=""}static styles=u`
    .ha-automation-card { border: 1px solid var(--divider-color, #444); border-radius: 12px; margin-bottom: 16px; background: var(--card-background-color, #1c1c1c); overflow: visible !important; }
    .ha-automation-header { padding: 16px; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 16px; color: var(--primary-text-color); }
    .ha-automation-body { padding: 0 16px 16px 16px; display: flex; flex-direction: column; gap: 12px; overflow: visible !important; }
    
    /* --- ZMIENIONE: WIDOK BADGES --- */
    .badges-container { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 8px; 
      align-items: center;
    }
    
    .entity-badge { 
      display: inline-flex; 
      align-items: center; 
      gap: 6px; 
      padding: 6px 12px; 
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1); 
      border: 1px solid var(--primary-color); 
      border-radius: 16px; 
      font-size: 13px; 
      color: var(--primary-text-color); 
      transition: background-color 0.2s;
    }
    
    .entity-badge.readonly {
      background: var(--secondary-background-color);
      border-color: var(--divider-color);
      color: var(--secondary-text-color);
    }

    .badge-icon { --mdc-icon-size: 16px; }
    .badge-name { font-weight: 500; white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
    
    .remove-btn { 
      color: var(--secondary-text-color); 
      cursor: pointer; 
      transition: color 0.2s; 
      --mdc-icon-size: 16px; 
      margin-left: 2px;
    }
    .remove-btn:hover { color: var(--error-color, #f44336); }
    /* ------------------------------- */
    
    .picker-container { position: relative; width: 100%; margin-top: 8px; }
    .picker-input-wrapper { display: flex; align-items: center; padding: 12px 16px; border: 1px dashed var(--divider-color, #666); border-radius: 8px; cursor: pointer; color: var(--secondary-text-color); transition: border-color 0.2s; }
    .picker-input-wrapper:hover { border-color: var(--primary-color); color: var(--primary-text-color); }
    .picker-dropdown { position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: var(--card-background-color); border: 1px solid var(--divider-color); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 100; max-height: 250px; overflow-y: auto; }
    .search-box { padding: 12px; border-bottom: 1px solid var(--divider-color); position: sticky; top: 0; background: var(--card-background-color); z-index: 2; }
    .search-box input { width: 100%; padding: 8px; border: 1px solid var(--divider-color); border-radius: 4px; background: var(--secondary-background-color); color: var(--primary-text-color); outline: none; box-sizing: border-box; }
    
    .custom-picker-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; cursor: pointer; border-bottom: 1px solid var(--divider-color); }
    .custom-picker-item:last-child { border-bottom: none; }
    .custom-picker-item:hover { background: var(--secondary-background-color); }
    .item-icon { color: var(--secondary-text-color); --mdc-icon-size: 20px; }
    .item-text { flex: 1; overflow: hidden; }
    .item-title { font-size: 14px; font-weight: 500; color: var(--primary-text-color); white-space: nowrap; text-overflow: ellipsis; overflow: hidden; display: flex; align-items: center; }
    .item-subtitle { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
    .area-badge { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1); color: var(--primary-color); padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500; margin-left: 8px; }
  `;_isMatch(t){if(!this.category)return!0;const s={water:{classes:["moisture","water","leak","flood"],keywords:["zalani","wod","wilgot","przeciek","leak","water","moisture","flood"]},fire:{classes:["smoke","fire","heat"],keywords:["pozar","pożar","dym","ogie","heat","smoke","fire","temperatura"]},gas:{classes:["gas","volatile_organic_compounds"],keywords:["gaz","gas","lpg","co","tlenek","voc","carbon monoxide"]},temperature:{classes:["temperature"],keywords:["temperatura","temp","temperature"]},power:{classes:["power","energy","voltage","current"],keywords:["zasilanie","energia","prad","prąd","napiecie","napięcie","power","energy","voltage","current"]}}[this.category];if(!s)return!0;const i=t.entity_id.toLowerCase(),a=(t.attributes.friendly_name||"").toLowerCase(),o=t.attributes.device_class;return o&&s.classes.includes(o)?!0:s.keywords.some(n=>a.includes(n)||i.includes(n))}_getAvailableEntities(){if(!this.hass)return[];const t=Array.isArray(this.list)?this.list:[];return Object.values(this.hass.states).filter(e=>{const s=e.entity_id.split(".")[0],i=!this.domains||this.domains.length===0||this.domains.includes(s),a=!t.includes(e.entity_id),o=this._isMatch(e);return i&&a&&o}).map(e=>e.entity_id)}render(){const e=this._getAvailableEntities().filter(i=>{const a=this.hass.states[i];if(!a)return!1;const o=(a.attributes.friendly_name||"").toLowerCase(),n=i.toLowerCase(),c=this._pickerSearch.toLowerCase();return o.includes(c)||n.includes(c)}),s=Array.isArray(this.list)?this.list:[];return l`
      <div class="ha-automation-card">
        ${this.title?l`
          <div class="ha-automation-header">
            ${this.icon?l`<ha-icon icon="${this.icon}"></ha-icon>`:""}
            ${this.title}
          </div>
        `:""}
        
        <div class="ha-automation-body">
          ${s.length>0?l`
            <div class="badges-container">
              ${s.map(i=>{const a=this.hass?.states[i],o=a?.attributes?.friendly_name||i,n=a?.attributes?.icon||"mdi:cube-outline";return l`
                  <div class="entity-badge ${this.isReadOnly?"readonly":""}" title="${i}">
                    <ha-icon icon="${n}" class="badge-icon"></ha-icon>
                    <span class="badge-name">${o}</span>
                    ${this.isReadOnly?l`
                      <ha-icon icon="mdi:lock" style="color: var(--secondary-text-color); --mdc-icon-size: 14px; opacity: 0.5; margin-left: 4px;"></ha-icon>
                    `:l`
                      <ha-icon 
                        icon="mdi:close-circle" 
                        class="remove-btn" 
                        @click=${()=>this._handleRemove(i)}>
                      </ha-icon>
                    `}
                  </div>
                `})}
            </div>
          `:""}

          <div class="picker-container">
            ${this.isReadOnly?"":l`
              <div class="picker-input-wrapper" @click=${()=>this._isPickerOpen=!this._isPickerOpen}>
                <ha-icon icon="mdi:plus" style="margin-right: 8px;"></ha-icon>
                ${this.pickerPlaceholder}
              </div>
            `}

            ${this._isPickerOpen&&!this.isReadOnly?l`
              <div style="position: fixed; inset: 0; z-index: 99;" @click=${()=>this._isPickerOpen=!1}></div>
              
              <div class="picker-dropdown">
                <div class="search-box">
                  <input 
                    type="text" 
                    placeholder="Wyszukaj urządzenie..." 
                    .value=${this._pickerSearch} 
                    @input=${i=>this._pickerSearch=i.target.value}
                    @click=${i=>i.stopPropagation()}
                    autofocus
                  >
                </div>
                <div>
                  ${e.map(i=>{const a=this.hass.states[i],o=a.attributes.friendly_name||i,n=a.attributes.icon||"mdi:cube-outline",c=a.attributes.area_id||"";return l`
                      <div class="custom-picker-item" @click=${p=>{p.stopPropagation(),this._handleAdd(i)}}>
                        <ha-icon icon="${n}" class="item-icon"></ha-icon>
                        <div class="item-text">
                          <div class="item-title">
                            ${o}
                            ${c?l`<span class="area-badge">${c}</span>`:""}
                          </div>
                          <div class="item-subtitle">${i}</div>
                        </div>
                      </div>
                    `})}
                  ${e.length===0?l`
                    <div style="padding: 16px; text-align: center; color: var(--secondary-text-color); font-size: 13px;">
                      Brak wyników wyszukiwania
                    </div>
                  `:""}
                </div>
              </div>
            `:""}
          </div>
          
          <slot></slot>
        </div>
      </div>
    `}_handleAdd(t){this._isPickerOpen=!1,this._pickerSearch="",this.dispatchEvent(new CustomEvent("add-entity",{detail:{entityId:t},bubbles:!0,composed:!0}))}_handleRemove(t){this.dispatchEvent(new CustomEvent("remove-entity",{detail:{entityId:t},bubbles:!0,composed:!0}))}}customElements.define("entity-list-card",he);class pe extends v{static properties={hass:{type:Object},config:{type:Object},isReadOnly:{type:Boolean},showHaNotification:{type:Boolean}};constructor(){super(),this.config={},this.isReadOnly=!1,this.showHaNotification=!0}static styles=u`
    .row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--divider-color); }
    .row:last-child { border-bottom: none; padding-bottom: 0; }
    .slider-row { display: flex; align-items: center; gap: 16px; margin: 4px 0; }
    .slider-row span { font-size: 14px; font-weight: 500; min-width: 130px; color: var(--primary-text-color); }
    ha-slider { flex: 1; }
    ha-textfield { width: 100%; margin-top: 8px; }
    .nested-settings-in-card { margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--divider-color); display: flex; flex-direction: column; gap: 12px; }
    .ha-automation-card { margin-bottom: 16px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--card-background-color); }
    .ha-automation-header { padding: 16px; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 16px; color: var(--primary-text-color); }
    .ha-automation-body { padding: 0 16px 16px 16px; }
  `;get _t(){return this.hass?.locale?.language,{haTitle:m("channels.ha_title"),haPersistent:m("channels.ha_persistent"),haPersistentDesc:m("channels.ha_persistent_desc"),pushTitle:m("channels.push_title"),pushDnd:m("channels.push_dnd"),ttsTitle:m("channels.tts_title"),volume:m("channels.volume"),ttsRepeat:m("channels.tts_repeat"),ttsInterval:m("channels.tts_interval"),sirenTitle:m("channels.siren_title"),lightTitle:m("channels.light_title"),lightEffect:m("channels.light_effect"),scriptTitle:m("channels.script_title"),scriptSkip:m("channels.script_skip"),addEntity:m("list.add_entity")}}_updateField(t,e){this.isReadOnly||this.dispatchEvent(new CustomEvent("config-changed",{detail:{key:t,value:e},bubbles:!0,composed:!0}))}_addEntity(t,e){if(this.isReadOnly)return;const s=this.config[t]||[];s.includes(e)||this._updateField(t,[...s,e])}_removeEntity(t,e){if(this.isReadOnly)return;const s=this.config[t]||[];this._updateField(t,s.filter(i=>i!==e))}render(){const t=this.config||{},e=t.notify_ha!==!1,s=this._t;return this.isReadOnly?l`
        <div style="display:flex; flex-direction:column; gap:8px;">
          <b>${s.haPersistent}:</b> <entity-list-card .hass=${this.hass} .list=${t.notify_ha} isReadOnly></entity-list-card>
          <b>${s.pushTitle}:</b> <entity-list-card .hass=${this.hass} .list=${t.notify_push} isReadOnly></entity-list-card>
          <b>${s.ttsTitle}:</b> <entity-list-card .hass=${this.hass} .list=${t.notify_tts} isReadOnly></entity-list-card>
          <b>${s.sirenTitle}:</b> <entity-list-card .hass=${this.hass} .list=${t.notify_sirens} isReadOnly></entity-list-card>
          <b>${s.lightTitle}:</b> <entity-list-card .hass=${this.hass} .list=${t.notify_lights} isReadOnly></entity-list-card>
          <b>${s.scriptTitle}:</b> <entity-list-card .hass=${this.hass} .list=${t.notify_scripts} isReadOnly></entity-list-card>
        </div>
      `:l`
      ${this.showHaNotification?l`
        <div class="ha-automation-card">
          <div class="ha-automation-header">
            <ha-icon icon="mdi:bell-badge-outline" style="color: var(--primary-text-color); margin-right: 8px;"></ha-icon> ${s.haTitle}
          </div>
          <div class="ha-automation-body">
            <div class="row" style="border-bottom: none; padding-bottom: 0;">
              <div>
                <div style="font-weight: 500; color: var(--primary-text-color);">${s.haPersistent}</div>
                <div style="font-size: 11px; color: var(--secondary-text-color);">${s.haPersistentDesc}</div>
              </div>
              <ha-switch .checked=${e} @change=${i=>this._updateField("notify_ha",i.target.checked)}></ha-switch>
            </div>
          </div>
        </div>
      `:""}

      <entity-list-card .hass=${this.hass} title=${s.pushTitle} icon="mdi:cellphone" .domains=${["notify","device_tracker"]} .list=${t.notify_push} pickerPlaceholder=${s.addEntity}
        @add-entity=${i=>this._addEntity("notify_push",i.detail.entityId)} 
        @remove-entity=${i=>this._removeEntity("notify_push",i.detail.entityId)}>
        <div class="nested-settings-in-card">
          <ha-formfield label=${s.pushDnd}>
            <ha-switch .checked=${t.push_dnd!==!1} @change=${i=>this._updateField("push_dnd",i.target.checked)}></ha-switch>
          </ha-formfield>
        </div>
      </entity-list-card>

      <entity-list-card .hass=${this.hass} title=${s.ttsTitle} icon="mdi:speaker" .domains=${["media_player"]} .list=${t.notify_tts} pickerPlaceholder=${s.addEntity}
        @add-entity=${i=>this._addEntity("notify_tts",i.detail.entityId)} 
        @remove-entity=${i=>this._removeEntity("notify_tts",i.detail.entityId)}>
        <div class="nested-settings-in-card">
          <div class="slider-row">
            <span>${s.volume} (${t.tts_volume||80}%)</span>
            <ha-slider pin min="10" max="100" step="5" .value=${t.tts_volume||80} @change=${i=>this._updateField("tts_volume",i.target.value)}></ha-slider>
          </div>
          <ha-formfield label=${s.ttsRepeat}>
            <ha-switch .checked=${t.tts_repeat===!0} @change=${i=>this._updateField("tts_repeat",i.target.checked)}></ha-switch>
          </ha-formfield>
          ${t.tts_repeat?l`
            <ha-textfield type="number" label=${s.ttsInterval} .value=${t.tts_repeat_interval||5} @change=${i=>this._updateField("tts_repeat_interval",parseInt(i.target.value))}></ha-textfield>
          `:""}
        </div>
      </entity-list-card>

      <entity-list-card .hass=${this.hass} title=${s.sirenTitle} icon="mdi:bullhorn" .domains=${["siren"]} .list=${t.notify_sirens} pickerPlaceholder=${s.addEntity}
        @add-entity=${i=>this._addEntity("notify_sirens",i.detail.entityId)} 
        @remove-entity=${i=>this._removeEntity("notify_sirens",i.detail.entityId)}>
      </entity-list-card>

      <entity-list-card .hass=${this.hass} title=${s.lightTitle} icon="mdi:lightbulb" .domains=${["light"]} .list=${t.notify_lights} pickerPlaceholder=${s.addEntity}
        @add-entity=${i=>this._addEntity("notify_lights",i.detail.entityId)} 
        @remove-entity=${i=>this._removeEntity("notify_lights",i.detail.entityId)}>
        <div class="nested-settings-in-card">
          <ha-formfield label=${s.lightEffect}>
            <ha-switch .checked=${t.light_effect!==!1} @change=${i=>this._updateField("light_effect",i.target.checked)}></ha-switch>
          </ha-formfield>
        </div>
      </entity-list-card>

      <entity-list-card .hass=${this.hass} title=${s.scriptTitle} icon="mdi:script-text-outline" .domains=${["script","automation"]} .list=${t.notify_scripts} pickerPlaceholder=${s.addEntity}
        @add-entity=${i=>this._addEntity("notify_scripts",i.detail.entityId)} 
        @remove-entity=${i=>this._removeEntity("notify_scripts",i.detail.entityId)}>
        <div class="nested-settings-in-card">
          <ha-formfield label=${s.scriptSkip}>
            <ha-switch .checked=${t.scripts_skip_conditions!==!1} @change=${i=>this._updateField("scripts_skip_conditions",i.target.checked)}></ha-switch>
          </ha-formfield>
        </div>
      </entity-list-card>
    `}}customElements.define("notification-channels",pe);class ue extends _{static properties={hass:{type:Object},config:{type:Object},isReadOnly:{type:Boolean},titleKey:{type:String},msgKey:{type:String}};constructor(){super(),this.config={},this.isReadOnly=!1,this.titleKey="default_title",this.msgKey="default_msg"}_ha(t,e){return this.hass?.localize?.(t)||e}static styles=u`

    ha-textfield {
      width: 100%;
      margin-top: 8px;
    }

    .tag-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .tag-label {
      font-size: 11px;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-right: 4px;
    }

    .tag-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      color: var(--primary-text-color);
      transition: all 0.2s ease;
      user-select: none;
    }

    .tag-chip:hover {
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color,3,169,244),0.1);
    }

    .tag-chip ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-color);
      pointer-events: none;
    }

    .preview-box {
      margin-top: 12px;
      padding: 12px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      font-size: 13px;
    }

    .preview-title {
      font-weight: 600;
      margin-bottom: 6px;
    }

    .preview-msg {
      color: var(--secondary-text-color);
    }
  `;_updateField(t,e){this.isReadOnly||this.dispatchEvent(new CustomEvent("config-changed",{detail:{key:t,value:e},bubbles:!0,composed:!0}))}_insertTag(t,e,s){if(this.isReadOnly)return;const i=this.shadowRoot.querySelector(`#${t}`),a=this.config[s]||"";let o=a.length,n=a.length;if(i){const d=i.shadowRoot&&i.shadowRoot.querySelector("input, textarea")||i;d&&typeof d.selectionStart=="number"&&(o=d.selectionStart,n=d.selectionEnd)}let c=o>0&&a.charAt(o-1)!==" "?" ":"";const p=a.substring(0,o)+c+e+a.substring(n);this._updateField(s,p)}_generatePreview(t){if(!t)return"";const e={"{{sensor_name}}":this.tt("messages.sensor"),"{{sensor_area}}":this.tt("messages.area"),"{{device_name}}":this.tt("messages.device"),"{{time}}":new Date().toLocaleTimeString()};let s=t;return Object.entries(e).forEach(([i,a])=>{s=s.replaceAll(i,a)}),s}render(){const t=this.config||{},e=this._ha("ui.panel.config.automation.editor.actions.notify.title",this.tt("messages.title")),s=this._ha("ui.panel.config.automation.editor.actions.notify.message",this.tt("messages.message"));return this.isReadOnly?l`

        <ha-textfield
          disabled
          label="${e}"
          .value=${t[this.titleKey]||""}
        ></ha-textfield>

        <ha-textfield
          disabled
          label="${s}"
          .value=${t[this.msgKey]||""}
        ></ha-textfield>

      `:l`

      <ha-textfield
        id="title_field"
        label="${e}"
        .value=${t[this.titleKey]||""}
        @input=${i=>this._updateField(this.titleKey,i.target.value)}
      ></ha-textfield>

      <div class="tag-row">

        <span class="tag-label">${this.tt("messages.insert")}</span>

        <div class="tag-chip"
          @mousedown=${i=>{i.preventDefault(),this._insertTag("title_field","{{sensor_name}}",this.titleKey)}}>
          <ha-icon icon="mdi:radar"></ha-icon>
          ${this.tt("messages.sensor")}
        </div>

        <div class="tag-chip"
          @mousedown=${i=>{i.preventDefault(),this._insertTag("title_field","{{sensor_area}}",this.titleKey)}}>
          <ha-icon icon="mdi:view-dashboard"></ha-icon>
          ${this.tt("messages.area")}
        </div>

        <div class="tag-chip"
          @mousedown=${i=>{i.preventDefault(),this._insertTag("title_field","{{device_name}}",this.titleKey)}}>
          <ha-icon icon="mdi:valve"></ha-icon>
          ${this.tt("messages.device")}
        </div>

        <div class="tag-chip"
          @mousedown=${i=>{i.preventDefault(),this._insertTag("title_field","{{time}}",this.titleKey)}}>
          <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
          ${this.tt("messages.time")}
        </div>

      </div>

      <ha-textfield
        id="msg_field"
        label="${s}"
        .value=${t[this.msgKey]||""}
        @input=${i=>this._updateField(this.msgKey,i.target.value)}
      ></ha-textfield>

      <div class="tag-row">

        <span class="tag-label">${this.tt("messages.insert")}</span>

        <div class="tag-chip"
          @mousedown=${i=>{i.preventDefault(),this._insertTag("msg_field","{{sensor_name}}",this.msgKey)}}>
          <ha-icon icon="mdi:radar"></ha-icon>
          ${this.tt("messages.sensor")}
        </div>

        <div class="tag-chip"
          @mousedown=${i=>{i.preventDefault(),this._insertTag("msg_field","{{sensor_area}}",this.msgKey)}}>
          <ha-icon icon="mdi:view-dashboard"></ha-icon>
          ${this.tt("messages.area")}
        </div>

        <div class="tag-chip"
          @mousedown=${i=>{i.preventDefault(),this._insertTag("msg_field","{{device_name}}",this.msgKey)}}>
          <ha-icon icon="mdi:valve"></ha-icon>
          ${this.tt("messages.device")}
        </div>

        <div class="tag-chip"
          @mousedown=${i=>{i.preventDefault(),this._insertTag("msg_field","{{time}}",this.msgKey)}}>
          <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
          ${this.tt("messages.time")}
        </div>

      </div>

      <div class="preview-box">

        <div class="preview-title">
          ${this.tt("messages.preview")}
        </div>

        <div class="preview-title">
          ${this._generatePreview(t[this.titleKey]||"")}
        </div>

        <div class="preview-msg">
          ${this._generatePreview(t[this.msgKey]||"")}
        </div>

      </div>

    `}}customElements.define("custom-messages",ue);class me extends _{static properties={hass:{type:Object},_activeTab:{type:Number,state:!0},_localConfig:{state:!0}};constructor(){super(),this._activeTab=0,this._localConfig={},this.categories=[{id:"water",icon:"mdi:water"},{id:"fire",icon:"mdi:fire"},{id:"gas",icon:"mdi:gas-cylinder"},{id:"temperature",icon:"mdi:thermometer"},{id:"power",icon:"mdi:power-plug"}]}static styles=u`
:host{display:block;padding:20px}

ha-card{
border-radius:12px;
margin-bottom:24px;
overflow:visible!important;
}

.card-content{
padding:16px;
display:flex;
flex-direction:column;
gap:16px;
}

.card-header-custom{
display:flex;
justify-content:space-between;
align-items:center;
padding:16px 16px 0 16px;
}

.card-header-title{
font-size:20px;
display:flex;
align-items:center;
gap:12px;
color:var(--primary-text-color);
}

.card-header-icon{
color:var(--primary-color);
--mdc-icon-size:26px;
}

.tabs-container{
display:flex;
gap:8px;
overflow-x:auto;
padding:4px;
margin-bottom:24px;
border-bottom:1px solid var(--divider-color);
}

.tab-item{
display:flex;
align-items:center;
gap:8px;
padding:12px 16px;
cursor:pointer;
color:var(--secondary-text-color);
border-bottom:2px solid transparent;
font-weight:500;
white-space:nowrap;
}

.tab-item.active{
color:var(--primary-color);
border-bottom-color:var(--primary-color);
}

.bottom-actions{
display:flex;
justify-content:flex-end;
gap:12px;
margin-top:24px;
padding:16px;
background:var(--card-background-color);
border-radius:12px;
border:1px solid var(--divider-color);
}

.btn-test{--mdc-theme-primary:var(--error-color)}
.btn-test-notify{--mdc-theme-primary:var(--warning-color)}
.btn-dismiss{--mdc-theme-primary:var(--success-color)}
`;willUpdate(t){if(t.has("hass")){const e=this._getEntity("sensor","status");if(!e)return;const s=this.hass.states[e]?.attributes?.category_config;s&&(this._localConfig=structuredClone(s))}}_getEntity(t,e){return this.hass?Object.keys(this.hass.states).find(s=>{const i=this.hass.states[s]?.attributes||{};return s.startsWith(`${t}.`)&&i.unique_key===e}):null}_updateSetting(t,e,s){this.hass.callService("safety","update_settings",{category:t,key:e,value:s})}_updateChannel(t,e,s){this._localConfig&&(this._localConfig={...this._localConfig,[t]:{...this._localConfig[t],[e]:s}},this.requestUpdate(),this._updateSetting(t,e,s))}_addEntity(t,e,s){const i=this._localConfig?.[t]?.[e]||[];if(i.includes(s))return;const a=[...i,s];this._localConfig={...this._localConfig,[t]:{...this._localConfig[t],[e]:a}},this.requestUpdate(),this._updateSetting(t,e,a)}_removeEntity(t,e,s){const a=(this._localConfig?.[t]?.[e]||[]).filter(o=>o!==s);this._localConfig={...this._localConfig,[t]:{...this._localConfig[t],[e]:a}},this.requestUpdate(),this._updateSetting(t,e,a)}render(){const t={sensorsTitle:this.tt("hazards.sensors")||"Sensors",actuatorsTitle:this.tt("hazards.actuators")||"Actuators",sensorsCardTitle:this.tt("hazards.sensors_card")||"Detection Sensors",actuatorsCardTitle:this.tt("hazards.actuators_card")||"Execution Devices",addEntity:this.tt("list.add_entity")||"Add entity...",matrixTitle:this.tt("hazards.matrix")||"Home Modes Matrix",channelsTitle:this.tt("hazards.channels")||"Notification Channels",messagesTitle:this.tt("hazards.messages")||"Messages",testNotify:this.tt("hazards.test_notify")||"Test Notifications",testAlarm:this.tt("hazards.test_alarm")||"Simulate Alarm",dismiss:this.tt("hazards.dismiss")||"Dismiss Alarm"},e=this.categories[this._activeTab].id,s=this._localConfig||{},i=s.global||{},a=s[e]||{},o=i.use_home_modes===!0;return l`

<div class="tabs-container">

${this.categories.map((n,c)=>l`

<div
class="tab-item ${this._activeTab===c?"active":""}"
@click=${()=>this._activeTab=c}>

<ha-icon icon="${n.icon}"></ha-icon>
${this.tt(`hazards.categories.${n.id}`)}

</div>

`)}

</div>

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:radar" class="card-header-icon"></ha-icon>
${t.sensorsTitle}
</div>
</div>

<div class="card-content">

<entity-list-card
.hass=${this.hass}
.category=${e}
title=${t.sensorsCardTitle}
icon="mdi:eye-outline"
.domains=${["binary_sensor","sensor"]}
.list=${a.sensors}
pickerPlaceholder=${t.addEntity}
@add-entity=${n=>this._addEntity(e,"sensors",n.detail.entityId)}
@remove-entity=${n=>this._removeEntity(e,"sensors",n.detail.entityId)}
></entity-list-card>

</div>

</ha-card>

${o?l`

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:home-account" class="card-header-icon"></ha-icon>
${t.matrixTitle}
</div>
</div>

<div class="card-content">

<matrix-table
.matrix=${a.mode_matrix}
@matrix-change=${n=>this._updateSetting(e,"mode_matrix",n.detail.matrix)}
></matrix-table>

</div>

</ha-card>

`:""}

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:valve" class="card-header-icon"></ha-icon>
${t.actuatorsTitle}
</div>
</div>

<div class="card-content">

<entity-list-card
.hass=${this.hass}
.category=${e}
title=${t.actuatorsCardTitle}
icon="mdi:power-plug"
.domains=${["switch","valve","cover","button"]}
.list=${a.actuators}
pickerPlaceholder=${t.addEntity}
@add-entity=${n=>this._addEntity(e,"actuators",n.detail.entityId)}
@remove-entity=${n=>this._removeEntity(e,"actuators",n.detail.entityId)}
></entity-list-card>

</div>

</ha-card>

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:bell-ring" class="card-header-icon"></ha-icon>
${t.channelsTitle}
</div>
</div>

<div class="card-content">

<notification-channels
.hass=${this.hass}
.config=${a}
@config-changed=${n=>this._updateChannel(e,n.detail.key,n.detail.value)}
></notification-channels>

</div>

</ha-card>

<ha-card>

<div class="card-header-custom">
<div class="card-header-title">
<ha-icon icon="mdi:message-alert" class="card-header-icon"></ha-icon>
${t.messagesTitle}
</div>
</div>

<div class="card-content">

<custom-messages
.hass=${this.hass}
.config=${a}
titleKey="custom_title"
msgKey="custom_msg"
@config-changed=${n=>this._updateChannel(e,n.detail.key,n.detail.value)}
></custom-messages>

</div>

</ha-card>

<div class="bottom-actions">

<ha-button raised class="btn-test-notify"
@click=${()=>this.hass.callService("safety","test_alert",{category:e,execute_actions:!1})}>
${t.testNotify}
</ha-button>

<ha-button raised class="btn-test"
@click=${()=>this.hass.callService("safety","test_alert",{category:e,execute_actions:!0})}>
${t.testAlarm}
</ha-button>

<ha-button raised class="btn-dismiss"
@click=${()=>this.hass.callService("safety","dismiss_alert",{category:e})}>
${t.dismiss}
</ha-button>

</div>

`}}customElements.define("tab-hazards",me);class ge extends v{static properties={hass:{type:Object}};tt(t,e){return m(t,this.hass,e)}static styles=u`
    :host { display:block; padding:20px; }

    .floor-section { margin-bottom:32px; }

    .floor-title{
      font-size:18px;
      font-weight:500;
      color:var(--primary-text-color);
      margin:0 0 16px 4px;
      display:flex;
      align-items:center;
      gap:8px;
      padding-bottom:8px;
      border-bottom:1px solid var(--divider-color);
    }

    .floor-title.alert-title{
      color:var(--error-color);
      border-bottom-color:rgba(244,67,54,0.3);
    }

    .areas-grid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
      gap:16px;
    }

    ha-card{
      display:flex;
      flex-direction:column;
      border-radius:var(--ha-card-border-radius,12px);
      transition:transform .2s ease, box-shadow .2s ease;
      height:100%;
    }

    ha-card:hover{
      transform:translateY(-2px);
      box-shadow:0 4px 8px rgba(0,0,0,.1);
    }

    .area-header{
      padding:16px;
      font-size:16px;
      font-weight:500;
      display:flex;
      justify-content:space-between;
      align-items:center;
      border-bottom:1px solid var(--divider-color);
      background-color:var(--secondary-background-color,rgba(120,120,120,.05));
    }

    .area-header.alert{
      background-color:rgba(244,67,54,.1);
      color:var(--error-color);
      border-bottom-color:rgba(244,67,54,.2);
    }

    .area-title-wrap{
      display:flex;
      align-items:center;
      gap:10px;
    }

    .entities-list{
      padding:8px 16px 16px 16px;
      display:flex;
      flex-direction:column;
      flex-grow:1;
    }

    .group-divider{
      border-bottom:1px solid var(--divider-color);
      margin:8px 0;
    }

    .entity-row{
      display:flex;
      align-items:center;
      padding:8px 0;
      cursor:pointer;
    }

    .entity-icon{
      width:32px;
      height:32px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      margin-right:12px;
      background:var(--secondary-background-color);
    }

    .entity-info{
      flex-grow:1;
      display:flex;
      flex-direction:column;
    }

    .entity-name{
      font-size:14px;
    }

    .entity-secondary{
      font-size:12px;
      color:var(--secondary-text-color);
      display:flex;
      gap:8px;
      margin-top:2px;
    }

    .entity-state{
      font-weight:500;
      font-size:14px;
      text-align:right;
    }

    .state-unavailable{ opacity:.5 }

    .badge-error{ color:var(--error-color) }
  `;_getMonitoredEntities(){const t=Object.keys(this.hass.states).find(i=>i.startsWith("sensor.")&&this.hass.states[i].attributes?.unique_key==="status");if(!t)return[];const e=this.hass.states[t].attributes.category_config||{},s=new Set;return Object.values(e).forEach(i=>{i.sensors&&i.sensors.forEach(a=>s.add(a)),i.actuators&&i.actuators.forEach(a=>s.add(a)),i.sirens&&i.sirens.forEach(a=>s.add(a))}),Array.from(s)}_getAreaForEntity(t){const e=this.hass.entities?.[t];if(e?.area_id)return e.area_id;if(e?.device_id){const s=this.hass.devices?.[e.device_id];if(s?.area_id)return s.area_id}return null}_getAreasData(){const t=this._getMonitoredEntities(),e={};t.forEach(i=>{const a=this.hass.states[i];if(!a)return;let o=this._getAreaForEntity(i)||"unknown";e[o]||(e[o]=[]);const n=["smoke","gas","moisture","carbon_monoxide","heat"].includes(a.attributes.device_class),c=a.state==="on",p=["unavailable","unknown"].includes(a.state),d=a.attributes.battery_level??a.attributes.battery,h=d!==void 0&&d<=25,y=new Date(a.last_updated).getTime(),b=(new Date().getTime()-y)/(1e3*60*60),D=b>1&&!p,Ot=Math.floor(b/24),jt=D?this.tt("status.no_response_days",{days:Ot}):null;let A="ok";c&&n?A="hazard":p?A="unavailable":D?A="zombie":h&&(A="low_battery"),e[o].push({id:i,stateObj:a,group:A,battery:d,isLowBattery:h,zombieText:jt,isUnavailable:p})});const s=[];return Object.keys(e).forEach(i=>{const a=this.hass.areas?.[i]??{area_id:"unknown",name:this.tt("status.unassigned_area"),floor_id:null},o=e[i],n=o.filter(c=>c.group==="hazard").length;s.push({area:a,entities:o,activeAlerts:n})}),s}_openMoreInfo(t){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}_renderEntityRow(t){const e=t.stateObj.attributes.friendly_name||t.id;return l`

      <div
        class="entity-row ${t.isUnavailable?"state-unavailable":""}"
        @click=${()=>this._openMoreInfo(t.id)}
      >

        <div class="entity-icon">
          <ha-state-icon
            .hass=${this.hass}
            .stateObj=${t.stateObj}>
          </ha-state-icon>
        </div>

        <div class="entity-info">

          <div class="entity-name">${e}</div>

          <div class="entity-secondary">

            ${t.zombieText?l`<span class="badge-error">${t.zombieText}</span>`:""}

            ${t.battery!==void 0?l`<span class="${t.isLowBattery?"badge-error":""}">
                ${t.battery}%
              </span>`:""}

            ${t.isUnavailable?l`<span class="badge-error">
                ${this.tt("status.offline")}
              </span>`:""}

          </div>

        </div>

        <div class="entity-state">
          ${this.hass.formatEntityState(t.stateObj)}
        </div>

      </div>

    `}_renderAreaCard(t){return l`

      <ha-card outlined>

        <div class="area-header ${t.activeAlerts>0?"alert":""}">

          <div class="area-title-wrap">
            <div class="area-name">${t.area.name}</div>
          </div>

          ${t.activeAlerts>0?l`<ha-icon icon="mdi:shield-alert"></ha-icon>`:""}

        </div>

        <div class="entities-list">

          ${t.entities.map(e=>this._renderEntityRow(e))}

        </div>

      </ha-card>

    `}_renderFloorSection(t,e,s,i=!1){return l`

      <div class="floor-section">

        ${t?l`
            <div class="floor-title ${i?"alert-title":""}">
              <ha-icon icon="${s}"></ha-icon>
              ${t}
            </div>
          `:""}

        <div class="areas-grid">

          ${e.map(a=>this._renderAreaCard(a))}

        </div>

      </div>

    `}render(){if(!this.hass)return l``;const t=this._getAreasData(),e=[],s=[],i={};this.hass.floors&&Object.values(this.hass.floors).forEach(o=>{i[o.floor_id]={name:o.name,level:o.level||0,icon:o.icon||"mdi:home",areas:[]}}),t.forEach(o=>{o.activeAlerts>0?e.push(o):o.area.floor_id&&i[o.area.floor_id]?i[o.area.floor_id].areas.push(o):s.push(o)});const a=Object.values(i).filter(o=>o.areas.length>0).sort((o,n)=>n.level-o.level);return l`

      ${e.length>0?this._renderFloorSection("",e,"mdi:alert-circle-outline",!0):""}

      ${a.map(o=>this._renderFloorSection(o.name,o.areas,o.icon))}

      ${s.length>0?this._renderFloorSection(Object.keys(i).length>0?this.tt("status.other_rooms"):this.tt("status.rooms"),s,"mdi:home-outline"):""}

    `}}customElements.define("tab-status",ge);class fe extends _{static properties={hass:{type:Object}};static styles=u`
    ha-card { border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:20px; }
    .header { font-size:18px;font-weight:500;display:flex;align-items:center;gap:8px; }

    .score-container { display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid var(--divider-color); }

    .score-circle {
      width:80px;height:80px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:28px;font-weight:bold;color:white;
      box-shadow:0 4px 10px rgba(0,0,0,0.2);
    }

    .score-info { flex:1;margin-left:20px; }
    .score-status { font-size:18px;font-weight:500; }

    .score-trend {
      font-size:14px;color:var(--secondary-text-color);
      display:flex;align-items:center;gap:4px;margin-top:4px;
    }

    .audit-grid { display:flex;flex-direction:column;gap:12px; }

    .audit-row { display:flex;align-items:center;justify-content:space-between;font-size:13px; }

    .audit-label { width:40%;color:var(--secondary-text-color);display:flex;align-items:center;gap:8px; }

    .audit-bar-bg {
      flex:1;height:8px;background:var(--secondary-background-color);
      border-radius:4px;overflow:hidden;margin:0 12px;
    }

    .audit-bar-fill { height:100%;border-radius:4px;transition:width .5s ease; }

    .audit-value { width:30px;text-align:right;font-weight:500; }
  `;_getColor(t){return t>=90?"#4caf50":t>=70?"#ffc107":t>=40?"#ff9800":"#f44336"}_getStatus(t){return t>=90?this.tt("analytics.status_very_safe"):t>=70?this.tt("analytics.status_good"):t>=40?this.tt("analytics.status_medium"):this.tt("analytics.status_low")}render(){const t=this.hass?.states["sensor.home_safety_score"],e=t?parseInt(t.state):78,s=this.hass?.states["sensor.home_safety_trend"],i=s?s.state:"improving",o=this.hass?.states["sensor.home_safety_audit"]?.attributes||{fire_safety:80,water_safety:60,gas_safety:40,environment:90,power_safety:70,coverage:65},n=i==="improving"?"mdi:trending-up":i==="declining"?"mdi:trending-down":"mdi:trending-neutral",c=i==="improving"?this.tt("analytics.trend_improving"):i==="declining"?this.tt("analytics.trend_declining"):this.tt("analytics.trend_stable"),p=[{id:"fire_safety",icon:"mdi:fire",label:this.tt("analytics.cat_fire")},{id:"water_safety",icon:"mdi:water",label:this.tt("analytics.cat_water")},{id:"gas_safety",icon:"mdi:gas-cylinder",label:this.tt("analytics.cat_gas")},{id:"environment",icon:"mdi:thermometer",label:this.tt("analytics.cat_env")},{id:"power_safety",icon:"mdi:flash",label:this.tt("analytics.cat_power")},{id:"coverage",icon:"mdi:radar",label:this.tt("analytics.cat_coverage")}];return l`
      <ha-card>

        <div class="header">
          <ha-icon icon="mdi:shield-home"></ha-icon>
          ${this.tt("analytics.score_title")}
        </div>

        <div class="score-container">
          <div class="score-circle" style="background:${this._getColor(e)}">
            ${e}
          </div>

          <div class="score-info">

            <div class="score-status" style="color:${this._getColor(e)}">
              ${this._getStatus(e)}
            </div>

            <div class="score-trend">
              <ha-icon icon="${n}"></ha-icon>
              ${c}
            </div>

          </div>
        </div>

        <div class="header">
          <ha-icon icon="mdi:clipboard-check-outline"></ha-icon>
          ${this.tt("analytics.audit_title")}
        </div>

        <div class="audit-grid">

          ${p.map(d=>{const h=o[d.id]||0;return l`

              <div class="audit-row">

                <div class="audit-label">
                  <ha-icon icon="${d.icon}"></ha-icon>
                  ${d.label}
                </div>

                <div class="audit-bar-bg">
                  <div class="audit-bar-fill"
                       style="width:${h}%;background:${this._getColor(h)}">
                  </div>
                </div>

                <div class="audit-value">${h}</div>

              </div>

            `})}

        </div>

      </ha-card>
    `}}customElements.define("analytics-audit-card",fe);class ye extends _{static properties={hass:{type:Object}};static styles=u`

    ha-card {
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .header {
      font-size: 18px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-text-color);
    }

    .all-safe-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(var(--rgb-success-color, 76, 175, 80), 0.1);
      border-radius: 8px;
      color: var(--success-color);
      font-weight: 500;
    }

    .risk-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .risk-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      cursor: pointer;
      transition: background-color 0.2s, box-shadow 0.2s;
    }

    .risk-item:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .risk-item.critical {
      background: rgba(var(--rgb-error-color, 244, 67, 54), 0.1);
      border-color: var(--error-color);
    }

    .risk-item.critical:hover {
      background: rgba(var(--rgb-error-color, 244, 67, 54), 0.2);
    }

    .risk-item.safe {
      background: var(--card-background-color);
    }

    .risk-item.safe:hover {
      background: var(--secondary-background-color);
    }

    .risk-info {
      flex: 1;
    }

    .risk-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color);
    }

    .risk-desc {
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    .risk-value {
      font-weight: 500;
      color: var(--primary-text-color);
    }

  `;_openMoreInfo(t){if(!t)return;const e=new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0});this.dispatchEvent(e)}_getTemperatureRisks(){const t=[];return((Object.values(this.hass.states).find(a=>a.attributes.unique_key==="status")?.attributes?.category_config?.temperature||{}).sensors||[]).forEach(a=>{const o=this.hass.states[a];if(!o||isNaN(o.state))return;const n=parseFloat(o.state),c=o.attributes.friendly_name||a,p=o.attributes.unit_of_measurement||"°C";n<=5&&t.push({entityId:a,type:"freeze",critical:n<=0,title:this.tt("analytics.freeze_risk"),desc:`${c}: `,value:`${n}${p}`}),n>=45&&t.push({entityId:a,type:"overheat",critical:n>=60,title:this.tt("analytics.overheat_risk"),desc:`${c}: `,value:`${n}${p}`})}),t}_getSafeMonitoredEntities(t){const s=Object.values(this.hass.states).find(a=>a.attributes.unique_key==="status")?.attributes?.category_config||{},i=new Set;return s.temperature?.sensors&&s.temperature.sensors.forEach(a=>i.add(a)),Object.keys(s).forEach(a=>{a!=="global"&&s[a].predictions&&s[a].predictions.forEach(o=>i.add(o))}),Array.from(i).filter(a=>!t.includes(a)&&this.hass.states[a]).map(a=>this.hass.states[a])}render(){const t=this._getTemperatureRisks(),e=t.map(o=>o.entityId),s=this._getSafeMonitoredEntities(e),i=this.tt("analytics.no_predictions"),a=this.tt("analytics.monitoring_safe");return l`

      <ha-card>

        <div class="header">

          <ha-icon
            icon="mdi:brain"
            style="color: var(--primary-color)"
          ></ha-icon>

          ${this.tt("analytics.predictions_title")}

        </div>

        ${t.length===0?l`
              <div class="all-safe-header">

                <ha-icon
                  icon="mdi:shield-check-outline"
                  style="--mdc-icon-size: 28px;"
                ></ha-icon>

                <div>${i}</div>

              </div>
            `:""}

        <div class="risk-list">

          ${t.map(o=>l`

            <div
              class="risk-item ${o.critical?"critical":""}"
              @click=${()=>this._openMoreInfo(o.entityId)}
            >

              <ha-icon
                icon="${o.type==="freeze"?"mdi:snowflake":"mdi:thermometer-alert"}"
                style="color:${o.critical?"var(--error-color)":"var(--warning-color)"};--mdc-icon-size:24px;"
              ></ha-icon>

              <div class="risk-info">

                <div class="risk-title">${o.title}</div>

                <div class="risk-desc">
                  ${o.desc}
                  <span class="risk-value">${o.value}</span>
                </div>

              </div>

            </div>

          `)}

          ${s.map(o=>{const n=o.state,c=o.attributes.unit_of_measurement||"",p=o.attributes.friendly_name||o.entity_id,d=o.attributes.icon||"mdi:check-circle-outline";return l`

              <div
                class="risk-item safe"
                @click=${()=>this._openMoreInfo(o.entity_id)}
              >

                <ha-icon
                  icon="${d}"
                  style="color:var(--success-color);--mdc-icon-size:24px;"
                ></ha-icon>

                <div class="risk-info">

                  <div class="risk-title">${p}</div>

                  <div class="risk-desc">
                    ${a}
                    <span class="risk-value">
                      (${n}${c})
                    </span>
                  </div>

                </div>

              </div>

            `})}

        </div>

      </ha-card>

    `}}customElements.define("analytics-predictions-card",ye);function _e(r){const t=Object.values(r.states).find(a=>a.attributes?.unique_key==="status");if(!t)return[];const e=t.attributes?.category_config||{},s=[],i={fire:{hardware:"devices.smoke_sensor",icon:"mdi:smoke-detector",link:"https://www.amazon.com/smoke-detector"},water:{hardware:"devices.water_leak_sensor",icon:"mdi:water-alert",link:"https://www.amazon.com/water-leak-sensor"},gas:{hardware:"devices.co_detector",icon:"mdi:molecule-co",link:"https://www.amazon.com/co-detector"},temperature:{hardware:"devices.temperature_sensor",icon:"mdi:thermometer",link:"https://www.amazon.com/temperature-sensor"},power:{hardware:"devices.power_meter",icon:"mdi:flash",link:"https://www.amazon.com/power-meter"}};return Object.keys(i).forEach(a=>{(e[a]?.sensors||[]).length||s.push({category:a,hardwareKey:i[a].hardware,icon:i[a].icon,link:i[a].link})}),s}class ve extends _{static properties={hass:{type:Object},_targetScore:{type:Number,state:!0}};constructor(){super(),this._targetScore=90}static styles=u`

    ha-card {
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .header {
      font-size: 18px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .goal-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 8px;
    }

    .goal-label {
      font-size: 14px;
      font-weight: 500;
    }

    .goal-value {
      font-size: 18px;
      font-weight: bold;
      width: 40px;
      text-align: right;
      color: var(--primary-color);
    }

    .reco-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .reco-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      padding: 12px;
    }

    .reco-text {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .buy-btn {
      --mdc-theme-primary: var(--success-color);
      --mdc-typography-button-font-size: 12px;
    }

  `;render(){const t=_e(this.hass);return l`

      <ha-card>

        <div class="header">

          <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>

          ${this.tt("analytics.reco_title")}

        </div>

        <div class="goal-row">

          <div class="goal-label">
            ${this.tt("analytics.target_score")}
          </div>

          <ha-slider
            pin
            min="50"
            max="100"
            step="5"
            .value=${this._targetScore}
            @change=${e=>this._targetScore=e.target.value}
          ></ha-slider>

          <div class="goal-value">
            ${this._targetScore}
          </div>

        </div>

        <div>

          ${this.tt("analytics.missing_to_reach",{target:this._targetScore})}

        </div>

        <div class="reco-list">

          ${t.map(e=>l`

            <div class="reco-item">

              <div class="reco-text">

                <ha-icon icon="${e.icon}"></ha-icon>

                ${this.tt(e.hardwareKey)}

              </div>

              <ha-button
                class="buy-btn"
                @click=${()=>window.open(e.link,"_blank")}
              >

                <ha-icon icon="mdi:cart-outline"></ha-icon>

                ${this.tt("analytics.buy_now")}

              </ha-button>

            </div>

          `)}

        </div>

      </ha-card>

    `}}customElements.define("analytics-recommendations-card",ve);class be extends _{static properties={hass:{type:Object}};static styles=u`
    :host {
      display: block;
      padding: 20px;
    }

    .grid-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: start;
    }

    @media (max-width: 800px) {
      .grid-layout {
        grid-template-columns: 1fr;
      }
    }
  `;render(){return l`

      <div class="grid-layout">

        <analytics-audit-card
          .hass=${this.hass}
        ></analytics-audit-card>

        <div style="display:flex;flex-direction:column;gap:24px;">

          <analytics-predictions-card
            .hass=${this.hass}
          ></analytics-predictions-card>

          <analytics-recommendations-card
            .hass=${this.hass}
          ></analytics-recommendations-card>

        </div>

      </div>

    `}}customElements.define("tab-analytics",be);class xe extends v{static properties={open:{type:Boolean},title:{type:String},text:{type:String},icon:{type:String},confirmText:{type:String},cancelText:{type:String},isDanger:{type:Boolean}};constructor(){super(),this.open=!1,this.title="Confirmation",this.text="Are you sure you want to perform this action?",this.icon="mdi:alert-circle-outline",this.confirmText="Confirm",this.cancelText="Cancel",this.isDanger=!1}static styles=u`
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
    .modal-overlay.open { opacity: 1; pointer-events: auto; }
    .modal-card { background: var(--card-background-color, #1c1c1c); padding: 24px; border-radius: 12px; max-width: 450px; width: 90%; box-shadow: 0 8px 24px rgba(0,0,0,0.3); border: 1px solid var(--divider-color, #444); z-index: 1001; transform: translateY(20px); transition: transform 0.2s ease; }
    .modal-overlay.open .modal-card { transform: translateY(0); }
    .modal-title { font-size: 18px; font-weight: 500; margin-bottom: 12px; color: var(--primary-text-color); display: flex; align-items: center; gap: 8px; }
    .modal-text { font-size: 14px; color: var(--secondary-text-color); margin-bottom: 24px; line-height: 1.5; white-space: pre-wrap; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
    .danger-btn { --mdc-theme-primary: var(--error-color, #f44336); }
  `;render(){return l`
      <div class="modal-overlay ${this.open?"open":""}" @click=${this._handleBackdropClick}>
        <div class="modal-card" @click=${t=>t.stopPropagation()}>
          <div class="modal-title">
            <ha-icon icon="${this.icon}" style="color: ${this.isDanger?"var(--error-color)":"var(--primary-color)"};"></ha-icon>
            ${this.title}
          </div>
          <div class="modal-text">${this.text}</div>
          <div class="modal-actions">
            <ha-button @click=${this._handleCancel}>${this.cancelText}</ha-button>
            <ha-button raised class="${this.isDanger?"danger-btn":""}" @click=${this._handleConfirm}>
              ${this.confirmText}
            </ha-button>
          </div>
        </div>
      </div>
    `}_handleBackdropClick(){this._handleCancel()}_handleCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_handleConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}}customElements.define("confirm-dialog",xe);class $e extends _{static properties={hass:{type:Object},config:{type:Object},_dialogState:{type:Object,state:!0}};constructor(){super(),this._dialogState=null,this._pendingSwitchTarget=null}static styles=u`

    ha-card {
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--divider-color);
    }

    .row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

  `;_getEntity(t,e){return this.hass?Object.keys(this.hass.states).find(s=>s.startsWith(`${t}.`)&&this.hass.states[s]?.attributes?.unique_key===e):null}_update(t,e){this.dispatchEvent(new CustomEvent("update-setting",{detail:{key:t,value:e},bubbles:!0,composed:!0}))}_handleToggleWithConfirm(t,e,s,i,a,o){const n=e===!0;this._dialogState={settingKey:t,title:n?this.tt(a)||"Wyłączenie automatyzacji":this.tt(s)||"Włączenie automatyzacji",text:n?this.tt(o)||"Obecnie przypisane elementy pozostaną na liście, ale od teraz będziesz mógł je edytować, dodawać i usuwać ręcznie. Czy chcesz kontynuować?":this.tt(i)||"System automatycznie wyszuka i zablokuje możliwość ręcznej edycji tych elementów. Czy chcesz kontynuować?"}}_confirmDialog(){if(this._dialogState){const t=this._dialogState.settingKey,e=this._pendingSwitchTarget?this._pendingSwitchTarget.checked:!0;this._update(t,e),this._dialogState=null,this._pendingSwitchTarget=null}}_cancelDialog(){this._pendingSwitchTarget&&(this._pendingSwitchTarget.checked=!this._pendingSwitchTarget.checked),this._dialogState=null,this._pendingSwitchTarget=null}_closeDialog(){this._pendingSwitchTarget&&(this._pendingSwitchTarget.checked=!this._pendingSwitchTarget.checked,this._pendingSwitchTarget=null),this._dialogState=null}render(){const t=this.config||{},e=this._getEntity("switch","global_service"),s=e&&this.hass.states[e]?this.hass.states[e].state==="on":!1,i=t.auto_config_sensors===!0,a=t.auto_config_actuators===!0;return l`

      <confirm-dialog
        ?open=${this._dialogState!==null}
        .title=${this._dialogState?.title||""}
        .text=${this._dialogState?.text||""}
        .icon=${this._dialogState?.icon||"mdi:alert"}
        .isDanger=${this._dialogState?.isDanger===!0}
        confirmText="${this.tt("system.confirm")}"
        cancelText="${this.tt("system.cancel")}"
        @confirm=${this._confirmDialog}
        @cancel=${this._closeDialog}
      ></confirm-dialog>

      <ha-card header="${this.tt("system.title")}">

        <div class="card-content">

          <div class="row">

            <div style="display:flex; align-items:center; gap:12px;">

              <ha-icon
                icon="mdi:shield-off-outline"
                style="color:${s?"var(--primary-color)":"var(--secondary-text-color)"}"
              ></ha-icon>

              <div>

                <div style="font-weight:500;">
                  ${this.tt("system.service_mode")}
                </div>

                <div style="font-size:11px;color:var(--secondary-text-color)">
                  ${this.tt("system.service_mode_desc")}
                </div>

              </div>

            </div>

          <ha-switch
              .checked=${s}
              @change=${()=>this.hass.callService("switch",s?"turn_off":"turn_on",{entity_id:e})}
            ></ha-switch>

          </div>

          <div class="row">

            <div style="display:flex; align-items:center; gap:12px;">

              <ha-icon
                icon="mdi:radar"
                style="color:${i?"var(--primary-color)":"var(--secondary-text-color)"}"
              ></ha-icon>

              <div>

                <div style="font-weight:500;">
                  ${this.tt("system.auto_sensors")}
                </div>

                <div style="font-size:11px;color:var(--secondary-text-color)">
                  ${this.tt("system.auto_sensors_desc")}
                </div>

              </div>

            </div>

            <ha-switch
              .checked=${i}
              @change=${o=>{this._pendingSwitchTarget=o.target,this._handleToggleWithConfirm("auto_config_sensors",i,"popup_sensors_on_title","popup_sensors_on_text","popup_sensors_off_title","popup_sensors_off_text")}}
            ></ha-switch>

          </div>

          <div class="row">

            <div style="display:flex; align-items:center; gap:12px;">

              <ha-icon
                icon="mdi:valve"
                style="color:${a?"var(--primary-color)":"var(--secondary-text-color)"}"
              ></ha-icon>

              <div>

                <div style="font-weight:500;">
                  ${this.tt("system.auto_actuators")}
                </div>

                <div style="font-size:11px;color:var(--secondary-text-color)">
                  ${this.tt("system.auto_actuators_desc")}
                </div>

              </div>

            </div>

            <ha-switch
              .checked=${a}
              @change=${o=>{this._pendingSwitchTarget=o.target,this._handleToggleWithConfirm("auto_config_actuators",a,"popup_actuators_on_title","popup_actuators_on_text","popup_actuators_off_title","popup_actuators_off_text")}}
            ></ha-switch>

          </div>

        </div>

      </ha-card>
    `}}customElements.define("settings-system",$e);class we extends _{static properties={hass:{type:Object},config:{type:Object},_dialogState:{type:Object,state:!0}};constructor(){super(),this._dialogState=null,this._pendingSwitchTarget=null}static styles=u`

    ha-card {
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .card-header-custom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px 0 16px;
    }

    .card-header-title {
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .card-header-icon {
      color: var(--primary-color);
    }

    .card-content {
      padding: 16px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

  `;_update(t,e){this.dispatchEvent(new CustomEvent("update-setting",{detail:{key:t,value:e},bubbles:!0,composed:!0}))}_handleToggleWithConfirm(t,e,s,i,a,o){const n=e===!0;this._dialogState={settingKey:t,title:n?this.tt(a)||"Wyłączenie automatyzacji":this.tt(s)||"Włączenie automatyzacji",text:n?this.tt(o)||"Obecnie przypisane elementy pozostaną na liście, ale od teraz będziesz mógł je edytować, dodawać i usuwać ręcznie. Czy chcesz kontynuować?":this.tt(i)||"System automatycznie wyszuka i zablokuje możliwość ręcznej edycji tych elementów. Czy chcesz kontynuować?"}}_confirmDialog(){if(this._dialogState){const t=this._dialogState.settingKey,e=this._pendingSwitchTarget?this._pendingSwitchTarget.checked:!0;this._update(t,e),this._dialogState=null,this._pendingSwitchTarget=null}}_cancelDialog(){this._pendingSwitchTarget&&(this._pendingSwitchTarget.checked=!this._pendingSwitchTarget.checked),this._dialogState=null,this._pendingSwitchTarget=null}render(){const t=this.config||{},e=t.use_predictions===!0,s=t.auto_predictions!==!1;return l`

      ${this._dialogState?l`
     <confirm-dialog
       .title=${this._dialogState.title}
       .text=${this._dialogState.text}
       @confirm=${this._confirmDialog}
       @cancel=${this._cancelDialog}
     ></confirm-dialog>
   `:""}

      <ha-card>

        <div class="card-header-custom">

          <div class="card-header-title">

            <ha-icon
              icon="mdi:brain"
              class="card-header-icon"
            ></ha-icon>

            ${this.tt("predictions.title")}

          </div>

          <ha-switch
            .checked=${e}
            @change=${i=>this._update("use_predictions",i.target.checked)}
          >
          </ha-switch>

        </div>

        ${e?l`

            <div class="card-content" style="padding-top:8px;">

              <div class="row">

                <div style="display:flex; align-items:center; gap:12px;">

                  <ha-icon
                    icon="mdi:shield-lock-outline"
                    style="color:${s?"var(--primary-color)":"var(--secondary-text-color)"}"
                  ></ha-icon>

                  <div>

                    <div style="font-weight:500;">
                      ${this.tt("predictions.auto_config")}
                    </div>

                    <div style="font-size:11px;color:var(--secondary-text-color)">
                      ${this.tt("predictions.auto_config_desc")}
                    </div>

                  </div>

                </div>

                <ha-switch
                  .checked=${s}
                  @change=${i=>this._update("auto_predictions",i.target.checked)}
                >
                </ha-switch>

              </div>

            </div>

          `:l`<div style="height:16px;"></div>`}

      </ha-card>

    `}}customElements.define("settings-predictions",we);class ke extends _{static properties={config:{type:Object},_dialogState:{type:Object,state:!0}};constructor(){super(),this._dialogState=null,this._pendingSwitchTarget=null}_update(t,e){this.dispatchEvent(new CustomEvent("update-setting",{detail:{key:t,value:e},bubbles:!0,composed:!0}))}_handlePresenceToggle(t){if(!t.target.checked){this._update("geolocation",!1);return}const s=Object.keys(this.hass.states).filter(a=>a.startsWith("zone."));let i="zone.home";s.length===1?i=s[0]:s.includes("zone.home")||(i="true"),this._update("geolocation",i)}_handleToggleWithConfirm(t,e,s,i,a,o){const n=e===!0;this._dialogState={settingKey:t,title:n?this.tt(a)||"Wyłączenie automatyzacji":this.tt(s)||"Włączenie automatyzacji",text:n?this.tt(o)||"Obecnie przypisane elementy pozostaną na liście, ale od teraz będziesz mógł je edytować, dodawać i usuwać ręcznie. Czy chcesz kontynuować?":this.tt(i)||"System automatycznie wyszuka i zablokuje możliwość ręcznej edycji tych elementów. Czy chcesz kontynuować?"}}_confirmDialog(){if(this._dialogState){const t=this._dialogState.settingKey,e=this._pendingSwitchTarget?this._pendingSwitchTarget.checked:!0;this._update(t,e),this._dialogState=null,this._pendingSwitchTarget=null}}_cancelDialog(){this._pendingSwitchTarget&&(this._pendingSwitchTarget.checked=!this._pendingSwitchTarget.checked),this._dialogState=null,this._pendingSwitchTarget=null}v;render(){const t=this.config.use_home_modes===!0,e=this.config.home_mode_type||"custom",s=Object.keys(this.hass.states).filter(c=>c.startsWith("alarm_control_panel.")&&this.hass.states[c].state!=="unavailable"),i=Object.keys(this.hass.states).filter(c=>c.startsWith("zone.")),a=this.config.geolocation!==!1&&this.config.geolocation!==void 0,o=typeof this.config.geolocation=="string"?this.config.geolocation:"",n=o.startsWith("zone.");return l`

      ${this._dialogState?l`
     <confirm-dialog
       .title=${this._dialogState.title}
       .text=${this._dialogState.text}
       @confirm=${this._confirmDialog}
       @cancel=${this._cancelDialog}
     ></confirm-dialog>
   `:""}

      <ha-card>
        <div class="card-header-custom">
          <div class="card-header-title">
            <ha-icon icon="mdi:home-account" class="card-header-icon"></ha-icon> 
            ${this.tt("settings.home_modes")}
          </div>
          <ha-switch 
            .checked=${t} 
            @change=${c=>this._update("use_home_modes",c.target.checked)}>
          </ha-switch>
        </div>
        
        ${t?l`
          <div class="card-content" style="padding-top: 0;">
            <div class="radio-group">
              
              ${s.length>0?l`
                <ha-formfield .label=${this.tt("settings.alarm_integration")}>
                  <ha-radio 
                    name="mode_type" 
                    value="alarm" 
                    .checked=${e==="alarm"} 
                    @change=${()=>this._update("home_mode_type","alarm")}>
                  </ha-radio>
                </ha-formfield>
                
                ${e==="alarm"?l`
                  <div style="margin-left:36px; margin-bottom: 12px; margin-top: 8px;">
                    <select 
                      style="padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color);"
                      @change=${c=>this._update("alarm_entity",c.target.value)}>
                      <option value="" disabled ?selected=${!this.config.alarm_entity}>-- ${this.tt("settings.select_alarm")} --</option>
                      ${s.map(c=>l`
                        <option value="${c}" ?selected=${this.config.alarm_entity===c}>
                          ${this.hass.states[c].attributes.friendly_name||c}
                        </option>
                      `)}
                    </select>
                  </div>
                `:""}
              `:""}

              <ha-formfield .label=${this.tt("settings.custom_modes")}>
                <ha-radio 
                  name="mode_type" 
                  value="custom" 
                  .checked=${e==="custom"} 
                  @change=${()=>this._update("home_mode_type","custom")}>
                </ha-radio>
              </ha-formfield>
              
              ${e==="custom"?l`
                <div style="margin-left:36px; display:flex; flex-direction:column; gap:12px; margin-top: 8px;">
                  
                  <div style="display:flex; flex-direction:column; gap:8px;">
                    <ha-formfield .label=${this.tt("settings.use_presence")}>
                      <ha-switch 
                        .checked=${a} 
                        @change=${this._handlePresenceToggle}>
                      </ha-switch>
                    </ha-formfield>

                    ${a?l`
                      <div style="margin-left: 12px; margin-top: 4px;">
                        ${i.length===1?l`
                          <div class="alarm-badge">
                            <ha-icon icon="mdi:map-marker-radius" style="--mdc-icon-size: 16px;"></ha-icon>
                            ${this.tt("settings.auto_selected")} ${this.hass.states[i[0]]?.attributes?.friendly_name||i[0]}
                          </div>
                        `:l`
                          <select 
                            style="padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color);"
                            @change=${c=>this._update("geolocation",c.target.value)}>
                            <option value="true" disabled ?selected=${!n}>-- ${this.tt("settings.select_zone")} --</option>
                            ${i.map(c=>l`
                              <option value="${c}" ?selected=${o===c}>
                                ${this.hass.states[c]?.attributes?.friendly_name||c}
                              </option>
                            `)}
                          </select>
                        `}
                      </div>
                    `:""}
                  </div>
                  
                  <ha-formfield .label=${this.tt("settings.use_night_mode")}>
                    <ha-switch 
                      .checked=${this.config.use_night_mode===!0} 
                      @change=${c=>this._update("use_night_mode",c.target.checked)}>
                    </ha-switch>
                  </ha-formfield>
                  
                  ${this.config.use_night_mode?l`
                    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center;">
                      <ha-textfield label="${this.tt("settings.night_start")}" type="time" .value=${this.config.night_start||"22:00"} @change=${c=>this._update("night_start",c.target.value)}></ha-textfield>
                      <ha-textfield label="${this.tt("settings.night_end")}" type="time" .value=${this.config.night_end||"06:00"} @change=${c=>this._update("night_end",c.target.value)}></ha-textfield>
                    </div>
                  `:""}
                </div>
              `:""}
            </div>

            <div class="row" style="margin-top: 16px; border-top: 1px solid var(--divider-color); border-bottom: none; padding-top: 16px; padding-bottom: 8px;">
              <div>
                <div style="font-weight: 500;">${this.tt("settings.global_matrix_title")}</div>
                <div style="font-size:11px; color:var(--secondary-text-color)">${this.tt("settings.global_matrix_desc")}</div>
              </div>
              <ha-switch 
                .checked=${this.config.global_home_modes===!0} 
                @change=${c=>this._update("global_home_modes",c.target.checked)}>
              </ha-switch>
            </div>
            
            ${this.config.global_home_modes?l`
              <matrix-table 
                .hass=${this.hass}
                .matrix=${this.config.global_mode_matrix} 
                .modeType=${e}
                .showAway=${e==="alarm"||a}
                .showNight=${e==="alarm"||this.config.use_night_mode}
                .showVacation=${e==="alarm"||a&&n}
                .showPrediction=${this.config.use_predictions===!0}
                @matrix-change=${c=>this._update("global_mode_matrix",c.detail.matrix)}>
              </matrix-table>
            `:""}
          </div>
        `:""}
      </ha-card>
    `}static styles=u`
    ha-card { border-radius: 12px; margin-bottom: 24px; overflow: visible !important; }
    .card-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
    .card-header-custom { display: flex; justify-content: space-between; align-items: center; padding: 16px 16px 0 16px; }
    .card-header-title { font-size: 20px; font-weight: 400; display: flex; align-items: center; gap: 12px; }
    .card-header-icon { color: var(--primary-color); }
    .radio-group { display: flex; flex-direction: column; gap: 8px; }
    .alarm-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 12px; font-size: 12px; background: rgba(var(--rgb-primary-color), 0.1); border: 1px solid var(--primary-color); color: var(--primary-text-color); }
    .row { display: flex; justify-content: space-between; align-items: center; }
  `}customElements.define("settings-modes",ke);class Se extends _{static properties={hass:{type:Object},config:{type:Object},_dialogState:{type:Object,state:!0}};constructor(){super(),this._dialogState=null,this._pendingSwitchTarget=null}static styles=u`

    ha-card {
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .card-header-custom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px 0 16px;
    }

    .card-header-title {
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .card-header-icon {
      color: var(--primary-color);
    }

  `;_update(t,e){this.dispatchEvent(new CustomEvent("update-setting",{detail:{key:t,value:e},bubbles:!0,composed:!0}))}_handleToggleWithConfirm(t,e,s,i,a,o){const n=e===!0;this._dialogState={settingKey:t,title:n?this.tt(a)||"Wyłączenie automatyzacji":this.tt(s)||"Włączenie automatyzacji",text:n?this.tt(o)||"Obecnie przypisane elementy pozostaną na liście, ale od teraz będziesz mógł je edytować, dodawać i usuwać ręcznie. Czy chcesz kontynuować?":this.tt(i)||"System automatycznie wyszuka i zablokuje możliwość ręcznej edycji tych elementów. Czy chcesz kontynuować?",icon:"mdi:alert",isDanger:n}}_confirmDialog(){if(this._dialogState){const t=this._dialogState.settingKey,e=this._pendingSwitchTarget?this._pendingSwitchTarget.checked:!0;this._update(t,e),this._dialogState=null,this._pendingSwitchTarget=null}}_cancelDialog(){this._pendingSwitchTarget&&(this._pendingSwitchTarget.checked=!this._pendingSwitchTarget.checked),this._dialogState=null,this._pendingSwitchTarget=null}render(){const e=(this.config||{}).use_default_notifications===!0;return l`
      <confirm-dialog
        ?open=${this._dialogState!==null}
        .title=${this._dialogState?.title||""}
        .text=${this._dialogState?.text||""}
        .icon=${this._dialogState?.icon||"mdi:alert"}
        .isDanger=${this._dialogState?.isDanger===!0}
        confirmText="${this.tt("system.confirm")||"Potwierdź"}"
        cancelText="${this.tt("system.cancel")||"Anuluj"}"
        @confirm=${this._confirmDialog}
        @cancel=${this._cancelDialog}
      ></confirm-dialog>

      <ha-card>
        <div class="card-header-custom">
          <div class="card-header-title">
            <ha-icon
              icon="mdi:bell-ring"
              class="card-header-icon"
            ></ha-icon>
            ${this.tt("channels.title")||"Domyślne kanały powiadomień"}
          </div>

          <ha-switch
            .checked=${e}
            @change=${s=>{this._pendingSwitchTarget=s.target,this._handleToggleWithConfirm("use_default_notifications",e,"popup_useDefault_on_title","popup_useDefault_on_text","popup_useDefault_off_title","popup_useDefault_off_text")}}
          ></ha-switch>
        </div>

        ${e?l`
            <div style="padding:16px;">
              <notification-channels
                .hass=${this.hass}
                .config=${this.config}
                @config-changed=${s=>this._update(s.detail.key,s.detail.value)}
              >
              </notification-channels>
            </div>
          `:l`
            <div style="height:16px;"></div>
          `}
      </ha-card>
    `}}customElements.define("settings-channels",Se);class ze extends _{static properties={hass:{type:Object},config:{type:Object},_dialogState:{type:Object,state:!0}};constructor(){super(),this._dialogState=null,this._pendingSwitchTarget=null}static styles=u`

    ha-card {
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .card-header-custom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px 0 16px;
    }

    .card-header-title {
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .card-header-icon {
      color: var(--primary-color);
    }

  `;_update(t,e){this.dispatchEvent(new CustomEvent("update-setting",{detail:{key:t,value:e},bubbles:!0,composed:!0}))}_handleToggleWithConfirm(t,e,s,i,a,o){const n=e===!0;this._dialogState={settingKey:t,title:n?this.tt(a)||"Wyłączenie automatyzacji":this.tt(s)||"Włączenie automatyzacji",text:n?this.tt(o)||"Obecnie przypisane elementy pozostaną na liście, ale od teraz będziesz mógł je edytować, dodawać i usuwać ręcznie. Czy chcesz kontynuować?":this.tt(i)||"System automatycznie wyszuka i zablokuje możliwość ręcznej edycji tych elementów. Czy chcesz kontynuować?"}}_confirmDialog(){if(this._dialogState){const t=this._dialogState.settingKey,e=this._pendingSwitchTarget?this._pendingSwitchTarget.checked:!0;this._update(t,e),this._dialogState=null,this._pendingSwitchTarget=null}}_cancelDialog(){this._pendingSwitchTarget&&(this._pendingSwitchTarget.checked=!this._pendingSwitchTarget.checked),this._dialogState=null,this._pendingSwitchTarget=null}render(){const t=this.config||{},e=t.use_custom_messages===!0;return l`

      ${this._dialogState?l`
     <confirm-dialog
       .title=${this._dialogState.title}
       .text=${this._dialogState.text}
       @confirm=${this._confirmDialog}
       @cancel=${this._cancelDialog}
     ></confirm-dialog>
   `:""}

      <ha-card>

        <div class="card-header-custom">

          <div class="card-header-title">

            <ha-icon
              icon="mdi:message-alert"
              class="card-header-icon"
            ></ha-icon>

            ${this.tt("messages.global_title")}

          </div>

          <ha-switch
            .checked=${e}
            @change=${s=>this._update("use_custom_messages",s.target.checked)}
          >
          </ha-switch>

        </div>

        ${e?l`

              <div style="padding:16px;">

                <custom-messages
                  .hass=${this.hass}
                  .config=${t}
                  titleKey="default_title"
                  msgKey="default_msg"
                  @config-changed=${s=>this._update(s.detail.key,s.detail.value)}
                >
                </custom-messages>

              </div>

            `:l`<div style="height:16px;"></div>`}

      </ha-card>

    `}}customElements.define("settings-messages",ze);class Ee extends v{static properties={hass:{type:Object},_localOverrides:{type:Object,state:!0}};constructor(){super(),this._localOverrides={}}static styles=u`
    :host { display: block; padding: 20px; }
  `;_getEntity(t,e){return this.hass?Object.keys(this.hass.states).find(s=>s.startsWith(`${t}.`)&&this.hass.states[s]?.attributes?.unique_key===e):null}_handleSettingUpdate(t){const{key:e,value:s}=t.detail;this._localOverrides={...this._localOverrides,[e]:s},this.hass.callService("safety","update_settings",{category:"global",key:e,value:s}).catch(i=>console.warn("Safety Error:",i))}render(){const t=this._getEntity("sensor","status"),s={...this.hass.states[t]?.attributes?.category_config?.global||{},...this._localOverrides};return l`
      <settings-system .hass=${this.hass} .config=${s} @update-setting=${this._handleSettingUpdate}></settings-system>
      
      <settings-predictions .hass=${this.hass} .config=${s} @update-setting=${this._handleSettingUpdate}></settings-predictions>
      
      <settings-modes .hass=${this.hass} .config=${s} @update-setting=${this._handleSettingUpdate}></settings-modes>
      
      <settings-channels .hass=${this.hass} .config=${s} @update-setting=${this._handleSettingUpdate}></settings-channels>
      
      <settings-messages .hass=${this.hass} .config=${s} @update-setting=${this._handleSettingUpdate}></settings-messages>
    `}}customElements.define("tab-settings",Ee);class Ae extends HTMLElement{static async generateDashboard(t){return t.hass,{title:"Bezpieczeństwo Domu",views:[{title:"Status Systemu",icon:"mdi:shield-check",cards:[{type:"markdown",content:`# 🛡️ System Safety
Automatycznie wygenerowany pulpit z Twoimi czujnikami.`},{type:"entities",title:"Wykryte Zagrożenia",show_header_toggle:!1,entities:["sensor.safety_central_hub"]}]}]}}}customElements.define("ll-strategy-dashboard-safety",Ae);window.customStrategies=window.customStrategies||[];window.customStrategies.push({type:"safety",strategyType:"dashboard",name:"Safety Manager",description:"Automatyczny, bezobsługowy pulpit dla Twojego systemu bezpieczeństwa."});class Te extends v{static properties={hass:{type:Object},_currentTab:{type:String,state:!0},_lang:{type:String,state:!0}};constructor(){super(),this._currentTab="summary",this._lang="pl"}connectedCallback(){super.connectedCallback(),this._lang=this.hass?.locale?.language}updated(t){t.has("hass")&&(this._lang=this.hass?.locale?.language)}_getTabs(){return[{id:"summary",nameKey:"tabs.summary",icon:"mdi:shield-home-outline"},{id:"sensors",nameKey:"tabs.hazards",icon:"mdi:shield-search"},{id:"status",nameKey:"tabs.status",icon:"mdi:shield-star-outline"},{id:"analytics",nameKey:"tabs.analytics",icon:"mdi:shield-sync"},{id:"settings",nameKey:"tabs.settings",icon:"mdi:shield-edit-outline"}]}static styles=u`
    :host { 
      display: flex; 
      flex-direction: column; 
      height: 100vh; 
      background-color: var(--primary-background-color); 
      color: var(--primary-text-color); 
    }
    
    /* Natywny nagłówek HA (App Bar) */
    .header { 
      background-color: var(--app-header-background-color, var(--primary-color)); 
      color: var(--app-header-text-color, white); 
      font-family: var(--mdc-typography-headline6-font-family, Roboto, sans-serif);
      font-size: var(--mdc-typography-headline6-font-size, 20px);
      font-weight: var(--mdc-typography-headline6-font-weight, 400);
      letter-spacing: var(--mdc-typography-headline6-letter-spacing, 0.0125em);
      height: var(--header-height, 56px); 
      padding: 0 16px; 
      display: flex; 
      align-items: center; 
      gap: 16px; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
      z-index: 2;
    }
    
    /* Natywny pasek zakładek (Tab Bar) */
    .tabs { 
      display: flex; 
      background-color: var(--primary-background-color); 
      border-bottom: 1px solid var(--divider-color); 
      overflow-x: auto; 
      z-index: 1;
      scrollbar-width: none; /* Ukrywa pasek w Firefox */
    }
    .tabs::-webkit-scrollbar { display: none; } /* Ukrywa pasek w Chrome/Safari */

    /* Natywna pojedyncza zakładka (Tab) */
    .tab { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 8px; 
      height: 48px; 
      padding: 0 24px; 
      cursor: pointer; 
      font-family: var(--mdc-typography-button-font-family, Roboto, sans-serif);
      font-size: var(--mdc-typography-button-font-size, 14px);
      font-weight: var(--mdc-typography-button-font-weight, 500);
      letter-spacing: var(--mdc-typography-button-letter-spacing, 0.0892857em);
      text-transform: var(--mdc-typography-button-text-transform, uppercase);
      color: var(--secondary-text-color); 
      border-bottom: 2px solid transparent; 
      transition: color 0.2s, border-bottom-color 0.2s; 
      white-space: nowrap; 
      box-sizing: border-box;
    }
    
    .tab ha-icon { 
      --mdc-icon-size: 20px; 
    }

    .tab:hover { 
      color: var(--primary-text-color); 
      background-color: var(--secondary-background-color, rgba(150,150,150,0.1));
    }
    
    .tab.active { 
      color: var(--primary-color); 
      border-bottom-color: var(--primary-color); 
    }
    
    .content { 
      flex: 1; 
      overflow-y: auto; 
      background-color: var(--primary-background-color); 
    }
  `;render(){if(!this.hass)return l`<div>${m("panel.loading",this._lang)}</div>`;const t=this.hass.localize("component.safety.title")||m("panel.title",this._lang),e=this._getTabs();return l`
      <div class="header">
        <ha-icon icon="mdi:shield-check-outline"></ha-icon> 
        ${t}
      </div>

      <div class="tabs">
        ${e.map(s=>l`
          <div class="tab ${this._currentTab===s.id?"active":""}" 
               @click=${()=>this._currentTab=s.id}>
            <ha-icon icon="${s.icon}"></ha-icon>
            ${m(s.nameKey,this._lang)}
          </div>
        `)}
      </div>

      <div class="content" @change-tab=${s=>this._currentTab=s.detail.tab}>
        ${this._renderTabContent()}
      </div>
    `}_renderTabContent(){switch(this._currentTab){case"summary":return l`<tab-summary .hass=${this.hass} .lang=${this._lang}></tab-summary>`;case"sensors":return l`<tab-hazards .hass=${this.hass} .lang=${this._lang}></tab-hazards>`;case"status":return l`<tab-status .hass=${this.hass} .lang=${this._lang}></tab-status>`;case"analytics":return l`<tab-analytics .hass=${this.hass} .lang=${this._lang}></tab-analytics>`;case"settings":return l`<tab-settings .hass=${this.hass} .lang=${this._lang}></tab-settings>`;default:return l`<tab-summary .hass=${this.hass} .lang=${this._lang}></tab-summary>`}}}customElements.define("safety-panel",Te);
