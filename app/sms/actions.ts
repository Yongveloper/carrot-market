'use server';

import z from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';

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
