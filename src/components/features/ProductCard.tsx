import React, { useState } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product, color: string, size: string) => void;
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
  const { t, lang, isRTL } = useLanguage();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');

  const productName = lang === 'ar' ? product.nameAr : product.nameEn;
  const productDesc = lang === 'ar' ? product.descriptionAr : product.descriptionEn;

  const handleOrder = () => {
    onOrder(product, selectedColor, selectedSize);
  };

  return (
    <div className="glass-card group overflow-hidden rounded-2xl flex flex-col transition-all duration-500 hover:scale-[1.02] hover:shadow-gold-glow">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        {product.image ? (
          <img
            src={product.image}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <ShoppingBag size={48} className="text-white/20" />
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute top-3 end-3">
          <span className="glass-price-badge font-cairo font-bold text-gold text-sm px-3 py-1 rounded-full">
            {product.price.toLocaleString()} {t.currency}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight font-cairo line-clamp-2">
            {productName}
          </h3>
          {productDesc && (
            <p className="text-white/50 text-sm mt-1 font-cairo line-clamp-2">
              {productDesc}
            </p>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div>
            <p className="text-white/60 text-xs font-cairo mb-2">{t.colors}</p>
            <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 rounded-full text-xs font-cairo transition-all duration-200 border ${
                    selectedColor === color
                      ? 'border-gold text-gold bg-gold/10'
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div>
            <p className="text-white/60 text-xs font-cairo mb-2">{t.sizes}</p>
            <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-9 h-9 rounded-lg text-xs font-cairo font-semibold transition-all duration-200 border ${
                    selectedSize === size
                      ? 'border-gold text-gold bg-gold/10'
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Order Button */}
        <button
          onClick={handleOrder}
          className="mt-auto w-full py-3 rounded-xl bg-gold text-dark font-cairo font-bold text-sm hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-gold-glow active:scale-95"
        >
          <ShoppingBag size={16} />
          {t.orderNow}
        </button>
      </div>
    </div>
  );
}
