import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// PUBLIC PAGES
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// AUTH PAGES
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// SHOPPING
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

// DASHBOARD
import { ProtectedRoute, AdminRoute } from "./components/layout/ProtectedRoute";
import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import UserOrders from "./pages/user/Orders";
import UserWishlist from "./pages/user/Wishlist";
import UserAddresses from "./pages/user/Addresses";
import UserProfile from "./pages/user/Profile";

// ADMIN
import AdminDashboardLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminCoupons from "./pages/admin/Coupons";
import AdminReviews from "./pages/admin/Reviews";

// COMPONENTS
import SEO from "./components/ui/SEO";
import ToastContainer from "./components/ui/Toast";
import CartDrawer from "./components/ui/CartDrawer";
import ErrorBoundary from "./components/ui/ErrorBoundary";

export default function App() {
    return (
        <ErrorBoundary>
            <SEO />
            <ToastContainer />
            <CartDrawer />
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
                        <Route index element={<UserDashboard />} />
                        <Route path="orders" element={<UserOrders />} />
                        <Route path="wishlist" element={<UserWishlist />} />
                        <Route path="addresses" element={<UserAddresses />} />
                        <Route path="profile" element={<UserProfile />} />
                    </Route>
                    <Route path="/admin" element={<AdminRoute><AdminDashboardLayout /></AdminRoute>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="coupons" element={<AdminCoupons />} />
                        <Route path="reviews" element={<AdminReviews />} />
                    </Route>
                </Route>
            </Routes>
        </ErrorBoundary>
    );
}
