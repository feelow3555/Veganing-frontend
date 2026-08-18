import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addCartItem, updateCartItem, removeCartItem, getToken } from "../api/backend";

const CartContext = createContext(null);

const normalizeCartItem = (item) => ({
    id: item.id ?? item.cartItemId,
    productId: item.productId ?? item.product?.id,
    name: item.productName ?? item.product?.name ?? item.name,
    price: item.price ?? item.product?.price ?? 0,
    image: item.imageUrl ?? item.product?.imageUrl ?? item.image,
    category: item.category ?? item.product?.category,
    quantity: item.quantity ?? 1,
});

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const loadCart = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setCartItems([]);
            return;
        }
        try {
            const res = await getCart(token);
            const items = res.data?.items || res.data?.content || res.data || [];
            setCartItems(items.map(normalizeCartItem));
        } catch (error) {
            console.error("장바구니 조회 실패:", error);
            setCartItems([]);
        }
    }, []);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const addToCart = async (product, quantity = 1) => {
        const token = getToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
        try {
            await addCartItem({ productId: product.id, quantity }, token);
            await loadCart();
        } catch (error) {
            console.error("장바구니 담기 실패:", error);
            alert(`장바구니 담기에 실패했습니다: ${error.message || "알 수 없는 오류"}`);
        }
    };

    const updateQuantity = async (id, delta) => {
        const token = getToken();
        if (!token) return;
        const target = cartItems.find((item) => item.id === id);
        if (!target) return;
        const nextQuantity = Math.max(1, target.quantity + delta);

        setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item))
        );
        try {
            await updateCartItem(id, { quantity: nextQuantity }, token);
        } catch (error) {
            console.error("수량 변경 실패:", error);
            await loadCart();
        }
    };

    const removeFromCart = async (id) => {
        const token = getToken();
        if (!token) return;
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        try {
            await removeCartItem(id, token);
        } catch (error) {
            console.error("장바구니 삭제 실패:", error);
            await loadCart();
        }
    };

    const clearCart = async () => {
        const token = getToken();
        if (!token) {
            setCartItems([]);
            return;
        }
        try {
            await Promise.all(cartItems.map((item) => removeCartItem(item.id, token)));
        } catch (error) {
            console.error("장바구니 비우기 실패:", error);
        } finally {
            await loadCart();
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                reloadCart: loadCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart는 CartProvider 안에서만 사용할 수 있습니다.");
    }
    return ctx;
}
