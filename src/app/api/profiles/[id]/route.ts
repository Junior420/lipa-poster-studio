import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const profile = await prisma.profile.update({
    where: { id },
    data: {
      businessName: body.businessName,
      tagline: body.tagline || null,
      lipaNumber: body.lipaNumber,
      lipaLabel: body.lipaLabel || 'Lipa Number',
      repairNumber: body.repairNumber || null,
      agentCode: body.agentCode || null,
      accentColor: body.accentColor || '#f5c518',
    },
  });

  return NextResponse.json(profile);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.profile.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
