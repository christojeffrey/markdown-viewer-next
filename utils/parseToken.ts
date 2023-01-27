export default function parseToken(responseData: any) {
  // parse response, get access_token, expires_in, refresh_token, refresh_token_expires_in, scope, token_type
  const response = responseData.split("&");
  const access_token = response[0].split("=")[1];
  const expires_in = response[1].split("=")[1];
  const refresh_token = response[2].split("=")[1];
  const refresh_token_expires_in = response[3].split("=")[1];
  const scope = response[4].split("=")[1];
  const token_type = response[5].split("=")[1];

  return {
    access_token,
    expires_in,
    refresh_token,
    refresh_token_expires_in,
    scope,
    token_type,
  };
}
