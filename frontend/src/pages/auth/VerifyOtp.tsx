import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import api from "../../api/axios";
import { useToast } from "../../hooks/useToast";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 300;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const email = localStorage.getItem("pendingEmail") || "";
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      showToast("Session expired. Please register again.", "error");
      navigate("/register");
    }
  }, [email, navigate, showToast]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!data) return;
    setOtp(data.split("").concat(Array(OTP_LENGTH - data.length).fill("")));
    const focusIndex = Math.min(data.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (!email) { showToast("Session expired. Please register again.", "error"); return; }
    if (otpString.length !== OTP_LENGTH) { showToast("Please enter the complete 6-digit OTP", "error"); return; }

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { email, otp: otpString });
      localStorage.removeItem("pendingEmail");
      showToast("Email verified successfully! Please login.", "success");
      navigate("/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "OTP verification failed. Please try again.";
      showToast(msg, "error");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    try {
      await api.post("/auth/resend-otp", { email });
      showToast("OTP resent successfully", "success");
      setCanResend(false);
      setTimer(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to resend OTP";
      showToast(msg, "error");
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm mb-4 transition-transform duration-300 hover:scale-110">
            <FiMail className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Verify Email</h1>
          <p className="text-white/70 mt-2">
            Enter the 6-digit code sent to
          </p>
          <p className="text-white font-medium mt-1 break-all">{email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                maxLength={1}
                aria-label={`OTP digit ${index + 1}`}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl text-white outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </button>
        </form>

        <div className="text-center mt-6 space-y-3">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-white hover:text-white/80 font-medium transition-colors duration-300 underline underline-offset-2"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-white/60 text-sm">
              Resend code in <span className="text-white font-mono">{formatTime(timer)}</span>
            </p>
          )}
        </div>

        <p className="text-center text-white/60 mt-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium transition-colors duration-300">
            <FiArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
