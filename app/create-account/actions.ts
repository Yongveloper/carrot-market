'use server';
import { z } from 'zod';

const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/,
);

const checkUsername = (username: string) => !username.includes('lala');

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be a string',
        required_error: 'Username is required',
      })
      .min(3, 'Way too short!!')
      .max(10, 'That is too looong!')
      .toLowerCase()
      .trim()
      .transform((username) => `😀${username}`)
      .refine(checkUsername, 'custrom error'),
    email: z.string().email().toLowerCase().trim(),
    password: z
      .string()
      .min(4)
      .regex(
        passwordRegex,
        'A password must have lowercase, UPPERCASE, a number and special characters.',
      ),
    confirm_password: z.string().min(4),
  })
  .refine(checkPasswords, {
    message: 'Both passwords should be the same',
    path: ['confirm_password'],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirm_password: formData.get('confirm_password') as string,
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return {
      ...result.error.flatten(),
      ...data,
    };
  }

  console.log(result.data);
}
