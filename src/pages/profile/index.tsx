import Layout from "src/core/layouts/Layout"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"

const ProfilePage = () => {
  const [logoutMutation] = useMutation(logout)
  const router = useRouter()

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
    </Layout>
  )
}

ProfilePage.authenticate = true

export default ProfilePage
