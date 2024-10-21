"use client";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 15,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 10,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  return <DndContext sensors={sensors}>{children}</DndContext>;
}

export default layout;
