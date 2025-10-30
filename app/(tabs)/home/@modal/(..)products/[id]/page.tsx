import CloseButton from '@/components/close-button';
import db from '@/lib/db';
import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getProduct(id: number) {
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

export default async function Modal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(Number(id));

  if (!product) {
    return notFound();
  }

  return (
    <div className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/60">
      <CloseButton />
      <div className="flex h-1/2 w-full max-w-screen-sm flex-col justify-center">
        <div className="relative flex aspect-square items-center justify-center rounded-md bg-neutral-700 text-neutral-200">
          <Image
            width={450}
            height={450}
            src={`${product.photo}/width=450,height=450`}
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
          <p>{formatToWon(product.price)}</p>
        </div>
      </div>
    </div>
  );
}
