import React, { useState } from 'react';
import { Product, OrderData } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, MessageCircle, CheckCircle } from 'lucide-react';

interface OrderModalProps {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '201143304017';

export default function OrderModal({ product, selectedColor, selectedSize, onClose }: OrderModalProps) {
  const { t, lang, isRTL } = useLanguage();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    governorate: '',
    address: '',
    phone: '',
  });

  const productName = lang === 'ar' ? product.nameAr : product.nameEn;
  const total = product.price * quantity;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = t.required;
    if (!form.governorate) newErrors.governorate = t.required;
    if (!form.address.trim()) newErrors.address = t.required;
    if (!form.phone.trim()) newErrors.phone = t.required;
    else if (!/^01[0-9]{9}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = t.invalidPhone;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const orderData: OrderData = {
      productId: product.id,
      productNameAr: product.nameAr,
      productNameEn: product.nameEn,
      selectedColor,
      selectedSize,
      fullName: form.fullName,
      governorate: form.governorate,
      address: form.address,
      phone: form.phone,
      quantity,
      price: total,
    };

    sendToWhatsApp(orderData);
    setStep('success');
  };

  const sendToWhatsApp = (order: OrderData) => {
    const message = lang === 'ar'
      ? `🛍️ *طلب جديد من متجر ميدو*\n\n` +
        `📦 *المنتج:* ${order.productNameAr}\n` +
        `🎨 *اللون:* ${order.selectedColor || 'غير محدد'}\n` +
        `📐 *المقاس:* ${order.selectedSize || 'غير محدد'}\n` +
        `🔢 *الكمية:* ${order.quantity}\n` +
        `💰 *الإجمالي:* ${order.price.toLocaleString()} جنيه\n\n` +
        `👤 *الاسم:* ${order.fullName}\n` +
        `📍 *المحافظة:* ${order.governorate}\n` +
        `🏠 *العنوان:* ${order.address}\n` +
        `📞 *الهاتف:* ${order.phone}`
      : `🛍️ *New Order - MEDO STORE*\n\n` +
        `📦 *Product:* ${order.productNameEn}\n` +
        `🎨 *Color:* ${order.selectedColor || 'N/A'}\n` +
        `📐 *Size:* ${order.selectedSize || 'N/A'}\n` +
        `🔢 *Quantity:* ${order.quantity}\n` +
        `💰 *Total:* ${order.price.toLocaleString()} EGP\n\n` +
        `👤 *Name:* ${order.fullName}\n` +
        `📍 *Governorate:* ${order.governorate}\n` +
        `🏠 *Address:* ${order.address}\n` +
        `📞 *Phone:* ${order.phone}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass-modal w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {step === 'form' ? (
          <>
            {/* Header */}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white font-cairo">{t.orderTitle}</h2>
              <p className="text-gold font-cairo text-sm mt-1">{productName}</p>
            </div>

            {/* Product Info */}
            <div className="glass-inner rounded-xl p-3 mb-5 flex items-center gap-3">
              {product.image && (
                <img
                  src={product.image}
                  alt={productName}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-cairo font-medium text-sm truncate">{productName}</p>
                {selectedColor && (
                  <p className="text-white/60 font-cairo text-xs">{t.colors}: {selectedColor}</p>
                )}
                {selectedSize && (
                  <p className="text-white/60 font-cairo text-xs">{t.sizes}: {selectedSize}</p>
                )}
              </div>
              <div className="text-end flex-shrink-0">
                <p className="text-gold font-bold font-cairo text-sm">{product.price.toLocaleString()}</p>
                <p className="text-white/50 font-cairo text-xs">{t.currency}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-white/70 font-cairo text-sm">{t.quantity}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full glass-btn text-white flex items-center justify-center font-bold"
                >
                  −
                </button>
                <span className="text-white font-cairo font-bold text-lg w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full glass-btn text-gold flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-white/70 text-xs font-cairo mb-1">{t.fullName} *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full glass-input font-cairo text-sm"
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.fullName}</p>}
              </div>

              {/* Governorate */}
              <div>
                <label className="block text-white/70 text-xs font-cairo mb-1">{t.governorate} *</label>
                <select
                  value={form.governorate}
                  onChange={(e) => handleChange('governorate', e.target.value)}
                  className="w-full glass-input font-cairo text-sm"
                >
                  <option value="">{t.governoratePlaceholder}</option>
                  {t.governorates.map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
                {errors.governorate && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.governorate}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-white/70 text-xs font-cairo mb-1">{t.address} *</label>
                <textarea
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder={t.addressPlaceholder}
                  rows={2}
                  className="w-full glass-input font-cairo text-sm resize-none"
                />
                {errors.address && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.address}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white/70 text-xs font-cairo mb-1">{t.phone} *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full glass-input font-cairo text-sm"
                  dir="ltr"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1 font-cairo">{errors.phone}</p>}
              </div>

              {/* Total */}
              <div className="glass-inner rounded-xl p-3 flex items-center justify-between">
                <span className="text-white/70 font-cairo font-medium">{t.total}</span>
                <span className="text-gold font-cairo font-bold text-xl">
                  {total.toLocaleString()} {t.currency}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl glass-btn text-white/70 font-cairo text-sm hover:text-white transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 rounded-xl bg-[#25D366] text-white font-cairo font-bold text-sm hover:bg-[#1da355] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle size={16} />
                  {t.confirmOrder}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success */
          <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center">
              <CheckCircle size={40} className="text-[#25D366]" />
            </div>
            <h2 className="text-2xl font-bold text-white font-cairo">{t.successTitle}</h2>
            <p className="text-white/70 font-cairo text-base leading-relaxed">{t.successMessage}</p>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 rounded-xl bg-gold text-dark font-cairo font-bold hover:bg-gold-light transition-all duration-300"
            >
              {t.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
