# Push Notifications
## Resources
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

## Open Questions
- how are environments handled in Firebase projects?
    - [readme](https://firebase.google.com/docs/projects/dev-workflows/overview-environments)