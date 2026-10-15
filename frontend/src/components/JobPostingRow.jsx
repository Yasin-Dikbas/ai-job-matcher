import { Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import StatusBadge from './StatusBadge'

export default function JobPostingRow({ jobPosting, onDeleted }) {
  async function handleDelete(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Bu ilan silinsin mi?')) return
    await client.delete(`/api/job_postings/${jobPosting.id}`)
    onDeleted(jobPosting.id)
  }

  return (
    <li>
      <Link to={`/job_postings/${jobPosting.id}`} className="receipt-row">
        <div className="receipt-main">
          <div>
            <div className="receipt-merchant">{jobPosting.title}</div>
            <div className="receipt-meta">
              <Users style={{ width: 12, height: 12, verticalAlign: 'text-bottom', marginRight: 4 }} />
              {jobPosting.matches_count} eşleşme
            </div>
          </div>
        </div>
        <div className="receipt-actions">
          <StatusBadge status={jobPosting.status} />
          <StatusBadge status={jobPosting.embedding_status} />
          <button className="btn btn-small btn-ghost" onClick={handleDelete} aria-label="Sil">
            <Trash2 />
          </button>
        </div>
      </Link>
    </li>
  )
}
