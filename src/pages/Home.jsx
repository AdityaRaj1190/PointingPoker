import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom, roomExists } from '../lib/room'
import { generateRoomId, getStoredName, setStoredName } from '../lib/identity'
import { firebaseConfigured } from '../lib/firebase'

export default function Home() {
  const navigate = useNavigate()
  const [name, setName] = useState(getStoredName())
  const [joinCode, setJoinCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateRoom(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Enter your name first.')
    setBusy(true)
    setError('')
    try {
      setStoredName(name.trim())
      let roomId = generateRoomId()
      while (await roomExists(roomId)) {
        roomId = generateRoomId()
      }
      await createRoom(roomId, '')
      navigate(`/room/${roomId}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  async function handleJoinRoom(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Enter your name first.')
    const code = joinCode.trim().toUpperCase()
    if (!code) return setError('Enter a room code.')
    setBusy(true)
    setError('')
    try {
      setStoredName(name.trim())
      if (!(await roomExists(code))) {
        setError('No room found with that code.')
        setBusy(false)
        return
      }
      navigate(`/room/${code}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="home">
      <h1>Pointer Poker</h1>
      <p className="subtitle">Real-time planning poker for scrum teams.</p>

      {!firebaseConfigured && (
        <p className="warning">
          Firebase isn't configured yet. Copy <code>.env.example</code> to{' '}
          <code>.env</code> and fill in your Firebase project's credentials.
        </p>
      )}

      <label className="field">
        <span>Your name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sam"
          maxLength={40}
        />
      </label>

      <div className="home-actions">
        <form onSubmit={handleCreateRoom} className="home-card">
          <h2>Start a new session</h2>
          <p>Create a room and share the link with your team.</p>
          <button type="submit" disabled={busy}>
            Create room
          </button>
        </form>

        <form onSubmit={handleJoinRoom} className="home-card">
          <h2>Join a session</h2>
          <label className="field">
            <span>Room code</span>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="e.g. AB12CD"
              maxLength={6}
            />
          </label>
          <button type="submit" disabled={busy}>
            Join room
          </button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  )
}
