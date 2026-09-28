const express = require("express");

const {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Anyone can view movies
router.get("/", getMovies);
router.get("/:id", getMovieById);

// Only admin can add, edit or delete movies
router.post("/", protect, adminOnly, createMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

module.exports = router;
