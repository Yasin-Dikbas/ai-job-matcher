import { CheckCircle2, Clock, FileEdit, Loader2, Lock, XCircle } from 'lucide-react'

const CONFIG = {
  draft: { label: 'Taslak', icon: FileEdit, className: 'status-pending' },
  active: { label: 'Aktif', icon: CheckCircle2, className: 'status-completed' },
  closed: { label: 'Kapalı', icon: Lock, className: 'status-pending' },
  pending: { label: 'Bekliyor', icon: Clock, className: 'status-pending' },
  processing: { label: 'İşleniyor', icon: Loader2, className: 'status-processing' },
  completed: { label: 'Tamamlandı', icon: CheckCircle2, className: 'status-completed' },
  failed: { label: 'Başarısız', icon: XCircle, className: 'status-failed' },
}

export default function StatusBadge({ status }) {
  const config = CONFIG[status] || CONFIG.pending
  const Icon = config.icon

  return (
    <span className={`status ${config.className}`}>
      <Icon />
      {config.label}
    </span>
  )
}
