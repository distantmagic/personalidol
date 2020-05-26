import env from "src/framework/helpers/env";
import isLocalhost from "src/framework/helpers/isLocalhost";

import { default as MissingException } from "src/framework/classes/Exception/ServiceWorker/Missing";
import { default as SecurityException } from "src/framework/classes/Exception/ServiceWorker/Security";
import { default as UnsupportedException } from "src/framework/classes/Exception/ServiceWorker/Unsupported";

import type Logger from "src/framework/interfaces/Logger";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

function getServiceWorkerAPI(loggerBreadcrumbs: LoggerBreadcrumbs): ServiceWorkerContainer {
  const serviceWorker = navigator.serviceWorker;

  if (!serviceWorker) {
    throw new UnsupportedException(loggerBreadcrumbs, "Service worker is not supported.");
  }

  return serviceWorker;
}

export async function register(loggerBreadcrumbs: LoggerBreadcrumbs, logger: Logger): Promise<ServiceWorkerRegistration> {
  const PUBLIC_URL = env(loggerBreadcrumbs.add("env"), "PUBLIC_URL");
  const serviceWorker = getServiceWorkerAPI(loggerBreadcrumbs.add("getServiceWorkerAPI"));

  // The URL constructor is available in all browsers that support SW.
  const publicUrl = new URL(PUBLIC_URL, window.location.href);

  if (publicUrl.origin !== window.location.origin) {
    // Our service worker won't work if PUBLIC_URL is on a different origin
    // from what our page is served on. This might happen if a CDN is used to
    // serve assets; see https://github.com/facebook/create-react-app/issues/2374
    throw new SecurityException(loggerBreadcrumbs, "Public URL and actual origin do not match.");
  }

  const swUrl = `${PUBLIC_URL}/service-worker.js`;

  if (isLocalhost()) {
    // This is running on localhost. Let's check if a service worker still exists or not.
    const registration = await checkValidServiceWorker(loggerBreadcrumbs.add("checkValidServiceWorker"), logger, serviceWorker, swUrl);

    await serviceWorker.ready;

    // Add some additional logging to localhost, pointing developers to the
    // service worker/PWA documentation.
    await logger.info(loggerBreadcrumbs, "This web app is being served cache-first by a service worker.");

    return registration;
  } else {
    // Is not localhost. Just register service worker
    return registerValidSW(loggerBreadcrumbs.add("registerValidSW"), logger, serviceWorker, swUrl);
  }
}

async function registerValidSW(loggerBreadcrumbs: LoggerBreadcrumbs, logger: Logger, serviceWorker: ServiceWorkerContainer, swUrl: string): Promise<ServiceWorkerRegistration> {
  const registration = await serviceWorker.register(swUrl);

  if (registration.active) {
    return registration;
  }

  return new Promise((resolve) => {
    registration.onupdatefound = function () {
      const installingWorker = registration.installing;

      if (installingWorker == null) {
        return resolve(registration);
      }

      installingWorker.onstatechange = async function () {
        if (installingWorker.state === "installed") {
          if (serviceWorker.controller) {
            // At this point, the updated precached content has been fetched,
            // but the previous service worker will still serve the older
            // content until all client tabs are closed.
            await logger.info(loggerBreadcrumbs, "New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA.");

            return resolve(registration);
          } else {
            // At this point, everything has been precached.
            // It's the perfect time to display a
            // "Content is cached for offline use." message.
            await logger.info(loggerBreadcrumbs, "Content is cached for offline use.");

            // Execute callback
            return resolve(registration);
          }
        }
      };
    };
  });
}

async function checkValidServiceWorker(
  loggerBreadcrumbs: LoggerBreadcrumbs,
  logger: Logger,
  serviceWorker: ServiceWorkerContainer,
  swUrl: string
): Promise<ServiceWorkerRegistration> {
  // Check if the service worker can be found. If it can't reload the page.
  const response = await fetch(swUrl, {
    headers: {
      "Service-Worker": "script",
    },
  });

  // Ensure service worker exists, and that we really are getting a JS file.
  const contentType = response.headers.get("content-type");

  if (response.status === 404 || (contentType != null && contentType.indexOf("javascript") === -1)) {
    // No service worker found. Probably a different app. Reload the page.
    // This step may get stuck in an infinite wait for service worker.
    serviceWorker.ready.then(function () {
      return unregister(loggerBreadcrumbs.add("unregister"));
    });

    throw new MissingException(loggerBreadcrumbs, `Service worker file is not found or contains invalid contents: "${swUrl}"`);
  }

  return registerValidSW(loggerBreadcrumbs.add("registerValidSW"), logger, serviceWorker, swUrl);
}

export async function unregister(loggerBreadcrumbs: LoggerBreadcrumbs): Promise<void> {
  const serviceWorker = getServiceWorkerAPI(loggerBreadcrumbs.add("getServiceWorkerAPI"));

  serviceWorker.ready.then(function (registration) {
    registration.unregister();
  });
}
