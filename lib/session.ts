import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface ISessionContent {
  id?: number;
}

export default async function getSession() {
  return getIronSession<ISessionContent>(await cookies(), {
    cookieName: 'delicious-karrot',
    password: process.env.COOKIE_PASSWORD!,
  });
}
