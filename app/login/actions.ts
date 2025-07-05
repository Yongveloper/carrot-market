'use server';

export const handleForm = async (prevState: any, formData: FormData) => {
  console.log(prevState);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    email: formData.get('email'),
    password: formData.get('password'),
    errors: ['wrong password', 'password too short'],
  };
};
