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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ msg: "invalid request" });
    return;
  }

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
      ? "A1"
      : score <= 10
      ? "A2"
      : score <= 15
      ? "B1"
      : score <= 20
      ? "B2"
      : score <= 25
      ? "C1"
      : "A1";

  return res.status(200).json({
    level: level,
    score: `${score}/30`,
  });
};

exports.deu = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ msg: "invalid request" });
    return;
  }

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
      ? "A1"
      : score <= 10
      ? "A2"
      : score <= 15
      ? "B1"
      : score <= 20
      ? "B2"
      : score <= 25
      ? "C1"
      : "A1";

  return res.status(200).json({
    level: level,
    score: `${score}/30`,
  });
};
