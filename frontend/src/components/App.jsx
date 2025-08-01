import { useState, useEffect } from "react";
import WelcomeScreen from "./WelcomeScreen.jsx";
import QuizRunner from "./QuizRunner.jsx";
useEffect(() => {
  // Load Telegram Web App script dynamically
  const script = document.createElement('script');
  script.src = 'https://telegram.org/js/telegram-web-app.js';
  script.async = true;
  script.onload = () => {
    console.log('✅ Telegram Web App script loaded');
  };
  document.head.appendChild(script);

  return () => {
    // Cleanup
    document.head.removeChild(script);
  };
}, []);


export default function App() {
  const [step, setStep] = useState("welcome");
  const [userData, setUserData] = useState(null);

  const handleContinue = (user) => {
    setUserData(user);
    setStep("quiz");
  };

  return (
    <>
      {step === "welcome" && <WelcomeScreen onContinue={handleContinue} />}
      {step === "quiz" && <QuizRunner userData={userData} />}
    </>
  );
}