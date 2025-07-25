import { useState } from "react";
import WelcomeScreen from "./WelcomeScreen.jsx";
import QuizRunner from "./QuizRunner.jsx";

export default function App() {
  const [step, setStep] = useState("welcome");

  return (
    <>
      {step === "welcome" && <WelcomeScreen onContinue={() => setStep("quiz")} />}
      {step === "quiz" && <QuizRunner />}
    </>
  );
}