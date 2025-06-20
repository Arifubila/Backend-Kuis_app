const jwt = require("jsonwebtoken"); // Jika menggunakan JWT untuk autentikasi

// Middleware untuk memverifikasi admin
const verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Mendapatkan token dari header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Pastikan JWT_SECRET ada di .env file
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    req.user = decoded; // Menyimpan user info di req.user
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = { verifyAdmin };
