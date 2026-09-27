var M=globalThis,T=M.ShadowRoot&&(M.ShadyCSS===void 0||M.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,D=Symbol(),Y=new WeakMap,E=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==D)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(T&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=Y.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Y.set(e,t))}return t}toString(){return this.cssText}},tt=o=>new E(typeof o=="string"?o:o+"",void 0,D),I=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((i,s,n)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[n+1],o[0]);return new E(e,o,D)},et=(o,t)=>{if(T)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=M.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,o.appendChild(i)}},L=T?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return tt(e)})(o):o;var{is:xt,defineProperty:St,getOwnPropertyDescriptor:Et,getOwnPropertyNames:Ct,getOwnPropertySymbols:kt,getPrototypeOf:Pt}=Object,R=globalThis,it=R.trustedTypes,Ot=it?it.emptyScript:"",Nt=R.reactiveElementPolyfillSupport,C=(o,t)=>o,z={toAttribute(o,t){switch(t){case Boolean:o=o?Ot:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},ot=(o,t)=>!xt(o,t),st={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:ot};Symbol.metadata??=Symbol("metadata"),R.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=st){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&St(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:n}=Et(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:s,set(r){let l=s?.call(this);n?.call(this,r),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??st}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let t=Pt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let e=this.properties,i=[...Ct(e),...kt(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(L(s))}else t!==void 0&&e.push(L(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return et(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:z).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:z;this._$Em=s;let l=r.fromAttribute(e,n.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(t!==void 0){let r=this.constructor;if(s===!1&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??ot)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),n!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:r}=n,l=this[s];r!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[C("elementProperties")]=new Map,$[C("finalized")]=new Map,Nt?.({ReactiveElement:$}),(R.reactiveElementVersions??=[]).push("2.1.2");var K=globalThis,nt=o=>o,H=K.trustedTypes,rt=H?H.createPolicy("lit-html",{createHTML:o=>o}):void 0,pt="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,ut="?"+v,Ut=`<${ut}>`,A=document,P=()=>A.createComment(""),O=o=>o===null||typeof o!="object"&&typeof o!="function",J=Array.isArray,Mt=o=>J(o)||typeof o?.[Symbol.iterator]=="function",j=`[ 	
\f\r]`,k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,at=/-->/g,ct=/>/g,y=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),lt=/'/g,ht=/"/g,mt=/^(?:script|style|textarea|title)$/i,Z=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),_=Z(1),Vt=Z(2),Wt=Z(3),w=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),dt=new WeakMap,b=A.createTreeWalker(A,129);function _t(o,t){if(!J(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return rt!==void 0?rt.createHTML(t):t}var Tt=(o,t)=>{let e=o.length-1,i=[],s,n=t===2?"<svg>":t===3?"<math>":"",r=k;for(let l=0;l<e;l++){let a=o[l],h,d,c=-1,m=0;for(;m<a.length&&(r.lastIndex=m,d=r.exec(a),d!==null);)m=r.lastIndex,r===k?d[1]==="!--"?r=at:d[1]!==void 0?r=ct:d[2]!==void 0?(mt.test(d[2])&&(s=RegExp("</"+d[2],"g")),r=y):d[3]!==void 0&&(r=y):r===y?d[0]===">"?(r=s??k,c=-1):d[1]===void 0?c=-2:(c=r.lastIndex-d[2].length,h=d[1],r=d[3]===void 0?y:d[3]==='"'?ht:lt):r===ht||r===lt?r=y:r===at||r===ct?r=k:(r=y,s=void 0);let f=r===y&&o[l+1].startsWith("/>")?" ":"";n+=r===k?a+Ut:c>=0?(i.push(h),a.slice(0,c)+pt+a.slice(c)+v+f):a+v+(c===-2?l:f)}return[_t(o,n+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},N=class o{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0,l=t.length-1,a=this.parts,[h,d]=Tt(t,e);if(this.el=o.createElement(h,i),b.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=b.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(pt)){let m=d[r++],f=s.getAttribute(c).split(v),u=/([.?@])?(.*)/.exec(m);a.push({type:1,index:n,name:u[2],strings:f,ctor:u[1]==="."?V:u[1]==="?"?W:u[1]==="@"?q:S}),s.removeAttribute(c)}else c.startsWith(v)&&(a.push({type:6,index:n}),s.removeAttribute(c));if(mt.test(s.tagName)){let c=s.textContent.split(v),m=c.length-1;if(m>0){s.textContent=H?H.emptyScript:"";for(let f=0;f<m;f++)s.append(c[f],P()),b.nextNode(),a.push({type:2,index:++n});s.append(c[m],P())}}}else if(s.nodeType===8)if(s.data===ut)a.push({type:2,index:n});else{let c=-1;for(;(c=s.data.indexOf(v,c+1))!==-1;)a.push({type:7,index:n}),c+=v.length-1}n++}}static createElement(t,e){let i=A.createElement("template");return i.innerHTML=t,i}};function x(o,t,e=o,i){if(t===w)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,n=O(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(o),s._$AT(o,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=x(o,s._$AS(o,t.values),s,i)),t}var B=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??A).importNode(e,!0);b.currentNode=s;let n=b.nextNode(),r=0,l=0,a=i[0];for(;a!==void 0;){if(r===a.index){let h;a.type===2?h=new U(n,n.nextSibling,this,t):a.type===1?h=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(h=new F(n,this,t)),this._$AV.push(h),a=i[++l]}r!==a?.index&&(n=b.nextNode(),r++)}return b.currentNode=A,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},U=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=x(this,t,e),O(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==w&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Mt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=N.createElement(_t(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new B(s,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(t){let e=dt.get(t.strings);return e===void 0&&dt.set(t.strings,e=new N(t)),e}k(t){J(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let n of t)s===e.length?e.push(i=new o(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=nt(t).nextSibling;nt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(t,e=this,i,s){let n=this.strings,r=!1;if(n===void 0)t=x(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==w,r&&(this._$AH=t);else{let l=t,a,h;for(t=n[0],a=0;a<n.length-1;a++)h=x(this,l[i+a],e,a),h===w&&(h=this._$AH[a]),r||=!O(h)||h!==this._$AH[a],h===p?t=p:t!==p&&(t+=(h??"")+n[a+1]),this._$AH[a]=h}r&&!s&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},V=class extends S{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},W=class extends S{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},q=class extends S{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=x(this,t,e,0)??p)===w)return;let i=this._$AH,s=t===p&&i!==p||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==p&&(i===p||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},F=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){x(this,t)}};var Rt=K.litHtmlPolyfillSupport;Rt?.(N,U),(K.litHtmlVersions??=[]).push("3.3.3");var ft=(o,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let n=e?.renderBefore??null;i._$litPart$=s=new U(t.insertBefore(P(),n),n,void 0,e??{})}return s._$AI(o),s};var G=globalThis,g=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ft(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return w}};g._$litElement$=!0,g.finalized=!0,G.litElementHydrateSupport?.({LitElement:g});var Ht=G.litElementPolyfillSupport;Ht?.({LitElement:g});(G.litElementVersions??=[]).push("4.2.2");var $t={up:"up",down:"down",left:"left",right:"right",select:"select",back:"menu",home:"home"},Dt=[["playing","buffering"],["paused"],["on","idle"]],vt={tv:"mdi:television",speaker:"mdi:speaker",receiver:"mdi:audio-video"};function gt(o){let t=typeof o=="string"?{entity:o}:{...o};if(!t.entity||!String(t.entity).startsWith("media_player."))throw new Error(`Omni Remote: every item in "entities" needs a media_player entity (got ${JSON.stringify(o)})`);return t.commands={...$t,...t.commands||{}},t}function yt(o,t,e={}){if(!o||o.length===0)return null;let{pinned:i,tiers:s=Dt}=e;if(i){let n=o.find(r=>r.entity===i);if(n)return n}for(let n of s){let r=o.find(l=>{let a=t&&t[l.entity];return a&&n.includes(a.state)});if(r)return r}return o[0]}function bt(o,t,e){if(!t)return null;let i=t.entity,s=t.volume_entity||i,n=e&&e[s];switch(o){case"power":{let r=e&&e[i];return{domain:"media_player",service:!r||r.state==="off"||r.state==="standby"?"turn_on":"turn_off",data:{entity_id:i}}}case"play_pause":return{domain:"media_player",service:"media_play_pause",data:{entity_id:i}};case"previous":return{domain:"media_player",service:"media_previous_track",data:{entity_id:i}};case"next":return{domain:"media_player",service:"media_next_track",data:{entity_id:i}};case"volume_up":return{domain:"media_player",service:"volume_up",data:{entity_id:s}};case"volume_down":return{domain:"media_player",service:"volume_down",data:{entity_id:s}};case"mute":{let r=!!(n&&n.attributes&&n.attributes.is_volume_muted);return{domain:"media_player",service:"volume_mute",data:{entity_id:s,is_volume_muted:!r}}}case"up":case"down":case"left":case"right":case"select":case"back":case"home":{if(!t.remote)return null;let r=(t.commands||$t)[o];return r?{domain:"remote",service:"send_command",data:{entity_id:t.remote,command:r}}:null}default:return null}}var It="1.0.0",Q=class extends g{static get properties(){return{hass:{attribute:!1},_config:{state:!0},_pinned:{state:!0}}}static getStubConfig(t){let e=Object.keys(t&&t.states||{}).filter(i=>i.startsWith("media_player.")).slice(0,2);return{entities:e.length?e:["media_player.living_room_tv"]}}setConfig(t){if(!t||!Array.isArray(t.entities)||t.entities.length===0)throw new Error('Omni Remote: add at least one media player under "entities"');this._config={show_chips:!0,show_artwork:!0,...t,devices:t.entities.map(gt)},this._pinned&&!this._config.devices.some(e=>e.entity===this._pinned)&&(this._pinned=void 0)}getCardSize(){return 6}get _active(){return!this._config||!this.hass?null:yt(this._config.devices,this.hass.states,{pinned:this._pinned})}_press(t,e){e&&e.stopPropagation();let i=bt(t,this._active,this.hass.states);i&&(this.hass.callService(i.domain,i.service,i.data),navigator.vibrate&&navigator.vibrate(15))}_togglePin(t){this._pinned=this._pinned===t?void 0:t}_moreInfo(){let t=this._active;if(!t)return;let e=new Event("hass-more-info",{bubbles:!0,composed:!0});e.detail={entityId:t.entity},this.dispatchEvent(e)}_deviceName(t){let e=this.hass.states[t.entity];return t.name||e&&e.attributes.friendly_name||t.entity}_deviceIcon(t){let e=this.hass.states[t.entity],i=e&&e.attributes.device_class;return t.icon||e&&e.attributes.icon||vt[i]||"mdi:remote"}_button(t,e,i,s=""){return _`
      <button class="btn ${s}" title=${i} aria-label=${i}
        @click=${n=>this._press(t,n)}>
        <ha-icon .icon=${e}></ha-icon>
      </button>
    `}render(){if(!this._config||!this.hass)return _``;let t=this._active,e=this.hass.states[t.entity],i=e?e.state:"unavailable",s=e&&e.attributes||{},n=e&&!["off","standby","unavailable","unknown"].includes(i),r=t.color||this._config.color||"var(--primary-color)",l=this._config.show_artwork&&n&&s.entity_picture,a=s.media_title,h=s.media_artist||s.media_series_title||s.app_name||s.source,d=!!t.remote,c=this.hass.states[t.volume_entity||t.entity],m=c&&c.attributes.is_volume_muted,f=i==="playing"||i==="buffering";return _`
      <ha-card style="--omni-accent: ${r}">
        ${l?_`<div class="art" style="background-image:url('${s.entity_picture}')"></div>`:""}
        <div class="content">
          <div class="header" @click=${this._moreInfo}>
            <div class="badge ${n?"on":""}">
              <ha-icon .icon=${this._deviceIcon(t)}></ha-icon>
            </div>
            <div class="info">
              <div class="name">${this._deviceName(t)}</div>
              <div class="media">
                ${a?_`<span class="title">${a}</span>`:_`<span class="state">${i}</span>`}
                ${h?_`<span class="sub">${h}</span>`:""}
              </div>
            </div>
            <button class="btn power ${n?"on":""}" aria-label="Power"
              @click=${u=>this._press("power",u)}>
              <ha-icon icon="mdi:power"></ha-icon>
            </button>
          </div>

          ${this._config.show_chips&&this._config.devices.length>1?_`
                <div class="chips">
                  ${this._config.devices.map(u=>{let X=this.hass.states[u.entity],At=X&&["playing","buffering"].includes(X.state),wt=["chip",u.entity===t.entity?"active":"",this._pinned===u.entity?"pinned":"",At?"live":""].join(" ");return _`
                      <button class=${wt} style="--chip-color: ${u.color||"var(--primary-color)"}"
                        title=${this._pinned===u.entity?"Tap to return to automatic":"Tap to lock the remote to this device"}
                        @click=${()=>this._togglePin(u.entity)}>
                        <ha-icon .icon=${this._deviceIcon(u)}></ha-icon>
                        <span>${this._deviceName(u)}</span>
                        ${this._pinned===u.entity?_`<ha-icon class="lock" icon="mdi:lock"></ha-icon>`:""}
                      </button>
                    `})}
                </div>
              `:""}

          ${d?_`
                <div class="dpad">
                  ${this._button("up","mdi:chevron-up","Up","up")}
                  ${this._button("left","mdi:chevron-left","Left","left")}
                  ${this._button("select","mdi:circle-medium","Select","ok")}
                  ${this._button("right","mdi:chevron-right","Right","right")}
                  ${this._button("down","mdi:chevron-down","Down","down")}
                </div>
                <div class="row">
                  ${this._button("back","mdi:arrow-left","Back")}
                  ${this._button("home","mdi:home","Home")}
                </div>
              `:""}

          <div class="row transport">
            ${this._button("previous","mdi:skip-previous","Previous")}
            ${this._button("play_pause",f?"mdi:pause":"mdi:play","Play or pause","primary")}
            ${this._button("next","mdi:skip-next","Next")}
          </div>

          <div class="row volume">
            ${this._button("volume_down","mdi:volume-minus","Volume down")}
            ${this._button("mute",m?"mdi:volume-off":"mdi:volume-high","Mute",m?"muted":"")}
            ${this._button("volume_up","mdi:volume-plus","Volume up")}
          </div>
        </div>
      </ha-card>
    `}static get styles(){return I`
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
      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }
      .badge {
        flex: none;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
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
      .row {
        display: flex;
        justify-content: space-evenly;
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
    `}};customElements.get("omni-remote-card")||(customElements.define("omni-remote-card",Q),window.customCards=window.customCards||[],window.customCards.push({type:"omni-remote-card",name:"Omni Remote",description:"One remote that follows whichever media player is active.",preview:!0}),console.info(`%c OMNI-REMOTE-CARD %c ${It} `,"background:#222;color:#fff","background:#03a9f4;color:#fff"));
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
