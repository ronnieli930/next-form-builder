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

export const formElementGroup: FormElementGroupType = {
  [FormElementEnum.TextField]: TextFieldElement,
  [FormElementEnum.TitleField]: TitleFieldElement,
  [FormElementEnum.SubtitleField]: SubtitleFieldElement,
  [FormElementEnum.ParagraphField]: ParagraphFieldElement,
  [FormElementEnum.DividerField]: DividerFieldElement,
  [FormElementEnum.SpacerField]: SpacerFieldElement,
};
