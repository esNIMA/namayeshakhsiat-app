import { useState, useEffect } from "react";

export default function WelcomeScreen({ onContinue }) {
  const [telegramUser, setTelegramUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      if (user && user.id) {
        setTelegramUser(user);
        console.log('Telegram User:', user);
      } else {
        console.warn("User data not available, using fallback");
        // Fallback برای development یا مشکلات API
        setTelegramUser({
          id: 136758283,
          first_name: "¤|N.I.M.A|¤",
          username: "sNIIMA"
        });
      }
    } else {
      console.warn("Telegram Web App API not available, using fallback");
      // Fallback برای تست خارج از Telegram
      setTelegramUser({
        id: 136758283,
        first_name: "¤|N.I.M.A|¤",
        username: "sNIIMA"
      });
    }

    // بعد از 2 ثانیه loading رو متوقف کن
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // اگه user آماده باشه، مستقیماً به تست برو
  useEffect(() => {
    if (telegramUser && !loading) {
      setTimeout(() => {
        onContinue(telegramUser); // User data رو پاس میکنیم
      }, 1000);
    }
  }, [telegramUser, loading, onContinue]);

  const handleManualStart = () => {
    if (telegramUser) {
      onContinue(telegramUser);
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

        {loading ? (
          <>
            <p className="text-gray-600 text-sm">
              در حال آماده‌سازی تست برای شما...
            </p>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-sm">
              آماده‌سازی کامل شد! در حال انتقال...
            </p>
            {telegramUser && (
              <p className="text-xs text-gray-500">
                خوش آمدید {telegramUser.first_name}! 🎉
              </p>
            )}
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </>
        )}

        {/* Debug Info برای development */}
        {telegramUser && !loading && (
          <details className="text-xs bg-gray-100 p-2 rounded">
            <summary className="cursor-pointer text-gray-600">🔍 Debug Info</summary>
            <pre className="text-left mt-2 text-gray-700">
{JSON.stringify({
  id: telegramUser.id,
  first_name: telegramUser.first_name,
  username: telegramUser.username,
  telegram_api: !!window.Telegram?.WebApp
}, null, 2)}
            </pre>
          </details>
        )}

        {/* دکمه اضطراری برای شروع دستی */}
        {!loading && (
          <button
            onClick={handleManualStart}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition text-sm"
          >
            🚀 شروع آزمون
          </button>
        )}
      </div>
    </div>
  );
}