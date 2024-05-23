import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import React, { useRef } from "react"

const ByDate = () => {
  const page = Number(router.query.page) || 0

  const ITEMS_PER_PAGE = 7

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By date organization</h1>
    </main>
  )
}

export default ByDate
