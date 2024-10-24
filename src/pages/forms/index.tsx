import { Suspense, useState } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { FormsList } from "src/forms/components/FormsList"
import AddFormTemplates from "src/forms/components/AddFormTemplates"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useQuery } from "@blitzjs/rpc"
import getForms from "src/forms/queries/getForms"

const AllFormsPage = () => {
  // AddFormTemplate modal settings
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Get user
  const currentUser = useCurrentUser()

  // Get forms
  const [forms, { refetch }] = useQuery(getForms, {
    where: {
      user: { id: currentUser?.id },
      archived: false,
    },
    orderBy: { id: "asc" },
  })

  return (
    <Layout>
      <Head>
        <title>All Forms</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <FormsList forms={forms} addPagination={true} />
        </Suspense>
        <div className="flex justify-start gap-4 mt-4">
          <Link className="btn btn-primary" href={Routes.FormBuilderPage()}>
            Create New Form
          </Link>
          <button className="btn btn-secondary" onClick={openModal}>
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
