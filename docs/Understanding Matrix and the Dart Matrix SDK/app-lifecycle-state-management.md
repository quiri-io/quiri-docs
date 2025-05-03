# App Lifecycle State Management
- whenever the app is in the foreground and the screen is locked, if the sync request is sent it fails and the re-login after soft-logout fails and it makes a mess
- the requests are failing because the device is going into [doze mode](https://developer.android.com/training/monitoring-device-state/doze-standby#restrictions) and network access is suspended
- [fluffychat watches for app lifecycle change events from the system and turns off the background sync when the device is in doze mode](https://gitlab.com/famedly/fluffychat/-/blob/325dcf901ae7074d72a3821783ec8cea1bcf8dec/lib/widgets/matrix.dart#L442-450)
- I still can't figure out what Fluffychat does when we are soft logged out.