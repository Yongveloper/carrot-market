import db from '@/lib/db';
import * as githubApi from '@/lib/github/api';

import sessionLogin from '@/lib/sessionLogin';
import { notFound, redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return notFound();
  }

  const { access_token, error } = await githubApi.getAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login, email } =
    await githubApi.getUser(access_token);

  const user = await db.user.findUnique({
    where: {
      github_id: String(id),
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await sessionLogin(user?.id as number);

    return redirect('/profile');
  }

  const username = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });

  const newUser = await db.user.create({
    data: {
      github_id: String(id),
      username: Boolean(username) ? `${login}_${crypto.randomUUID()}` : login,
      avatar: avatar_url,
      email,
    },
    select: {
      id: true,
    },
  });

  await sessionLogin(newUser?.id as number);

  return redirect('/profile');
}
