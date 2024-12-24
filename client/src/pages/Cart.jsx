import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  DollarSign, 
  CheckCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCartContext';
import Header from '../components/Header';

const CartPage = () => {
    const navigate = useNavigate()
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    
    console.log("Cart contents:", cartItems);



  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [cartTotal, setCartTotal]=useState(0);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 5000 ? 0 : 250; // Free shipping over 5000 PKR
  const total = subtotal + shippingCost - discount;


  // Function to apply the promo code
  const applyPromoCode = () => {
    const validPromoCode = 'UMEED10'; // Example promo code
    if (promoCode === validPromoCode) {
      const promoDiscount = subtotal * 0.1; // 10% discount
      setDiscount(promoDiscount);
      setCartTotal(total - discount);
      setPromoMessage(`Promo code applied! You saved ${promoDiscount} PKR.`);
    } else {
      setDiscount(0);
      setPromoMessage('Invalid promo code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-noto-nastaliq">
      <Header/>

      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items Column */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Cart Items</h2>
            
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-600 py-8">
                Your cart is empty
              </div>
            ) : (
              cartItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-md p-4 flex items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-indigo-700">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span>{item.price} PKR</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="bg-gray-200 p-1 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="bg-gray-200 p-1 rounded"
                        >
                          <Plus size={16} />
                        </button>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary Column */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal} PKR</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `${shippingCost} PKR`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{discount} PKR</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{total} PKR</span>
              </div>

              {/* Promo Code Section */}
              <div className="mt-4">
                <label className="block mb-2">Promo Code</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow p-2 border rounded"
                  />
                  <button 
                    onClick={applyPromoCode}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Hint: Try 'UMEED10' for 10% off
                </p>
                {promoMessage && (
                  <p className={`mt-2 text-xs ${discount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Checkout Button */}
              <button 
                className="w-full bg-green-500 text-white p-3 rounded-full flex items-center justify-center hover:bg-green-600 transition mt-4"
                disabled={cartItems.length === 0}
                onClick={()=>navigate("/checkout")}
              >
                <CheckCircle className="mr-2" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;