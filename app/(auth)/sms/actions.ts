'use server';

import z from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import crypto from 'crypto';
import sessionLogin from '@/lib/sessionLogin';
import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    'Wrong phone format',
  );

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });

  return Boolean(exists);
}

const tokenSchema = z.coerce
  .number()
  .min(100_000)
  .max(999_999)
  .refine(tokenExists, 'This token does not exists');

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

    const credentials = new Auth({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });

    const vonage = new Vonage(credentials);
    await vonage.sms.send({
      to: process.env.MY_PHONE_NUMBER!,
      //to: result.data,
      from: process.env.VONAGE_SMS_FROM!,
      text: `Your Karrot verification code is: ${token}`,
    });

    return {
      phone: result.data,
      token: true,
    };
  }

  const tokenResult = await tokenSchema.spa(token);
  const phoneResult = phoneSchema.safeParse(phone);

  if (!tokenResult.success) {
    return {
      token: true,
      phone: prevState.phone,
      error: tokenResult.error.flatten(),
    };
  }

  const smsToken = await db.sMSToken.findUnique({
    where: {
      token: tokenResult.data.toString(),
      user: {
        phone: phoneResult.data,
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (smsToken) {
    await sessionLogin(smsToken.userId);
    await db.sMSToken.delete({
      where: {
        id: smsToken.id,
      },
    });
  }

  redirect('/profile');
}
