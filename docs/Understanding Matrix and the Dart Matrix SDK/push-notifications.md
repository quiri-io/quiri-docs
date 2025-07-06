# Push Notifications
## Resources
- [client-server spec for push notification related endpoints](https://spec.matrix.org/v1.14/client-server-api/#push-notifications)
- [push gateway spec](https://spec.matrix.org/latest/push-gateway-api/#overview)
- [the reference implementation, sygnal](https://github.com/matrix-org/sygnal)
- [ansible script docs on deploying sygnal](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-sygnal.md)
- [notes for application developers from the sygnal team](https://github.com/matrix-org/sygnal/blob/main/docs/applications.md)
    - describes the relationship btw the push server and the application
    - how the server decides when to send a push
    - how the homeserver is made aware of the push server

## FCM For Android notifications (and potentially iOS)
 - [add firebase to the app](https://firebase.google.com/docs/flutter/setup?platform=android)
    - [install the firebase CLI](https://firebase.google.com/docs/cli)
- [add firebase to your flutter app](https://firebase.google.com/docs/flutter/setup?platform=android)
- I moved the `google-services.json` into the staging flavour and corrected it's package
- only the staging flavour currently initializes firebase
- [add FCM to the flutter project](https://firebase.google.com/docs/cloud-messaging/flutter/client)

## How fluffychat does it
- they primarly use unifiedPush
- they have [a patch in the codebase that can be applied to activate Firebase](https://gitlab.com/famedly/fluffychat/-/blob/b1785d4b8a138a916cff53a113671eda31d91c45/scripts/enable-android-google-services.patch) in case they don't want to use UnifiedPush
    - this does not use the flutter Firebase package. It configures it in the native apps (including the `google-services.json` and including the native firebase library) and then uses a custom built [fcm_shared_isolates flutter library](https://github.com/famedly/fcm_shared_isolate) to interact with native firebase library (fetch fcm tokens, etc.)
- the [backgroundPush class](https://gitlab.com/famedly/fluffychat/-/blob/325dcf901ae7074d72a3821783ec8cea1bcf8dec/lib/widgets/matrix.dart#L407-428) handles the relationship with FCM and is assocaited with the root Matrix widget but doesn't do much other than raise errors via dialogs and [unsubscribe from onSync when the widget gets displosed](https://gitlab.com/famedly/fluffychat/-/blob/325dcf901ae7074d72a3821783ec8cea1bcf8dec/lib/widgets/matrix.dart#L511).

## How we will do it
- probably just follow google docs RE firebase on flutter (use the flutter firebase package/CLI)
- Unified push is a more general purpose solution (works on devices without google services) and doesn't send push messages through google servers
    - but I don't have the resources for that right now
- convert the BackgroundPush class to a singleton service with GetIt?
- figure out how much of background push we actually need
- [need to add the POST_NOTIFICATION android permission these days apparently](https://source.android.com/docs/core/display/notification-perm)
    - investigating the merged AndroidManifest, it appears that the firebase messaging libraries add the POST_NOTIFICATION android permission
- now how do we ask for the permission?
    - there is a [popular `permission_handler` library](https://pub.dev/packages/permission_handler)
    - [fluffychat has the dependency](https://github.com/krille-chan/fluffychat/blob/8dd1b6dd8b96703b33c29c7a394acb88614385c1/pubspec.yaml#L72) but it looks like they only use for their windows build?
    - here are [the android docs regarding how to request permissions](https://developer.android.com/training/permissions/requesting)

## Configuring the Sygnal Push gateway
- add the [configuration to enable sygnal for fcm](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-sygnal.md#adjusting-the-playbook-configuration)
    - refer to [sygnal defaults file](https://github.com/quiri-io/matrix-docker-ansible-deploy/blob/cf29bc7511a727d3d8a519f44130e06d405695ae/roles/custom/matrix-sygnal/defaults/main.yml) for ansible sygnal deployment configuration options
    - refer to the [sygnal sample yaml](https://github.com/matrix-org/sygnal/blob/main/sygnal.yaml.sample) for sygnal server configurations
        - need to use the [service_account_file option](https://github.com/matrix-org/sygnal/blob/main/sygnal.yaml.sample#L213) (looks like api_key is deprecated)
- create a service account and a service account file
    - firebase > settings > Cloud Messaging > Manage service accounts
    - I am using the existing firebase service account for quiri-staging
    - manage keys > add key > json
    - create an `aux_file_definition` for the service account file [like they demonstrate for the APNS key](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-sygnal.md#adjusting-the-playbook-configuration)
        - you paste the file contents right into the playbook configuration
        - there are no `matrix_user_name` or `matrix_group_name` defined as variables so I just hardcoded `matrix` for both as the docs say `It also makes sure the files are owned by matrix:matrix, so that Sygnal can read them.`
    
- add the [sygnal dns record](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-sygnal.md#adjusting-the-playbook-configuration)

## Test pushes
- use postman to login as a user
- [add a new pusher for the user](https://playground.matrix.org/#post-/_matrix/client/v3/pushers/set)
    - pointing to the sygnal gateway
- add a push rule for that user
    - [`if no rules match an event, the homeserver MUST NOT notify the Push Gateway.`](https://spec.matrix.org/v1.14/client-server-api/#push-rules)
    - actually if [query the push rulesets](https://playground.matrix.org/#get-/_matrix/client/v3/pushrules/) there are a bunch or default push rules
- troubleshoot by trying to [send request direct to the push gateway](https://spec.matrix.org/latest/push-gateway-api/) with postman
    - open a shell via DigitalOcean console and `journalctl -fu matrix-sygnal.service` to inspect gateway logs


## Trobuleshooting
- [sygnal.gcmpushkin log](https://github.com/matrix-org/sygnal/blob/b203d49974f811c1ac60966145c528ea94b3340f/sygnal/gcmpushkin.py#L590-L596)
- [sygnal.access log](https://github.com/matrix-org/sygnal/blob/a6caf25ec3437fa70ec0a3b65e24ec2dc431e269/sygnal/http.py#L369)
    - this should only be after 

## event_id_only
- [Currently the only format available is `event_id_only'`](https://spec.matrix.org/v1.14/client-server-api/#post_matrixclientv3pushersset)
- [When the homeserver is performing a push where the format is "event_id_only", only the event_id, room_id, counts, and devices are required to be populated.](https://spec.matrix.org/v1.14/push-gateway-api/#homeserver-behaviour)
- [sygnal README with configuration details](https://github.com/matrix-org/sygnal/blob/899226575680274ad3cfa2862b05112a5097e200/README.md)
- [event_id_only is recommended for privacy](https://github.com/matrix-org/sygnal/blob/c025ac1b16b347e31ae6c54d491c01c16b0de599/docs/applications.md#L92-L112)
    - but no alternative is offered. Maybe 

## Open Questions
- how are environments handled in Firebase projects?
    - [readme](https://firebase.google.com/docs/projects/dev-workflows/overview-environments)
    - make a new project for each environment