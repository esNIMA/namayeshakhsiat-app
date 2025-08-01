import { useState, useEffect } from "react";

export default function WelcomeScreen({ onContinue }) {
  const [telegramUser, setTelegramUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Clear all cache first
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }

    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // تنظیم theme
      tg.setHeaderColor('#7c3aed');
      tg.setBackgroundColor('#f8fafc');

      // Debug: نمایش همه اطلاعات
      const fullDebug = {
        timestamp: new Date().toISOString(),
        telegram_available: !!window.Telegram?.WebApp,
        webApp_version: tg.version || 'unknown',
        platform: tg.platform || 'unknown',
        initData: tg.initData || 'empty',
        initDataUnsafe: tg.initDataUnsafe || {},
        user_from_unsafe: tg.initDataUnsafe?.user || null,
        query_id: tg.initDataUnsafe?.query_id || 'none',
        auth_date: tg.initDataUnsafe?.auth_date || 'none'
      };

      setDebugInfo(JSON.stringify(fullDebug, null, 2));
      console.log('🔍 FULL DEBUG INFO:', fullDebug);

      // کمی صبر کنیم تا data کاملاً load بشه
      setTimeout(() => {
        const user = tg.initDataUnsafe?.user;
        console.log('👤 USER DATA AFTER TIMEOUT:', user);

        if (user && user.id) {
          setTelegramUser(user);
          console.log('✅ User set:', user);
        } else {
          console.error('❌ No valid user data');
          setError(`No user data. Full debug: ${JSON.stringify(fullDebug, null, 2)}`);
        }

        setLoading(false);
      }, 1000);

    } else {
      const debugInfo = {
        timestamp: new Date().toISOString(),
        error: 'Telegram Web App API not available',
        window_telegram: !!window.Telegram,
        user_agent: navigator.userAgent
      };

      setDebugInfo(JSON.stringify(debugInfo, null, 2));
      setError("این اپ فقط در تلگرام کار می‌کند");
      setLoading(false);
    }
  }, []);

  const handleContinue = () => {
    if (telegramUser) {
      console.log('🚀 Continuing with user:', telegramUser);
      onContinue(telegramUser);
    } else {
      alert('هیچ اطلاعات کاربری موجود نیست!');
    }
  };

  const copyDebugInfo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(debugInfo);
      alert('Debug info copied to clipboard!');
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = debugInfo;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Debug info copied!');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 text-center space-y-4">

        <h1 className="text-xl font-bold text-purple-800">🔍 Debug Mode</h1>

        {/* نمایش وضعیت */}
        <div className="text-sm space-y-2">
          <div className={`p-2 rounded ${loading ? 'bg-yellow-100' : telegramUser ? 'bg-green-100' : 'bg-red-100'}`}>
            <strong>Status:</strong> {loading ? 'Loading...' : telegramUser ? 'User Loaded' : 'Error'}
          </div>

          {telegramUser && (
            <div className="bg-blue-100 p-2 rounded">
              <strong>User:</strong> {telegramUser.first_name} (ID: {telegramUser.id})
            </div>
          )}

          {error && (
            <div className="bg-red-100 p-2 rounded text-red-700 text-xs">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Debug Info */}
        <details className="text-xs bg-gray-100 p-3 rounded">
          <summary className="cursor-pointer font-semibold mb-2">📋 Full Debug Info</summary>
          <pre className="text-left overflow-auto max-h-60 bg-white p-2 rounded border">
            {debugInfo}
          </pre>
          <button
            onClick={copyDebugInfo}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs"
          >
            📋 Copy Debug Info
          </button>
        </details>

        {/* دکمه‌ها */}
        <div className="space-y-2">
          {telegramUser && (
            <button
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition text-sm"
            >
              ✅ Continue with {telegramUser.first_name}
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition text-sm"
          >
            🔄 Reload Page
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition text-sm"
          >
            🗑️ Clear All Cache & Reload
          </button>
        </div>

        {/* Real-time info */}
        <div className="text-xs text-gray-500">
          Timestamp: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}