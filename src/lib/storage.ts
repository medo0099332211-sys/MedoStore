import { Product } from '@/types';

// تغيير اسم المفتاح لإجبار المتصفح على فتح مخزن جديد وإلغاء التعليقة القديمة
const PRODUCTS_KEY = 'medo_store_v2'; 
const PASSWORD_KEY = 'medo_admin_password';
const DEFAULT_PASSWORD = '55555';

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addProduct(product: Product): void {
  const products = getProducts();
  // التأكد من إضافة المنتج الجديد في أول القائمة
  products.unshift(product);
  saveProducts(products);
}

export function updateProduct(updated: Product): void {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    products[index] = updated;
    saveProducts(products);
  }
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getAdminPassword(): string {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
}

export function saveAdminPassword(newPassword: string): void {
  localStorage.setItem(PASSWORD_KEY, newPassword);
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo_1',
    nameAr: 'تيشيرت أسود كلاسيك',
    nameEn: 'Classic Black T-Shirt',
    price: 350,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    colors: ['أسود', 'أبيض', 'رمادي'],
    sizes: ['S', 'M', 'L', 'XL'],
    descriptionAr: 'تيشيرت كلاسيك بجودة قطن ممتازة',
    descriptionEn: 'Premium cotton classic t-shirt',
    createdAt: Date.now() - 6000,
  },
  {
    id: 'demo_2',
    nameAr: 'تيشيرت أوفرسايز',
    nameEn: 'Oversized Tee',
    price: 420,
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80',
    colors: ['بيج', 'كاكي', 'أزرق'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    descriptionAr: 'تيشيرت أوفرسايز ستريتوير',
    descriptionEn: 'Streetwear oversized tee',
    createdAt: Date.now() - 5000,
  },
  {
    id: 'demo_3',
    nameAr: 'هودي لوكس',
    nameEn: 'Luxury Hoodie',
    price: 850,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
    colors: ['أسود', 'كحلي', 'بورجوندي'],
    sizes: ['S', 'M', 'L', 'XL'],
    descriptionAr: 'هودي فاخر بقماش ثقيل الوزن',
    descriptionEn: 'Heavy-weight luxury hoodie',
    createdAt: Date.now() - 4000,
  },
  {
    id: 'demo_4',
    nameAr: 'هودي زيب أبيض',
    nameEn: 'White Zip Hoodie',
    price: 780,
    image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80',
    colors: ['أبيض', 'رمادي فاتح', 'أوف وايت'],
    sizes: ['M', 'L', 'XL'],
    descriptionAr: 'هودي بسحاب بتصميم عصري',
    descriptionEn: 'Modern zip-up hoodie design',
    createdAt: Date.now() - 3000,
  },
  {
    id: 'demo_5',
    nameAr: 'بنطلون كارجو',
    nameEn: 'Cargo Pants',
    price: 950,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    colors: ['أسود', 'زيتي', 'رمادي'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    descriptionAr: 'بنطلون كارجو ستريتوير بجيوب متعددة',
    descriptionEn: 'Multi-pocket streetwear cargo pants',
    createdAt: Date.now() - 2000,
  },
  {
    id: 'demo_6',
    nameAr: 'بنطلون جوجر رياضي',
    nameEn: 'Jogger Pants',
    price: 620,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
    colors: ['أسود', 'كحلي', 'رمادي داكن'],
    sizes: ['S', 'M', 'L', 'XL'],
    descriptionAr: 'بنطلون جوجر مريح بقماش عالي الجودة',
    descriptionEn: 'Premium comfort jogger pants',
    createdAt: Date.now() - 1000,
  },
];

export function initDemoProducts(): void {
  const existing = getProducts();
  // التأكد من تهيئة المنتجات التجريبية في المخزن الجديد
  if (existing.length === 0 && !localStorage.getItem('medo_v2_seeded')) {
    saveProducts(DEMO_PRODUCTS);
    localStorage.setItem('medo_v2_seeded', 'true');
  }
}
