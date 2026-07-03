import type { PosterData } from '@/lib/design';
import CopyButton from './CopyButton';

export default function PosterPreview({ data }: { data: PosterData }) {
  return (
    <div
      className="relative w-full max-w-sm mx-auto aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between p-8"
      style={{
        background: `radial-gradient(circle at 30% 0%, ${data.accentColor}22, #0a0a0c 55%)`,
      }}
    >
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-white/40">{data.tagline || 'Scan · Pay · Done'}</div>
        <h2 className="font-display text-2xl font-extrabold mt-2">{data.businessName}</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: `${data.accentColor}55`, background: `${data.accentColor}0f` }}
        >
          <div className="text-xs uppercase tracking-widest text-white/50 mb-1">{data.lipaLabel}</div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-3xl font-extrabold tracking-wide" style={{ color: data.accentColor }}>
              {data.lipaNumber}
            </span>
            <CopyButton value={data.lipaNumber} />
          </div>
        </div>

        {(data.repairNumber || data.agentCode) && (
          <div className="flex gap-3 text-sm">
            {data.repairNumber && (
              <div className="flex-1 rounded-xl bg-white/5 p-3">
                <div className="text-[10px] uppercase tracking-widest text-white/40">Repair No.</div>
                <div className="font-display font-bold">{data.repairNumber}</div>
              </div>
            )}
            {data.agentCode && (
              <div className="flex-1 rounded-xl bg-white/5 p-3">
                <div className="text-[10px] uppercase tracking-widest text-white/40">Agent Code</div>
                <div className="font-display font-bold">{data.agentCode}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 text-center">
        Powered by Lipa Poster Studio
      </div>
    </div>
  );
}
