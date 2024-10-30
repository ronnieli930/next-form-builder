"use client";
import {
  FormElement,
  FormElementEnum,
  FormElementInstance,
  SubmitFnType,
} from "@/lib/form-builder/types";
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
import { Bs123 } from "react-icons/bs";

const type = FormElementEnum.NumberField;

const extraAttributes = {
  label: "Number field",
  helperText: "Helper text",
  required: false,
  placeholder: "value here...",
};

const numberFieldPropsSchema = z.object({
  label: z.string().min(1).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
});

type NumberFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const NumberFieldElement: FormElement = {
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
    icon: Bs123,
    label: "Number field",
  },
  validate: (formEl: FormElementInstance, currentValue: string): boolean => {
    console.log("currentValue", currentValue);
    const {
      extraAttributes: { required },
    } = formEl as NumberFieldInstance;

    if (required) {
      return currentValue.length > 0;
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
    extraAttributes: { label, required, placeholder, helperText },
  } = elementInstance as NumberFieldInstance;

  const { updateElement } = useDesigner();
  const form = useForm<NumberFieldPropsSchemaType>({
    resolver: zodResolver(numberFieldPropsSchema),
    mode: "onBlur",
    defaultValues: {
      label,
      helperText,
      required,
      placeholder,
    },
  });

  useEffect(() => {
    form.setFocus("label", { shouldSelect: true });
  }, [elementInstance, form, form.setFocus]);

  useEffect(() => {
    form.reset(elementInstance.extraAttributes);
  }, [form, elementInstance]);

  function applyChanges(values: NumberFieldPropsSchemaType) {
    const { label, helperText, placeholder, required } = values;
    updateElement(id, {
      ...elementInstance,
      extraAttributes: {
        label,
        helperText,
        placeholder,
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
                  The Label of the Number field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Placeholder</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required={false}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The Placeholder of the Number field.
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
                  The Helper text of the Number field.
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
    extraAttributes: { label, required, placeholder, helperText },
  } = elementInstance as NumberFieldInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeholder} />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
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
  const [value, setValue] = useState(defaultValue);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(isValid === false); // can be undefined ...
  }, [isValid]);

  const {
    extraAttributes: { label, required, placeholder, helperText },
  } = elementInstance as NumberFieldInstance;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(hasError && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        type="number"
        className={cn(hasError && "border-red-500")}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitFn) return;
          const valid = NumberFieldElement.validate(
            elementInstance,
            e.target.value,
          );

          console.log("valid", valid);

          setHasError(!valid);
          if (!valid) return;
          submitFn(elementInstance.id, e.target.value);
        }}
        value={value}
      />
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
  );
}

type NumberFieldPropsSchemaType = z.infer<typeof numberFieldPropsSchema>;
