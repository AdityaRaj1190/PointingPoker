export default function ParticipantsBoard({ participants, revealed, selfId }) {
  const entries = Object.entries(participants)

  if (entries.length === 0) {
    return <p className="empty">Waiting for people to join…</p>
  }

  return (
    <ul className="board">
      {entries.map(([id, p]) => {
        const hasVoted = p.vote != null
        return (
          <li key={id} className={`board-seat${id === selfId ? ' self' : ''}`}>
            <div className={`board-card${hasVoted ? ' voted' : ''}`}>
              {revealed ? (hasVoted ? p.vote : '—') : hasVoted ? '✓' : ''}
            </div>
            <span className="board-name">
              {p.name}
              {id === selfId ? ' (you)' : ''}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
