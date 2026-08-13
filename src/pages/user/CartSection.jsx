import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

import { useCart } from "../../context/CartContext.jsx";

function PillBadge({ children, className = "" }) {
    return (
        <span
            className={`inline-block text-xs px-2.5 py-1 rounded-full ${className}`}
        >
            {children}
        </span>
    );
}

export default function CartSection({ navigate }) {
    
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (cartItems.length > 0) {
            setSelectedItems(cartItems.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    }, [cartItems]);

    const handleOrder = () => {
        if (!navigate || selectedItems.length === 0) return;

        const selectedCartItems = cartItems.filter((item) =>
            selectedItems.includes(item.id)
        );

        const totalPrice = getTotalPrice();
        const shippingFee = totalPrice >= 30000 ? 0 : 3000;
        const finalAmount = totalPrice + shippingFee;

        navigate("/order", {
            state: {
                items: selectedCartItems,
                totalPrice,
                shippingFee,
                finalAmount,
            },
        });
    };

    const toggleSelectItem = (id) => {
        setSelectedItems((items) =>
            items.includes(id)
                ? items.filter((itemId) => itemId !== id)
                : [...items, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map((item) => item.id));
        }
    };

    const removeSelectedItems = () => {
        selectedItems.forEach((id) => removeFromCart(id));
    };

    const getTotalPrice = () => {
        return cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    return (
        <Card className="border-0 shadow-lg shadow-teal-100/50 rounded-3xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-800">장바구니</CardTitle>
                        <CardDescription>
                            {cartItems.length}개의 상품
                        </CardDescription>
                    </div>
                    {cartItems.length > 0 && (
                        <div className="flex gap-2">
                            <Button
                                onClick={toggleSelectAll}
                                variant="outline"
                                className="rounded-2xl border-2 border-teal-200"
                            >
                                {selectedItems.length === cartItems.length
                                    ? "전체 해제"
                                    : "전체 선택"}
                            </Button>
                            {selectedItems.length > 0 && (
                                <Button
                                    onClick={removeSelectedItems}
                                    variant="outline"
                                    className="rounded-2xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    선택 삭제
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                            <ShoppingCart className="w-12 h-12 text-teal-500" />
                        </div>
                        <h3 className="text-xl text-gray-800 mb-2">
                            장바구니가 비어있습니다
                        </h3>
                        <p className="text-gray-500 mb-6">
                            비건 쇼핑몰에서 상품을 담아보세요.
                        </p>
                        <Button
                            className="rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500"
                            onClick={() => navigate && navigate("/store")}
                        >
                            쇼핑몰 바로가기
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`p-4 rounded-2xl border-2 transition-all ${
                                    selectedItems.includes(item.id)
                                        ? "border-teal-300 bg-gradient-to-r from-teal-50/50 to-emerald-50/50"
                                        : "border-gray-200 bg-white"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() =>
                                            toggleSelectItem(item.id)
                                        }
                                        className="w-5 h-5 rounded border-2 border-teal-300 text-teal-500 focus:ring-teal-400 cursor-pointer"
                                    />

                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <PillBadge className="bg-teal-100 text-teal-700 mb-2">
                                            {item.category}
                                        </PillBadge>
                                        <h4 className="text-gray-800 mb-1">
                                            {item.name}
                                        </h4>
                                        <p className="text-lg text-teal-600">
                                            {item.price.toLocaleString()}원
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() =>
                                                updateQuantity(item.id, -1)
                                            }
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8 rounded-xl border-2 border-teal-200"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="w-12 text-center text-gray-800">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            onClick={() =>
                                                updateQuantity(item.id, 1)
                                            }
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8 rounded-xl border-2 border-teal-200"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="text-right w-32">
                                        <p className="text-sm text-gray-500 mb-1">
                                            소계
                                        </p>
                                        <p className="text-lg text-gray-800">
                                            {(
                                                item.price * item.quantity
                                            ).toLocaleString()}
                                            원
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => removeFromCart(item.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="w-8 h-8 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}

                        {/* 주문 요약 */}
                        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>
                                        선택 상품 ({selectedItems.length}개)
                                    </span>
                                    <span>
                                        {getTotalPrice().toLocaleString()}원
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>배송비</span>
                                    <span>
                                        {getTotalPrice() >= 30000
                                            ? "무료"
                                            : "3,000원"}
                                    </span>
                                </div>
                                <div className="h-px bg-teal-200" />
                                <div className="flex items-center justify-between text-xl text-gray-800">
                                    <span>총 결제금액</span>
                                    <span className="text-teal-600">
                                        {(
                                            getTotalPrice() +
                                            (getTotalPrice() >= 30000
                                                ? 0
                                                : 3000)
                                        ).toLocaleString()}
                                        원
                                    </span>
                                </div>
                            </div>

                            {getTotalPrice() < 30000 &&
                                getTotalPrice() > 0 && (
                                    <p className="text-sm text-gray-600 mb-4 text-center">
                                        {(
                                            30000 - getTotalPrice()
                                        ).toLocaleString()}
                                        원 더 담으면 무료배송.
                                    </p>
                                )}

                            <Button
                                disabled={selectedItems.length === 0}
                                onClick={handleOrder}
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                {selectedItems.length === 0
                                    ? "상품을 선택해주세요"
                                    : `${selectedItems.length}개 상품 주문하기`}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
