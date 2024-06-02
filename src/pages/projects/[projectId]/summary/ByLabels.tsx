import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import React, { useRef } from "react"
import { LabelView } from "./UtilsViews"

const ByLabels = ({ labels }) => {
  // console.log(labels)

  //needs to sort them
  const sortedLabels = labels

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By labels organization</h1>
      <div>
        <h2>Lables Summary</h2>
        {sortedLabels.map((label) => (
          <LabelView
            label={label}
            tasks={[]}
            key={label.id}
            printTask={true}
            contributors={[]}
          ></LabelView>
        ))}
      </div>
    </main>
  )
}

export default ByLabels
