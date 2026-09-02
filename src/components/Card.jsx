export default function Card({ value, selected, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`card${selected ? ' selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  )
}
