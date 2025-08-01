import { useState } from "react";
import WelcomeScreen from "./WelcomeScreen.jsx";
import QuizRunner from "./QuizRunner.jsx";

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