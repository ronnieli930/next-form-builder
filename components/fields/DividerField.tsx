"use client";
import {
  FormElement,
  FormElementEnum,
  FormElementInstance,
} from "@/lib/form-builder/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import useDesigner from "@/hooks/useDesigner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";

const type = FormElementEnum.DividerField;

export const DividerFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propsComponent: PropsComponent,
  designerBtnElement: {
    icon: RiSeparator,
    label: "Divider field",
  },
  validate: () => true,
};

function PropsComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <p>No Props</p>;
}

function DesignerComponent() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Separator />
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <Separator />;
}
