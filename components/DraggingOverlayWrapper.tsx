import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { formElementGroup } from "./FormElement";
import { FormElementEnum } from "@/lib/form-builder/types";
import { SidebarElementBtnDraggingOverlay } from "./SidebarElementBtnDraggingOverlay";

function DraggingOverlayWrapper() {
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

  const isSidebarElementBtn = draggingItem?.data?.current?.isDesignerElementBtn;

  if (isSidebarElementBtn) {
    const type = draggingItem?.data?.current?.type as FormElementEnum;

    return (
      <DragOverlay>
        <SidebarElementBtnDraggingOverlay
          formElement={formElementGroup[type]}
        />
      </DragOverlay>
    );
  }

  return null;
}

export default DraggingOverlayWrapper;
