'use server';

import z from 'zod';
import fs from 'fs/promises';
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

  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }

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
