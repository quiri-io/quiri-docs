# Listening for New Messages With the Dart SDK

## Background
[Almost all actions in matrix are expressed as `users` sending `events` to `rooms`.](https://matrix.org/docs/matrix-concepts/rooms_and_events/) This makes intuitive sense when it comes to message events but works equally well for non-message events (e.g. add user event, change room name event, etc). When a user adds an event to a room, [it is first added to the event graph on their personal client, then it is replicated to the user's home server and then it is replicated to all other clients that are in that room.](https://matrix.org/docs/matrix-concepts/elements-of-matrix/#client) Quiri is written in Dart and uses the matrix dart sdk to handle a lot of the client-server relationship. This includes maintaining the local copy of the current state of a room's state and listening for updates to that room's state. This guide goes into details about how that relationship is maintained so that we can build the quiri client appropriately.

## Listening for events
On [app startup](https://github.com/quiri-io/quiri_flutter/blob/8405271b51a3c85884502042387289cdc083149f/lib/config/configure_matrix.dart#L4-L11), we currently call the [init method](https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L1502-L1519). This method does a number of things including kicking off the first [_sync](https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L1789-L1800) request.

This sync call can be awaited as a whole, or you can provide the `waitForFirstSync` as `false` and instead await the `roomsLoading`, `_accountDataLoading` and `userDeviceKeysLoading` futures individually. We will await on the init for now for simplicity.

After the initial sync, the client will begin a [_backgroundSync](https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L1771-L1781) that [long polls](https://spec.matrix.org/latest/#architecture) every 30 seconds (configurable).

## Replicating the state in the client
Each sync job uses the [_handleSync](https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L1969-L2021) method to perform the appropriate updates to state.

For example, in the [`_handleRoomEvents` sub-handler the updates are made in the following order:](https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L2277-L2284)
- the in-memory state (accessible from the SDK client object e.g. `client.rooms`)
- the client side database for persistent storage
- the SDK's [exposed event streams](https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L1254-L1285)

## Reacting to new events in the UI
In particular, how do we know when new messages have arrived? Let's look at how Fluffychat does it. First let's look at [where they render their chat boxes](https://gitlab.com/famedly/fluffychat/-/blob/f19bbcd0102e1b2982af9b988e9e6f7de9cc33a7/lib/pages/chat/chat_event_list.dart#L104-142). The messages are found in a room's `timeline`. The `timeline` is returned from the [SDK getTimeline method](https://github.com/famedly/matrix-dart-sdk/blob/42f44de2b13588aede30d5f64fc381ee1a72f90c/lib/src/room.dart#L1467-L1479). An `onUpdate` callback is passed to allow the UI to react to new messages arriving. Here is where [Fluffychat sets up the timeline listener for new messages](https://gitlab.com/famedly/fluffychat/-/blob/1911004d0540d3dea51da327dd32d82d061675f5/lib/pages/chat/chat.dart#L287-340)

