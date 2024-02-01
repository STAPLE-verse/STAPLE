import Link from "next/link"
import { Routes } from "@blitzjs/next"
import React, { Suspense, startTransition } from "react"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { getInitials } from "src/services/getInitials"
import { BellIcon, HomeIcon } from "@heroicons/react/24/outline"

// MainNavbar
// Always present on the top of the page
// Includes non-project specific functionalities
const Navbar = () => {
  // Get current user data
  const currentUser = useCurrentUser()
  // Get initials for avatar
  const initial = getInitials(currentUser!.firstName, currentUser!.lastName)
  // Defining tabs
  // with names and routes
  // let tabs = []

  // Logout
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  // Adding theme switch logic
  const [theme, setTheme] = React.useState("light")
  const changeTheme = (e) => {
    setTheme(theme === e.target.theme)
  }

  React.useEffect(() => {
    const htmlElement = document.querySelector("html")
    if (htmlElement) {
      htmlElement.setAttribute("data-theme", theme)
    }
  }, [theme])

  return (
    <div className="flex-0 navbar bg-base-100 sticky top-0 border-b border-gray-300 sm:px-4 md:px-6 lg:px-8 xl:px-10">
      {/* Tabs */}
      {/* On the left */}
      <div className="flex-1">
        <h2>STAPLE</h2>
      </div>
      {/* On the right */}
      <div className="flex space-x-5">
        {/* Templated tabs tab */}
        {/* <ul className="menu menu-horizontal menu-lg">
          {tabs.map((tab) => (
            <li key={tab.name}>
              <Link href={tab.href}>{tab.name}</Link>
            </li>
          ))}
        </ul> */}
        {/* Home tab */}
        <label
          tabIndex={0}
          className="btn btn-ghost btn-circle"
          onClick={() => router.push(Routes.ProjectsPage())}
        >
          <div className="indicator">
            {/* Icon */}
            <HomeIcon className="w-5 h-5" />
          </div>
        </label>
        {/* Notifications tab */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              {/* Icon */}
              <BellIcon className="w-5 h-5" />
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
            <div
              // TODO: DaisyUI tooltip is not working because css cannot deal with element edge
              // https://github.com/saadeghi/daisyui/discussions/1695
              className="w-10 rounded-full tooltip"
              data-tip={initial ? "" : "Go to Profile to add your name."}
            >
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

        <select id="dropdown" onChange={changeTheme} title="ChangeTheme" value={theme}>
          <option value="">Theme</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="retro">Retro</option>
          <option value="dracula">Dracula</option>
          <option value="cyberpunk">Cyberpunk</option>
        </select>
      </div>
    </div>
  )
}

// TODO: had to add suspense for now because getcurrentuser is async but this is causeing flickering
// TODO: might have to add a general loading screens so that we wait for the body and the navbar to load together
const MainNavbar = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
    </Suspense>
  )
}

export default MainNavbar
