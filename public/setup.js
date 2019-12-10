// @flow

(function(Modernizr) {
  "use strict";

  var requiredBrowserFeatures = {
    cssgrid: "cssgrid",
    customelements: "customelements",
    datachannel: "webrtc",
    es5: "es5",
    es6array: "es6",
    es6collections: "es6",
    es6math: "es6",
    es6number: "es6",
    es6object: "es6",
    es6string: "es6",
    fetch: "fetch",
    flexbox: "flexbox",
    generators: "es6",
    intl: "intl",
    passiveeventlisteners: "passiveeventlisteners",
    peerconnection: "webrtc",
    promises: "promises",
    srcset: "srcset",
    webgl: "webgl",
    webworkers: "webworkers",
  };

  var setup = {
    getElementById(id) {
      var element = document.getElementById(id);

      if (!element) {
        throw new Error(String("Could not find element by ID: ") + id);
      }

      return element;
    },

    getRootElement() {
      return setup.getElementById("dd-root");
    },

    disableProgress: function() {
      setup.getElementById("dd-root-loader-feedback").classList.add("dd__setup--hidden");
    },

    setIncompatible: function() {
      setup.disableProgress();
      setup.getElementById("dd-root-loader-incompatible").classList.remove("dd__setup--hidden");
    },

    setInternalError: function(label, message) {
      setup.disableProgress();

      setup.getElementById("dd-root-loader-error").classList.remove("dd__setup--hidden");
      setup.getElementById("dd-root-loader-error-label").textContent = label;
      setup.getElementById("dd-root-loader-error-message").textContent = message;
    },

    setProgressMessage: function(message) {
      setup.getElementById("dd-root-loader-message").textContent = message;
    },
  };

  var allFeatures = 0;
  var doneFeatures = 0;
  var feature = void 0;
  var isCapable = true;

  var notSupportedClassName = "dd__browser-feature--not-supported";
  var supportedClassName = "dd__browser-feature--supported";

  function onAllFeaturesChecked() {
    if (isCapable) {
      setup.setProgressMessage("Finishing setup...");
      setup.getRootElement().dispatchEvent(
        new CustomEvent("dd-capable", {
          bubbles: true,
          detail: setup,
        })
      );
    } else {
      setup.setIncompatible();
    }
  }

  function onFeatureChecked(feature, isFeatureSupported) {
    isCapable = isCapable && isFeatureSupported;
    doneFeatures += 1;

    setIsFeatureSupported(feature, isFeatureSupported);

    if (doneFeatures < allFeatures) {
      return;
    }

    onAllFeaturesChecked();
  }

  function setIsFeatureSupported(feature, isFeatureSupported) {
    setup.getElementById("browser-feature-" + requiredBrowserFeatures[feature]).classList.add(isFeatureSupported ? supportedClassName : notSupportedClassName);
  }

  setup.setProgressMessage("Checking browser capabilities...");

  for (feature in requiredBrowserFeatures) {
    if (requiredBrowserFeatures.hasOwnProperty(feature)) {
      allFeatures += 1;

      Modernizr.on(feature, onFeatureChecked.bind(null, feature));
    }
  }
})(window.Modernizr);
