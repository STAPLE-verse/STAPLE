import { useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import updateTheme from "src/users/mutations/updateTheme"
import { THEMES } from "src/core/utils/themes"

const ThemeSelect = () => {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("theme") || "light")

  const [updateThemeMutation] = useMutation(updateTheme)

  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value
    // apply right away, then save it to the account so it follows the user to other devices
    localStorage.setItem("theme", selectedTheme)
    setTheme(selectedTheme)
    document.documentElement.setAttribute("data-theme", selectedTheme)
    try {
      await updateThemeMutation({ theme: selectedTheme })
    } catch (error) {
      toast.error("Your theme was applied but could not be saved to your account.")
    }
  }

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
