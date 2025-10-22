'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useRef, useState } from 'react';
import { getUploadUrl, uploadProduct } from './actions';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductType } from './schema';

const fileSchema = z.object({
  type: z.string().refine((value) => value.includes('image'), {
    message: '이미지 파일만 업로드 가능합니다.',
  }),
  size: z.number().max(1024 * 1024 * 2, {
    message: '이미지 파일은 2MB 이하로 업로드 가능합니다.',
  }),
});

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const uploadUrlRef = useRef('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      price: undefined,
      description: '',
    },
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files) {
      setPreview('');
      return;
    }

    const file = files[0];
    const resultFileSchema = fileSchema.safeParse(file);

    if (!resultFileSchema.success) {
      alert(
        resultFileSchema.error.flatten().fieldErrors.type ||
          resultFileSchema.error.flatten().fieldErrors.size,
      );
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      uploadUrlRef.current = uploadURL;
      setValue(
        'photo',
        `https://imagedelivery.net/nc4rw3MwArTZXyBceodJGA/${id}`,
      );
    }
  };

  const onSubmit = async (data: ProductType) => {
    if (file === null) {
      return;
    }

    const cloudflareForm = new FormData();
    cloudflareForm.append('file', file);

    const response = await fetch(uploadUrlRef.current, {
      method: 'POST',
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('price', String(data.price));
    formData.append('description', data.description);
    formData.append('photo', data.photo);

    return uploadProduct(formData);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 p-5"
      >
        <label
          htmlFor="photo"
          className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-cover bg-center text-neutral-300"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === '' && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neural-400 text-sm">
                사진을 추가해주세요.
                {errors.photo?.message}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          placeholder="제목"
          type="text"
          {...register('title')}
          errors={[errors.title?.message ?? '']}
        />
        <Input
          placeholder="가격"
          type="number"
          {...register('price')}
          errors={[errors.price?.message ?? '']}
        />
        <Input
          placeholder="자세한 설명"
          type="text"
          {...register('description')}
          errors={[errors.description?.message ?? '']}
        />
        <Button text="작성완료" />
      </form>
    </div>
  );
}
