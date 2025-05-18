const Quiz = require("../models/Quiz");

exports.createQuiz = async (req, res) => {
  const { title, questions } = req.body;

  try {
    const quiz = await Quiz.create({ title, questions });
    res.status(201).json({ message: "Quiz created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, { "questions.answer": 0 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
