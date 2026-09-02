import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  subscribeToRoom,
  joinRoom,
  leaveRoom,
  castVote,
  setRevealed,
  resetRound,
  setTopic,
  roomExists,
} from '../lib/room'
import { getParticipantId, getStoredName, setStoredName } from '../lib/identity'
import { FIBONACCI_DECK, average } from '../lib/deck'
import { firebaseConfigured } from '../lib/firebase'
import Card from '../components/Card'
import ParticipantsBoard from '../components/ParticipantsBoard'

export default function Room() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const participantId = getParticipantId()
  const [name, setName] = useState(getStoredName())
  const [joined, setJoined] = useState(Boolean(getStoredName()))
  const [room, setRoom] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [topicDraft, setTopicDraft] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!firebaseConfigured) return
    let cancelled = false
    roomExists(roomId).then((exists) => {
      if (!cancelled && !exists) setNotFound(true)
    })
    return () => {
      cancelled = true
    }
  }, [roomId])

  useEffect(() => {
    if (!firebaseConfigured || !joined) return undefined
    joinRoom(roomId, participantId, name)
    const unsubscribe = subscribeToRoom(roomId, setRoom)
    return () => {
      unsubscribe()
      leaveRoom(roomId, participantId)
    }
  }, [roomId, participantId, joined, name])

  const handleJoin = useCallback(
    (e) => {
      e.preventDefault()
      if (!name.trim()) return
      setStoredName(name.trim())
      setName(name.trim())
      setJoined(true)
    },
    [name],
  )

  if (!firebaseConfigured) {
    return (
      <div className="room">
        <p className="warning">
          Firebase isn't configured. Copy <code>.env.example</code> to{' '}
          <code>.env</code> and fill in your Firebase project's credentials,
          then restart the dev server.
        </p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="room">
        <p className="error">Room "{roomId}" doesn't exist.</p>
        <button type="button" onClick={() => navigate('/')}>
          Back home
        </button>
      </div>
    )
  }

  if (!joined) {
    return (
      <div className="room">
        <h1>Join room {roomId}</h1>
        <form onSubmit={handleJoin} className="home-card">
          <label className="field">
            <span>Your name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sam"
              maxLength={40}
              autoFocus
            />
          </label>
          <button type="submit">Join</button>
        </form>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="room">
        <p>Loading room…</p>
      </div>
    )
  }

  const participants = room.participants || {}
  const self = participants[participantId]
  const myVote = self ? self.vote : null
  const revealed = Boolean(room.revealed)
  const avg = average(participants)
  const votedCount = Object.values(participants).filter((p) => p.vote != null).length

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="room">
      <header className="room-header">
        <div>
          <h1>Room {roomId}</h1>
          <p className="subtitle">
            {votedCount}/{Object.keys(participants).length} voted
          </p>
        </div>
        <button type="button" onClick={handleCopyLink}>
          {copied ? 'Link copied!' : 'Copy invite link'}
        </button>
      </header>

      <form
        className="topic-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (topicDraft.trim()) setTopic(roomId, topicDraft.trim())
        }}
      >
        <input
          value={topicDraft || room.topic || ''}
          onChange={(e) => setTopicDraft(e.target.value)}
          placeholder="What are we estimating? (optional)"
        />
        <button type="submit">Set topic</button>
      </form>

      <ParticipantsBoard participants={participants} revealed={revealed} selfId={participantId} />

      {revealed && (
        <div className="result">
          {avg != null ? <p>Average: {avg.toFixed(1)}</p> : <p>No numeric votes yet.</p>}
        </div>
      )}

      <div className="deck">
        {FIBONACCI_DECK.map((value) => (
          <Card
            key={value}
            value={value}
            selected={myVote === value}
            disabled={revealed}
            onClick={() => castVote(roomId, participantId, value)}
          />
        ))}
      </div>

      <div className="controls">
        {revealed ? (
          <button type="button" onClick={() => resetRound(roomId)}>
            New round
          </button>
        ) : (
          <button type="button" onClick={() => setRevealed(roomId, true)}>
            Reveal votes
          </button>
        )}
      </div>
    </div>
  )
}
