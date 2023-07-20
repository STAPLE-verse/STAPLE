import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";
import { useRouter } from "next/router";

import Layout from "src/core/layouts/Layout";
import getDashboards from "src/dashboards/queries/getDashboards";

const ITEMS_PER_PAGE = 100;

export const DashboardsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const projectId = useParam("projectId", "number");
  const [{ dashboards, hasMore }] = usePaginatedQuery(getDashboards, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {dashboards.map((dashboard) => (
          <li key={dashboard.id}>
            <Link
              href={Routes.ShowDashboardPage({ dashboardId: dashboard.id })}
            >
              {dashboard.name}
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const DashboardsPage = () => {
  const projectId = useParam("projectId", "number");

  return (
    <Layout>
      <Head>
        <title>Dashboards</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewDashboardPage({ projectId: projectId! })}>
            Create Dashboard
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <DashboardsList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default DashboardsPage;
