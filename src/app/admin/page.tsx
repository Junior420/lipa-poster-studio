import Link from 'next/link';
import { prisma } from '@/lib/db';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const profiles = await prisma.profile.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-extrabold">Your Posters</h1>
        <LogoutButton />
      </div>

      <Link
        href="/admin/new"
        className="block text-center rounded-xl bg-[#f5c518] text-black font-display font-bold py-3 mb-8"
      >
        + New Poster
      </Link>

      {profiles.length === 0 && (
        <p className="text-white/50 text-center">No posters yet. Create your first one.</p>
      )}

      <div className="flex flex-col gap-3">
        {profiles.map((p) => (
          <Link
            key={p.id}
            href={`/admin/${p.id}/edit`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#141418] p-4 hover:border-white/30 transition-colors"
          >
            <div>
              <div className="font-display font-bold">{p.businessName}</div>
              <div className="text-sm text-white/50">{p.lipaLabel}: {p.lipaNumber}</div>
            </div>
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: p.accentColor }}
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
