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
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category; // filter jika ada kategori
    }

    const quizzes = await Quiz.find(filter);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil kuis berdasarkan kategori
exports.getQuizByCategory = async (req, res) => {
  const { category } = req.query;

  try {
    const quiz = await Quiz.find({ category }); // misal "matematika"
    if (!quiz || quiz.length === 0) {
      return res.status(404).json({ message: "Quiz kategori tidak ditemukan" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
