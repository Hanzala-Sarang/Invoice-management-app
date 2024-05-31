import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import FirebaseProvider from "./firebase/FirebaseProvider.jsx";
import InvoiceProvider from "./context/InvoiceProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <InvoiceProvider>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </InvoiceProvider>
  </React.StrictMode>
);
