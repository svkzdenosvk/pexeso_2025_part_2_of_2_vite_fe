import React, { Suspense } from "react";
import LoadingScreen from "@pexeso/components/OutsideTheGame/pages/LoadingScreen"; 
import i18n from "@pexeso/lib/i18n/i18n";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@pexeso/lib/redux/store/store";
import App from "./App";
import "./index.css";

// function waiting until i18n is initialized
function waitForI18nInit(): Promise<void> {
  return new Promise((resolve) => {
    if (i18n.isInitialized) return resolve();
    i18n.on("initialized", () => resolve());
  });
}

waitForI18nInit().then(() => {
  document.getElementById("loading")?.remove();
  const container = document.getElementById("result");


  if (container) {
    const root = createRoot(container);

    root.render(
       <React.StrictMode>
        <Suspense fallback={<LoadingScreen />}>
          <Provider store={store}>
            <App />
          </Provider>
        </Suspense>
       </React.StrictMode>
    );
  } else {
    console.error("Container element with ID 'result' not found.");
  }
});
