import { Suspense, useRef, useState } from "react"
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { Prisma } from "@prisma/client"
import toast from "react-hot-toast"
import getProjects from "src/projects/queries/getProjects"
import copyProject from "src/projects/mutations/copyProject"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const CopyProjectList = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [copyProjectMutation, { isLoading }] = useMutation(copyProject)

  const where: Prisma.ProjectWhereInput = {
    ProjectPrivilege: {
      some: {
        userId: currentUser?.id,
        privilege: "PROJECT_MANAGER",
      },
    },
  }

  const [{ projects }] = useQuery(getProjects, { where, orderBy: { name: "asc" } })

  const filtered = search
    ? projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : projects

  const handleCopy = async () => {
    if (!selectedId) return
    try {
      const newProject = await toast.promise(copyProjectMutation({ id: selectedId }), {
        loading: "Copying project...",
        success: "Project copied!",
        error: "Failed to copy the project...",
      })
      onClose()
      await router.push(Routes.ShowProjectPage({ projectId: newProject.id }))
    } catch (error: any) {
      console.error(error)
    }
  }

  return (
    <>
      <p className="text-sm opacity-70 mb-4">
        Creates a new project with the same tasks, milestones, and structure — without copying team
        members.
      </p>
      <input
        type="text"
        placeholder="Search projects..."
        className="input input-bordered w-full mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-64 overflow-y-auto border border-base-content/20 rounded-lg divide-y divide-base-content/10">
        {filtered.length === 0 && <p className="p-4 text-center opacity-50">No projects found</p>}
        {filtered.map((project) => (
          <label
            key={project.id}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-base-200 ${
              selectedId === project.id ? "bg-base-200" : ""
            }`}
          >
            <input
              type="radio"
              name="copyFromProject"
              className="radio radio-primary"
              checked={selectedId === project.id}
              onChange={() => setSelectedId(project.id)}
            />
            <span>{project.name}</span>
          </label>
        ))}
      </div>
      <div className="modal-action">
        <button className="btn" onClick={onClose} disabled={isLoading}>
          Cancel
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleCopy}
          disabled={!selectedId || isLoading}
        >
          {isLoading ? <span className="loading loading-spinner loading-sm" /> : "Copy Project"}
        </button>
      </div>
    </>
  )
}

export const CopyProjectModal = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
    dialogRef.current?.showModal()
  }

  const closeModal = () => {
    dialogRef.current?.close()
    setIsOpen(false)
  }

  return (
    <>
      <button
        className="btn btn-secondary btn-square mb-4 mt-4"
        onClick={openModal}
        data-tooltip-id="copy-project-btn"
      >
        <DocumentDuplicateIcon className="h-6 w-6" />
      </button>
      <Tooltip
        id="copy-project-btn"
        content="Copy Existing Project"
        className="z-[1099] ourtooltips"
      />

      <dialog
        ref={dialogRef}
        className="modal"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeModal()
        }}
      >
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-bold text-lg mb-4">Copy from Existing Project</h3>
          {isOpen && (
            <Suspense fallback={<div className="text-center py-8">Loading projects...</div>}>
              <CopyProjectList onClose={closeModal} />
            </Suspense>
          )}
        </div>
      </dialog>
    </>
  )
}

export default CopyProjectModal
