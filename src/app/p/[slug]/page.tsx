import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import PosterPreview from '@/components/PosterPreview';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getProfile(slug: string) {
  return prisma.profile.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) return {};
  return {
    title: `${profile.businessName} — ${profile.lipaLabel}`,
    description: `Pay ${profile.businessName} via ${profile.lipaLabel} ${profile.lipaNumber}`,
    openGraph: {
      images: [`/api/poster/${profile.slug}/image`],
    },
  };
}

export default async function PublicPosterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 py-10">
      <PosterPreview
        data={{
          businessName: profile.businessName,
          tagline: profile.tagline,
          lipaNumber: profile.lipaNumber,
          lipaLabel: profile.lipaLabel,
          repairNumber: profile.repairNumber,
          agentCode: profile.agentCode,
          accentColor: profile.accentColor,
        }}
      />

      <div className="flex gap-3 w-full max-w-sm">
        <a
          href={`/api/poster/${profile.slug}/pdf`}
          className="flex-1 text-center rounded-lg bg-[#f5c518] text-black font-display font-bold py-3"
        >
          Download PDF
        </a>
        <a
          href={`/api/poster/${profile.slug}/image`}
          download
          className="flex-1 text-center rounded-lg border border-white/20 font-display font-bold py-3"
        >
          Download Image
        </a>
      </div>

      <p className="text-xs text-white/30 text-center max-w-xs">
        The PDF contains real, selectable text — the {profile.lipaLabel.toLowerCase()} can be copied directly.
      </p>
    </main>
  );
}
