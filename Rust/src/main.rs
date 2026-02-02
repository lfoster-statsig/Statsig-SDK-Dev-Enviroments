use statsig_rust::{Statsig, StatsigOptions, StatsigUser, StatsigUserBuilder, ClientInitResponseOptions, HashAlgorithm};
use statsig_rust::data_store_interface::{DataStoreTrait, DataStoreResponse, RequestPath};
use std::env;
use std::sync::{Arc, RwLock};
use std::collections::HashMap;

use async_trait::async_trait;
use statsig_rust::StatsigErr;
use serde_json;

const EMPTY_SPECS: &str = r#"
    {
  "dynamic_configs": {
    "Test Autotune": {
      "type": "dynamic_config",
      "salt": "bb86c503-6031-4be2-a712-50e2b2a95979",
      "enabled": true,
      "defaultValue": {

      },
      "rules": [
        {
          "name": "prestart",
          "passPercentage": 100,
          "conditions": [
            "1828919350"
          ],
          "returnValue": {

          },
          "id": "prestart",
          "salt": "",
          "idType": "userID"
        }
      ],
      "idType": "userID",
      "entity": "autotune",
      "version": 1
    },
    "test_whn_config": {
      "type": "dynamic_config",
      "salt": "c55c0d08-b762-4333-ab05-4333af7e1c61",
      "enabled": true,
      "defaultValue": {

      },
      "rules": [],
      "idType": "userID",
      "entity": "dynamic_config",
      "version": 1
    }
  },
  "feature_gates": {
    "test_gate": {
      "type": "feature_gate",
      "salt": "67bee182-e7ed-4081-99d6-0b5d05b9b2d0",
      "enabled": true,
      "defaultValue": false,
      "rules": [
        {
          "name": "2UApGQAn4ESXsT0IgrA7MF",
          "passPercentage": 50,
          "conditions": [
            "1828919350"
          ],
          "returnValue": true,
          "id": "2UApGQAn4ESXsT0IgrA7MF",
          "salt": "0eec2bee-8486-4d00-8fe6-8cdd8d3fbe85",
          "idType": "userID"
        }
      ],
      "idType": "userID",
      "entity": "feature_gate",
      "version": 3
    }
  },
  "experiment_to_layer": {

  },
  "layer_configs": {
    "test-whn-layer": {
      "type": "dynamic_config",
      "salt": "b2aadc69-5b1e-4ad3-aee6-9abf4eda9ccf",
      "enabled": true,
      "defaultValue": {

      },
      "rules": [],
      "idType": "userID",
      "entity": "layer",
      "version": 1
    }
  },
  "has_updates": true,
  "time": 1770074262174,
  "company_id": "1S8VUfg1rViNQt7SQHJ1H7",
  "condition_map": {
    "1828919350": {
      "type": "public",
      "targetValue": null,
      "operator": null,
      "field": null,
      "additionalValues": {

      },
      "idType": "userID"
    }
  },
  "response_format": "dcs-v2",
  "session_replay_info": {
    "sampling_rate": 1,
    "recording_blocked": false,
    "session_recording_privacy_settings": {
      "privacy_mode": "min"
    }
  },
  "diagnostics": {
    "initialize": 10000,
    "dcs": 1000,
    "download_config_specs": 1000,
    "idlist": 100,
    "get_id_list": 100,
    "get_id_list_sources": 100,
    "log": 100,
    "log_event": 100,
    "api_call": 100
  },
  "sdk_configs": {
    "event_queue_size": 2000,
    "event_content_encoding": "gzip",
    "sampling_mode": "none"
  },
  "checksum": "7831095963744403000"
}
"#;

pub struct OfflineStore {
    map: Arc<RwLock<HashMap<String, String>>>,
}

impl OfflineStore {
    pub fn new() -> Self {
        Self {
            map: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

#[async_trait]
impl DataStoreTrait for OfflineStore {
    async fn initialize(&self) -> Result<(), StatsigErr> {
        Ok(())
    }

    async fn shutdown(&self) -> Result<(), StatsigErr> {
        Ok(())
    }

    async fn get(&self, key: &str) -> Result<DataStoreResponse, StatsigErr> {
        // Return empty specs for the initial download config specs request that the SDK makes.
        if key.contains("/v2/download_config_specs|plain_text") {
            return Ok(DataStoreResponse {
                result: Some(EMPTY_SPECS.into()),
                time: None,
            });
        }

        match self.map.read().unwrap().get(key) {
            Some(value) => Ok(DataStoreResponse {
                result: Some(value.clone()),
                time: None,
            }),
            None => Ok(DataStoreResponse {
                result: None,
                time: None,
            }),
        }
    }

    async fn set(&self, key: &str, value: &str, _time: Option<u64>) -> Result<(), StatsigErr> {
        self.map
            .write()
            .unwrap()
            .insert(key.to_string(), value.to_string());
        Ok(())
    }

    async fn support_polling_updates_for(&self, _path: RequestPath) -> bool {
        false
    }
}


#[tokio::main]
async fn main() {
    let statsig = {
        let mut opts = StatsigOptions::default();
        opts.disable_all_logging = Some(true);
        opts.disable_network = Some(true);
        opts.disable_disk_access = Some(true);
        opts.disable_country_lookup = Some(true);

        opts.data_store = Some(Arc::new(OfflineStore::new()));

        dotenv::dotenv().ok();

        let server_key = env::var("SERVER_KEY").expect("SERVER_KEY must be set in environment variables");
        
        Statsig::new(&server_key, Some(Arc::new(opts)))
    };

    statsig.initialize().await.unwrap();

    let user = StatsigUser::with_user_id("loganfoster");

    let userID = "loganfoster".to_string();

    let gate = statsig.get_feature_gate(&user, "test_gate");

    println!("Statsig init reason {}", gate.details.reason);

    println!("Check Gate {}", statsig.check_gate(&user, "test_gate"));
    statsig.override_gate("test_gate", true, None);
    statsig.override_experiment("my_experiment", HashMap::new(), None);
    statsig.override_dynamic_config("my_config", HashMap::new(), None);

    // Check the overriden values
    let gate = statsig.get_feature_gate(&user, "test_gate");

    println!("Statsig init reason {}", gate.details.reason);

    println!("Check Gate {}", statsig.check_gate(&user, "test_gate"));
    let payload = {
        let mut opts = ClientInitResponseOptions::default();
        opts.include_local_overrides = Some(true);
        opts.hash_algorithm = Some(HashAlgorithm::None);
        
        statsig.get_client_init_response_with_options(&user, &opts)
    };
    println!("{}", serde_json::to_string_pretty(&payload).unwrap());
}