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

export async function getFromStats() {
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
