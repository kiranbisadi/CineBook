const express = require("express");

const {
  createPayment,
  getMyPayments,
  getPaymentById,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create payment
router.post("/", protect, createPayment);

// Get my payments
router.get("/my-payments", protect, getMyPayments);

// Get one payment
router.get("/:id", protect, getPaymentById);

router.post(
  "/create-order",
  protect,
  createRazorpayOrder
);

router.post(
  "/verify",
  protect,
  verifyRazorpayPayment
);

module.exports = router;