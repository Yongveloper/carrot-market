import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToWon } from '@/lib/utils';
import { deleteCloudflareImageByUrl } from '@/lib/cloudflare';
import { UserIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { revalidateTag, unstable_cacheTag } from 'next/cache';

async function getIsOwner(userId: number) {
  const session = await getSession();

  if (session.id) {
    return session.id === userId;
  }

  return false;
}

async function getProduct(id: number) {
  'use cache';

  unstable_cacheTag('product-detail');
  unstable_cacheTag('aaa');
  console.log('product!');
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

async function getProductTitle(id: number) {
  'use cache';

  unstable_cacheTag('product-title');
  unstable_cacheTag('aaa');
  console.log('title!');

  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });

  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const promiseParam = await params;
  const product = await getProductTitle(Number(promiseParam.id));

  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const promiseParam = await params;
  const id = Number(promiseParam.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  const revalidate = async () => {
    'use server';
    revalidateTag('product-detail');
  };

  const deleteProduct = async () => {
    'use server';

    // Delete image from Cloudflare first
    if (product.photo) {
      await deleteCloudflareImageByUrl(product.photo);
    }

    // Delete product from database
    await db.product.delete({
      where: {
        id,
      },
    });

    redirect('/products');
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={`${product.photo}/width=500,height=500`}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed bottom-0 left-0 flex w-full items-center justify-between bg-neutral-800 p-5 pb-10">
        <span className="text-lg font-semibold">
          {formatToWon(product.price)}
        </span>
        {isOwner && (
          <form action={revalidate}>
            <button className="cursor-pointer rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white">
              Revalidate title cached
            </button>
          </form>
        )}
        <Link
          className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
