import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-light">

            <Navbar />

            {/* dynamic routed page */}
            <main className="flex-grow p-6">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}
