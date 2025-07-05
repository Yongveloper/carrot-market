'use client';

import FormInput from '@/components/form-input';
import FormButton from '@/components/form-btn';
import SocialLogin from '@/components/social-login';
import { useActionState } from 'react';
import { createAccount } from './actions';

export default function CreateAccount() {
  const [state, dispatch] = useActionState(createAccount, null);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput
          name="username"
          required={true}
          type="text"
          placeholder="Username"
        />
        <FormInput
          name="email"
          required={true}
          type="email"
          placeholder="Email"
        />
        <FormInput
          name="password"
          required={true}
          type="password"
          placeholder="Password"
        />
        <FormInput
          name="confirm_password"
          required={true}
          type="password"
          placeholder="Confirm Password"
        />
        <FormButton text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
