# Room Invites

- I had to specify RoomMember events as `ImportantEvents` in the client initialization
    - I think that [the server is still sending all the data but we are just not loading them into the DB?](https://github.com/famedly/matrix-dart-sdk/blob/defe47a1988434b0b9c2f2cae08919e52dcd760f/lib/src/client.dart#L3046-L3049)
    - what advantage is there to that?
    - [here are the notes on why (performance?) they do this filtering and when the data will be loaded (on timeline or a call to `postload`)](https://github.com/famedly/matrix-dart-sdk/blob/defe47a1988434b0b9c2f2cae08919e52dcd760f/lib/src/client.dart#L161-L173)
- And I set lazyloading to false in the filter
    - [lazyLoading docs](https://spec.matrix.org/latest/client-server-api/#lazy-loading-room-members)
    - the filter is serverside so it can make sense to not load all of the room member events to save on bandwidth
    - tested toggling lazy loading filter and it only disincludes the room summaries so it is not the thing keeping

- [m.room.member event type docs](https://spec.matrix.org/latest/client-server-api/#mroommember)
- [/sync request docs](https://spec.matrix.org/latest/client-server-api/#get_matrixclientv3sync)
- [/createRoom (what happens when you create a room)](https://spec.matrix.org/latest/client-server-api/#post_matrixclientv3createroom)
- [types of room membership and how to change them](https://spec.matrix.org/latest/client-server-api/#room-membership)


- question is, when it comes to knowing who invited you to a room, is the user's member room state the source of truth? Looks like it
- here are all of the basic events in a room that was created and then invited another user:
```json
"invite": {
    "!UIayZfmTbMXGXJWATK:quiri.io": {
        "invite_state": {
            "events": [
                {
                    "type": "m.room.join_rules",
                    "state_key": "",
                    "content": {
                        "join_rule": "invite"
                    },
                    "sender": "@loisel:quiri.io"
                },
                {
                    "type": "m.room.create",
                    "state_key": "",
                    "content": {
                        "room_version": "10",
                        "creator": "@loisel:quiri.io"
                    },
                    "sender": "@loisel:quiri.io"
                },
                {
                    "type": "m.room.member",
                    "state_key": "@loisel:quiri.io",
                    "content": {
                        "displayname": "Loisel",
                        "avatar_url": "MjAyNS0wNC0xOFQyMzoyODo1OS41OTIyMTU=",
                        "membership": "join"
                    },
                    "sender": "@loisel:quiri.io"
                },
                {
                    "type": "m.room.member",
                    "sender": "@loisel:quiri.io",
                    "content": {
                        "is_direct": true,
                        "displayname": "nigel",
                        "membership": "invite"
                    },
                    "state_key": "@nigel:quiri.io",
                    "origin_server_ts": 1745086563571,
                    "unsigned": {
                        "age": 206359996
                    },
                    "event_id": "$HPuKYzqWnCj2s6uYBuhETH97HjTT1a8XgGXHuW1J28o"
                }
            ]
        }
    }
}
```

- only room.create is included in the default state from which you can know who created the room but if you want to know specifically who invited you it seems that you need to inspect the room.member event