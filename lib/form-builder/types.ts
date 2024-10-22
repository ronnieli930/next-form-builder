export enum FormElementEnum {
  TextField = "TEXT_FIELD",
  TitleField = "TITLE_FIELD",
  SubtitleField = "SUBTITLE_FIELD",
  ParagraphField = "PARAGRAPH_FIELD",
  DividerField = "DIVIDER_FIELD",
  SpacerField = "SPACER_FIELD",
}

export type FormElementInstance = {
  id: string;
  type: FormElementEnum;
  extraAttributes?: Record<string, any>;
};

export type SubmitFnType = (key: string, value: string) => void;

export type FormElement = {
  construct: (id: string) => FormElementInstance;

  type: FormElementEnum;
  designerBtnElement: {
    icon: React.ElementType;
    label: string;
  };

  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  formComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitFn?: SubmitFnType;
    isValid?: boolean;
    defaultValue?: string;
  }>;
  propsComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;

  validate: (formEl: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementGroupType = {
  [key in FormElementEnum]: FormElement;
};
