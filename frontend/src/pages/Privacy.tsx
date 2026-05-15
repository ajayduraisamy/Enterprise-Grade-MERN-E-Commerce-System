import { Link } from "react-router-dom";
import { FiArrowRight, FiLock } from "react-icons/fi";

const sections = [
    {
        id: "information-we-collect",
        title: "1. Information We Collect",
        content:
            "We collect information you provide directly to us, including your name, email address, shipping address, phone number, and payment information when you create an account, place an order, or contact our support team. We also automatically collect certain information when you visit our website, including your IP address, browser type, device information, pages viewed, and browsing behavior through cookies and similar technologies.",
    },
    {
        id: "how-we-use",
        title: "2. How We Use Your Information",
        content:
            "We use the information we collect to process and fulfill your orders, communicate with you about your purchases, provide customer support, send you promotional offers (with your consent), improve our website and services, detect and prevent fraud, and comply with legal obligations. We may also use aggregated, anonymized data for analytics and business planning.",
    },
    {
        id: "data-sharing",
        title: "3. Data Sharing & Disclosure",
        content:
            "We do not sell your personal information to third parties. We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, fulfilling orders, delivering packages, and sending communications. These providers are contractually obligated to protect your data and use it only for the services they provide. We may also disclose information if required by law or to protect our rights.",
    },
    {
        id: "cookies",
        title: "4. Cookies & Tracking Technologies",
        content:
            "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings. Essential cookies are required for the website to function properly. We also use analytics cookies to help us improve our services. Third-party cookies may be used for advertising and social media features.",
    },
    {
        id: "data-security",
        title: "5. Data Security",
        content:
            "We implement industry-standard security measures to protect your personal information, including SSL/TLS encryption for data transmission, secure server infrastructure, regular security audits, and restricted access to personal data. Payment information is processed by PCI-DSS compliant payment processors and is never stored on our servers. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.",
    },
    {
        id: "your-rights",
        title: "6. Your Rights & Choices",
        content:
            "Depending on your jurisdiction, you may have the right to access, correct, delete, or port your personal data. You may opt out of marketing communications at any time by clicking the unsubscribe link in our emails or updating your preferences in your account settings. You can also request a copy of the data we hold about you by contacting our privacy team. We will respond to your request within applicable legal timeframes.",
    },
    {
        id: "data-retention",
        title: "7. Data Retention",
        content:
            "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Account information is retained until you request deletion. Transaction records are retained as required by tax and financial regulations. Anonymized data may be retained indefinitely for analytical purposes.",
    },
    {
        id: "children",
        title: "8. Children's Privacy",
        content:
            "Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child under 18 has provided us with personal data, we will take steps to delete such information promptly. If you believe a child has provided us with personal information, please contact us immediately.",
    },
    {
        id: "international",
        title: "9. International Data Transfers",
        content:
            "Your information may be transferred to and processed in countries other than your own, where data protection laws may differ. We ensure appropriate safeguards are in place through standard contractual clauses and other lawful mechanisms to protect your data when transferred internationally.",
    },
    {
        id: "changes",
        title: "10. Changes to This Policy",
        content:
            "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the updated policy on this page and updating the 'Last updated' date. We encourage you to review this policy periodically. Your continued use of our services after changes constitutes acceptance of the updated policy.",
    },
    {
        id: "contact",
        title: "11. Contact Us",
        content:
            "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@luxecart.com, or through our Contact page. We are committed to addressing your concerns and will respond to inquiries as promptly as possible.",
    },
];

export default function Privacy() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-20">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 mb-6">
                        <FiLock className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Privacy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 dark:text-white">
                        Privacy <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Policy</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        We are committed to protecting your privacy and handling your data with transparency.
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
                                Your trust matters to us. If you have any questions about how we handle your data, please reach out.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Contact Privacy Team
                                <FiArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
