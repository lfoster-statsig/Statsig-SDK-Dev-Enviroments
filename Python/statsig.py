import os
import getpass
from statsig_python_core import Statsig, StatsigOptions, StatsigUser
from dotenv import load_dotenv

options = StatsigOptions()
options.environment = "development"

user = os.environ.get("USER") or getpass.getuser()
print(user)
statsigUser = StatsigUser(user)

load_dotenv()  # Loads variables from .env into environment

statsig = Statsig(os.getenv("SERVER_KEY"), options)
statsig.initialize().wait()

# test = statsig.getInstance()._options.enviroment

# print(test)

# feature_gate = statsig.get_feature_gate(statsigUser, "test_gate").get_evaluation_details()
gate = statsig.get_feature_gate(statsigUser, "test_gate")
print(gate.details.reason)
# print(feature_gate)

# print(f"Feature Gate: {feature_gate}")

gatePass = statsig.check_gate(statsigUser, "test_gate")
if(gatePass):
    print("The new feature is enabled!")
else:
    print("The new feature is disabled.")

statsig.log_event( 
    user=statsigUser,
    event_name="check_gate_passed",
    value=gatePass,
    metadata={},
)

statsig.shutdown().wait()