import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "src/core/layouts/Layout";
import { CreateElementSchema } from "src/elements/schemas";
import createElement from "src/elements/mutations/createElement";
import { ElementForm, FORM_ERROR } from "src/elements/components/ElementForm";
import { Suspense } from "react";

const NewElementPage = () => {
  const router = useRouter();
  const [createElementMutation] = useMutation(createElement);

  return (
    <Layout title={"Create New Element"}>
      <h1>Create New Element</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ElementForm
          submitText="Create Element"
          schema={CreateElementSchema}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const element = await createElementMutation(values);
              await router.push(
                Routes.ShowElementPage({ elementId: element.id })
              );
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </Suspense>
      <p>
        <Link href={Routes.ElementsPage()}>Elements</Link>
      </p>
    </Layout>
  );
};

NewElementPage.authenticate = true;

export default NewElementPage;
