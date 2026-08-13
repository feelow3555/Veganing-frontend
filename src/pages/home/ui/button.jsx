import React from "react";
import clsx from "clsx";

export function Button({ children, className, size = "md", ...props }) {
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg font-semibold"
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl transition-all duration-300",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
