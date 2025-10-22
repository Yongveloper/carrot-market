'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useActionState, useRef, useState } from 'react';
import { getUploadUrl, uploadProduct } from './actions';
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

  const uploadUrlRef = useRef('');
  const photoIdRef = useRef('');

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

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      uploadUrlRef.current = uploadURL;
      photoIdRef.current = id;
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get('photo');
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

    const photoUrl = `https://imagedelivery.net/nc4rw3MwArTZXyBceodJGA/${photoIdRef.current}`;
    formData.set('photo', photoUrl);

    return uploadProduct(_, formData);
  };

  const [state, action] = useActionState(interceptAction, null);

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
                {state?.error.fieldErrors.photo}
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
          name="title"
          placeholder="제목"
          type="text"
          defaultValue={state?.title ?? ''}
          errors={state?.error.fieldErrors.title}
        />
        <Input
          name="price"
          placeholder="가격"
          type="number"
          defaultValue={state?.price ?? ''}
          errors={state?.error.fieldErrors.price}
        />
        <Input
          name="description"
          placeholder="자세한 설명"
          type="text"
          defaultValue={state?.description ?? ''}
          errors={state?.error.fieldErrors.description}
        />
        <Button text="작성완료" />
      </form>
    </div>
  );
}
