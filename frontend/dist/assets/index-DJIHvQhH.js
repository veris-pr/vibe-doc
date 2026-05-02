(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function r(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=r(a);fetch(a.href,i)}})();var q,v,Xe,Ve,U,Ie,Je,Ze,he,te,W,Qe,ke,fe,_e,Ye,oe={},ne=[],bt=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,X=Array.isArray;function P(t,e){for(var r in e)t[r]=e[r];return t}function we(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function $e(t,e,r){var o,a,i,c={};for(i in e)i=="key"?o=e[i]:i=="ref"?a=e[i]:c[i]=e[i];if(arguments.length>2&&(c.children=arguments.length>3?q.call(arguments,2):r),typeof t=="function"&&t.defaultProps!=null)for(i in t.defaultProps)c[i]===void 0&&(c[i]=t.defaultProps[i]);return R(t,c,o,a,null)}function R(t,e,r,o,a){var i={type:t,props:e,key:r,ref:o,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:a??++Xe,__i:-1,__u:0};return a==null&&v.vnode!=null&&v.vnode(i),i}function de(t){return t.children}function z(t,e){this.props=t,this.context=e}function H(t,e){if(e==null)return t.__?H(t.__,t.__i+1):null;for(var r;e<t.__k.length;e++)if((r=t.__k[e])!=null&&r.__e!=null)return r.__e;return typeof t.type=="function"?H(t):null}function kt(t){if(t.__P&&t.__d){var e=t.__v,r=e.__e,o=[],a=[],i=P({},e);i.__v=e.__v+1,v.vnode&&v.vnode(i),Se(t.__P,i,e,t.__n,t.__P.namespaceURI,32&e.__u?[r]:null,o,r??H(e),!!(32&e.__u),a),i.__v=e.__v,i.__.__k[i.__i]=i,ot(o,i,a),e.__e=e.__=null,i.__e!=r&&et(i)}}function et(t){if((t=t.__)!=null&&t.__c!=null)return t.__e=t.__c.base=null,t.__k.some(function(e){if(e!=null&&e.__e!=null)return t.__e=t.__c.base=e.__e}),et(t)}function ve(t){(!t.__d&&(t.__d=!0)&&U.push(t)&&!ie.__r++||Ie!=v.debounceRendering)&&((Ie=v.debounceRendering)||Je)(ie)}function ie(){try{for(var t,e=1;U.length;)U.length>e&&U.sort(Ze),t=U.shift(),e=U.length,kt(t)}finally{U.length=ie.__r=0}}function tt(t,e,r,o,a,i,c,l,u,d,p){var s,f,h,y,$,b,g,m=o&&o.__k||ne,D=e.length;for(u=wt(r,e,m,u,D),s=0;s<D;s++)(h=r.__k[s])!=null&&(f=h.__i!=-1&&m[h.__i]||oe,h.__i=s,b=Se(t,h,f,a,i,c,l,u,d,p),y=h.__e,h.ref&&f.ref!=h.ref&&(f.ref&&Ce(f.ref,null,h),p.push(h.ref,h.__c||y,h)),$==null&&y!=null&&($=y),(g=!!(4&h.__u))||f.__k===h.__k?(u=rt(h,u,t,g),g&&f.__e&&(f.__e=null)):typeof h.type=="function"&&b!==void 0?u=b:y&&(u=y.nextSibling),h.__u&=-7);return r.__e=$,u}function wt(t,e,r,o,a){var i,c,l,u,d,p=r.length,s=p,f=0;for(t.__k=new Array(a),i=0;i<a;i++)(c=e[i])!=null&&typeof c!="boolean"&&typeof c!="function"?(typeof c=="string"||typeof c=="number"||typeof c=="bigint"||c.constructor==String?c=t.__k[i]=R(null,c,null,null,null):X(c)?c=t.__k[i]=R(de,{children:c},null,null,null):c.constructor===void 0&&c.__b>0?c=t.__k[i]=R(c.type,c.props,c.key,c.ref?c.ref:null,c.__v):t.__k[i]=c,u=i+f,c.__=t,c.__b=t.__b+1,l=null,(d=c.__i=$t(c,r,u,s))!=-1&&(s--,(l=r[d])&&(l.__u|=2)),l==null||l.__v==null?(d==-1&&(a>p?f--:a<p&&f++),typeof c.type!="function"&&(c.__u|=4)):d!=u&&(d==u-1?f--:d==u+1?f++:(d>u?f--:f++,c.__u|=4))):t.__k[i]=null;if(s)for(i=0;i<p;i++)(l=r[i])!=null&&!(2&l.__u)&&(l.__e==o&&(o=H(l)),it(l,l));return o}function rt(t,e,r,o){var a,i;if(typeof t.type=="function"){for(a=t.__k,i=0;a&&i<a.length;i++)a[i]&&(a[i].__=t,e=rt(a[i],e,r,o));return e}t.__e!=e&&(o&&(e&&t.type&&!e.parentNode&&(e=H(t)),r.insertBefore(t.__e,e||null)),e=t.__e);do e=e&&e.nextSibling;while(e!=null&&e.nodeType==8);return e}function ge(t,e){return e=e||[],t==null||typeof t=="boolean"||(X(t)?t.some(function(r){ge(r,e)}):e.push(t)),e}function $t(t,e,r,o){var a,i,c,l=t.key,u=t.type,d=e[r],p=d!=null&&(2&d.__u)==0;if(d===null&&l==null||p&&l==d.key&&u==d.type)return r;if(o>(p?1:0)){for(a=r-1,i=r+1;a>=0||i<e.length;)if((d=e[c=a>=0?a--:i++])!=null&&!(2&d.__u)&&l==d.key&&u==d.type)return c}return-1}function Ae(t,e,r){e[0]=="-"?t.setProperty(e,r??""):t[e]=r==null?"":typeof r!="number"||bt.test(e)?r:r+"px"}function Z(t,e,r,o,a){var i,c;e:if(e=="style")if(typeof r=="string")t.style.cssText=r;else{if(typeof o=="string"&&(t.style.cssText=o=""),o)for(e in o)r&&e in r||Ae(t.style,e,"");if(r)for(e in r)o&&r[e]==o[e]||Ae(t.style,e,r[e])}else if(e[0]=="o"&&e[1]=="n")i=e!=(e=e.replace(Qe,"$1")),c=e.toLowerCase(),e=c in t||e=="onFocusOut"||e=="onFocusIn"?c.slice(2):e.slice(2),t.l||(t.l={}),t.l[e+i]=r,r?o?r[W]=o[W]:(r[W]=ke,t.addEventListener(e,i?_e:fe,i)):t.removeEventListener(e,i?_e:fe,i);else{if(a=="http://www.w3.org/2000/svg")e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!="width"&&e!="height"&&e!="href"&&e!="list"&&e!="form"&&e!="tabIndex"&&e!="download"&&e!="rowSpan"&&e!="colSpan"&&e!="role"&&e!="popover"&&e in t)try{t[e]=r??"";break e}catch{}typeof r=="function"||(r==null||r===!1&&e[4]!="-"?t.removeAttribute(e):t.setAttribute(e,e=="popover"&&r==1?"":r))}}function Oe(t){return function(e){if(this.l){var r=this.l[e.type+t];if(e[te]==null)e[te]=ke++;else if(e[te]<r[W])return;return r(v.event?v.event(e):e)}}}function Se(t,e,r,o,a,i,c,l,u,d){var p,s,f,h,y,$,b,g,m,D,N,F,Me,J,ue,C=e.type;if(e.constructor!==void 0)return null;128&r.__u&&(u=!!(32&r.__u),i=[l=e.__e=r.__e]),(p=v.__b)&&p(e);e:if(typeof C=="function")try{if(g=e.props,m=C.prototype&&C.prototype.render,D=(p=C.contextType)&&o[p.__c],N=p?D?D.props.value:p.__:o,r.__c?b=(s=e.__c=r.__c).__=s.__E:(m?e.__c=s=new C(g,N):(e.__c=s=new z(g,N),s.constructor=C,s.render=Ct),D&&D.sub(s),s.state||(s.state={}),s.__n=o,f=s.__d=!0,s.__h=[],s._sb=[]),m&&s.__s==null&&(s.__s=s.state),m&&C.getDerivedStateFromProps!=null&&(s.__s==s.state&&(s.__s=P({},s.__s)),P(s.__s,C.getDerivedStateFromProps(g,s.__s))),h=s.props,y=s.state,s.__v=e,f)m&&C.getDerivedStateFromProps==null&&s.componentWillMount!=null&&s.componentWillMount(),m&&s.componentDidMount!=null&&s.__h.push(s.componentDidMount);else{if(m&&C.getDerivedStateFromProps==null&&g!==h&&s.componentWillReceiveProps!=null&&s.componentWillReceiveProps(g,N),e.__v==r.__v||!s.__e&&s.shouldComponentUpdate!=null&&s.shouldComponentUpdate(g,s.__s,N)===!1){e.__v!=r.__v&&(s.props=g,s.state=s.__s,s.__d=!1),e.__e=r.__e,e.__k=r.__k,e.__k.some(function(O){O&&(O.__=e)}),ne.push.apply(s.__h,s._sb),s._sb=[],s.__h.length&&c.push(s);break e}s.componentWillUpdate!=null&&s.componentWillUpdate(g,s.__s,N),m&&s.componentDidUpdate!=null&&s.__h.push(function(){s.componentDidUpdate(h,y,$)})}if(s.context=N,s.props=g,s.__P=t,s.__e=!1,F=v.__r,Me=0,m)s.state=s.__s,s.__d=!1,F&&F(e),p=s.render(s.props,s.state,s.context),ne.push.apply(s.__h,s._sb),s._sb=[];else do s.__d=!1,F&&F(e),p=s.render(s.props,s.state,s.context),s.state=s.__s;while(s.__d&&++Me<25);s.state=s.__s,s.getChildContext!=null&&(o=P(P({},o),s.getChildContext())),m&&!f&&s.getSnapshotBeforeUpdate!=null&&($=s.getSnapshotBeforeUpdate(h,y)),J=p!=null&&p.type===de&&p.key==null?nt(p.props.children):p,l=tt(t,X(J)?J:[J],e,r,o,a,i,c,l,u,d),s.base=e.__e,e.__u&=-161,s.__h.length&&c.push(s),b&&(s.__E=s.__=null)}catch(O){if(e.__v=null,u||i!=null)if(O.then){for(e.__u|=u?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;i[i.indexOf(l)]=null,e.__e=l}else{for(ue=i.length;ue--;)we(i[ue]);me(e)}else e.__e=r.__e,e.__k=r.__k,O.then||me(e);v.__e(O,e,r)}else i==null&&e.__v==r.__v?(e.__k=r.__k,e.__e=r.__e):l=e.__e=St(r.__e,e,r,o,a,i,c,u,d);return(p=v.diffed)&&p(e),128&e.__u?void 0:l}function me(t){t&&(t.__c&&(t.__c.__e=!0),t.__k&&t.__k.some(me))}function ot(t,e,r){for(var o=0;o<r.length;o++)Ce(r[o],r[++o],r[++o]);v.__c&&v.__c(e,t),t.some(function(a){try{t=a.__h,a.__h=[],t.some(function(i){i.call(a)})}catch(i){v.__e(i,a.__v)}})}function nt(t){return typeof t!="object"||t==null||t.__b>0?t:X(t)?t.map(nt):P({},t)}function St(t,e,r,o,a,i,c,l,u){var d,p,s,f,h,y,$,b=r.props||oe,g=e.props,m=e.type;if(m=="svg"?a="http://www.w3.org/2000/svg":m=="math"?a="http://www.w3.org/1998/Math/MathML":a||(a="http://www.w3.org/1999/xhtml"),i!=null){for(d=0;d<i.length;d++)if((h=i[d])&&"setAttribute"in h==!!m&&(m?h.localName==m:h.nodeType==3)){t=h,i[d]=null;break}}if(t==null){if(m==null)return document.createTextNode(g);t=document.createElementNS(a,m,g.is&&g),l&&(v.__m&&v.__m(e,i),l=!1),i=null}if(m==null)b===g||l&&t.data==g||(t.data=g);else{if(i=i&&q.call(t.childNodes),!l&&i!=null)for(b={},d=0;d<t.attributes.length;d++)b[(h=t.attributes[d]).name]=h.value;for(d in b)h=b[d],d=="dangerouslySetInnerHTML"?s=h:d=="children"||d in g||d=="value"&&"defaultValue"in g||d=="checked"&&"defaultChecked"in g||Z(t,d,null,h,a);for(d in g)h=g[d],d=="children"?f=h:d=="dangerouslySetInnerHTML"?p=h:d=="value"?y=h:d=="checked"?$=h:l&&typeof h!="function"||b[d]===h||Z(t,d,h,b[d],a);if(p)l||s&&(p.__html==s.__html||p.__html==t.innerHTML)||(t.innerHTML=p.__html),e.__k=[];else if(s&&(t.innerHTML=""),tt(e.type=="template"?t.content:t,X(f)?f:[f],e,r,o,m=="foreignObject"?"http://www.w3.org/1999/xhtml":a,i,c,i?i[0]:r.__k&&H(r,0),l,u),i!=null)for(d=i.length;d--;)we(i[d]);l||(d="value",m=="progress"&&y==null?t.removeAttribute("value"):y!=null&&(y!==t[d]||m=="progress"&&!y||m=="option"&&y!=b[d])&&Z(t,d,y,b[d],a),d="checked",$!=null&&$!=t[d]&&Z(t,d,$,b[d],a))}return t}function Ce(t,e,r){try{if(typeof t=="function"){var o=typeof t.__u=="function";o&&t.__u(),o&&e==null||(t.__u=t(e))}else t.current=e}catch(a){v.__e(a,r)}}function it(t,e,r){var o,a;if(v.unmount&&v.unmount(t),(o=t.ref)&&(o.current&&o.current!=t.__e||Ce(o,null,e)),(o=t.__c)!=null){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(i){v.__e(i,e)}o.base=o.__P=null}if(o=t.__k)for(a=0;a<o.length;a++)o[a]&&it(o[a],e,r||typeof t.type!="function");r||we(t.__e),t.__c=t.__=t.__e=void 0}function Ct(t,e,r){return this.constructor(t,r)}function Pt(t,e,r){var o,a,i,c;e==document&&(e=document.documentElement),v.__&&v.__(t,e),a=(o=!1)?null:e.__k,i=[],c=[],Se(e,t=e.__k=$e(de,null,[t]),a||oe,oe,e.namespaceURI,a?null:e.firstChild?q.call(e.childNodes):null,i,a?a.__e:e.firstChild,o,c),ot(i,t,c)}function Dt(t,e,r){var o,a,i,c,l=P({},t.props);for(i in t.type&&t.type.defaultProps&&(c=t.type.defaultProps),e)i=="key"?o=e[i]:i=="ref"?a=e[i]:l[i]=e[i]===void 0&&c!=null?c[i]:e[i];return arguments.length>2&&(l.children=arguments.length>3?q.call(arguments,2):r),R(t.type,l,o||t.key,a||t.ref,null)}function jt(t){function e(r){var o,a;return this.getChildContext||(o=new Set,(a={})[e.__c]=this,this.getChildContext=function(){return a},this.componentWillUnmount=function(){o=null},this.shouldComponentUpdate=function(i){this.props.value!=i.value&&o.forEach(function(c){c.__e=!0,ve(c)})},this.sub=function(i){o.add(i);var c=i.componentWillUnmount;i.componentWillUnmount=function(){o&&o.delete(i),c&&c.call(i)}}),r.children}return e.__c="__cC"+Ye++,e.__=t,e.Provider=e.__l=(e.Consumer=function(r,o){return r.children(o)}).contextType=e,e}q=ne.slice,v={__e:function(t,e,r,o){for(var a,i,c;e=e.__;)if((a=e.__c)&&!a.__)try{if((i=a.constructor)&&i.getDerivedStateFromError!=null&&(a.setState(i.getDerivedStateFromError(t)),c=a.__d),a.componentDidCatch!=null&&(a.componentDidCatch(t,o||{}),c=a.__d),c)return a.__E=a}catch(l){t=l}throw t}},Xe=0,Ve=function(t){return t!=null&&t.constructor===void 0},z.prototype.setState=function(t,e){var r;r=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=P({},this.state),typeof t=="function"&&(t=t(P({},r),this.props)),t&&P(r,t),t!=null&&this.__v&&(e&&this._sb.push(e),ve(this))},z.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),ve(this))},z.prototype.render=de,U=[],Je=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Ze=function(t,e){return t.__v.__b-e.__v.__b},ie.__r=0,he=Math.random().toString(8),te="__d"+he,W="__a"+he,Qe=/(PointerCapture)$|Capture$/i,ke=0,fe=Oe(!1),_e=Oe(!0),Ye=0;var Ut=0;function n(t,e,r,o,a,i){e||(e={});var c,l,u=e;if("ref"in u)for(l in u={},e)l=="ref"?c=e[l]:u[l]=e[l];var d={type:t,props:u,key:r,ref:c,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--Ut,__i:-1,__u:0,__source:a,__self:i};if(typeof t=="function"&&(c=t.defaultProps))for(l in c)u[l]===void 0&&(u[l]=c[l]);return v.vnode&&v.vnode(d),d}var G,x,pe,Te,ye=0,at=[],k=v,ze=k.__b,He=k.__r,Ee=k.diffed,Le=k.__c,Fe=k.unmount,We=k.__;function Pe(t,e){k.__h&&k.__h(x,t,ye||e),ye=0;var r=x.__H||(x.__H={__:[],__h:[]});return t>=r.__.length&&r.__.push({}),r.__[t]}function B(t){return ye=1,Nt(lt,t)}function Nt(t,e,r){var o=Pe(G++,2);if(o.t=t,!o.__c&&(o.__=[lt(void 0,e),function(l){var u=o.__N?o.__N[0]:o.__[0],d=o.t(u,l);u!==d&&(o.__N=[d,o.__[1]],o.__c.setState({}))}],o.__c=x,!x.__f)){var a=function(l,u,d){if(!o.__c.__H)return!0;var p=o.__c.__H.__.filter(function(f){return f.__c});if(p.every(function(f){return!f.__N}))return!i||i.call(this,l,u,d);var s=o.__c.props!==l;return p.some(function(f){if(f.__N){var h=f.__[0];f.__=f.__N,f.__N=void 0,h!==f.__[0]&&(s=!0)}}),i&&i.call(this,l,u,d)||s};x.__f=!0;var i=x.shouldComponentUpdate,c=x.componentWillUpdate;x.componentWillUpdate=function(l,u,d){if(this.__e){var p=i;i=void 0,a(l,u,d),i=p}c&&c.call(this,l,u,d)},x.shouldComponentUpdate=a}return o.__N||o.__}function Re(t,e){var r=Pe(G++,3);!k.__s&&st(r.__H,e)&&(r.__=t,r.u=e,x.__H.__h.push(r))}function ct(t,e){var r=Pe(G++,7);return st(r.__H,e)&&(r.__=t(),r.__H=e,r.__h=t),r.__}function Mt(){for(var t;t=at.shift();){var e=t.__H;if(t.__P&&e)try{e.__h.some(re),e.__h.some(xe),e.__h=[]}catch(r){e.__h=[],k.__e(r,t.__v)}}}k.__b=function(t){x=null,ze&&ze(t)},k.__=function(t,e){t&&e.__k&&e.__k.__m&&(t.__m=e.__k.__m),We&&We(t,e)},k.__r=function(t){He&&He(t),G=0;var e=(x=t.__c).__H;e&&(pe===x?(e.__h=[],x.__h=[],e.__.some(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})):(e.__h.some(re),e.__h.some(xe),e.__h=[],G=0)),pe=x},k.diffed=function(t){Ee&&Ee(t);var e=t.__c;e&&e.__H&&(e.__H.__h.length&&(at.push(e)!==1&&Te===k.requestAnimationFrame||((Te=k.requestAnimationFrame)||It)(Mt)),e.__H.__.some(function(r){r.u&&(r.__H=r.u),r.u=void 0})),pe=x=null},k.__c=function(t,e){e.some(function(r){try{r.__h.some(re),r.__h=r.__h.filter(function(o){return!o.__||xe(o)})}catch(o){e.some(function(a){a.__h&&(a.__h=[])}),e=[],k.__e(o,r.__v)}}),Le&&Le(t,e)},k.unmount=function(t){Fe&&Fe(t);var e,r=t.__c;r&&r.__H&&(r.__H.__.some(function(o){try{re(o)}catch(a){e=a}}),r.__H=void 0,e&&k.__e(e,r.__v))};var Be=typeof requestAnimationFrame=="function";function It(t){var e,r=function(){clearTimeout(o),Be&&cancelAnimationFrame(e),setTimeout(t)},o=setTimeout(r,35);Be&&(e=requestAnimationFrame(r))}function re(t){var e=x,r=t.__c;typeof r=="function"&&(t.__c=void 0,r()),x=e}function xe(t){var e=x;t.__c=t.__(),x=e}function st(t,e){return!t||t.length!==e.length||e.some(function(r,o){return r!==t[o]})}function lt(t,e){return typeof e=="function"?e(t):e}var At=Symbol.for("preact-signals");function De(){if(M>1)M--;else{var t,e=!1;for(function(){var a=ce;for(ce=void 0;a!==void 0;)a.S.v===a.v&&(a.S.i=a.i),a=a.o}();K!==void 0;){var r=K;for(K=void 0,ae++;r!==void 0;){var o=r.u;if(r.u=void 0,r.f&=-3,!(8&r.f)&&ht(r))try{r.c()}catch(a){e||(t=a,e=!0)}r=o}}if(ae=0,M--,e)throw t}}var _=void 0;function dt(t){var e=_;_=void 0;try{return t()}finally{_=e}}var K=void 0,M=0,ae=0,Ke=0,ce=void 0,se=0;function ut(t){if(_!==void 0){var e=t.n;if(e===void 0||e.t!==_)return e={i:0,S:t,p:_.s,n:void 0,t:_,e:void 0,x:void 0,r:e},_.s!==void 0&&(_.s.n=e),_.s=e,t.n=e,32&_.f&&t.S(e),e;if(e.i===-1)return e.i=0,e.n!==void 0&&(e.n.p=e.p,e.p!==void 0&&(e.p.n=e.n),e.p=_.s,e.n=void 0,_.s.n=e,_.s=e),e}}function w(t,e){this.v=t,this.i=0,this.n=void 0,this.t=void 0,this.l=0,this.W=e==null?void 0:e.watched,this.Z=e==null?void 0:e.unwatched,this.name=e==null?void 0:e.name}w.prototype.brand=At;w.prototype.h=function(){return!0};w.prototype.S=function(t){var e=this,r=this.t;r!==t&&t.e===void 0&&(t.x=r,this.t=t,r!==void 0?r.e=t:dt(function(){var o;(o=e.W)==null||o.call(e)}))};w.prototype.U=function(t){var e=this;if(this.t!==void 0){var r=t.e,o=t.x;r!==void 0&&(r.x=o,t.e=void 0),o!==void 0&&(o.e=r,t.x=void 0),t===this.t&&(this.t=o,o===void 0&&dt(function(){var a;(a=e.Z)==null||a.call(e)}))}};w.prototype.subscribe=function(t){var e=this;return Ue(function(){var r=e.value,o=_;_=void 0;try{t(r)}finally{_=o}},{name:"sub"})};w.prototype.valueOf=function(){return this.value};w.prototype.toString=function(){return this.value+""};w.prototype.toJSON=function(){return this.value};w.prototype.peek=function(){var t=_;_=void 0;try{return this.value}finally{_=t}};Object.defineProperty(w.prototype,"value",{get:function(){var t=ut(this);return t!==void 0&&(t.i=this.i),this.v},set:function(t){if(t!==this.v){if(ae>100)throw new Error("Cycle detected");(function(r){M!==0&&ae===0&&r.l!==Ke&&(r.l=Ke,ce={S:r,v:r.v,i:r.i,o:ce})})(this),this.v=t,this.i++,se++,M++;try{for(var e=this.t;e!==void 0;e=e.x)e.t.N()}finally{De()}}}});function V(t,e){return new w(t,e)}function ht(t){for(var e=t.s;e!==void 0;e=e.n)if(e.S.i!==e.i||!e.S.h()||e.S.i!==e.i)return!0;return!1}function pt(t){for(var e=t.s;e!==void 0;e=e.n){var r=e.S.n;if(r!==void 0&&(e.r=r),e.S.n=e,e.i=-1,e.n===void 0){t.s=e;break}}}function ft(t){for(var e=t.s,r=void 0;e!==void 0;){var o=e.p;e.i===-1?(e.S.U(e),o!==void 0&&(o.n=e.n),e.n!==void 0&&(e.n.p=o)):r=e,e.S.n=e.r,e.r!==void 0&&(e.r=void 0),e=o}t.s=r}function A(t,e){w.call(this,void 0),this.x=t,this.s=void 0,this.g=se-1,this.f=4,this.W=e==null?void 0:e.watched,this.Z=e==null?void 0:e.unwatched,this.name=e==null?void 0:e.name}A.prototype=new w;A.prototype.h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===se))return!0;if(this.g=se,this.f|=1,this.i>0&&!ht(this))return this.f&=-2,!0;var t=_;try{pt(this),_=this;var e=this.x();(16&this.f||this.v!==e||this.i===0)&&(this.v=e,this.f&=-17,this.i++)}catch(r){this.v=r,this.f|=16,this.i++}return _=t,ft(this),this.f&=-2,!0};A.prototype.S=function(t){if(this.t===void 0){this.f|=36;for(var e=this.s;e!==void 0;e=e.n)e.S.S(e)}w.prototype.S.call(this,t)};A.prototype.U=function(t){if(this.t!==void 0&&(w.prototype.U.call(this,t),this.t===void 0)){this.f&=-33;for(var e=this.s;e!==void 0;e=e.n)e.S.U(e)}};A.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var t=this.t;t!==void 0;t=t.x)t.t.N()}};Object.defineProperty(A.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var t=ut(this);if(this.h(),t!==void 0&&(t.i=this.i),16&this.f)throw this.v;return this.v}});function Ot(t,e){return new A(t,e)}function _t(t){var e=t.m;if(t.m=void 0,typeof e=="function"){M++;var r=_;_=void 0;try{e()}catch(o){throw t.f&=-2,t.f|=8,je(t),o}finally{_=r,De()}}}function je(t){for(var e=t.s;e!==void 0;e=e.n)e.S.U(e);t.x=void 0,t.s=void 0,_t(t)}function Tt(t){if(_!==this)throw new Error("Out-of-order effect");ft(this),_=t,this.f&=-2,8&this.f&&je(this),De()}function E(t,e){this.x=t,this.m=void 0,this.s=void 0,this.u=void 0,this.f=32,this.name=e==null?void 0:e.name}E.prototype.c=function(){var t=this.S();try{if(8&this.f||this.x===void 0)return;var e=this.x();typeof e=="function"&&(this.m=e)}finally{t()}};E.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1,this.f&=-9,_t(this),pt(this),M++;var t=_;return _=this,Tt.bind(this,t)};E.prototype.N=function(){2&this.f||(this.f|=2,this.u=K,K=this)};E.prototype.d=function(){this.f|=8,1&this.f||je(this)};E.prototype.dispose=function(){this.d()};function Ue(t,e){var r=new E(t,e);try{r.c()}catch(a){throw r.d(),a}var o=r.d.bind(r);return o[Symbol.dispose]=o,o}var Q;function L(t,e){v[t]=e.bind(null,v[t]||function(){})}function le(t){if(Q){var e=Q;Q=void 0,e()}Q=t&&t.S()}function vt(t){var e=this,r=t.data,o=Ht(r);o.value=r;var a=ct(function(){for(var i=e.__v;i=i.__;)if(i.__c){i.__c.__$f|=4;break}return e.__$u.c=function(){var c,l=e.__$u.S(),u=a.value;l(),Ve(u)||((c=e.base)==null?void 0:c.nodeType)!==3?(e.__$f|=1,e.setState({})):e.base.data=u},Ot(function(){var c=o.value.value;return c===0?0:c===!0?"":c||""})},[]);return a.value}vt.displayName="_st";Object.defineProperties(w.prototype,{constructor:{configurable:!0,value:void 0},type:{configurable:!0,value:vt},props:{configurable:!0,get:function(){return{data:this}}},__b:{configurable:!0,value:1}});L("__b",function(t,e){if(typeof e.type=="string"){var r,o=e.props;for(var a in o)if(a!=="children"){var i=o[a];i instanceof w&&(r||(e.__np=r={}),r[a]=i,o[a]=i.peek())}}t(e)});L("__r",function(t,e){t(e),le();var r,o=e.__c;o&&(o.__$f&=-2,(r=o.__$u)===void 0&&(o.__$u=r=function(a){var i;return Ue(function(){i=this}),i.c=function(){o.__$f|=1,o.setState({})},i}())),le(r)});L("__e",function(t,e,r,o){le(),t(e,r,o)});L("diffed",function(t,e){le();var r;if(typeof e.type=="string"&&(r=e.__e)){var o=e.__np,a=e.props;if(o){var i=r.U;if(i)for(var c in i){var l=i[c];l!==void 0&&!(c in o)&&(l.d(),i[c]=void 0)}else r.U=i={};for(var u in o){var d=i[u],p=o[u];d===void 0?(d=zt(r,u,p,a),i[u]=d):d.o(p,a)}}}t(e)});function zt(t,e,r,o){var a=e in t&&t.ownerSVGElement===void 0,i=V(r);return{o:function(c,l){i.value=c,o=l},d:Ue(function(){var c=i.value.value;o[e]!==c&&(o[e]=c,a?t[e]=c:c?t.setAttribute(e,c):t.removeAttribute(e))})}}L("unmount",function(t,e){if(typeof e.type=="string"){var r=e.__e;if(r){var o=r.U;if(o){r.U=void 0;for(var a in o){var i=o[a];i&&i.d()}}}}else{var c=e.__c;if(c){var l=c.__$u;l&&(c.__$u=void 0,l.d())}}t(e)});L("__h",function(t,e,r,o){(o<3||o===9)&&(e.__$f|=2),t(e,r,o)});z.prototype.shouldComponentUpdate=function(t,e){if(this.__R)return!0;var r=this.__$u,o=r&&r.s!==void 0;for(var a in e)return!0;if(this.__f||typeof this.u=="boolean"&&this.u===!0){if(!(o||2&this.__$f||4&this.__$f)||1&this.__$f)return!0}else if(!(o||4&this.__$f)||3&this.__$f)return!0;for(var i in t)if(i!=="__source"&&t[i]!==this.props[i])return!0;for(var c in this.props)if(!(c in t))return!0;return!1};function Ht(t){return ct(function(){return V(t)},[])}var Et={};function Y(t,e){for(var r in e)t[r]=e[r];return t}function Lt(t,e,r){var o,a=/(?:\?([^#]*))?(#.*)?$/,i=t.match(a),c={};if(i&&i[1])for(var l=i[1].split("&"),u=0;u<l.length;u++){var d=l[u].split("=");c[decodeURIComponent(d[0])]=decodeURIComponent(d.slice(1).join("="))}t=be(t.replace(a,"")),e=be(e||"");for(var p=Math.max(t.length,e.length),s=0;s<p;s++)if(e[s]&&e[s].charAt(0)===":"){var f=e[s].replace(/(^:|[+*?]+$)/g,""),h=(e[s].match(/[+*?]+$/)||Et)[0]||"",y=~h.indexOf("+"),$=~h.indexOf("*"),b=t[s]||"";if(!b&&!$&&(h.indexOf("?")<0||y)){o=!1;break}if(c[f]=decodeURIComponent(b),y||$){c[f]=t.slice(s).map(decodeURIComponent).join("/");break}}else if(e[s]!==t[s]){o=!1;break}return(r.default===!0||o!==!1)&&c}function Ft(t,e){return t.rank<e.rank?1:t.rank>e.rank?-1:t.index-e.index}function Wt(t,e){return t.index=e,t.rank=function(r){return r.props.default?0:be(r.props.path).map(Rt).join("")}(t),t.props}function be(t){return t.replace(/(^\/+|\/+$)/g,"").split("/")}function Rt(t){return t.charAt(0)==":"?1+"*+?".indexOf(t.charAt(t.length-1))||4:5}var Bt={},I=[],Ge=[],S=null,gt={url:Ne()},Kt=jt(gt);function Ne(){var t;return""+((t=S&&S.location?S.location:S&&S.getCurrentLocation?S.getCurrentLocation():typeof location<"u"?location:Bt).pathname||"")+(t.search||"")}function mt(t,e){return e===void 0&&(e=!1),typeof t!="string"&&t.url&&(e=t.replace,t=t.url),function(r){for(var o=I.length;o--;)if(I[o].canRoute(r))return!0;return!1}(t)&&function(r,o){o===void 0&&(o="push"),S&&S[o]?S[o](r):typeof history<"u"&&history[o+"State"]&&history[o+"State"](null,null,r)}(t,e?"replace":"push"),yt(t)}function yt(t){for(var e=!1,r=0;r<I.length;r++)I[r].routeTo(t)&&(e=!0);return e}function Gt(t){if(t&&t.getAttribute){var e=t.getAttribute("href"),r=t.getAttribute("target");if(e&&e.match(/^\//g)&&(!r||r.match(/^_?self$/i)))return mt(e)}}function qt(t){return t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation(),t.preventDefault(),!1}function Xt(t){if(!(t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.button)){var e=t.target;do if(e.localName==="a"&&e.getAttribute("href")){if(e.hasAttribute("data-native")||e.hasAttribute("native"))return;if(Gt(e))return qt(t)}while(e=e.parentNode)}}var qe=!1;function xt(t){t.history&&(S=t.history),this.state={url:t.url||Ne()}}Y(xt.prototype=new z,{shouldComponentUpdate:function(t){return t.static!==!0||t.url!==this.props.url||t.onChange!==this.props.onChange},canRoute:function(t){var e=ge(this.props.children);return this.g(e,t)!==void 0},routeTo:function(t){this.setState({url:t});var e=this.canRoute(t);return this.p||this.forceUpdate(),e},componentWillMount:function(){this.p=!0},componentDidMount:function(){var t=this;qe||(qe=!0,S||addEventListener("popstate",function(){yt(Ne())}),addEventListener("click",Xt)),I.push(this),S&&(this.u=S.listen(function(e){var r=e.location||e;t.routeTo(""+(r.pathname||"")+(r.search||""))})),this.p=!1},componentWillUnmount:function(){typeof this.u=="function"&&this.u(),I.splice(I.indexOf(this),1)},componentWillUpdate:function(){this.p=!0},componentDidUpdate:function(){this.p=!1},g:function(t,e){t=t.filter(Wt).sort(Ft);for(var r=0;r<t.length;r++){var o=t[r],a=Lt(e,o.props.path,o.props);if(a)return[o,a]}},render:function(t,e){var r,o,a=t.onChange,i=e.url,c=this.c,l=this.g(ge(t.children),i);if(l&&(o=Dt(l[0],Y(Y({url:i,matches:r=l[1]},r),{key:void 0,ref:void 0}))),i!==(c&&c.url)){Y(gt,c=this.c={url:i,previous:c&&c.url,current:o,path:o?o.props.path:null,matches:r}),c.router=this,c.active=o?[o]:[];for(var u=Ge.length;u--;)Ge[u]({});typeof a=="function"&&a(c)}return $e(Kt.Provider,{value:c},o)}});var ee=function(t){return $e(t.component,t)};function Vt(){const t=er.value;return n("header",{class:"header",children:[n("div",{class:"header-content container",children:[n("a",{href:"/",class:"logo",children:[n("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",children:[n("rect",{width:"24",height:"24",rx:"6",fill:"var(--color-primary)"}),n("path",{d:"M7 8h10M7 12h10M7 16h6",stroke:"white","stroke-width":"2","stroke-linecap":"round"})]}),n("span",{children:"OpenDoc"})]}),n("nav",{class:"nav",children:[n("a",{href:"/admin/projects",children:"Dashboard"}),t?n("div",{class:"user-menu",children:[n("img",{src:t.avatar_url||"/default-avatar.png",alt:t.username,class:"avatar"}),n("span",{children:t.username})]}):n("a",{href:"/api/v1/auth/github",children:"Sign in with GitHub"})]})]}),n("style",{children:`
        .header {
          border-bottom: 1px solid var(--color-border);
          padding: 12px 0;
          background: var(--color-bg);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 18px;
          color: var(--color-text);
        }
        .logo:hover {
          text-decoration: none;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
      `})]})}function Jt(){return n("main",{children:[n("section",{class:"hero",children:n("div",{class:"container",children:[n("h1",{children:["Beautiful documentation, ",n("span",{class:"gradient-text",children:"open source"})]}),n("p",{class:"hero-subtitle",children:"OpenDoc is an open source alternative to Mintlify and Fern. Create stunning documentation sites with MDX, OpenAPI support, and a beautiful UI."}),n("div",{class:"hero-actions",children:[n("a",{href:"/admin/projects",class:"button primary",children:"Get Started"}),n("a",{href:"https://github.com",class:"button secondary",children:"View on GitHub"})]})]})}),n("section",{class:"features",children:n("div",{class:"container",children:[n("h2",{children:"Features"}),n("div",{class:"feature-grid",children:[n("div",{class:"feature-card",children:[n("div",{class:"feature-icon",children:"📝"}),n("h3",{children:"MDX Support"}),n("p",{children:"Write documentation in MDX with React components, callouts, and more."})]}),n("div",{class:"feature-card",children:[n("div",{class:"feature-icon",children:"🔌"}),n("h3",{children:"API Docs"}),n("p",{children:"Generate beautiful API documentation from OpenAPI specs automatically."})]}),n("div",{class:"feature-card",children:[n("div",{class:"feature-icon",children:"🔍"}),n("h3",{children:"Instant Search"}),n("p",{children:"Cmd+K search with Pagefind - fast, client-side, no external services."})]}),n("div",{class:"feature-card",children:[n("div",{class:"feature-icon",children:"🎨"}),n("h3",{children:"Beautiful UI"}),n("p",{children:"Modern, clean design that looks professional out of the box."})]}),n("div",{class:"feature-card",children:[n("div",{class:"feature-icon",children:"🌙"}),n("h3",{children:"Dark Mode"}),n("p",{children:"Automatic dark mode support that respects system preferences."})]}),n("div",{class:"feature-card",children:[n("div",{class:"feature-icon",children:"📦"}),n("h3",{children:"Self-Hosted"}),n("p",{children:"Full control - deploy anywhere with Docker. MIT licensed."})]})]})]})}),n("style",{children:`
        .hero {
          padding: 80px 0;
          text-align: center;
        }
        .hero h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--color-primary), #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 20px;
          color: var(--color-text-secondary);
          max-width: 600px;
          margin: 0 auto 32px;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .button {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          font-weight: 500;
          text-decoration: none;
        }
        .features {
          padding: 80px 0;
          background: var(--color-bg-secondary);
        }
        .features h2 {
          text-align: center;
          font-size: 32px;
          margin-bottom: 48px;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .feature-card {
          background: var(--color-bg);
          padding: 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }
        .feature-card h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .feature-card p {
          color: var(--color-text-secondary);
          font-size: 14px;
        }
      `})]})}function Zt({children:t}){const e=(r,o)=>{o.preventDefault(),mt(r)};return n("div",{class:"admin-layout",children:[n("aside",{class:"sidebar",children:n("nav",{children:[n("a",{href:"/admin/projects",onClick:r=>e("/admin/projects",r),children:"Projects"}),n("a",{href:"/admin/settings",onClick:r=>e("/admin/settings",r),children:"Settings"})]})}),n("main",{class:"admin-content",children:t}),n("style",{children:`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 60px);
        }
        .sidebar {
          width: 220px;
          border-right: 1px solid var(--color-border);
          padding: 24px 16px;
          background: var(--color-bg-secondary);
        }
        .sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar a {
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
        }
        .sidebar a:hover {
          background: var(--color-border);
          text-decoration: none;
        }
        .admin-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }
      `})]})}const T=V([]),j=V(!1);function Qt(){const[t,e]=B(!1),[r,o]=B({name:"",slug:"",description:""}),a=async()=>{if(!(!r.name||!r.slug)){j.value=!0;try{const c=await fetch("/api/v1/dev/project",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...r})});if(c.ok){const l=await c.json();l.primary_color="#6366f1",T.value=[...T.value,l],e(!1),o({name:"",slug:"",description:""})}}catch(c){console.error("Failed to create project:",c)}finally{j.value=!1}}};return n("div",{children:[n("div",{class:"page-header",children:[n("h1",{children:"Projects"}),n("div",{class:"header-actions",children:[n("button",{class:"secondary",onClick:async()=>{j.value=!0;try{const c="sample-docs",l=await fetch("/api/v1/dev/project",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:"Sample Documentation",slug:c,description:"Sample docs to get started quickly"})});if(l.ok){const u=await l.json();(await fetch(`/api/v1/dev/seed/${c}`,{method:"POST"})).ok&&(T.value=[...T.value,{...u,primary_color:"#6366f1"}],window.location.href=`/docs/${c}`)}}catch(c){console.error("Failed to create sample project:",c)}finally{j.value=!1}},disabled:j.value,children:j.value?"Creating...":"Try Sample Docs"}),n("button",{class:"primary",onClick:()=>e(!0),disabled:j.value,children:j.value?"Creating...":"+ New Project"})]})]}),t&&n("div",{class:"modal-overlay",children:n("div",{class:"modal",children:[n("h2",{children:"Create New Project"}),n("div",{class:"form-group",children:[n("label",{children:"Name"}),n("input",{type:"text",value:r.name,onInput:c=>o({...r,name:c.target.value}),placeholder:"My Documentation"})]}),n("div",{class:"form-group",children:[n("label",{children:"Slug"}),n("input",{type:"text",value:r.slug,onInput:c=>o({...r,slug:c.target.value}),placeholder:"my-docs"})]}),n("div",{class:"form-group",children:[n("label",{children:"Description"}),n("textarea",{value:r.description,onInput:c=>o({...r,description:c.target.value}),placeholder:"Optional description..."})]}),n("div",{class:"modal-actions",children:[n("button",{class:"secondary",onClick:()=>e(!1),children:"Cancel"}),n("button",{class:"primary",onClick:a,children:"Create"})]})]})}),n("div",{class:"projects-grid",children:T.value.length===0?n("div",{class:"empty-state",children:n("p",{children:"No projects yet. Create your first project to get started."})}):T.value.map(c=>n("a",{href:`/docs/${c.slug}`,class:"project-card",children:[n("div",{class:"project-color",style:{background:c.primary_color}}),n("h3",{children:c.name}),n("p",{children:c.description||"No description"}),n("span",{class:"project-slug",children:["/",c.slug]})]},c.id))})]})}function Yt({projectSlug:t}){const[e,r]=B(!0),[o,a]=B(!1),[i,c]=B(!1);return Re(()=>{console.log("Loading docs for project:",t)},[t]),Re(()=>{const l=u=>{(u.metaKey||u.ctrlKey)&&u.key==="k"&&(u.preventDefault(),a(!0))};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[]),n("div",{class:`docs-viewer ${i?"dark":""}`,children:[n("header",{class:"docs-header",children:[n("div",{class:"header-left",children:[n("button",{class:"menu-toggle",onClick:()=>r(!e),children:n("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"currentColor",children:n("path",{d:"M3 5h14M3 10h14M3 15h14",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round"})})}),n("a",{href:"/",class:"docs-logo",children:"Docs"})]}),n("div",{class:"header-center",children:n("button",{class:"search-trigger",onClick:()=>a(!0),children:[n("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[n("circle",{cx:"7",cy:"7",r:"5",stroke:"currentColor","stroke-width":"1.5"}),n("path",{d:"M11 11l3 3",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round"})]}),n("span",{children:"Search..."}),n("kbd",{children:"⌘K"})]})}),n("div",{class:"header-right",children:[n("button",{class:"theme-toggle",onClick:()=>c(!i),children:i?"☀️":"🌙"}),n("a",{href:"https://github.com",class:"github-link",target:"_blank",children:n("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"currentColor",children:n("path",{d:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"})})})]})]}),n("div",{class:"docs-body",children:[n("aside",{class:`docs-sidebar ${e?"open":""}`,children:n("nav",{class:"sidebar-nav",children:[n("div",{class:"nav-section",children:[n("h4",{children:"Getting Started"}),n("a",{href:"#",class:"nav-link active",children:"Introduction"}),n("a",{href:"#",class:"nav-link",children:"Installation"}),n("a",{href:"#",class:"nav-link",children:"Quick Start"})]}),n("div",{class:"nav-section",children:[n("h4",{children:"API Reference"}),n("a",{href:"#",class:"nav-link",children:"Authentication"}),n("a",{href:"#",class:"nav-link",children:"Users"}),n("a",{href:"#",class:"nav-link",children:"Projects"})]})]})}),n("main",{class:"docs-content",children:[n("article",{class:"prose",children:[n("h1",{children:"Welcome to OpenDoc"}),n("p",{class:"lead",children:"Beautiful documentation made easy. OpenDoc helps you create stunning documentation sites with MDX support, API reference docs, and a polished UI."}),n("h2",{children:"Features"}),n("ul",{children:[n("li",{children:[n("strong",{children:"MDX Support"})," - Write in Markdown with React components"]}),n("li",{children:[n("strong",{children:"API Docs"})," - Auto-generate from OpenAPI specs"]}),n("li",{children:[n("strong",{children:"Search"})," - Instant Cmd+K search"]}),n("li",{children:[n("strong",{children:"Dark Mode"})," - Automatic theme support"]}),n("li",{children:[n("strong",{children:"Self-Hosted"})," - Full control with Docker"]})]}),n("h2",{children:"Code Example"}),n("pre",{class:"code-block",children:n("code",{children:[n("span",{class:"keyword",children:"import"})," ","{ createDocs }"," ",n("span",{class:"keyword",children:"from"})," ",n("span",{class:"string",children:"'opendoc'"}),";",n("span",{class:"keyword",children:"const"})," docs = ",n("span",{class:"function",children:"createDocs"}),"(","{","title: ",n("span",{class:"string",children:"'My Docs'"}),", description: ",n("span",{class:"string",children:"'Documentation for my project'"}),", theme: ",n("span",{class:"string",children:"'modern'"}),"}",");",n("span",{class:"function",children:"await"})," docs.",n("span",{class:"function",children:"build"}),"();"]})}),n("div",{class:"callout callout-info",children:[n("strong",{children:"Note:"})," This is a beautiful callout component that draws attention to important information."]}),n("h2",{children:"Next Steps"}),n("p",{children:["Ready to get started? Check out the ",n("a",{href:"#",children:"Installation Guide"})," to set up your first documentation project."]})]}),n("footer",{class:"docs-footer",children:n("div",{class:"footer-nav",children:[n("a",{href:"#",class:"prev",children:"← Previous"}),n("a",{href:"#",class:"next",children:"Next →"})]})})]}),n("aside",{class:"docs-toc",children:[n("h4",{children:"On this page"}),n("nav",{children:[n("a",{href:"#",class:"active",children:"Features"}),n("a",{href:"#",children:"Code Example"}),n("a",{href:"#",children:"Next Steps"})]})]})]}),o&&n("div",{class:"search-modal",onClick:()=>a(!1),children:n("div",{class:"search-box",onClick:l=>l.stopPropagation(),children:[n("input",{type:"text",placeholder:"Search documentation...",autoFocus:!0}),n("div",{class:"search-results",children:[n("div",{class:"search-result",children:[n("span",{class:"result-title",children:"Introduction"}),n("span",{class:"result-path",children:"Getting Started / Introduction"})]}),n("div",{class:"search-result",children:[n("span",{class:"result-title",children:"Installation"}),n("span",{class:"result-path",children:"Getting Started / Installation"})]})]}),n("div",{class:"search-footer",children:[n("kbd",{children:"↑"}),n("kbd",{children:"↓"})," navigate",n("kbd",{children:"↵"})," select",n("kbd",{children:"esc"})," close"]})]})}),n("style",{children:`
        .docs-viewer {
          min-height: 100vh;
          background: var(--color-bg);
        }
        
        .docs-header {
          position: sticky;
          top: 0;
          height: 60px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: var(--color-bg);
          z-index: 50;
        }
        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .menu-toggle, .theme-toggle {
          background: none;
          padding: 8px;
          border-radius: var(--radius-md);
        }
        .menu-toggle:hover, .theme-toggle:hover {
          background: var(--color-bg-secondary);
        }
        .docs-logo {
          font-weight: 600;
          color: var(--color-text);
        }
        .search-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-size: 14px;
          min-width: 240px;
        }
        .search-trigger kbd {
          margin-left: auto;
          font-size: 11px;
          padding: 2px 6px;
          background: var(--color-border);
          border-radius: 4px;
        }
        
        .docs-body {
          display: flex;
          max-width: 100%;
        }
        
        .docs-sidebar {
          width: 260px;
          border-right: 1px solid var(--color-border);
          padding: 24px 16px;
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          overflow-y: auto;
          background: var(--color-bg);
        }
        .docs-sidebar:not(.open) {
          display: none;
        }
        
        .nav-section {
          margin-bottom: 24px;
        }
        .nav-section h4 {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }
        .nav-link {
          display: block;
          padding: 6px 12px;
          font-size: 14px;
          color: var(--color-text-secondary);
          border-radius: var(--radius-md);
          text-decoration: none;
        }
        .nav-link:hover {
          color: var(--color-text);
          background: var(--color-bg-secondary);
          text-decoration: none;
        }
        .nav-link.active {
          color: var(--color-primary);
          background: rgba(99, 102, 241, 0.1);
        }
        
        .docs-content {
          flex: 1;
          padding: 40px 60px;
          max-width: 800px;
          min-width: 0;
        }
        
        .prose h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .prose h2 {
          font-size: 24px;
          font-weight: 600;
          margin-top: 40px;
          margin-bottom: 16px;
        }
        .prose p {
          color: var(--color-text-secondary);
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .prose .lead {
          font-size: 20px;
          color: var(--color-text);
        }
        .prose ul {
          margin: 16px 0;
          padding-left: 24px;
        }
        .prose li {
          margin-bottom: 8px;
          color: var(--color-text-secondary);
        }
        .prose li strong {
          color: var(--color-text);
        }
        
        .code-block {
          background: #1e293b;
          border-radius: var(--radius-lg);
          padding: 20px;
          overflow-x: auto;
          margin: 20px 0;
        }
        .code-block code {
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.6;
          color: #e2e8f0;
        }
        .code-block .keyword { color: #c084fc; }
        .code-block .string { color: #86efac; }
        .code-block .function { color: #60a5fa; }
        
        .callout {
          padding: 16px 20px;
          border-radius: var(--radius-md);
          margin: 20px 0;
          border-left: 4px solid;
        }
        .callout-info {
          background: rgba(99, 102, 241, 0.1);
          border-color: var(--color-primary);
        }
        
        .docs-toc {
          width: 220px;
          padding: 24px 16px;
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          overflow-y: auto;
        }
        .docs-toc h4 {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          margin-bottom: 12px;
        }
        .docs-toc nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .docs-toc a {
          font-size: 13px;
          color: var(--color-text-secondary);
          text-decoration: none;
        }
        .docs-toc a:hover, .docs-toc a.active {
          color: var(--color-text);
        }
        
        .docs-footer {
          margin-top: 60px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
        }
        .footer-nav {
          display: flex;
          justify-content: space-between;
        }
        .footer-nav a {
          font-size: 14px;
          color: var(--color-primary);
        }
        
        .search-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 100px;
          z-index: 200;
          backdrop-filter: blur(4px);
        }
        .search-box {
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 560px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .search-box input {
          width: 100%;
          padding: 20px 24px;
          font-size: 18px;
          border: none;
          border-bottom: 1px solid var(--color-border);
          border-radius: 0;
        }
        .search-results {
          max-height: 400px;
          overflow-y: auto;
        }
        .search-result {
          padding: 12px 24px;
          cursor: pointer;
        }
        .search-result:hover {
          background: var(--color-bg-secondary);
        }
        .result-title {
          display: block;
          font-weight: 500;
        }
        .result-path {
          display: block;
          font-size: 12px;
          color: var(--color-text-secondary);
          margin-top: 2px;
        }
        .search-footer {
          padding: 12px 24px;
          border-top: 1px solid var(--color-border);
          font-size: 12px;
          color: var(--color-text-secondary);
          display: flex;
          gap: 12px;
        }
        .search-footer kbd {
          background: var(--color-bg-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
        }
        
        @media (max-width: 1024px) {
          .docs-toc { display: none; }
        }
        @media (max-width: 768px) {
          .docs-sidebar { display: none; }
          .docs-content { padding: 24px; }
          .search-trigger { min-width: auto; }
          .search-trigger span { display: none; }
        }
      `})]})}const er=V(null);function tr(){return n("div",{class:"app",children:[n(Vt,{}),n(xt,{children:[n(ee,{path:"/",component:Jt}),n(ee,{path:"/admin",component:Zt,children:n(ee,{path:"/projects",component:Qt})}),n(ee,{path:"/docs/:projectSlug/*",component:Yt})]})]})}Pt(n(tr,{}),document.getElementById("app"));
