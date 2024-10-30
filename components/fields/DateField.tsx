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
import { BsFillCalendarDateFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

const type = FormElementEnum.DateField;

const extraAttributes = {
  label: "Date field",
  helperText: "Pick a Date",
  required: false,
};

const dateFieldPropsSchema = z.object({
  label: z.string().min(1).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
});

type DateFieldInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const DateFieldElement: FormElement = {
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
    icon: BsFillCalendarDateFill,
    label: "Date field",
  },
  validate: (formEl: FormElementInstance, currentValue: string): boolean => {
    console.log("currentValue", currentValue);
    const {
      extraAttributes: { required },
    } = formEl as DateFieldInstance;

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
    extraAttributes: { label, required, helperText },
  } = elementInstance as DateFieldInstance;

  const { updateElement } = useDesigner();
  const form = useForm<DateFieldPropsSchemaType>({
    resolver: zodResolver(dateFieldPropsSchema),
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

  function applyChanges(values: DateFieldPropsSchemaType) {
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
                <FormDescription>The Label of the Date field.</FormDescription>
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
                  The Helper text of the Date field.
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
  } = elementInstance as DateFieldInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>Pick a date</span>
      </Button>
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
  const [value, setValue] = useState(
    defaultValue ? new Date(defaultValue) : undefined,
  );
  const [hasError, setHasError] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined,
  );

  useEffect(() => {
    setHasError(isValid === false); // can be undefined ...
  }, [isValid]);

  const {
    extraAttributes: { label, required, placeholder, helperText },
  } = elementInstance as DateFieldInstance;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(hasError && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              hasError && "border-red-500",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              if (!submitFn) return;
              const value = date?.toUTCString() || "";
              const valid = DateFieldElement.validate(elementInstance, value);
              setHasError(!valid);
              submitFn(elementInstance.id, value);
            }}
          />
        </PopoverContent>
      </Popover>
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

type DateFieldPropsSchemaType = z.infer<typeof dateFieldPropsSchema>;
