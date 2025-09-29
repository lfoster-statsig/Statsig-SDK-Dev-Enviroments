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

var myStatsigClient = new StatsigClient(
  process.env.CLIENT_KEY,
  { userID: "user-id" },
  {
    networkConfig: { initializeHashAlgorithm: "none" },
  }
);

await myStatsigClient.initializeAsync();

myStatsigClient.logEvent("add_to_cart", "SKU_12345", {
  price: "9.99",
  item_name: "diet_coke_48_pack",
});

const isInExperiment = myStatsigClient.checkGate("new_feature_gate");

console.log("Is user in experiment?", isInExperiment);

await myStatsigClient.flush(); // optional, but will send events immediately

myStatsigClient.getContext();

// Exit the application
process.exit(0);
