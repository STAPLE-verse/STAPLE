import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import TagDisplay from "src/tags/components/TagDisplay"

const TagsPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Tasks">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <TagDisplay />
        </Suspense>
      </main>
    </Layout>
  )
}

export default TagsPage
