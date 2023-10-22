import Link from "next/link"
import { Routes } from "@blitzjs/next"
import React from "react"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

// MainNavbar
// Always present on the top of the page
// Includes non-project specific functionalities
const MainNavbar = () => {
  // Get current user data
  const currentUser = useCurrentUser()
  // Get initials for avatar
  function getInitials(...names) {
    const initials = names.filter((name) => name && name.trim() !== "").map((name) => name[0])
    return initials.length > 0 ? initials.join("") : null
  }
  const initial = getInitials(currentUser!.firstName, currentUser!.lastName)
  // Defining tabs
  // with names and routes
  let tabs = [
    {
      name: "Projects",
      href: Routes.ProjectsPage(),
    },
  ]

  // Logout
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  // Adding theme switch logic
  const [theme, setTheme] = React.useState("light")
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }
  React.useEffect(() => {
    const htmlElement = document.querySelector("html")
    if (htmlElement) {
      htmlElement.setAttribute("data-theme", theme)
    }
  }, [theme])

  return (
    // Navbar component
    <div className="navbar bg-base-100 sticky top-0 border-b border-gray-300 sm:px-4 md:px-6 lg:px-8 xl:px-10">
      {/* Tabs */}
      {/* On the left */}
      <div className="flex-1">
        <h2>STAPLE</h2>
      </div>
      {/* On the rigth */}
      <div className="flex space-x-5">
        {/* Templated tabs tab */}
        <ul className="menu menu-horizontal menu-lg">
          {tabs.map((tab) => (
            <li key={tab.name}>
              <Link href={tab.href}>{tab.name}</Link>
            </li>
          ))}
        </ul>
        {/* Notifications tab */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Number of notifs */}
              <span className="badge badge-sm indicator-item">8</span>
            </div>
          </label>
          {/* Notification card */}
          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            {/* TODO: Change to notifs */}
            <div className="card-body">
              <span className="font-bold text-lg">8 Notifications</span>
              <span className="text-info">One new contributor</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View notifications</button>
              </div>
            </div>
          </div>
        </div>
        {/* Profile tab */}
        <div className="dropdown dropdown-end">
          {/* TODO: Change to avatar if image is uploaded */}
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
            <div className="w-10 rounded-full">
              <span className="text-1xl">{initial ? initial : "?"}</span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link className="justify-between" key="Profile" href={Routes.ProfilePage()}>
                Profile
                {/* <span className="badge">New</span> */}
              </Link>
            </li>
            <li>
              <button
                onClick={async () => {
                  await logoutMutation()
                  await router.push(Routes.Home())
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
        {/* Light switch tab*/}
        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" onClick={toggleTheme} title="Lightswitch" />
          {/* sun icon */}
          <svg
            className="swap-on fill-current w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          {/* moon icon */}
          <svg
            className="swap-off fill-current w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>
    </div>
  )
}

export default MainNavbar
