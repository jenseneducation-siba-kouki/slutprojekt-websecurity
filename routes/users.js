const express = require("express");
const router = express.Router();
const User = require("../models/Users")

router.post("/register", async (req, res) => {
  const user = await User.register(req.body);
  if (user) {
    res.json({
      message: "Username registered"
    });
  } else {
    res.send("somthing is wrong");
  }
});

router.post("/auth", async (req, res) => {
  const token = await User.login(req.body);
  if (token) {
    res.json(token);
  } else {
    res.send("You are not authorized");
  }
});

module.exports = router;
