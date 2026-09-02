import {
  ref,
  set,
  update,
  onValue,
  onDisconnect,
  serverTimestamp,
  get,
} from 'firebase/database'
import { db } from './firebase'

export async function roomExists(roomId) {
  const snap = await get(ref(db, `rooms/${roomId}`))
  return snap.exists()
}

export async function createRoom(roomId, topic) {
  await set(ref(db, `rooms/${roomId}`), {
    topic: topic || '',
    revealed: false,
    createdAt: serverTimestamp(),
    participants: {},
  })
}

export function joinRoom(roomId, participantId, name) {
  const participantRef = ref(db, `rooms/${roomId}/participants/${participantId}`)
  set(participantRef, {
    name,
    vote: null,
    joinedAt: serverTimestamp(),
  })
  onDisconnect(participantRef).remove()
}

export function leaveRoom(roomId, participantId) {
  set(ref(db, `rooms/${roomId}/participants/${participantId}`), null)
}

export function subscribeToRoom(roomId, callback) {
  const roomRef = ref(db, `rooms/${roomId}`)
  return onValue(roomRef, (snapshot) => {
    callback(snapshot.val())
  })
}

export function castVote(roomId, participantId, value) {
  return update(ref(db, `rooms/${roomId}/participants/${participantId}`), {
    vote: value,
  })
}

export function setRevealed(roomId, revealed) {
  return update(ref(db, `rooms/${roomId}`), { revealed })
}

export async function resetRound(roomId) {
  const snap = await get(ref(db, `rooms/${roomId}/participants`))
  const participants = snap.val() || {}
  const updates = { revealed: false }
  for (const id of Object.keys(participants)) {
    updates[`participants/${id}/vote`] = null
  }
  await update(ref(db, `rooms/${roomId}`), updates)
}

export function setTopic(roomId, topic) {
  return update(ref(db, `rooms/${roomId}`), { topic })
}
