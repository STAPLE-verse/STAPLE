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
import Card from "src/core/components/Card"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

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
    <Layout title="All Forms">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <h1 className="flex justify-center items-center text-3xl">
            All Forms{" "}
            <InformationCircleIcon
              className="h-6 w-6 ml-2 text-info stroke-2"
              data-tooltip-id="dashboard-overview"
            />
            <Tooltip
              id="dashboard-overview"
              content="This page shows all your metadata forms. You can create new forms to collect information about project metadata. These forms can be assigned to tasks in any project. We've provided templates to help you get started."
              className="z-[1099] ourtooltips"
            />
          </h1>
          <div className="flex justify-center m-4">
            <Link className="btn btn-primary mr-2" href={Routes.FormBuilderPage()}>
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
          <Card title="">
            <FormsList forms={forms} addPagination={true} />
          </Card>
        </Suspense>
      </main>
    </Layout>
  )
}

export default AllFormsPage
