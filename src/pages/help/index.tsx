import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import Head from "next/head"

const HelpPage = () => {
  return (
    <Layout>
      <Head>
        <title>Get Help</title>
      </Head>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl flex justify-center mb-2">Get Help</h1>

        <Suspense fallback={<div>Loading...</div>}>
          <div className="text-lg flex flex-row">
            <div className="card bg-base-300 w-1/2 mr-2">
              <div className="card-body">
                <div className="card-title">Documentation</div>
                Need help navigating STAPLE and how to use the software?{" "}
                <a className="link-primary" href="https://staple.science/documentation/">
                  Check out the documentation.
                </a>
              </div>
            </div>

            <div className="card bg-base-300 w-1/2 mr-2">
              <div className="card-body">
                <div className="card-title">Account Issues</div>
                Need help with your account? Send us an email at:{" "}
                <a className="link-primary" href="mailto:staple.helpdesk@gmail.com">
                  {" "}
                  staple dot helpdesk at gmail dot com.{" "}
                </a>{" "}
                You will receive a ticket from our help desk, and we will get back to you after
                investigating the issue.
              </div>
            </div>
          </div>

          <div className="text-lg flex flex-row mt-2">
            <div className="card bg-base-300 w-1/2 mr-2">
              <div className="card-body">
                <div className="card-title">Development</div>
                Are you a developer who wants to help with STAPLE? Or maybe you need help setting up
                your own version of STAPLE?{" "}
                <a className="link-primary" href="https://github.com/STAPLE-verse/STAPLE/">
                  Leave us a message on GitHub.
                </a>
              </div>
            </div>

            <div className="card bg-base-300 w-1/2 mr-2">
              <div className="card-body">
                <div className="card-title">Feature Roadmap</div>
                Want to suggest a feature or look at our STAPLE roadmap?{" "}
                <a className="link-primary" href="https://roadmap.staple.science/">
                  Check it out here.
                </a>{" "}
                You can create an account on the roadmap page with ORCID, Google, or GitHub.
              </div>
            </div>
          </div>
        </Suspense>
      </main>
    </Layout>
  )
}

export default HelpPage
