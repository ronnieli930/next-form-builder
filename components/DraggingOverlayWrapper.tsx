import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { formElementGroup } from "./FormElement";
import { FormElementEnum } from "@/lib/form-builder/types";
import { SidebarElementBtnDraggingOverlay } from "./SidebarElementBtnDraggingOverlay";
import useDesigner from "@/hooks/useDesigner";

function DraggingOverlayWrapper() {
  const { elements } = useDesigner();
  const [draggingItem, setDraggingItem] = useState<Active | null>(null);
  useDndMonitor({
    onDragStart: (event) => {
      setDraggingItem(event.active);
    },
    onDragCancel: () => {
      setDraggingItem(null);
    },
    onDragEnd: () => {
      setDraggingItem(null);
    },
  });

  if (!draggingItem) return null;
  let overlay = <>No drag overlay</>;

  const isSidebarElementBtn = draggingItem?.data?.current?.isDesignerElementBtn;

  if (isSidebarElementBtn) {
    const type = draggingItem?.data?.current?.type as FormElementEnum;
    overlay = (
      <SidebarElementBtnDraggingOverlay formElement={formElementGroup[type]} />
    );
  }

  const isDesignerElement = draggingItem?.data?.current?.isDesignerElement;

  if (isDesignerElement) {
    const elementId = draggingItem?.data?.current?.elementId;
    const element = elements.find((e) => e.id === elementId);
    if (!element) return <>Element Not Found</>;
    const DesignerElementComponent =
      formElementGroup[element.type].designerComponent;

    overlay = (
      <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-70 pointer-events-none">
        <DesignerElementComponent elementInstance={element} />
      </div>
    );
  }

  return <DragOverlay>{overlay}</DragOverlay>;
}

export default DraggingOverlayWrapper;
