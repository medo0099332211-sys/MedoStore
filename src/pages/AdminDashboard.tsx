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

  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    // تحميل كافة المنتجات بدون أي قيود
    const allProducts = getProducts();
    setProducts(allProducts);
  }, [isAdmin, navigate]);

  const handleSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      // تم فتح الإضافة لعدد غير محدود (حتى 1000 منتج)
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
      <div className="fixed inset-0 bg-dark -z-10">
        <div className="absolute top-1/4 start-1/3 w-96 h-96 rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute bottom-1/4 end-1/3 w-64 h-64 rounded-full bg-gold/3 blur-[80px]" />
      </div>

      <div className="glass-header sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={18} className={isRTL ? 'rotate-180' : ''} />
            </button>
            <div>
              <h1 className="text-white font-cairo font-bold text-base leading-none">{t.adminDashboard}</h1>
              <p className="text-white/40 font-cairo text-xs">{t.manageProducts}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn text-white/60 hover:text-white text-xs font-cairo">
              <Eye size={12} />
              <span className="hidden sm:inline">{isRTL ? 'عرض المتجر' : 'View Store'}</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-btn text-white/60 hover:text-red-400 text-xs font-cairo">
              <LogOut size={12} />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-2 glass-card rounded-xl p-1 w-fit">
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-cairo text-sm ${activeTab === 'products' ? 'bg-gold text-dark font-bold' : 'text-white/60 hover:text-white'}`}>
            <Package size={14} />
            {t.manageProducts}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-cairo text-sm ${activeTab === 'settings' ? 'bg-gold text-dark font-bold' : 'text-white/60 hover:text-white'}`}>
            <Settings size={14} />
            {t.settings}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'products' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                  <Package size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-white font-cairo font-bold text-2xl leading-none">{products.length}</p>
                  <p className="text-white/50 font-cairo text-xs mt-1">{t.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-cairo font-semibold text-lg">{t.manageProducts}</h2>
              <button onClick={() => { setEditingProduct(null); setShowAddModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-dark font-cairo font-bold text-sm hover:bg-gold-light transition-all active:scale-95">
                <Plus size={16} />
                {t.addProduct}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="glass-card rounded-xl overflow-hidden group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={product.image} alt={productName(product)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={() => handleEdit(product)} className="w-10 h-10 rounded-full bg-gold text-dark flex items-center justify-center"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(product.id)} className="w-10 h-10 rounded-full bg-red-500/80 text-white flex items-center justify-center"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white font-cairo font-medium text-sm truncate">{productName(product)}</p>
                    <span className="text-gold font-cairo font-bold text-sm">{product.price.toLocaleString()} {t.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-md">
            {/* إعدادات تغيير الباسورد كما هي */}
            <div className="glass-card rounded-2xl p-6">
               {/* ... (بقية كود الفورم كما هو عندك) ... */}
               <h2 className="text-white font-cairo font-bold mb-4">تغيير كلمة المرور</h2>
               <form onSubmit={handleChangePassword} className="space-y-4">
                  <input type="password" placeholder="كلمة المرور الحالية" className="w-full glass-input p-2 rounded text-white" value={passForm.current} onChange={(e) => setPassForm({...passForm, current: e.target.value})} />
                  <input type="password" placeholder="كلمة المرور الجديدة" className="w-full glass-input p-2 rounded text-white" value={passForm.newPass} onChange={(e) => setPassForm({...passForm, newPass: e.target.value})} />
                  <input type="password" placeholder="تأكيد الكلمة الجديدة" className="w-full glass-input p-2 rounded text-white" value={passForm.confirm} onChange={(e) => setPassForm({...passForm, confirm: e.target.value})} />
                  <button type="submit" className="w-full bg-gold p-2 rounded font-bold">تحديث</button>
               </form>
            </div>
          </div>
        )}
      </div>

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
