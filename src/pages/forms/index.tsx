import { Suspense, useMemo, useState } from "react"
import Layout from "src/core/layouts/Layout"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { FormsList } from "src/forms/components/FormsList"
import AddFormTemplates from "src/forms/components/AddFormTemplates"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { usePaginatedQuery, useQuery, useMutation } from "@blitzjs/rpc"
import getForms from "src/forms/queries/getForms"
import getFolders from "src/folders/queries/getFolders"
import createFolder from "src/folders/mutations/createFolder"
import deleteFolder from "src/folders/mutations/deleteFolder"
import renameFolder from "src/folders/mutations/renameFolder"
import Card from "src/core/components/Card"
import {
  InformationCircleIcon,
  FolderIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline"
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
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null)
  const [editingFolderName, setEditingFolderName] = useState("")
  const [newFolderName, setNewFolderName] = useState("")
  const [showNewFolder, setShowNewFolder] = useState(false)

  const [folders, { refetch: refetchFolders }] = useQuery(getFolders, {})
  const [createFolderMutation] = useMutation(createFolder)
  const [deleteFolderMutation] = useMutation(deleteFolder)
  const [renameFolderMutation] = useMutation(renameFolder)

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
  const handleFolderSelect = (id: number | null | "all") => {
    setSelectedFolderId(id)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    await createFolderMutation({ name: newFolderName.trim() })
    setNewFolderName("")
    setShowNewFolder(false)
    await refetchFolders()
  }

  const handleDeleteFolder = async (id: number) => {
    await deleteFolderMutation({ id })
    if (selectedFolderId === id) setSelectedFolderId("all")
    await refetchFolders()
    await refetch()
  }

  const handleRenameFolder = async (id: number) => {
    if (!editingFolderName.trim()) return
    await renameFolderMutation({ id, name: editingFolderName.trim() })
    setEditingFolderId(null)
    setEditingFolderName("")
    await refetchFolders()
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
              onGlobalFilterChange={handleGlobalFilterChange}
            />
          </Card>

          <div className="flex gap-4 mt-2">
            {/* Folder sidebar */}
            <div className="w-48 shrink-0">
              <Card title="Folders">
                <ul className="flex flex-col gap-1">
                  <li>
                    <button
                      className={`btn btn-sm btn-ghost w-full justify-start ${
                        selectedFolderId === "all" ? "btn-active" : ""
                      }`}
                      onClick={() => handleFolderSelect("all")}
                    >
                      <FolderIcon className="w-4 h-4 mr-1" /> All Forms
                    </button>
                  </li>
                  <li>
                    <button
                      className={`btn btn-sm btn-ghost w-full justify-start ${
                        selectedFolderId === null ? "btn-active" : ""
                      }`}
                      onClick={() => handleFolderSelect(null)}
                    >
                      <FolderIcon className="w-4 h-4 mr-1 opacity-40" /> Unfiled
                    </button>
                  </li>
                  {folders.map((folder) =>
                    editingFolderId === folder.id ? (
                      <li key={folder.id} className="flex gap-1 items-center">
                        <input
                          className="input input-xs input-bordered flex-1 min-w-0"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") void handleRenameFolder(folder.id)
                            if (e.key === "Escape") setEditingFolderId(null)
                          }}
                          autoFocus
                        />
                        <button
                          className="btn btn-xs btn-primary"
                          onClick={() => void handleRenameFolder(folder.id)}
                        >
                          ✓
                        </button>
                      </li>
                    ) : (
                      <li key={folder.id} className="flex items-center group">
                        <button
                          className={`btn btn-sm btn-ghost flex-1 justify-start truncate ${
                            selectedFolderId === folder.id ? "btn-active" : ""
                          }`}
                          onClick={() => handleFolderSelect(folder.id)}
                        >
                          <FolderIcon className="w-4 h-4 mr-1 shrink-0" />
                          <span className="truncate">{folder.name}</span>
                          <span className="ml-auto text-xs opacity-40">{folder._count.forms}</span>
                        </button>
                        <button
                          className="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            setEditingFolderId(folder.id)
                            setEditingFolderName(folder.name)
                          }}
                        >
                          <PencilIcon className="w-3 h-3" />
                        </button>
                        <button
                          className="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 text-error"
                          onClick={() => void handleDeleteFolder(folder.id)}
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </li>
                    )
                  )}
                </ul>

                {showNewFolder ? (
                  <div className="mt-2 flex flex-col gap-1">
                    <input
                      className="input input-xs input-bordered w-full"
                      value={newFolderName}
                      placeholder="Folder name"
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleCreateFolder()
                        if (e.key === "Escape") setShowNewFolder(false)
                      }}
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <button
                        className="btn btn-xs btn-primary flex-1"
                        onClick={() => void handleCreateFolder()}
                      >
                        Create
                      </button>
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={() => setShowNewFolder(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-xs btn-ghost w-full mt-2"
                    onClick={() => setShowNewFolder(true)}
                  >
                    + New folder
                  </button>
                )}
              </Card>
            </div>

            {/* Forms table */}
            <div className="flex-1 min-w-0">
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
            </div>
          </div>
        </Suspense>
      </main>
    </Layout>
  )
}

export default AllFormsPage
