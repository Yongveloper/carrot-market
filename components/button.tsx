'use client';

import { useFormStatus } from 'react-dom';

interface IButtonProps {
  text: string;
}

export default function Button({ text }: IButtonProps) {
  // useFromStatus는 Form의 자식 컴포넌트에서 사용해야함.
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300"
    >
      {pending ? '로딩 중...' : text}
    </button>
  );
}
