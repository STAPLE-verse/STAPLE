import Link from "next/link"
import { Routes } from "@blitzjs/next"
import React from "react"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { getInitials } from "src/core/utils/getInitials"
import { HomeIcon } from "@heroicons/react/24/outline"
import NotificationsMenu from "src/notifications/components/NotificationMenu"
import Image from "next/image"
import { Tooltip } from "react-tooltip"

type LogoProps = {
  theme: string
}
const StapleLogo = ({ theme }: LogoProps) => {
  const Themes = [
    "dark",
    "dracula",
    "halloween",
    "forest",
    "luxury",
    "business",
    "night",
    "coffee",
    "dim",
    "sunset",
  ]

  return Themes.includes(theme) ? (
    <Image src="/stapler_white.png" width={25} height={25} alt="Staple Logo" />
  ) : (
    <Image src="/stapler_black.png" width={25} height={25} alt="Staple Logo" />
  )
}

// MainNavbar
// Always present on the top of the page
// Includes non-project specific functionalities
const Navbar = () => {
  // Get current user data
  const currentUser = useCurrentUser()

  // Get initials for avatar
  const initial = currentUser
    ? getInitials(currentUser!.firstName || "", currentUser!.lastName || "")
    : ""

  // Logout
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  // store themes
  const [theme, setTheme] = React.useState(() => {
    const initialTheme = localStorage.getItem("theme")
    return initialTheme ? initialTheme : "light"
  })

  function getThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }

  function toggleTheme(e) {
    localStorage.setItem("theme", e.target.value)
    setTheme(e.target.value)
  }

  React.useEffect(() => {
    getThemeFromLocalStorage()
    const htmlElement = document.querySelector("html")
    if (htmlElement) {
      htmlElement.setAttribute("data-theme", theme)
    }
  }, [theme])

  // return pages
  return (
    <div className="navbar bg-base-100 sticky z-[1030] top-0 left-0 right-0 w-full border-b border-gray-300 sm:px-4 md:px-6 lg:px-8 xl:px-10">
      {/* Tabs */}
      {/* On the left */}
      <div className="flex-1">{StapleLogo({ theme })}</div>
      {/* On the right */}
      <div className="flex space-x-5">
        {/* Home tab */}
        <label
          tabIndex={0}
          className="btn btn-ghost btn-circle"
          onClick={() => router.push(Routes.MainPage())}
        >
          <div className="indicator">
            {/* Icon */}
            <HomeIcon className="w-5 h-5" />
          </div>
        </label>
        {/* Notifications tab */}
        <NotificationsMenu />

        {/* Profile tab */}
        <div className="dropdown dropdown-end">
          {/* TODO: Change to avatar if image is uploaded */}
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
            <div
              // TODO: DaisyUI tooltip is not working because css cannot deal with element edge
              // https://github.com/saadeghi/daisyui/discussions/1695
              className="w-10 rounded-full"
              data-tooltip-id="profile-tooltip"
            >
              <Tooltip
                id="profile-tooltip"
                content="Go to Profile update your information."
                className="z-[1099] ourtooltips"
                place="left"
              />
              <span className="text-1xl">{initial ? initial : "?"}</span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52"
          >
            <li>
              <Link className="justify-between" key="Profile" href={Routes.ProfilePage()}>
                Profile
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

        <select
          id="dropdown"
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
          onChange={toggleTheme}
          title="ChangeTheme"
        >
          <option value="">Theme</option>
          <option value="light">☼ Light</option>
          <option value="dark">☾ Dark</option>
          <option value="retro">🪩 Retro</option>
          <option value="dracula">🧛🏽 Dracula</option>
          <option value="cyberpunk">🤖 Cyberpunk</option>
          <option value="cupcake">🧁 Cupcake</option>
          <option value="bumblebee">🐝 Bumblebee</option>
          <option value="emerald">💚 Emerald</option>
          <option value="corporate">👔 Corporate</option>
          <option value="halloween">🎃 Halloween</option>
          <option value="garden">🌿 Garden</option>
          <option value="forest">🌲 Forest</option>
          <option value="aqua">🐠 Aqua</option>
          <option value="lofi">😎 Lofi</option>
          <option value="pastel">🌸 Pastel</option>
          <option value="fantasy">🐉 Fantasy</option>
          <option value="wireframe">🖼️ Wireframe</option>
          <option value="black">◼️ Black</option>
          <option value="luxury">💰 Luxury</option>
          <option value="cmyk">🎨 CMYK</option>
          <option value="autumn">🍁 Autumn</option>
          <option value="business">💼 Business</option>
          <option value="acid">🏜️ Acid</option>
          <option value="lemonade">🍋 Lemonade</option>
          <option value="night">🌃 Night</option>
          <option value="coffee">☕ Coffee</option>
          <option value="winter">❄️ Winter</option>
          <option value="dim">🔅 Dim</option>
          <option value="nord">🐺 Nord</option>
          <option value="sunset">🌇 Sunset</option>
        </select>
      </div>
    </div>
  )
}

// TODO: had to add suspense for now because getcurrentuser is async but this is causeing flickering
// TODO: might have to add a general loading screens so that we wait for the body and the navbar to load together
const MainNavbar = () => {
  return (
    // TODO: is this necessary?
    // <Suspense fallback={<div>Loading...</div>}>
    <Navbar />
    // </Suspense>
  )
}

export default MainNavbar
