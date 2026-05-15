import { Link } from "react-router-dom";
import { FiArrowRight, FiShield } from "react-icons/fi";

const sections = [
    {
        id: "introduction",
        title: "1. Introduction",
        content:
            "Welcome to LuxeCart. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services. These terms apply to all visitors, users, and customers of LuxeCart.",
    },
    {
        id: "account-terms",
        title: "2. Account Terms",
        content:
            "To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must provide accurate, current, and complete information. We reserve the right to suspend or terminate accounts that violate our terms or provide false information. You must be at least 18 years old to create an account.",
    },
    {
        id: "product-listings",
        title: "3. Product Listings & Descriptions",
        content:
            "We strive to display accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions, colors, or other content are completely accurate, error-free, or current. We reserve the right to correct any errors and update product information at any time without prior notice. Product availability is subject to change.",
    },
    {
        id: "pricing",
        title: "4. Pricing & Payment",
        content:
            "All prices are listed in USD unless otherwise stated. Prices are subject to change without notice. We reserve the right to modify prices at any time. All payments are processed securely through our third-party payment processors. By making a purchase, you agree to pay the full amount indicated at checkout, including applicable taxes and shipping fees.",
    },
    {
        id: "shipping",
        title: "5. Shipping & Delivery",
        content:
            "Shipping times are estimates and not guaranteed. We are not responsible for delays caused by carriers, customs, or unforeseen circumstances. Risk of loss transfers to you upon delivery. For international orders, you are responsible for any customs duties, taxes, or import fees imposed by your country.",
    },
    {
        id: "returns",
        title: "6. Returns & Refunds",
        content:
            "Our return policy allows returns within 30 days of delivery for most items in original condition. Refunds are processed to the original payment method within 5-7 business days after we receive the returned item. Certain items such as personalized products, intimate apparel, and digital goods may not be eligible for return.",
    },
    {
        id: "limitation",
        title: "7. Limitation of Liability",
        content:
            "LuxeCart and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability for any claim shall not exceed the amount paid by you for the product giving rise to the claim. Some jurisdictions do not allow certain limitations of liability, so the above may not apply to you.",
    },
    {
        id: "intellectual-property",
        title: "8. Intellectual Property",
        content:
            "All content on this website — including text, graphics, logos, images, and software — is the property of LuxeCart or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written consent.",
    },
    {
        id: "termination",
        title: "9. Termination",
        content:
            "We reserve the right to suspend or terminate your access to our services at any time, without prior notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties. Upon termination, your right to use our services immediately ceases.",
    },
    {
        id: "governing-law",
        title: "10. Governing Law",
        content:
            "These terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of Delaware.",
    },
    {
        id: "contact",
        title: "11. Contact Information",
        content:
            "For questions about these Terms and Conditions, please contact us at legal@luxecart.com or through our Contact page. We will respond to your inquiry as promptly as possible.",
    },
];

export default function Terms() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-20">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 mb-6">
                        <FiShield className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 dark:text-white">
                        Terms & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Conditions</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Please read these terms carefully before using LuxeCart's services.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                        Last updated: May 15, 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {sections.map((section) => (
                                <div key={section.id} id={section.id} className="mb-10 last:mb-0">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                        {section.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                By using LuxeCart, you acknowledge that you have read and agree to these Terms and Conditions.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Contact Legal Team
                                <FiArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
