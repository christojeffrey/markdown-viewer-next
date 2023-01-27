export default async function verifyRefreshToken(refreshToken: string) {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_APP_SECRET}`,
    },
  };

  let responseData = "";
  const isSuccess = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`,
    options
  )
    .then((response) => response.text())
    .then((response) => {
      console.log("response", response);
      responseData = response;
      return true;
    })
    .catch((error) => {
      console.log("error", error);
      responseData = error;
      return false;
    });

  return { isSuccess, responseData };
}
