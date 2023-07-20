import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getElements from "src/elements/queries/getElements";

const ITEMS_PER_PAGE = 100;

export const ElementsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ elements, hasMore }] = usePaginatedQuery(getElements, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {elements.map((element) => (
          <li key={element.id}>
            <Link href={Routes.ShowElementPage({ elementId: element.id })}>
              {element.name}
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

const ElementsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Elements</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewElementPage()}>Create Element</Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ElementsList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default ElementsPage;
