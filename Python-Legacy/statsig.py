from statsig import statsig, StatsigEnvironmentTier, StatsigOptions, StatsigUser

# or with StatsigOptions
options = StatsigOptions(tier=StatsigEnvironmentTier.development)
statsig.initialize("secret-nVM4EfPnhlwhmQX3x5xYLFnmAzyoopd0iSDBPRrNVUl", options)

# check if sdk is initialized
initialized = statsig.is_initialized()

print(f"SDK initialized: {initialized}")

user = StatsigUser("loganfoster")

# layer = statsig.get_layer(user, "test_layer")
# temp = layer.get("Testing again and such yea?", False)

exp = statsig.get_experiment(user, "log_test_layer2")
val = exp.get("Testing again and such yea?", "default")

statsig.flush()
statsig.shutdown()

