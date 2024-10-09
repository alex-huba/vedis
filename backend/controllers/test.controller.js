const { validationResult } = require("express-validator");

// Function to compare submitted answers with correct answers
function calculateScore(submittedAnswers, correctAnswers) {
  let score = 0;

  // Loop through each question
  for (const question in correctAnswers) {
    // Check if the submitted answer matches the correct answer
    if (
      submittedAnswers.hasOwnProperty(question) &&
      submittedAnswers[question] === correctAnswers[question]
    ) {
      score++;
    }
  }

  return score;
}

exports.eng = (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  const correctAnswers = {
    q1: "b",
    q2: "c",
    q3: "c",
    q4: "b",
    q5: "a",
    q6: "c",
    q7: "c",
    q8: "a",
    q9: "c",
    q10: "c",
    q11: "c",
    q12: "a",
    q13: "a",
    q14: "a",
    q15: "a",
    q16: "c",
    q17: "b",
    q18: "c",
    q19: "b",
    q20: "a",
    q21: "c",
    q22: "a",
    q23: "c",
    q24: "b",
    q25: "b",
    q26: "a",
    q27: "a",
    q28: "b",
    q29: "b",
    q30: "b",
  };

  const score = calculateScore(req.body.answers, correctAnswers);

  const level =
    score <= 5
      ? "A1: Beginner"
      : score <= 10
      ? "A2: Elementary"
      : score <= 15
      ? "B1: Intermediate"
      : score <= 20
      ? "B2: Upper-Intermediate"
      : score <= 25
      ? "C1: Advanced"
      : "A1: Beginner";

  const description =
    score <= 5
      ? "Ти знаєш прості фрази та слова, можеш розповісти про себе та поставити прості запитання."
      : score <= 10
      ? "Можеш говорити про повсякденні теми: покупки, роботу, подорожі. Спілкування ще обмежене простими реченнями."
      : score <= 15
      ? "Ти розумієш і можеш брати участь у розмовах на знайомі теми. Можеш описувати події, плани, говорити про свої інтереси."
      : score <= 20
      ? "Ти впевнено спілкуєшся на складніші теми, розумієш фільми, статті, можеш висловити свою думку у розмові."
      : score <= 25
      ? "Ти вільно говориш і розумієш майже все. Можеш обговорювати складні теми та висловлювати свої думки без зусиль."
      : "Ти знаєш прості фрази та слова, можеш розповісти про себе та поставити прості запитання.";

  return res.status(200).json({
    level,
    score: `${score}/30`,
    description,
  });
};

exports.deu = (req, res, next) => {
  if (!validationResult(req).isEmpty()) return res.status(400).end();

  const correctAnswers = {
    q1: "a",
    q2: "c",
    q3: "a",
    q4: "c",
    q5: "c",
    q6: "a",
    q7: "b",
    q8: "b",
    q9: "a",
    q10: "c",
    q11: "a",
    q12: "a",
    q13: "a",
    q14: "c",
    q15: "b",
    q16: "b",
    q17: "b",
    q18: "a",
    q19: "c",
    q20: "b",
    q21: "b",
    q22: "c",
    q23: "a",
    q24: "a",
    q25: "b",
    q26: "c",
    q27: "b",
    q28: "a",
    q29: "b",
    q30: "b",
  };

  const score = calculateScore(req.body.answers, correctAnswers);

  const level =
    score <= 5
      ? "A1: Anfänger"
      : score <= 10
      ? "A2: Grundlegende Kenntnisse"
      : score <= 15
      ? "B1: Mittelstufe"
      : score <= 20
      ? "B2: Fortgeschrittene Mittelstufe"
      : score <= 25
      ? "C1: Fortgeschritten"
      : "A1: Anfänger";

  const description =
    score <= 5
      ? "Ти знаєш прості фрази та слова, можеш розповісти про себе та поставити прості запитання."
      : score <= 10
      ? "Можеш говорити про повсякденні теми: покупки, роботу, подорожі. Спілкування ще обмежене простими реченнями."
      : score <= 15
      ? "Ти розумієш і можеш брати участь у розмовах на знайомі теми. Можеш описувати події, плани, говорити про свої інтереси."
      : score <= 20
      ? "Ти впевнено спілкуєшся на складніші теми, розумієш фільми, статті, можеш висловити свою думку у розмові."
      : score <= 25
      ? "Ти вільно говориш і розумієш майже все. Можеш обговорювати складні теми та висловлювати свої думки без зусиль."
      : "Ти знаєш прості фрази та слова, можеш розповісти про себе та поставити прості запитання.";

  return res.status(200).json({
    level,
    score: `${score}/30`,
    description,
  });
};
