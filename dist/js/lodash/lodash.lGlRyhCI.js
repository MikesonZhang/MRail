import{c as t,g as n}from"../@amap/@amap.c8pGcSIC.js";var r=function(t){var n=typeof t;return null!=t&&("object"==n||"function"==n)},e="object"==typeof t&&t&&t.Object===Object&&t,o="object"==typeof self&&self&&self.Object===Object&&self,i=e||o||Function("return this")(),u=i,a=function(){return u.Date.now()},c=/\s/;var f=function(t){for(var n=t.length;n--&&c.test(t.charAt(n)););return n},l=/^\s+/;var v=function(t){return t?t.slice(0,f(t)+1).replace(l,""):t},s=i.Symbol,p=s,b=Object.prototype,d=b.hasOwnProperty,m=b.toString,y=p?p.toStringTag:void 0;var j=function(t){var n=d.call(t,y),r=t[y];try{t[y]=void 0;var e=!0}catch(i){}var o=m.call(t);return e&&(n?t[y]=r:delete t[y]),o},g=Object.prototype.toString;var h=j,O=function(t){return g.call(t)},T=s?s.toStringTag:void 0;var x=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":T&&T in Object(t)?h(t):O(t)},S=function(t){return null!=t&&"object"==typeof t};var N=v,w=r,$=function(t){return"symbol"==typeof t||S(t)&&"[object Symbol]"==x(t)},E=/^[-+]0x[0-9a-f]+$/i,M=/^0b[01]+$/i,W=/^0o[0-7]+$/i,A=parseInt;var D=r,F=a,I=function(t){if("number"==typeof t)return t;if($(t))return NaN;if(w(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=w(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=N(t);var r=M.test(t);return r||W.test(t)?A(t.slice(2),r?2:8):E.test(t)?NaN:+t},P=Math.max,U=Math.min;const k=n((function(t,n,r){var e,o,i,u,a,c,f=0,l=!1,v=!1,s=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function p(n){var r=e,i=o;return e=o=void 0,f=n,u=t.apply(i,r)}function b(t){var r=t-c;return void 0===c||r>=n||r<0||v&&t-f>=i}function d(){var t=F();if(b(t))return m(t);a=setTimeout(d,function(t){var r=n-(t-c);return v?U(r,i-(t-f)):r}(t))}function m(t){return a=void 0,s&&e?p(t):(e=o=void 0,u)}function y(){var t=F(),r=b(t);if(e=arguments,o=this,c=t,r){if(void 0===a)return function(t){return f=t,a=setTimeout(d,n),l?p(t):u}(c);if(v)return clearTimeout(a),a=setTimeout(d,n),p(c)}return void 0===a&&(a=setTimeout(d,n)),u}return n=I(n)||0,D(r)&&(l=!!r.leading,i=(v="maxWait"in r)?P(I(r.maxWait)||0,n):i,s="trailing"in r?!!r.trailing:s),y.cancel=function(){void 0!==a&&clearTimeout(a),f=0,e=c=o=a=void 0},y.flush=function(){return void 0===a?u:m(F())},y}));export{k as d};
