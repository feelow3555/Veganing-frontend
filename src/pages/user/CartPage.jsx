import React from "react";
import { useNavigate } from "react-router-dom";
import CartSection from "./CartSection";

export default function CartPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            장바구니
        </h1>

        <CartSection navigate={navigate} />
        </div>
    </div>
    );
}
