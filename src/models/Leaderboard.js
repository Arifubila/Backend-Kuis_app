// models/Leaderboard.js
const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

// Mencegah satu user punya lebih dari 1 skor untuk kategori yang sama
leaderboardSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
