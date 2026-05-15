import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiUsers,
    FiAward,
    FiGlobe,
    FiHeadphones,
    FiTarget,
    FiEye,
    FiHeart,
} from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineBadgeCheck } from "react-icons/hi";

const stats = [
    { icon: <FiUsers className="w-6 h-6" />, value: "10K+", label: "Happy Customers", gradient: "from-blue-500 to-cyan-500" },
    { icon: <FiAward className="w-6 h-6" />, value: "500+", label: "Premium Brands", gradient: "from-purple-500 to-pink-500" },
    { icon: <FiGlobe className="w-6 h-6" />, value: "50+", label: "Countries Served", gradient: "from-emerald-500 to-teal-500" },
    { icon: <FiHeadphones className="w-6 h-6" />, value: "24/7", label: "Customer Support", gradient: "from-amber-500 to-orange-500" },
];

const team = [
    { name: "Sarah Chen", role: "CEO & Founder", initials: "SC", gradient: "from-blue-500 to-purple-500" },
    { name: "Marcus Rivera", role: "CTO", initials: "MR", gradient: "from-purple-500 to-pink-500" },
    { name: "Priya Patel", role: "Head of Design", initials: "PP", gradient: "from-pink-500 to-rose-500" },
    { name: "James O'Connor", role: "VP of Marketing", initials: "JO", gradient: "from-emerald-500 to-teal-500" },
    { name: "Aisha Mohammed", role: "Customer Experience", initials: "AM", gradient: "from-amber-500 to-orange-500" },
];

const milestones = [
    { year: "2018", title: "The Beginning", description: "LuxeCart was founded with a vision to redefine premium online shopping." },
    { year: "2019", title: "First 1,000 Customers", description: "Reached our first major milestone with a growing community of luxury enthusiasts." },
    { year: "2020", title: "Global Expansion", description: "Expanded operations to 20+ countries with international shipping partnerships." },
    { year: "2021", title: "500+ Brands Onboard", description: "Partnered with premium brands worldwide to offer exclusive collections." },
    { year: "2022", title: "$10M in Sales", description: "Achieved remarkable growth with millions in annual recurring revenue." },
    { year: "2023", title: "AI-Powered Experience", description: "Launched personalized recommendations and AI-driven customer support." },
    { year: "2024", title: "Sustainability Initiative", description: "Committed to carbon-neutral shipping and eco-friendly packaging." },
];

const values = [
    {
        icon: <FiTarget className="w-8 h-8" />,
        title: "Our Mission",
        description: "To curate and deliver exceptional products that inspire and elevate everyday living.",
        gradient: "from-blue-500 to-purple-500",
    },
    {
        icon: <FiEye className="w-8 h-8" />,
        title: "Our Vision",
        description: "To become the world's most trusted marketplace for premium and luxury goods.",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: <FiHeart className="w-8 h-8" />,
        title: "Our Values",
        description: "Integrity, excellence, and customer delight drive every decision we make.",
        gradient: "from-pink-500 to-rose-500",
    },
];

export default function About() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-28">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 mb-6">
                        <HiOutlineSparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">About LuxeCart</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Crafting
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Extraordinary Experiences
                        </span>
                        Since 2018
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                        We're on a mission to connect discerning customers with the finest products from around the globe,
                        delivering luxury, quality, and trust with every order.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Explore Collection
                        <FiArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {stat.icon}
                                </div>
                                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission/Vision/Values */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
                            What Drives <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Us Forward</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our purpose and principles shape every aspect of the LuxeCart experience.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((item, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
                            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Journey</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            From a bold idea to a global marketplace — explore the milestones that shaped LuxeCart.
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block" />
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="relative flex flex-col md:flex-row gap-6 md:gap-0">
                                    <div className="md:w-24 text-center md:text-right shrink-0">
                                        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold">
                                            {milestone.year}
                                        </span>
                                    </div>
                                    <div className="hidden md:flex items-start justify-center shrink-0">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-white dark:border-gray-800 shadow z-10" />
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl flex-1">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{milestone.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
                            Meet the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Team</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Passionate people dedicated to delivering the best shopping experience.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center group hover:-translate-y-1">
                                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${member.gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {member.initials}
                                </div>
                                <h3 className="font-bold text-gray-800 dark:text-white mb-1">{member.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
                        <HiOutlineBadgeCheck className="w-16 h-16 mx-auto mb-6 text-white/80" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Experience the Difference?
                        </h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers and discover a world of premium products curated just for you.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center px-8 py-3.5 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                        >
                            Get Started Today
                            <FiArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
