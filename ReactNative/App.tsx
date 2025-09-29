import { StyleSheet, Text, View } from "react-native";

import { StatsigProviderRN } from "@statsig/react-native-bindings/src/StatsigProviderRN";
import { StatusBar } from "expo-status-bar";
import { useStatsigClient } from "@statsig/react-native-bindings";

export default function App() {
  return (
    <StatsigProviderRN
      sdkKey={process.env.EXPO_PUBLIC_APP_CLIENT_KEY}
      user={{ userID: "mobile-user" }}
      loadingComponent={<Text>Statsig loading</Text>}
      options={{
        environment: { tier: "development" },
        // timeoutMs: 10000,
        networkConfig: {
          networkTimeoutMs: 5000,
        },
      }}
    >
      <View style={styles.container}>
        <Text>Hello World!</Text>
        {(() => {
          const client = useStatsigClient();
          return (
            <>
              <StatusBar style="auto" />
              <StatusBar style="auto" />
              <View className="App">
                <View className="App-header">
                  <Text>
                    Gate is{" "}
                    {client.checkGate("new_feature_gate")
                      ? "passing"
                      : "failing"}
                    .
                  </Text>
                  <Text
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                  />
                </View>
              </View>
            </>
          );
        })()}
      </View>
    </StatsigProviderRN>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
