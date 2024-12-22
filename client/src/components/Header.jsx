import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, UserCircle, Users, ShoppingBag, Book, User, CreditCard, ShoppingBasket } from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";



export default function Header() {

    const { logout, account, id } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation(); // Hook to get current route


    // Function to determine the title based on the route
    const getTitle = () => {
        switch (location.pathname) {
            case "/":
                return (
                    <h1 className="text-2xl font-bold flex items-center">
                        <Users className="mr-3" />امید | Umeed 
                    </h1>
                );
            case "/network":
                return (
                    <h1 className="text-2xl font-bold flex items-center">
                        <Users className="mr-3" /> امید | Professional Network
                    </h1>
                );
            case "/products":
                return (
                    <h1 className="text-2xl font-bold flex items-center">
                        <ShoppingCart className="mr-3" />  امید | Buy Products
                    </h1>
                );
            case "/sell":
                return (
                    <h1 className="text-2xl font-bold flex items-center">
                        <ShoppingBag className="mr-3" />  امید | Selling Platform
                    </h1>
                );
            case "/courses":
                return (
                    <h1 className="text-2xl font-bold flex items-center">
                        <Book className="mr-3" />  امید | Buy Courses
                    </h1>
                );
            case "/cart":
                return (
                    <h1 className="text-2xl font-bold flex items-center">
                        <ShoppingCart className="mr-3" />  امید |  Your Cart
                    </h1>
                );
            case "/setup":
                return (
                    <h1 className="text-2xl font-bold flex items-center">
                        <User className="mr-3" />  امید |  Profile Setup
                    </h1>
                );
            case "/checkout":
                return (
                    <h1 className="text-2xl font-bold flex items-center">
                        <CreditCard className="mr-3" /> امید | Checkout
                    </h1>
                );
            case "/orders":
                return (
                    <h1 className="text-2xl font-bold flex items-center">
                        <ShoppingBasket className="mr-3" /> امید | Your Orders
                    </h1>
                );
        }
    };


    return (
        <header className="bg-indigo-700 text-white p-6 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {getTitle()}
                <nav className="space-x-4">
                    {account?.username ? (
                        <div className="relative">
                            <div className="flex flex-row">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center bg-white text-indigo-700 px-4 py-2 mr-4 rounded-md hover:bg-gray-100"
                                >
                                    <UserCircle className="mr-2" />
                                    <span className="hidden md:inline">{account?.username || "Username"}</span>
                                </button>

                                {/* View Cart Button */}
                                <button
                                    onClick={() => navigate("/cart")} // Adjust route if needed
                                    className="flex items-center bg-white text-indigo-700 px-4 py-2 rounded-md hover:bg-gray-100"
                                >
                                    <ShoppingCart className="mr-2" />
                                    <span className="hidden md:inline">View Cart</span>
                                </button>

                                <button
                                    onClick={() => navigate("/orders")} // Adjust route if needed
                                    className="flex items-center bg-white text-indigo-700 px-4 py-2 ml-4 rounded-md hover:bg-gray-100"
                                >
                                    <ShoppingBasket className="mr-2" />
                                    <span className="hidden md:inline">View Order</span>
                                </button>

                            </div>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                                    <ul>
                                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/setup")}>Profile</li>
                                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={logout}>
                                            <LogOut className="mr-2 inline" /> Logout
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                    ) : (
                        <>
                            <button
                                className="hover:bg-indigo-800 px-3 py-2 rounded"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                            <button
                                className="bg-white text-indigo-700 px-4 py-2 rounded font-semibold"
                                onClick={() => navigate("/login")}
                            >
                                Register
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
