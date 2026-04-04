import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";
import { StatsigClient } from "@statsig/js-client";
import { StatsigSessionReplayPlugin } from "@statsig/session-replay";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// const myStatsigClient = new StatsigClient(
//   process.env.CLIENT_KEY,
//   { userID: "user-id" },
//   {
//     plugins: [new StatsigSessionReplayPlugin(), new StatsigAutoCapturePlugin()],
//   }
// );

var client = new StatsigClient(
  // process.env.CLIENT_KEY,
  'client-d7pXWYu0nMC4ChtHELokCxW2Uy50vm1fBnueMQaSBqC',
  { userID: "STATSIG_USER_TEST" },
  {
    networkConfig: { initializeHashAlgorithm: "none" },
    environment: "development",
  }
);


console.log("Is Ready?", client.loadingStatus);

console.log("Is Loading?", client.isLoading);

const details = await client.initializeAsync();
console.log(details);
const values = client.getContext().values; // AnyInitializeResponse | null
console.log(values);

// client.logEvent("add_to_cart", "SKU_12345", {
//   price: "9.99",
//   item_name: "diet_coke_48_pack",
// });

client.logEvent("STATSIG_TESTING", "STATSIG_TESTING", {
  isCustomEvent: true,
});

// const isInExperiment = client.checkGate("test_gate");

// let config = client.getDynamicConfig("test_config");
// console.log("Config value:", config.get("confirmation"));

// let exp = client.getExperiment("logexperimenttest", { disableExposureLogging: true });

// console.log("Is user in experiment?", isInExperiment);

console.log("Is Ready?", client.loadingStatus);

console.log("Is Loading?", client.isLoading);

console.log("Is Success?", client.isSuccess);

await client.flush(); // optional, but will send events immediately
client.getContext();

client.shutdown();

// Exit the application
process.exit(0);
