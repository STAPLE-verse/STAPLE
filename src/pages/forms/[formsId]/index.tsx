"use client"
import { Suspense, useState } from "react"
import Layout from "src/core/layouts/Layout"
import { useParam, Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import getForm from "src/forms/queries/getForm"
import FormTagEditor from "src/forms/components/FormTagEditor"
import FormFolderSelector from "src/forms/components/FormFolderSelector"
import Card from "src/core/components/Card"

function FormOverviewContent({ formsId }: { formsId: number }) {
  const [form, { refetch }] = useQuery(getForm, { id: formsId })
  const [currentTags, setCurrentTags] = useState<string[]>(
    Array.isArray(form.tags) ? (form.tags as string[]) : []
  )
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(form.folderId ?? null)

  const schema = form.formVersion?.schema as any
  const description = schema?.description as string | undefined
  const versionCount = form._count?.versions ?? 1

  return (
    <main className="flex flex-col mx-auto w-full max-w-3xl gap-6 p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{form.formVersion?.name ?? "Untitled Form"}</h1>
          <p className="text-base-content/50 text-sm mt-1">
            Version {form.formVersion?.version ?? 1} · {versionCount} version
            {versionCount !== 1 ? "s" : ""} · Last updated{" "}
            {new Date(form.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <Link className="btn btn-sm btn-outline" href={Routes.FormEditPage({ formsId })}>
          <PencilSquareIcon className="w-4 h-4 mr-1" />
          Edit Form
        </Link>
      </div>

      {/* Description */}
      {description && (
        <Card title="Description">
          <div className="prose max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{description}</ReactMarkdown>
          </div>
        </Card>
      )}

      {/* Tags */}
      <Card title="Tags">
        <p className="text-sm text-base-content/60 mb-3">
          Add tags to classify this form for easy filtering.
        </p>
        <FormTagEditor
          formId={formsId}
          initialTags={currentTags}
          onUpdate={(tags) => setCurrentTags(tags)}
        />
      </Card>

      {/* Folder */}
      <Card title="Folder">
        <p className="text-sm text-base-content/60 mb-3">
          Assign this form to a folder to keep your forms organized.
        </p>
        <FormFolderSelector
          formId={formsId}
          currentFolderId={currentFolderId}
          onUpdate={(id) => setCurrentFolderId(id)}
        />
      </Card>
    </main>
  )
}

const FormOverviewPage = () => {
  const formsId = useParam("formsId", "number")

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Form Overview">
      <Suspense fallback={<div>Loading…</div>}>
        {formsId && <FormOverviewContent formsId={formsId} />}
      </Suspense>
    </Layout>
  )
}

export default FormOverviewPage
