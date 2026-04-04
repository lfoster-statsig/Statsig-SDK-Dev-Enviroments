using Statsig;


public class Program
{
    public static async Task Main(string[] args)
    {
        var options = new StatsigOptionsBuilder()
        .SetSpecsSyncIntervalMs(10000)
        .SetDisableAllLogging(false)
        .SetEnvironment("Production")
        .Build();

        DotNetEnv.Env.Load("../.env"); // Loads variables from .env file in parent directory
        string serverKey = Environment.GetEnvironmentVariable("SERVER_KEY")!;
        var statsig = new Statsig.Statsig(serverKey!, options);
        await statsig.Initialize();

        var user = new StatsigUserBuilder()
            .SetUserID("loganfoster")
            .Build();

        var gateValue = statsig.CheckGate(user, "new_feature_gate");
        string wasFeatureUsed = "";
        if (gateValue)
        {
            // Gate is on, enable new feature
            Console.WriteLine("The gate is on!");

            wasFeatureUsed = "featureUsed";
        }
        else
        {
            // Gate is off
            Console.WriteLine("The gate is off :(");
            wasFeatureUsed = "featureNotUsed";
        }

        statsig.OverrideGate("new_feature_gate", false);

        var paramStore = statsig.GetParameterStore(user, "testing123");

        bool check123Gate = paramStore.GetBool("test123", false) ?? throw new Exception("Parameter not found");

        check123Gate = statsig.CheckGate(user, "new_feature_gate");

         if (check123Gate)
        {
            // Gate is on, enable new feature
            Console.WriteLine("The gate is on!");

            wasFeatureUsed = "featureUsed";
        }
        else
        {
            // Gate is off
            Console.WriteLine("The gate is off :(");
            wasFeatureUsed = "featureNotUsed";
        }

        var overrides = new ClientInitResponseOptions()
        {
            // IncludeLocalOverrides = true,
            HashAlgorithm = "none",
        };

        while(true)
        {
            _ = statsig.GetClientInitializeResponse(user, overrides);

            // Console.WriteLine($"Gcir response: {gcirResponse}");

            // Thread.Sleep(1000);
        }

        // Gcir response: {"feature_gates":{"test_gate_124":{"name":"test_gate_124","rule_id":"6TVvu87vBZ9kDjMwXp8Bp8","secondary_exposures":[],"id_type":"userID","value":false},"new_feature_gate":{"name":"new_feature_gate","rule_id":"override","secondary_exposures":[],"value":false},"go-core-array-test":{"name":"go-core-array-test","rule_id":"default","secondary_exposures":[],"id_type":"userID","value":false}},"dynamic_configs":{"test_experiment_clone":{"name":"test_experiment_clone","rule_id":"prestart","secondary_exposures":[],"id_type":"userID","value":{},"is_device_based":false,"is_experiment_active":false,"is_user_in_experiment":false},"test_experiment_2":{"name":"test_experiment_2","rule_id":"prestart","secondary_exposures":[],"id_type":"userID","value":{},"is_device_based":false,"is_experiment_active":false,"is_user_in_experiment":false},"test_experiment_1":{"name":"test_experiment_1","rule_id":"prestart","secondary_exposures":[],"id_type":"userID","value":{},"is_device_based":false,"is_experiment_active":false,"is_user_in_experiment":false},"test_config":{"name":"test_config","rule_id":"default","secondary_exposures":[],"id_type":"userID","value":{"confirmation":23798734589,"custom":{"test":"testing123"},"testing123":12213},"is_device_based":false,"passed":false},"sdk_debugging_experiment":{"name":"sdk_debugging_experiment","rule_id":"prestart","secondary_exposures":[],"id_type":"userID","value":{},"is_device_based":false,"is_experiment_active":false,"is_user_in_experiment":false},"log_test_layer2":{"name":"log_test_layer2","rule_id":"prestart","secondary_exposures":[],"id_type":"userID","value":{"Testing":"testing","Testing again and such yea?":false},"is_device_based":false,"is_in_layer":true,"explicit_parameters":["Testing again and such yea?"],"is_experiment_active":false,"is_user_in_experiment":false},"testing_layers_and_such":{"name":"testing_layers_and_such","rule_id":"prestart","secondary_exposures":[],"id_type":"userID","value":{"Testing":"testing","Testing again and such yea?":false},"is_device_based":false,"is_in_layer":true,"explicit_parameters":["Testing","Testing again and such yea?"],"is_experiment_active":false,"is_user_in_experiment":false},"test_experiment":{"name":"test_experiment","rule_id":"launchedGroup","secondary_exposures":[],"id_type":"userID","value":{"TestParams":"\"Hehehehe\""},"is_device_based":false,"is_experiment_active":false,"is_user_in_experiment":false}},"layer_configs":{"test_layer":{"name":"test_layer","rule_id":"prestart","secondary_exposures":[],"value":{"Testing":"testing","Testing again and such yea?":false},"id_type":"userID","is_device_based":false,"is_experiment_active":false,"is_user_in_experiment":false,"allocated_experiment_name":"log_test_layer2","explicit_parameters":["Testing again and such yea?"],"undelegated_secondary_exposures":[]}},"time":1769823328374,"has_updates":true,"hash_used":"none","user":{"userID":"loganfoster","statsigEnvironment":{"tier":"Production"}},"sdkInfo":{"sdkVersion":"0.15.0","sessionId":"ff60c6b8-f493-476d-a25f-9486caf46e71","sdkType":"statsig-server-core-dotnet"},"sdkParams":{},"evaluated_keys":{"userID":"loganfoster"},"param_stores":{"testing123":{"TestString":{"ref_type":"static","param_type":"string","value":"wesjkghdfgkjhdfkg"},"test123":{"ref_type":"gate","param_type":"boolean","gate_name":"test_gate","pass_value":true,"fail_value":true},"Testingwerwor":{"ref_type":"static","param_type":"boolean","value":false},"TestObj":{"ref_type":"static","param_type":"object","value":{"anothatest":"34","custom":{"moreTest":"testingsdsfsdf"},"values":"stringaling"}}}},"can_record_session":true,"session_recording_rate":1.0,"recording_blocked":false,"session_recording_privacy_settings":{"privacy_mode":"min"}}

        var layer = statsig.GetLayer(user, "test_layer");
        var layerVal = layer.Get<string>("Testing", "default_value");

        Console.WriteLine($"Layer parameter value: {layerVal}");

        // Console.WriteLine($"Parameter Store test123 value: {check123Gate}");

        // var exp = statsig.GetExperiment(user, "sdk_debugging_experiment").Get<string>("Testing1234", "default");

        // var test = layer.Get<bool>("Testing again and such yea?", false);

        var tempTesting = statsig.GetExperiment(user, "log_test_layer2").Get<bool>("Testing again and such yea?", false);

        Console.WriteLine($"Experiment parameter value: {tempTesting}");

        statsig.LogEvent(user, wasFeatureUsed);

        await statsig.FlushEvents();

        await statsig.Shutdown();

        statsig.Dispose();

    }
}