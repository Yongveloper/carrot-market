'use server';

export async function smsVerification(prevState: any, formData: FormData) {
  const data = {
    phone: formData.get('phone') as string,
    token: formData.get('token') as string,
  };
}
