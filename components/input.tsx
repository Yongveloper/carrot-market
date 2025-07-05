import { InputHTMLAttributes } from 'react';

interface IInputProps {
  errors?: string[];
  name: string;
}

export default function Input({
  errors = [],
  name,
  ...rest
}: IInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="h-10 w-full rounded-md border-none bg-transparent px-4 ring-2 ring-neutral-200 placeholder:text-neutral-400 focus:ring-4 focus:ring-orange-500 focus:outline-none"
        name={name}
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500">
          {error}
        </span>
      ))}
    </div>
  );
}
