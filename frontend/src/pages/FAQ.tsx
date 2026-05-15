import { useState } from "react";
import { Link } from "react-router-dom";
import {
    FiSearch,
    FiChevronDown,
    FiPackage,
    FiTruck,
    FiRefreshCw,
    FiCreditCard,
    FiUser,
    FiMessageCircle,
    FiArrowRight,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategory {
    id: string;
    icon: React.ReactNode;
    title: string;
    items: FAQItem[];
}

const faqData: FAQCategory[] = [
    {
        id: "orders",
        icon: <FiPackage className="w-5 h-5" />,
        title: "Orders",
        items: [
            { question: "How do I place an order?", answer: "Simply browse our catalog, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase. Follow the step-by-step checkout process to enter your shipping details and payment method." },
            { question: "Can I modify or cancel my order after placing it?", answer: "Orders can be modified or cancelled within 30 minutes of placement. Please contact our support team immediately if you need to make changes. Once the order enters processing, modifications may not be possible." },
            { question: "How will I know if my order is confirmed?", answer: "You'll receive a confirmation email with your order number and details. You can also track your order status from your dashboard under 'My Orders'." },
            { question: "Do you offer bulk or wholesale pricing?", answer: "Yes, we offer special pricing for bulk and wholesale orders. Please contact our B2B team through the Contact page or email us at wholesale@luxecart.com for custom pricing." },
            { question: "Can I order products that are out of stock?", answer: "Out-of-stock items typically have a 'Notify Me' option. Click it to receive an email when the product is back in stock. Some items may also be available for pre-order." },
        ],
    },
    {
        id: "shipping",
        icon: <FiTruck className="w-5 h-5" />,
        title: "Shipping",
        items: [
            { question: "What shipping options are available?", answer: "We offer Standard (5-7 business days), Express (2-3 business days), and Priority Overnight shipping. Free standard shipping is available on orders over $50." },
            { question: "Do you ship internationally?", answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply and are the responsibility of the customer." },
            { question: "How can I track my shipment?", answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order in real-time from your dashboard under 'My Orders'." },
            { question: "What happens if my package is lost or damaged?", answer: "If your package is lost or arrives damaged, contact our support team within 48 hours of the expected delivery date. We'll investigate and arrange a replacement or refund." },
        ],
    },
    {
        id: "returns",
        icon: <FiRefreshCw className="w-5 h-5" />,
        title: "Returns & Exchanges",
        items: [
            { question: "What is your return policy?", answer: "We offer a 30-day return policy from the date of delivery. Items must be unused, in original condition, and with all tags attached. Some exclusions apply for personalized and intimate items." },
            { question: "How do I initiate a return?", answer: "Log into your account, go to 'My Orders', select the item you wish to return, and click 'Return Item'. Print the prepaid return label, pack the item securely, and drop it off at the designated carrier." },
            { question: "How long do refunds take?", answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method." },
            { question: "Can I exchange an item for a different size or color?", answer: "Yes, exchanges are processed as a return and a new order. Initiate a return for the unwanted item and place a new order for the desired size or color." },
            { question: "Who pays for return shipping?", answer: "We provide free return shipping for defective or incorrect items. For other returns, a nominal return shipping fee may be deducted from the refund amount." },
        ],
    },
    {
        id: "payments",
        icon: <FiCreditCard className="w-5 h-5" />,
        title: "Payments",
        items: [
            { question: "What payment methods do you accept?", answer: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and UPI. All transactions are encrypted and processed securely." },
            { question: "Is it safe to use my credit card on your site?", answer: "Absolutely. We use industry-standard SSL encryption and are PCI-DSS compliant. Your payment information is never stored on our servers." },
            { question: "Do you offer installment or buy-now-pay-later options?", answer: "Yes, we offer installment plans through Klarna and Afterpay at checkout. You can split your purchase into 4 interest-free payments." },
            { question: "Will I be charged customs fees for international orders?", answer: "International orders may be subject to import duties, taxes, and customs fees imposed by the destination country. These charges are the customer's responsibility." },
        ],
    },
    {
        id: "account",
        icon: <FiUser className="w-5 h-5" />,
        title: "Account",
        items: [
            { question: "How do I create an account?", answer: "Click 'Sign Up' at the top of the page, enter your name, email, and a secure password. Verify your email address and you're ready to shop." },
            { question: "I forgot my password. What should I do?", answer: "Click 'Forgot Password' on the login page and enter your registered email. You'll receive a link to reset your password securely." },
            { question: "How can I update my profile information?", answer: "Log into your account and go to 'My Profile' from the dashboard. You can update your name, email, phone number, and shipping addresses there." },
            { question: "Can I have multiple shipping addresses?", answer: "Yes, you can save multiple shipping addresses in your account. Manage them from the 'Addresses' section in your dashboard." },
        ],
    },
];

export default function FAQ() {
    const [activeCategory, setActiveCategory] = useState<string>("orders");
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");

    const toggleItem = (categoryId: string, index: number) => {
        const key = `${categoryId}-${index}`;
        setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const filteredCategories = faqData
        .map((category) => ({
            ...category,
            items: category.items.filter(
                (item) =>
                    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((category) => category.items.length > 0 || searchQuery === "");

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-20">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 mb-6">
                        <HiOutlineSparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Help Center</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 dark:text-white">
                        Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                        Find answers to common questions about orders, shipping, returns, and more.
                    </p>
                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search FAQ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
                        {/* Category Tabs */}
                        <div className="lg:w-64 shrink-0">
                            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
                                {faqData.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap text-sm font-semibold transition-all duration-300 ${activeCategory === category.id
                                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                    >
                                        <span className={activeCategory === category.id ? "text-white" : "text-blue-500 dark:text-blue-400"}>
                                            {category.icon}
                                        </span>
                                        {category.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Items */}
                        <div className="flex-1">
                            {filteredCategories.length === 0 ? (
                                <div className="text-center py-16">
                                    <FiSearch className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No results found</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Try a different search term</p>
                                </div>
                            ) : (
                                filteredCategories.map(
                                    (category) =>
                                        (activeCategory === category.id || searchQuery) && (
                                            <div key={category.id} className="mb-8 last:mb-0">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                                                        {category.icon}
                                                    </div>
                                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{category.title}</h2>
                                                </div>
                                                <div className="space-y-3">
                                                    {category.items.map((item, index) => {
                                                        const key = `${category.id}-${index}`;
                                                        const isOpen = openItems[key];
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                                                            >
                                                                <button
                                                                    onClick={() => toggleItem(category.id, index)}
                                                                    className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                >
                                                                    <span className="font-semibold text-gray-800 dark:text-white pr-4">
                                                                        {item.question}
                                                                    </span>
                                                                    <FiChevronDown
                                                                        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                                            }`}
                                                                    />
                                                                </button>
                                                                <div
                                                                    className="overflow-hidden transition-all duration-300 ease-in-out"
                                                                    style={{ maxHeight: isOpen ? "300px" : "0" }}
                                                                >
                                                                    <p className="px-5 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                                                                        {item.answer}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <FiMessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
                            Still Have <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions?</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Our support team is available 24/7 to help you with any inquiries.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Contact Support
                            <FiArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
