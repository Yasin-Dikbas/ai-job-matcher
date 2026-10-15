import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(email, password, role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Kayıt başarısız oldu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <span className="auth-badge">
          <Sparkles />
          AI destekli iş eşleştirme platformu
        </span>
        <h2>Hesap oluştur</h2>
        <p className="muted small">İlan açıp aday ara, ya da özgeçmişini yükleyip sana uygun ilanları gör.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Hesap türü</label>
            <div className="role-toggle">
              <button
                type="button"
                className={`btn ${role === 'candidate' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setRole('candidate')}
              >
                Aday
              </button>
              <button
                type="button"
                className={`btn ${role === 'employer' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setRole('employer')}
              >
                İşveren
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt ol'}
          </button>
        </form>

        <p className="muted small" style={{ marginTop: 16 }}>
          Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
        </p>
      </div>
    </div>
  )
}
