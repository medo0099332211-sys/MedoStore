export type Language = 'ar' | 'en';

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  image: string; // base64 or URL
  colors: string[];
  sizes: string[];
  descriptionAr?: string;
  descriptionEn?: string;
  createdAt: number;
}

export interface OrderData {
  productId: string;
  productNameAr: string;
  productNameEn: string;
  selectedColor: string;
  selectedSize: string;
  fullName: string;
  governorate: string;
  address: string;
  phone: string;
  quantity: number;
  price: number;
}
