import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { prisma } from '@/lib/db';

// Node runtime (not Edge) — Prisma's standard client needs Node APIs.
export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await prisma.profile.findUnique({ where: { slug } });
  if (!profile) {
    return new Response('Not found', { status: 404 });
  }

  const { businessName, tagline, lipaLabel, lipaNumber, repairNumber, agentCode, accentColor } = profile;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: `radial-gradient(circle at 30% 0%, ${accentColor}33, #0a0a0c 55%)`,
          color: '#f6f6f7',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: '#9a9aa2', textTransform: 'uppercase' }}>
            {tagline || 'Scan · Pay · Done'}
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, marginTop: 16 }}>{businessName}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: `2px solid ${accentColor}88`,
              borderRadius: 28,
              padding: 40,
              background: `${accentColor}18`,
            }}
          >
            <div style={{ fontSize: 20, letterSpacing: 4, color: '#9a9aa2', textTransform: 'uppercase' }}>
              {lipaLabel}
            </div>
            <div style={{ fontSize: 72, fontWeight: 800, color: accentColor, letterSpacing: 2 }}>
              {lipaNumber}
            </div>
          </div>

          {(repairNumber || agentCode) && (
            <div style={{ display: 'flex', gap: 24 }}>
              {repairNumber && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    background: '#ffffff14',
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <div style={{ fontSize: 16, letterSpacing: 3, color: '#9a9aa2', textTransform: 'uppercase' }}>
                    Repair No.
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>{repairNumber}</div>
                </div>
              )}
              {agentCode && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    background: '#ffffff14',
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <div style={{ fontSize: 16, letterSpacing: 3, color: '#9a9aa2', textTransform: 'uppercase' }}>
                    Agent Code
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>{agentCode}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 14,
            letterSpacing: 6,
            color: '#666',
            textTransform: 'uppercase',
          }}
        >
          Powered by Lipa Poster Studio
        </div>
      </div>
    ),
    { width: 1080, height: 1350 }
  );
}
