import { Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import client from '../api/client'
import MatchRow from '../components/MatchRow'
import ResumeUploadForm from '../components/ResumeUploadForm'
import StatusBadge from '../components/StatusBadge'

export default function CandidateDashboard() {
  const [resume, setResume] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const pollRef = useRef(null)

  const load = useCallback(async () => {
    const [resumeRes, matchesRes] = await Promise.all([
      client.get('/api/resume'),
      client.get('/api/matches'),
    ])
    setResume(resumeRes.data)
    setMatches(matchesRes.data)
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  useEffect(() => {
    const isPending = resume && (resume.status === 'pending' || resume.status === 'processing')
    if (!isPending) {
      clearInterval(pollRef.current)
      return
    }

    pollRef.current = setInterval(load, 3000)
    return () => clearInterval(pollRef.current)
  }, [resume, load])

  function handleUploaded(newResume) {
    setResume(newResume)
    setMatches([])
  }

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

  return (
    <div className="page">
      <h1>Eşleşmelerim</h1>
      <p className="muted">Özgeçmişini yükle, sana en uygun ilanları embedding benzerliğine göre gör.</p>

      {resume && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: 'var(--text-h)' }}>
                {resume.source_type === 'file' ? 'Yüklenen özgeçmiş' : 'Yapıştırılan özgeçmiş metni'}
              </strong>
              {resume.char_count && (
                <p className="muted small" style={{ margin: '4px 0 0' }}>{resume.char_count} karakter</p>
              )}
            </div>
            <StatusBadge status={resume.status} />
          </div>
          {resume.error_message && <div className="form-error" style={{ marginTop: 12 }}>{resume.error_message}</div>}
        </div>
      )}

      <h2>{resume ? 'Özgeçmişi değiştir' : 'Özgeçmiş yükle'}</h2>
      <ResumeUploadForm onUploaded={handleUploaded} />

      <h2>Eşleşen ilanlar</h2>
      {matches.length === 0 ? (
        <div className="empty-state">
          <Sparkles />
          <strong>Henüz eşleşme yok</strong>
          <span className="small">Özgeçmişin işlendikten sonra eşleşen ilanlar burada görünecek.</span>
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
