import useDesigner from "@/hooks/useDesigner";
import { FormElementEnum, FormElementInstance } from "@/lib/form-builder/types";
import { cn, idGenerator } from "@/lib/utils";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { BiSolidTrash } from "react-icons/bi";
import DesignerSidebar from "./DesignerSidebar";
import { formElementGroup } from "./FormElement";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";

function Designer() {
  const {
    elements,
    selectedElement,
    addElement,
    setSelectedElement,
    removeElement,
  } = useDesigner();

  const droppable = useDroppable({
    id: "form-designer-drop-area",
    data: {
      isFormDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerElement = active.data?.current?.isDesignerElement;

      const isDesignerElementBtn = active.data?.current?.isDesignerElementBtn;
      const isFormDesignerDropEmptyArea =
        over.data?.current?.isFormDesignerDropArea;

      const isOverFormElement =
        over.data?.current?.isTopHalf || over.data?.current?.isBottomHalf;

      const type = active?.data?.current?.type;
      const newElement = formElementGroup[type as FormElementEnum].construct(
        idGenerator()
      );

      if (isDesignerElementBtn) {
        let targetIndex;
        if (isFormDesignerDropEmptyArea) {
          // 1st scenario: dropping a sidebar btn over the drop area (but not on other field)
          // append at last
          targetIndex = elements.length;
        } else {
          const dropOnElId = over.data?.current?.elementId;
          const dropOnElIndex = elements.findIndex((e) => e.id === dropOnElId);

          if (dropOnElIndex === -1) {
            throw new Error("Target element not found");
          }
          if (over.data?.current?.isTopHalf) {
            // 2nd scenario: dropping a sidebar btn over other field top half
            targetIndex = dropOnElIndex;
          } else if (over.data?.current?.isBottomHalf) {
            // 3rd scenario: dropping a sidebar btn over other field bottom half
            targetIndex = dropOnElIndex + 1;
          }
        }
        if (!isNil(targetIndex)) {
          addElement(newElement, targetIndex);
        }
      }

      if (isDesignerElement && isOverFormElement) {
        const activeElementId = active.data.current?.elementId;
        const overElementId = over.data?.current?.elementId;
        if (activeElementId === overElementId) return;
        const overElementIndex = elements.findIndex(
          (e) => e.id === overElementId
        );
        const activeElement = elements.find((e) => e.id === activeElementId);
        if (overElementIndex === -1 || !activeElement) {
          throw new Error("Target element not found");
        }
        removeElement(activeElementId);

        addElement(
          activeElement,
          over.data?.current?.isTopHalf
            ? overElementIndex
            : overElementIndex + 1
        );
      }
      // TODO clear up the logics here
      // about reordering and inserting
      if (isDesignerElement && isFormDesignerDropEmptyArea) {
        const activeElementId = active.data.current?.elementId;
        const activeElement = elements.find((e) => e.id === activeElementId);
        if (!activeElement) {
          throw new Error("Target element not found");
        }
        removeElement(activeElementId);
        addElement(activeElement, elements.length);
      }
    },
  });

  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={(e) => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-lg flex flex-col flex-grow items-center juscenter flex-1 overflow-y-auto",
            droppable.isOver && "ring-2 ring-primary ring-inset"
          )}
        >
          {!droppable.isOver && elements.length === 0 && <EmptyPlaceholder />}
          {droppable.isOver && elements.length === 0 && (
            <ElementPositionShadow />
          )}
          {elements.length > 0 && (
            <div className="flex flex-col w-full gap-2 p-4">
              {elements.map((el) => (
                <DesignerElementWrapper key={el.id} element={el} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const { removeElement, setSelectedElement } = useDesigner();

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalf: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalf: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  const DesignerElement = formElementGroup[element.type].designerComponent;

  // Show original position while dragging
  // if (draggable.isDragging) return null;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className={cn(
          "absolute w-full h-1/2"
          // topHalf.isOver && "bg-green-400"
        )}
      />
      <div
        ref={bottomHalf.setNodeRef}
        className={cn(
          "absolute w-full h-1/2 bottom-0"
          // bottomHalf.isOver && "bg-red-400"
        )}
      />

      {isMouseOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <BiSolidTrash color="#fff" className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse text-muted-foreground duration-1000 text-sm">
            Click for Properties or drag to move
          </div>
        </>
      )}

      {topHalf.isOver && <DraggingBorder position="top" />}
      {bottomHalf.isOver && <DraggingBorder position="bottom" />}

      <div
        className={cn(
          "flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",
          isMouseOver && "opacity-30"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  );
}

function DraggingBorder({ position }: { position: "top" | "bottom" }) {
  return position === "top" ? (
    <div
      className={cn(
        "absolute w-full rounded-md h-[2px] bg-primary rounded-b-none"
      )}
    />
  ) : (
    <div
      className={cn(
        "absolute w-full rounded-md h-[2px] bg-primary rounded-t-none bottom-0"
      )}
    />
  );
}

function EmptyPlaceholder() {
  return (
    <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
      Drop here
    </p>
  );
}

function ElementPositionShadow() {
  return (
    <div className="p-4 w-full">
      <div className="h-[120px] rounded-md bg-primary/20"></div>
    </div>
  );
}

export default Designer;
