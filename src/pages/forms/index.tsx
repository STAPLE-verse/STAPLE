import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { FormsList } from "src/forms/components/FormsList"

const AllFormsPage = () => {
  return (
    <Layout>
      <Head>
        <title>All Forms</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <FormsList />
        </Suspense>
        <div className="flex justify-start">
          <Link className="btn btn-primary" href={Routes.FormBuilderPage()}>
            Create Form
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export default AllFormsPage
