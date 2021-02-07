# Android

https://www.joshmorony.com/deploying-capacitor-applications-to-android-development-distribution/

1. Update versionCode and versionName in android/app/build.gradle (increment versionCode and define
   versionName as appropriate major.min.patch)
2. Open Android Studio and copy updated project (yarn build, npx cap copy)
3. Generate .aab from Android Studio: Build > Generate Signed Bundle / APK
4. Select keystore and follow the steps to generate the .aab
5. Create new version in Google Play Developer Console from Production section
6. Upload the .aab generated for Android Studio in android/app/release/app-release.aab
7. Set the versionName, Save and Launching app.

# iOS

https://www.joshmorony.com/deploying-capacitor-applications-to-ios-development-distribution/

iOS - ios/App/App/Info.plist \*(you're looking for the CFBundleShortVersionString key)
