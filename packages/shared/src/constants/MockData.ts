export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface TrendingItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  category: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Whole', icon: 'leaf-outline', color: '#2E8B57' },
  { id: '2', name: 'Ground', icon: 'color-fill-outline', color: '#8B4513' },
  { id: '3', name: 'Organic', icon: 'star-outline', color: '#E2B714' },
  { id: '4', name: 'Seeds', icon: 'ellipsis-horizontal-circle-outline', color: '#E8590C' },
  { id: '5', name: 'Herbs', icon: 'brush-outline', color: '#4A7C59' },
  { id: '6', name: 'Blends', icon: 'flask-outline', color: '#C41E3A' },
];

export const MOCK_TRENDING: TrendingItem[] = [
  { 
    id: 't1', 
    title: 'Kashmiri Saffron', 
    subtitle: 'Premium Grade (1g)', 
    image: 'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=400', 
    backgroundColor: '#FFF8E7' 
  },
  { 
    id: 't2', 
    title: 'Organic Turmeric', 
    subtitle: 'Golden Root Powder', 
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=400', 
    backgroundColor: '#FDF2E9' 
  },
];

export const ALL_PRODUCTS: Product[] = [
  { id: '1', name: 'Kashmiri Saffron (1g)', image: 'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=400', price: 499, originalPrice: 699, rating: 4.8, category: 'Organic' },
  { id: '2', name: 'Turmeric Powder (200g)', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=400', price: 129, originalPrice: 159, rating: 4.5, category: 'Ground' },
  { id: '3', name: 'Black Pepper (100g)', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400', price: 189, originalPrice: 229, rating: 4.7, category: 'Whole' },
  { id: '4', name: 'Green Cardamom (50g)', image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400', price: 249, originalPrice: 299, rating: 4.9, category: 'Seeds' },
  { id: '5', name: 'Cinnamon Sticks', image: 'https://images.unsplash.com/photo-1599940824399-b87987cb9c2a?q=80&w=400', price: 89, rating: 4.6, category: 'Whole' },
  { id: '6', name: 'Star Anise', image: 'https://images.unsplash.com/photo-1614735241165-6756e1df61ab?q=80&w=400', price: 145, rating: 4.4, category: 'Whole' },
];
