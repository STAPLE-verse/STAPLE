import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"

const ProfilePage = () => {
  const currentUser = useCurrentUser()
  if (currentUser === null) {
    return <div>Loading...</div>
  } else {
    const fullName = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`

    return (
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl flex justify-center mb-2">{currentUser.username}'s profile</h1>
        <div className="text-lg">
          <span className="font-semibold">Username:</span> {currentUser.username}
          <br />
          <span className="font-semibold">Email:</span> {currentUser.email}
          <br />
          <span className="font-semibold">Name:</span>{" "}
          {currentUser.firstName && currentUser.lastName ? (
            fullName
          ) : (
            <span className="italic">
              No name is provided. Use the Edit Profile button to add your name.
            </span>
          )}
          <br />
          <span className="font-semibold">Institution:</span>{" "}
          {!!currentUser.institution ? (
            currentUser.institution
          ) : (
            <span className="italic">
              No institution is provided. Use the Edit Profile button to add your information.
            </span>
          )}
          <br />
          <span className="font-semibold">Signup Date:</span>{" "}
          {currentUser.createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </div>
        <div className="flex justify-start mt-4">
          {/* TODO: I do not know why it cannot find the page in the app it works */}
          <Link className="btn btn-primary" href={Routes.EditProfilePage()}>
            Edit Profile
          </Link>
        </div>
      </main>
    )
  }
}

ProfilePage.authenticate = true

ProfilePage.getLayout = () => {
  const sidebarItems = HomeSidebarItems(null)

  return (
    <Suspense>
      <Layout sidebarItems={sidebarItems} title="Profile" sidebarTitle="Home">
        <ProfilePage />
      </Layout>
    </Suspense>
  )
}

export default ProfilePage
