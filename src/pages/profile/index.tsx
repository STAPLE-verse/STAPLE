import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const ProfilePage = () => {
  const currentUser = useCurrentUser()
  if (currentUser === null) {
    return <div>Loading...</div>
  } else {
    return (
      <Layout title="Profile">
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
      </Layout>
    )
  }
}

ProfilePage.authenticate = true

export default ProfilePage
