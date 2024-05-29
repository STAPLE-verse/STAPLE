import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import React, { useRef } from "react"
import { ElementView } from "./UtilsViews"

const ByElements = ({ elements }) => {
  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By elements organization</h1>
      <div>
        <h2>Elements Summary</h2>
        {elements.map((element) => (
          <ElementView element={element} tasks={[]} key={element.id} printTask={true}></ElementView>
        ))}
      </div>
    </main>
  )
}

export default ByElements
