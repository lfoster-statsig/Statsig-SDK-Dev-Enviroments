type StatsigModule = {
  Statsig: new (sdkKey: string, options?: Record<string, unknown>) => {
    initialize: () => Promise<{ isSuccess: boolean; error?: string }>;
    shutdown: (timeoutMs?: number) => Promise<{ isSuccess: boolean; error?: string }>;
    getLayer: (user: unknown, layerName: string) => {
      get: <T = unknown>(key: string, defaultValue: T) => T;
      getRuleId: () => string;
      getAllocatedExperimentName: () => string | null;
    };
  };
  StatsigUser: {
    withUserID: (userID: string) => unknown;
  };
};

const SDK_KEY_ENV = 'STATSIG_SERVER_SDK_KEY';
const USER_ID_ENV = 'STATSIG_TEST_USER_ID';
const POLL_INTERVAL_MS_ENV = 'POLL_INTERVAL_MS';
const SPECS_URL_ENV = 'STATSIG_SPECS_URL';

const DEFAULT_USER_ID = 'checkout-poll-user';
const DEFAULT_POLL_INTERVAL_MS = 5_000;
const DEFAULT_STAGING_SPECS_URL =
  'http://localhost:8000/v2/download_config_specs';

const LAYER_NAME = 'chatgpt_inhouse_checkout';
const PARAM_NAME = 'enabled_prefetch_checkout_for_plus';

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

function parsePollIntervalMs(): number {
  const raw = process.env[POLL_INTERVAL_MS_ENV];
  if (!raw) {
    return DEFAULT_POLL_INTERVAL_MS;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_POLL_INTERVAL_MS;
  }
  return parsed;
}

async function main(): Promise<void> {
  const statsigModule = await loadStatsigModule();
  const { Statsig, StatsigUser } = statsigModule;

  const sdkKey = getRequiredEnv(SDK_KEY_ENV);
  const userID = process.env[USER_ID_ENV] ?? DEFAULT_USER_ID;
  const pollIntervalMs = parsePollIntervalMs();
  const specsUrl = process.env[SPECS_URL_ENV] ?? DEFAULT_STAGING_SPECS_URL;

  const options = {
    enableDcsDeltas: true,
    specsUrl,
    disableAllLogging: true,
  };

  const statsig = new Statsig(sdkKey, options);

  const initResult = await statsig.initialize();
  if (!initResult.isSuccess) {
    throw new Error(`Statsig initialize failed: ${initResult.error ?? 'unknown error'}`);
  }

  const user = StatsigUser.withUserID(userID);

  console.log(
    `Polling layer='${LAYER_NAME}' param='${PARAM_NAME}' every ${pollIntervalMs}ms`,
  );
  console.log(`Using specsUrl='${specsUrl}' enableDcsDeltas=true`);
  console.log('Press Ctrl+C to stop.');

  const logCurrentValue = () => {
    const layer = statsig.getLayer(user, LAYER_NAME);
    const enabled = layer.get<boolean>(PARAM_NAME, false);
    const allocatedExperiment = layer.getAllocatedExperimentName();

    console.log(
      `[${new Date().toISOString()}] ruleID=${layer.getRuleId()} allocatedExperiment=${allocatedExperiment ?? 'null'} ${PARAM_NAME}=${enabled}`,
    );
  };

  logCurrentValue();
  const interval = setInterval(logCurrentValue, pollIntervalMs);

  const shutdown = async (signal: string) => {
    clearInterval(interval);
    console.log(`Received ${signal}. Shutting down Statsig...`);
    const result = await statsig.shutdown(10_000);
    if (!result.isSuccess) {
      console.error(`Statsig shutdown failed: ${result.error ?? 'unknown error'}`);
      process.exitCode = 1;
    }
  };

  process.once('SIGINT', () => {
    void shutdown('SIGINT').finally(() => process.exit());
  });

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM').finally(() => process.exit());
  });
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function loadStatsigModule(): Promise<StatsigModule> {
  try {
    const mod = await import('statsig-napi');
    return (mod.default ?? mod) as StatsigModule;
  } catch {
    try {
      const mod = await import('@statsig/statsig-node-core');
      return mod as unknown as StatsigModule;
    } catch {
      throw new Error(
        'Could not load Statsig Node SDK. Install one of:\n' +
          '1) local build alias: npm install (with statsig-node/build available), or\n' +
          '2) npm package: npm install @statsig/statsig-node-core',
      );
    }
  }
}