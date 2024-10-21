"use client";

import { FormElementInstance } from "@/lib/form-builder/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type DesignerContextType = {
  elements: FormElementInstance[];
  addElement: (element: FormElementInstance, index: number) => void;
  removeElement: (id: string) => void;

  selectedElement: FormElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;

  updateElement: (id: string, el: FormElementInstance) => void;
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);

  const addElement = (element: FormElementInstance, index: number) => {
    setElements((prev) => prev.toSpliced(index, 0, element));
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (id === selectedElement?.id) {
      setSelectedElement(null);
    }
  };

  const updateElement = (id: string, el: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      const index = newElements.findIndex((el) => el.id === id);
      newElements[index] = el;
      return newElements;
    });
  };

  return (
    <DesignerContext.Provider
      value={{
        elements,
        addElement,
        removeElement,
        selectedElement,
        setSelectedElement,
        updateElement,
        setElements,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
