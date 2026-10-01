function randomId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function getParticipantId() {
  let id = localStorage.getItem('pp_participant_id')
  if (!id) {
    id = randomId()
    localStorage.setItem('pp_participant_id', id)
  }
  return id
}

export function getStoredName() {
  return localStorage.getItem('pp_name') || ''
}

export function setStoredName(name) {
  localStorage.setItem('pp_name', name)
}

export function generateRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = ''
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}
