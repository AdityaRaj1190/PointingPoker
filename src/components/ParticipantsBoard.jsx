export default function ParticipantsBoard({ participants, revealed, selfId }) {
  const entries = Object.entries(participants)

  if (entries.length === 0) {
    return <p className="empty">Waiting for people to join…</p>
  }

  return (
    <ul className="board">
      {entries.map(([id, p]) => {
        const hasVoted = p.vote != null
        const displayName = p.name?.trim() || 'Anonymous'
        return (
          <li key={id} className={`board-seat${id === selfId ? ' self' : ''}`}>
            <div className={`board-card${hasVoted ? ' voted' : ''}`}>
              {revealed ? (hasVoted ? p.vote : '—') : hasVoted ? '✓' : ''}
            </div>
            <span className="board-name">
              {displayName}
              {id === selfId ? ' (you)' : ''}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
