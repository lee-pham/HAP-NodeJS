var exec = require('child_process').exec;

import {
  Accessory,
  Characteristic,
  CharacteristicEventTypes,
  CharacteristicSetCallback,
  CharacteristicValue,
  Service,
  uuid
} from '..';

// Generate a consistent UUID for TV that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the word "tv".
var tvUUID = uuid.generate('hap-nodejs:accessories:tv');

// This is the Accessory that we'll return to HAP-NodeJS.
var tv = exports.accessory = new Accessory('TV', tvUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
// @ts-ignore
tv.username = "A3:FB:3D:4D:2E:AC";
// @ts-ignore
tv.pincode = "031-45-154";

// Add the actual TV Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKit.ts`
var televisionService = tv.addService(Service.Television, "Television", "Television");

televisionService
  .setCharacteristic(Characteristic.ConfiguredName, "Television");

televisionService
  .setCharacteristic(
    Characteristic.SleepDiscoveryMode,
    Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
  );

televisionService
  .getCharacteristic(Characteristic.Active)!
  .on(CharacteristicEventTypes.SET, (newValue: CharacteristicValue, callback: CharacteristicSetCallback) => {
    console.log("set Active => setNewValue: " + newValue);
    if (newValue == 1) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/poweron", function(){});
    } else if (newValue == 0) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/poweroff", function(){});
    };
    callback(null);
  });

televisionService
  .setCharacteristic(Characteristic.ActiveIdentifier, 1);

televisionService
  .getCharacteristic(Characteristic.ActiveIdentifier)!
  .on(CharacteristicEventTypes.SET, (newValue: CharacteristicValue, callback: CharacteristicSetCallback) => {
    console.log("set Active Identifier => setNewValue: " + newValue);
    if (newValue == 1) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/home", function(){});
    } else if(newValue == 2) {
      exec("curl -d '' http://10.0.0.238:8060/launch/19977", function(){});
    } else if (newValue == 3) {
      exec("curl -d '' http://10.0.0.238:8060/launch/12", function(){});
    }
    callback(null);
  });

televisionService
  .getCharacteristic(Characteristic.RemoteKey)!
  .on(CharacteristicEventTypes.SET, (newValue: CharacteristicValue, callback: CharacteristicSetCallback) => {
    console.log("set Remote Key => setNewValue: " + newValue);
    if (newValue == 8) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/select", function(){});
    } else if (newValue == 4) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/up", function(){});
    } else if (newValue == 5) {
        exec("curl -d '' http://10.0.0.238:8060/keypress/down", function(){});
    } else if (newValue == 6) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/left", function(){});
    } else if (newValue == 7) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/right", function(){});
    } else if (newValue == 9) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/back", function(){});
    } else if (newValue == 11) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/play", function(){});
    } else if (newValue == 15) {
      exec("curl -d '' http://10.0.0.238:8060/keypress/info", function(){});
    }
    callback(null);
  });

televisionService
  .getCharacteristic(Characteristic.PictureMode)!
  .on(CharacteristicEventTypes.SET, (newValue: CharacteristicValue, callback: CharacteristicSetCallback) => {
    console.log("set PictureMode => setNewValue: " + newValue);
    callback(null);
  });

televisionService
  .getCharacteristic(Characteristic.PowerModeSelection)!
  .on(CharacteristicEventTypes.SET, (newValue: CharacteristicValue, callback: CharacteristicSetCallback) => {
    console.log("set PowerModeSelection => setNewValue: " + newValue);
    callback(null);
  });

// Speaker

var speakerService = tv.addService(Service.TelevisionSpeaker)

speakerService
  .setCharacteristic(Characteristic.Active, Characteristic.Active.ACTIVE)
  .setCharacteristic(Characteristic.VolumeControlType, Characteristic.VolumeControlType.ABSOLUTE);

speakerService.getCharacteristic(Characteristic.VolumeSelector)!
  .on(CharacteristicEventTypes.SET, (newValue: CharacteristicValue, callback: CharacteristicSetCallback) => {
    console.log("set VolumeSelector => setNewValue: " + newValue);
    callback(null);
  });

// HDMI 1

var inputHome = tv.addService(Service.InputSource, "home", "Home");

inputHome
  .setCharacteristic(Characteristic.Identifier, 1)
  .setCharacteristic(Characteristic.ConfiguredName, "Home")
  .setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED)
  .setCharacteristic(Characteristic.InputSourceType, Characteristic.InputSourceType.APPLICATION);

// Spotify

var inputSpotify = tv.addService(Service.InputSource, "spotify", "Spotify");

inputSpotify
  .setCharacteristic(Characteristic.Identifier, 2)
  .setCharacteristic(Characteristic.ConfiguredName, "Spotify")
  .setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED)
  .setCharacteristic(Characteristic.InputSourceType, Characteristic.InputSourceType.APPLICATION);

// Netflix

var inputNetflix = tv.addService(Service.InputSource, "netflix", "Netflix");

inputNetflix
  .setCharacteristic(Characteristic.Identifier, 3)
  .setCharacteristic(Characteristic.ConfiguredName, "Netflix")
  .setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED)
  .setCharacteristic(Characteristic.InputSourceType, Characteristic.InputSourceType.APPLICATION);

televisionService.addLinkedService(inputHome);
televisionService.addLinkedService(inputSpotify);
televisionService.addLinkedService(inputNetflix);
