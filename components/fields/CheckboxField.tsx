"use client";
import {
  FormElement,
  FormElementEnum,
  FormElementInstance,
  SubmitFnType,
} from "@/lib/form-builder/types";
import { IoMdCheckbox } from "react-icons/io";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import useDesigner from "@/hooks/useDesigner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

const type = FormElementEnum.CheckboxField;

const extraAttributes = {
  label: "Checkbox field",
  helperText: "Helper text",
  required: false,
};

const CheckboxFieldPropsSchema = z.object({
  label: z.string().min(1).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
});

type CheckboxFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const CheckboxFieldElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propsComponent: PropsComponent,
  designerBtnElement: {
    icon: IoMdCheckbox,
    label: "Checkbox field",
  },
  validate: (formEl: FormElementInstance, currentValue: string): boolean => {
    console.log("currentValue", currentValue);
    const {
      extraAttributes: { required },
    } = formEl as CheckboxFieldInstance;

    if (required) {
      return currentValue === "true";
    }

    return true;
  },
};

function PropsComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    id,
    extraAttributes: { label, required, helperText },
  } = elementInstance as CheckboxFieldInstance;

  const { updateElement } = useDesigner();
  const form = useForm<CheckboxFieldPropsSchemaType>({
    resolver: zodResolver(CheckboxFieldPropsSchema),
    mode: "onBlur",
    defaultValues: {
      label,
      helperText,
      required,
    },
  });

  useEffect(() => {
    form.setFocus("label", { shouldSelect: true });
  }, [elementInstance, form, form.setFocus]);

  useEffect(() => {
    form.reset(elementInstance.extraAttributes);
  }, [form, elementInstance]);

  function applyChanges(values: CheckboxFieldPropsSchemaType) {
    const { label, helperText, required } = values;
    updateElement(id, {
      ...elementInstance,
      extraAttributes: {
        label,
        helperText,
        required,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        onBlur={form.handleSubmit(applyChanges)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The Label of the Checkbox field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Helper text</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The Helper text of the Checkbox field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="required"
          render={({ field }) => {
            return (
              <FormItem className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                <div className="space-y-0 5">
                  <FormLabel>Required</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const {
    extraAttributes: { label, required, helperText },
  } = elementInstance as CheckboxFieldInstance;
  const id = `checkbox-${elementInstance.id}`;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Checkbox id={id} />
      <div className="grid gap-2 leading-none">
        <Label htmlFor={id}>
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
        )}
      </div>
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitFn,
  isValid,
  defaultValue = "",
}: {
  elementInstance: FormElementInstance;
  submitFn?: SubmitFnType;
  isValid?: boolean;
  defaultValue?: string;
}) {
  const [value, setValue] = useState<boolean>(defaultValue === "true");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(isValid === false); // can be undefined ...
  }, [isValid]);

  const {
    extraAttributes: { label, required, helperText },
  } = elementInstance as CheckboxFieldInstance;

  const id = `checkbox-${elementInstance.id}`;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Checkbox
        id={id}
        checked={value}
        className={cn(hasError && "border-red-500")}
        onCheckedChange={(checked) => {
          setValue(checked === true);
          if (!submitFn) return;
          const strValue = value ? "true" : "false";
          const valid = CheckboxFieldElement.validate(
            elementInstance,
            strValue,
          );
          setHasError(!valid);
          submitFn(elementInstance.id, strValue);
        }}
      />
      <div className="grid gap-2 leading-none">
        <Label className={cn(hasError && "text-red-500")} htmlFor={id}>
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p
            className={cn(
              "text-muted-foreground text-[0.8rem]",
              hasError && "text-red-500",
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}

type CheckboxFieldPropsSchemaType = z.infer<typeof CheckboxFieldPropsSchema>;
