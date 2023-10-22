export function getInitials(...names) {
  const initials = names.filter((name) => name && name.trim() !== "").map((name) => name[0])
  return initials.length > 0 ? initials.join("") : null
}
