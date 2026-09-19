import type { PropsWithChildren } from "react";

export function HeaderWrapper({ children }: PropsWithChildren) {
  return (
    <div className="h-10 w-full flex items-center justify-between">
      {children}
    </div>
  );
}

export function ContentWrapper({ children }: PropsWithChildren) {
  return (
    <div className="flex-1 w-full flex flex-col gap-3 overflow-auto">
      {children}
    </div>
  );
}

export function FooterWrapper({ children }: PropsWithChildren) {
  return (
    <div className="h-10 w-full flex items-center justify-between">
      {children}
    </div>
  );
}
