var Me=Object.defineProperty;var De=(o,e,t)=>e in o?Me(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var F=(o,e,t)=>De(o,typeof e!="symbol"?e+"":e,t);var H=globalThis,I=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),ce=new WeakMap,T=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(I&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ce.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ce.set(t,e))}return e}toString(){return this.cssText}},le=o=>new T(typeof o=="string"?o:o+"",void 0,W),R=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((s,i,n)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new T(t,o,W)},de=(o,e)=>{if(I)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=H.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,o.appendChild(s)}},Y=I?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return le(t)})(o):o;var{is:Le,defineProperty:He,getOwnPropertyDescriptor:Ie,getOwnPropertyNames:Ve,getOwnPropertySymbols:je,getPrototypeOf:Be}=Object,V=globalThis,he=V.trustedTypes,ze=he?he.emptyScript:"",Ke=V.reactiveElementPolyfillSupport,P=(o,e)=>o,q={toAttribute(o,e){switch(e){case Boolean:o=o?ze:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},ue=(o,e)=>!Le(o,e),pe={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=pe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&He(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=Ie(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:i,set(r){let d=i?.call(this);n?.call(this,r),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??pe}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let e=Be(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let t=this.properties,s=[...Ve(t),...je(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(Y(i))}else e!==void 0&&t.push(Y(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return de(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:q).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:q;this._$Em=i;let d=r.fromAttribute(t,n.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let r=this.constructor;if(i===!1&&(n=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??ue)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),n!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:r}=n,d=this[i];r!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[P("elementProperties")]=new Map,$[P("finalized")]=new Map,Ke?.({ReactiveElement:$}),(V.reactiveElementVersions??=[]).push("2.1.2");var te=globalThis,me=o=>o,j=te.trustedTypes,_e=j?j.createPolicy("lit-html",{createHTML:o=>o}):void 0,be="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,Ee="?"+E,Fe=`<${Ee}>`,x=document,U=()=>x.createComment(""),N=o=>o===null||typeof o!="object"&&typeof o!="function",se=Array.isArray,We=o=>se(o)||typeof o?.[Symbol.iterator]=="function",G=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fe=/-->/g,ve=/>/g,w=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ge=/'/g,$e=/"/g,we=/^(?:script|style|textarea|title)$/i,ie=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),u=ie(1),pt=ie(2),ut=ie(3),S=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ye=new WeakMap,A=x.createTreeWalker(x,129);function Ae(o,e){if(!se(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return _e!==void 0?_e.createHTML(e):e}var Ye=(o,e)=>{let t=o.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",r=O;for(let d=0;d<t;d++){let a=o[d],c,h,l=-1,_=0;for(;_<a.length&&(r.lastIndex=_,h=r.exec(a),h!==null);)_=r.lastIndex,r===O?h[1]==="!--"?r=fe:h[1]!==void 0?r=ve:h[2]!==void 0?(we.test(h[2])&&(i=RegExp("</"+h[2],"g")),r=w):h[3]!==void 0&&(r=w):r===w?h[0]===">"?(r=i??O,l=-1):h[1]===void 0?l=-2:(l=r.lastIndex-h[2].length,c=h[1],r=h[3]===void 0?w:h[3]==='"'?$e:ge):r===$e||r===ge?r=w:r===fe||r===ve?r=O:(r=w,i=void 0);let m=r===w&&o[d+1].startsWith("/>")?" ":"";n+=r===O?a+Fe:l>=0?(s.push(c),a.slice(0,l)+be+a.slice(l)+E+m):a+E+(l===-2?d:m)}return[Ae(o,n+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},M=class o{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,r=0,d=e.length-1,a=this.parts,[c,h]=Ye(e,t);if(this.el=o.createElement(c,s),A.currentNode=this.el.content,t===2||t===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=A.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let l of i.getAttributeNames())if(l.endsWith(be)){let _=h[r++],m=i.getAttribute(l).split(E),b=/([.?@])?(.*)/.exec(_);a.push({type:1,index:n,name:b[2],strings:m,ctor:b[1]==="."?X:b[1]==="?"?Z:b[1]==="@"?Q:C}),i.removeAttribute(l)}else l.startsWith(E)&&(a.push({type:6,index:n}),i.removeAttribute(l));if(we.test(i.tagName)){let l=i.textContent.split(E),_=l.length-1;if(_>0){i.textContent=j?j.emptyScript:"";for(let m=0;m<_;m++)i.append(l[m],U()),A.nextNode(),a.push({type:2,index:++n});i.append(l[_],U())}}}else if(i.nodeType===8)if(i.data===Ee)a.push({type:2,index:n});else{let l=-1;for(;(l=i.data.indexOf(E,l+1))!==-1;)a.push({type:7,index:n}),l+=E.length-1}n++}}static createElement(e,t){let s=x.createElement("template");return s.innerHTML=e,s}};function k(o,e,t=o,s){if(e===S)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=N(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(o),i._$AT(o,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=k(o,i._$AS(o,e.values),i,s)),e}var J=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??x).importNode(t,!0);A.currentNode=i;let n=A.nextNode(),r=0,d=0,a=s[0];for(;a!==void 0;){if(r===a.index){let c;a.type===2?c=new D(n,n.nextSibling,this,e):a.type===1?c=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(c=new ee(n,this,e)),this._$AV.push(c),a=s[++d]}r!==a?.index&&(n=A.nextNode(),r++)}return A.currentNode=x,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},D=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),N(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):We(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(x.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=M.createElement(Ae(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new J(i,this),r=n.u(this.options);n.p(t),this.T(r),this._$AH=n}}_$AC(e){let t=ye.get(e.strings);return t===void 0&&ye.set(e.strings,t=new M(e)),t}k(e){se(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new o(this.O(U()),this.O(U()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=me(e).nextSibling;me(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(e,t=this,s,i){let n=this.strings,r=!1;if(n===void 0)e=k(this,e,t,0),r=!N(e)||e!==this._$AH&&e!==S,r&&(this._$AH=e);else{let d=e,a,c;for(e=n[0],a=0;a<n.length-1;a++)c=k(this,d[s+a],t,a),c===S&&(c=this._$AH[a]),r||=!N(c)||c!==this._$AH[a],c===p?e=p:e!==p&&(e+=(c??"")+n[a+1]),this._$AH[a]=c}r&&!i&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},X=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},Z=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},Q=class extends C{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=k(this,e,t,0)??p)===S)return;let s=this._$AH,i=e===p&&s!==p||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ee=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}};var qe=te.litHtmlPolyfillSupport;qe?.(M,D),(te.litHtmlVersions??=[]).push("3.3.3");var xe=(o,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new D(e.insertBefore(U(),n),n,void 0,t??{})}return i._$AI(o),i};var oe=globalThis,g=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=xe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return S}};g._$litElement$=!0,g.finalized=!0,oe.litElementHydrateSupport?.({LitElement:g});var Ge=oe.litElementPolyfillSupport;Ge?.({LitElement:g});(oe.litElementVersions??=[]).push("4.2.2");var v={PAUSE:1,VOLUME_SET:4,VOLUME_MUTE:8,PREVIOUS_TRACK:16,NEXT_TRACK:32,TURN_ON:128,TURN_OFF:256,VOLUME_STEP:1024,SELECT_SOURCE:2048,STOP:4096,PLAY:16384},B=["up","down","left","right","select","back","home","menu"],L={generic:{label:"Generic remote",service:"remote.send_command",target:"remote",field:"command",keys:{up:"up",down:"down",left:"left",right:"right",select:"select",back:"back",home:"home",menu:"menu"}},apple_tv:{label:"Apple TV",service:"remote.send_command",target:"remote",field:"command",keys:{up:"up",down:"down",left:"left",right:"right",select:"select",back:"menu",home:"home",menu:"top_menu"}},android_tv:{label:"Android TV / Google TV / Shield (Android TV Remote)",service:"remote.send_command",target:"remote",field:"command",keys:{up:"DPAD_UP",down:"DPAD_DOWN",left:"DPAD_LEFT",right:"DPAD_RIGHT",select:"DPAD_CENTER",back:"BACK",home:"HOME",menu:"MENU"}},android_adb:{label:"Android TV / Fire TV (ADB)",service:"androidtv.adb_command",target:"player",field:"command",keys:{up:"UP",down:"DOWN",left:"LEFT",right:"RIGHT",select:"CENTER",back:"BACK",home:"HOME",menu:"MENU"}},roku:{label:"Roku",service:"remote.send_command",target:"remote",field:"command",keys:{up:"up",down:"down",left:"left",right:"right",select:"select",back:"back",home:"home",menu:"info"}},lg_webos:{label:"LG webOS TV",service:"webostv.button",target:"player",field:"button",keys:{up:"UP",down:"DOWN",left:"LEFT",right:"RIGHT",select:"ENTER",back:"BACK",home:"HOME",menu:"MENU"}},samsung_tv:{label:"Samsung TV",service:"remote.send_command",target:"remote",field:"command",keys:{up:"KEY_UP",down:"KEY_DOWN",left:"KEY_LEFT",right:"KEY_RIGHT",select:"KEY_ENTER",back:"KEY_RETURN",home:"KEY_HOME",menu:"KEY_MENU"}},sony_bravia:{label:"Sony Bravia",service:"remote.send_command",target:"remote",field:"command",keys:{up:"Up",down:"Down",left:"Left",right:"Right",select:"Confirm",back:"Return",home:"Home",menu:"Options"}},philips_tv:{label:"Philips TV",service:"remote.send_command",target:"remote",field:"command",keys:{up:"CursorUp",down:"CursorDown",left:"CursorLeft",right:"CursorRight",select:"Confirm",back:"Back",home:"Home",menu:"Options"}},kodi:{label:"Kodi",service:"kodi.call_method",target:"player",field:"method",keys:{up:"Input.Up",down:"Input.Down",left:"Input.Left",right:"Input.Right",select:"Input.Select",back:"Input.Back",home:"Input.Home",menu:"Input.ContextMenu"}}},Se={apple_tv:"apple_tv",androidtv_remote:"android_tv",androidtv:"android_adb",roku:"roku",webostv:"lg_webos",samsungtv:"samsung_tv",braviatv:"sony_bravia",philips_js:"philips_tv",kodi:"kodi"},Je=[["playing","buffering"],["paused"],["on","idle"]],ke={tv:"mdi:television",speaker:"mdi:speaker",receiver:"mdi:audio-video"},Xe=["off","standby","unavailable","unknown"];function Ce(o){let e=typeof o=="string"?{entity:o}:{...o};if(!e.entity||!String(e.entity).startsWith("media_player."))throw new Error(`Omni Remote: every item in "entities" needs a media_player entity (got ${JSON.stringify(o)})`);if(e.platform&&e.platform!=="auto"&&!L[e.platform])throw new Error(`Omni Remote: unknown platform "${e.platform}" for ${e.entity}. Use one of: auto, ${Object.keys(L).join(", ")}`);return e}function Te(o,e,t={}){if(!o||o.length===0)return null;let{pinned:s,tiers:i=Je}=t;if(s){let n=o.find(r=>r.entity===s);if(n)return n}for(let n of i){let r=o.find(d=>{let a=e&&e[d.entity];return a&&n.includes(a.state)});if(r)return r}return o[0]}function z(o,e){let t=e&&e.entities||{},s=t[o.entity],i=o.platform&&o.platform!=="auto"?o.platform:null;!i&&s&&Se[s.platform]&&(i=Se[s.platform]);let n=o.remote||null;if(!n&&s&&s.device_id){let c=Object.values(t).find(h=>h.device_id===s.device_id&&h.entity_id&&h.entity_id.startsWith("remote."));c&&(n=c.entity_id)}!i&&n&&(i="generic");let r=i?L[i]:null,d=r?{...r.keys,...o.commands||{}}:{...o.commands||{}},a=!!r&&(r.target==="player"||!!n);return{presetKey:i,preset:r,remote:n,keys:d,dpad:a}}function y(o,e){if(!o||!o.attributes)return!0;let t=o.attributes.supported_features;return t==null?!0:(t&e)!==0}function Re(o,e,t=z(o,e)){let s=e&&e.states||{},i=s[o.entity],n=s[o.volume_entity||o.entity],r=o.actions||{},d=new Set(o.hide||[]),a=new Set,c=(m,b)=>{!d.has(m)&&(b||r[m])&&a.add(m)};c("power",y(i,v.TURN_ON|v.TURN_OFF)||!!t.remote),c("previous",y(i,v.PREVIOUS_TRACK)),c("play_pause",y(i,v.PAUSE|v.PLAY)),c("next",y(i,v.NEXT_TRACK));let h=y(n,v.VOLUME_STEP|v.VOLUME_SET);c("volume_down",h),c("volume_up",h),c("mute",y(n,v.VOLUME_MUTE));let l=!!(n&&n.attributes&&typeof n.attributes.volume_level=="number");c("volume_set",l&&y(n,v.VOLUME_SET));let _=i&&i.attributes&&i.attributes.source_list;c("source",y(i,v.SELECT_SOURCE)&&Array.isArray(_)&&_.length>0);for(let m of B)c(m,t.dpad&&!!t.keys[m]);return a}function Pe(o){let[e,...t]=String(o).split(".");return{domain:e,service:t.join(".")}}function ne(o){let e=o&&(o.perform_action||o.service||o.action);return!e||!String(e).includes(".")?null:{...Pe(e),data:{...o.target||{},...o.data||{}}}}function Oe(o,e,t,s,i){if(!e)return null;if(e.actions&&e.actions[o])return ne(e.actions[o]);let n=t&&t.states||{},r=i||z(e,t),d=e.entity,a=e.volume_entity||d,c=(h,l)=>({domain:"media_player",service:h,data:l});switch(o){case"power":{let h=n[d],l=!h||Xe.includes(h.state),_=l?v.TURN_ON:v.TURN_OFF;return!y(h,_)&&r.remote?{domain:"remote",service:l?"turn_on":"turn_off",data:{entity_id:r.remote}}:c(l?"turn_on":"turn_off",{entity_id:d})}case"play_pause":return c("media_play_pause",{entity_id:d});case"previous":return c("media_previous_track",{entity_id:d});case"next":return c("media_next_track",{entity_id:d});case"volume_up":return c("volume_up",{entity_id:a});case"volume_down":return c("volume_down",{entity_id:a});case"mute":{let h=n[a],l=!!(h&&h.attributes&&h.attributes.is_volume_muted);return c("volume_mute",{entity_id:a,is_volume_muted:!l})}case"volume_set":{let h=Math.min(1,Math.max(0,Number(s)));return Number.isNaN(h)?null:c("volume_set",{entity_id:a,volume_level:h})}case"source":return s?c("select_source",{entity_id:d,source:s}):null;default:{if(!B.includes(o)||!r.dpad)return null;let h=r.keys[o];if(!h)return null;let l=r.preset.target==="player"?d:r.remote;return{...Pe(r.preset.service),data:{entity_id:l,[r.preset.field]:h}}}}}var Ze=[{name:"color",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"show_chips",selector:{boolean:{}}},{name:"show_artwork",selector:{boolean:{}}},{name:"show_volume_slider",selector:{boolean:{}}},{name:"show_source",selector:{boolean:{}}}]}],Ue=[{name:"entity",required:!0,selector:{entity:{filter:{domain:"media_player"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"color",selector:{text:{}}},{name:"platform",selector:{select:{mode:"dropdown",options:[{value:"auto",label:"Detect automatically"},...Object.entries(L).map(([o,e])=>({value:o,label:e.label}))]}}}]},{name:"remote",selector:{entity:{filter:{domain:"remote"}}}},{name:"volume_entity",selector:{entity:{filter:{domain:"media_player"}}}}],Qe=[{name:"entity",selector:{entity:{filter:{domain:"media_player"}}}}],et={color:"Accent color (for example #1db954)",show_chips:"Device chips",show_artwork:"Artwork background",show_volume_slider:"Volume slider",show_source:"Source picker",entity:"Media player",name:"Name",icon:"Icon",platform:"Remote type",remote:"Remote entity (d-pad)",volume_entity:"Send volume to"},tt={remote:"Leave empty to use the remote that belongs to the same device.",volume_entity:"Optional soundbar or receiver that should get volume and mute."},st={show_chips:!0,show_artwork:!0,show_volume_slider:!0,show_source:!0};function Ne(o){let e={};for(let[t,s]of Object.entries(o))s==null||s===""||t==="platform"&&s==="auto"||(e[t]=s);return e}var re=class extends g{constructor(){super(...arguments);F(this,"_label",t=>et[t.name]||t.name);F(this,"_helper",t=>tt[t.name])}static get properties(){return{hass:{attribute:!1},_config:{state:!0}}}setConfig(t){this._config=t,this._loadFormElements()}async _loadFormElements(){if(customElements.get("ha-form"))return;let t=customElements.get("hui-tile-card");t&&t.getConfigElement&&await t.getConfigElement()}get _devices(){return(this._config.entities||[]).map(t=>typeof t=="string"?{entity:t}:t)}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_setDevices(t){this._emit({...this._config,entities:t.map(s=>Object.keys(s).length===1?s.entity:s)})}_cardChanged(t){t.stopPropagation(),this._emit({...this._config,...Ne(t.detail.value)})}_deviceChanged(t,s){s.stopPropagation();let i=[...this._devices],n={...i[t]};for(let r of Ue.flatMap(d=>d.schema||[d]))delete n[r.name];i[t]={...n,...Ne(s.detail.value)},this._setDevices(i)}_addDevice(t){t.stopPropagation();let s=t.detail.value&&t.detail.value.entity;s&&this._setDevices([...this._devices,{entity:s}])}_move(t,s){let i=[...this._devices],n=t+s;n<0||n>=i.length||([i[t],i[n]]=[i[n],i[t]],this._setDevices(i))}_remove(t){let s=this._devices.filter((i,n)=>n!==t);this._setDevices(s)}render(){if(!this.hass||!this._config)return p;let t=this._devices;return u`
      <p class="hint">
        Add your media players in priority order: the first one that is playing gets the remote.
        Can't find a device? Open Settings, Devices &amp; services, Entities and search for
        <code>media_player.</code> or <code>remote.</code>
      </p>

      ${t.map((s,i)=>u`
          <div class="device">
            <div class="device-head">
              <span>${i+1}. ${s.name||this.hass.states[s.entity]&&this.hass.states[s.entity].attributes.friendly_name||s.entity}</span>
              <span class="actions">
                <button title="Move up" ?disabled=${i===0} @click=${()=>this._move(i,-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
                <button title="Move down" ?disabled=${i===t.length-1} @click=${()=>this._move(i,1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
                <button title="Remove" @click=${()=>this._remove(i)}><ha-icon icon="mdi:delete"></ha-icon></button>
              </span>
            </div>
            <ha-form .hass=${this.hass} .data=${{platform:"auto",...s}} .schema=${Ue}
              .computeLabel=${this._label} .computeHelper=${this._helper}
              @value-changed=${n=>this._deviceChanged(i,n)}></ha-form>
          </div>
        `)}

      <div class="device add">
        <div class="device-head"><span>Add a media player</span></div>
        <ha-form .hass=${this.hass} .data=${{}} .schema=${Qe} .computeLabel=${this._label}
          @value-changed=${this._addDevice}></ha-form>
      </div>

      <h4>Card options</h4>
      <ha-form .hass=${this.hass} .data=${{...st,...this._config}} .schema=${Ze}
        .computeLabel=${this._label} @value-changed=${this._cardChanged}></ha-form>
      <p class="hint">Custom buttons, per-button actions and key overrides are available in the YAML editor.</p>
    `}static get styles(){return R`
      .hint {
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .device {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px 12px 12px;
        margin-bottom: 12px;
      }
      .device-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .actions button {
        background: none;
        border: none;
        color: var(--primary-text-color);
        cursor: pointer;
      }
      .actions button[disabled] {
        opacity: 0.3;
        cursor: default;
      }
    `}};customElements.get("omni-remote-card-editor")||customElements.define("omni-remote-card-editor",re);var it="1.1.0",ot=400,nt=150,rt=new Set(["volume_up","volume_down","up","down","left","right"]),ae=class extends g{static get properties(){return{hass:{attribute:!1},_config:{state:!0},_pinned:{state:!0}}}static getConfigElement(){return document.createElement("omni-remote-card-editor")}static getStubConfig(e){let t=e&&e.states||{},s=Object.keys(t).filter(i=>i.startsWith("media_player.")).sort((i,n)=>(t[i].state==="playing"?-1:0)-(t[n].state==="playing"?-1:0)).slice(0,3);return{entities:s.length?s:["media_player.living_room_tv"]}}setConfig(e){if(!e||!Array.isArray(e.entities)||e.entities.length===0)throw new Error('Omni Remote: add at least one media player under "entities"');this._config={show_chips:!0,show_artwork:!0,show_volume_slider:!0,show_source:!0,...e,devices:e.entities.map(Ce)},this._pinned&&!this._config.devices.some(t=>t.entity===this._pinned)&&(this._pinned=void 0)}getCardSize(){return 7}disconnectedCallback(){super.disconnectedCallback(),this._stopRepeat()}get _active(){return!this._config||!this.hass?null:Te(this._config.devices,this.hass.states,{pinned:this._pinned})}_call(e){e&&(this.hass.callService(e.domain,e.service,e.data),navigator.vibrate&&navigator.vibrate(15))}_press(e,t){this._call(Oe(e,this._active,this.hass,t))}_pointerDown(e,t){t.button!==void 0&&t.button!==0||(t.preventDefault(),this._press(e),rt.has(e)&&(this._stopRepeat(),this._repeatTimer=setTimeout(()=>{this._repeatTimer=setInterval(()=>this._press(e),nt)},ot)))}_stopRepeat(){clearTimeout(this._repeatTimer),clearInterval(this._repeatTimer),this._repeatTimer=void 0}_togglePin(e){this._pinned=this._pinned===e?void 0:e}_moreInfo(){let e=this._active;if(!e)return;let t=new Event("hass-more-info",{bubbles:!0,composed:!0});t.detail={entityId:e.entity},this.dispatchEvent(t)}_deviceName(e){let t=this.hass.states[e.entity];return e.name||t&&t.attributes.friendly_name||e.entity}_deviceIcon(e){let t=this.hass.states[e.entity],s=t&&t.attributes.device_class;return e.icon||t&&t.attributes.icon||ke[s]||"mdi:remote"}_button(e,t,s,i,n=""){return e.has(t)?u`
      <button class="btn ${n}" title=${i} aria-label=${i}
        @pointerdown=${r=>this._pointerDown(t,r)}
        @pointerup=${this._stopRepeat} @pointerleave=${this._stopRepeat} @pointercancel=${this._stopRepeat}
        @click=${r=>r.detail===0&&this._press(t)}>
        <ha-icon .icon=${s}></ha-icon>
      </button>
    `:p}_row(e,t,s,i){return t.some(n=>e.has(n))?u`<div class="row ${s}">${i()}</div>`:p}_renderMissing(){let e=this._config.devices.filter(t=>!this.hass.states[t.entity]);return e.length?u`
      <div class="warning">
        Not found: ${e.map(t=>t.entity).join(", ")}.
        Check the exact id under Settings, Devices &amp; services, Entities.
      </div>
    `:p}_renderChips(e){return!this._config.show_chips||this._config.devices.length<2?p:u`
      <div class="chips">
        ${this._config.devices.map(t=>{let s=this.hass.states[t.entity],i=s&&["playing","buffering"].includes(s.state),n=this._pinned===t.entity,r=["chip",t.entity===e.entity?"active":"",i?"live":""].join(" ");return u`
            <button class=${r} style="--chip-color: ${t.color||"var(--primary-color)"}"
              title=${n?"Tap to return to automatic":"Tap to lock the remote to this device"}
              @click=${()=>this._togglePin(t.entity)}>
              <ha-icon .icon=${this._deviceIcon(t)}></ha-icon>
              <span>${this._deviceName(t)}</span>
              ${n?u`<ha-icon class="lock" icon="mdi:lock"></ha-icon>`:p}
            </button>
          `})}
      </div>
    `}_renderExtras(e,t,s){let i=this._config.show_volume_slider&&t.has("volume_set"),n=this._config.show_source&&t.has("source");if(!i&&!n)return p;let r=this.hass.states[e.volume_entity||e.entity],d=Math.round((r&&r.attributes.volume_level||0)*100);return u`
      <div class="extras">
        ${i?u`
              <label class="slider">
                <ha-icon icon="mdi:volume-medium"></ha-icon>
                <input type="range" min="0" max="100" .value=${String(d)} aria-label="Volume"
                  @change=${a=>this._press("volume_set",a.target.value/100)}>
                <span class="level">${d}</span>
              </label>
            `:p}
        ${n?u`
              <label class="source">
                <ha-icon icon="mdi:import"></ha-icon>
                <select aria-label="Source" @change=${a=>this._press("source",a.target.value)}>
                  ${s.source?p:u`<option value="" selected disabled>Source</option>`}
                  ${s.source_list.map(a=>u`<option value=${a} ?selected=${a===s.source}>${a}</option>`)}
                </select>
              </label>
            `:p}
      </div>
    `}_renderCustomButtons(e){let t=[...e.buttons||[],...this._config.buttons||[]];return t.length?u`
      <div class="row custom">
        ${t.map(s=>u`
            <button class="btn small" title=${s.name||""} aria-label=${s.name||s.icon||"Action"}
              @click=${()=>this._call(ne(s))}>
              ${s.icon?u`<ha-icon .icon=${s.icon}></ha-icon>`:u`<span>${s.name}</span>`}
            </button>
          `)}
      </div>
    `:p}render(){if(!this._config||!this.hass)return p;let e=this._active,t=this.hass.states[e.entity],s=t?t.state:"unavailable",i=t&&t.attributes||{},n=!!t&&!["off","standby","unavailable","unknown"].includes(s),r=e.color||this._config.color||"var(--primary-color)",d=this._config.show_artwork&&n&&i.entity_picture,a=i.media_title,c=i.media_artist||i.media_series_title||i.app_name||i.source,h=z(e,this.hass),l=Re(e,this.hass,h),_=this.hass.states[e.volume_entity||e.entity],m=_&&_.attributes.is_volume_muted,b=s==="playing"||s==="buffering",f=(...K)=>this._button(l,...K);return u`
      <ha-card style="--omni-accent: ${r}">
        ${d?u`<div class="art" style="background-image:url('${i.entity_picture}')"></div>`:p}
        <div class="content">
          ${this._renderMissing()}
          <div class="header">
            <div class="badge ${n?"on":""}" @click=${this._moreInfo}>
              <ha-icon .icon=${this._deviceIcon(e)}></ha-icon>
            </div>
            <div class="info" @click=${this._moreInfo}>
              <div class="name">${this._deviceName(e)}</div>
              <div class="media">
                ${a?u`<span class="title">${a}</span>`:u`<span class="state">${s}</span>`}
                ${c?u`<span class="sub">${c}</span>`:p}
              </div>
            </div>
            ${f("power","mdi:power","Power",`power ${n?"on":""}`)}
          </div>

          ${this._renderChips(e)}

          ${B.some(K=>l.has(K))?u`
                <div class="dpad">
                  ${f("up","mdi:chevron-up","Up","up")}
                  ${f("left","mdi:chevron-left","Left","left")}
                  ${f("select","mdi:circle-medium","Select","ok")}
                  ${f("right","mdi:chevron-right","Right","right")}
                  ${f("down","mdi:chevron-down","Down","down")}
                </div>
                ${this._row(l,["back","home","menu"],"",()=>u`
                  ${f("back","mdi:arrow-left","Back")}
                  ${f("home","mdi:home","Home")}
                  ${f("menu","mdi:menu","Menu")}
                `)}
              `:p}

          ${this._row(l,["previous","play_pause","next"],"transport",()=>u`
            ${f("previous","mdi:skip-previous","Previous")}
            ${f("play_pause",b?"mdi:pause":"mdi:play","Play or pause","primary")}
            ${f("next","mdi:skip-next","Next")}
          `)}
          ${this._row(l,["volume_down","mute","volume_up"],"volume",()=>u`
            ${f("volume_down","mdi:volume-minus","Volume down")}
            ${f("mute",m?"mdi:volume-off":"mdi:volume-high","Mute",m?"muted":"")}
            ${f("volume_up","mdi:volume-plus","Volume up")}
          `)}

          ${this._renderExtras(e,l,i)}
          ${this._renderCustomButtons(e)}
        </div>
      </ha-card>
    `}static get styles(){return R`
      ha-card {
        --omni-accent: var(--primary-color);
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.4s ease;
        box-shadow: inset 0 3px 0 0 var(--omni-accent), var(--ha-card-box-shadow, none);
      }
      .art {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        filter: blur(28px) saturate(1.4);
        opacity: 0.25;
        transform: scale(1.2);
        pointer-events: none;
      }
      .content {
        position: relative;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .warning {
        font-size: 0.85em;
        padding: 8px 12px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 18%, transparent);
      }
      .header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .badge {
        flex: none;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        cursor: pointer;
        background: color-mix(in srgb, var(--omni-accent) 15%, transparent);
        color: var(--secondary-text-color);
        transition: background 0.4s ease, color 0.4s ease;
      }
      .badge.on {
        background: var(--omni-accent);
        color: var(--text-primary-color, #fff);
      }
      .info {
        flex: 1;
        min-width: 0;
        cursor: pointer;
      }
      .name {
        font-size: 1.1em;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .media {
        display: flex;
        flex-direction: column;
        font-size: 0.9em;
        color: var(--secondary-text-color);
      }
      .media span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .state {
        text-transform: capitalize;
      }
      .chips {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .chip {
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px 4px 8px;
        border-radius: 16px;
        border: 1px solid var(--divider-color);
        background: none;
        color: var(--primary-text-color);
        font: inherit;
        font-size: 0.85em;
        cursor: pointer;
        --mdc-icon-size: 18px;
      }
      .chip.live ha-icon:first-child {
        color: var(--chip-color);
      }
      .chip.active {
        border-color: var(--chip-color);
        background: color-mix(in srgb, var(--chip-color) 18%, transparent);
      }
      .chip .lock {
        --mdc-icon-size: 14px;
      }
      .btn {
        border: none;
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        color: var(--primary-text-color);
        border-radius: 50%;
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        cursor: pointer;
        touch-action: manipulation;
        user-select: none;
        transition: background 0.2s ease, transform 0.1s ease, color 0.4s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .btn:hover {
        background: color-mix(in srgb, var(--omni-accent) 20%, transparent);
      }
      .btn:active {
        transform: scale(0.92);
      }
      .btn.primary,
      .btn.ok {
        background: var(--omni-accent);
        color: var(--text-primary-color, #fff);
      }
      .btn.power {
        flex: none;
        width: 44px;
        height: 44px;
        color: var(--secondary-text-color);
      }
      .btn.power.on {
        color: var(--omni-accent);
      }
      .btn.muted {
        color: var(--error-color, #db4437);
      }
      .btn.small {
        width: 44px;
        height: 44px;
        font: inherit;
        font-size: 0.75em;
      }
      .row {
        display: flex;
        justify-content: space-evenly;
      }
      .custom {
        flex-wrap: wrap;
        gap: 8px;
      }
      .dpad {
        display: grid;
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        gap: 6px;
        justify-content: center;
      }
      .dpad .btn {
        width: 60px;
        height: 60px;
      }
      .dpad .up { grid-area: 1 / 2; }
      .dpad .left { grid-area: 2 / 1; }
      .dpad .ok { grid-area: 2 / 2; }
      .dpad .right { grid-area: 2 / 3; }
      .dpad .down { grid-area: 3 / 2; }
      .extras {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .extras label {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--secondary-text-color);
      }
      .slider input {
        flex: 1;
        accent-color: var(--omni-accent);
      }
      .level {
        width: 2.5em;
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .source select {
        flex: 1;
        padding: 6px 8px;
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
      }
    `}};customElements.get("omni-remote-card")||(customElements.define("omni-remote-card",ae),window.customCards=window.customCards||[],window.customCards.push({type:"omni-remote-card",name:"Omni Remote",description:"One remote that follows whichever media player is active.",preview:!0,documentationURL:"https://github.com/PeterSlijkhuis/Omni-Remote"}),console.info(`%c OMNI-REMOTE-CARD %c ${it} `,"background:#222;color:#fff","background:#03a9f4;color:#fff"));
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
