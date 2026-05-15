import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiSmartphone, FiMapPin, FiHash, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../api/axios";
import { useToast } from "../../hooks/useToast";
import { isEmail, minLen, sanitize } from "../../utils/validation";

function getStrength(pw: string): { label: string; color: string; width: string; score: number } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "20%", score };
  if (score <= 2) return { label: "Fair", color: "bg-orange-500", width: "40%", score };
  if (score <= 3) return { label: "Good", color: "bg-yellow-500", width: "60%", score };
  if (score <= 4) return { label: "Strong", color: "bg-lime-500", width: "80%", score };
  return { label: "Very Strong", color: "bg-green-500", width: "100%", score };
}

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeAddress = sanitize(address);

    if (!safeName) { showToast("Name is required", "error"); return; }
    if (!isEmail(safeEmail)) { showToast("Enter a valid email address", "error"); return; }
    if (!minLen(password)) { showToast("Password must be at least 6 characters", "error"); return; }
    if (!/^\d{10}$/.test(mobile)) { showToast("Enter a valid 10-digit mobile number", "error"); return; }
    if (!safeAddress) { showToast("Address is required", "error"); return; }
    if (!/^\d{6}$/.test(pincode)) { showToast("Enter a valid 6-digit pincode", "error"); return; }
    if (!agreeTerms) { showToast("Please agree to the Terms & Privacy policy", "error"); return; }

    try {
      setLoading(true);
      await api.post("/auth/register", {
        name: safeName,
        email: safeEmail,
        password,
        mobile,
        address: safeAddress,
        pincode,
      });
      localStorage.setItem("pendingEmail", safeEmail);
      showToast("Account created! Please verify your email.", "success");
      navigate("/verify-otp");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-12 pr-4 py-3.5 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors duration-300";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
      <div className="w-full max-w-lg backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm mb-4 transition-transform duration-300 hover:scale-110">
            <FiUser className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/70 mt-2">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="sr-only">Full Name</label>
            <div className="relative group">
              <FiUser className={iconClass} />
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                autoComplete="name"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="sr-only">Email</label>
            <div className="relative group">
              <FiMail className={iconClass} />
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="sr-only">Password</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors duration-300" />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                className="w-full pl-12 pr-12 py-3.5 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-300"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <span className="text-xs text-white/60 min-w-[5rem] text-right">{strength.label}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="reg-mobile" className="sr-only">Mobile Number</label>
            <div className="relative group">
              <FiSmartphone className={iconClass} />
              <input
                id="reg-mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Mobile Number"
                autoComplete="tel"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-address" className="sr-only">Address</label>
            <div className="relative group">
              <FiMapPin className="absolute left-4 top-4 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors duration-300" />
              <textarea
                id="reg-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full Address"
                rows={2}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-pincode" className="sr-only">Pincode</label>
            <div className="relative group">
              <FiHash className={iconClass} />
              <input
                id="reg-pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Pincode"
                autoComplete="postal-code"
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-white/70 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-white/30 bg-white/10 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer shrink-0"
            />
            <span>
              I agree to the{" "}
              <span className="text-white hover:text-white/80 font-medium">Terms of Service</span>{" "}
              and{" "}
              <span className="text-white hover:text-white/80 font-medium">Privacy Policy</span>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-3 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Creating account...
              </>
            ) : (
              "Register & Send OTP"
            )}
          </button>
        </form>

        <p className="text-center text-white/60 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:text-white/80 font-medium transition-colors duration-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
