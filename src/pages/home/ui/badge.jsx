import React from "react";
import clsx from "clsx";

export function Badge({ className, children, variant = "default", ...props }) {
    const base =
        "inline-flex items-center rounded-full text-sm font-medium px-3 py-1";

    const variants = {
        default: "bg-teal-500 text-white",
        outline: "border border-teal-300 text-teal-700 bg-white",
    };

    return (
        <span className={clsx(base, variants[variant], className)} {...props}>
            {children}
        </span>
    );
}
