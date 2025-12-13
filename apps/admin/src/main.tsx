import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// import { scan } from "react-scan";
import App from "./App.tsx";
import config from "./config";
import "./index.css";
import stores from "./stores";

if (config.mode === "production") {
  disableReactDevTools();
}

// scan({
//   enabled: config.mode === "development",
// });

createRoot(document.getElementById("root")!).render(
  <Provider store={stores}>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>,
);
