'use server';

import z from 'zod';

import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

const productSchema = z.object({
  photo: z
    .string({
      required_error: '사진은 필수 입니다.',
    })
    .min(1, '사진을 선택해주세요.'),

  title: z
    .string({
      required_error: '제목은 필수 입니다.',
    })
    .min(1, '제목을 입력해주세요.'),

  description: z
    .string({
      required_error: '설명은 필수 입니다.',
    })
    .min(1, '설명을 입력해주세요.'),

  price: z.coerce
    .number({
      required_error: '가격은 필수 입니다.',
    })
    .positive('가격은 0보다 커야 합니다.'),
});

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title') as string,
    price: formData.get('price') as string,
    description: formData.get('description') as string,
  };

  const result = productSchema.safeParse(data);

  console.log(result);

  if (!result.success) {
    return {
      ...data,
      error: result.error.flatten(),
    };
  }

  const session = await getSession();

  if (session.id) {
    const product = await db.product.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        photo: result.data.photo,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/products/${product.id}`);
  }
}

export async function getUploadUrl(): Promise<{
  errors: string[];
  messages: string[];
  result: {
    id: string;
    uploadURL: string;
  };
  success: boolean;
}> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    },
  );
  const data = await response.json();

  return data;
}
