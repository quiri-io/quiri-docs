---
slug: using-ory-for-auth-with-synapse
title: Using Ory for Auth with Synapse
authors: [nigel]
tags: [guides]
---

We are now working on the designs for the MVP app which has me figuring out user signup/signin. While the matrix folks have built-in a variety of authentication methods, I am inclined to use a dedicated signup/signin service and let matrix focus on chat.

This post is my effort to lay out my understanding of the options that Synapse offers and the tradeoffs they have.

## Research
- [sparse synapse docs regarding oidc](https://matrix-org.github.io/synapse/latest/usage/configuration/user_authentication/index.html)
    - lists Hydra as a tested provider but doesn't include it in any examples
    - is this the same thing as Matrix Authentication Service?
    - this looks like it is Matrix baking in additional authentication mechanisms rather than totally offloading the authentication to something like MAS...
- [dedicated site regarding matrix migrating to OIDC](https://areweoidcyet.com/)
    - lists MAS alongside Keycloak under OpenID Providers. Does Ory Hydra fit in the same category and why is Hydra listed as ["tested" here](https://matrix-org.github.io/synapse/latest/openid.html) but not listed in this doc?
- [areweoidcyet client implementation guide](https://areweoidcyet.com/client-implementation-guide/)
    - provides more details on client flows
    - lots of details on how the client interacts with an "oidc" homeserver
- [matrix playground account management requests](https://playground.matrix.org/#post-/_matrix/client/v3/register)
- [matrix spec 1.8 (including registration/authentication)](https://spec.matrix.org/v1.8/client-server-api/#client-authentication)
- [merged PR that moves auth to OIDC](https://github.com/matrix-org/synapse/pull/15582)
    - merged May 2023
    - note the deprecation of old registration endpoints
    - contains detailed notes on how to run the matrix-authentication-service
        - do we need to run that or is it baked in now?
- [matrix-authentication-service repo](https://github.com/matrix-org/matrix-authentication-service)
    - can I use something like Hydra instead of MAS?
    - looks like you could work with Hydra as an "upstream" IDP but if I can just use it as the main one then why run MAS as well?
    - [some details about MAS from areweoidcyet.com](https://areweoidcyet.com/#whats-this-matrix-authentication-service-that-ive-heard-about)
- [MAS documentation](https://matrix-org.github.io/matrix-authentication-service/index.html)
    - good introduction to how the matrix chat server and the auth server will interact
- [PR for bringing delegated auth to an official release](https://github.com/matrix-org/synapse/issues/15573)
    - still open
    - still experimental
- [the matrix spec change request for delegating auth](https://github.com/matrix-org/matrix-spec-proposals/pull/3861/files)
    - has more details about the motivation and the current state of auth
- [Matrix OpenID Connect Playground repo](https://github.com/vector-im/oidc-playground)
    - this is hosted somewhere
    - not sure how it is useful to me
- []

## Hosting My Own Hydra OIDC Provider and Using Already Built-in OIDC to Authenticate All users
It seems that while the proposal to have all matrix clients authenticate with matrix via OIDC, it is still just a proposal and is currently experimental. I feel that I now understand how I can have users that are managed by Ory Hydra/Kratos but have accounts on my Matrix server.
- Kratos offers signup/signin services via API that can be used to create accounts
- Hydra provides the OIDC interface so that users can "login using Ory" in the same way that they might "sign in using google"
    - while google has other applications and things that you might use your google account for, my Ory deployment would only be holding their identities (not the best explanation)
- on the Matrix server side, I configure the server to only allow auth through oidc and only configure Ory as the provider
    - google, auth0, etc are able to be configured as downstream providers to Ory
- if the proposal takes off, hopefully it's not too complicated to shift to using the Hydra/Kratos as the OIDC Provider rather than MAS

### To Investigate
- can we obscure the Matrix server to Ory auth process in a way that makes the user feel like they are using a basic login and not using a social-like signin?
- how hard is it going to be to integrate Kratos and Hydra?
- Is this overcomplicated?

## Using PasswordProvider Module to Directly integrate with Kratos
- does this restrict the login/security options that Kratos offers?
- does this reduce the complexity that much?


## Just use the built-in auth as it is
- limited to the auth options that are already made available
    - there are a bunch of them...
- less secure?
    - another auth rewrite from a team that should be focussing on chat?
    - they are very security focussed though...