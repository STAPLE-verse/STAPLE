import { Suspense, useState } from "react"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"

import React, { useRef } from "react"
import { ContributorsView, ElementView, TeamView } from "./UtilsViews"

const ByElements = ({ elements, teams, contributors }) => {
  const sortedTeams = teams
  const sortedContributors = contributors

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">By elements organization</h1>
      <div>
        {/* <h2>Elements Summary</h2> */}
        <div>
          <h2>Contributors Summary</h2>
          {sortedContributors.map((contributor) => (
            <ContributorsView
              contributor={contributor}
              tasks={[]}
              id={contributor.id}
              key={contributor.id}
              printTask={false}
            ></ContributorsView>
          ))}
        </div>
        <div>
          <h2>Teams Summary</h2>
          {sortedTeams.map((teamInfo) => (
            <TeamView
              team={teamInfo}
              tasks={[]}
              id={teamInfo.id}
              key={teamInfo.id}
              printTask={false}
            ></TeamView>
          ))}
        </div>
        <div>
          <h2>Elements Summary</h2>
          {elements.map((element) => (
            <ElementView
              element={element}
              tasks={[]}
              key={element.id}
              printTask={true}
            ></ElementView>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ByElements
