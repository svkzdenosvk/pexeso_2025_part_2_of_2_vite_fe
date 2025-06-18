import '@pexeso/lib/i18n/i18n';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
 import { store } from "@pexeso/lib/redux/store/store";
import App from "./App";
import './index.css';

const container = document.getElementById("result");

document.getElementById("loading")?.remove(); //after loading delete temporary message

if (container) {
  const root = createRoot(container);

  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  console.error("Container element with ID 'result' not found.");
}
