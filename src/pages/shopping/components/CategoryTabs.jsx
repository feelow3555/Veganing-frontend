import { useState } from 'react';

import cart from "../../../assets/shopping/cart.svg"
import book from "../../../assets/shopping/book.svg"
import cosmetic from "../../../assets/shopping/cosmetic.svg"
import pill from "../../../assets/shopping/pill.svg"

function CategoryTabs({ selectedCategory, onCategoryChange }) {
    const categories = [
        { 
            id: 'FOOD', 
            label: '식품', 
            icon: cart 
        },
        { 
            id: 'BOOK', 
            label: '도서', 
            icon: book
        },
        { 
            id: 'COSMETIC', 
            label: '화장품', 
            icon: cosmetic 
        },
        { 
            id: 'SUPPLEMENT', 
            label: '영양제', 
            icon: pill
        }
    ];

    return (
        <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6 flex gap-2">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`flex-1 h-12 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedCategory === category.id
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <img 
                        src={category.icon} 
                        alt={category.label}
                        className={`w-6 h-6 object-contain ${
                            selectedCategory === category.id ? 'brightness-0 invert' : ''
                        }`}
                    />
                    <span className={`text-xs font-medium font-['Inter'] ${
                        selectedCategory === category.id ? 'text-white' : 'text-neutral-950'
                    }`}>
                        {category.label}
                    </span>
                </button>
            ))}
        </div>
    );
}

export default CategoryTabs;