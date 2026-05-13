import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import AddProductModal from '@/components/features/AddProductModal';
import {
  Plus,
  Trash2,
  Edit3,
  Package,
  LogOut,
  ShoppingBag,
  ArrowLeft,
  Eye,
  Settings,
  Lock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

type ActiveTab = 'products' | 'settings';

export default function AdminDashboard() {
  const { t, lang, isRTL } = useLanguage();
  const { isAdmin, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');

  // Change password state
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    setProducts(getProducts());
  }, [isAdmin, navigate]);

  const handleSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
    setProducts(getProducts());
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);
    if (passForm.newPass !== passForm.confirm) {
      setPassError(t.passwordMismatch);
      return;
    }
    setPassLoading(true);
    setTimeout(() => {
      const result = changePassword(passForm.current, passForm.newPass);
      if (result.success) {
        setPassSuccess(true);
        setPassForm({ current: '', newPass: '', confirm: '' });
      } else {
        if (result.error === 'current_wrong') setPassError(t.wrongCurrentPassword);
        else if (result.error === 'too_short') setPassError(t.passwordTooShort);
        else setPassError(t.invalidCredentials);
      }
      setPassLoading(false);
    }, 500);
  };

  const productName = (p: Product) => lang === 'ar' ? p.nameAr : p.nameEn;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pb-16" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="fixed inset-0 bg-dark -z-10">
        <div className="absolute top-1/4 start-1/3 w-96 h-96 rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute bottom-1/4 end-1/3 w-64 h-64 rounded-full bg-gold/3 blur-[80px]" />
      </div>

      {/* Dashboard Header */}
      <div className="glass-header sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} className={isRTL ? 'rotate-180' : ''} />
            </button>
            <div>
              <h1 className="text-white font-cairo font-bold text-base leading-none">{t.adminDashboard}</h1>
              <p className="text-white/40 font-cairo text-xs">{t.manageProducts}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn text-white/60 hover:text-white text-xs font-cairo transition-colors"
            >
              <Eye size={12} />
              <span className="hidden sm:inline">{isRTL ? 'عرض المتجر' : 'View Store'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn text-white/60 hover:text-red-400 text-xs font-cairo transition-colors"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-2 glass-card rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-cairo text-sm transition-all duration-200 ${
              activeTab === 'products'
                ? 'bg-gold text-dark font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Package size={14} />
            {t.manageProducts}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-cairo text-sm transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-gold text-dark font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Settings size={14} />
            {t.settings}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ============ PRODUCTS TAB ============ */}
        {activeTab === 'products' && (
          <>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
              <Package size={18} className="text-gold" />
            </div>
            <div>
              <p className="text-white font-cairo font-bold text-2xl leading-none">{products.length}</p>
              <p className="text-white/50 font-cairo text-xs mt-1">{t.totalProducts}</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-cairo font-bold text-2xl leading-none">{products.length}</p>
              <p className="text-white/50 font-cairo text-xs mt-1">{isRTL ? 'منتج نشط' : 'Active'}</p>
            </div>
          </div>
        </div>

        {/* Products Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-cairo font-semibold text-lg">{t.manageProducts}</h2>
          <button
            onClick={() => { setEditingProduct(null); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-dark font-cairo font-bold text-sm hover:bg-gold-light transition-all duration-300 active:scale-95"
          >
            <Plus size={16} />
            {t.addProduct}
          </button>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full glass-inner flex items-center justify-center">
              <Package size={32} className="text-white/30" />
            </div>
            <p className="text-white/50 font-cairo text-lg">{t.noProducts}</p>
            <button
              onClick={() => { setEditingProduct(null); setShowAddModal(true); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-dark font-cairo font-bold text-sm hover:bg-gold-light transition-all duration-300"
            >
              <Plus size={16} />
              {t.addProduct}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="glass-card rounded-xl overflow-hidden group">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={productName(product)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <ShoppingBag size={32} className="text-white/20" />
                    </div>
                  )}
                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="w-10 h-10 rounded-full bg-gold text-dark flex items-center justify-center hover:bg-gold-light transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-10 h-10 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-white font-cairo font-medium text-sm truncate">{productName(product)}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gold font-cairo font-bold text-sm">
                      {product.price.toLocaleString()} {t.currency}
                    </span>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map((c) => (
                        <span key={c} className="text-white/40 text-xs font-cairo">·{c}</span>
                      ))}
                    </div>
                  </div>
                  {product.sizes.length > 0 && (
                    <p className="text-white/30 text-xs font-cairo mt-1 truncate">
                      {product.sizes.join(' · ')}
                    </p>
                  )}
                  {/* Quick actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 py-1.5 rounded-lg glass-btn text-gold font-cairo text-xs flex items-center justify-center gap-1 hover:text-gold-light transition-colors"
                    >
                      <Edit3 size={11} />
                      {t.editProduct}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 py-1.5 rounded-lg glass-btn text-red-400/70 font-cairo text-xs flex items-center justify-center gap-1 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={11} />
                      {t.deleteProduct}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* ============ SETTINGS TAB ============ */}
        {activeTab === 'settings' && (
          <div className="max-w-md">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                  <Lock size={18} className="text-gold" />
                </div>
                <div>
                  <h2 className="text-white font-cairo font-bold text-base">{t.changePassword}</h2>
                  <p className="text-white/40 font-cairo text-xs">{isRTL ? 'تحديث بيانات دخول المشرف' : 'Update admin credentials'}</p>
                </div>
              </div>

              {/* Success Banner */}
              {passSuccess && (
                <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-4 py-3 mb-4">
                  <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                  <p className="text-emerald-400 font-cairo text-sm">{t.passwordUpdated}</p>
                </div>
              )}

              {/* Error Banner */}
              {passError && (
                <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                  <XCircle size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-400 font-cairo text-sm">{passError}</p>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-white/60 text-xs font-cairo mb-1.5">{t.currentPassword} *</label>
                  <input
                    type="password"
                    value={passForm.current}
                    onChange={(e) => { setPassForm((p) => ({ ...p, current: e.target.value })); setPassError(''); setPassSuccess(false); }}
                    className="w-full glass-input font-cairo text-sm"
                    dir="ltr"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-cairo mb-1.5">{t.newPassword} *</label>
                  <input
                    type="password"
                    value={passForm.newPass}
                    onChange={(e) => { setPassForm((p) => ({ ...p, newPass: e.target.value })); setPassError(''); setPassSuccess(false); }}
                    className="w-full glass-input font-cairo text-sm"
                    dir="ltr"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-cairo mb-1.5">{t.confirmNewPassword} *</label>
                  <input
                    type="password"
                    value={passForm.confirm}
                    onChange={(e) => { setPassForm((p) => ({ ...p, confirm: e.target.value })); setPassError(''); setPassSuccess(false); }}
                    className="w-full glass-input font-cairo text-sm"
                    dir="ltr"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full py-3 rounded-xl bg-gold text-dark font-cairo font-bold text-sm hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {passLoading ? (
                    <div className="w-4 h-4 border-2 border-dark/40 border-t-dark rounded-full animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )}
                  {t.updatePassword}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => { setShowAddModal(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}
