---
slug: starting-and-restarting-sessions
title: Starting and Restarting Sessions
authors: [nigel]
tags: [guides]
---

## Matrix SDK Sessions

Matrix uses access tokens to authenticate user requests. The Flutter SDK handles a lot of the token management for us.

For example, when setting the user's display name, there is no way to pass the auth token. This is because it is stored in a class variable and included in the request on our behalf.

But what happens to the access token when we shut down the app? The instance of the SDK class will be disposed and the token will go with it. This is why the Matrix Client can be provided a databaseBuilder when being created. The SDK will store the access token, amongst other things in this database and [fetch them on startup](https://github.com/famedly/matrix-dart-sdk/blob/544888fe33a14e0610b2916b5069656a06aeb299/lib/src/client.dart#L1430-L1459). This is what will allow us to keep users logged in even when the restart the app.

There remains the question of how long a client can stay logged in. It seems that the default for FluffyChat is to have long-lived access tokens. But the matrix spec allows for the use of refresh tokens for improved security.There exists a method [`refreshAccessToken()` that refreshes the access token](https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L241-L279) but it appears that FluffyChat doesn't use it... Looks like I'll need to schedule a task to refresh the token. 

## Other session data
While the matrix SDK has it's own ways to persist session data, there are also cases in which we will want to persist session data (e.g. the user's sign-up stage). For these non-matrix session data, we will use the [Hydrated Bloc package](https://pub.dev/packages/hydrated_bloc) to securely persist the session data.


