export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-slate-100 p-5 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100">
      <div className="flex w-full max-w-[640px] flex-col gap-5 rounded-3xl bg-white p-5 shadow-md md:flex-row">
        <input
          className="h-10 w-full rounded-full bg-gray-200 py-3 pl-5 ring ring-transparent transition-shadow outline-none placeholder:drop-shadow focus:ring-orange-500 focus:ring-offset-2"
          type="text"
          placeholder="Search here..."
        />
        <button className="cursor-pointer rounded-full bg-black py-2 font-medium text-white transition-transform outline-none active:scale-90 md:px-10">
          Search
        </button>
      </div>
    </main>
  );
}
