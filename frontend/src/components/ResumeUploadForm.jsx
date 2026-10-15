import { FileText, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'
import client from '../api/client'

export default function ResumeUploadForm({ onUploaded }) {
  const inputRef = useRef(null)
  const [mode, setMode] = useState('file')
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  function pickFile(selected) {
    if (!selected) return
    setFile(selected)
    setError(null)
  }

  async function handleUpload() {
    setUploading(true)
    setError(null)

    const formData = new FormData()
    if (mode === 'file') {
      if (!file) {
        setUploading(false)
        return
      }
      formData.append('file', file)
    } else {
      if (!text.trim()) {
        setUploading(false)
        return
      }
      formData.append('source_text', text)
    }

    try {
      const res = await client.post('/api/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onUploaded(res.data)
      setFile(null)
      setText('')
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Özgeçmiş yüklenirken bir hata oluştu.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Özgeçmiş yükle</h2>

      <div className="role-toggle" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={`btn btn-small ${mode === 'file' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setMode('file')}
        >
          Dosya yükle
        </button>
        <button
          type="button"
          className={`btn btn-small ${mode === 'text' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setMode('text')}
        >
          Metin yapıştır
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {mode === 'file' ? (
        <>
          <div
            className={`upload-drop${dragging ? ' is-dragging' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              pickFile(e.dataTransfer.files[0])
            }}
          >
            <UploadCloud />
            <p className="muted small" style={{ margin: 0 }}>
              PDF, Markdown ya da metin dosyanı buraya sürükle ya da tıklayıp seç
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.md,.txt,application/pdf,text/markdown,text/plain"
              onChange={(e) => pickFile(e.target.files[0])}
            />
          </div>

          {file && (
            <div className="upload-preview">
              <FileText style={{ width: 24, height: 24, color: 'var(--accent-1)' }} />
              <div style={{ flex: 1 }}>
                <p className="small" style={{ margin: 0 }}>{file.name}</p>
              </div>
              <button className="btn btn-primary btn-small" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Yükleniyor...' : 'Yükle'}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="field">
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Özgeçmiş metnini buraya yapıştır..."
            />
          </div>
          <button className="btn btn-primary btn-block" onClick={handleUpload} disabled={uploading || !text.trim()}>
            {uploading ? 'Yükleniyor...' : 'Yükle'}
          </button>
        </>
      )}
    </div>
  )
}
