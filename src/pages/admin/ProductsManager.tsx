
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  X,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

// Product shape matches your Supabase "products" schema
interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  image: string;
  status: 'active' | 'draft';
}

const categories = [
  { id: 'textiles', name: 'Textile Clothing' },
  { id: 'electronics', name: 'Electronic Audios' },
];

const subcategories: Record<string, Array<{id: string, name: string}>> = {
  textiles: [
    { id: 'cotton', name: 'Cotton Products' },
    { id: 'silk', name: 'Silk & Luxury Fabrics' },
    { id: 'garments', name: 'Ready-made Garments' },
    { id: 'home', name: 'Home Textiles' },
  ],
  electronics: [
    { id: 'consumer', name: 'Consumer Audio Devices' },
    { id: 'components', name: 'Audio Components' },
    { id: 'accessories', name: 'Accessories & Peripherals' },
    { id: 'industrial', name: 'Professional Audio Equipment' },
  ],
};

const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // --- Fetch products from Supabase ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Some fields might be null (like image or description), use defaults
      setProducts((data || []).map((p: any) => ({
        ...p,
        image: p.image || '',
        description: p.description || '',
        status: p.status === 'active' ? 'active' : 'draft',
      })));
    } catch (err: any) {
      toast.error(err.message || 'Failed to load products');
      setProducts([]);
    }
    setLoading(false);
  };

  // --- Real-time updates ---
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('realtime-products-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        fetchProducts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setSelectedCategory('');
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setSelectedCategory(product.category);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Product deleted successfully.');
      // fetchProducts();   // Not needed, real-time will update
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      price: (form.elements.namedItem('price') as HTMLInputElement).value,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      subcategory: (form.elements.namedItem('subcategory') as HTMLSelectElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      image: (form.elements.namedItem('image') as HTMLInputElement).value,
      status: (form.elements.namedItem('status') as HTMLSelectElement).value as 'active' | 'draft',
    };

    setLoading(true);
    try {
      if (currentProduct) {
        // Update product
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', currentProduct.id);
        if (error) throw error;
        toast.success('Product updated successfully.');
      } else {
        // Add new product
        const { error } = await supabase.from('products').insert([formData]);
        if (error) throw error;
        toast.success('Product added successfully.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    }
    setLoading(false);
    setIsDialogOpen(false);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const availableSubcategories = selectedCategory ? subcategories[selectedCategory] : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Products Manager</h1>
        <Button onClick={handleAddProduct} className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchTerm('')}
              className="ml-2"
            >
              <X size={18} />
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-brand-blue font-semibold">
              Loading Products...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded overflow-hidden mr-3">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center bg-gray-100 text-xs text-gray-400">No Img</div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description.length > 60 ? 
                                `${product.description.slice(0, 60)}...` : 
                                product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{categories.find(c => c.id === product.category)?.name}</span>
                          <span className="text-xs text-gray-500">
                            {subcategories[product.category]?.find(s => s.id === product.subcategory)?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status === 'active' ? 'Active' : 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditProduct(product)}
                          className="mr-1"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No products found. Try a different search term or add a new product.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={currentProduct?.name || ''} 
                  required 
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Price
                </label>
                <Input 
                  id="price" 
                  name="price" 
                  defaultValue={currentProduct?.price || ''} 
                  placeholder="e.g. $5.50 per kg" 
                  required 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select 
                  id="category" 
                  name="category"
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium mb-1">
                  Subcategory
                </label>
                <select 
                  id="subcategory" 
                  name="subcategory"
                  value={currentProduct?.subcategory || ''}
                  onChange={() => {}}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                  disabled={!selectedCategory}
                >
                  <option value="">Select Subcategory</option>
                  {availableSubcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea 
                id="description" 
                name="description" 
                rows={3}
                defaultValue={currentProduct?.description || ''} 
                required 
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <div className="flex">
                <Input 
                  id="image" 
                  name="image" 
                  defaultValue={currentProduct?.image || ''} 
                  placeholder="https://example.com/image.jpg" 
                  required 
                  className="flex-1" 
                />
                <Button type="button" variant="outline" className="ml-2" disabled>
                  <Upload className="h-4 w-4 mr-2" /> Upload
                </Button>
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select 
                id="status" 
                name="status"
                defaultValue={currentProduct?.status || 'draft'}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={loading}>
                {currentProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManager;
