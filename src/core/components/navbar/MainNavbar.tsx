import Link from "next/link"
import { Routes } from "@blitzjs/next"
import React from "react"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { HomeIcon } from "@heroicons/react/24/outline"
import NotificationsMenu from "src/notifications/components/NotificationMenu"
import Image from "next/image"
import ThemeSelect from "../ThemeSelect"
import { Breadcrumbs } from "../BreadCrumbs"
import Gravatar from "react-gravatar"
import TooltipWrapper from "../TooltipWrapper"

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

  const gravatar_email =
    currentUser?.gravatar && currentUser.gravatar.trim() !== ""
      ? currentUser.gravatar
      : currentUser?.email // Fallback to last known valid email

  // Logout
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

  // Themes
  const currentTheme = localStorage.getItem("theme") || "light"

  // return pages
  return (
    <div className="navbar bg-base-100 sticky z-[1030] top-0 left-0 right-0 w-full border-b border-gray-300 sm:px-4 md:px-6 lg:px-8 xl:px-10">
      {/* Tabs */}
      {/* On the left */}
      <div className="flex-1 space-x-10 overflow-hidden">
        {StapleLogo({ theme: currentTheme })}
        <Breadcrumbs />
      </div>
      {/* On the right */}
      <div className="flex space-x-5">
        {/* Home tab */}
        {/* In the middle */}
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
              <TooltipWrapper
                id="profile-tooltip"
                content="Update your profile"
                className="z-[1099] ourtooltips"
                place="left"
              />
              <Gravatar email={gravatar_email} style={{ borderRadius: "50%" }} default="retro" />
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
        {/* Theme Selector */}
        <ThemeSelect />
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
