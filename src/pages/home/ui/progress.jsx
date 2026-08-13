import React from "react";

export function Progress({ value, className }) {
    return (
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
            <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${value}%` }}
            />
        </div>
    );
}
