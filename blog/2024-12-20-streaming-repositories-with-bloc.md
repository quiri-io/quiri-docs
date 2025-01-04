---
slug: streaming-repositories-with-bloc
title: Streaming Repositories With Bloc
authors: [nigel]
tags: [quiri,guide,bloc]
---

# DRAFT

## Background
I chose Bloc as the state management solution for Quiri after a lot of reading into the different options because I felt that it had less "magic". It also had twice the Github stars of the next most popular project and seemed to have the support of larger teams. Since choosing it there have been some challenges.

- side-effects and one-time events like page navigations and toast messages
- streaming data from the matrix client

## Streaming from the Matrix Client
I go into more detail on how the matrix Dart SDK syncs data with the server and exposes in the [Listening for New Messages With the Matrix SDK](2024-12-19-listening-for-new-messages-with-the-matrix-sdk copy.md) article. Ultimately the SDK already maintains the state of all events, etc. that come from the Matrix server. What the SDK exposes to Bloc then is a state object and a collection of streams that can be subsciribed to that provide all event details. I have been subscribing to the matrix streams in the Bloc and then adding events to the bloc for each new emission from the matrix stream. [This article from the Bloc team](https://verygood.ventures/blog/how-to-use-bloc-with-streams-and-concurrency) presents `emit.forEach` as an option for subscribing to `reactive repositories` instead. [They show the same pattern here in the docs](https://bloclibrary.dev/architecture/#connecting-blocs-through-domain).
