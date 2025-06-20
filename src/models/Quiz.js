const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: String,
  category: String, // Tambahkan kategori di sini
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
