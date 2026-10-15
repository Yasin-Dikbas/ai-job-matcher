import { Briefcase } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import client from '../api/client'
import JobPostingForm from '../components/JobPostingForm'
import JobPostingRow from '../components/JobPostingRow'

export default function EmployerDashboard() {
  const [jobPostings, setJobPostings] = useState([])
  const [loading, setLoading] = useState(true)
  const pollRef = useRef(null)

  const load = useCallback(async () => {
    const res = await client.get('/api/job_postings')
    setJobPostings(res.data)
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  useEffect(() => {
    const hasPending = jobPostings.some((jp) => jp.embedding_status === 'pending' || jp.embedding_status === 'processing')
    if (!hasPending) {
      clearInterval(pollRef.current)
      return
    }

    pollRef.current = setInterval(load, 3000)
    return () => clearInterval(pollRef.current)
  }, [jobPostings, load])

  function handleCreated(jobPosting) {
    setJobPostings((prev) => [jobPosting, ...prev])
  }

  function handleDeleted(id) {
    setJobPostings((prev) => prev.filter((jp) => jp.id !== id))
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
      <h1>İlanlarım</h1>
      <p className="muted">İlan aç, adayları embedding tabanlı benzerlik skoruna göre sırala.</p>

      <h2>Yeni ilan</h2>
      <JobPostingForm onCreated={handleCreated} />

      <h2>İlanlar</h2>
      {jobPostings.length === 0 ? (
        <div className="empty-state">
          <Briefcase />
          <strong>Henüz ilan yok</strong>
          <span className="small">Yukarıdan bir ilan oluşturarak başla.</span>
        </div>
      ) : (
        <ul className="receipt-list">
          {jobPostings.map((jp) => (
            <JobPostingRow key={jp.id} jobPosting={jp} onDeleted={handleDeleted} />
          ))}
        </ul>
      )}
    </div>
  )
}
