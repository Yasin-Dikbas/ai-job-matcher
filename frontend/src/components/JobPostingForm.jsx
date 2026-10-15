import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import client from '../api/client'

export default function JobPostingForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await client.post('/api/job_postings', { title, description, requirements })
      onCreated(res.data)
      setTitle('')
      setDescription('')
      setRequirements('')
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'İlan oluşturulurken bir hata oluştu.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Yeni ilan</h2>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Pozisyon</label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn. Backend Developer"
          />
        </div>
        <div className="field">
          <label htmlFor="description">İlan açıklaması</label>
          <textarea
            id="description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Rol, sorumluluklar, ekip..."
          />
        </div>
        <div className="field">
          <label htmlFor="requirements">Aranan nitelikler (opsiyonel)</label>
          <textarea
            id="requirements"
            rows={3}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Teknoloji, deneyim, beceriler..."
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          <PlusCircle />
          {submitting ? 'Yayınlanıyor...' : 'İlanı yayınla'}
        </button>
      </form>
    </div>
  )
}
