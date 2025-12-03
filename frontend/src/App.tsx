import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// PUBLIC PAGES
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Shop from "./pages/Shop";

// AUTH PAGES
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";

// DASHBOARDS (add later UI)


export default function App() {

  return (
    <Routes>

      <Route element={<MainLayout />}>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* DASHBOARDS */}
        

      </Route>

    </Routes>
  );
}
