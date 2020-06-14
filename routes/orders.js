const express = require("express")
const router = express.Router()
const Order = require("../models/Orders")
const User = require("../models/Users")

// Handle incoming GET requests to /orders
// create list order
router.get("/", User.auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const user = await Order.all()
      res.json(user)
    } else if (req.user.role === "customer") {
      const user = await Order.getOne(req.user.ID)
      res.json(user)
    }
  } catch (error) {
    res.json({ message: error })
  }
});

// Handle incoming POST requests to /orders
router.post("/", User.auth, async (req, res) => {
  try {
    const order = await Order.create(req.body, req.user.userId)
    res.json(order)
  } catch (error) {
    res.json({ message: error })
  }
});
module.exports = router;
