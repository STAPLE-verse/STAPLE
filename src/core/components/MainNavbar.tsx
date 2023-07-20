import Link from "next/link"
import { Routes } from "@blitzjs/next"

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

  return (
    <div className="sticky top-0">
      <nav className="flex space-x-8" aria-label="Tabs">
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
