TestFlightBetaEntitlement
=========================

Cordova Plugin that creates the `Entitlement.plist` necessary to deploy cordova apps to the new TestFlight Beta.

# Install

1. This plugin requires the use of [node-xcode](https://github.com/alunny/node-xcode). You can install it into your project locally with `npm install --save-dev xcode`

2. `cordova plugin add com.staxmanade.testflightbetaentitlement`

# What is required to use Apple's new TestFlight Beta?

There is some good info at [this SO post](http://stackoverflow.com/questions/25756669/app-does-not-contain-the-correct-beta-entitlement).

1. You have to build your apps with an App Store distribution provisioning profile (not AdHoc)
2. Your profile must have been generated (after they released the new TestFlight Beta) as Apple automatically adds the `beta-reports-active = 1` and other metadata to it.
3. You need to have an `Entitlements.plist` with the following informatino

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>aps-environment</key>
        <string>production</string>
        <key>get-task-allow</key>
        <false/>
        <key>beta-reports-active</key>
        <true/>
        <key>application-identifer</key>
        <string>{{YOUR_APP_ID}}</string>
    </dict>
</plist>
```

# How does this plugin work?

The plugin is nothing more than an `after_plugin_add` hook that attempts to use [node-xcode](https://github.com/alunny/node-xcode) to generate and add `Entitlements.plist` to the xcode project's `Resources\` folder.
