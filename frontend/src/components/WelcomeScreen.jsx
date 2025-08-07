import { useState, useEffect } from "react";

export default function WelcomeScreen({ onContinue }) {
  const [telegramUser, setTelegramUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telegramApiLoaded, setTelegramApiLoaded] = useState(false);

  // بارگذاری Dynamic Telegram Web App Script
  useEffect(() => {
    const loadTelegramScript = () => {
      return new Promise((resolve, reject) => {
        // بررسی اگر قبلاً بارگذاری شده
        if (window.Telegram?.WebApp) {
          console.log('✅ Telegram API already loaded');
          setTelegramApiLoaded(true);
          resolve();
          return;
        }

        // بررسی اگر script قبلاً اضافه شده
        const existingScript = document.querySelector('script[src*="telegram-web-app.js"]');
        if (existingScript) {
          console.log('⏳ Telegram script already exists, waiting...');
          // منتظر بمانیم تا لود شود
          existingScript.onload = () => {
            console.log('✅ Existing Telegram script loaded');
            setTelegramApiLoaded(true);
            resolve();
          };
          return;
        }

        console.log('📥 Loading Telegram Web App script...');

        // ایجاد script tag جدید
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;

        script.onload = () => {
          console.log('✅ Telegram script loaded successfully');
          setTelegramApiLoaded(true);
          resolve();
        };

        script.onerror = () => {
          console.error('❌ Failed to load Telegram script');
          reject(new Error('Failed to load Telegram script'));
        };

        // اضافه کردن به head
        document.head.appendChild(script);
      });
    };

    // شروع بارگذاری
    loadTelegramScript()
      .then(() => {
        // کمی صبر کنیم تا API کاملاً آماده شود
        setTimeout(() => {
          initializeTelegramApp();
        }, 500);
      })
      .catch((error) => {
        console.warn('⚠️ Telegram script loading failed:', error);
        useFallbackUser();
      });
  }, []);

  // راه‌اندازی Telegram App و دریافت User Data
  const initializeTelegramApp = () => {
    console.log('🔍 Initializing Telegram App...');
    console.log('window.Telegram:', !!window.Telegram);
    console.log('window.Telegram.WebApp:', !!window.Telegram?.WebApp);

    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // راه‌اندازی اولیه
      tg.ready();

      // تنظیم theme
      tg.setHeaderColor('#7c3aed');
      tg.setBackgroundColor('#f8fafc');

      // نمایش اطلاعات debug
      console.log('🔍 Telegram WebApp Object:', tg);
      console.log('🔍 initDataUnsafe:', tg.initDataUnsafe);
      console.log('🔍 initData (raw):', tg.initData);

      // دریافت اطلاعات کاربر
      const user = tg.initDataUnsafe?.user;

      if (user && user.id) {
        console.log('✅ Real Telegram User Found:', user);
        setTelegramUser({
          id: user.id,
          first_name: user.first_name || 'کاربر',
          last_name: user.last_name || '',
          username: user.username || '',
          language_code: user.language_code || 'fa',
          is_premium: user.is_premium || false
        });
      } else {
        console.warn('⚠️ No user data available in initDataUnsafe');
        console.log('📝 Available data:', {
          initDataUnsafe: tg.initDataUnsafe,
          initData: tg.initData,
          isFromTelegram: !!tg.initData
        });

        // اگر داخل Telegram هستیم ولی user data نیست
        if (tg.initData) {
          console.log('📱 Inside Telegram but no user data, using basic info');
          setTelegramUser({
            id: 'telegram_user',
            first_name: 'کاربر تلگرام',
            username: '',
            from_telegram: true
          });
        } else {
          console.log('🌐 Outside Telegram, using fallback');
          useFallbackUser();
        }
      }
    } else {
      console.warn('❌ Telegram WebApp API still not available');
      useFallbackUser();
    }

    // پایان loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // استفاده از کاربر جایگزین
  const useFallbackUser = () => {
    console.log('🔄 Using fallback user for development/testing');
    setTelegramUser({
      id: 136758283,
      first_name: "¤|N.I.M.A|¤",
      username: "sNIIMA",
      is_fallback: true
    });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // انتقال خودکار به صفحه بعدی
  useEffect(() => {
    if (telegramUser && !loading) {
      setTimeout(() => {
        onContinue(telegramUser);
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
              {telegramApiLoaded ?
                'در حال دریافت اطلاعات کاربر...' :
                'در حال اتصال به تلگرام...'
              }
            </p>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full animate-pulse transition-all duration-500"
                style={{width: telegramApiLoaded ? '80%' : '40%'}}
              ></div>
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
                {telegramUser.is_fallback && <span className="text-orange-500"> (حالت تست)</span>}
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
  user_id: telegramUser.id,
  first_name: telegramUser.first_name,
  username: telegramUser.username,
  telegram_api_loaded: telegramApiLoaded,
  telegram_available: !!window.Telegram?.WebApp,
  is_fallback: telegramUser.is_fallback || false,
  from_telegram: telegramUser.from_telegram || false
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