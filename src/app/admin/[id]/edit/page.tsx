import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProfileForm from '@/components/ProfileForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) notFound();

  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-extrabold">Edit Poster</h1>
        <Link href={`/p/${profile.slug}`} target="_blank" className="text-sm text-[#f5c518]">
          View public page →
        </Link>
      </div>
      <ProfileForm
        initial={{
          id: profile.id,
          businessName: profile.businessName,
          tagline: profile.tagline ?? '',
          lipaNumber: profile.lipaNumber,
          lipaLabel: profile.lipaLabel,
          repairNumber: profile.repairNumber ?? '',
          agentCode: profile.agentCode ?? '',
          accentColor: profile.accentColor,
        }}
      />
    </main>
  );
}
