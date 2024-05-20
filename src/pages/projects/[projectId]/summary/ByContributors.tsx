import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import React, { useRef } from "react"
import getTasks from "src/tasks/queries/getTasks"

const ByContributors = ({ projectId }) => {
  const page = Number(router.query.page) || 0

  const [tasks] = useQuery(getTasks, {
    where: { projectId: projectId },
    include: {
      assignees: {
        include: {
          statusLogs: {
            orderBy: {
              createdAt: "desc",
            },
          },
          team: {
            include: {
              contributors: {
                include: { user: true },
              },
            },
          },
          contributor: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  })

  console.log(tasks)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By contributors organization</h1>
    </main>
  )
}

export default ByContributors
