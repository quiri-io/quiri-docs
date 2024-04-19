"use strict";(self.webpackChunkquiri_docs=self.webpackChunkquiri_docs||[]).push([[517],{9296:function(e){e.exports=JSON.parse('{"blogPosts":[{"id":"registering-new-users","metadata":{"permalink":"/quiri-docs/blog/registering-new-users","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2024-01-29-registering-new-users.md","source":"@site/blog/2024-01-29-registering-new-users.md","title":"Registering New Users with Matrix","description":"For Quiri, we want to register users with a username and an email. Luckily, we can reference how Fluffychat does this!","date":"2024-01-29T00:00:00.000Z","formattedDate":"January 29, 2024","tags":[{"label":"guides","permalink":"/quiri-docs/blog/tags/guides"}],"readingTime":5.48,"truncated":false,"authors":[{"name":"Nigel Maynard","title":"Quiri Founder","url":"https://github.com/nigel-smk","imageURL":"https://github.com/nigel-smk.png","key":"nigel"}],"frontMatter":{"slug":"registering-new-users","title":"Registering New Users with Matrix","authors":["nigel"],"tags":["guides"]},"nextItem":{"title":"Using Ory for Auth with Synapse","permalink":"/quiri-docs/blog/using-ory-for-auth-with-synapse"}},"content":"For Quiri, we want to register users with a username and an email. Luckily, we can reference how Fluffychat does this!\\n\\n[Choosing an avatar and username](https://gitlab.com/famedly/fluffychat/-/blob/5212d7ce4d66fd1465e851aee788ca9f4f6537b8/lib/pages/connect/connect_page.dart#L31-97)\\n\\n[Provide email and choose a password](https://gitlab.com/famedly/fluffychat/-/blob/e88ce8e91cc992885a109a39270558503aaa455f/lib/pages/sign_up/signup.dart#L76-125)\\n\\nLets find the associated REST calls in the [matrix API spec](https://playground.matrix.org/#overview)\\n\\n## Check if username is available\\n[Matrix spec](https://playground.matrix.org/#get-/_matrix/client/v3/register/available)\\n- no auth required\\n- fluffychat doesn\'t use this maybe because it doesn\'t reserve the username?\\n- should be useful for username selection screen\\n\\n\\n## Register\\n[SDK code](https://github.com/famedly/matrix-dart-sdk/blob/544888fe33a14e0610b2916b5069656a06aeb299/lib/src/client.dart#L450-L490) | [Matrix Spec](https://playground.matrix.org/#post-/_matrix/client/v3/register)\\n- no auth required\\n- when hitting the `matrix.org` server with only a username, it returns a `401` with a response body that tells you the \\"authentication flows\\" that are available to you for this endpoint on this server.\\n```\\n{\\n    \\"session\\": \\"jgIeMOlHYubxOZYzaFSMCFqJ\\",\\n    \\"flows\\": [\\n        {\\n            \\"stages\\": [\\n                \\"m.login.recaptcha\\",\\n                \\"m.login.terms\\",\\n                \\"m.login.email.identity\\"\\n            ]\\n        }\\n    ],\\n    \\"params\\": {\\n        \\"m.login.recaptcha\\": {\\n            \\"public_key\\": \\"6LcgI54UAAAAABGdGmruw6DdOocFpYVdjYBRe4zb\\"\\n        },\\n        \\"m.login.terms\\": {\\n            \\"policies\\": {\\n                \\"privacy_policy\\": {\\n                    \\"version\\": \\"1.0\\",\\n                    \\"en\\": {\\n                        \\"name\\": \\"Terms and Conditions\\",\\n                        \\"url\\": \\"https://matrix-client.matrix.org/_matrix/consent?v=1.0\\"\\n                    }\\n                }\\n            }\\n        }\\n    }\\n}\\n``` \\nIn this case the \\"authentication\\" is the steps that you will need to go through in order to register on this server; pass recaptcha, agree to terms and conditions and go through an email verification flow (receive an email and click the button in it)\\n\\nOn my local dockerized synapse instance I wanted to start with the simplest [configuration](https://matrix-org.github.io/synapse/latest/usage/configuration/config_documentation.html) and build up from there. \\n\\nThe basic configuration does not allow any registrations.\\nAdding `enable_registration: true` will get you a startup error telling you that you shouldn\'t allow registrations without some additional measures to confirm identity (like the steps above that matrix.org makes you go through). Otherwise people can spam requests to create accounts.\\n\\nOn my local though, it tells me that I can add `enable_registration_without_verification: true` to allow such registrations anyways.\\n\\nAfter doing that I naively try to submit a registration request with just a username and an email:\\n```\\ncurl --location \'localhost:8008/_matrix/client/v3/register\' \\\\\\n--header \'Content-Type: application/json\' \\\\\\n--data \'{\\n    \\"username\\": \\"cheeeeky_monkey\\",\\n    \\"password\\": \\"password\\"\\n}\'\\n```\\nI get back this cryptic response and it does not register a user.\\n```\\n{\\n    \\"session\\": \\"bFygXrPrCVAOztdAJyjjDOim\\",\\n    \\"flows\\": [\\n        {\\n            \\"stages\\": [\\n                \\"m.login.dummy\\"\\n            ]\\n        }\\n    ],\\n    \\"params\\": {}\\n}\\n```\\n\\nAfter reading through the [User-Interactive Authentication API docs](https://spec.matrix.org/v1.9/client-server-api/#user-interactive-authentication-api) I learned that this is my server telling me that I have one flow that I can take to authenticate this registration request. And that path is to perform no flow! All I have to do is add the auth parameter to my registration request.\\n```\\n{\\n    \\"password\\": \\"ilovebananas\\",\\n    \\"username\\": \\"cheeky_monkey\\",\\n    \\"auth\\": {\\n        \\"session\\": \\"qRFAzYnVJgHQdobMkUhOQlUU\\",\\n        \\"type\\": \\"m.login.dummy\\"\\n    }\\n}\\n```\\n\\nThe session is optional in this case because the flow only has a single step (multiple step flows will require sending the same session token). Including the `m.login.dummy` auth type basically is just a little hoop we have to jump through to make this request without going through any actual flow.\\n\\nWe registered a user! But as per that earlier error\'s advice, we can\'t go public with this configuration. For Quiri we want to register users with their emails so it\'s time to figure out how to configure the server to require email for registration and also configure it to send the emails!\\n\\n\\n## Registering a user with an email\\n\\n### Setting up a dev email server\\nAt first I was looking into different services like SendGrid (will probably use this for the actual deployment) but then I realized I should be able to use an SMTP server hosted in a local docker container!\\n\\nSo I am trying [smtp4dev](https://github.com/rnwood/smtp4dev)\\n\\n### Get the registration token\\n- [API doc](https://playground.matrix.org/#post-/_matrix/client/v3/register/email/requestToken)\\n```\\ncurl --location \'localhost:8008/_matrix/client/v3/register/email/requestToken\' \\\\\\n--header \'Content-Type: application/json\' \\\\\\n--data-raw \'{\\n  \\"client_secret\\": \\"monkeys_are_GREAT\\",\\n  \\"email\\": \\"alice@example.org\\",\\n  \\"next_link\\": \\"https://example.org/congratulations.html\\",\\n  \\"send_attempt\\": 1\\n}\'\\n```\\n- the client secret is any string invented by the client\\n- this sends the email with the validation link!\\n- the response is an sid\\n    ```\\n    {\\n        \\"sid\\": \\"WurCLwjxFYIGiTIz\\"\\n    }\\n    ```\\n\\n### Click the verification link\\n- you cannot continue with registration until that link is clicked\\n- go to `localhost:5005` for the smtp4dev interface and open the email\\n- the link is currently https, which won\'t work\\n    - I should figure out how to make it use http for the link\\n    - for now just copy paste it from the email into the browser and edit to `http`\\n    - it will redirect to a 404 page because I haven\'t set up a redirect page yet\\n    - but it did succeed!\\n\\n### Complete the registration\\n```\\ncurl --location \'localhost:8008/_matrix/client/v3/register\' \\\\\\n--header \'Content-Type: application/json\' \\\\\\n--data \'{\\n    \\"device_id\\": \\"GHTYAJCE\\",\\n    \\"inhibit_login\\": false,\\n    \\"initial_device_display_name\\": \\"Jungle Phone\\",\\n    \\"password\\": \\"ilovebananas\\",\\n    \\"refresh_token\\": false,\\n    \\"username\\": \\"cheeky_monkey_email\\",\\n    \\"auth\\": {\\n        \\"session\\": \\"bdZxZeFmpPxdAuSVoGalmiPC\\",\\n        \\"type\\": \\"m.login.email.identity\\",\\n        \\"threepid_creds\\": {\\n            \\"sid\\": \\"ygxQvHncMIMQzFTk\\",\\n            \\"client_secret\\": \\"monkeys_are_GREAT\\"\\n        }\\n    }\\n}\'\\n```\\n- the sid is from the previous email registration request\\n- the client_secret was provided in the previous email registration request\\n- this will fail if the user has not yet clicked the link in their email\\n- if they have clicked that link, the user is now registered, your first token is returned and we\'re off!\\n\\n## Email Registration User Experience\\n- User is asked for email and password\\n    - random client_secret is generated by client and stored in localstorage\\n    - request is sent to matrix to send verification email\\n        - sid of response is held in local storage\\n    - password is held in local storage?\\n        - security risk?\\n- User is taken to a page informing them that they must click the link in the email to continue\\n    - include button to resend the request\\n- when the button is clicked in the email, we should try to send them into the app?\\n    - or just give them a message that they should go back to the app to continue\\n- whenever they return to the \\"check your email\\" page, try to register them with no password\\n    - if they have yet to have validated, it will respond with EMAIL_NOT_VALIDATED\\n    - if they have validated it will respond with NO_PASSWORD\\n- once the NO_PASSWORD response comes up, move the user through the username selection process\\n- once they have selected a username, send the final registration request with username, password, email token (sid)\\n    - an access token will be returned and the user is on their merry way\\n- make sure to remove the password from local storage!\\n\\nThroughout the above process, if the user closes the app and re-opens they should be brought back to the screen that they were at. The information that they provide needs to be stored in \\"localstorage\\" until they make the final registration call."},{"id":"using-ory-for-auth-with-synapse","metadata":{"permalink":"/quiri-docs/blog/using-ory-for-auth-with-synapse","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2023-10-30-using-ory-for-auth-with-synapse.md","source":"@site/blog/2023-10-30-using-ory-for-auth-with-synapse.md","title":"Using Ory for Auth with Synapse","description":"We are now working on the designs for the MVP app which has me figuring out user signup/signin. While the matrix folks have built-in a variety of authentication methods, I am inclined to use a dedicated signup/signin service and let matrix focus on chat.","date":"2023-10-30T00:00:00.000Z","formattedDate":"October 30, 2023","tags":[{"label":"guides","permalink":"/quiri-docs/blog/tags/guides"}],"readingTime":3.71,"truncated":false,"authors":[{"name":"Nigel Maynard","title":"Quiri Founder","url":"https://github.com/nigel-smk","imageURL":"https://github.com/nigel-smk.png","key":"nigel"}],"frontMatter":{"slug":"using-ory-for-auth-with-synapse","title":"Using Ory for Auth with Synapse","authors":["nigel"],"tags":["guides"]},"prevItem":{"title":"Registering New Users with Matrix","permalink":"/quiri-docs/blog/registering-new-users"},"nextItem":{"title":"Project Structure and State Management in Flutter","permalink":"/quiri-docs/blog/project-structure-and-state-management-in-flutter"}},"content":"We are now working on the designs for the MVP app which has me figuring out user signup/signin. While the matrix folks have built-in a variety of authentication methods, I am inclined to use a dedicated signup/signin service and let matrix focus on chat.\\n\\nThis post is my effort to lay out my understanding of the options that Synapse offers and the tradeoffs they have.\\n\\n## Research\\n- [sparse synapse docs regarding oidc](https://matrix-org.github.io/synapse/latest/usage/configuration/user_authentication/index.html)\\n    - lists Hydra as a tested provider but doesn\'t include it in any examples\\n    - is this the same thing as Matrix Authentication Service?\\n    - this looks like it is Matrix baking in additional authentication mechanisms rather than totally offloading the authentication to something like MAS...\\n- [dedicated site regarding matrix migrating to OIDC](https://areweoidcyet.com/)\\n    - lists MAS alongside Keycloak under OpenID Providers. Does Ory Hydra fit in the same category and why is Hydra listed as [\\"tested\\" here](https://matrix-org.github.io/synapse/latest/openid.html) but not listed in this doc?\\n- [areweoidcyet client implementation guide](https://areweoidcyet.com/client-implementation-guide/)\\n    - provides more details on client flows\\n    - lots of details on how the client interacts with an \\"oidc\\" homeserver\\n- [matrix playground account management requests](https://playground.matrix.org/#post-/_matrix/client/v3/register)\\n- [matrix spec 1.8 (including registration/authentication)](https://spec.matrix.org/v1.8/client-server-api/#client-authentication)\\n- [merged PR that moves auth to OIDC](https://github.com/matrix-org/synapse/pull/15582)\\n    - merged May 2023\\n    - note the deprecation of old registration endpoints\\n    - contains detailed notes on how to run the matrix-authentication-service\\n        - do we need to run that or is it baked in now?\\n- [matrix-authentication-service repo](https://github.com/matrix-org/matrix-authentication-service)\\n    - can I use something like Hydra instead of MAS?\\n    - looks like you could work with Hydra as an \\"upstream\\" IDP but if I can just use it as the main one then why run MAS as well?\\n    - [some details about MAS from areweoidcyet.com](https://areweoidcyet.com/#whats-this-matrix-authentication-service-that-ive-heard-about)\\n- [MAS documentation](https://matrix-org.github.io/matrix-authentication-service/index.html)\\n    - good introduction to how the matrix chat server and the auth server will interact\\n- [PR for bringing delegated auth to an official release](https://github.com/matrix-org/synapse/issues/15573)\\n    - still open\\n    - still experimental\\n- [the matrix spec change request for delegating auth](https://github.com/matrix-org/matrix-spec-proposals/pull/3861/files)\\n    - has more details about the motivation and the current state of auth\\n- [Matrix OpenID Connect Playground repo](https://github.com/vector-im/oidc-playground)\\n    - this is hosted somewhere\\n    - not sure how it is useful to me\\n- [Blog post about manually integrating Kratos and Hydra (and why)](https://blog.px.dev/open-source-auth/)\\n- [Kratos issue comment that appears to be the most complete integration guide?](https://github.com/ory/kratos/issues/273#issuecomment-1305388654)\\n- [Kratos/Hydra critique](https://gruchalski.com/posts/2021-04-10-ory-reference-docker-compose-and-thoughts-on-the-platform/)\\n\\n\\n## Hosting My Own Hydra OIDC Provider and Using Already Built-in OIDC to Authenticate All users\\nIt seems that while the proposal to have all matrix clients authenticate with matrix via OIDC, it is still just a proposal and is currently experimental. I feel that I now understand how I can have users that are managed by Ory Hydra/Kratos but have accounts on my Matrix server.\\n- Kratos offers signup/signin services via API that can be used to create accounts\\n- Hydra provides the OIDC interface so that users can \\"login using Ory\\" in the same way that they might \\"sign in using google\\"\\n    - while google has other applications and things that you might use your google account for, my Ory deployment would only be holding their identities (not the best explanation)\\n- on the Matrix server side, I configure the server to only allow auth through oidc and only configure Ory as the provider\\n    - google, auth0, etc are able to be configured as downstream providers to Ory\\n- if the proposal takes off, hopefully it\'s not too complicated to shift to using the Hydra/Kratos as the OIDC Provider rather than MAS\\n\\n### To Investigate\\n- can we obscure the Matrix server to Ory auth process in a way that makes the user feel like they are using a basic login and not using a social-like signin?\\n- how hard is it going to be to integrate Kratos and Hydra?\\n- Is this overcomplicated?\\n\\n## Using PasswordProvider Module to Directly integrate with Kratos\\n- does this restrict the login/security options that Kratos offers?\\n- does this reduce the complexity that much?\\n\\n\\n## Just use the built-in auth as it is\\n- limited to the auth options that are already made available\\n    - there are a bunch of them...\\n- less secure?\\n    - another auth rewrite from a team that should be focussing on chat?\\n    - they are very security focussed though...\\n- looks like I\'m going with this because the Kratos/Hydra integration is not looking straightforward enough at this time\\n    - in the future that does seem like the best option"},{"id":"project-structure-and-state-management-in-flutter","metadata":{"permalink":"/quiri-docs/blog/project-structure-and-state-management-in-flutter","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2022-11-15-project-structure-and-state-management-in-flutter copy 2.md","source":"@site/blog/2022-11-15-project-structure-and-state-management-in-flutter copy 2.md","title":"Project Structure and State Management in Flutter","description":"Flutter is a compelling technology but it is not very mature so there are some challenges when it comes to filling in the functionality that is missing from the core libraries. I have spent a lot of time reading different blogs, etc. to try to get some guidance and hopefully avoid some common pitfalls. One resource that has been useful is codewithandrea.com. I am going to be referencing his riverpod and other architecture articles to inform my library architectural decisions.","date":"2022-11-15T00:00:00.000Z","formattedDate":"November 15, 2022","tags":[{"label":"guides","permalink":"/quiri-docs/blog/tags/guides"}],"readingTime":0.4,"truncated":false,"authors":[{"name":"Nigel Maynard","title":"Quiri Founder","url":"https://github.com/nigel-smk","imageURL":"https://github.com/nigel-smk.png","key":"nigel"}],"frontMatter":{"slug":"project-structure-and-state-management-in-flutter","title":"Project Structure and State Management in Flutter","authors":["nigel"],"tags":["guides"]},"prevItem":{"title":"Using Ory for Auth with Synapse","permalink":"/quiri-docs/blog/using-ory-for-auth-with-synapse"},"nextItem":{"title":"Getting Started With the Matrix API","permalink":"/quiri-docs/blog/getting-started-matrix-api"}},"content":"Flutter is a compelling technology but it is not very mature so there are some challenges when it comes to filling in the functionality that is missing from the core libraries. I have spent a lot of time reading different blogs, etc. to try to get some guidance and hopefully avoid some common pitfalls. One resource that has been useful is [codewithandrea.com](https://codewithandrea.com/tutorials/). I am going to be referencing his riverpod and other architecture articles to inform my library architectural decisions."},{"id":"getting-started-matrix-api","metadata":{"permalink":"/quiri-docs/blog/getting-started-matrix-api","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2022-08-12-getting-started-matrix-api.md","source":"@site/blog/2022-08-12-getting-started-matrix-api.md","title":"Getting Started With the Matrix API","description":"After some exploration of Android development (specifically jetpack compose), I finally took a proper swing at Flutter and while jetpack compose seems like a powerful tool and I would love to get to know kotlin better, the cross-platform development and cross-platform design was just too alluring.","date":"2022-08-12T00:00:00.000Z","formattedDate":"August 12, 2022","tags":[{"label":"guides","permalink":"/quiri-docs/blog/tags/guides"}],"readingTime":0.845,"truncated":false,"authors":[{"name":"Nigel Maynard","title":"Quiri Founder","url":"https://github.com/nigel-smk","imageURL":"https://github.com/nigel-smk.png","key":"nigel"}],"frontMatter":{"slug":"getting-started-matrix-api","title":"Getting Started With the Matrix API","authors":["nigel"],"tags":["guides"]},"prevItem":{"title":"Project Structure and State Management in Flutter","permalink":"/quiri-docs/blog/project-structure-and-state-management-in-flutter"},"nextItem":{"title":"Getting Started With Flutter","permalink":"/quiri-docs/blog/getting-started-with-flutter"}},"content":"After some exploration of Android development (specifically jetpack compose), I finally took a proper swing at Flutter and while jetpack compose seems like a powerful tool and I would love to get to know kotlin better, the cross-platform development and cross-platform design was just too alluring. \\n\\nI figured I would start with a login screen as it would get me interacting with state and making an API call. I found some widget online that gave me most of the UI, leaving me to figure out constructing the login API request from the form inputs. \\n\\nAt first I was wary of using an SDK that was not created by the Matrix team but the Famedly folks are actively contributing to it and when it comes down to it, it is just sending HTTP requests to the API. So the first thing was [adding the SDK](https://gitlab.com/famedly/company/frontend/famedlysdk) as a dependency.\\n\\nIt is also important for me to start getting to know the matrix API in general so I found their [API reference](https://matrix.org/docs/api/#overview)."},{"id":"getting-started-with-flutter","metadata":{"permalink":"/quiri-docs/blog/getting-started-with-flutter","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2022-06-12-getting-started-with-flutter.md","source":"@site/blog/2022-06-12-getting-started-with-flutter.md","title":"Getting Started With Flutter","description":"After putting quite a bit of time into getting Element for Android working as a library so that I could wrap it in my own package, I was finding that even writing a simple feature was proving difficult. I did some evaluation of the amount of energy that would be required to get up to speed with android in a way that would be required for me to make any meaningful progress on quiri and Flutter started to look more attractive.","date":"2022-06-12T00:00:00.000Z","formattedDate":"June 12, 2022","tags":[{"label":"guides","permalink":"/quiri-docs/blog/tags/guides"}],"readingTime":2.905,"truncated":false,"authors":[{"name":"Nigel Maynard","title":"Quiri Founder","url":"https://github.com/nigel-smk","imageURL":"https://github.com/nigel-smk.png","key":"nigel"}],"frontMatter":{"slug":"getting-started-with-flutter","title":"Getting Started With Flutter","authors":["nigel"],"tags":["guides"]},"prevItem":{"title":"Getting Started With the Matrix API","permalink":"/quiri-docs/blog/getting-started-matrix-api"},"nextItem":{"title":"Welcome","permalink":"/quiri-docs/blog/welcome"}},"content":"After putting quite a bit of time into getting Element for Android working as a library so that I could wrap it in my own package, I was finding that even writing a simple feature was proving difficult. I did some evaluation of the amount of energy that would be required to get up to speed with android in a way that would be required for me to make any meaningful progress on quiri and Flutter started to look more attractive.\\n\\nWith the wrapped Element Android version of the app distributed out to Josh, Loisel and Anton, we had collected some solid sample conversations that have helped to inform which features are essential to the quiri experience and which new features we might like to build on top of it. This has given me more confidence in building from scratch using Flutter. \\n\\n[There is an actively maintained matrix SDK for flutter](https://gitlab.com/famedly/company/frontend/famedlysdk) as well as the [associated open-source app that depends on it (which has decent reviews in the Play Store)](https://gitlab.com/famedly/fluffychat). So my thinking is that it\'s probably a similar effort for me to get up speed on android vs build from scratch in Flutter (maybe I will just build on top of fluffychat...) but if I go with Flutter at least I will understand how all of the code works (because I will write it). Whereas the experience with android right now is one of generally being frustrated and lost in a large and complex codebase. \\n\\nWhile I feel that there is some risk that Flutter will end up being the wrong tool due to some shortcomings, [it appears to be a pretty solid tool and Google is quite active in improving it.](https://flutter.dev/events/io-2022) If it plays out well, it will be easy enough to have desktop and web clients as well as android and iOS.\\n\\n# Getting Started\\nI had just bought a new macbook so I have had a pretty fresh start. Here are the things that I already installed:\\n- iTerm2\\n- ohmyzsh\\n- xcode and the xcode command line tools (big download)\\n- vs code\\n- android studio (to maybe write flutter in)\\n- docker desktop\\n\\nFor flutter I just jumped to their [install homepage](https://docs.flutter.dev/get-started/install) and went from there.\\n\\n`flutter doctor` raised a couple of issues\\n- `Unable to locate Android SDK.`\\n  - I needed to open Android Studio, which had a first time run wizard that installed the android SDK for me\\n- `CocoaPods not installed.`\\n  - Just followed [their instructions](https://guides.cocoapods.org/using/getting-started.html#installation) to install cocoapods as well.\\n- `cmdline-tools component is missing`\\n  - on the Android Studio startup modal, click `More actions` > `SDK Manager` > `SDK Tools` tab > check `Android SDK command line tools (latest)` and then `Apply` or `OK`\\n- `Android license status unknown.`\\n  - `flutter doctor --android-licenses`\\n\\nI am going to start with just android devices so I need to take the [Android Setup](https://docs.flutter.dev/get-started/install/macos#android-setup) steps as well.\\n\\n# IDE\\nI chose android studio because I imagine google has put effort into making it the ideal development experience. I could definitely see myself switching to VS code though.\\n\\nI got as far as running the sample app on my device.\\n\\n# Next steps\\nI think that I will follow the more detailed intro to creating an app that follows this setup. And then probably go back to the Flutter course I started on Udemy a while back. \\n\\nI will need to get some initial designs going with Loisel as well to help guide my efforts."},{"id":"welcome","metadata":{"permalink":"/quiri-docs/blog/welcome","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2021-08-26-welcome/index.md","source":"@site/blog/2021-08-26-welcome/index.md","title":"Welcome","description":"Docusaurus blogging features are powered by the blog plugin.","date":"2021-08-26T00:00:00.000Z","formattedDate":"August 26, 2021","tags":[{"label":"facebook","permalink":"/quiri-docs/blog/tags/facebook"},{"label":"hello","permalink":"/quiri-docs/blog/tags/hello"},{"label":"docusaurus","permalink":"/quiri-docs/blog/tags/docusaurus"}],"readingTime":0.405,"truncated":false,"authors":[{"name":"S\xe9bastien Lorber","title":"Docusaurus maintainer","url":"https://sebastienlorber.com","imageURL":"https://github.com/slorber.png","key":"slorber"},{"name":"Yangshun Tay","title":"Front End Engineer @ Facebook","url":"https://github.com/yangshun","imageURL":"https://github.com/yangshun.png","key":"yangshun"}],"frontMatter":{"slug":"welcome","title":"Welcome","authors":["slorber","yangshun"],"tags":["facebook","hello","docusaurus"]},"prevItem":{"title":"Getting Started With Flutter","permalink":"/quiri-docs/blog/getting-started-with-flutter"},"nextItem":{"title":"MDX Blog Post","permalink":"/quiri-docs/blog/mdx-blog-post"}},"content":"[Docusaurus blogging features](https://docusaurus.io/docs/blog) are powered by the [blog plugin](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog).\\n\\nSimply add Markdown files (or folders) to the `blog` directory.\\n\\nRegular blog authors can be added to `authors.yml`.\\n\\nThe blog post date can be extracted from filenames, such as:\\n\\n- `2019-05-30-welcome.md`\\n- `2019-05-30-welcome/index.md`\\n\\nA blog post folder can be convenient to co-locate blog post images:\\n\\n![Docusaurus Plushie](./docusaurus-plushie-banner.jpeg)\\n\\nThe blog supports tags as well!\\n\\n**And if you don\'t want a blog**: just delete this directory, and use `blog: false` in your Docusaurus config."},{"id":"mdx-blog-post","metadata":{"permalink":"/quiri-docs/blog/mdx-blog-post","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2021-08-01-mdx-blog-post.mdx","source":"@site/blog/2021-08-01-mdx-blog-post.mdx","title":"MDX Blog Post","description":"Blog posts support Docusaurus Markdown features, such as MDX.","date":"2021-08-01T00:00:00.000Z","formattedDate":"August 1, 2021","tags":[{"label":"docusaurus","permalink":"/quiri-docs/blog/tags/docusaurus"}],"readingTime":0.175,"truncated":false,"authors":[{"name":"S\xe9bastien Lorber","title":"Docusaurus maintainer","url":"https://sebastienlorber.com","imageURL":"https://github.com/slorber.png","key":"slorber"}],"frontMatter":{"slug":"mdx-blog-post","title":"MDX Blog Post","authors":["slorber"],"tags":["docusaurus"]},"prevItem":{"title":"Welcome","permalink":"/quiri-docs/blog/welcome"},"nextItem":{"title":"Long Blog Post","permalink":"/quiri-docs/blog/long-blog-post"}},"content":"Blog posts support [Docusaurus Markdown features](https://docusaurus.io/docs/markdown-features), such as [MDX](https://mdxjs.com/).\\n\\n:::tip\\n\\nUse the power of React to create interactive blog posts.\\n\\n```js\\n<button onClick={() => alert(\'button clicked!\')}>Click me!</button>\\n```\\n\\n<button onClick={() => alert(\'button clicked!\')}>Click me!</button>\\n\\n:::"},{"id":"long-blog-post","metadata":{"permalink":"/quiri-docs/blog/long-blog-post","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2019-05-29-long-blog-post.md","source":"@site/blog/2019-05-29-long-blog-post.md","title":"Long Blog Post","description":"This is the summary of a very long blog post,","date":"2019-05-29T00:00:00.000Z","formattedDate":"May 29, 2019","tags":[{"label":"hello","permalink":"/quiri-docs/blog/tags/hello"},{"label":"docusaurus","permalink":"/quiri-docs/blog/tags/docusaurus"}],"readingTime":2.05,"truncated":true,"authors":[{"name":"Endilie Yacop Sucipto","title":"Maintainer of Docusaurus","url":"https://github.com/endiliey","imageURL":"https://github.com/endiliey.png","key":"endi"}],"frontMatter":{"slug":"long-blog-post","title":"Long Blog Post","authors":"endi","tags":["hello","docusaurus"]},"prevItem":{"title":"MDX Blog Post","permalink":"/quiri-docs/blog/mdx-blog-post"},"nextItem":{"title":"First Blog Post","permalink":"/quiri-docs/blog/first-blog-post"}},"content":"This is the summary of a very long blog post,\\n\\nUse a `\x3c!--` `truncate` `--\x3e` comment to limit blog post size in the list view.\\n\\n\x3c!--truncate--\x3e\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet\\n\\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet"},{"id":"first-blog-post","metadata":{"permalink":"/quiri-docs/blog/first-blog-post","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2019-05-28-first-blog-post.md","source":"@site/blog/2019-05-28-first-blog-post.md","title":"First Blog Post","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet","date":"2019-05-28T00:00:00.000Z","formattedDate":"May 28, 2019","tags":[{"label":"hola","permalink":"/quiri-docs/blog/tags/hola"},{"label":"docusaurus","permalink":"/quiri-docs/blog/tags/docusaurus"}],"readingTime":0.12,"truncated":false,"authors":[{"name":"Gao Wei","title":"Docusaurus Core Team","url":"https://github.com/wgao19","image_url":"https://github.com/wgao19.png","imageURL":"https://github.com/wgao19.png"}],"frontMatter":{"slug":"first-blog-post","title":"First Blog Post","authors":{"name":"Gao Wei","title":"Docusaurus Core Team","url":"https://github.com/wgao19","image_url":"https://github.com/wgao19.png","imageURL":"https://github.com/wgao19.png"},"tags":["hola","docusaurus"]},"prevItem":{"title":"Long Blog Post","permalink":"/quiri-docs/blog/long-blog-post"}},"content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet"}]}')}}]);