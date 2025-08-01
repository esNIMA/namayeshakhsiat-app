import { useState, useEffect } from "react";

export default function WelcomeScreen({ onContinue }) {
  const [telegramUser, setTelegramUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      console.log('🔍 DEBUG: Full Telegram data:', tg.initDataUnsafe);
      console.log('👤 DEBUG: User data:', user);

      if (user && user.id) {
        setTelegramUser(user);
        console.log('✅ Telegram User loaded:', user);
      } else {
        console.error('❌ No user data from Telegram');
        setError("اطلاعات کاربر از تلگرام دریافت نشد");
        // نمایش debug info
        alert(`Debug Info:\nTelegram API: ${!!window.Telegram?.WebApp}\nUser Data: ${JSON.stringify(user, null, 2)}\nFull Data: ${JSON.stringify(tg.initDataUnsafe, null, 2)}`);
      }
    } else {
      console.error('❌ Telegram Web App API not available');
      setError("این اپلیکیشن فقط از طریق تلگرام قابل استفاده است");
    }

    // بعد از 3 ثانیه loading رو متوقف کن
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  // اگه user آماده باشه، مستقیماً به تست برو
  useEffect(() => {
    if (telegramUser && !loading && !error) {
      setTimeout(() => {
        onContinue(telegramUser); // User data رو پاس میکنیم
      }, 1000);
    }
  }, [telegramUser, loading, error, onContinue]);

  const handleManualStart = () => {
    if (telegramUser) {
      onContinue(telegramUser);
    } else {
      alert('هیچ اطلاعات کاربری موجود نیست');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 text-center space-y-6">

        {/* صفحه لودینگ */}
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-4"></div>
        </div>

        <h1 className="text-2xl font-bold text-purple-800">👤 نمای شخصیت</h1>

        {/* نمایش Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-red-500 text-xs mt-2">
              لطفاً از طریق دکمه Web App در تلگرام وارد شوید
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && !error ? (
          <>
            <p className="text-gray-600 text-sm">
              در حال دریافت اطلاعات کاربر از تلگرام...
            </p>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </>
        ) : !error && telegramUser ? (
          <>
            <p className="text-gray-600 text-sm">
              آماده‌سازی کامل شد! در حال انتقال...
            </p>
            <p className="text-xs text-gray-500">
              خوش آمدید {telegramUser.first_name}! 🎉
            </p>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </>
        ) : null}

        {/* Debug Info - همیشه نمایش بده */}
        <details className="text-xs bg-gray-100 p-2 rounded">
          <summary className="cursor-pointer text-gray-600">🔍 Debug Info</summary>
          <pre className="text-left mt-2 text-gray-700">
{JSON.stringify({
  telegram_api_available: !!window.Telegram?.Web App,
  user_data: telegramUser,
  has_error: !!error,
  loading: loading
}, null, 2)}
          </pre>
        </details>

        {/* دکمه اضطراری فقط اگه User داریم */}
        {!loading && telegramUser && (
          <button
            onClick={handleManualStart}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition text-sm"
          >
            🚀 شروع آزمون
          </button>
        )}

        {/* دکمه reload اگه مشکل داریم */}
        {!loading && error && (
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition text-sm"
          >
            🔄 تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
}