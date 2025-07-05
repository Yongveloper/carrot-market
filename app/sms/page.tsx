'use client';

import Input from '@/components/input';
import Button from '@/components/button';
import { smsVerification } from './actions';
import { useActionState } from 'react';

export default function SMSLogin() {
  const [state, dispatch] = useActionState(smsVerification, null);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="phone"
          required={true}
          type="number"
          placeholder="Phone number"
        />
        <Input
          name="token"
          required={true}
          type="number"
          placeholder="Verification code"
        />
        <Button text="Verify phone number" />
      </form>
    </div>
  );
}
