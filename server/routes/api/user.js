const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const User = require('../../models/user');
const Address = require('../../models/address');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user._id;
    const userDoc = await User.findById(user, { password: 0 });
    const addressDoc = await Address.find({ user });
    res.status(200).json({
      user: {
        ...userDoc._doc,
        address: addressDoc,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: "Vui lòng thử lại",
    });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const user = req.user._id;
    const update = req.body.profile;
    const query = { _id: user };

    const userDoc = await User.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công!",
      user: userDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Vui lòng thử lại",
    });
  }
});

module.exports = router;
