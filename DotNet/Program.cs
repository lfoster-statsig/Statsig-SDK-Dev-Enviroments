using Statsig;


public class Program
{
    public static async Task Main(string[] args)
    {
        var options = new StatsigOptionsBuilder()
        .SetSpecsSyncIntervalMs(10000)
        .SetDisableAllLogging(false)
        
        .Build();

        DotNetEnv.Env.Load("../.env"); // Loads variables from .env file in parent directory
        string serverKey = Environment.GetEnvironmentVariable("SERVER_KEY")!;
        var statsig = new Statsig.Statsig(serverKey!, options);
        await statsig.Initialize();

        var user = new StatsigUserBuilder()
            .SetUserID(Environment.UserName)
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

        statsig.LogEvent(user, wasFeatureUsed);

        await statsig.FlushEvents();

        await statsig.Shutdown();

        statsig.Dispose();

    }
}