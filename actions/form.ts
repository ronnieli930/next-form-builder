"use server";

import { formSchema, formSchemaType } from "@/components/schemas/form";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

class UserNotFoundErr extends Error {}

async function getCurrentUser() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return user;
}

export async function getFormStats() {
  const user = await getCurrentUser();
  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits ?? 0;
  const submissions = stats._sum.submissions ?? 0;

  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;

  const bounceRate = visits > 0 ? 100 - submissionRate : 0;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function createForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw validation.error;
  }

  const user = await getCurrentUser();

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error("Something went wrong");
  }

  console.log("NAME", data.name, data.description);

  return form.id;
}

export async function getForms() {
  const user = await getCurrentUser();

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: DEFAULT_PAGE_SIZE,
  });
}

export async function getFormById(id: string) {
  const user = await getCurrentUser();
  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id: Number(id),
    },
  });
}

export async function updateFormContent(id: number, content: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.update({
    where: { userId: user.id, id },
    data: {
      content,
    },
  });
}

export async function publishForm(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.update({
    where: { userId: user.id, id },
    data: {
      published: true,
    },
  });
}

export async function sleep() {
  return new Promise((res) => setTimeout(res, 400));
}

export async function getFormContentByUrl(url: string) {
  await sleep();
  return await prisma.form.update({
    where: { shareURL: url },
    select: { content: true },
    data: {
      visits: {
        increment: 1,
      },
    },
  });
}

export async function submitForm(url: string, content: string) {
  await sleep();
  return await prisma.form.update({
    where: { shareURL: url, published: true },
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmission: {
        create: {
          content,
        },
      },
    },
  });
}

export async function getFormWithSubmissions(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: { id, userId: user.id },
    include: {
      FormSubmission: true,
    },
  });
}
