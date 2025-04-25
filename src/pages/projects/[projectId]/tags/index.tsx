import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import TagDisplay from "src/tags/components/TagDisplay"

const TagsPage = () => {
  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Tasks">
      <main className="flex flex-col mx-auto w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <TagDisplay />
        </Suspense>
      </main>
    </Layout>
  )
}

export default TagsPage
