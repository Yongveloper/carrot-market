import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return notFound();
  }

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID as string,
    client_secret: process.env.GITHUB_CLIENT_SECRET as string,
    code,
  }).toString();

  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await (
    await fetch(accessTokenURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();

  if ('error' in accessTokenResponse) {
    return new Response(null, {
      status: 400,
    });
  }

  return Response.json({ accessTokenResponse });
}
