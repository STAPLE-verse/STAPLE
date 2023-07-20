import Layout from "src/core/layouts/Layout"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const ProfilePage = () => {
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()
  const currentUser = useCurrentUser()

  return (
    <Layout title="Profile">
      <h1>Your profile</h1>
      <button
        onClick={async () => {
          await logoutMutation()
          await router.push(Routes.Home())
        }}
      >
        Logout
      </button>
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

ProfilePage.authenticate = true

export default ProfilePage
