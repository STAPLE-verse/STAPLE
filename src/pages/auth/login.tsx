import { BlitzPage } from "@blitzjs/next"
import { LoginForm } from "src/auth/components/LoginForm"
import { useRouter } from "next/router"
import Head from "next/head"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{"Login"}</title>
      </Head>
      <main className="flex flex-col h-screen">
        <LoginForm
          onSuccess={async (_user) => {
            const next = router.query.next
              ? decodeURIComponent(router.query.next as string)
              : "/main"

            // Sleep for .1 seconds to prevent too fast navigation
            await new Promise((resolve) => setTimeout(resolve, 100))

            return router.push(next)
          }}
        />
      </main>
    </>
  )
}

export default LoginPage
