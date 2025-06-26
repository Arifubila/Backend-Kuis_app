const Quiz = require("../models/Quiz");
const Leaderboard = require("../models/Leaderboard");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found!" });

    const category = quiz.category.trim().toLowerCase(); // normalisasi string

    // Hitung skor
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (q.answer === answers[i]) score += 10;
    });

    const userId = req.user?.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // Cari skor berdasarkan user + kategori
    const existingScore = await Leaderboard.findOne({ user: userId, category });

    if (existingScore) {
      existingScore.score += score;
      await existingScore.save();
    } else {
      const newScore = new Leaderboard({ user: userId, category, score });
      await newScore.save();
    }

    res.json({ message: "Quiz submitted!", score, category });
  } catch (error) {
    console.error("❌ Error submitting score:", error);
    res.status(500).json({ message: error.message });
  }
};

// Ambil Top 10 Leaderboard
// GET /api/score/leaderboard?category=Matematika

exports.getLeaderboard = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const topScores = await Leaderboard.find({ category })
      .sort({ score: -1 })
      .limit(10)
      .populate("user", "username");

    const formatted = topScores.map((entry) => ({
      name: entry.user?.username || "NoName",
      score: entry.score,
    }));

    // ⬇️ Inilah yang penting
    res.json({ leaderboard: formatted });
  } catch (error) {
    console.error("❌ Error getLeaderboard:", error);
    res.status(500).json({ message: error.message });
  }
};
