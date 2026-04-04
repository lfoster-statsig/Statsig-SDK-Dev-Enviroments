import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function loadSidecar() {
  const apiKey = 'client-XpEEbk5TQLmLwS23iCauMQUZZkhtnoSiwB4I5WxJma8';
  const multiexpids = process.env.REACT_APP_SIDECAR_MULTIEXPIDS;
  const source = (process.env.REACT_APP_SIDECAR_SOURCE ?? "local").toLowerCase();
  const cdnBaseUrl =
    process.env.REACT_APP_SIDECAR_CDN_URL ??
    "https://cdn.jsdelivr.net/npm/statsig-sidecar-v2-beta/dist/index.min.js";

  const baseUrl =
    source === "cdn"
      ? cdnBaseUrl
      : `${window.location.origin}/sidecar-v2-local.js`;
  const src = new URL(baseUrl);
  src.searchParams.set("apikey", apiKey);
  if (multiexpids) {
    src.searchParams.set("multiexpids", multiexpids);
  }
  src.searchParams.set("autostart", "1");
  src.searchParams.set("reduceflicker", "0");

  const initializeUrl = process.env.REACT_APP_SIDECAR_INITIALIZE_URL;
  const logEventUrl = process.env.REACT_APP_SIDECAR_LOGEVENT_URL;
  if (initializeUrl) {
    src.searchParams.set("initializeurl", initializeUrl);
  }
  if (logEventUrl) {
    src.searchParams.set("logeventurl", logEventUrl);
  }

  const script = document.createElement("script");
  script.src = src.toString();
  script.async = true;
  script.id = "sidecar-v2";
  document.head.appendChild(script);
}

loadSidecar();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
