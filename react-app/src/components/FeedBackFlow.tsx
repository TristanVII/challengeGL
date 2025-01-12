"use client";

import React, { useState, useMemo } from "react";

// PULL THESE FROM API
const questions = [
  "Which feature do you like the most?",
  "Is there anything that feels confusing, difficult to use, or frustrating?",
  "If you could change or add one thing to make your experience better, what would it be?",
];

const MIN_LENGTH = 10;
const MAX_LENGTH = 300;

export default function FeedbackFlow({
  onSubmit,
  onClose,
}: {
  onSubmit: (feedback: {
    question1: string;
    question2: string;
    question3: string;
  }) => void;
  onClose: () => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(["", "", ""]);

  const isValidLength = useMemo(() => {
    const currentAnswer = answers[currentQuestion];
    return (
      currentAnswer.length >= MIN_LENGTH && currentAnswer.length <= MAX_LENGTH
    );
  }, [answers, currentQuestion]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onClose();
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    onSubmit({
      question1: answers[0],
      question2: answers[1],
      question3: answers[2],
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-1/3 h-2 rounded-full ${
                index <= currentQuestion ? "bg-pink-500" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">
        {questions[currentQuestion]}
      </h2>

      <div className="relative">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          rows={5}
          value={answers[currentQuestion]}
          onChange={handleAnswerChange}
          placeholder="Your answer here..."
          minLength={MIN_LENGTH}
          maxLength={MAX_LENGTH}
          aria-label={`Answer for question ${currentQuestion + 1}`}
        ></textarea>
        <div className="mt-1 text-sm text-gray-500 flex justify-between">
          <span>
            {answers[currentQuestion].length} / {MAX_LENGTH} characters
          </span>
          {answers[currentQuestion].length < MIN_LENGTH && (
            <span className="text-red-500">
              Minimum {MIN_LENGTH} characters required
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          {currentQuestion === 0 ? "Close" : "Previous"}
        </button>
        <button
          onClick={handleNext}
          disabled={!isValidLength}
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
