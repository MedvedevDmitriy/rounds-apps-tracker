import type { ReactNode } from "react";

type AlertVariant = "error" | "warning";

export function Alert({
  variant,
  children,
  className,
}: {
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
}) {
  const role = variant === "error" ? "alert" : "status";
  return (
    <div
      className={`alert alert-${variant}${className ? ` ${className}` : ""}`}
      role={role}
    >
      {children}
    </div>
  );
}
