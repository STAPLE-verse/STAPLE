import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getDashboard from "src/dashboards/queries/getDashboard";
import deleteDashboard from "src/dashboards/mutations/deleteDashboard";

export const Dashboard = () => {
  const router = useRouter();
  const dashboardId = useParam("dashboardId", "number");
  const projectId = useParam("projectId", "number");
  const [deleteDashboardMutation] = useMutation(deleteDashboard);
  const [dashboard] = useQuery(getDashboard, { id: dashboardId });

  return (
    <>
      <Head>
        <title>Dashboard {dashboard.id}</title>
      </Head>

      <div>
        <h1>Dashboard {dashboard.id}</h1>
        <pre>{JSON.stringify(dashboard, null, 2)}</pre>

        <Link
          href={Routes.EditDashboardPage({
            projectId: projectId!,
            dashboardId: dashboard.id,
          })}
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteDashboardMutation({ id: dashboard.id });
              await router.push(
                Routes.DashboardsPage({ projectId: projectId! })
              );
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowDashboardPage = () => {
  const projectId = useParam("projectId", "number");

  return (
    <div>
      <p>
        <Link href={Routes.DashboardsPage({ projectId: projectId! })}>
          Dashboards
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
};

ShowDashboardPage.authenticate = true;
ShowDashboardPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowDashboardPage;
