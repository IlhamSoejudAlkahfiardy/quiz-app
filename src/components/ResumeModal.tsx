import { btnOutline, btnPrimary, cardBase } from '../styles/classes'
import { cn } from '../lib/cn'

interface ResumeModalProps {
  onResume: () => void
  onDiscard: () => void
}

export function ResumeModal({ onResume, onDiscard }: ResumeModalProps) {
  return (
    <div
      className="fixed inset-0 zoom-100 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className={cn(cardBase, 'w-full max-w-[440px] p-6')}>
        <h2 className="mb-3 text-xl font-bold">Kuis Belum Selesai</h2>
        <p className="mb-5 leading-relaxed">
          Kami menemukan kuis yang belum tuntas. Ingin melanjutkan dari posisi
          terakhir dengan sisa waktu yang tersisa?
        </p>
        <div className="flex flex-col gap-3 min-[480px]:flex-row">
          <button
            type="button"
            className={cn(btnPrimary, 'min-[480px]:flex-1')}
            onClick={onResume}
          >
            Lanjutkan Kuis
          </button>
          <button
            type="button"
            className={cn(btnOutline, 'min-[480px]:flex-1')}
            onClick={onDiscard}
          >
            Mulai Baru
          </button>
        </div>
      </div>
    </div>
  )
}
