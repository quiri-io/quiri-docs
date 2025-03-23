---
slug: starting-and-restarting-sessions
title: Starting and Restarting Sessions
authors: [nigel]
tags: [guides]
---

## Matrix SDK Sessions

Matrix uses access tokens to authenticate user requests. The Dart SDK handles a lot of the token management for us.

For example, when setting the user's display name, there is no way to pass the auth token. This is because it is stored in a class variable and included in the request on our behalf.

But what happens to the access token when we shut down the app? The instance of the SDK class will be disposed and the token will go with it. This is why the Matrix Client can be provided a databaseBuilder when being created. The SDK will store the access token, amongst other things in this database and [fetch them on startup](https://github.com/famedly/matrix-dart-sdk/blob/544888fe33a14e0610b2916b5069656a06aeb299/lib/src/client.dart#L1430-L1459). This is what will allow us to keep users logged in even when the restart the app.

There remains the question of how long a client can stay logged in. It seems that the default for FluffyChat is to have long-lived access tokens. But the matrix spec allows for the use of refresh tokens for improved security.There exists a method [`refreshAccessToken()` that refreshes the access token](https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L241-L279) but it appears that FluffyChat doesn't use it... Looks like I'll need to schedule a task to refresh the token. 

## Other session data
While the matrix SDK has it's own ways to persist session data, there are also cases in which we will want to persist session data (e.g. the user's sign-up stage). For these non-matrix session data, we will use the [Hydrated Bloc package](https://pub.dev/packages/hydrated_bloc) to securely persist the session data.


# State Restoration in Flutter
[Thorough blog post](https://www.flutteris.com/blog/en/state_restoration)
- maybe use this primarily for navigation state and lean on hydrated bloc for other state?
- [goRouter state restoration example](https://github.com/flutter/packages/blob/main/packages/go_router/example/lib/others/state_restoration.dart)
- might need to use [statefulShellRoute?](https://github.com/tolo/flutter_packages/blob/nested-persistent-navigation/packages/go_router/example/lib/stateful_shell_route.dart)
- state restore is only for going from background to foreground if the OS reclaims the memory because it needs it
- when manually shutting down the app and restarting it, state restore does not work (at least for go_router)

# Startup State Restoration
- If a user has never used the app
    - there is no state to restore and they should land on the landing page
- If a user has started the signup process, but has not yet registered an account (they are registered after picking their unique handle)
    - return the user to where they were in the signup process
- if a user exits out of the signup process before registering via the close button in the app
    - clear the app state entirely (including any signup progress)
- if a user registers an account successfully
    - clear all signup state (they are signed up now, so we don't have to go back!)
- if a user logs out after logging in
    - clear all state
- if a user logs in and they have not set their avatar or display name (last step of signup that occurs after registration)
    - detect when loading homepage and redirect user to create profile page
        - using route guards?
        - create profile page needs a logout option
        - the display name and avatar can be attached to a User HydratedBloc so that we can cache the avatar and displayname