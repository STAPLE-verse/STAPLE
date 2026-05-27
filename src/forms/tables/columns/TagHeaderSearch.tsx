type Props = {
  onChange?: (tag: string) => void
}

export default function TagHeaderSearch({ onChange }: Props) {
  return (
    <input
      type="text"
      className="input input-bordered input-sm w-full text-primary border-primary border-2 bg-primary-content"
      placeholder="Filter by tag"
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}
