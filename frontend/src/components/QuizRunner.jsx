import { useEffect, useState } from "react";

const SECTION_COLORS = [
  "bg-rose-50", "bg-orange-50", "bg-amber-50", "bg-lime-50", "bg-green-50",
  "bg-cyan-50", "bg-sky-50", "bg-indigo-50", "bg-fuchsia-50", "bg-pink-50"
];

const PLACEHOLDER_TELEGRAM_ID = 123456789;

export default function QuizRunner() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("quiz_progress");
    return saved ? JSON.parse(saved) : {};
  });
  const [score, setScore] = useState(5);
  const [description, setDescription] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:8000/api/questions/");
        const data = await res.json();

        const sectionOrder = {};
        let counter = 1;

        const formatted = data.map((q) => {
          const sectionId = q.section?.id;
          if (!sectionId) return null;

          if (!(sectionId in sectionOrder)) {
            sectionOrder[sectionId] = counter++;
          }

          return {
            id: q.id,
            text: q.text,
            section_id: sectionId,
            section_name: q.section.name,
            section_order: sectionOrder[sectionId],
            order: q.order
          };
        }).filter(Boolean);

        setQuestions(formatted);
        setLoaded(true);
      } catch (err) {
        console.error("❌ خطا در دریافت سوالات:", err);
      }
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const saved = localStorage.getItem("quiz_progress");
      if (saved) {
        const savedProgress = JSON.parse(saved);
        const answeredIds = Object.keys(savedProgress).map(id => parseInt(id));
        const nextIndex = questions.findIndex(q => !answeredIds.includes(q.id));
        setCurrentIndex(nextIndex === -1 ? questions.length : nextIndex);
      }
    }
  }, [questions]);

  useEffect(() => {
    localStorage.setItem("quiz_progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const currentQuestion = questions[currentIndex];
    if (currentQuestion && progress[currentQuestion.id]) {
      const prev = progress[currentQuestion.id];
      setScore(prev.score);
      setDescription(prev.description);
    } else {
      setScore(5);
      setDescription("");
    }
  }, [currentIndex, questions, progress]);

  const handleNext = () => {
  const current = questions[currentIndex];
  if (!current) return;

  const updated = {
    ...progress,
    [current.id]: {
      question: current.text,
      score,
      description,
      section: current.section_name
    }
  };
  setProgress(updated);

  if (currentIndex + 1 < questions.length) {
    setCurrentIndex(currentIndex + 1);
  } else {
    submitAnswersToAPI(updated);
    setSubmitted(true);
  }
};


  const handleRestart = () => {
    localStorage.removeItem("quiz_progress");
    setProgress({});
    setScore(5);
    setDescription("");
    setCurrentIndex(0);
    setSubmitted(false);
  };

  const submitAnswersToAPI = async (finalProgress) => {
  const telegramId = PLACEHOLDER_TELEGRAM_ID;
  const payload = {
    user: telegramId,  // اینجا از telegramId واقعی استفاده کن
    first_name: "Ali",  // می‌تونی از این برای اسم استفاده کنی
    answers: Object.entries(finalProgress).map(([questionId, answer]) => ({
      question: parseInt(questionId),
      score: answer.score,
      description: answer.description
    }))
  };

  console.log("📤 داده ارسال‌شده به سرور:", JSON.stringify(payload, null, 2));

  try {
    const res = await fetch("http://localhost:8000/api/answer-submissions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log("🟡 وضعیت سرور:", res.status);
    console.log("📝 پاسخ سرور:", text);

    if (!res.ok) {
      throw new Error(`ارسال به سرور ناموفق بود. وضعیت: ${res.status}`);
    }

    console.log("✅ پاسخ‌ها با موفقیت ارسال شدند");
  } catch (err) {
    console.error("❌ خطا در ارسال پاسخ‌ها:", err);
  }
};

  if (!loaded || questions.length === 0) {
    return <p className="text-center mt-8">در حال بارگذاری سوالات...</p>;
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-8">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-green-700">✅ آزمون شما ثبت شد</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            ممنون بابت شرکت در آزمون.
            <br />
            🔑 کد پیگیری شما:
            <br />
            <span className="font-mono text-lg text-purple-700">{PLACEHOLDER_TELEGRAM_ID}</span>
          </p>
          <button
            onClick={handleRestart}
            className="w-full mt-4 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-2 rounded-xl text-sm"
          >
            🔁 انجام مجدد آزمون
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex] || {};
  const sectionColor =
    typeof current.section_order === "number"
      ? SECTION_COLORS[current.section_order % SECTION_COLORS.length]
      : "bg-white";
  const progressPercent = Math.round((currentIndex / questions.length) * 100);

  return (
    <div className={`min-h-screen w-screen flex items-center justify-center px-4 py-8 ${sectionColor}`}>
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="space-y-1 text-right">
          <h2 className="text-sm font-medium text-gray-500">
            بخش {current.section_order}: {current.section_name}
          </h2>
          <p className="text-base text-gray-800 font-semibold leading-relaxed">
            سوال {currentIndex + 1} از {questions.length}: {current.text}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600">امتیاز (۱ تا ۱۰):</label>
            <input
              type="range"
              min="1"
              max="10"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-purple-700 font-medium">امتیاز: {score}</div>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="توضیح کوتاه بنویس..."
            rows="3"
          ></textarea>

          <div className="flex justify-between gap-2 pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-2 rounded-xl text-sm"
            >
              🔁 ری‌استارت
            </button>

            <button
              onClick={() => {
                if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
              }}
              disabled={currentIndex === 0}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-xl text-sm disabled:opacity-40"
            >
              ⬅️ قبلی
            </button>

            <button
              onClick={handleNext}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl text-sm"
            >
              {currentIndex + 1 === questions.length ? "اتمام ✅" : "➡️ بعدی"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
