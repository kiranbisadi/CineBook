const express = require("express");

const {
  createShow,
  getMyShows,
  getShowById,
  updateShow,
  deleteShow,
  getPublicShows,
} = require("../controllers/showController");

const protect = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerMiddleware");

const router = express.Router();

// Public - anyone can view available shows
router.get("/public", getPublicShows);

// Theatre owner only - create show
router.post("/", protect, ownerOnly, createShow);

// Theatre owner only - get own shows
router.get("/my-shows", protect, ownerOnly, getMyShows);

// Theatre owner only - get one show
router.get("/:id", protect, ownerOnly, getShowById);

// Theatre owner only - update show
router.put("/:id", protect, ownerOnly, updateShow);

// Theatre owner only - delete show
router.delete("/:id", protect, ownerOnly, deleteShow);

module.exports = router;
