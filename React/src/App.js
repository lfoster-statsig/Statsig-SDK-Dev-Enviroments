import "./App.css";

import {
  StatsigProvider,
  useStatsigClient,
  useStatsigUser,
} from "@statsig/react-bindings";

import React from 'react';
import logo from "./logo.svg";

function AppContent() {
  const client = useStatsigClient();
  const { updateUserAsync } = useStatsigUser();
  const [userId, setUserId] = React.useState("loganfoster");

  const handleUserIdChange = async (e) => {
    const newUserId = e.target.value;
    setUserId(newUserId);
    await updateUserAsync({ userID: newUserId });
  };

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
          .
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
  return (
    <StatsigProvider
      sdkKey={process.env.REACT_APP_CLIENT_KEY}
      user={{ userID: "loganfoster" }}
      options={{
        networkConfig: { initializeHashAlgorithm: "none" },
        environment: { tier: "development" },
        timeoutMS: 10000,
      }}
    >
      <AppContent />
    </StatsigProvider>
  );
}

export default App;
