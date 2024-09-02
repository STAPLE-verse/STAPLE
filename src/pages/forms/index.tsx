import { Suspense, useState } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { FormsList } from "src/forms/components/FormsList"
import AddFormTemplates from "src/forms/components/AddFormTemplates"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getForms from "src/forms/queries/getForms"
import { useRouter } from "next/router"

const ITEMS_PER_PAGE = 10

const AllFormsPage = () => {
  // Setup
  const router = useRouter()
  const page = Number(router.query.page) || 0

  // AddFormTemplate model settings
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Get user
  const currentUser = useCurrentUser()

  // Get forms
  const [{ forms, hasMore }, { refetch }] = usePaginatedQuery(getForms, {
    where: {
      user: { id: currentUser?.id },
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <Layout>
      <Head>
        <title>All Forms</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <FormsList
            forms={forms}
            page={page}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            hasMore={hasMore}
          />
        </Suspense>
        <div className="flex justify-start gap-4">
          <Link className="btn btn-primary" href={Routes.FormBuilderPage()}>
            Create New Form
          </Link>
          <button className="btn btn-primary" onClick={openModal}>
            Add Form Templates
          </button>
          <AddFormTemplates
            open={isModalOpen}
            onClose={closeModal}
            currentUser={currentUser!}
            onFormsUpdated={refetch}
          />
        </div>
      </main>
    </Layout>
  )
}

export default AllFormsPage
