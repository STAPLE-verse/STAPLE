import { useState, useEffect } from "react"

const THEMES = [
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

const ThemeSelect = () => {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("theme") || "light")

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value
    localStorage.setItem("theme", selectedTheme)
    setTheme(selectedTheme)
    document.documentElement.setAttribute("data-theme", selectedTheme)
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <>
      <label>Select Theme: </label>
      <select
        value={theme}
        onChange={handleThemeChange}
        className="select text-primary select-bordered border-primary border-2 w-1/2 mb-4 w-1/2"
        title="Change Theme"
      >
        <option value="" disabled>
          Select Theme
        </option>
        {THEMES.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </>
  )
}

export default ThemeSelect
