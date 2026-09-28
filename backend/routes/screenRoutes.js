const express = require("express");

const {
  createScreen,
  getMyScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
} = require("../controllers/screenController");

const protect = require("../middleware/authMiddleware");
const ownerOnly = require("../middleware/ownerMiddleware");

const router = express.Router();

// All screen routes are for theatre owners only

// Create screen
router.post("/", protect, ownerOnly, createScreen);

// Get all screens belonging to owner's theatres
router.get("/my-screens", protect, ownerOnly, getMyScreens);

// Get one screen
router.get("/:id", protect, ownerOnly, getScreenById);

// Update screen
router.put("/:id", protect, ownerOnly, updateScreen);

// Delete screen
router.delete("/:id", protect, ownerOnly, deleteScreen);

module.exports = router;
