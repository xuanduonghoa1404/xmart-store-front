const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');

const auth = require('../../middleware/auth');

// Bring in Models & Helpers
const User = require("../../models/user");
const keys = require('../../config/keys');

const { secret, tokenLife } = keys.jwt;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Vui lòng nhập email" });
    }

    if (!password) {
      return res.status(400).json({ error: "Vui lòng nhập mật khẩu" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Email không tìm thấy." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Sai mật khẩu",
      });
    }

    const payload = {
      id: user.id,
    };

    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

    if (!token) {
      throw new Error();
    }

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: "Vui lòng thử lại",
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Bạn phải điền email." });
    }

    if (!name) {
      return res.status(400).json({ error: "Bạn phải điền tên." });
    }

    if (!password) {
      return res.status(400).json({ error: "Bạn phải điền mật khẩu." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Địa chỉ email đã tồn tại." });
    }

    const user = new User({
      email,
      password,
      name,
      phone,
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    const registeredUser = await user.save();

    const payload = {
      id: registeredUser.id,
    };

    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

    res.status(200).json({
      success: true,
      subscribed: false,
      token: `Bearer ${token}`,
      user: {
        id: registeredUser.id,
        name: registeredUser.name,
        phone: registeredUser.phone,
        email: registeredUser.email,
        role: registeredUser.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: "Vui lòng thử lại.",
    });
  }
});


module.exports = router;
