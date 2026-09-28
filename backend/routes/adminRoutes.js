const express = require("express");

const {
  getPendingTheatreOwners,
  approveTheatreOwner,
  rejectTheatreOwner,
  getAllUsers,
  updateUser,
  blockUser,
  unblockUser,
  deleteUser,
  getTheatres,
  approveTheatre,
  rejectTheatre,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// ADMIN TEST
// ==========================================
router.get("/test", protect, adminOnly, (req, res) => {
  res.status(200).json({
    message: "Admin access successful",
    admin: req.user,
  });
});

// ==========================================
// THEATRE OWNER MANAGEMENT
// ==========================================

router.get(
  "/theatre-owners/pending",
  protect,
  adminOnly,
  getPendingTheatreOwners
);

router.put(
  "/theatre-owners/:id/approve",
  protect,
  adminOnly,
  approveTheatreOwner
);

router.put(
  "/theatre-owners/:id/reject",
  protect,
  adminOnly,
  rejectTheatreOwner
);

// ==========================================
// USER MANAGEMENT
// ==========================================

router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id", protect, adminOnly, updateUser);
router.put("/users/:id/block", protect, adminOnly, blockUser);
router.put("/users/:id/unblock", protect, adminOnly, unblockUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// ==========================================
// THEATRE MANAGEMENT
// ==========================================

router.get("/theatres", protect, adminOnly, getTheatres);
router.put("/theatres/:id/approve", protect, adminOnly, approveTheatre);
router.put("/theatres/:id/reject", protect, adminOnly, rejectTheatre);

module.exports = router;
