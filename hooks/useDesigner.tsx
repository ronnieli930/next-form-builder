"use client";

import { DesignerContext } from "@/contexts/DesignerContext";
import React, { useContext } from "react";

function useDesigner() {
  const ctx = useContext(DesignerContext);

  if (!ctx) {
    throw new Error("useDesigner must be used within a Designer Context");
  }

  return ctx;
}

export default useDesigner;
