'use client';

import SocialLogin from '@/components/social-login';
import { useActionState } from 'react';
import { createAccount } from './actions';
import Input from '@/components/input';
import Button from '@/components/button';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

export default function CreateAccount() {
  const [state, dispatch] = useActionState(createAccount, null);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="username"
          required={true}
          type="text"
          placeholder="Username"
          errors={state?.fieldErrors.username}
          defaultValue={state?.username ?? ''}
        />
        <Input
          name="email"
          required={true}
          type="email"
          placeholder="Email"
          defaultValue={state?.email ?? ''}
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          required={true}
          type="password"
          placeholder="Password"
          defaultValue={state?.password ?? ''}
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          name="confirm_password"
          required={true}
          type="password"
          placeholder="Confirm Password"
          defaultValue={state?.confirm_password ?? ''}
          errors={state?.fieldErrors.confirm_password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
