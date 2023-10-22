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
    return (
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Your profile</h1>
        <div>
          Id: {currentUser.id}
          <br />
          Role: {currentUser.role}
          <br />
          Email: {currentUser.email}
          <br />
          Name: {currentUser.firstName} {currentUser.lastName}
          <br />
          Date of signup: {currentUser.createdAt.toString()}
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

ProfilePage.getLayout = () => (
  <Suspense>
    <Layout title="Profile">
      <ProfilePage />
    </Layout>
  </Suspense>
)

export default ProfilePage
