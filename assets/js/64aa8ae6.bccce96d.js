"use strict";(self.webpackChunkquiri_docs=self.webpackChunkquiri_docs||[]).push([[3307],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return p}});var r=n(7294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,s=function(e,t){if(null==e)return{};var n,r,s={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,s=e.mdxType,a=e.originalType,l=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),h=u(n),p=s,g=h["".concat(l,".").concat(p)]||h[p]||d[p]||a;return n?r.createElement(g,i(i({ref:t},c),{},{components:n})):r.createElement(g,i({ref:t},c))}));function p(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var a=n.length,i=new Array(a);i[0]=h;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:s,i[1]=o;for(var u=2;u<a;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},2199:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return p},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return d}});var r=n(7462),s=n(3366),a=(n(7294),n(3905)),i=["components"],o={slug:"starting-and-restarting-sessions",title:"Starting and Restarting Sessions",authors:["nigel"],tags:["guides"]},l=void 0,u={permalink:"/quiri-docs/blog/starting-and-restarting-sessions",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2024-05-12-starting-and-restarting-sessions.md",source:"@site/blog/2024-05-12-starting-and-restarting-sessions.md",title:"Starting and Restarting Sessions",description:"Matrix SDK Sessions",date:"2024-05-12T00:00:00.000Z",formattedDate:"May 12, 2024",tags:[{label:"guides",permalink:"/quiri-docs/blog/tags/guides"}],readingTime:1.29,truncated:!1,authors:[{name:"Nigel Maynard",title:"Quiri Founder",url:"https://github.com/nigel-smk",imageURL:"https://github.com/nigel-smk.png",key:"nigel"}],frontMatter:{slug:"starting-and-restarting-sessions",title:"Starting and Restarting Sessions",authors:["nigel"],tags:["guides"]},nextItem:{title:"Registering New Users with Matrix",permalink:"/quiri-docs/blog/registering-new-users"}},c={authorsImageUrls:[void 0]},d=[{value:"Matrix SDK Sessions",id:"matrix-sdk-sessions",level:2},{value:"Other session data",id:"other-session-data",level:2}],h={toc:d};function p(e){var t=e.components,n=(0,s.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"matrix-sdk-sessions"},"Matrix SDK Sessions"),(0,a.kt)("p",null,"Matrix uses access tokens to authenticate user requests. The Flutter SDK handles a lot of the token management for us."),(0,a.kt)("p",null,"For example, when setting the user's display name, there is no way to pass the auth token. This is because it is stored in a class variable and included in the request on our behalf."),(0,a.kt)("p",null,"But what happens to the access token when we shut down the app? The instance of the SDK class will be disposed and the token will go with it. This is why the Matrix Client can be provided a databaseBuilder when being created. The SDK will store the access token, amongst other things in this database and ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/famedly/matrix-dart-sdk/blob/544888fe33a14e0610b2916b5069656a06aeb299/lib/src/client.dart#L1430-L1459"},"fetch them on startup"),". This is what will allow us to keep users logged in even when the restart the app."),(0,a.kt)("p",null,"There remains the question of how long a client can stay logged in. It seems that the default for FluffyChat is to have long-lived access tokens. But the matrix spec allows for the use of refresh tokens for improved security.There exists a method ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L241-L279"},(0,a.kt)("inlineCode",{parentName:"a"},"refreshAccessToken()")," that refreshes the access token")," but it appears that FluffyChat doesn't use it... Looks like I'll need to schedule a task to refresh the token. "),(0,a.kt)("h2",{id:"other-session-data"},"Other session data"),(0,a.kt)("p",null,"While the matrix SDK has it's own ways to persist session data, there are also cases in which we will want to persist session data (e.g. the user's sign-up stage). For these non-matrix session data, we will use the ",(0,a.kt)("a",{parentName:"p",href:"https://pub.dev/packages/hydrated_bloc"},"Hydrated Bloc package")," to securely persist the session data."))}p.isMDXComponent=!0}}]);