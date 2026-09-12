import { useBootstrap } from "@/applications";
import type { PropsWithChildren } from "react";

export type BootstrapProviderProps = PropsWithChildren;

export function BootstrapProvider({ children }: BootstrapProviderProps) {
  const { isLoading, error } = useBootstrap();

  if (isLoading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (error) return <div className="text-red-500">{error.message}</div>;
  return children;
}
