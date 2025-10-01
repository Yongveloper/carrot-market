'use server';

import z from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import crypto from 'crypto';

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    'Wrong phone format',
  );

const tokenSchema = z.coerce.number().min(100_000).max(999_999);

interface IActionState {
  phone: string;
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });

  if (exists) {
    return getToken();
  }

  return token;
}

export async function smsLogIn(prevState: IActionState, formData: FormData) {
  const phone = formData.get('phone') as string;
  const token = formData.get('token') as string;

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        phone,
        token: false,
        error: result.error.flatten(),
      };
    }

    await db.sMSToken.deleteMany({
      where: {
        user: {
          phone: result.data,
        },
      },
    });

    const token = await getToken();
    await db.sMSToken.create({
      data: {
        token,
        user: {
          connectOrCreate: {
            where: {
              phone: result.data,
            },
            create: {
              username: crypto.randomBytes(10).toString('hex'),
              phone: result.data,
            },
          },
        },
      },
    });
    // send the token using twilio
    return {
      phone: result.data,
      token: true,
    };
  }

  const result = tokenSchema.safeParse(token);
  if (!result.success) {
    return {
      token: true,
      phone: prevState.phone,
      error: result.error.flatten(),
    };
  }

  redirect('/');
}
