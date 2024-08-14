import { FormElement } from "@/lib/form-builder/types";
import { Button } from "./ui/button";

export function SidebarElementBtnDraggingOverlay({
  formElement,
}: {
  formElement: FormElement;
}) {
  const { icon: Icon, label } = formElement.designerBtnElement;
  return (
    <Button
      variant="outline"
      className="flex flex-col gap-2 h-[120px] w-[120px] cursor-grab opacity-60"
    >
      <Icon className="h-8 w-8 text-primary" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}
