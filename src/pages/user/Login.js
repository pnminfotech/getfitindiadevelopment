// src/pages/auth/Login.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimage from "../../assets/backgroundlogin.png";

const BACKEND_URL = "http://localhost:8000/api/auth"; // base URL for backend

const Login = () => {
  const [mobile, setMobile] = useState("91"); // always starts with '91'
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // cooldown and lockout UX
  const [cooldown, setCooldown] = useState(0); // seconds to wait before re-requesting OTP
  const [lockMsg, setLockMsg] = useState(""); // message from lock/blocked responses
  const cooldownTimerRef = useRef(null);

  // NEW: hard UI block if backend says account is blocked or temp-locked
  const [isBlocked, setIsBlocked] = useState(false);

  const navigate = useNavigate();

  // Instant check: show admin block or temp lock as soon as 91+10 digits are present
  useEffect(() => {
    let aborted = false;

    const run = async () => {
      if (!/^91\d{10}$/.test(mobile)) {
        if (!otpSent) {
          setIsBlocked(false);
          setLockMsg("");
        }
        return;
      }

      await new Promise((r) => setTimeout(r, 300));
      if (aborted) return;

      try {
        const res = await fetch(
          `${BACKEND_URL}/check-block?mobile=${encodeURIComponent(mobile)}`
        );
        if (!res.ok) return;
        const data = await res.json();

        if (data?.blocked || data?.tempLocked) {
          setIsBlocked(true);
          const msg = data?.blocked
            ? "Your account is blocked by the admin."
            : `Too many invalid OTP attempts. Try again after ${
                data?.lockUntil
                  ? new Date(data.lockUntil).toLocaleString()
                  : "some time"
              }.`;
          setLockMsg(msg);
          setOtpSent(false);
          clearCooldown();
        } else {
          setIsBlocked(false);
          if (!otpSent) setLockMsg("");
        }
      } catch {
        // ignore; we’ll still catch on send/verify paths
      }
    };

    run();
    return () => {
      aborted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile]);

  // cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const startCooldown = (seconds) => {
    setCooldown(seconds);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const clearCooldown = () => {
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    setCooldown(0);
  };

  const normalizeMobile = (val) => {
    let v = String(val || "").replace(/\D/g, ""); // digits only
    if (!v.startsWith("91")) v = "91" + v.replace(/^91/, "");
    if (v.length > 12) v = v.slice(0, 12);
    return v;
  };

  const isValidMobile = (val) => /^91\d{10}$/.test(val);

  const handleSendOtp = async () => {
    if (!isValidMobile(mobile)) {
      alert("Enter a valid mobile as 91 followed by 10 digits.");
      return;
    }
    if (isBlocked) return; // UI guard

    setLoading(true);
    setLockMsg("");

    try {
      const res = await fetch(`${BACKEND_URL}/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setOtp("");
        startCooldown(60);
      } else if (res.status === 429) {
        // server-side throttling
        const secs = parseInt(String(data?.error || "").match(/(\d+)s/)?.[1] || "30", 10);
        startCooldown(Math.max(20, secs));
        alert(data?.error || "Too many OTP requests. Please try again later.");
      } else if (res.status === 403) {
        // Admin block — hard stop
        setIsBlocked(true);
        setOtpSent(false);
        clearCooldown();
        setLockMsg(data?.error || "Your account is blocked by the admin.");
        alert(data?.error || "Your account is blocked by the admin.");
      } else if (res.status === 423) {
        // Temp lock — hard stop with remaining time
        setIsBlocked(true);
        setOtpSent(false);
        clearCooldown();
        const msg =
          data?.error ||
          (data?.lockUntil
            ? `Too many invalid OTP attempts. Try again after ${new Date(data.lockUntil).toLocaleString()}`
            : "Too many invalid OTP attempts. Please try again later.");
        setLockMsg(msg);
        alert(msg);
      } else {
        alert(data?.error || "Failed to send OTP.");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    if (!/^\d{6}$/.test(otp)) return alert("OTP must be 6 digits.");
    if (isBlocked) return; // UI guard

    setLoading(true);
    setLockMsg("");

    try {
      const res = await fetch(`${BACKEND_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user?.role || "user");
        navigate("/user/sportsvenue");
      } else if (res.status === 423) {
        const msg = data?.error || "Too many wrong attempts. Try later.";
        setLockMsg(msg);
        alert(msg);
      } else if (res.status === 403) {
        // Admin block or enforced lock — hard stop
        setIsBlocked(true);
        clearCooldown();
        setLockMsg(data?.error || "Your account is blocked.");
        alert(data?.error || "Your account is blocked.");
      } else if (res.status === 400 || res.status === 401) {
        alert(data?.error || "Invalid OTP or mobile.");
      } else {
        alert(data?.error || "Verification failed.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryClick = async () => {
    if (!otpSent) {
      await handleSendOtp();
    } else {
      await handleVerifyOtp();
    }
  };

  const resetToChangeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setLockMsg("");
    setIsBlocked(false); // new number may not be blocked
    clearCooldown();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60" />

      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105 mx-auto md:mx-0">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 md:text-4xl">
          Welcome Back!
        </h2>

        {/* Mobile Input */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mobile Number (starts with 91)
        </label>
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(normalizeMobile(e.target.value))}
          placeholder="91XXXXXXXXXX"
          maxLength={12}
          className="w-full px-5 py-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          disabled={otpSent} // lock the number once OTP is sent
        />

        {/* Status messages */}
        {!otpSent ? (
          isBlocked ? (
            <span className="block mb-2 text-sm text-red-600">{lockMsg}</span>
          ) : (
            <span className={`block mb-2 text-sm ${isValidMobile(mobile) ? "text-green-600" : "text-gray-500"}`}>
              {isValidMobile(mobile) ? "Mobile looks good." : "Enter 91 + 10 digits."}
            </span>
          )
        ) : null}

        {/* OTP Input (shown after OTP is sent) */}
        {otpSent && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="******"
              inputMode="numeric"
              maxLength={6}
              className="w-full px-5 py-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 tracking-widest"
              disabled={isBlocked}
            />

            {/* Lock/Blocked message */}
            {(lockMsg || isBlocked) && (
              <div className="text-red-600 text-sm mb-2">
                {lockMsg || "Your account is blocked."}
              </div>
            )}
          </>
        )}

        {/* Primary Button */}
        <button
          onClick={handlePrimaryClick}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-indigo-700 transition duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={
            loading ||
            isBlocked ||
            (!otpSent && (cooldown > 0 || !isValidMobile(mobile))) ||
            (otpSent && otp.length !== 6)
          }
        >
          {loading
            ? "Processing..."
            : isBlocked
            ? "Blocked"
            : !otpSent
            ? cooldown > 0
              ? `Send OTP (${cooldown}s)`
              : "Send OTP"
            : "Verify OTP"}
        </button>

        {/* Secondary Actions */}
        <div className="mt-4 flex items-center justify-between">
          {!otpSent ? (
            <span className="text-sm text-gray-500">{isBlocked ? lockMsg : ""}</span>
          ) : (
            <>
              <button
                type="button"
                onClick={resetToChangeNumber}
                className="text-sm text-gray-600 underline hover:text-gray-800"
              >
                Change number
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-sm underline disabled:text-gray-400"
                disabled={loading || cooldown > 0 || isBlocked}
                title={
                  isBlocked
                    ? lockMsg || "Blocked"
                    : cooldown > 0
                    ? `You can resend in ${cooldown}s`
                    : "Resend OTP"
                }
                style={{
                  color: isBlocked ? "#9ca3af" : "#4f46e5",
                  cursor: isBlocked ? "not-allowed" : "pointer",
                }}
              >
                {isBlocked ? "Resend Disabled" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </>
          )}
        </div>

        {/* Small hint */}
        {otpSent && !isBlocked && (
          <p className="text-xs text-gray-500 mt-3">
            Tip: OTP is valid for 5 minutes. Too many wrong attempts will temporarily lock verification.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
