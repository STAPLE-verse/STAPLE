import { Suspense, useCallback, useMemo, useState } from "react"
import Layout from "src/core/layouts/Layout"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { FormsList } from "src/forms/components/FormsList"
import AddFormTemplates from "src/forms/components/AddFormTemplates"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { usePaginatedQuery, useMutation } from "@blitzjs/rpc"
import getForms from "src/forms/queries/getForms"
import createFolder from "src/folders/mutations/createFolder"
import Card from "src/core/components/Card"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { PaginationState } from "@tanstack/react-table"

const AllFormsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const currentUser = useCurrentUser()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [search, setSearch] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState<number | null | "all">("all")
  const [newFolderName, setNewFolderName] = useState("")
  const [showNewFolder, setShowNewFolder] = useState(false)

  const [createFolderMutation] = useMutation(createFolder)

  const paginationArgs = useMemo(
    () => ({
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
    }),
    [pagination]
  )

  const folderFilter = selectedFolderId === "all" ? {} : { folderId: selectedFolderId }

  const [{ forms, count }, { refetch }] = usePaginatedQuery(getForms, {
    where: {
      user: { id: currentUser?.id },
      archived: false,
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...folderFilter,
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

  const handleGlobalFilterChange = (filter: string) => {
    setSearch(filter)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleFolderFilterChange = useCallback((folderId: number | null | "all") => {
    setSelectedFolderId(folderId)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    await createFolderMutation({ name: newFolderName.trim() })
    setNewFolderName("")
    setShowNewFolder(false)
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
          <div className="flex justify-center mt-4 mb-2 gap-2 flex-wrap">
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
            {showNewFolder ? (
              <>
                <input
                  className="input input-bordered"
                  value={newFolderName}
                  placeholder="Folder name"
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleCreateFolder()
                    if (e.key === "Escape") setShowNewFolder(false)
                  }}
                  autoFocus
                />
                <button className="btn btn-primary" onClick={() => void handleCreateFolder()}>
                  Create
                </button>
                <button className="btn btn-warning" onClick={() => setShowNewFolder(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-accent" onClick={() => setShowNewFolder(true)}>
                New Folder
              </button>
            )}
          </div>
          <Card title="">
            <FormsList
              forms={forms}
              manualPagination={true}
              paginationState={pagination}
              onPaginationChange={handlePaginationChange}
              pageCount={pageCount}
              pageSizeOptions={[10, 25, 50, 100]}
              onGlobalFilterChange={handleGlobalFilterChange}
              onFolderFilterChange={handleFolderFilterChange}
            />
          </Card>
        </Suspense>
      </main>
    </Layout>
  )
}

export default AllFormsPage
