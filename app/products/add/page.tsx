'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useActionState, useState } from 'react';
import { uploadProduct } from './actions';
import z from 'zod';

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
  const [state, action] = useActionState(uploadProduct, null);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files) {
      setPreview('');
      return;
    }

    const file = files[0];
    const result = fileSchema.safeParse(file);

    if (!result.success) {
      alert(
        result.error.flatten().fieldErrors.type ||
          result.error.flatten().fieldErrors.size,
      );
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div>
      <form action={action} className="flex flex-col gap-5 p-5">
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
                {state?.fieldErrors.photo}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input
          name="title"
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          placeholder="자세한 설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성완료" />
      </form>
    </div>
  );
}
