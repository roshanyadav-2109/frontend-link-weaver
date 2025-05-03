
import { useState, useEffect } from 'react';

// Define the product interface (matching the one in CatalogRequestForm)
export interface ProductInfo {
  id?: string;
  name: string;
  category?: string;
  subcategory?: string;
}

const MAX_VIEWED_PRODUCTS = 10;

export function useProductTracking() {
  const [viewedProducts, setViewedProducts] = useState<ProductInfo[]>([]);

  // Load viewed products from localStorage on component mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('viewedProducts');
      if (storedProducts) {
        setViewedProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error loading viewed products from localStorage:', error);
    }
  }, []);

  // Track a viewed product
  const trackProductView = (product: ProductInfo) => {
    if (!product.id || !product.name) return;

    setViewedProducts((prevProducts) => {
      // Remove product if it already exists (to avoid duplicates)
      const filteredProducts = prevProducts.filter(p => p.id !== product.id);
      
      // Add product to the beginning of the array
      const updatedProducts = [product, ...filteredProducts];
      
      // Limit to a maximum number of products
      const limitedProducts = updatedProducts.slice(0, MAX_VIEWED_PRODUCTS);
      
      // Store in localStorage
      try {
        localStorage.setItem('viewedProducts', JSON.stringify(limitedProducts));
      } catch (error) {
        console.error('Error storing viewed products in localStorage:', error);
      }
      
      return limitedProducts;
    });
  };

  // Clear viewed products history
  const clearViewedProducts = () => {
    localStorage.removeItem('viewedProducts');
    setViewedProducts([]);
  };

  return {
    viewedProducts,
    trackProductView,
    clearViewedProducts
  };
}

export default useProductTracking;
