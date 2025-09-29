use statsig_rust::{Statsig, StatsigOptions, StatsigUserBuilder};
use std::env;
use std::sync::Arc;
use serde_json;

// Simple init

#[tokio::main]
async fn main()
{
    // Initialize the logger
    let statsig: Statsig = init_statsig().await.unwrap();

    println!("Statsig SDK initialized successfully.");

    // Pull user information from your system
    let user_id: String = env::var("USER").unwrap_or_else(|_| "default_user".to_string());
    let user: statsig_rust::StatsigUser = StatsigUserBuilder::new_with_user_id(&user_id).build();

    if statsig.check_gate(&user, "new_feature_gate") {
        // Gate is on, enable new feature
        println!("New feature is enabled for user: {}", user_id);
    } else {
        // Gate is off, use old feature
        println!("New feature is NOT enabled for user: {}", user_id);
    }
    statsig.log_event(&user, "app_started", None, None);

   let feature_gate = statsig.get_feature_gate(&user, "test_gate");

    println!("Feature Gate: {}", serde_json::to_string(&feature_gate).unwrap_or_else(|_| "Failed to serialize feature_gate".to_string()));

    let experiment0:statsig_rust::statsig_types::Experiment = statsig.get_experiment(&user, "test_experiment");
    let experiment2: statsig_rust::statsig_types::Experiment = statsig.get_experiment(&user, "test_experiment_1");
    let experiment3: statsig_rust::statsig_types::Experiment = statsig.get_experiment(&user, "test_experiment_2");

    println!("Experiment 0: {}", serde_json::to_string(&experiment0).unwrap_or_else(|_| "Failed to serialize experiment0".to_string()));
    println!();
    println!("Experiment 2: {}", serde_json::to_string(&experiment2).unwrap_or_else(|_| "Failed to serialize experiment2".to_string()));
    println!();
    println!("Experiment 3: {}", serde_json::to_string(&experiment3).unwrap_or_else(|_| "Failed to serialize experiment3".to_string()));

    statsig.shutdown().await.unwrap();
}

async fn init_statsig() -> Result<Statsig, Box<dyn std::error::Error>>
{
    let mut options = StatsigOptions::default();
    options.environment = Some("development".to_string());

    // Load environment variables from .env file
    dotenv::dotenv().ok();
    let server_key = env::var("SERVER_KEY")?;
    let statsig = Statsig::new(&server_key, Some(Arc::new(options)));

    statsig.initialize().await.unwrap();

    return Ok(statsig);
}