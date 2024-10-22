import { getForms, getFormStats } from "@/actions/form";

import CreateFormBtn from "@/components/CreateFormBtn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@prisma/client";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit, FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";
import { TbArrowBounce } from "react-icons/tb";

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatCardGroup loading={true} />}>
        <CardStatsContainer />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4, 5].map((e) => (
            <FormCardSkeleton key={e} />
          ))}
        >
          <FormCardGroup />
        </Suspense>
      </div>
    </div>
  );
}

async function CardStatsContainer() {
  const stats = await getFormStats();
  return <StatCardGroup loading={false} data={stats} />;
}

export interface StatCardGroupProp {
  data?: Awaited<ReturnType<typeof getFormStats>>;
  loading: boolean;
}

function StatCardGroup(props: StatCardGroupProp) {
  const { data, loading } = props;

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="total visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time form visits"
        loading={loading}
        value={data?.visits?.toLocaleString() ?? ""}
        className="shadow-md shadow-blue-600"
      />
      <StatCard
        title="total submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All time form submissions"
        loading={loading}
        value={data?.submissions?.toLocaleString() ?? ""}
        className="shadow-md shadow-yellow-600"
      />
      <StatCard
        title="submission rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="submissions rate"
        loading={loading}
        value={(data?.submissionRate?.toLocaleString() ?? "") + "%"}
        className="shadow-md shadow-green-600"
      />
      <StatCard
        title="bounce rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="bounce rate"
        loading={loading}
        value={(data?.bounceRate?.toLocaleString() ?? "") + "%"}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
}

export interface StatCardProps {
  title: string;
  icon: ReactNode;
  helperText: string;
  loading: boolean;
  value: string;
  className: string;
}

export function StatCard({
  title,
  icon,
  helperText,
  loading,
  value,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="capitalize text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

function Test() {
  return <div>test</div>;
}

function FormCard({ form }: { form: Form }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
          <Badge
            className="capitalize"
            variant={form.published ? "default" : "destructive"}
          >
            {form.published ? "published" : "draft"}
          </Badge>
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
          })}
          <span className="flex items-center gap-2">
            <LuView className="text-muted-foreground" />
            <span>{form.visits.toLocaleString()}</span>
            <FaWpforms className="text-muted-foreground" />
            <span>{form.submissions.toLocaleString()}</span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "No Description"}
      </CardContent>
      <CardFooter>
        {form.published ? (
          <Button
            variant={"secondary"}
            asChild
            className="w-full mt-2 text-base gap-4"
          >
            <Link href={`/forms/${form.id}`}>
              View Submissions <BiRightArrowAlt />{" "}
            </Link>
          </Button>
        ) : (
          <Button
            variant={"secondary"}
            asChild
            className="w-full mt-2 text-base gap-4"
          >
            <Link href={`/form-builder/${form.id}`}>
              Edit form <FaEdit />{" "}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

async function FormCardGroup() {
  const forms = await getForms();
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  );
}
