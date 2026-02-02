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
  process.env.CLIENT_KEY,
  { userID: "user-id" },
  {
    networkConfig: { initializeHashAlgorithm: "none" },
  }
);


console.log("Is Ready?", client.loadingStatus);

console.log("Is Loading?", client.isLoading);

const details = await client.initializeAsync();
console.log(details);
const values = client.getContext().values; // AnyInitializeResponse | null
console.log(values);

client.logEvent("add_to_cart", "SKU_12345", {
  price: "9.99",
  item_name: "diet_coke_48_pack",
});

const isInExperiment = client.checkGate("new_feature_gate");

console.log("Is user in experiment?", isInExperiment);

console.log("Is Ready?", client.loadingStatus);

console.log("Is Loading?", client.isLoading);

await client.flush(); // optional, but will send events immediately
client.getContext();

// Exit the application
process.exit(0);
