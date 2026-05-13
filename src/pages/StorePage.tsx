import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getProducts, initDemoProducts } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/features/ProductCard';
import OrderModal from '@/components/features/OrderModal';
import heroBg from '@/assets/hero-bg.jpg';
import { ShoppingBag, Sparkles } from 'lucide-react';

export default function StorePage() {
  const { t, isRTL } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderTarget, setOrderTarget] = useState<{
    product: Product;
    color: string;
    size: string;
  } | null>(null);

  useEffect(() => {
    initDemoProducts();
    setProducts(getProducts());
    const handleStorage = () => setProducts(getProducts());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleOrder = (product: Product, color: string, size: string) => {
    setOrderTarget({ product, color, size });
  };

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark" />

        {/* Decorative orbs */}
        <div className="absolute top-1/4 start-1/4 w-64 h-64 rounded-full bg-gold/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/3 end-1/4 w-48 h-48 rounded-full bg-gold/5 blur-[60px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={16} className="text-gold" />
            <span className="text-gold/80 font-cairo text-sm tracking-widest uppercase">Premium Fashion</span>
            <Sparkles size={16} className="text-gold" />
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white font-playfair tracking-wider mb-2">
            MEDO
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gold font-playfair tracking-[0.5em] mb-4">
            STORE
          </h2>
          <p className="text-white/70 font-cairo text-lg sm:text-xl mb-8 leading-relaxed">
            {t.storeTagline}
          </p>
          <a
            href="#products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold text-dark font-cairo font-bold text-base hover:bg-gold-light transition-all duration-300 hover:shadow-gold-glow active:scale-95"
          >
            <ShoppingBag size={18} />
            {t.allProducts}
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-cairo mb-2">
            {t.allProducts}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gold/60" />
            <div className="w-2 h-2 rounded-full bg-gold" />
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-24 h-24 rounded-full glass-inner flex items-center justify-center">
              <ShoppingBag size={36} className="text-white/30" />
            </div>
            <p className="text-white/60 font-cairo text-xl">{t.noProducts}</p>
            <p className="text-white/30 font-cairo text-sm">{t.noProductsDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onOrder={handleOrder} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center">
        <p className="text-white/30 font-cairo text-sm">
          © 2026 MEDO STORE · جميع الحقوق محفوظة
        </p>
      </footer>

      {/* Order Modal */}
      {orderTarget && (
        <OrderModal
          product={orderTarget.product}
          selectedColor={orderTarget.color}
          selectedSize={orderTarget.size}
          onClose={() => setOrderTarget(null)}
        />
      )}
    </div>
  );
}
