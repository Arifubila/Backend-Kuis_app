const Quiz = require("../models/Quiz");
const Leaderboard = require("../models/Leaderboard");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found!" });

    // Hitung skor
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (q.answer === answers[i]) score += 10;
    });

    // Validasi user
    const userId = req.user?.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // Cari skor sebelumnya
    const existingScore = await Leaderboard.findOne({ user: userId });

    if (existingScore) {
      if (score > existingScore.score) {
        existingScore.score = score;
        await existingScore.save();
        console.log("✅ Skor diperbarui karena lebih tinggi:", score);
      } else {
        console.log("ℹ️ Skor lebih rendah, tidak disimpan:", score);
      }
    } else {
      const newScore = new Leaderboard({ user: userId, score });
      await newScore.save();
      console.log("🎉 Skor baru disimpan:", score);
    }

    res.json({ message: "Quiz submitted!", score });
  } catch (error) {
    console.error("❌ Error submitting score:", error);
    res.status(500).json({ message: error.message });
  }
};

// Ambil Top 10 Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topScores = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(10)
      .populate("user", "username");

    const formatted = topScores.map((entry) => ({
      name: entry.user?.username || "NoName",
      score: entry.score,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("❌ Error getLeaderboard:", error);
    res.status(500).json({ message: error.message });
  }
};
