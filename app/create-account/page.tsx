import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import FormInput from '../components/form-input';
import FormButton from '../components/form-btn';

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
          required={true}
          type="text"
          placeholder="Username"
          errors={[]}
        />
        <FormInput
          required={true}
          type="email"
          placeholder="Email"
          errors={[]}
        />
        <FormInput
          required={true}
          type="password"
          placeholder="Password"
          errors={[]}
        />
        <FormInput
          required={true}
          type="password"
          placeholder="Confirm Password"
          errors={[]}
        />
        <FormButton loading={false} text="Create account" />
      </form>
      <div className="h-px w-full bg-neutral-500" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-3"
          href="/sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </span>
          <span>Sign up with SMS</span>
        </Link>
      </div>
    </div>
  );
}
