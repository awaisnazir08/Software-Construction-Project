import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  DollarSign,
  ChevronDown, Users
} from 'lucide-react';

import { useCart } from '../contexts/useCartContext';

import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
const ProductsPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();


  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('rating');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Static categories list
  const categories = ["textiles", "pottery", "jewelry", "other", "all"];

  const placeholderImage = 'https://s3-alpha-sig.figma.com/img/a25d/266a/dc3c77058f886344ea0e6d70f086a23e?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AnmkLf5rwu4a-PaaQD0dni3iadBWjtzspkWzaNdzbDCJtB-dKcUmMRo53BXKa0d81jJK5h5EwIlxaIB-7EVkuUrwyhuQ0mdjiiAoAaD~jPh6A44NDyJNFDSf0rjOcLTLH1Uke2K7zyep2FhduKmeuLdtkGbZknSDTSZ1FjhJq-yrdkE2AwR~WmhvmGsUypn-Botj7dw0z5UYRU386NPdONesgLgg6QQrvNVtW6qJbUlxNNFVQrHy6Gy1F-FFE5iTBgHKKrBC9h35a4kE9M5s50yr9ShCUrGDaTCEE2~-HalSQhkTJvpnUh3E6~K1oWT3xDK2uTh-HrWI1-W-R1sgxQ__'; // Dummy image URL

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/sell/product');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Products Data: ", data);
        const fetchedProducts = data.products.map(product => ({
          ...product,
          image: product.image ? product.image : placeholderImage, // Use dummy image if image is null
        }));
        setAllProducts(fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);


  useEffect(() => {
    let filteredProducts = allProducts.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === 'all' || product.category === category;

      const matchesSubcategory =
        subcategory === 'all' || product.subcategory === subcategory;

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
    });

    // Sorting logic
    filteredProducts.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

    setProducts(filteredProducts);
  }, [searchTerm, category, subcategory, priceRange, sortBy, allProducts]);

  const renderProduct = (product, index) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-md p-4 flex hover:shadow-lg transition"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-32 h-32 object-cover rounded-md mr-4"
      />
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-indigo-700">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign size={16} className="text-green-600" />
          <span>{product.price} PKR</span>
          <Star size={16} className="text-yellow-500" />
          {/* <span>{product.rating}/5</span> */}
        </div>
        <div className="flex space-x-2">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            {product.category}
          </span>
        </div>
        <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center" onClick={() => {
          console.log('Adding to cart:', product);
          addToCart(product);
        }}>
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-noto-nastaliq relative">
      {/* <header className="bg-indigo-700 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold flex items-center">
            <ShoppingCart className="mr-3" />  امید | Buy Products
          </h1>
        </div>
      </header> */}
      <Header/>

      <div classname="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-4 gap-6 py-12 px-4" >
          {/* Sidebar Filters */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="font-bold text-xl mb-4 flex items-center">
              <Filter size={20} className="mr-2" /> Product Filters
            </h2>

            <div className="mb-4">
              <label className="block mb-2">Product Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="w-full p-2 border rounded"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)} {/* Capitalize the first letter */}
                  </option>
                ))}
              </select>
            </div>


            <div className="mb-4">
              <label className="block mb-2">Price Range (PKR)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="rating">Highest Rating</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3 space-y-4">
            <div className="flex space-x-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border rounded-full"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              {products.length > 0 ? (
                products.map(renderProduct)
              ) : (
                <div className="text-center text-gray-600 py-8">
                  No products found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProductsPage;