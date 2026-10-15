export default function ScoreBar({ score }) {
  const percent = Math.round(Math.max(0, Math.min(1, score)) * 100)

  return (
    <div className="score-bar">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="score-bar-value">%{percent}</span>
    </div>
  )
}
