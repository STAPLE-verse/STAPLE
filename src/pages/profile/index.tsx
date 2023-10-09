import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const ProfilePage = () => {
  const currentUser = useCurrentUser()
  if (currentUser === null) {
    return <div>Loading...</div>
  } else {
    return (
      <>
        <h1>Your profile</h1>
        <div>
          Id: <code>{currentUser.id}</code>
          <br />
          Role: <code>{currentUser.role}</code>
          <br />
          Email: <code>{currentUser.email}</code>
          <br />
          Name: <code>{currentUser.name}</code>
          <br />
          Date of signup: <code>{currentUser.createdAt.toString()}</code>
        </div>
      </>
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
