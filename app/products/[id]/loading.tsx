import { PhotoIcon } from '@heroicons/react/20/solid';

export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col gap-5 p-5">
      <div className="flex aspect-square h-1/2 items-center justify-center rounded-md border-4 border-dashed border-neutral-700 text-neutral-700">
        <PhotoIcon className="h-28" />
      </div>
      <div className="flex items-center gap-2">
        <div className="size-14 rounded-full bg-neutral-700" />
        <div className="flex flex-col gap-1">
          <div className="h-5 w-40 rounded-md bg-neutral-700" />
          <div className="h-5 w-28 rounded-md bg-neutral-700" />
        </div>
      </div>
      <div className="h-5 w-80 rounded-md bg-neutral-700" />
    </div>
  );
}
