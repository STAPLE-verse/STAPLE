import { Suspense, useMemo, useState } from "react"
import Layout from "src/core/layouts/Layout"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { FormsList } from "src/forms/components/FormsList"
import AddFormTemplates from "src/forms/components/AddFormTemplates"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getForms from "src/forms/queries/getForms"
import Card from "src/core/components/Card"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { PaginationState } from "@tanstack/react-table"

const AllFormsPage = () => {
  // AddFormTemplate modal settings
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Get user
  const currentUser = useCurrentUser()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const paginationArgs = useMemo(
    () => ({
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
    }),
    [pagination]
  )

  // Get forms
  const [{ forms, count }, { refetch }] = usePaginatedQuery(getForms, {
    where: {
      user: { id: currentUser?.id },
      archived: false,
    },
    orderBy: { id: "desc" },
    ...paginationArgs,
  })

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / pagination.pageSize))

  const handlePaginationChange = (
    updater: PaginationState | ((state: PaginationState) => PaginationState)
  ) => {
    setPagination((prev) => (typeof updater === "function" ? updater(prev) : updater))
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Forms">
      <main className="flex flex-col mx-auto w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <h1 className="flex justify-center items-center text-3xl">
            Forms{" "}
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
          <div className="flex justify-center mt-4 mb-2">
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
            <FormsList
              forms={forms}
              manualPagination={true}
              paginationState={pagination}
              onPaginationChange={handlePaginationChange}
              pageCount={pageCount}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </Card>
        </Suspense>
      </main>
    </Layout>
  )
}

export default AllFormsPage
