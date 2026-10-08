// The daisyUI themes people can choose from. MARKER offers the same list and shares the
// `User.theme` column, so keep the two in sync.
export const THEMES = [
  { value: "light", label: "☼ Light" },
  { value: "dark", label: "☾ Dark" },
  { value: "retro", label: "🪩 Retro" },
  { value: "dracula", label: "🧛🏽 Dracula" },
  { value: "cyberpunk", label: "🤖 Cyberpunk" },
  { value: "cupcake", label: "🧁 Cupcake" },
  { value: "bumblebee", label: "🐝 Bumblebee" },
  { value: "emerald", label: "💚 Emerald" },
  { value: "corporate", label: "👔 Corporate" },
  { value: "halloween", label: "🎃 Halloween" },
  { value: "garden", label: "🌿 Garden" },
  { value: "forest", label: "🌲 Forest" },
  { value: "aqua", label: "🐠 Aqua" },
  { value: "lofi", label: "😎 Lofi" },
  { value: "pastel", label: "🌸 Pastel" },
  { value: "fantasy", label: "🐉 Fantasy" },
  { value: "wireframe", label: "🖼️ Wireframe" },
  { value: "black", label: "◼️ Black" },
  { value: "luxury", label: "💰 Luxury" },
  { value: "cmyk", label: "🎨 CMYK" },
  { value: "autumn", label: "🍁 Autumn" },
  { value: "business", label: "💼 Business" },
  { value: "acid", label: "🏜️ Acid" },
  { value: "lemonade", label: "🍋 Lemonade" },
  { value: "night", label: "🌃 Night" },
  { value: "coffee", label: "☕ Coffee" },
  { value: "winter", label: "❄️ Winter" },
  { value: "dim", label: "🔅 Dim" },
  { value: "nord", label: "🐺 Nord" },
  { value: "sunset", label: "🌇 Sunset" },
]

export const THEME_VALUES = THEMES.map((theme) => theme.value) as [string, ...string[]]

export const isKnownTheme = (value: unknown): value is string =>
  typeof value === "string" && THEME_VALUES.includes(value)
