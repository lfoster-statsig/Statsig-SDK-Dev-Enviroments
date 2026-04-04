using Statsig;
using Statsig.Server;
using Newtonsoft.Json.Linq;

public class Program
{
    private static readonly string[] TestingArray = ["tests", "hehe"];

    public static async Task Main(string[] args)
    {
        DotNetEnv.Env.Load("../.env"); // Loads variables from .env file in parent directory
        string serverKey = Environment.GetEnvironmentVariable("SERVER_KEY")!;
        var options = new StatsigOptions
        {
            // DisableNetwork = true,
        };

        await StatsigServer.Initialize(serverKey, options);

        var user = new StatsigUser
        {
            UserID = "loganfoster",
            Email = "lfoster@statsig.com"
        };
        user.AddCustomProperty("testing", JArray.FromObject(new[] { "tests", "hehe" }));

        // StatsigServer.LogEvent(user, "add_to_cart", "SKU_12345",
        // new Dictionary<string, string> {
        //     { "price", "9.99" },
        //     { "item_name", "diet_coke_48_pack" }
        // });

        // StatsigServer.GetClientInitializeResponse(user, includeLocalOverrides: true);


        // Test against a known gate that has an array value. If it contains tests it should pass
        bool check = StatsigServer.CheckGateSync(user, "go-core-array-test");

        Console.WriteLine($"Gate check: {check}");

        // var gateValue = StatsigServer.CheckGate(user, "new_feature_gate");
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

        await StatsigServer.Shutdown();

        var array = new[] { "testing", "tests", "ttttttt" };


        var target = new[] { "ttttttt" };

        Console.WriteLine(ArrayContainsAny(array, target));
        Console.WriteLine(ArrayContainsAll(array, target));

    }

    internal static bool ArrayContainsAny(object[] array, object[] value)
    {
        foreach (var val in array)
        {
            if (MatchStringInArray(value, val, true, (s1, s2) => s1 == s2))
            {
                return true;
            }
        }

        return false;
    }

    internal static bool ArrayContainsAll(object[] array, object[] value)
    {
        foreach (var val in array)
        {
            if (!MatchStringInArray(value, val, true, (s1, s2) => s1 == s2))
            {
                return false;
            }
        }

        return true;
    }

    // Return true if the array contains the value, using case-insensitive comparison for strings
    internal static bool MatchStringInArray(object[] array, object? value, bool ignoreCase,
        Func<string, string, bool> func)
    {
        if (value == null)
        {
            return false;
        }

        var valueStr = value.ToString();
        if (value.GetType().IsArray)
        {
            valueStr = string.Join(",", (object[])value);
        }
        else if (value is IEnumerable<object> enumerable)
        {
            valueStr = string.Join(",", enumerable);
        }

        try
        {
            foreach (var t in array)
            {
                if (t == null)
                {
                    continue;
                }

                if (ignoreCase && func(valueStr!.ToLowerInvariant(), t.ToString()!.ToLowerInvariant()))
                {
                    return true;
                }

                if (func(valueStr!, t.ToString()!))
                {
                    return true;
                }
            }
        }
        catch
        {
            // User error, return false if we cannot toString() the values for this string operators.
        }

        return false;
    }

}
