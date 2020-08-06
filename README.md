# kiwi

### Utils commands

```javascript
// Add android platform
$ npx cap add android
// Add iOS platform
$ npx cap add ios
// Build web assets to copy to platforms
$ ionic build
// copy the build assets to platforms
$ npx cap copy
// open android studio to build app
$ npx cap open android
// open xcode to build app
$ npx cap open ios
```

```javascript
// This init frontend in http://localhost:8100/
> ionic serve // build with livereload and up the app in a browser
```

```javascript
> ionic cap sync // The sync command updates dependencies, and copies any web assets to your project.
```

```javascript
> ionic cap run ios --livereload // run and and sync files to build in xcode
> ionic cap run android --livereload --external // run and and sync files to build in android studio
```

### To install plugin in ionic react

1. Install plugin from @ionic/native
2. Install plugin directly like a dependency. Example:

```javascript
> yarn add phonegap-plugin-barcodescanner
```

### Run backend

```javascript
// This init backend in http://localhost:3000
> yarn start-backend
```

### Thisgt to fix in admob-free plugin

- the js code in node_modules/@ionic-native/addmob-free/index.js isn't minify well
- we can use androidx to fix erros in compile time (NonNull class not found error)
- we need to modify the next things in node_modules dependecies too:

```javascript
// Add this line in cordova-admob-sdk/plugin.xml into the platform tag
<preference name="PLAY_SERVICES_VERSION" default="+" />
```

```javascript
// Add the Ad unit id in cordova-admob-plugin-admob-free/plugin.xml into the platform tag
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-3940256099942544~3347511713"
/>
```
