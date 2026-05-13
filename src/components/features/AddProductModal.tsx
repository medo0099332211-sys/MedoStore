import React, { useState, useRef } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Upload, ImageIcon, Plus, Minus } from 'lucide-react';
import { generateId } from '@/lib/storage';

interface AddProductModalProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export default function AddProductModal({ product, onSave, onClose }: AddProductModalProps) {
  const { t, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nameAr: product?.nameAr || '',
    nameEn: product?.nameEn || '',
    price: product?.price?.toString() || '',
    descriptionAr: product?.descriptionAr || '',
    descriptionEn: product?.descriptionEn || '',
    colorsInput: product?.colors.join('، ') || '',
    sizesInput: product?.sizes.join('، ') || '',
    image: product?.image || '',
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, image: ev.target?.result as string }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nameAr.trim()) newErrors.nameAr = t.required;
    if (!form.nameEn.trim()) newErrors.nameEn = t.required;
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = t.required;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseList = (input: string): string[] => {
    return input
      .split(/[,،\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const saved: Product = {
      id: product?.id || generateId(),
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      price: Number(form.price),
      image: form.image,
      colors: parseList(form.colorsInput),
      sizes: parseList(form.sizesInput),
      descriptionAr: form.descriptionAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      createdAt: product?.createdAt || Date.now(),
    };

    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-modal w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <button onClick={onClose} className="absolute top-4 end-4 text-white/60 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white font-cairo mb-5">
          {product ? t.editProduct : t.addProduct}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-2">{t.productImage}</label>
            <div className="flex items-center gap-3">
              <div
                className="w-24 h-24 rounded-xl glass-inner flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer border-2 border-dashed border-white/20 hover:border-gold/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {form.image ? (
                  <img src={form.image} alt="product" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-white/40">
                    <ImageIcon size={20} />
                    <span className="text-xs font-cairo">صورة</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass-btn text-white/80 hover:text-white font-cairo text-sm transition-colors"
                >
                  <Upload size={14} />
                  {uploading ? '...' : t.uploadImage}
                </button>
                <p className="text-white/30 text-xs font-cairo mt-1">JPG, PNG, WebP</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/70 text-xs font-cairo mb-1">{t.productNameAr} *</label>
              <input
                type="text"
                value={form.nameAr}
                onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))}
                className="w-full glass-input font-cairo text-sm"
                dir="rtl"
              />
              {errors.nameAr && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.nameAr}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-xs font-cairo mb-1">{t.productNameEn} *</label>
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
                className="w-full glass-input font-cairo text-sm"
                dir="ltr"
              />
              {errors.nameEn && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.nameEn}</p>}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-1">{t.productPrice} *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              min="0"
              className="w-full glass-input font-cairo text-sm"
              dir="ltr"
            />
            {errors.price && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.price}</p>}
          </div>

          {/* Colors */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-1">{t.productColors}</label>
            <input
              type="text"
              value={form.colorsInput}
              onChange={(e) => setForm((p) => ({ ...p, colorsInput: e.target.value }))}
              placeholder={t.colorsHint}
              className="w-full glass-input font-cairo text-sm"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-1">{t.productSizes}</label>
            <input
              type="text"
              value={form.sizesInput}
              onChange={(e) => setForm((p) => ({ ...p, sizesInput: e.target.value }))}
              placeholder={t.sizesHint}
              className="w-full glass-input font-cairo text-sm"
            />
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/70 text-xs font-cairo mb-1">{t.productDescAr}</label>
              <textarea
                value={form.descriptionAr}
                onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))}
                rows={2}
                className="w-full glass-input font-cairo text-sm resize-none"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-white/70 text-xs font-cairo mb-1">{t.productDescEn}</label>
              <textarea
                value={form.descriptionEn}
                onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))}
                rows={2}
                className="w-full glass-input font-cairo text-sm resize-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl glass-btn text-white/70 font-cairo text-sm hover:text-white transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-xl bg-gold text-dark font-cairo font-bold text-sm hover:bg-gold-light transition-all duration-300 active:scale-95"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
