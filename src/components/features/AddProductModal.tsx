import React, { useState, useRef } from 'react';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Upload, ImageIcon } from 'lucide-react';
import { generateId } from '@/lib/storage';

interface AddProductModalProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export default function AddProductModal({ product, onSave, onClose }: AddProductModalProps) {
  const { t, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
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

  const parseList = (input: string): string[] => {
    return input.split(/[,،\n]/).map((s) => s.trim()).filter(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved: Product = {
      id: product?.id || generateId(),
      nameAr: form.nameAr || 'No Name',
      nameEn: form.nameEn || 'No Name',
      price: Number(form.price) || 0,
      image: form.image,
      colors: parseList(form.colorsInput),
      sizes: parseList(form.sizesInput),
      descriptionAr: form.descriptionAr,
      descriptionEn: form.descriptionEn,
      createdAt: product?.createdAt || Date.now(),
    };
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-modal w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-[#1a1a1a] border border-white/10" dir={isRTL ? 'rtl' : 'ltr'}>
        <button onClick={onClose} className="absolute top-4 end-4 text-white/60 hover:text-white"><X size={20} /></button>
        <h2 className="text-xl font-bold text-white font-cairo mb-5">{product ? t.editProduct : t.addProduct}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {form.image ? <img src={form.image} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-white/20" />}
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm">{uploading ? '...' : t.uploadImage}</button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="الاسم بالعربي" value={form.nameAr} onChange={(e) => setForm({...form, nameAr: e.target.value})} className="p-2 bg-white/5 border border-white/10 rounded text-white" />
            <input placeholder="Name in English" value={form.nameEn} onChange={(e) => setForm({...form, nameEn: e.target.value})} className="p-2 bg-white/5 border border-white/10 rounded text-white" />
          </div>
          <input placeholder="السعر" type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white" />
          <input placeholder="الألوان (افصل بفاصلة)" value={form.colorsInput} onChange={(e) => setForm({...form, colorsInput: e.target.value})} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white" />
          <input placeholder="المقاسات (افصل بفاصلة)" value={form.sizesInput} onChange={(e) => setForm({...form, sizesInput: e.target.value})} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white" />
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-white/60">إلغاء</button>
            <button type="submit" className="flex-[2] py-3 bg-[#D4AF37] text-black font-bold rounded-xl">حفظ المنتج</button>
          </div>
        </form>
      </div>
    </div>
  );
}
