import {
  FormElementGroupType,
  FormElementEnum,
} from "@/lib/form-builder/types";
import { TextFieldElement } from "./fields/TextField";
import { TitleFieldElement } from "./fields/TitleField";
import { SubtitleFieldElement } from "./fields/SubtitleField";
import { ParagraphFieldElement } from "./fields/ParagraphField";
import { DividerFieldElement } from "./fields/DividerField";
import { SpacerFieldElement } from "./fields/SpacerField";
import { NumberFieldElement } from "./fields/NumberField";
import { TextareaFieldElement } from "./fields/TextareaField";
import { DateFieldElement } from "./fields/DateField";
import { SelectFieldElement } from "./fields/SelectField";
import { CheckboxFieldElement } from "./fields/CheckboxField";

export const formElementGroup: FormElementGroupType = {
  [FormElementEnum.TextField]: TextFieldElement,
  [FormElementEnum.TitleField]: TitleFieldElement,
  [FormElementEnum.SubtitleField]: SubtitleFieldElement,
  [FormElementEnum.ParagraphField]: ParagraphFieldElement,
  [FormElementEnum.DividerField]: DividerFieldElement,
  [FormElementEnum.SpacerField]: SpacerFieldElement,
  [FormElementEnum.NumberField]: NumberFieldElement,
  [FormElementEnum.TextareaField]: TextareaFieldElement,
  [FormElementEnum.DateField]: DateFieldElement,
  [FormElementEnum.SelectField]: SelectFieldElement,
  [FormElementEnum.CheckboxField]: CheckboxFieldElement,
};
