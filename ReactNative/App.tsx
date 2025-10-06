import {
  StatsigProviderRN,
  useFeatureGate,
} from "@statsig/react-native-bindings";
import { StyleSheet, Text, View } from "react-native";

function Content() {
  const gate = useFeatureGate("new_feature_gate");

  // Reason: Network or NetworkNotModified
  return (
    <View style={styles.container}>
      <Text>Value: {gate.value ? "Pass" : "Fail"}!</Text>
      <Text>Reason: {gate.details.reason}</Text>
    </View>
  );
}

export default function App() {
  return (
    <StatsigProviderRN
      sdkKey={"client-xgwG1zbGEfD9ap4ZIh3mDaXOWgyvZL0NfFfkFIAENvb"}
      user={{ userID: "loganfoster" }}
      loadingComponent={
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      }
      options={{
        environment: { tier: "development" },
        networkConfig: { networkTimeoutMs: 20000 },
      }}
    >
      <Content />
    </StatsigProviderRN>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
