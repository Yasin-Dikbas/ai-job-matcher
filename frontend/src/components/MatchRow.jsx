import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import client from '../api/client'
import ScoreBar from './ScoreBar'
import StatusBadge from './StatusBadge'

export default function MatchRow({ match, onExplained }) {
  const [explaining, setExplaining] = useState(false)

  async function handleExplain() {
    setExplaining(true)
    try {
      const res = await client.post(`/api/matches/${match.id}/explain`)
      onExplained(res.data)
    } finally {
      setExplaining(false)
    }
  }

  return (
    <li className="match-row">
      <div className="match-row-top">
        <div className="match-row-counterpart">
          {match.counterpart}
          {match.resume_status && <StatusBadge status={match.resume_status} />}
        </div>
        <ScoreBar score={match.score} />
      </div>

      {match.explanation ? (
        <p className="muted small match-explanation">{match.explanation}</p>
      ) : (
        <button className="btn btn-small btn-ghost" onClick={handleExplain} disabled={explaining}>
          <Sparkles className={explaining ? 'spin' : ''} />
          {explaining ? 'Açıklanıyor...' : 'Neden eşleşti?'}
        </button>
      )}
    </li>
  )
}
