import { Suspense, useEffect } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery, useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import getFlow from "src/elements/queries/getFlow"
import React, { useCallback } from "react"
import ProjectLayout from "src/core/layouts/ProjectLayout"

import ElementNode from "src/elements/components/ElementNode"

const nodeTypes = { elementNode: ElementNode }

const nodeWidth = 150
const nodeHeight = 60

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

const getLayoutedElements = (nodes, edges) => {
  const layoutedNodes = nodes.map((node, index) => ({
    ...node,
    position: {
      x: 0,
      y: index * 100,
    },
  }))

  return { nodes: layoutedNodes, edges }
}

export const ElementsList = () => {
  const projectId = useParam("projectId", "number")
  const [{ nodesData: nodesQuery, edgesData: edgesQuery }] = useQuery(getFlow, projectId!)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  useEffect(() => {
    const x = nodesQuery.filter((node) => {
      return edgesQuery.some((edge) => {
        return edge.source === node.id || edge.target === node.id
      })
    })
    console.log(nodesQuery)
    const ele = getLayoutedElements(x, edgesQuery)
    setNodes(ele.nodes)
    setEdges(ele.edges)
  }, [nodesQuery, edgesQuery, setEdges, setNodes])

  return (
    <div>
      {/* TODO: Find out how to properly size this window */}
      <div style={{ width: nodeWidth, height: nodeHeight }}>
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
