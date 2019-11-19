(function() {
  "use strict";

  var rootElement = document.getElementById("dd-root");
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
  var allFeatures = 0;
  var doneFeatures = 0;
  var feature = void 0;
  var isCapable = true;

  var notSupportedClassName = "dd__browser-feature--not-supported";
  var supportedClassName = "dd__browser-feature--supported";

  function onFeatureChecked(feature, isFeatureSupported) {
    isCapable = isCapable && isFeatureSupported;
    doneFeatures += 1;

    markSupported(feature, isFeatureSupported);
    updateProgress(allFeatures, doneFeatures);

    if (doneFeatures < allFeatures) {
      return;
    }

    onFinished();
  }

  function onFinished() {
    document.getElementById("dd-root-loader-capabilities").classList.add("dd__setup--hidden");
    document.getElementById("dd-root-loader-app").classList.remove("dd__setup--hidden");

    if (isCapable) {
      rootElement.className = "js-dd-capable";
    } else {
      rootElement.className = "js-dd-incapable";
      document.getElementById("dd-root-error").classList.remove("dd__setup--hidden");
    }
  }

  function updateProgress(max, value) {
    var progressBarElement = document.getElementById("dd-capabilities-progress");

    progressBarElement.setAttribute("max", max);
    progressBarElement.setAttribute("value", value);
    progressBarElement.textContent = String(value) + "/" + String(max);
  }

  function markSupported(feature, isFeatureSupported) {
    document.getElementById("browser-feature-" + requiredBrowserFeatures[feature]).classList.add(isFeatureSupported ? supportedClassName : notSupportedClassName);
  }

  document.getElementById("dd-root-loader-setup").classList.add("dd__setup--hidden");
  document.getElementById("dd-root-loader-capabilities").classList.remove("dd__setup--hidden");

  for (feature in requiredBrowserFeatures) {
    if (requiredBrowserFeatures.hasOwnProperty(feature)) {
      allFeatures += 1;

      Modernizr.on(
        feature,
        (function(thisFeature) {
          return function(result) {
            return onFeatureChecked(thisFeature, result);
          };
        })(feature)
      );
    }
  }
})();
