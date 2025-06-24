const express = require("express");
const cors = require("cors"); // ⬅️ Tambahkan ini
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const quizRoutes = require("./src/routes/quizRoutes");
const scoreRoutes = require("./src/routes/scoreRoutes");

connectDB();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // ⬅️ Aktifkan CORS
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/score", scoreRoutes);

app.get("/", (req, res) => {
  res.send("Quiz App Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
