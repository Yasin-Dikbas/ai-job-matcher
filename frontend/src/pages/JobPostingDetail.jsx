import { ArrowLeft, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import client from '../api/client'
import MatchRow from '../components/MatchRow'
import StatusBadge from '../components/StatusBadge'

export default function JobPostingDetail() {
  const { id } = useParams()
  const [jobPosting, setJobPosting] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      client.get(`/api/job_postings/${id}`),
      client.get(`/api/job_postings/${id}/matches`),
    ])
      .then(([jpRes, matchesRes]) => {
        setJobPosting(jpRes.data)
        setMatches(matchesRes.data)
      })
      .finally(() => setLoading(false))
  }, [id])

  function handleExplained(updatedMatch) {
    setMatches((prev) => prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)))
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-row">
          <div className="spinner" />
          Yükleniyor...
        </div>
      </div>
    )
  }

  if (!jobPosting) {
    return (
      <div className="page">
        <p>İlan bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        <ArrowLeft />
        İlanlara dön
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1 style={{ marginBottom: 0 }}>{jobPosting.title}</h1>
        <StatusBadge status={jobPosting.status} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="detail-field">
          <span className="detail-field-label">Açıklama</span>
        </div>
        <p className="small" style={{ whiteSpace: 'pre-wrap' }}>{jobPosting.description}</p>
        {jobPosting.requirements && (
          <>
            <div className="detail-field">
              <span className="detail-field-label">Aranan nitelikler</span>
            </div>
            <p className="small" style={{ whiteSpace: 'pre-wrap' }}>{jobPosting.requirements}</p>
          </>
        )}
      </div>

      <h2>Eşleşen adaylar</h2>
      {matches.length === 0 ? (
        <div className="empty-state">
          <Sparkles />
          <strong>Henüz eşleşme yok</strong>
          <span className="small">İlan embedding işleminden geçtiğinde uygun adaylar burada görünecek.</span>
        </div>
      ) : (
        <ul className="match-list">
          {matches.map((match) => (
            <MatchRow key={match.id} match={match} onExplained={handleExplained} />
          ))}
        </ul>
      )}
    </div>
  )
}
