import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto";
import "./styles/index.css";
import Welcome from "./pages/Welcome";
import SellPage from "./pages/SellPage";
import ProductsPage from "./pages/Products";
import Login from "./pages/Login";
import NetworkingPage from "./pages/Netowrking";
import CoursesPage from "./pages/Courses";
import OrdersPage from "./pages/Order";
import ProfileSetupPage from "./pages/Setup";
import ProtectedRoute from "./components/ProtectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Network from "./pages/test";
import CheckoutPage from "./pages/Checkout";
import CartPage from "./pages/Cart";
import CourseEnrollmentPage from "./pages/CourseEnroll";
import { CartProvider } from './contexts/useCartContext'; 
import { OrderProvider } from "./contexts/useOrderContext";

const Router = () => {
  const { isLoggedIn } = useAuth(); // Correctly fetch the auth status

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Welcome />, // Public route
    },
    {
      path: "/login",
      element: <Login />, // Public route
    },
    {
      path: "/test",
      element: <Network />, // Public route
    },
    {
      path: "/test",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <Network />
        </ProtectedRoute>
      ),
    },
    {
      path: "/enroll",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <CourseEnrollmentPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/checkout",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <CheckoutPage  />
        </ProtectedRoute>
      ),
    },
    {
      path: "/cart",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <CartPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/setup",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <ProfileSetupPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/sell",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <SellPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/products",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <ProductsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/courses",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <CoursesPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/network",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <NetworkingPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <OrdersPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <Welcome />, // Catch-all route redirects to Welcome for safety
    },
  ]);

  return <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <OrderProvider>
      <CartProvider>
        <Router />
        <CssBaseline />
      </CartProvider>
      </OrderProvider>
    </AuthProvider>
  </React.StrictMode>
);
