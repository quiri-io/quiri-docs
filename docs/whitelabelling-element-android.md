# Whitelabelling Element Android

# To fork or not to fork?
- Forking allows for easier contributing back to element should that ever happen…
- Pays respect generally to the fact that this is made from open source code
- Might be easier to merge their changes in later?
So we fork it!
- BUT actually forks cannot be made private soo maybe a manual mirror?
  - https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository
  - http://blog.plataformatec.com.br/2013/05/how-to-properly-mirror-a-git-repository/
  - https://www.edwardthomson.com/blog/mirroring_git_repositories.html
Looks like the first thought actually made the most sense!
- Clone the element-android project locally under the name quiri-android
- [Only clone main as we only want to build upon releases](https://www.freecodecamp.org/news/git-clone-branch-how-to-clone-a-specific-branch/)
  - git clone -b main --single-branch --no-tags git@github.com:vector-im/element-android.git quiri-android
  - Rename the main branch to element/main
  - git branch -m element/main
  - Rename the element remote
  - git remote rename origin element-origin
  - Create a new main branch (will be the quiri-android main branch)
  - git checkout -b main
  - Create an empty repo on github called quiri-android
  - Add the new remote
  - git remote add origin git@github.com:quiri-io/quiri-android.git
  - Push the new remote branch to origin
  - git push --set-upstream origin main
  - And also push the element/main branch
  - git checkout element/main
  - git push --set-upstream origin
  - And then set element/main to track the element-origin remote again
  - git branch element/main -u element-origin/main
Now we should lock down basically any way of modifying element/main
    - Looks like that is a pro feature… just have to be careful for now

All of the workflows were brought over with the code. They start failing and sending emails. [They should be disabled until you figure out what they do/how to fix them.](https://docs.github.com/en/actions/managing-workflow-runs/disabling-and-enabling-a-workflow)



# Running the project for the first time after forking

https://github.com/gradle/gradle/issues/9361
I blindly selected the remove option. I should probably come back and understand this better in the future

Then run on Pixel 4a emulator
And it just runs!
Now to change the package name so that we can release to play store under a name that we own


Trying to rename the packages to io.quiri.app
Followed this post
Built but with some warnings that may have not been there previously…






# Back to librarifying vector
## Starting steps
Read up on product flavours in libraries later
Can’t have google-services.json in library
Now getting error: `incompatible types: <null> cannot be converted to int @com.airbnb.epoxy.EpoxyModelClass(layout = null)`
Maybe also doesn’t work well in library modules…
[Github issue](https://github.com/airbnb/epoxy/issues/226)
[The jsonviewer library project uses the EpoxyModelClass and it uses the R2.layout strategy with no complaints…](https://stackoverflow.com/questions/59843745/epoxymodels-are-not-working-in-feature-modules-library-projects-in-android)
[Going to try this](https://stackoverflow.com/a/59849994)
[Got issues with APPLICATION_ID, so I swapped it for LIBRARY_PACKAGE_NAME](https://stackoverflow.com/questions/42205767/context-getpackagename-vs-buildconfig-application-id)
[Using FCM in a library module](https://stackoverflow.com/a/43348982)
I just commented out apply plugin: `com.google.gms.google-services` in the gplay flavour
[Const `val` initializer should be a constant value](https://stackoverflow.com/questions/46482576/java-static-final-in-kotlin-const-val-initializer-should-be-a-constant-value)


# Creating the Quiri app module
Loosely followed this
File > New > Module
Name it io.quiri.app
minSDK is 21 (see dependencies.gradle)
Should change the quiri manifest to read minSdk from the same file
Choose blank activity
When gradle tries to resolve, it has a problem with

Just remove those two lines. The IDE added them for some reason, don’t know why it broke gradle
build s fine as long as vector is not a dependency of quiri
Add vector as a dependency of quiri


Had to create the flavours in quiri as well


# Manifest Merging
The quiri main./AndroidManifest.xml had these problems (merged manifest)

Clicking the suggested fixes removed the errors…
And then it builds and installs to emulated device!

# Hilt DI Errors
BUT there is some issues with Hilt being used in a “feature module”

```2022-04-20 22:22:10.520 4409-4409/io.quiri.app E/AndroidRuntime: FATAL EXCEPTION: main
    Process: io.quiri.app, PID: 4409
    java.lang.RuntimeException: Unable to instantiate application im.vector.app.VectorApplication: java.lang.ClassNotFoundException: Didn't find class "im.vector.app.VectorApplication" on path: DexPathList[[zip file "/data/app/~~HJX48J0ULpskvHJ8JQO44Q==/io.quiri.app-tcmSBf87Qu2FfwNszXOYZw==/base.apk"],nativeLibraryDirectories=[/data/app/~~HJX48J0ULpskvHJ8JQO44Q==/io.quiri.app-tcmSBf87Qu2FfwNszXOYZw==/lib/x86, /data/app/~~HJX48J0ULpskvHJ8JQO44Q==/io.quiri.app-tcmSBf87Qu2FfwNszXOYZw==/base.apk!/lib/x86, /system/lib, /system_ext/lib]]
        at android.app.LoadedApk.makeApplication(LoadedApk.java:1244)
        at android.app.ActivityThread.handleBindApplication(ActivityThread.java:6683)
        at android.app.ActivityThread.access$1300(ActivityThread.java:237)
        at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1913)
        at android.os.Handler.dispatchMessage(Handler.java:106)
        at android.os.Looper.loop(Looper.java:223)
        at android.app.ActivityThread.main(ActivityThread.java:7656)
        at java.lang.reflect.Method.invoke(Native Method)
        at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:592)
        at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:947)
     Caused by: java.lang.ClassNotFoundException: Didn't find class "im.vector.app.VectorApplication" on path: DexPathList[[zip file "/data/app/~~HJX48J0ULpskvHJ8JQO44Q==/io.quiri.app-tcmSBf87Qu2FfwNszXOYZw==/base.apk"],nativeLibraryDirectories=[/data/app/~~HJX48J0ULpskvHJ8JQO44Q==/io.quiri.app-tcmSBf87Qu2FfwNszXOYZw==/lib/x86, /data/app/~~HJX48J0ULpskvHJ8JQO44Q==/io.quiri.app-tcmSBf87Qu2FfwNszXOYZw==/base.apk!/lib/x86, /system/lib, /system_ext/lib]]
        at dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.java:207)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:379)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:312)
        at android.app.AppComponentFactory.instantiateApplication(AppComponentFactory.java:76)
        at androidx.core.app.CoreComponentFactory.instantiateApplication(CoreComponentFactory.java:52)
        at android.app.Instrumentation.newApplication(Instrumentation.java:1158)
        at android.app.LoadedApk.makeApplication(LoadedApk.java:1236)
        at android.app.ActivityThread.handleBindApplication(ActivityThread.java:6683) 
        at android.app.ActivityThread.access$1300(ActivityThread.java:237) 
        at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1913) 
        at android.os.Handler.dispatchMessage(Handler.java:106) 
        at android.os.Looper.loop(Looper.java:223) 
        at android.app.ActivityThread.main(ActivityThread.java:7656) 
        at java.lang.reflect.Method.invoke(Native Method) 
        at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:592) 
        at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:947) 
    	Suppressed: java.lang.NoClassDefFoundError: Failed resolution of: Lim/vector/app/Hilt_VectorApplication;
        at java.lang.VMClassLoader.findLoadedClass(Native Method)
        at java.lang.ClassLoader.findLoadedClass(ClassLoader.java:738)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:363)
        		... 14 more
     Caused by: java.lang.ClassNotFoundException: Didn't find class "im.vector.app.Hilt_VectorApplication" on path: DexPathList[[zip file "/data/app/~~HJX48J0ULpskvHJ8JQO44Q==/io.quiri.app-tcmSBf87Qu2FfwNszXOYZw==/base.apk"],nativeLibraryDirectories=[/data/app/~~HJX48J0ULpskvHJ8JQO44Q==/io.quiri.app-tcmSBf87Qu2FfwNszXOYZw==/lib/x86, /data/app/~~HJX48J0ULpskvHJ8JQO44Q==/io.quiri.app-tcmSBf87Qu2FfwNszXOYZw==/base.apk!/lib/x86, /system/lib, /system_ext/lib]]
        at dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.java:207)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:379)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:312)
        		... 17 more
```

Looks like there is specific way to use hilt in a feature module
Basic Hilt
https://developer.android.com/training/dependency-injection/hilt-android
Hilt with “feature modules”
https://developer.android.com/training/dependency-injection/hilt-multi-module
Tried just following the instructions for Basic Hilt setup in the quiri gradle file
Had to do this for kotlin(“kapt”)
Aaand got some fresh errors related to kapt

I just needed to add hilt dependencies into the quiri gradle in the same way that they were added to the vector gradle

Weird layout-inflater issue
Before this problem I had a problem that seemed to do with the fact that quiri app had a layout xml with the same name as one in vector
Just removed the layout xml that was created with the project and its associated activity
https://stackoverflow.com/questions/58554751/java-lang-nullpointerexception-missing-required-view-with-id
Then I get a very non-descript error about the layout inflater
This guy describes the problem in more details https://stackoverflow.com/a/44143105
This guy talks about how to debug it https://stackoverflow.com/a/40112945

So I just add an “any java exception” breakpoint and then start adding conditions to skip common exceptions until I hit something interesting
https://www.jetbrains.com/help/idea/using-breakpoints.html#breakpoint_condition
My condition: 
!(this instanceof ErrnoException) && !(this instanceof UnixException) && !(this instanceof FileAlreadyExistsException) && !(this instanceof ClassNotFoundException) && !(this instanceof NoSuchFileException) && !(this instanceof FileNotFoundException) 
There was some stackoverflow that talked about appcompat being a part of the problem… I lost that one


Same for logintoucharea



SOLUTION
I just had to remove the application tag from the quiri AndroidManifest.xml
It is clear that I don’t understand what I am doing but at least it is building now. It will be interesting to see how I will actually start adding my own components while using their code…








# First attempt notes
## Getting Started
- pulled the code
- used "import existing code" to import the project
- got a sync error
    - something about sha256 hash maybe causing errors
    - chose the "remove that setting" option
- then build starts!
    - This version of the Android Support plugin for IntelliJ IDEA (or Android Studio) cannot open this project, please retry with version 4.2 or newer.
    - upgraded android studio
  - opted to give more memory to android studio heap when prompted
  - I don't recall if I installed JDK 1.8 previously but it seemed to be needed
  - had issues with running avd on my macbook. Running on device now instead
  
## TODO
- change some code and debug something
- change app config to connect to local
  - org/matrix/android/sdk/api/Matrix.kt
    - the configuration gets injected in here?
    - I need to learn more about android...
  - this is the config class src/main/java/org/matrix/android/sdk/api/MatrixConfiguration.kt
    - does it fetch values from a config file somewhere? I want to be able to set it to my local machine for dev
      - and to the quiri server otherwise
  - I think this is the main place that it loads config from: src/main/java/im/vector/app/VectorApplication.kt
    - for now I can just hardcode the integrationUrl into VectorApplciation?
  - this is the thing that lods those URLs src/main/java/org/matrix/android/sdk/internal/session/integrationmanager/IntegrationManager.kt
    - this is for the "integration manager" https://element.io/element-matrix-store, NOT the chat server
  - search for homeserver in the code yadoi
- how to connect to locally running matrix server from device
    - https://stackoverflow.com/questions/4779963/how-can-i-access-my-localhost-from-my-android-device

