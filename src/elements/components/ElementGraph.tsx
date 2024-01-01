import { Suspense, useEffect } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import getFlow from "src/elements/queries/getFlow"
import React, { useCallback } from "react"
import ProjectLayout from "src/core/layouts/ProjectLayout"

import ElementNode from "src/elements/components/ElementNode"

const nodeTypes = { elementNode: ElementNode }

// For testing purposes
const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "elementNode",
    data: { title: "something", label: "my label" },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    type: "elementNode",
    data: { title: "something 2", label: "other label" },
  },
]
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }]

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from "reactflow"
import "reactflow/dist/style.css"

export const ElementsFlow = () => {
  const projectId = useParam("projectId", "number")
  const [{ nodesData: nodesQuery, edgesData: edgesQuery }] = useQuery(getFlow, projectId!)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  useEffect(() => {
    // Currently we only add position to nodes after query
    // Position is hardcoded should change dynamically
    // But other layout stuff can be added later
    // Layout can be saved in bulk on page leave hook
    const x = nodesQuery.map((node, index) => ({
      ...node,
      position: {
        x: 0,
        y: index * 200,
      },
    }))
    setNodes(x)
    setEdges(edgesQuery)
  }, [nodesQuery, edgesQuery, setEdges, setNodes])

  return (
    <div>
      {/* TODO: Find out how to properly size this window */}
      <div style={{ width: "70vw", height: "70vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
      {/* <ul>
        {elements.map((element) => (
          <li key={element.id}>
            <Link href={Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })}>
              {element.name}
            </Link>
          </li>
        ))}
      </ul> */}
    </div>
  )
}

const ElementGraph = () => {
  const projectId = useParam("projectId", "number")

  return (
    <>
      <Head>
        <title>Element graph</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ElementsFlow />
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

ElementGraph.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)
export default ElementGraph