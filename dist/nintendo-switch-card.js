function t(t,e,i,s){var n,r=arguments.length,o=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,i,o):n(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const o=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,g=f?f.emptyScript:"",y=u.reactiveElementPolyfillSupport,m=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),v={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??$)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[m("elementProperties")]=new Map,b[m("finalized")]=new Map,y?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,w=t=>t,A=x.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+C,P=`<${O}>`,U=document,N=()=>U.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,M="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,L=/>/g,B=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,j=/"/g,D=/^(?:script|style|textarea|title)$/i,I=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),G=I(1),q=I(2),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),J=new WeakMap,F=U.createTreeWalker(U,129);function Q(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=T;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(o.lastIndex=h,c=o.exec(i),null!==c);)h=o.lastIndex,o===T?"!--"===c[1]?o=H:void 0!==c[1]?o=L:void 0!==c[2]?(D.test(c[2])&&(n=RegExp("</"+c[2],"g")),o=B):void 0!==c[3]&&(o=B):o===B?">"===c[0]?(o=n??T,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?B:'"'===c[3]?j:z):o===j||o===z?o=B:o===H||o===L?o=T:(o=B,n=void 0);const d=o===B&&t[e+1].startsWith("/>")?" ":"";r+=o===T?i+P:l>=0?(s.push(a),i.slice(0,l)+E+i.slice(l)+C+d):i+C+(-2===l?e:d)}return[Q(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[c,l]=Z(t,e);if(this.el=K.createElement(c,i),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=F.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[r++],i=s.getAttribute(t).split(C),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?it:"?"===o[1]?st:"@"===o[1]?nt:et}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(D.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),F.nextNode(),a.push({type:2,index:++n});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===O)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const i=U.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===V)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=k(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=Y(t,n._$AS(t,e.values),n,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??U).importNode(e,!0);F.currentNode=s;let n=F.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new tt(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new rt(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=F.nextNode(),r++)}return F.currentNode=U,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),k(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new K(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new tt(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=Y(this,t,e,0),r=!k(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=Y(this,s[i+o],e,o),a===V&&(a=this._$AH[o]),r||=!k(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class nt extends et{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===V)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const ot=x.litHtmlPolyfillSupport;ot?.(K,tt),(x.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;class ct extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new tt(e.insertBefore(N(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}ct._$litElement$=!0,ct.finalized=!0,at.litElementHydrateSupport?.({LitElement:ct});const lt=at.litElementPolyfillSupport;lt?.({LitElement:ct}),(at.litElementVersions??=[]).push("4.2.2");const ht={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:$},dt=(t=ht,e,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}const ut="nintendo-switch-card",ft={battery_level:"battery_level",battery_health:"battery_health",battery_voltage:"battery_voltage",is_charging:"is_charging",charger_type:"charger_type",screen_brightness:"screen_brightness",screen:"screen",volume:"volume",audio_output:"audio_output_target",game_running:"game_running",current_game:"current_game",current_game_id:"current_game_id",player_count:"player_count"},gt=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)})`
  :host {
    display: block;
  }
  ha-card {
    overflow: hidden;
    font-family: var(--primary-font-family, -apple-system, system-ui, sans-serif);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 0;
    font-size: 14px;
    color: var(--secondary-text-color, #666);
  }
  .header-left {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .header-item {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .header-item ha-icon {
    --mdc-icon-size: 18px;
    opacity: 0.75;
  }
  .header-item.charging-pulse {
    color: #00a854;
    animation: pulse 1.5s ease-in-out infinite;
  }
  .header-item.battery-low {
    color: #d32f2f;
    animation: battery-low 1s ease-in-out infinite;
  }
  .menu {
    color: var(--secondary-text-color, #999);
    cursor: pointer;
    padding: 0 6px;
  }
  .hero {
    padding: 18px 12px 8px;
    display: flex;
    justify-content: center;
  }
  .hero svg, .hero img {
    width: 100%;
    max-width: 460px;
    height: auto;
  }
  .hero.unavailable { opacity: 0.5; }
  .name {
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    margin: 4px 0 2px;
    color: var(--primary-text-color, #2c2c2c);
  }
  .state {
    text-align: center;
    font-size: 14px;
    margin-bottom: 14px;
    color: var(--secondary-text-color, #666);
  }
  .state.charging { color: #00a854; font-weight: 500; }
  .state.error { color: #d32f2f; font-weight: 500; }
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--divider-color, #eee);
  }
  .stat {
    padding: 12px 6px;
    text-align: center;
    border-right: 1px solid var(--divider-color, #eee);
    transition: transform 150ms ease;
  }
  .stat:last-child { border-right: 0; }
  .stat:hover { transform: translateY(-1px); }
  .stat-value {
    font-size: 20px;
    font-weight: 500;
    color: var(--primary-text-color, #2c2c2c);
  }
  .stat-label {
    font-size: 12px;
    color: var(--secondary-text-color, #888);
    margin-top: 2px;
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-top: 1px solid var(--divider-color, #eee);
  }
  .tool-group { display: flex; gap: 14px; }
  .tool {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color, #666);
    cursor: pointer;
    border-radius: 6px;
    background: none;
    border: none;
    padding: 0;
    transition: transform 80ms ease;
  }
  .tool:hover { background: var(--secondary-background-color, #f0f0f0); color: var(--primary-text-color, #222); }
  .tool:active { transform: scale(0.92); }
  .tool:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); }
  .compact .stats, .compact .toolbar { display: none; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes battery-low {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @media (prefers-reduced-motion: reduce) {
    .header-item.charging-pulse,
    .header-item.battery-low { animation: none; }
    .stat, .tool { transition: none; }
  }
`,yt=q`
<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="nscJcL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#26d0f0"/>
      <stop offset="50%" stop-color="#0AB9E6"/>
      <stop offset="100%" stop-color="#0780a3"/>
    </linearGradient>
    <linearGradient id="nscJcR" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stop-color="#ff2c3d"/>
      <stop offset="50%" stop-color="#E60012"/>
      <stop offset="100%" stop-color="#9c0010"/>
    </linearGradient>
    <linearGradient id="nscBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2e2e2e"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="nscStick" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#5a5a5a"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
    <radialGradient id="nscBtn" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#5e5e5e"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </radialGradient>
  </defs>
  <ellipse cx="300" cy="194" rx="270" ry="5" fill="#000" opacity="0.18"/>
  <!-- Joy-Con L -->
  <path d="M 22 14 Q 4 14 4 36 L 4 164 Q 4 186 22 186 L 60 186 L 60 14 Z" fill="url(#nscJcL)"/>
  <circle cx="22" cy="42" r="11" fill="url(#nscStick)"/>
  <circle cx="22" cy="42" r="8" fill="#0a0a0a"/>
  <circle cx="32" cy="86" r="5" fill="url(#nscBtn)"/>
  <circle cx="32" cy="116" r="5" fill="url(#nscBtn)"/>
  <circle cx="18" cy="101" r="5" fill="url(#nscBtn)"/>
  <circle cx="46" cy="101" r="5" fill="url(#nscBtn)"/>
  <rect x="44" y="38" width="9" height="2" rx="1" fill="#0780a3"/>
  <rect x="42" y="148" width="9" height="9" rx="1.5" fill="url(#nscBtn)"/>
  <!-- Tablet -->
  <rect x="60" y="14" width="3" height="172" fill="#000" opacity="0.55"/>
  <rect x="63" y="6" width="474" height="188" rx="10" fill="url(#nscBody)"/>
  <rect x="71" y="20" width="458" height="160" rx="4" fill="#040404"/>
  <rect x="79" y="26" width="442" height="148" rx="2" fill="#0c0c0c"/>
  <rect x="294" y="190" width="14" height="2" rx="1" fill="#000" opacity="0.7"/>
  <!-- Joy-Con R -->
  <rect x="537" y="14" width="3" height="172" fill="#000" opacity="0.55"/>
  <path d="M 540 14 L 540 186 L 578 186 Q 596 186 596 164 L 596 36 Q 596 14 578 14 Z" fill="url(#nscJcR)"/>
  <circle cx="572" cy="42" r="6" fill="url(#nscBtn)"/>
  <text x="572" y="45" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">X</text>
  <circle cx="586" cy="56" r="6" fill="url(#nscBtn)"/>
  <text x="586" y="59" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">A</text>
  <circle cx="558" cy="56" r="6" fill="url(#nscBtn)"/>
  <text x="558" y="59" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">Y</text>
  <circle cx="572" cy="70" r="6" fill="url(#nscBtn)"/>
  <text x="572" y="73" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">B</text>
  <circle cx="578" cy="138" r="11" fill="url(#nscStick)"/>
  <circle cx="578" cy="138" r="8" fill="#0a0a0a"/>
  <g stroke="#9c0010" stroke-width="2" stroke-linecap="round">
    <line x1="548" y1="38" x2="556" y2="38"/>
    <line x1="552" y1="34" x2="552" y2="42"/>
  </g>
  <circle cx="552" cy="158" r="5" fill="#0a0a0a"/>
  <circle cx="552" cy="158" r="4.5" fill="none" stroke="#aaa" stroke-width="0.6" opacity="0.4"/>
</svg>
`,mt=["is_charging","game_running"];function _t(t){const e=t.entities??{},i=t.entity,s={};return Object.keys(ft).forEach(t=>{const n=e[t];if(n)s[t]=n;else if(i){const e=function(t){return mt.includes(t)?"binary_sensor":"sensor"}(t);s[t]=`${e}.${i}_${ft[t]}`}else s[t]=""}),s}const $t={en:{state:{standby:"Standby",running:"Running",charging:"Charging",unavailable:"Unavailable"},stat:{brightness:"Brightness",volume:"Volume",voltage:"Voltage",players:"Players"},action:{reboot:"Reboot",shutdown:"Shutdown",notify:"Notify",notify_prompt:"Message to send to the Switch:"},error:{no_entity:"Missing required entity configuration",invalid_config:"Invalid configuration"},editor:{entity:"Entity prefix (device slug)",name:"Name",image:"Custom image URL",compact:"Compact view",language:"Language"}},"pt-BR":{state:{standby:"Em espera",running:"Em execução",charging:"Carregando",unavailable:"Indisponível"},stat:{brightness:"Brilho",volume:"Volume",voltage:"Voltagem",players:"Jogadores"},action:{reboot:"Reiniciar",shutdown:"Desligar",notify:"Notificar",notify_prompt:"Mensagem para enviar ao Switch:"},error:{no_entity:"Configuração de entidade obrigatória ausente",invalid_config:"Configuração inválida"},editor:{entity:"Prefixo das entidades (slug do dispositivo)",name:"Nome",image:"URL de imagem personalizada",compact:"Modo compacto",language:"Idioma"}}};function vt(t,e){let i=t;for(const t of e){if(!i||"object"!=typeof i||!(t in i))return;i=i[t]}return"string"==typeof i?i:void 0}function bt(t,e="en"){const i=t.split("."),s=$t[e],n=s?vt(s,i):void 0;if(void 0!==n)return n;const r=vt($t.en,i);return void 0!==r?r:t}const xt=new Set(["unavailable","unknown","none",""]);function wt(t,e){return e.suffix?`${t}${e.suffix}`:e.unit?`${t} ${e.unit}`:t}console.info("%c NINTENDO-SWITCH-CARD %c v0.1.1 ","color: white; background: #E60012; font-weight: 700;","color: white; background: #0AB9E6; font-weight: 700;");const At=window;At.customCards=At.customCards||[],At.customCards.push({type:ut,name:"Nintendo Switch Card",description:"Card for Nintendo Switch via switch-assistant MQTT integration",preview:!1,documentationURL:"https://github.com/hudsonbrendon/nintendo-switch-card",getEntitySuggestion:(t,e)=>{const i=function(t,e){const i=t.entities?.[e];if(i&&"mqtt"!==i.platform)return;const s=/^sensor\.(.+)_battery_level$/.exec(e);if(!s)return;const n=s[1];return t.states[`binary_sensor.${n}_is_charging`]?n:void 0}(t,e);return i?{config:{type:`custom:${ut}`,entity:i}}:null}});let St=class extends ct{static{this.styles=gt}setConfig(t){if(!t)throw new Error("invalid_config: config is empty");const e="string"==typeof t.entity&&t.entity.length>0,i=t.entities??{},s=!!i.battery_level&&!!i.is_charging;if(!e&&!s)throw new Error("missing required entity: provide `entity:` prefix or `entities.battery_level` + `entities.is_charging`");if(t.stats&&t.stats.length>4)throw new Error("invalid_config: stats can have at most 4 items");if(t.image&&"switch-default"!==t.image)try{t.image.startsWith("/local/")||t.image.startsWith("/")||new URL(t.image)}catch{throw new Error("invalid_config: image must be `switch-default`, a `/local/...` path, or an absolute URL")}this._config=t}getCardSize(){return 5}getGridOptions(){return this._config?.compact?{columns:6,rows:3,min_columns:4,min_rows:3}:{columns:6,rows:5,min_columns:4,min_rows:4}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{text:{}}},{name:"name",selector:{text:{}}},{name:"image",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"compact",selector:{boolean:{}}},{name:"language",selector:{select:{options:["en","pt-BR"],mode:"dropdown"}}}]}],computeLabel:t=>bt(`editor.${t.name}`)}}willUpdate(t){t.has("hass")&&this.toggleAttribute("dark-mode",Boolean(this.hass?.themes?.darkMode))}static getStubConfig(){return{type:"custom:nintendo-switch-card",entity:"nintendo_switch"}}_stateOf(t){return this.hass&&t?this.hass.states[t]?.state??"unavailable":"unavailable"}_displayState(t){const e=this.hass?.states[t],i=e?.state??"unavailable";if(!e||["unavailable","unknown"].includes(i))return"—";try{return this.hass?.formatEntityState?.(e)??i}catch{return i}}_resolveLang(){return this._config?.language??this.hass?.locale.language??"en"}_isAnyEssentialUnavailable(t){return[t.battery_level,t.is_charging].some(t=>!t||!this.hass.states[t]||"unavailable"===this.hass.states[t].state)}_renderHeader(t){const e=this._stateOf(t.battery_level),i=this._stateOf(t.volume),s="on"===this._stateOf(t.is_charging),n=this._stateOf(t.player_count),r=Number(e),o=!s&&Number.isFinite(r)&&r>0&&r<15,a=Number.isFinite(Number(n))&&Number(n)>0;return G`
      <div class="header">
        <div class="header-left">
          <div class="header-item volume">
            <ha-icon icon="mdi:volume-medium"></ha-icon>
            <span>${"unavailable"===i?"—":`${i}%`}</span>
          </div>
          <div class="header-item battery ${s?"charging-pulse":""} ${o?"battery-low":""}">
            <ha-icon icon="${s?"mdi:flash":"mdi:battery"}"></ha-icon>
            <span>${"unavailable"===e?"—":`${e}%`}</span>
          </div>
          ${a?G`<div class="header-item players">
                <ha-icon icon="mdi:account"></ha-icon>
                <span>${this._displayState(t.player_count)}</span>
              </div>`:W}
        </div>
        <div class="menu">⋮</div>
      </div>
    `}_renderHero(t){const e=this._config.image;return G`
      <div class="hero ${t?"unavailable":""}">
        ${e&&"switch-default"!==e?G`<img src=${e} alt="Nintendo Switch" />`:yt}
      </div>
    `}_renderName(){const t=this._config?.name??"Nintendo Switch";return G`<div class="name">${t}</div>`}_renderStateLine(t,e){const i=function(t){if(t.anyUnavailable)return{text:bt("state.unavailable",t.lang),color:"error"};const e="on"===t.isCharging,i="on"===t.gameRunning,s=t.currentGame&&"Unknown"!==t.currentGame?t.currentGame:bt("state.running",t.lang);return e&&i?{text:`⚡ ${bt("state.charging",t.lang)} · ▶ ${s}`,color:"charging"}:e?{text:`⚡ ${bt("state.charging",t.lang)} · ${t.chargerType}`,color:"charging"}:i?{text:`▶ ${s}`,color:"default"}:{text:bt("state.standby",t.lang),color:"muted"}}({isCharging:this._stateOf(t.is_charging),gameRunning:this._stateOf(t.game_running),currentGame:this._stateOf(t.current_game),chargerType:this._stateOf(t.charger_type),anyUnavailable:e,lang:this._resolveLang()});return G`<div class="state ${i.color}" aria-live="polite">${i.text}</div>`}_defaultStats(t){return[{entity:t.screen_brightness,unit:"%",subtitle:"stat.brightness"},{entity:t.volume,unit:"%",subtitle:"stat.volume"},{entity:t.battery_voltage,unit:"V",multiply:.001,precision:2,subtitle:"stat.voltage"},{entity:t.player_count,suffix:"/8",subtitle:"stat.players"}]}_renderStats(t){const e=this._config.stats??this._defaultStats(t),i=this._resolveLang();return G`
      <div class="stats">
        ${e.map(t=>{const e=this._stateOf(t.entity),s=!t.unit&&!t.multiply&&void 0===t.precision&&!t.suffix?this._displayState(t.entity):function(t,e){if(void 0===t||xt.has(t))return"—";if(void 0!==e.multiply||void 0!==e.precision){const i=Number(t);if(!Number.isFinite(i))return"—";const s=void 0!==e.multiply?i*e.multiply:i;return wt(void 0!==e.precision?s.toFixed(e.precision):String(s),e)}return wt(t,e)}(e,{unit:t.unit,multiply:t.multiply,precision:t.precision,suffix:t.suffix}),n=t.subtitle.startsWith("stat.")?bt(t.subtitle,i):t.subtitle;return G`
            <div class="stat">
              <div class="stat-value">${s}</div>
              <div class="stat-label">${n}</div>
            </div>
          `})}
      </div>
    `}_defaultActions(){const t=this._config?.entity;return t?[{service:"button.press",service_data:{entity_id:`button.${t}_reboot`},icon:"mdi:restart",name_key:"action.reboot"},{service:"button.press",service_data:{entity_id:`button.${t}_shutdown`},icon:"mdi:power",name_key:"action.shutdown"}]:[]}_handleAction(t){if(!this.hass)return;const[e,i]=t.service.split(".");e&&i&&this.hass.callService(e,i,t.service_data,t.target)}_handleNotify(){if(!this.hass||!this._config)return;const t=this._resolveLang(),e=window.prompt(bt("action.notify_prompt",t));if(!e)return;const i=this._config.notify_action??{service:"notify.send_message",target:{entity_id:`notify.${this._config.entity}_popup_notification`}},[s,n]=i.service.split(".");this.hass.callService(s,n,{...i.service_data??{},message:e},i.target)}_renderToolbar(t){const e=this._resolveLang(),i=this._config?.actions??this._defaultActions(),s=this._stateOf(t.screen),n=this._stateOf(t.audio_output);return G`
      <div class="toolbar">
        <div class="tool-group">
          ${i.map(t=>{const i=t.name_key?bt(t.name_key,e):t.name??t.service,s="action.reboot"===t.name_key?"reboot":"action.shutdown"===t.name_key?"shutdown":"";return G`
              <button
                class="tool ${s}"
                aria-label=${i}
                title=${i}
                @click=${()=>this._handleAction(t)}
              >
                <ha-icon icon=${t.icon??"mdi:flash"}></ha-icon>
              </button>
            `})}
        </div>
        <div class="tool-group">
          <span class="tool" aria-label="Screen ${s}" title="Screen: ${s}">
            <ha-icon icon="${"on"===s?"mdi:monitor":"mdi:monitor-off"}"></ha-icon>
          </span>
          <button
            class="tool notify"
            aria-label=${bt("action.notify",e)}
            title=${bt("action.notify",e)}
            @click=${()=>this._handleNotify()}
          >
            <ha-icon icon="mdi:bell"></ha-icon>
          </button>
          <span class="tool" aria-label="Audio ${n}" title="Audio: ${n}">
            <ha-icon icon="mdi:speaker"></ha-icon>
          </span>
        </div>
      </div>
    `}render(){if(!this._config||!this.hass)return W;const t=_t(this._config),e=this._isAnyEssentialUnavailable(t),i=this._config.compact?"compact":"";return G`
      <ha-card class=${i} role="article" aria-label=${this._config.name??"Nintendo Switch"}>
        ${this._renderHeader(t)}
        ${this._renderHero(e)}
        ${this._renderName()}
        ${this._renderStateLine(t,e)}
        ${this._renderStats(t)}
        ${this._renderToolbar(t)}
      </ha-card>
    `}};t([pt({attribute:!1})],St.prototype,"hass",void 0),t([function(t){return pt({...t,state:!0,attribute:!1})}()],St.prototype,"_config",void 0),St=t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})(ut)],St);export{St as NintendoSwitchCard};
//# sourceMappingURL=nintendo-switch-card.js.map
