import { useEffect } from "react"
import { isKnownTheme } from "src/core/utils/themes"

// Applies the theme on load. The browser's copy is used straight away (no flash); once the
// signed-in user's saved theme is known it wins, and the browser copy is updated to match.
export const useInitializeTheme = (savedTheme?: string) => {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.setAttribute("data-theme", storedTheme)
  }, [])

  useEffect(() => {
    if (!isKnownTheme(savedTheme)) return
    localStorage.setItem("theme", savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [savedTheme])
}
