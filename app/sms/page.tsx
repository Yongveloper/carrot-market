'use client';

import Input from '@/components/input';
import Button from '@/components/button';
import { smsLogIn } from './actions';
import { useActionState } from 'react';

const initialState = {
  phone: '',
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useActionState(smsLogIn, initialState);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            required={true}
            type="number"
            placeholder="Verification code"
            min={100_000}
            max={999_999}
            errors={state.error?.formErrors}
          />
        ) : (
          <Input
            name="phone"
            required={true}
            type="text"
            placeholder="Phone number"
            defaultValue={state?.phone}
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? 'Verify Token' : 'Send Verification SMS'} />
      </form>
    </div>
  );
}
