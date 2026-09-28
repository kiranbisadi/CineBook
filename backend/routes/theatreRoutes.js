const express = require("express");

const {
  createTheatre,
  getMyTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
} = require("../controllers/theatreController");

const protect = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerMiddleware");

const router = express.Router();

// All theatre routes are for theatre owners only

// Create theatre
router.post("/", protect, ownerOnly, createTheatre);

// Get owner's theatres
router.get("/my-theatres", protect, ownerOnly, getMyTheatres);

// Get one theatre
router.get("/:id", protect, ownerOnly, getTheatreById);

// Update theatre
router.put("/:id", protect, ownerOnly, updateTheatre);

// Delete theatre
router.delete("/:id", protect, ownerOnly, deleteTheatre);

module.exports = router;
