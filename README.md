# kiwi

### Utils commands

```javascript
// Add android platform
$ npx cap add android

// Add iOS platform
$ npx cap add ios

// Build and update web assets
$ npx ionic build

// Copy the build assets to platforms (web stuff)
$ npx cap copy

// The sync command updates dependencies and copy the build assets (web and native stuff)
$ npx cap sync

// Open android studio or xcode to build app
$ npx cap open [android|ios]

// Run the app in a local ip of localhost and allow livereloading and sync files
$ npx ionic cap run [android|ios] -l --external

```

#### NOTE: to avoid server mode and active setup bundle mode (include all web files in app and get up app without local server)

    1) Delete prop server in [app|rider-app]/capacitor.config.json in root
    2) Run `npx cap sync` in terminal (this will modify native capacitor files)
    3) Run app from native ide

```javascript
// This init frontend in http://localhost:8100/
> npx ionic serve // build with livereload and up the app in a browser
```

### To install plugin in ionic react

1. Install plugin from @ionic/native
2. Install plugin directly like a dependency. Example:

```javascript
> yarn add phonegap-plugin-barcodescanner
```
