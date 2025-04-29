import Layout from "src/core/layouts/Layout"
import { AllTasksList } from "src/tasks/components/AllTaskList"
import { Suspense } from "react"
import { Tooltip } from "react-tooltip"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

const AllTasksPage = () => {
  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Tasks">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 items-center text-3xl">
          Tasks
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="tasks-overview"
          />
          <Tooltip
            id="tasks-overview"
            content="This page shows all tasks for all projects. Use the search options to filter for specific tasks or click the magnifying glass to go directly to the task page. The completion percentage indicates how many of the sub-tasks are completed."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <AllTasksList />
        </Suspense>
      </main>
    </Layout>
  )
}

export default AllTasksPage
