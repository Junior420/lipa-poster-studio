import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base || 'poster'}-${nanoid(5)}`;
}

export async function GET() {
  const profiles = await prisma.profile.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(profiles);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.businessName || !body.lipaNumber) {
    return NextResponse.json({ error: 'businessName and lipaNumber are required' }, { status: 400 });
  }

  const profile = await prisma.profile.create({
    data: {
      slug: slugify(body.businessName),
      businessName: body.businessName,
      tagline: body.tagline || null,
      lipaNumber: body.lipaNumber,
      lipaLabel: body.lipaLabel || 'Lipa Number',
      repairNumber: body.repairNumber || null,
      agentCode: body.agentCode || null,
      accentColor: body.accentColor || '#f5c518',
    },
  });

  return NextResponse.json(profile, { status: 201 });
}
