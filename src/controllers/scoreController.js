const Quiz = require("../models/Quiz");
const Leaderboard = require("../models/Leaderboard");
const User = require("../models/User");

// User kirim jawaban dan dapat skor
exports.submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found!" });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (q.answer === answers[i]) score += 10;
    });

    const newScore = new Leaderboard({
      user: req.user.id, // dari middleware auth
      score,
    });

    await newScore.save();

    res.json({ message: "Quiz submitted!", score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Top 10 Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topScores = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(10)
      .populate("user", "username"); // atau "name" tergantung field kamu

    const formatted = topScores.map((entry) => ({
      name: entry.user.username, // atau entry.user.name
      score: entry.score,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
