# Getting Started With Flutter

After putting quite a bit of time into getting Element for Android working as a library so that I could wrap it in my own package, I was finding that even writing a simple feature was proving difficult. I did some evaluation of the amount of energy that would be required to get up to speed with android in a way that would be required for me to make any meaningful progress on quiri and Flutter started to look more attractive.

With the wrapped Element Android version of the app distributed out to Josh, Loisel and Anton, we had collected some solid sample conversations that have helped to inform which features are essential to the quiri experience and which new features we might like to build on top of it. This has given me more confidence in building from scratch using Flutter. 

[There is an actively maintained matrix SDK for flutter](https://gitlab.com/famedly/company/frontend/famedlysdk) as well as the [associated open-source app that depends on it (which has decent reviews in the Play Store)](https://gitlab.com/famedly/fluffychat). So my thinking is that it's probably a similar effort for me to get up speed on android vs build from scratch in Flutter (maybe I will just build on top of fluffychat...) but if I go with Flutter at least I will understand how all of the code works (because I will write it). Whereas the experience with android right now is one of generally being frustrated and lost in a large and complex codebase. 

While I feel that there is some risk that Flutter will end up being the wrong tool due to some shortcomings, [it appears to be a pretty solid tool and Google is quite active in improving it.](https://flutter.dev/events/io-2022) If it plays out well, it will be easy enough to have desktop and web clients as well as android and iOS.

# Getting Started
I had just bought a new macbook so I have had a pretty fresh start. Here are the things that I already installed:
- iTerm2
- ohmyzsh
- xcode and the xcode command line tools (big download)
- vs code
- android studio (to maybe write flutter in)
- docker desktop

For flutter I just jumped to their [install homepage](https://docs.flutter.dev/get-started/install) and went from there.

`flutter doctor` raised a couple of issues
- `Unable to locate Android SDK.`
  - I needed to open Android Studio, which had a first time run wizard that installed the android SDK for me
- `CocoaPods not installed.`
  - Just followed [their instructions](https://guides.cocoapods.org/using/getting-started.html#installation) to install cocoapods as well.
- `cmdline-tools component is missing`
  - on the Android Studio startup modal, click `More actions` > `SDK Manager` > `SDK Tools` tab > check `Android SDK command line tools (latest)` and then `Apply` or `OK`
- `Android license status unknown.`
  - `flutter doctor --android-licenses`

I am going to start with just android devices so I need to take the [Android Setup](https://docs.flutter.dev/get-started/install/macos#android-setup) steps as well.

# IDE
I chose android studio because I imagine google has put effort into making it the ideal development experience. I could definitely see myself switching to VS code though.

I got as far as running the sample app on my device.

# Next steps
I think that I will follow the more detailed intro to creating an app that follows this setup. And then probably go back to the Flutter course I started on Udemy a while back. 

I will need to get some initial designs going with Loisel as well to help guide my efforts.