import ProductList from '@/components/product-list';
import db from '@/lib/db';
import { Prisma } from '@/lib/generated/prisma';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

async function getInitialProducts() {
  'use cache';

  console.log('hittt!!');
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata: Metadata = {
  title: 'Home',
};

export default async function Products() {
  const initialProducts = await getInitialProducts();
  const revalidate = async () => {
    'use server';
    revalidatePath('/home');
  };

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href="/products/add"
        className="fixed right-8 bottom-24 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
