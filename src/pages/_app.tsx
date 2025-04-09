import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { Suspense } from "react"
import { withBlitz } from "src/blitz-client"
import "src/styles/globals.css"
import "src/core/styles/index.css"
import { MemberPrivilegesProvider } from "src/projectprivileges/components/MemberPrivilegesContext"
import { TooltipProvider } from "src/core/components/TooltipContext"
import { useSession } from "@blitzjs/auth"

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this page."
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const session = useSession({ suspense: false })

  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <Suspense fallback="Loading...">
        <TooltipProvider enabled={session.tooltips}>
          <MemberPrivilegesProvider>
            {getLayout(<Component {...pageProps} />)}
          </MemberPrivilegesProvider>
        </TooltipProvider>
      </Suspense>
    </ErrorBoundary>
  )
}

export default withBlitz(MyApp)
