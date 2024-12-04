"use strict";(self.webpackChunkquiri_docs=self.webpackChunkquiri_docs||[]).push([[516],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return f}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),l=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},s=function(e){var t=l(e.components);return n.createElement(u.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),p=l(r),f=o,g=p["".concat(u,".").concat(f)]||p[f]||m[f]||i;return r?n.createElement(g,a(a({ref:t},s),{},{components:r})):n.createElement(g,a({ref:t},s))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=p;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var l=2;l<i;l++)a[l]=r[l];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},4319:function(e,t,r){r.r(t),r.d(t,{assets:function(){return s},contentTitle:function(){return u},default:function(){return f},frontMatter:function(){return c},metadata:function(){return l},toc:function(){return m}});var n=r(7462),o=r(3366),i=(r(7294),r(3905)),a=["components"],c={slug:"project-structure-and-state-management-in-flutter",title:"Project Structure and State Management in Flutter",authors:["nigel"],tags:["guides"]},u=void 0,l={permalink:"/quiri-docs/blog/project-structure-and-state-management-in-flutter",source:"@site/blog/2022-11-15-project-structure-and-state-management-in-flutter copy 2.md",title:"Project Structure and State Management in Flutter",description:"Flutter is a compelling technology but it is not very mature so there are some challenges when it comes to filling in the functionality that is missing from the core libraries. I have spent a lot of time reading different blogs, etc. to try to get some guidance and hopefully avoid some common pitfalls. One resource that has been useful is codewithandrea.com. I am going to be referencing his riverpod and other architecture articles to inform my library architectural decisions.",date:"2022-11-15T00:00:00.000Z",formattedDate:"November 15, 2022",tags:[{label:"guides",permalink:"/quiri-docs/blog/tags/guides"}],readingTime:.4,truncated:!1,authors:[{name:"Nigel Maynard",title:"Quiri Founder",url:"https://github.com/nigel-smk",imageURL:"https://github.com/nigel-smk.png",key:"nigel"}],frontMatter:{slug:"project-structure-and-state-management-in-flutter",title:"Project Structure and State Management in Flutter",authors:["nigel"],tags:["guides"]},prevItem:{title:"Using Ory for Auth with Synapse",permalink:"/quiri-docs/blog/using-ory-for-auth-with-synapse"},nextItem:{title:"Getting Started With the Matrix API",permalink:"/quiri-docs/blog/getting-started-matrix-api"}},s={authorsImageUrls:[void 0]},m=[],p={toc:m};function f(e){var t=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Flutter is a compelling technology but it is not very mature so there are some challenges when it comes to filling in the functionality that is missing from the core libraries. I have spent a lot of time reading different blogs, etc. to try to get some guidance and hopefully avoid some common pitfalls. One resource that has been useful is ",(0,i.kt)("a",{parentName:"p",href:"https://codewithandrea.com/tutorials/"},"codewithandrea.com"),". I am going to be referencing his riverpod and other architecture articles to inform my library architectural decisions."))}f.isMDXComponent=!0}}]);