'use server';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';

const checkUsername = (username: string) => !username.includes('lala');

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be a string',
        required_error: 'Username is required',
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, 'custom error')
      .refine(checkUniqueUsername, 'This username is already taken'),
    email: z
      .string()
      .email()
      .toLowerCase()
      .trim()
      .refine(
        checkUniqueEmail,
        'There is an account already registered with that email.',
      ),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPasswords, {
    message: 'Both passwords should be the same',
    path: ['confirm_password'],
  });

export async function createAccount(prevState: any, formData: FormData) {
  console.log(cookies());
  const data = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirm_password: formData.get('confirm_password') as string,
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return {
      ...result.error.flatten(),
      ...data,
    };
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 12);
  const user = await db.user.create({
    data: {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  const session = await getSession();
  session.id = user.id;

  await session.save();

  redirect('/profile');
}
