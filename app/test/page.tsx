"use client";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import React, { useRef } from "react";

function page() {
  const testRef = useRef(null);

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      if (testRef.current) {
        console.log("focus");
        (testRef?.current as HTMLInputElement).focus();
      }
    },
  });

  const draggable = useDraggable({
    id: "drag",
  });

  const droppable = useDroppable({
    id: "drop",
  });
  return (
    <div>
      <div
        ref={draggable.setNodeRef}
        {...draggable.listeners}
        {...draggable.attributes}
        className="h-10 w-10 border border-yellow-200"
      >
        drag
      </div>
      <div
        ref={droppable.setNodeRef}
        className="h-10 w-10 border border-green-200"
      >
        drop
      </div>

      <form onSubmit={() => console.log("submit")}>
        <input ref={testRef} defaultValue={"default "} />
        <input type="submit" />
      </form>
    </div>
  );
}

export default page;
