import { useState } from "react";
import axios from "axios";

export default function WelcomeScreen({ onContinue }) {
  const [step, setStep] = useState("welcome");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const handleCheckMembership = async () => {
    setChecking(true);
    setError("");

    try {
      const userId = "user-id-here"; // شناسه کاربر تلگرام باید به این صورت دریافت شود
      const channelUsername = "havalikhodemoon"; // نام کانال تلگرام

      const response = await axios.post("/checkmembership/", {
        user_id: userId,
        channel_username: channelUsername,
      });

      setChecking(false);

      if (response.data.success) {
        onContinue(); // انتقال به آزمون
      } else {
        setError(response.data.error || "خطا در بررسی عضویت.");
      }
    } catch (err) {
      setChecking(false);
      setError("خطا در اتصال به سرور.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 text-center space-y-6">
        {step === "welcome" && (
          <>
            <h1 className="text-2xl font-bold text-purple-800">👤 نمای شخصیت</h1>
            <p className="text-gray-700 text-sm leading-relaxed text-justify">
              نمای شخصیت با هدف ایجاد یک منِ برتر با جنبه‌های خودشناسی یا شخصیت‌شناسی طراحی شده...
            </p>
            <button
              onClick={() => setStep("check-membership")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-gray-800 font-semibold py-2 px-4 rounded-xl transition text-sm"
            >
              ✅ استارت آزمون
            </button>
          </>
        )}

        {step === "check-membership" && (
          <>
            <h2 className="text-lg font-semibold text-purple-700">📢 عضویت در کانال</h2>
            <p className="text-gray-700 text-sm">
              برای شروع آزمون، لطفاً ابتدا در کانال ما عضو شوید:
            </p>
            <a
              href="https://t.me/havalikhodemoon"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 underline mt-2"
            >
              @havalikhodemoon
            </a>

            <button
              onClick={handleCheckMembership}
              disabled={checking}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-gray-800 font-semibold py-2 px-4 rounded-xl transition text-sm"
            >
              {checking ? "در حال بررسی..." : "✅ عضو شدم، بررسی کن"}
            </button>

            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
