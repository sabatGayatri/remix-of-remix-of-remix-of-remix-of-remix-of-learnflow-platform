import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const quizQuestions = [
  {
    id: 1,
    question: "What is the time complexity of the optimal Two Sum solution using a hash map?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
    correct: 2,
  },
  {
    id: 2,
    question: "What is the space complexity of the hash map approach?",
    options: ["O(1)", "O(n)", "O(n²)", "O(log n)"],
    correct: 1,
  },
  {
    id: 3,
    question: "In the Two Sum problem, what do we store in the hash map?",
    options: [
      "The sum of pairs",
      "The index of each element",
      "The difference of pairs",
      "The product of pairs",
    ],
    correct: 1,
  },
  {
    id: 4,
    question: "What would happen if we use a nested loop instead of a hash map?",
    options: [
      "Same time complexity",
      "Faster execution",
      "Time complexity becomes O(n²)",
      "Space complexity increases",
    ],
    correct: 2,
  },
];

const Quiz = () => {
  const { quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const correctCount = answers.filter((a, i) => a === quizQuestions[i].correct).length;
  const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);

  if (showResults) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            scorePercent >= 75 ? "bg-green-100 dark:bg-green-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"
          }`}>
            {scorePercent >= 75 ? (
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            ) : (
              <span className="text-4xl">🎯</span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {scorePercent >= 75 ? "Excellent!" : "Good effort!"}
          </h1>
          <p className="text-muted-foreground mb-8">
            You scored {correctCount} out of {quizQuestions.length} questions correctly.
          </p>

          <div className="p-6 rounded-2xl bg-card border border-border mb-8">
            <div className="text-5xl font-bold text-primary mb-2">{scorePercent}%</div>
            <p className="text-sm text-muted-foreground">Quiz Score</p>
          </div>

          <div className="space-y-3 mb-8">
            {quizQuestions.map((q, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl text-left ${
                  answers[index] === q.correct
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {answers[index] === q.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Correct answer: {q.options[q.correct]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Link to="/domains/dsa/beginner/arrays/questions" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Learning
              </Button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <Button variant="default" className="w-full">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 glass z-50 border-b border-border">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link
            to="/solve/1"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Problem
          </Link>

          <span className="font-semibold">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>

          <div className="w-20" />
        </div>
      </div>

      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="p-6 rounded-2xl bg-card border border-border mb-6">
            <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                    selectedAnswer === index
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              variant="default"
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="gap-2"
            >
              {currentQuestion === quizQuestions.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
