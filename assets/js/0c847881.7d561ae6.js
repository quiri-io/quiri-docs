"use strict";(self.webpackChunkquiri_docs=self.webpackChunkquiri_docs||[]).push([[1420],{3905:function(t,e,a){a.d(e,{Zo:function(){return h},kt:function(){return m}});var i=a(7294);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function n(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function o(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?n(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function s(t,e){if(null==t)return{};var a,i,r=function(t,e){if(null==t)return{};var a,i,r={},n=Object.keys(t);for(i=0;i<n.length;i++)a=n[i],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);for(i=0;i<n.length;i++)a=n[i],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}var l=i.createContext({}),u=function(t){var e=i.useContext(l),a=e;return t&&(a="function"==typeof t?t(e):o(o({},e),t)),a},h=function(t){var e=u(t.components);return i.createElement(l.Provider,{value:e},t.children)},p={inlineCode:"code",wrapper:function(t){var e=t.children;return i.createElement(i.Fragment,{},e)}},c=i.forwardRef((function(t,e){var a=t.components,r=t.mdxType,n=t.originalType,l=t.parentName,h=s(t,["components","mdxType","originalType","parentName"]),c=u(a),m=r,d=c["".concat(l,".").concat(m)]||c[m]||p[m]||n;return a?i.createElement(d,o(o({ref:e},h),{},{components:a})):i.createElement(d,o({ref:e},h))}));function m(t,e){var a=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var n=a.length,o=new Array(n);o[0]=c;var s={};for(var l in e)hasOwnProperty.call(e,l)&&(s[l]=e[l]);s.originalType=t,s.mdxType="string"==typeof t?t:r,o[1]=s;for(var u=2;u<n;u++)o[u]=a[u];return i.createElement.apply(null,o)}return i.createElement.apply(null,a)}c.displayName="MDXCreateElement"},1782:function(t,e,a){a.r(e),a.d(e,{assets:function(){return h},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return s},metadata:function(){return u},toc:function(){return p}});var i=a(7462),r=a(3366),n=(a(7294),a(3905)),o=["components"],s={slug:"using-ory-for-auth-with-synapse",title:"Using Ory for Auth with Synapse",authors:["nigel"],tags:["guides"]},l=void 0,u={permalink:"/quiri-docs/blog/using-ory-for-auth-with-synapse",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2023-10-30-using-ory-for-auth-with-synapse.md",source:"@site/blog/2023-10-30-using-ory-for-auth-with-synapse.md",title:"Using Ory for Auth with Synapse",description:"We are now working on the designs for the MVP app which has me figuring out user signup/signin. While the matrix folks have built-in a variety of authentication methods, I am inclined to use a dedicated signup/signin service and let matrix focus on chat.",date:"2023-10-30T00:00:00.000Z",formattedDate:"October 30, 2023",tags:[{label:"guides",permalink:"/quiri-docs/blog/tags/guides"}],readingTime:3.71,truncated:!1,authors:[{name:"Nigel Maynard",title:"Quiri Founder",url:"https://github.com/nigel-smk",imageURL:"https://github.com/nigel-smk.png",key:"nigel"}],frontMatter:{slug:"using-ory-for-auth-with-synapse",title:"Using Ory for Auth with Synapse",authors:["nigel"],tags:["guides"]},prevItem:{title:"Registering New Users with Matrix",permalink:"/quiri-docs/blog/registering-new-users"},nextItem:{title:"Project Structure and State Management in Flutter",permalink:"/quiri-docs/blog/project-structure-and-state-management-in-flutter"}},h={authorsImageUrls:[void 0]},p=[{value:"Research",id:"research",level:2},{value:"Hosting My Own Hydra OIDC Provider and Using Already Built-in OIDC to Authenticate All users",id:"hosting-my-own-hydra-oidc-provider-and-using-already-built-in-oidc-to-authenticate-all-users",level:2},{value:"To Investigate",id:"to-investigate",level:3},{value:"Using PasswordProvider Module to Directly integrate with Kratos",id:"using-passwordprovider-module-to-directly-integrate-with-kratos",level:2},{value:"Just use the built-in auth as it is",id:"just-use-the-built-in-auth-as-it-is",level:2}],c={toc:p};function m(t){var e=t.components,a=(0,r.Z)(t,o);return(0,n.kt)("wrapper",(0,i.Z)({},c,a,{components:e,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"We are now working on the designs for the MVP app which has me figuring out user signup/signin. While the matrix folks have built-in a variety of authentication methods, I am inclined to use a dedicated signup/signin service and let matrix focus on chat."),(0,n.kt)("p",null,"This post is my effort to lay out my understanding of the options that Synapse offers and the tradeoffs they have."),(0,n.kt)("h2",{id:"research"},"Research"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://matrix-org.github.io/synapse/latest/usage/configuration/user_authentication/index.html"},"sparse synapse docs regarding oidc"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"lists Hydra as a tested provider but doesn't include it in any examples"),(0,n.kt)("li",{parentName:"ul"},"is this the same thing as Matrix Authentication Service?"),(0,n.kt)("li",{parentName:"ul"},"this looks like it is Matrix baking in additional authentication mechanisms rather than totally offloading the authentication to something like MAS..."))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://areweoidcyet.com/"},"dedicated site regarding matrix migrating to OIDC"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"lists MAS alongside Keycloak under OpenID Providers. Does Ory Hydra fit in the same category and why is Hydra listed as ",(0,n.kt)("a",{parentName:"li",href:"https://matrix-org.github.io/synapse/latest/openid.html"},'"tested" here')," but not listed in this doc?"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://areweoidcyet.com/client-implementation-guide/"},"areweoidcyet client implementation guide"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"provides more details on client flows"),(0,n.kt)("li",{parentName:"ul"},'lots of details on how the client interacts with an "oidc" homeserver'))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://playground.matrix.org/#post-/_matrix/client/v3/register"},"matrix playground account management requests")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://spec.matrix.org/v1.8/client-server-api/#client-authentication"},"matrix spec 1.8 (including registration/authentication)")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/matrix-org/synapse/pull/15582"},"merged PR that moves auth to OIDC"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"merged May 2023"),(0,n.kt)("li",{parentName:"ul"},"note the deprecation of old registration endpoints"),(0,n.kt)("li",{parentName:"ul"},"contains detailed notes on how to run the matrix-authentication-service",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"do we need to run that or is it baked in now?"))))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/matrix-org/matrix-authentication-service"},"matrix-authentication-service repo"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"can I use something like Hydra instead of MAS?"),(0,n.kt)("li",{parentName:"ul"},'looks like you could work with Hydra as an "upstream" IDP but if I can just use it as the main one then why run MAS as well?'),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://areweoidcyet.com/#whats-this-matrix-authentication-service-that-ive-heard-about"},"some details about MAS from areweoidcyet.com")))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://matrix-org.github.io/matrix-authentication-service/index.html"},"MAS documentation"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"good introduction to how the matrix chat server and the auth server will interact"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/matrix-org/synapse/issues/15573"},"PR for bringing delegated auth to an official release"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"still open"),(0,n.kt)("li",{parentName:"ul"},"still experimental"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/matrix-org/matrix-spec-proposals/pull/3861/files"},"the matrix spec change request for delegating auth"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"has more details about the motivation and the current state of auth"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/vector-im/oidc-playground"},"Matrix OpenID Connect Playground repo"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"this is hosted somewhere"),(0,n.kt)("li",{parentName:"ul"},"not sure how it is useful to me"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://blog.px.dev/open-source-auth/"},"Blog post about manually integrating Kratos and Hydra (and why)")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/ory/kratos/issues/273#issuecomment-1305388654"},"Kratos issue comment that appears to be the most complete integration guide?")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://gruchalski.com/posts/2021-04-10-ory-reference-docker-compose-and-thoughts-on-the-platform/"},"Kratos/Hydra critique"))),(0,n.kt)("h2",{id:"hosting-my-own-hydra-oidc-provider-and-using-already-built-in-oidc-to-authenticate-all-users"},"Hosting My Own Hydra OIDC Provider and Using Already Built-in OIDC to Authenticate All users"),(0,n.kt)("p",null,"It seems that while the proposal to have all matrix clients authenticate with matrix via OIDC, it is still just a proposal and is currently experimental. I feel that I now understand how I can have users that are managed by Ory Hydra/Kratos but have accounts on my Matrix server."),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Kratos offers signup/signin services via API that can be used to create accounts"),(0,n.kt)("li",{parentName:"ul"},'Hydra provides the OIDC interface so that users can "login using Ory" in the same way that they might "sign in using google"',(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"while google has other applications and things that you might use your google account for, my Ory deployment would only be holding their identities (not the best explanation)"))),(0,n.kt)("li",{parentName:"ul"},"on the Matrix server side, I configure the server to only allow auth through oidc and only configure Ory as the provider",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"google, auth0, etc are able to be configured as downstream providers to Ory"))),(0,n.kt)("li",{parentName:"ul"},"if the proposal takes off, hopefully it's not too complicated to shift to using the Hydra/Kratos as the OIDC Provider rather than MAS")),(0,n.kt)("h3",{id:"to-investigate"},"To Investigate"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"can we obscure the Matrix server to Ory auth process in a way that makes the user feel like they are using a basic login and not using a social-like signin?"),(0,n.kt)("li",{parentName:"ul"},"how hard is it going to be to integrate Kratos and Hydra?"),(0,n.kt)("li",{parentName:"ul"},"Is this overcomplicated?")),(0,n.kt)("h2",{id:"using-passwordprovider-module-to-directly-integrate-with-kratos"},"Using PasswordProvider Module to Directly integrate with Kratos"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"does this restrict the login/security options that Kratos offers?"),(0,n.kt)("li",{parentName:"ul"},"does this reduce the complexity that much?")),(0,n.kt)("h2",{id:"just-use-the-built-in-auth-as-it-is"},"Just use the built-in auth as it is"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"limited to the auth options that are already made available",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"there are a bunch of them..."))),(0,n.kt)("li",{parentName:"ul"},"less secure?",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"another auth rewrite from a team that should be focussing on chat?"),(0,n.kt)("li",{parentName:"ul"},"they are very security focussed though..."))),(0,n.kt)("li",{parentName:"ul"},"looks like I'm going with this because the Kratos/Hydra integration is not looking straightforward enough at this time",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"in the future that does seem like the best option")))))}m.isMDXComponent=!0}}]);