import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import React, { useRef } from "react"
import { LabelView } from "src/projects/components/UtilsViews"

const ByLabels = ({ labels, tasks, contributors }) => {
  const getLabelContributors = (labelId, contributors) => {
    let r = contributors.filter(
      (contributor) => contributor.labels.findIndex((label) => label.id != labelId) >= 0
    )
    return r
  }

  const getLabelTasks = (labelId, tasks) => {
    let r = tasks.filter((task) => task.labels.findIndex((label) => label.id != labelId) >= 0)
    return r
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By roles organization</h1>
      <div>
        <h2>Roles Summary</h2>
        {labels.map((label) => (
          <LabelView
            label={label}
            tasks={getLabelTasks(label.id, tasks)}
            key={label.id}
            printTask={true}
            printContributor={true}
            contributors={getLabelContributors(label.id, contributors)}
          ></LabelView>
        ))}
      </div>
    </main>
  )
}

export default ByLabels
