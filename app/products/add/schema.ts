import z from 'zod';

export const productSchema = z.object({
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

export type ProductType = z.infer<typeof productSchema>;
