import { getFormById, getFormWithSubmissions } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import React, { ReactNode, Suspense } from "react";
import { ImSpinner2 } from "react-icons/im";
import { StatCard } from "../../page";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { FormElementEnum, FormElementInstance } from "@/lib/form-builder/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface formPagePropsType {
  params: {
    formId: string;
  };
}

type Row = { [key: string]: string } & { submittedAt: Date };

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <ImSpinner2 className="animate-spin h-12 w-12" />
    </div>
  );
}

async function DataLoader({ formId }: { formId: string }) {
  const form = await getFormById(formId);

  if (!form) {
    throw new Error("Form not found");
  }

  const { visits, submissions, name, shareURL } = form;

  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
  const bounceRate = 100 - submissionRate;
  return (
    <div className="py-4 border-t border-b border-muted">
      <div className="flex justify-between container">
        <h1 className="text-xl font-bold truncate">{name}</h1>
        <VisitBtn shareUrl={shareURL} />
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={shareURL} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatCard
          title="total visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          loading={false}
          value={visits?.toLocaleString() ?? ""}
          className="shadow-md shadow-blue-600"
        />
        <StatCard
          title="total submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="All time form submissions"
          loading={false}
          value={submissions?.toLocaleString() ?? ""}
          className="shadow-md shadow-yellow-600"
        />
        <StatCard
          title="submission rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="submissions rate"
          loading={false}
          value={(submissionRate?.toLocaleString() ?? "") + "%"}
          className="shadow-md shadow-green-600"
        />
        <StatCard
          title="bounce rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="bounce rate"
          loading={false}
          value={(bounceRate?.toLocaleString() ?? "") + "%"}
          className="shadow-md shadow-red-600"
        />
      </div>

      <div className="container pt-10">
        <SubmissionTable id={form.id} />
      </div>
    </div>
  );
}

async function SubmissionTable({ id }: { id: number }) {
  const form = await getFormWithSubmissions(id);

  if (!form) {
    return <div>Form not found</div>;
  }
  const formElements = JSON.parse(form.content) as FormElementInstance[];

  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: FormElementEnum;
  }[] = [];

  formElements.forEach((e) => {
    switch (e.type) {
      case FormElementEnum.TextField:
      case FormElementEnum.NumberField:
      case FormElementEnum.TextareaField:
      case FormElementEnum.DateField:
      case FormElementEnum.SelectField:
      case FormElementEnum.CheckboxField:
        columns.push({
          id: e.id,
          label: e.extraAttributes?.label,
          required: e.extraAttributes?.required,
          type: e.type,
        });
        break;

      default:
        break;
    }
  });

  const rows: Row[] = [];
  form.FormSubmission.forEach((sub) => {
    const content = JSON.parse(sub.content);
    rows.push({
      ...content,
      submittedAt: sub.createdAt,
    });
  });

  return (
    <>
      <h1 className="text-xl font-bold my-4"> Submissions</h1>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead className="uppercase" key={col.id}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.submittedAt.getUTCMilliseconds()}>
                {columns.map((c) => (
                  <RowCell key={c.id} type={c.type} value={r[c.id]} />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(r.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: FormElementEnum; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case FormElementEnum.DateField:
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant="outline">{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case FormElementEnum.CheckboxField:
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}

async function Page({ params: { formId } }: formPagePropsType) {
  return (
    <Suspense fallback={<Spinner />}>
      <DataLoader formId={formId} />
    </Suspense>
  );
}

export default Page;
