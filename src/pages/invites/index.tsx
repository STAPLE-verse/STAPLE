import { Suspense } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { InvitesList } from "src/invites/components/InvitesList"

const InvitesPage = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  console.log(currentUser)

  return (
    <Layout>
      <Head>
        <title>Projects</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Project Invitations</h1>

        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <InvitesList currentUser={currentUser} />
          </Suspense>
        </div>
      </main>
    </Layout>
  )
}

export default InvitesPage
