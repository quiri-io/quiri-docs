---
slug: sending-and-accepting-room-invites
title: Sending and Accepting Room Invites
authors: [nigel]
tags: [quiri,guide]
---

# DRAFT

## Background
Inviting someone to a Quiri is a core experience in the quiri app. This guide studies the matrix invite functionality as well as how the Dart SDK implements it (with references to how Fluffychat does it.) See [User Discovery in Quiri](2024-12-04-user-discovery-in-quiri.md) for a discussion of user discoverability and maintaining a contact list.

## Accepting an Invite
[Lets see how Fluffychat does it.](https://gitlab.com/famedly/fluffychat/-/blob/9ad85504493198439673ef5d8e31375ddb2af051/lib/pages/chat_list/chat_list_item.dart#L39-52)
It appears that when you are invited to a room, you will be added to the room but with a membership status of `invite`. The SDK calls the [join room endpoint](https://playground.matrix.org/#post-/_matrix/client/v3/join/-roomIdOrAlias-). Fluffychat is then SDK's `client.waitForRoomInSync` method to wait for that room to be `enabled` after the room join event is added to the event graph.

TODO:
- how do you list rooms that you have been invited to?

## Listening for Invites
The SDK offers the [waitForRoomInSync method](https://github.com/famedly/matrix-dart-sdk/blob/501c457ea130481ba5b52d45d4d0ff37b8707964/lib/src/client.dart#L822-L844) that waits for a specific room by ID to experience an `invite`, `join` or `leave` event. For private rooms I don't imagine that you would know the id of the room to be able to listen for it in this way. I haven't figured out how Fluffychat handles room invites but based on the `waitForRoomInSync` method I am watching the `onSync` stream, filtering on room events.
