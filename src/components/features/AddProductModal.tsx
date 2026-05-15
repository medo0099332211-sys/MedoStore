import React, { useState, useRef } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateId } from '@/lib/storage';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

interface AddProductModalProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

function parseList(str: string): string[] {
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AddProductModal({ product, onSave, onClose }: AddProductModalProps) {
  const { t, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nameAr: product?.nameAr || '',
    nameEn: product?.nameEn || '',
    price: product?.price?.toString() || '',
    image: product?.image || '',
    colorsInput: product?.colors?.join(', ') || '',
    sizesInput: product?.sizes?.join(', ') || '',
    descriptionAr: product?.descriptionAr || '',
    descriptionEn: product?.descriptionEn || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nameAr.trim()) newErrors.nameAr = t.required;
    if (!form.nameEn.trim()) newErrors.nameEn = t.required;
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = t.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setForm((prev) => ({ ...prev, image: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
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

    console.log('Saving product...', saved);
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-modal w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white font-cairo mb-5">
          {product ? t.editProduct : t.addProduct}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-2">{t.productImage}</label>
            <div
              className="relative w-full aspect-video rounded-xl glass-inner overflow-hidden cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload size={24} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
                  <Upload size={28} />
                  <span className="font-cairo text-sm">{t.uploadImage}</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Name Arabic */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-1">{t.productNameAr} *</label>
            <input
              type="text"
              value={form.nameAr}
              onChange={(e) => handleChange('nameAr', e.target.value)}
              className="w-full glass-input font-cairo text-sm"
              dir="rtl"
            />
            {errors.nameAr && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.nameAr}</p>}
          </div>

          {/* Name English */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-1">{t.productNameEn} *</label>
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => handleChange('nameEn', e.target.value)}
              className="w-full glass-input font-cairo text-sm"
              dir="ltr"
            />
            {errors.nameEn && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.nameEn}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-1">{t.productPrice} *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="w-full glass-input font-cairo text-sm"
              dir="ltr"
              min="1"
            />
            {errors.price && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.price}</p>}
          </div>

          {/* Colors */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-1">{t.productColors}</label>
            <input
              type="text"
              value={form.colorsInput}
              onChange={(e) => handleChange('colorsInput', e.target.value)}
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
              onChange={(e) => handleChange('sizesInput', e.target.value)}
              placeholder={t.sizesHint}
              className="w-full glass-input font-cairo text-sm"
              dir="ltr"
            />
          </div>

          {/* Description Arabic */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-1">{t.productDescAr}</label>
            <textarea
              value={form.descriptionAr}
              onChange={(e) => handleChange('descriptionAr', e.target.value)}
              rows={2}
              className="w-full glass-input font-cairo text-sm resize-none"
              dir="rtl"
            />
          </div>

          {/* Description English */}
          <div>
            <label className="block text-white/70 text-xs font-cairo mb-1">{t.productDescEn}</label>
            <textarea
              value={form.descriptionEn}
              onChange={(e) => handleChange('descriptionEn', e.target.value)}
              rows={2}
              className="w-full glass-input font-cairo text-sm resize-none"
              dir="ltr"
            />
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
