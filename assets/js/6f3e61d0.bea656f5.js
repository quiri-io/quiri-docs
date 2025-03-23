"use strict";(self.webpackChunkquiri_docs=self.webpackChunkquiri_docs||[]).push([[8682],{3905:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return d}});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},s=Object.keys(e);for(r=0;r<s.length;r++)a=s[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)a=s[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=r.createContext({}),u=function(e){var t=r.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,s=e.originalType,l=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),h=u(a),d=n,g=h["".concat(l,".").concat(d)]||h[d]||c[d]||s;return a?r.createElement(g,i(i({ref:t},p),{},{components:a})):r.createElement(g,i({ref:t},p))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var s=a.length,i=new Array(s);i[0]=h;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:n,i[1]=o;for(var u=2;u<s;u++)i[u]=a[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}h.displayName="MDXCreateElement"},9983:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return c}});var r=a(7462),n=a(3366),s=(a(7294),a(3905)),i=["components"],o={slug:"starting-and-restarting-sessions",title:"Starting and Restarting Sessions",authors:["nigel"],tags:["guides"]},l=void 0,u={permalink:"/quiri-docs/blog/starting-and-restarting-sessions",source:"@site/blog/2024-05-12-starting-and-restarting-sessions.md",title:"Starting and Restarting Sessions",description:"Matrix SDK Sessions",date:"2024-05-12T00:00:00.000Z",formattedDate:"May 12, 2024",tags:[{label:"guides",permalink:"/quiri-docs/blog/tags/guides"}],readingTime:2.67,truncated:!1,authors:[{name:"Nigel Maynard",title:"Quiri Founder",url:"https://github.com/nigel-smk",imageURL:"https://github.com/nigel-smk.png",key:"nigel"}],frontMatter:{slug:"starting-and-restarting-sessions",title:"Starting and Restarting Sessions",authors:["nigel"],tags:["guides"]},prevItem:{title:"Opening a Quiri with Another User",permalink:"/quiri-docs/blog/opening-a-quiri-with-another-user"},nextItem:{title:"Registering New Users with Matrix",permalink:"/quiri-docs/blog/registering-new-users"}},p={authorsImageUrls:[void 0]},c=[{value:"Matrix SDK Sessions",id:"matrix-sdk-sessions",level:2},{value:"Other session data",id:"other-session-data",level:2}],h={toc:c};function d(e){var t=e.components,a=(0,n.Z)(e,i);return(0,s.kt)("wrapper",(0,r.Z)({},h,a,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h2",{id:"matrix-sdk-sessions"},"Matrix SDK Sessions"),(0,s.kt)("p",null,"Matrix uses access tokens to authenticate user requests. The Dart SDK handles a lot of the token management for us."),(0,s.kt)("p",null,"For example, when setting the user's display name, there is no way to pass the auth token. This is because it is stored in a class variable and included in the request on our behalf."),(0,s.kt)("p",null,"But what happens to the access token when we shut down the app? The instance of the SDK class will be disposed and the token will go with it. This is why the Matrix Client can be provided a databaseBuilder when being created. The SDK will store the access token, amongst other things in this database and ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/famedly/matrix-dart-sdk/blob/544888fe33a14e0610b2916b5069656a06aeb299/lib/src/client.dart#L1430-L1459"},"fetch them on startup"),". This is what will allow us to keep users logged in even when the restart the app."),(0,s.kt)("p",null,"There remains the question of how long a client can stay logged in. It seems that the default for FluffyChat is to have long-lived access tokens. But the matrix spec allows for the use of refresh tokens for improved security.There exists a method ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L241-L279"},(0,s.kt)("inlineCode",{parentName:"a"},"refreshAccessToken()")," that refreshes the access token")," but it appears that FluffyChat doesn't use it... Looks like I'll need to schedule a task to refresh the token. "),(0,s.kt)("h2",{id:"other-session-data"},"Other session data"),(0,s.kt)("p",null,"While the matrix SDK has it's own ways to persist session data, there are also cases in which we will want to persist session data (e.g. the user's sign-up stage). For these non-matrix session data, we will use the ",(0,s.kt)("a",{parentName:"p",href:"https://pub.dev/packages/hydrated_bloc"},"Hydrated Bloc package")," to securely persist the session data."),(0,s.kt)("h1",{id:"state-restoration-in-flutter"},"State Restoration in Flutter"),(0,s.kt)("p",null,(0,s.kt)("a",{parentName:"p",href:"https://www.flutteris.com/blog/en/state_restoration"},"Thorough blog post")),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"maybe use this primarily for navigation state and lean on hydrated bloc for other state?"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"https://github.com/flutter/packages/blob/main/packages/go_router/example/lib/others/state_restoration.dart"},"goRouter state restoration example")),(0,s.kt)("li",{parentName:"ul"},"might need to use ",(0,s.kt)("a",{parentName:"li",href:"https://github.com/tolo/flutter_packages/blob/nested-persistent-navigation/packages/go_router/example/lib/stateful_shell_route.dart"},"statefulShellRoute?")),(0,s.kt)("li",{parentName:"ul"},"state restore is only for going from background to foreground if the OS reclaims the memory because it needs it"),(0,s.kt)("li",{parentName:"ul"},"when manually shutting down the app and restarting it, state restore does not work (at least for go_router)")),(0,s.kt)("h1",{id:"startup-state-restoration"},"Startup State Restoration"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"If a user has never used the app",(0,s.kt)("ul",{parentName:"li"},(0,s.kt)("li",{parentName:"ul"},"there is no state to restore and they should land on the landing page"))),(0,s.kt)("li",{parentName:"ul"},"If a user has started the signup process, but has not yet registered an account (they are registered after picking their unique handle)",(0,s.kt)("ul",{parentName:"li"},(0,s.kt)("li",{parentName:"ul"},"return the user to where they were in the signup process"))),(0,s.kt)("li",{parentName:"ul"},"if a user exits out of the signup process before registering via the close button in the app",(0,s.kt)("ul",{parentName:"li"},(0,s.kt)("li",{parentName:"ul"},"clear the app state entirely (including any signup progress)"))),(0,s.kt)("li",{parentName:"ul"},"if a user registers an account successfully",(0,s.kt)("ul",{parentName:"li"},(0,s.kt)("li",{parentName:"ul"},"clear all signup state (they are signed up now, so we don't have to go back!)"))),(0,s.kt)("li",{parentName:"ul"},"if a user logs out after logging in",(0,s.kt)("ul",{parentName:"li"},(0,s.kt)("li",{parentName:"ul"},"clear all state"))),(0,s.kt)("li",{parentName:"ul"},"if a user logs in and they have not set their avatar or display name (last step of signup that occurs after registration)",(0,s.kt)("ul",{parentName:"li"},(0,s.kt)("li",{parentName:"ul"},"detect when loading homepage and redirect user to create profile page",(0,s.kt)("ul",{parentName:"li"},(0,s.kt)("li",{parentName:"ul"},"using route guards?"),(0,s.kt)("li",{parentName:"ul"},"create profile page needs a logout option"),(0,s.kt)("li",{parentName:"ul"},"the display name and avatar can be attached to a User HydratedBloc so that we can cache the avatar and displayname")))))))}d.isMDXComponent=!0}}]);