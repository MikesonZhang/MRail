!function(){function t(n){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(n)}System.register(["../@amap-legacy/@amap.G1K7UQzB.js"],(function(n,e){"use strict";var r,o;return{setters:[function(t){r=t.c,o=t.g}],execute:function(){var e=function(n){var e=t(n);return null!=n&&("object"==e||"function"==e)},i="object"==t(r)&&r&&r.Object===Object&&r,u="object"==("undefined"==typeof self?"undefined":t(self))&&self&&self.Object===Object&&self,c=i||u||Function("return this")(),f=c,a=function(){return f.Date.now()},l=/\s/;var v=function(t){for(var n=t.length;n--&&l.test(t.charAt(n)););return n},s=/^\s+/;var y=function(t){return t?t.slice(0,v(t)+1).replace(s,""):t},b=c.Symbol,p=b,m=Object.prototype,d=m.hasOwnProperty,j=m.toString,g=p?p.toStringTag:void 0;var S=function(t){var n=d.call(t,g),e=t[g];try{t[g]=void 0;var r=!0}catch(i){}var o=j.call(t);return r&&(n?t[g]=e:delete t[g]),o},h=Object.prototype.toString;var O=S,T=function(t){return h.call(t)},x=b?b.toStringTag:void 0;var N=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":x&&x in Object(t)?O(t):T(t)},w=function(n){return null!=n&&"object"==t(n)};var $=y,E=e,M=function(n){return"symbol"==t(n)||w(n)&&"[object Symbol]"==N(n)},W=/^[-+]0x[0-9a-f]+$/i,A=/^0b[01]+$/i,D=/^0o[0-7]+$/i,F=parseInt;var I=e,P=a,U=function(t){if("number"==typeof t)return t;if(M(t))return NaN;if(E(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=E(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=$(t);var e=A.test(t);return e||D.test(t)?F(t.slice(2),e?2:8):W.test(t)?NaN:+t},k=Math.max,q=Math.min;var z=function(t,n,e){var r,o,i,u,c,f,a=0,l=!1,v=!1,s=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function y(n){var e=r,i=o;return r=o=void 0,a=n,u=t.apply(i,e)}function b(t){var e=t-f;return void 0===f||e>=n||e<0||v&&t-a>=i}function p(){var t=P();if(b(t))return m(t);c=setTimeout(p,function(t){var e=n-(t-f);return v?q(e,i-(t-a)):e}(t))}function m(t){return c=void 0,s&&r?y(t):(r=o=void 0,u)}function d(){var t=P(),e=b(t);if(r=arguments,o=this,f=t,e){if(void 0===c)return function(t){return a=t,c=setTimeout(p,n),l?y(t):u}(f);if(v)return clearTimeout(c),c=setTimeout(p,n),y(f)}return void 0===c&&(c=setTimeout(p,n)),u}return n=U(n)||0,I(e)&&(l=!!e.leading,i=(v="maxWait"in e)?k(U(e.maxWait)||0,n):i,s="trailing"in e?!!e.trailing:s),d.cancel=function(){void 0!==c&&clearTimeout(c),a=0,r=f=o=c=void 0},d.flush=function(){return void 0===c?u:m(P())},d};n("d",o(z))}}}))}();