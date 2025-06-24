const express = require("express");
const {
  submitQuiz,
  getLeaderboard,
} = require("../controllers/scoreController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Kirim jawaban kuis (user dan admin boleh)
router.post("/submit", authMiddleware(["user", "admin"]), submitQuiz);

// Ambil leaderboard (public)
router.get("/leaderboard", getLeaderboard);

module.exports = router;
