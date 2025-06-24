const Quiz = require("../models/Quiz");

const allowedCategories = ["matematika", "sains", "bahasa inggris", "sejarah"];

exports.createQuiz = async (req, res) => {
  let { title, questions, category } = req.body;

  if (category) {
    category = category.trim().toLowerCase();
  }

  if (!category || !allowedCategories.includes(category)) {
    return res
      .status(400)
      .json({ message: "Kategori tidak valid atau tidak ada." });
  }

  try {
    // Cek apakah quiz dengan kategori & title sudah ada
    let existingQuiz = await Quiz.findOne({ category, title });

    if (existingQuiz) {
      // Jika sudah ada, tambahkan soal-soal baru ke dalamnya
      existingQuiz.questions.push(...questions);
      await existingQuiz.save();

      return res.status(200).json({
        message: "Soal berhasil ditambahkan ke kuis yang sudah ada!",
        quiz: existingQuiz,
      });
    }

    // Jika belum ada, buat kuis baru
    const newQuiz = await Quiz.create({ title, category, questions });
    res
      .status(201)
      .json({ message: "Kuis baru berhasil dibuat!", quiz: newQuiz });
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
