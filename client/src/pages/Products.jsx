
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

import { DollarSign, ShoppingCart, Calendar } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext"; // Import useAuth

const Order = () => {
  const [orders, setOrders] = useState([]);
  const { id: userId } = useAuth(); // Get userId from AuthContext

  const placeholderImage = 'https://s3-alpha-sig.figma.com/img/a25d/266a/dc3c77058f886344ea0e6d70f086a23e?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AnmkLf5rwu4a-PaaQD0dni3iadBWjtzspkWzaNdzbDCJtB-dKcUmMRo53BXKa0d81jJK5h5EwIlxaIB-7EVkuUrwyhuQ0mdjiiAoAaD~jPh6A44NDyJNFDSf0rjOcLTLH1Uke2K7zyep2FhduKmeuLdtkGbZknSDTSZ1FjhJq-yrdkE2AwR~WmhvmGsUypn-Botj7dw0z5UYRU386NPdONesgLgg6QQrvNVtW6qJbUlxNNFVQrHy6Gy1F-FFE5iTBgHKKrBC9h35a4kE9M5s50yr9ShCUrGDaTCEE2~-HalSQhkTJvpnUh3E6~K1oWT3xDK2uTh-HrWI1-W-R1sgxQ__'; // Dummy image URL

  // Fetch Orders from DB 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userId) {
          console.error('User ID is not available');
          return;
        }

        const response = await fetch(`http://localhost:8080/order?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        // Process orders to include placeholder images if missing
        const processedOrders = Array.isArray(data) // Ensure we have an array of orders
        ? data.map(order => ({
            ...order,
            items: order.items.map(item => ({
              ...item,
              image: item.image ? item.image : placeholderImage, // Assign dummy image if image is null or undefined
            })),
          }))
        : [];

      setOrders(processedOrders); // Update state with processed orders

      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to load orders. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-noto-nastaliq">
      <Header />

      {/* Title */}
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-3xl font-bold  mb-6">
         Your Orders
        </h2>
      </div>

      {/* Orders Section */}
      <div className="container mx-auto px-4 pb-12">
        {orders.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p>No orders have been placed yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-indigo-700">
                    Order #{order.id || index + 1}
                  </h2>
                  <ShoppingCart size={20} className="text-indigo-700" />
                </div>

                {/* Date & Time of the Order */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar size={16} className="mr-1" />
                  <span>
                    Ordered on: {new Date(order.date).toLocaleDateString()} at{' '}
                    {new Date(order.date).toLocaleTimeString()}
                  </span>
                </div>

                {/* Items in the Order */}
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-gray-600 text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-grey-600">
                        <DollarSign size={14} />
                        <span className="text-sm">
                          {item.price * item.quantity} PKR
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <div className="flex items-center space-x-1 text-grey-600">
                    <DollarSign size={18} />
                    <span>{order.total} PKR</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
