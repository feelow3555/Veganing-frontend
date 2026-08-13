import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
    const navigate = useNavigate();
    const handleClick = (e) => {
        e.preventDefault();
        navigate(`/store/${product.id}`);
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation(); 

        navigate("/order", {
            state: {
                productId: product.id,
                quantity: 1
            }
        });
    };
    
    return (
        <a
            href="#"
            onClick={handleClick}
            className="w-full group cursor-pointer block"
        >
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img
                    src={
                        product.image ||
                        "https://via.placeholder.com/200x200/10b981/ffffff?text=Vegan"
                    }
                    alt={product.name || product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.isNew && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 rounded text-white text-[10px] font-medium">
                        신상품
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-1">
                <div className="text-gray-500 text-[10px] font-normal">
                    {product.brand || "VeganHealth"}
                </div>

                <h3 className="text-gray-900 text-sm font-normal line-clamp-2 leading-tight">
                    {product.name || product.title}
                </h3>

                <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-[10px]">
                        <span className="text-yellow-400">★★★★★</span>
                    </div>
                    <span className="text-gray-500 text-[10px]">(267)</span>
                </div>

                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-bold text-gray-900">
                        {(product.price || 28000).toLocaleString()}원
                    </span>
                </div>

                <div className="text-emerald-600 text-xs font-medium">
                    내일(화) 도착 보장
                </div>
            </div>
        </a>
    );
}

export default ProductCard;
