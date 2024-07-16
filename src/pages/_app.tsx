import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { Suspense } from "react"
import { withBlitz } from "src/blitz-client"
import "src/styles/globals.css"
import "src/core/styles/index.css"
import { NotificationProvider } from "src/messages/components/NotificationContext"
import { ContributorPrivilegeProvider } from "src/contributors/components/ContributorPrivilegeContext"

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
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
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      {/* TODO: Is it a good solution to add a big general suspnese? */}
      <Suspense fallback="Loading...">
        <ContributorPrivilegeProvider>
          <NotificationProvider>{getLayout(<Component {...pageProps} />)}</NotificationProvider>
        </ContributorPrivilegeProvider>
      </Suspense>
    </ErrorBoundary>
  )
}

export default withBlitz(MyApp)
