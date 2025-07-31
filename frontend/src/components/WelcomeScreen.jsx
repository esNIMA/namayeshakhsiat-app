import { useState, useEffect } from "react";
import axios from "axios";

export default function WelcomeScreen({ onContinue }) {
  const [step, setStep] = useState("welcome");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [telegramUser, setTelegramUser] = useState(null);

  // دریافت اطلاعات کاربر از Telegram Web App
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // تنظیم theme
      tg.setHeaderColor('#7c3aed');
      tg.setBackgroundColor('#f8fafc');

      // دریافت اطلاعات کاربر
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTelegramUser(user);
        console.log('Telegram User:', user);
      } else {
        setError("اطلاعات کاربر از تلگرام دریافت نشد");
      }
    } else {
      // برای تست در development
      console.warn("Telegram Web App API not available");
      setTelegramUser({
        id: 123456789,
        first_name: "Test User",
        username: "testuser"
      });
    }
  }, []);

  const handleCheckMembership = async () => {
    if (!telegramUser) {
      setError("اطلاعات کاربر موجود نیست");
      return;
    }

    setChecking(true);
    setError("");

    try {
      const response = await axios.post("/api/verify-membership/", {
        telegram_id: telegramUser.id,
        username: telegramUser.username || '',
        first_name: telegramUser.first_name || '',
        last_name: telegramUser.last_name || ''
      });

      setChecking(false);

      if (response.data.success && response.data.is_member) {
        // نمایش پیغام موفقیت
        setStep("verified");

        // بعد از 2 ثانیه انتقال به آزمون
        setTimeout(() => {
          onContinue();
        }, 2000);
      } else {
        setError(response.data.error || "شما عضو کانال نیستید");
      }
    } catch (err) {
      setChecking(false);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("خطا در اتصال به سرور");
      }

      console.error("Membership check error:", err);
    }
  };

  // بررسی خودکار عضویت در ابتدا
  useEffect(() => {
    if (telegramUser && step === "welcome") {
      // تاخیر کوتاه برای UX بهتر
      setTimeout(() => {
        handleAutoCheck();
      }, 1000);
    }
  }, [telegramUser, step]);

  const handleAutoCheck = async () => {
    if (!telegramUser) return;

    try {
      const response = await axios.post("/api/verify-membership/", {
        telegram_id: telegramUser.id,
        username: telegramUser.username || '',
        first_name: telegramUser.first_name || '',
        last_name: telegramUser.last_name || ''
      });

      if (response.data.success && response.data.is_member) {
        // کاربر قبلاً عضو است، مستقیماً انتقال
        onContinue();
      } else {
        // کاربر عضو نیست، نمایش صفحه عضویت
        setStep("check-membership");
      }
    } catch (err) {
      // در صورت خطا، نمایش صفحه عضویت
      setStep("check-membership");
      console.error("Auto check error:", err);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 text-center space-y-6">

        {/* صفحه خوش‌آمدگویی */}
        {step === "welcome" && (
          <>
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-4"></div>
            </div>
            <h1 className="text-2xl font-bold text-purple-800">👤 نمای شخصیت</h1>
            <p className="text-gray-600 text-sm">
              در حال بررسی عضویت شما...
            </p>
            {telegramUser && (
              <p className="text-xs text-gray-500">
                خوش آمدید {telegramUser.first_name}!
              </p>
            )}
          </>
        )}

        {/* صفحه بررسی عضویت */}
        {step === "check-membership" && (
          <>
            <div className="text-4xl mb-4">📢</div>
            <h2 className="text-xl font-semibold text-purple-700">عضویت در کانال</h2>

            <div className="bg-purple-50 p-4 rounded-xl text-sm text-gray-700">
              <p className="mb-2">برای شروع آزمون شخصیت، لطفاً ابتدا در کانال ما عضو شوید:</p>

              <a
                href="https://t.me/havalikhodemoon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                📱 عضویت در کانال
              </a>
            </div>

            <button
              onClick={handleCheckMembership}
              disabled={checking}
              className={`w-full font-semibold py-3 px-4 rounded-xl transition text-sm ${
                checking 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {checking ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  در حال بررسی...
                </span>
              ) : (
                "✅ عضو شدم، بررسی کن"
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-red-600 text-xs mt-1"
                >
                  بستن
                </button>
              </div>
            )}

            {telegramUser && (
              <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                کاربر: {telegramUser.first_name} ({telegramUser.id})
              </div>
            )}
          </>
        )}

        {/* صفحه تایید */}
        {step === "verified" && (
          <>
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h2 className="text-xl font-semibold text-green-700">عضویت تایید شد!</h2>
            <p className="text-gray-600 text-sm">
              در حال انتقال به آزمون شخصیت...
            </p>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}