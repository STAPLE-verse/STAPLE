import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { Routes } from "@blitzjs/next"
import Link from "next/link"

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
          <div className="card bg-base-300 w-full">
            <div className="card-body">
              <div className="card-title" data-tooltip-id="element-tool">
                Profile Information
              </div>
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
              <div className="card-actions justify-end">
                <Link className="btn btn-primary" href={Routes.EditProfilePage()}>
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

ProfilePage.authenticate = true

ProfilePage.getLayout = () => {
  return (
    <Suspense>
      <Layout>
        <ProfilePage />
      </Layout>
    </Suspense>
  )
}

export default ProfilePage
