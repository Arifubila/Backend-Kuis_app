const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const verifyRole = require("../middleware/authMiddleware");

router.post("/create", verifyRole(["admin"]), quizController.createQuiz);
router.get("/", quizController.getAllQuizzes);

module.exports = router;
