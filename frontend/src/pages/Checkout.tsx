import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiCheck, FiChevronRight, FiMapPin, FiCreditCard, FiShield, FiArrowLeft, FiLock, FiShoppingCart } from "react-icons/fi";
import { HiOutlineLocationMarker, HiOutlineCash } from "react-icons/hi";
import { orderApi, paymentApi } from "../api";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";

const STEPS = [
    { num: 1, label: "Shipping" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Confirmation" },
];

interface AddressForm {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
}

const initialAddress: AddressForm = {
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
};

export default function Checkout() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, cartCount, fetchCart } = useCart();
    const { showToast } = useToast();

    const [step, setStep] = useState(1);
    const [address, setAddress] = useState<AddressForm>(initialAddress);
    const [useSavedAddress, setUseSavedAddress] = useState(false);
    const [showNewForm, setShowNewForm] = useState(!user?.address);
    const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI" | null>(null);
    const [placing, setPlacing] = useState(false);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        if (user && user.address && useSavedAddress) {
            const parts = user.address.split(", ");
            setAddress({
                fullName: user.name || "",
                phone: user.mobile || "",
                street: parts[0] || "",
                city: parts[1] || "",
                state: parts[2] || "",
                pincode: user.pincode || "",
            });
        }
    }, [user, useSavedAddress]);

    const validateAddress = (): boolean => {
        const errs: Partial<Record<keyof AddressForm, string>> = {};
        if (!address.fullName.trim() || address.fullName.trim().length < 2) errs.fullName = "Full name is required (min 2 chars)";
        if (!address.phone.trim() || address.phone.replace(/\D/g, "").length < 10) errs.phone = "Valid phone number is required";
        if (!address.street.trim() || address.street.trim().length < 5) errs.street = "Street address is required (min 5 chars)";
        if (!address.city.trim() || address.city.trim().length < 2) errs.city = "City is required";
        if (!address.state.trim() || address.state.trim().length < 2) errs.state = "State is required";
        if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode.trim())) errs.pincode = "Valid 6-digit pincode is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleAddressChange = (field: keyof AddressForm, value: string) => {
        setAddress((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleContinueToPayment = () => {
        if (!validateAddress()) return;
        setStep(2);
        window.scrollTo(0, 0);
    };

    const formatAddressString = (a: AddressForm): string => {
        return `${a.fullName}, ${a.phone}, ${a.street}, ${a.city}, ${a.state}, ${a.pincode}`;
    };

    const handlePlaceOrder = async () => {
        if (!paymentMethod) {
            showToast("Please select a payment method", "warning");
            return;
        }
        setPlacing(true);
        try {
            const addrStr = formatAddressString(address);
            const res = await orderApi.place(addrStr, paymentMethod);
            const orderId = res.data._id;

            if (paymentMethod === "UPI") {
                try {
                    await paymentApi.mockSuccess(orderId);
                } catch {
                    showToast("Order placed but payment confirmation pending", "warning");
                }
            }

            showToast("Order placed successfully!", "success");
            navigate(`/order-success/${orderId}`, { state: { order: res.data } });
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to place order. Please try again.";
            showToast(msg, "error");
        }
        setPlacing(false);
    };

    if (!items.length) {
        return (
            <div className="max-w-3xl mx-auto text-center py-20">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
                    <FiShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Add some items to your cart before checking out.</p>
                <Link
                    to="/shop"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    const subtotal = items.reduce((s, i) => s + (i.product?.finalPrice || 0) * i.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 49;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = subtotal + shipping + tax;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
                <FiChevronRight className="w-3 h-3" />
                <Link to="/cart" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Cart</Link>
                <FiChevronRight className="w-3 h-3" />
                <span className="text-gray-900 dark:text-white font-medium">Checkout</span>
            </nav>

            <div className="flex items-center justify-center mb-10">
                {STEPS.map((s, idx) => (
                    <div key={s.num} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                    step > s.num
                                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md"
                                        : step === s.num
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                }`}
                            >
                                {step > s.num ? <FiCheck className="w-5 h-5" /> : s.num}
                            </div>
                            <span
                                className={`mt-2 text-xs font-medium ${
                                    step >= s.num ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                                }`}
                            >
                                {s.label}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div
                                className={`w-16 sm:w-24 h-0.5 mx-2 mt-[-1.25rem] transition-colors duration-300 ${
                                    step > s.num ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gray-200 dark:bg-gray-700"
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
                <div>
                    {step === 1 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <HiOutlineLocationMarker className="w-6 h-6 text-blue-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
                            </div>

                            {user?.address && (
                                <div className="mb-6">
                                    <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition">
                                        <input
                                            type="radio"
                                            checked={useSavedAddress && !showNewForm}
                                            onChange={() => { setUseSavedAddress(true); setShowNewForm(false); setErrors({}); }}
                                            className="w-4 h-4 text-blue-600 accent-blue-600"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Use Saved Address</span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.address}</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition mt-3">
                                        <input
                                            type="radio"
                                            checked={!useSavedAddress || showNewForm}
                                            onChange={() => { setUseSavedAddress(false); setShowNewForm(true); setErrors({}); }}
                                            className="w-4 h-4 text-blue-600 accent-blue-600"
                                        />
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Add New Address</span>
                                    </label>
                                </div>
                            )}

                            {(showNewForm || !user?.address) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={address.fullName}
                                            onChange={(e) => handleAddressChange("fullName", e.target.value)}
                                            placeholder="John Doe"
                                            className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                                errors.fullName ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"
                                            }`}
                                        />
                                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={address.phone}
                                            onChange={(e) => handleAddressChange("phone", e.target.value)}
                                            placeholder="9876543210"
                                            className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                                errors.phone ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"
                                            }`}
                                        />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            value={address.street}
                                            onChange={(e) => handleAddressChange("street", e.target.value)}
                                            placeholder="123 Main Street, Apartment 4B"
                                            className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                                errors.street ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"
                                            }`}
                                        />
                                        {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={address.city}
                                            onChange={(e) => handleAddressChange("city", e.target.value)}
                                            placeholder="Mumbai"
                                            className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                                errors.city ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"
                                            }`}
                                        />
                                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={address.state}
                                            onChange={(e) => handleAddressChange("state", e.target.value)}
                                            placeholder="Maharashtra"
                                            className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                                errors.state ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"
                                            }`}
                                        />
                                        {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            value={address.pincode}
                                            onChange={(e) => handleAddressChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="400001"
                                            className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                                errors.pincode ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"
                                            }`}
                                        />
                                        {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleContinueToPayment}
                                className="mt-8 w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                            >
                                Continue to Payment &rarr;
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FiCreditCard className="w-6 h-6 text-blue-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-6">
                                <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Shipping to</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {formatAddressString(address)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                                >
                                    Edit
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                                        paymentMethod === "COD"
                                            ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                                    }`}
                                >
                                    {paymentMethod === "COD" && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <FiCheck className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                    <HiOutlineCash className="w-10 h-10 text-gray-700 dark:text-gray-300 mb-3" />
                                    <h3 className="font-bold text-gray-900 dark:text-white">Cash on Delivery</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pay when your order arrives</p>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("UPI")}
                                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                                        paymentMethod === "UPI"
                                            ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                                    }`}
                                >
                                    {paymentMethod === "UPI" && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <FiCheck className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                    <FiCreditCard className="w-10 h-10 text-gray-700 dark:text-gray-300 mb-3" />
                                    <h3 className="font-bold text-gray-900 dark:text-white">UPI / Online Payment</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                            <FiLock className="w-3 h-3" /> Mock Payment
                                        </span>
                                    </p>
                                </button>
                            </div>

                            <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl mb-6">
                                <FiShield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                    Your payment information is secure. We use encryption to protect your data.
                                </p>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={!paymentMethod || placing}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-base hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {placing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FiLock className="w-4 h-4" />
                                        Place Order &mdash; Rs. {total.toLocaleString()}
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setStep(1)}
                                disabled={placing}
                                className="mt-4 w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition flex items-center justify-center gap-1 disabled:opacity-40"
                            >
                                <FiArrowLeft className="w-4 h-4" /> Back to Shipping
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:sticky lg:top-24">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                            Order Summary ({cartCount} {cartCount === 1 ? "item" : "items"})
                        </h3>

                        <div className="space-y-3 mb-4">
                            {items.slice(0, 3).map((item) => (
                                <div key={item.product?._id} className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden shrink-0">
                                        {item.product?.images?.[0] ? (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FiShoppingCart className="w-4 h-4 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.product?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                        Rs. {((item.product?.finalPrice || 0) * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            {items.length > 3 && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                                    +{items.length - 3} more {items.length - 3 === 1 ? "item" : "items"}
                                </p>
                            )}
                        </div>

                        <hr className="border-gray-100 dark:border-gray-700 mb-4" />

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-semibold text-gray-900 dark:text-white">Rs. {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className={`font-semibold ${shipping === 0 ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                                    {shipping === 0 ? "Free" : `Rs. ${shipping}`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                                <span className="font-semibold text-gray-900 dark:text-white">Rs. {tax.toLocaleString()}</span>
                            </div>
                            <hr className="border-gray-200 dark:border-gray-600" />
                            <div className="flex justify-between">
                                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Rs. {total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
