import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-grow flex-col w-full mx-auto">{children}</div>
  );
}

export default Layout;
