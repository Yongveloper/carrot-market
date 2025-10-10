import { redirect } from 'next/navigation';

export async function GET() {
  const baseURL = 'https://github.com/login/oauth/authorize';
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID as string,
    scope: 'read:user,user:email',
    allow_signup: 'true',
  };
  console.log('@@params', params);
  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;

  return redirect(finalUrl);
}
