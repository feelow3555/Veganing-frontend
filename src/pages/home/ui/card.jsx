import React from "react";
import clsx from "clsx";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={clsx(
                "rounded-2xl bg-white shadow-lg border border-gray-200",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={clsx("p-6 border-b border-gray-100", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={clsx("text-xl font-bold", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={clsx("p-6", className)} {...props}>
            {children}
        </div>
    );
}
