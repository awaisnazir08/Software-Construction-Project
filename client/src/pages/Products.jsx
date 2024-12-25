import React, { useState } from 'react';
import { Users, ShoppingBag, BookOpen, ImagePlus } from 'lucide-react';
import Header from '../components/Header';

const SellPage = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });
  const [courseDetails, setCourseDetails] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    skillLevel: ''
  });

  const handleTypeSelection = (type) => {
    setSelectedType(type);
  };

  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    setProductDetails(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Selected Type: ", selectedType);

    if (selectedType === 'product') {
      try {
        // Create a FormData object to handle text and image data
        const formData = new FormData();
        formData.append('name', productDetails.name);
        formData.append('description', productDetails.description);
        formData.append('price', productDetails.price);
        formData.append('category', productDetails.category);
        if (productDetails.image) {
          formData.append('image', productDetails.image);
        } else {
          formData.append('image', '');
        }

        console.log("Form Data:", Object.fromEntries(formData.entries()));
        console.log("Form Data Again: ", formData);



        // Send POST request to backend
        const response = await fetch('http://localhost:8080/sell/product', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          alert('Product listed successfully!');
          setProductDetails({
            name: '',
            description: '',
            price: '',
            category: '',
            image: null,
          });
          setSelectedType(null); // Reset form
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Error submitting product:', error);
        alert('Failed to list the product. Please try again.');
      }
    } else if (selectedType === 'course') {
      try {
        const formData = new FormData();
        formData.append('title', courseDetails.title);
        formData.append('description', courseDetails.description);
        formData.append('price', courseDetails.price);
        formData.append('duration', courseDetails.duration);
        formData.append('skillLevel', courseDetails.skillLevel);


        console.log("Form Data:", Object.fromEntries(formData.entries()));
        console.log("Form Data Again: ", formData);



        // Send POST request to backend
        const response = await fetch('http://localhost:8080/sell/course', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          alert('Course listed successfully!');
          setCourseDetails({
            title: '',
            description: '',
            price: '',
            duration: '',
            skillLevel: '',
          });
          setSelectedType(null); // Reset form
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Error submitting Course:', error);
        alert('Failed to list the course. Please try again.');
      }
    }
  };






  return (
    <div className="min-h-screen bg-gray-50 font-noto-nastaliq relative">
      <Header/>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8">What Would You Like to Sell?</h1>

        {!selectedType && (
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => handleTypeSelection('product')}
              className="bg-white border-2 border-indigo-200 p-6 rounded-xl hover:shadow-lg transition flex items-center space-x-4"
            >
              <ShoppingBag size={40} className="text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold">Handmade Products</h2>
                <p className="text-gray-600">Sell your crafts, artworks, and traditional items</p>
              </div>
            </button>

            <button
              onClick={() => handleTypeSelection('course')}
              className="bg-white border-2 border-indigo-200 p-6 rounded-xl hover:shadow-lg transition flex items-center space-x-4"
            >
              <BookOpen size={40} className="text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold">Skill Development Courses</h2>
                <p className="text-gray-600">Share your expertise and teach skills</p>
              </div>
            </button>
          </div>
        )}

        {selectedType === 'product' && (
          <form onSubmit={handleSubmit} method='POST' className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">List Your Handmade Product</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={productDetails.name}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price (PKR)</label>
                <input
                  type="number"
                  name="price"
                  value={productDetails.price}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={productDetails.description}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Category</label>
                <select
                  name="category"
                  value={productDetails.category}
                  onChange={handleProductChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  <option value="textiles">Textiles</option>
                  <option value="pottery">Pottery</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Product Image</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    name="image"
                    onChange={handleProductChange}
                    className="hidden"
                    id="product-image"
                    accept="image/*"
                  />
                  <label
                    htmlFor="product-image"
                    className="flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded cursor-pointer"
                  >
                    <ImagePlus size={20} />
                    <span>Upload Image</span>
                  </label>
                  {productDetails.image && (
                    <span>{productDetails.image.name}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
            >
              List Product
            </button>
          </form>
        )}

        {selectedType === 'course' && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">Create Your Skill Course</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={courseDetails.title}
                  onChange={handleCourseChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price (PKR)</label>
                <input
                  type="number"
                  name="price"
                  value={courseDetails.price}
                  onChange={handleCourseChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Course Description</label>
                <textarea
                  name="description"
                  value={courseDetails.description}
                  onChange={handleCourseChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Course Duration</label>
                <select
                  name="duration"
                  value={courseDetails.duration}
                  onChange={handleCourseChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Duration</option>
                  <option value="1week">1 Week</option>
                  <option value="2weeks">2 Weeks</option>
                  <option value="1month">1 Month</option>
                  <option value="2months">2 Months</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Skill Level</label>
                <select
                  name="skillLevel"
                  value={courseDetails.skillLevel}
                  onChange={handleCourseChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
            >
              Create Course
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellPage;