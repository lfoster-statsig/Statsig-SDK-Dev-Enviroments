using Statsig;
using Statsig.Server;

public class Program
{
    public static async Task Main(string[] args)
    {
        DotNetEnv.Env.Load("../.env"); // Loads variables from .env file in parent directory
        string serverKey = Environment.GetEnvironmentVariable("SERVER_KEY")!;
        // var statsig = new Statsig.Statsig(serverKey!, options);

        var user = new StatsigUser { UserID = Environment.UserName, Email = "lfoster@statsig.com" };

        for(int i = 0; i < 1000; i++)
        {
            await StatsigServer.Initialize(
            serverKey,
                // optionally customize the SDKs configuration via StatsigOptions
                new StatsigOptions(
                    environment: new StatsigEnvironment(EnvironmentTier.Production)
                )
            );
        }

        StatsigServer.LogEvent(user, "add_to_cart", "SKU_12345", 
        new Dictionary<string, string> {
            { "price", "9.99" },
            { "item_name", "diet_coke_48_pack" }
        });

        // await statsig.Initialize();

        // var user = new StatsigUserBuilder()
        //     .SetUserID(Environment.UserName)
        //     .Build();

        // var gateValue = statsig.CheckGate(user, "new_feature_gate");
        // string wasFeatureUsed = "";
        // if (gateValue)
        // {
        //     // Gate is on, enable new feature
        //     Console.WriteLine("The gate is on!");

        //     wasFeatureUsed = "featureUsed";
        // }
        // else
        // {
        //     // Gate is off
        //     Console.WriteLine("The gate is off :(");
        //     wasFeatureUsed = "featureNotUsed";
        // }

        // statsig.LogEvent(user, wasFeatureUsed);

        // await statsig.FlushEvents();

        // await statsig.Shutdown();

        // statsig.Dispose();

        await StatsigServer.Shutdown();

    }
}