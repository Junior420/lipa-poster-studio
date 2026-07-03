import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import React from 'react';

export const runtime = 'nodejs';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0a0a0c',
    color: '#f6f6f7',
    padding: 48,
    fontFamily: 'Helvetica',
  },
  tagline: { fontSize: 10, letterSpacing: 2, color: '#9a9aa2', textTransform: 'uppercase' },
  business: { fontSize: 26, fontFamily: 'Helvetica-Bold', marginTop: 8 },
  spacer: { flexGrow: 1 },
  card: {
    borderWidth: 1,
    borderColor: '#f5c51888',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardLabel: { fontSize: 9, letterSpacing: 2, color: '#9a9aa2', textTransform: 'uppercase', marginBottom: 6 },
  number: { fontSize: 34, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 12 },
  smallBox: { flex: 1, backgroundColor: '#ffffff0d', borderRadius: 8, padding: 12 },
  smallLabel: { fontSize: 8, letterSpacing: 1.5, color: '#9a9aa2', textTransform: 'uppercase', marginBottom: 4 },
  smallValue: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
  footer: { fontSize: 8, letterSpacing: 3, color: '#666', textTransform: 'uppercase', textAlign: 'center', marginTop: 24 },
});

function PosterDocument({
  businessName,
  tagline,
  lipaLabel,
  lipaNumber,
  repairNumber,
  agentCode,
  accentColor,
}: {
  businessName: string;
  tagline?: string | null;
  lipaLabel: string;
  lipaNumber: string;
  repairNumber?: string | null;
  agentCode?: string | null;
  accentColor: string;
}) {
  return (
    <Document title={`${businessName} — ${lipaLabel}`}>
      <Page size={[432, 540]} style={styles.page}>
        <Text style={styles.tagline}>{tagline || 'Scan · Pay · Done'}</Text>
        {/* All Text elements below render as real, selectable/copyable PDF text — not a rasterized image */}
        <Text style={styles.business}>{businessName}</Text>

        <View style={styles.spacer} />

        <View style={[styles.card, { borderColor: `${accentColor}88` }]}>
          <Text style={styles.cardLabel}>{lipaLabel}</Text>
          <Text style={[styles.number, { color: accentColor }]}>{lipaNumber}</Text>
        </View>

        {(repairNumber || agentCode) && (
          <View style={styles.row}>
            {repairNumber && (
              <View style={styles.smallBox}>
                <Text style={styles.smallLabel}>Repair No.</Text>
                <Text style={styles.smallValue}>{repairNumber}</Text>
              </View>
            )}
            {agentCode && (
              <View style={styles.smallBox}>
                <Text style={styles.smallLabel}>Agent Code</Text>
                <Text style={styles.smallValue}>{agentCode}</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.footer}>Powered by Lipa Poster Studio</Text>
      </Page>
    </Document>
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await prisma.profile.findUnique({ where: { slug } });
  if (!profile) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const buffer = await renderToBuffer(
    <PosterDocument
      businessName={profile.businessName}
      tagline={profile.tagline}
      lipaLabel={profile.lipaLabel}
      lipaNumber={profile.lipaNumber}
      repairNumber={profile.repairNumber}
      agentCode={profile.agentCode}
      accentColor={profile.accentColor}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${profile.slug}.pdf"`,
    },
  });
}
