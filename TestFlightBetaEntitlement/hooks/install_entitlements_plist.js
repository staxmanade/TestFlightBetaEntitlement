#!/usr/bin/env node

var xcode = require('xcode');
var fs = require('fs');
var path = require('path');

var createEntitlementsPlistFile = function (appId) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
  '<plist version="1.0">\n' +
  '    <dict>\n' +
  '        <key>aps-environment</key>\n' +
  '        <string>production</string>\n' +
  '        <key>get-task-allow</key>\n' +
  '        <false/>\n' +
  '        <key>beta-reports-active</key>\n' +
  '        <true/>\n' +
  '        <key>application-identifer</key>\n' +
  '        <string>' + appId + '</string>\n' +
  '    </dict>\n' +
  '</plist>\n';

};

module.exports = function(context) {
  // console.log("*******");
  // console.log(context);
  // console.log("*******");

  var Q = context.requireCordovaModule('q');
  var deferral = new Q.defer();

  if(context.opts.cordova.platforms.indexOf('ios') < 0){
    throw new Error('This plugin expects the ios platform to exist.');
  }

  var iosFolder = path.join(context.opts.projectRoot, 'platforms/ios/');

  fs.readdir(iosFolder, function (err, data) {
    if(err) {
      throw err;
    }

    var projFolder;
    var projName;

    // Find the project folder by looking for *.xcodeproj
    if(data && data.length) {
      data.forEach(function (folder) {
        if(folder.match(/\.xcodeproj$/)) {
          projFolder = path.join(iosFolder, folder);
          projName = path.basename(folder, '.xcodeproj');
        }
      });
    }

    if(!projFolder) {
      throw new Error("Could not find an .xcodeproj folder in: " + iosFolder);
    }

    // Look up the directory tree for the config.xml
    var configFilePath = path.join(__dirname, '../../../config.xml');
    if(!fs.existsSync(configFilePath)){
      throw new Error("Expected to find the project's config.xml here: " + configFilePath);
    }

    var configXml = fs.readFileSync(configFilePath).toString();

    // Find the 'widget id="com.myapp.id"'
    var myRegexp = /widget(.*)id="(.*?)"/;
    var match = myRegexp.exec(configXml);
    match = myRegexp.exec(configXml);
    var appId = match[2];
    //console.log(configXml);

    // create a new entitlements plist file
    var entitlementsPlistFile = path.join(iosFolder, projName, "Resources/Entitlements.plist");

    var plistFileContents = createEntitlementsPlistFile(appId);

    fs.writeFile(entitlementsPlistFile, plistFileContents, function (err) {
      if(err) {
        throw err;
      }


      var projectPath = path.join(projFolder, 'project.pbxproj');
      var xcodeProject = xcode.project(projectPath);

      // parsing is async, in a different process
      xcodeProject.parse(function (err) {
        xcodeProject.addResourceFile('Entitlements.plist');

        fs.writeFileSync(projectPath, xcodeProject.writeSync());
        console.log('Added Entitlements.plist to the xcode project');

        deferral.resolve();
      });

    });

  });

  return deferral.promise;
};
