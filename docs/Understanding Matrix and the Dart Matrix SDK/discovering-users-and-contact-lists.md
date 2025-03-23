# Discovering Users and Contact Lists

## The Problem
In the current dev build of Quiri, the only way to open a conversation with a user is to know their username and to enter it perfectly in the `conversation partner` field. Here we explore ways to improve this experience, including:
- inviting a user via their email or phone number (3rd party identifier / 3PID)
    - inviting users without an account to create an account to accept the invite and start the conversation
- a contact list or friends list to quickly open new quiris
- adding a friend using their quiri userID or displayname

For the MVP all rooms are to be private and 1-1 and there are no plans to help users discover one another on the platform (e.g. no public spaces for posting). Public posting is being considered for a future release.



## What Matrix Offers
As we are building on top of matrix, we should first attempt to leverage the features and patterns that they offer out of the box to minimize custom dev work.

### Inviting a known user
This is the flow that we are using in the dev build today. Matrix users come with identifiers that look a lot like emails (e.g. `@nigel:quiri.io`). When you want to open a room with a user you can address it in the same way that you would address an email: know the user's email exactly and write it correctly. If the address is wrong, the room will fail to open same as an email would fail to send.

### User Directory Search
Matrix servers offer the ability to [search the user directory](https://spec.matrix.org/v1.11/client-server-api/#user-directory) for other users by their `user ID` or `display name`. This feature does not simply list the users though. Some search term must be passed (e.g. at least a single character like `a`) and only those users matching will be shown. As such, this is a feature that could help users find each other in two cases:
- the quiri userId/displayname was shared previously and the search provides some confirmation that the user actually exists and may provide suggestions if the userID/displayname was misspelt
- A user can try their friend's real name and hope they found the right person if the search returns a hit

#### Configuration Options
The `synapse` matrix server implementation offers [some configuration of the search results](https://element-hq.github.io/synapse/latest/usage/configuration/config_documentation.html#user_directory) but it is limited in it's configurability.

At it's most open, it returns search results for all users on the server and other servers. For the MVP this may be acceptable but as the community grows it could enable spammers to abuse the platform and harass random users.

The one restriction that is offered is to set the `search_all_users` property to false in which,
> "...search results will only contain users visible in public rooms and users sharing a room with the requester."
With this flag set we might be able to use this feature to enable searching of all users you have interacted with before as long as you are still in a room with each of those users.

### Third Party Invites
Matrix offers a way to invite someone to a room using a [third-party invite](https://spec.matrix.org/v1.12/client-server-api/#third-party-invites). If the user already has an account associated with that email/phone then they are added to the room. If they don't have an account yet, the user is sent an email inviting them to join quiri (and the room they were invited to). Once they have created an account associated with their email they can join the room.

### List all users in a room
For a given room, [all members in that room can be listed.](https://playground.matrix.org/#get-/_matrix/client/v3/rooms/-roomId-/members) this does not help us with our problems directly but may be useful as a workaround for storing a contact list.

### Search a room
Matrix offers the [server-side indexing and search of room event contents](https://playground.matrix.org/#post-/_matrix/client/v3/search). This also does not help us directly but could enable the searching of a "contact list" room.



## Our Solution

### Inviting someone to a room using their email
The built-in third party invite functionality appears to handle this. A more thorough audit should be performed against a local instance of Synapse.

### Contact list
[Matrix does not currently offer a contact list functionality](https://github.com/matrix-org/matrix-spec/issues/111). If we want this functionality, the out-of-the box solution will be to create a non-chat room for each user in which only their contact list is stored. Non-chat rooms are an [expected use-case for Matrix](https://spec.matrix.org/v1.12/client-server-api/#types) so it's not terribly hacky but the functionality will be limited. The [room search feature](https://playground.matrix.org/#post-/_matrix/client/v3/search) could possibly be used for filtering the contact list but sorting will likely be client side. The client will handle the logic for when a user is added/removed from a "contact list" room and will have to be careful to not include the contact list room in the quiri list. A more thorough audit of the room invite functionality should be performed to detail how "contact list" room invites and acceptances would map to "contact list" invites and acceptances/rejections.

### Adding a friend to your contact list
For the MVP there will be two ways in which you can add a user to your friends list:
- knowing their email
- knowing their username or display name

This feels quite restricted but making user directories searchable trades the convenience of searching for users by name with the risk of users being spammed. While this is a low risk today, as the platform grows, this is the kind of thing that crushes communication platforms.

Taking Discord as a reference, they offer adding a friend strictly by username but you can add someone to a server by email.

## Conclusion
Overall, the user experience will be:
- open conversations for the first time by providing their email (or knowing their username)
- a one-time use shareable add-me-as-a-friend link that can be pasted into an outside chat or email would be a nice way to make friend adding easier
- open further conversations with a user via your contact list