export default function ParticipantsBoard({
  participants,
  revealed,
  selfId,
  moderatorId,
  canAssignModerator,
  onSelectModerator,
}) {
  const entries = Object.entries(participants)

  if (entries.length === 0) {
    return <p className="empty">Waiting for people to join…</p>
  }

  return (
    <ul className="board">
      {entries.map(([id, p]) => {
        const hasVoted = p.vote != null
        const isModerator = id === moderatorId
        const seat = (
          <>
            <div className={`board-card${hasVoted ? ' voted' : ''}`}>
              {revealed ? (hasVoted ? p.vote : '—') : hasVoted ? '✓' : ''}
            </div>
            <span className="board-name">
              {isModerator ? '👑 ' : ''}
              {p.name}
              {id === selfId ? ' (you)' : ''}
            </span>
          </>
        )
        return (
          <li key={id} className={`board-seat${id === selfId ? ' self' : ''}`}>
            {canAssignModerator ? (
              <button
                type="button"
                className={`board-seat-button${isModerator ? ' is-moderator' : ''}`}
                onClick={() => onSelectModerator(id)}
                title={isModerator ? `${p.name} can reveal votes` : `Make ${p.name} the moderator`}
              >
                {seat}
              </button>
            ) : (
              seat
            )}
          </li>
        )
      })}
    </ul>
  )
}
