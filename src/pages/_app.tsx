import "../core/utils/i18n"
import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { Suspense, useEffect } from "react"
import { withBlitz } from "src/blitz-client"
import "src/styles/globals.css"
import "src/core/styles/index.css"
import { MemberPrivilegesProvider } from "src/projectprivileges/components/MemberPrivilegesContext"
import { useTranslation } from "react-i18next"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

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

  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      {/* TODO: Is it a good solution to add a big general suspnese? */}
      <Suspense fallback="Loading...">
        <MemberPrivilegesProvider>
          {getLayout(<Component {...pageProps} />)}
        </MemberPrivilegesProvider>
      </Suspense>
    </ErrorBoundary>
  )
}

export default withBlitz(MyApp)
