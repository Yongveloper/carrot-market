export async function getAccessToken(code: string): Promise<{
  access_token: string;
  error: string;
}> {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID as string,
    client_secret: process.env.GITHUB_CLIENT_CLIENT_SECRET as string,
    code,
  }).toString();

  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  return await accessTokenResponse.json();
}

export async function getUser(access_token: string): Promise<{
  id: string;
  avatar_url: string;
  login: string;
  email: string;
}> {
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache', // default
  });

  return await userProfileResponse.json();
}
