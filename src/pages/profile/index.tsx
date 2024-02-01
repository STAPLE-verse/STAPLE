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
        <h1 className="flex justify-center mb-2">Your profile</h1>
        <div>
          <span className="font-semibold">Username:</span> {currentUser.username}
          <br />
          <span className="font-semibold">Role:</span> {currentUser.role}
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
          <span className="font-semibold">Date of signup:</span> {currentUser.createdAt.toString()}
        </div>
        <div className="flex justify-start mt-4">
          {/* TODO: I do not know why it cannot find the page in the app it works */}
          <Link className="btn" href={Routes.EditProfilePage()}>
            Edit profile
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
