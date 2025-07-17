import { useEffect } from "react"

export const useInitializeTheme = () => {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.setAttribute("data-theme", storedTheme)
  }, [])
}
