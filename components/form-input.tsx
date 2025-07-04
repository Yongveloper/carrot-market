import { InputHTMLAttributes } from 'react';

interface IFormInputProps {
  type: InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder: string;
  required: boolean;
  errors: string[];
  name: string;
}

export default function FormInput({
  type,
  placeholder,
  required,
  errors,
  name,
}: IFormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="h-10 w-full rounded-md border-none bg-transparent px-4 ring-2 ring-neutral-200 placeholder:text-neutral-400 focus:ring-4 focus:ring-orange-500 focus:outline-none"
        type={type}
        placeholder={placeholder}
        required={required}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500">
          {error}
        </span>
      ))}
    </div>
  );
}
