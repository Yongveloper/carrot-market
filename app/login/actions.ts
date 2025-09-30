'use server';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import getSession from '@/lib/session';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import z from 'zod';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, 'An account with this email does not exist'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return {
      ...result.error.flatten(),
      ...data,
    };
  }
  const user = await db.user.findUnique({
    where: {
      email: result.data.email,
    },
    select: {
      id: true,
      password: true,
    },
  });

  const ok = await bcrypt.compare(result.data.password, user!.password ?? '');

  if (ok) {
    const session = await getSession();
    session.id = user!.id;

    await session.save();

    return redirect('/profile');
  }

  return {
    ...data,
    fieldErrors: {
      password: ['Wrong password.'],
      email: [],
    },
  };
}
