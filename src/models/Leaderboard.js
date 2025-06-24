// models/Leaderboard.js
const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true, // ⬅️ WAJIB! Agar user tidak bisa punya skor lebih dari 1
  },
  score: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
