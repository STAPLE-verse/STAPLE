import { Suspense, useMemo } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import getElements from "src/elements/queries/getElements"
import React, { useCallback } from "react"
import ProjectLayout from "src/core/layouts/ProjectLayout"
import ElementNode from "src/elements/components/ElementNode"

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from "reactflow"
import "reactflow/dist/style.css"

export const ElementsList = () => {
  const nodeTypes = useMemo(() => ({ ElementNode: ElementNode }), [])

  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [elements] = useQuery(getElements, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
  ]
  const initialEdges = [{ id: "e1-2", source: "1", target: "2" }]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  return (
    <div>
      {/* TODO: Find out how to properly size this window */}
      <div style={{ width: "140vh", height: "70vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
      <ul>
        {elements.map((element) => (
          <li key={element.id}>
            <Link href={Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })}>
              {element.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const ElementsPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <>
      <Head>
        <title>Elements</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ElementsList />
        </Suspense>

        <p>
          <Link className="btn mt-4" href={Routes.NewElementPage({ projectId: projectId! })}>
            Create Element
          </Link>
        </p>
      </main>
    </>
  )
}

ElementsPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)
export default ElementsPage
