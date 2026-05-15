import { Product } from '@/types';

// المفتاح الجديد لضمان تشغيل مخزن نظيف
const PRODUCTS_KEY = 'medo_final_store_v3';
const PASSWORD_KEY = 'medo_admin_password';
const DEFAULT_PASSWORD = '55555';

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving products:", error);
  }
}

export function addProduct(product: Product): void {
  const products = getProducts();
  // إضافة المنتج الجديد في البداية بدون أي قيود على العدد
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
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
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
    colors: ['أسود'],
    sizes: ['S', 'M', 'L'],
    descriptionAr: 'قطن ممتاز',
    descriptionEn: 'Premium cotton',
    createdAt: Date.now(),
  }
];

export function initDemoProducts(): void {
  const existing = getProducts();
  // التأكد من أن التهيأة تتم مرة واحدة للمخزن الجديد
  if (existing.length === 0 && !localStorage.getItem('medo_v3_seeded')) {
    saveProducts(DEMO_PRODUCTS);
    localStorage.setItem('medo_v3_seeded', 'true');
  }
}
