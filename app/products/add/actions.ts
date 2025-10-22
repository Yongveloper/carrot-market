'use server';

import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';
import { productSchema } from './schema';

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title') as string,
    price: formData.get('price') as string,
    description: formData.get('description') as string,
  };

  const result = productSchema.safeParse(data);

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
