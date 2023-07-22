import Link from "next/link"
import { Routes } from "@blitzjs/next"
import React from "react"

const MainNavbar = () => {
  let tabs = [
    {
      name: "Projects",
      href: Routes.ProjectsPage(),
    },
    {
      name: "Profile",
      href: Routes.ProfilePage(),
    },
  ]

  const [theme, setTheme] = React.useState("light")
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }
  React.useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme)
  }, [theme])

  return (
    <div className="sticky top-0">
      <nav className="flex space-x-8" aria-label="Tabs">
        <label className="swap swap-rotate">
          <input onClick={toggleTheme} type="checkbox" />
          <div className="swap-on">Dark</div>
          <div className="swap-off">Light</div>
        </label>
        {tabs.map((tab) => (
          <Link key={tab.name} href={tab.href}>
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default MainNavbar
