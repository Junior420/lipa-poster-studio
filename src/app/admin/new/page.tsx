import ProfileForm from '@/components/ProfileForm';

export default function NewProfilePage() {
  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-extrabold mb-8">New Poster</h1>
      <ProfileForm />
    </main>
  );
}
