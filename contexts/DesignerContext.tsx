"use client";

import { FormElementInstance } from "@/lib/form-builder/types";
import { createContext, ReactNode, useState } from "react";

type DesignerContextType = {
  elements: FormElementInstance[];
  addElement: (element: FormElementInstance, index: number) => void;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);

  const addElement = (element: FormElementInstance, index: number) => {
    setElements((prev) => [...prev].toSpliced(index, 0, element));
  };

  return (
    <DesignerContext.Provider value={{ elements, addElement }}>
      {children}
    </DesignerContext.Provider>
  );
}
