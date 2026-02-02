export const handler = async (event, context, callback) => {
  const request = event.Records[0].cf.request;
  request.headers.host[0].value = "api.statsig.com";
  
  // Rewrite custom endpoint to Statsig endpoint
  // Replace 'my-product-data' with your custom endpoint name
  if (request.uri.includes('/v1/my-product-data')) {
    request.uri = request.uri.replace('/v1/my-product-data', '/v1/log_event');
  }
  
  return callback(null, request);
};