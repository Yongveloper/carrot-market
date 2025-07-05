'use client';

import SocialLogin from '@/components/social-login';

import { handleForm } from './actions';
import { useActionState } from 'react';
import Input from '@/components/input';
import Button from '@/components/button';

export default function Login() {
  const [state, action] = useActionState(handleForm, null);
  console.log(state);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="email"
          required={true}
          type="email"
          placeholder="Email"
          // defaultValue={state?.email ?? ''}
        />
        <Input
          name="password"
          required={true}
          type="password"
          placeholder="Password"
          // defaultValue={state?.password ?? ''}
        />
        <Button text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
