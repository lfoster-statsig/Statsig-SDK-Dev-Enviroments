import "./App.css";

import {
  StatsigProvider,
  getDynamicConfig,
  getExperiment,
  updateUserAsync,
  useStatsigClient,
  useStatsigUser
} from "@statsig/react-bindings";

import React from 'react';
import logo from "./logo.svg";

function AppContent() {
  const client = useStatsigClient();
  const [userId, setUserId] = React.useState("loganfoster");

  const handleUserIdChange = async (e) => {
    const newUserId = e.target.value;
    setUserId(newUserId);
    await client.updateUserAsync({ userID: newUserId });
  };

  const config = client.getDynamicConfig("my_config");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="Enter User ID"
            style={{ padding: '8px', marginRight: '10px' }}
          />
        </div>
        <div>

          Gate is {client.checkGate("new_feature_gate") ? "passing" : "failing"}
          {/* Gate is {client.checkGate("external_billing_ml_targeting_enabled") ? "passing" : "failing"} */}
          .

          Is Loading is {client.isLoading ? "true" : "false"}.
        </div>

        <div>
          {/* <p>Group: {getExperiment('my_experiment').groupName}</p>
            <p>Group: {getExperiment('my_experiment').value}</p>
            <p>Value: {getExperiment('my_experiment').get('a_value', 'fallback_value')}</p> */}
        </div>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function App() {
  const sdkKey =
    process.env.REACT_APP_CLIENT_KEY ??
    "client-XpEEbk5TQLmLwS23iCauMQUZZkhtnoSiwB4I5WxJma8";

  return (
    <StatsigProvider
      // sdkKey='client-4hzWqDH0Cfxo5NxvXEZbhB2TbCLGgy2gIqIZ4J3aAlQ'
      // user= {{ userID: '0003f1fb-efb7-4a34-a843-140235ef0ff5' }}
      sdkKey={sdkKey}
      user={{ userID: "loganfoster" }}
      options={{
        networkConfig: { initializeHashAlgorithm: "none" },
        environment: { tier: "production" },
        timeoutMS: 10000,
        initializeHashAlgorithm: "none",
      }}
    >
      <AppContent />
    </StatsigProvider>
  );
}

export default App;
