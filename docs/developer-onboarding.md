---
title: Developer Onboarding
sidebar_position: 2
---

## Basic Access
- provide your github username to Nigel and he will add you to the [quiri-io organization](https://github.com/quiri-io) and [dev team](https://github.com/orgs/quiri-io/teams/dev)

# The Repositories
Each repo includes specific instructions on how to get set up and contribute.
## Quiri repositories
- [quiri-docs](https://github.com/quiri-io/quiri-docs)
    - the Docusaurus-powered documentation website you are reading right now
- [quiri-static](https://github.com/quiri-io/quiri-static)
    - the static [landing page](https://quiri.io)
- [quiri_flutter](https://github.com/quiri-io/quiri_flutter)
    - the Android and iOS client apps that are the main quiri apps
- [quiri-application-service](https://github.com/quiri-io/quiri-application-service)
    - the quiri backend
- [quiri-infra](https://github.com/quiri-io/quiri-infra)
    - Terraform code used to manage cloud resources
- [matrix-docker-ansible-deploy](https://github.com/quiri-io/matrix-docker-ansible-deploy)
    - ansible scripts used to deploy the quiri backend services

## Important reference repositories
- [matrix-dart-sdk](https://github.com/famedly/matrix-dart-sdk)
    - the matrix sdk handles most of our app's relationship with the matrix server
    - well-maintained by the makers of the most popular Flutter-based matrix client Fluffychat
- [fluffychat](https://github.com/krille-chan/fluffychat)
    - great reference for how to implement a flutter-based matrix client (that is mostly what quiri is)
- [synapse](https://github.com/element-hq/synapse)
    - the implementation of the matrix server spec that has the best support
- [sygnal](https://github.com/matrix-org/sygnal)
    - the push gateway for matrix that they use for element
    - we need to host our own instance of this for the quiri app
- [matrix-js-sdk](https://github.com/matrix-org/matrix-js-sdk)
    - the js matrix sdk
    - we don't use this right now but it can be nice to browse an sdk for a matrix client that was written by the matrix team
- [element-web](https://github.com/element-hq/element-web)
    - also written by the matrix team
    - we aren't writing a web client for now but it can be nice to browse to better understand how matrix works

# Matrix Learning Resources
All worth bookmarking
- [The quiri docs site you are on right now](https://quiri-io.github.io/quiri-docs/)
    - here we document how we are using matrix and flutter to build quiri
    - use this site to take notes as you are problem solving and then publish them when you're ready to share!
- [The matrix.org docs](https://matrix.org/docs/chat_basics/matrix-for-im/)
    - Chat basics and Communities sections are a good overview of a user's experience of a standard matrix client
    - [Matrix concepts](https://matrix.org/docs/matrix-concepts/elements-of-matrix/) introduces deeper matrix concepts with developers like ourselves as the intended audience
- [The matrix.org blog](https://matrix.org/blog/)
    - updated about once a month with the latest on matrix development
    - great place to keep up with what's coming
- [The matrix spec](https://spec.matrix.org/latest/)
    - surprisingly readable technical documentation that describes in detail every feature of the matrix APIs
    - The [architecture section](https://spec.matrix.org/latest/#architecture) dives deeper into the core entities of matrix (e.g. users, devices, events, rooms)
    - We are primarily concerned with the [Client-Server API](https://spec.matrix.org/v1.15/client-server-api/) but the [Push Gateway API](https://spec.matrix.org/v1.15/push-gateway-api/) is required for push notifications and when we start wanting to make backend changes we will be trying to implement them using the [Application Service API](https://spec.matrix.org/v1.15/application-service-api/) before forking the synapse repo
- [The matrix client-server playground](https://playground.matrix.org/#post-/_matrix/client/v3/login)
    - swagger-like docs providing details about the client-server API
- [The synapse configuration docs](https://element-hq.github.io/synapse/latest/usage/configuration/config_documentation.html)
    - details on all of the synapse configurations that we can make
    - use it to understand [the synapse configuration we are using in dev](https://github.com/quiri-io/quiri-application-service/blob/main/data/homeserver.yaml)
- [The matrix-docker-ansible-deploy docs](https://github.com/quiri-io/matrix-docker-ansible-deploy/tree/master/docs)
    - detailed docs for how to configure the ansible scripts to deploy basically any matrix add-on we might want to use (e.g. sygnal for push)
    - indispensible for understanding how our matrix deployment works

# Tools
- VS Code (or any other coding tool of your choice)
- Postman
    - for exploring the matrix APIs