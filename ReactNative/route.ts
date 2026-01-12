import { Statsig, StatsigUser } from "@statsig/statsig-node-core";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const user = new StatsigUser(body?.user ?? {});

  // Ensure server SDK is initialized at startup
  await Statsig.initialize(process.env.STATSIG_SERVER_KEY!);

  const values = Statsig.getClientInitializeResponse(user, {
    hashAlgorithm: "djb2",
  });
  return new Response(JSON.stringify(values), { status: 200 });
}
