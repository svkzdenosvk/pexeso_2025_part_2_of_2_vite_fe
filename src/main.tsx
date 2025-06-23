import React, { Suspense } from "react";
import LoadingScreen from "@pexeso/components/OutsideTheGame/pages/LoadingScreen"; // môžeš si vytvoriť vlastný loader
import i18n from "@pexeso/lib/i18n/i18n";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@pexeso/lib/redux/store/store";
import App from "./App";
import "./index.css";

// Funkcia, ktorá čaká kým je i18n inicializovaný
function waitForI18nInit(): Promise<void> {
  return new Promise((resolve) => {
    if (i18n.isInitialized) return resolve();
    i18n.on("initialized", () => resolve());
  });
}

waitForI18nInit().then(() => {
  document.getElementById("loading")?.remove();
  const container = document.getElementById("result");

  // document.getElementById("loading")?.remove(); //after loading delete temporary message

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
