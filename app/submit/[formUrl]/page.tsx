import { getFormContentByUrl } from "@/actions/form";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import { FormElementInstance } from "@/lib/form-builder/types";
import React, { Suspense } from "react";

async function Loader({ url }: { url: string }) {
  const form = await getFormContentByUrl(url);

  if (!form) {
    return <div>404 form not found</div>;
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return <FormSubmitComponent url={url} content={formContent} />;
}

function Page({ params: { formUrl } }: { params: { formUrl: string } }) {
  return (
    <Suspense fallback={"loading"}>
      <Loader url={formUrl} />
    </Suspense>
  );
}

export default Page;
