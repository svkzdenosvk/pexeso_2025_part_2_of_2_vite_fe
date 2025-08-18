import React, { Suspense } from "react";
import LoadingScreen from "@pexeso/components/OutsideTheGame/pages/LoadingScreen";
import i18n from "@pexeso/lib/i18n/i18n";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@pexeso/lib/redux/store/store";
import App from "./App";
import "./index.css";

/**
 * Main Entry Point for the Vite React App
 *
 * Initializes the React application by:
 * 1. Waiting for i18n internationalization to be fully initialized before rendering.
 * 2. Removing the loading screen element from the DOM.
 * 3. Mounting the React root into the container with id "result".
 * 4. Wrapping the app with React.StrictMode, React Redux Provider, and Suspense with fallback.
 *
 * This setup ensures the app starts only after translations are ready,
 * provides a loading screen during lazy loading, and connects Redux store.
 *
 * @example
 * // Typical usage - app will be rendered inside a div with id "result"
 * // and a div with id "loading" will be removed on app start.
 *
 * @dependencies
 * React 18+, React DOM (createRoot), React Redux, react-i18next, Vite
 */

// Waits until i18n is fully initialized before continuing
function waitForI18nInit(): Promise<void> {
  return new Promise((resolve) => {
    if (i18n.isInitialized) return resolve();
    i18n.on("initialized", () => resolve());
  });
}

// Start app only after i18n is ready
waitForI18nInit().then(() => {
  // Remove the loading element from the DOM once ready
  document.getElementById("loading")?.remove();

  // Get the container to mount the React app
  const container = document.getElementById("result");

  if (container) {
    // Create React 18 root and render the app
    const root = createRoot(container);

    root.render(
      <React.StrictMode>
        {/* Suspense fallback shows LoadingScreen during lazy loading */}
        <Suspense fallback={<LoadingScreen />}>
          {/* Redux Provider makes the store available to all components */}
          <Provider store={store}>
            <App />
          </Provider>
        </Suspense>
      </React.StrictMode>
    );
  } else {
    // Log error if container div not found
    console.error("Container element with ID 'result' not found.");
  }
});
