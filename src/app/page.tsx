import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-4xl">⚡</div>
      <h1 className="font-display text-3xl font-extrabold">Lipa Poster Studio</h1>
      <p className="text-white/60 max-w-sm">
        Create modern, shareable payment posters — with a Lipa number your customers can
        actually copy.
      </p>
      <Link
        href="/admin"
        className="mt-2 rounded-lg bg-[#f5c518] px-6 py-3 font-display font-bold text-black"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
