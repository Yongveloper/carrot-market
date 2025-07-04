import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <input
            className="h-10 w-full rounded-md border-none bg-transparent px-4 ring-1 ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            type="text"
            placeholder="Username"
            required
          />
          <span className="text-red-500">Input error</span>
        </div>
        <button className="primary-btn h-10">Create account</button>
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
