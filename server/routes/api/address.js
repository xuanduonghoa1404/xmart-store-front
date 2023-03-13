const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const Address = require('../../models/address');
const auth = require('../../middleware/auth');

router.post("/add", auth, (req, res) => {
  const user = req.user;

  const address = new Address(Object.assign(req.body, { user: user._id }));

  address.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Vui lòng thử lại",
      });
    }

    res.status(200).json({
      success: true,
      message: `Thêm địa chỉ thành công!`,
      address: data,
    });
  });
});

// fetch all addresses api
router.get("/", auth, (req, res) => {
  Address.find({ user: req.user._id }, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Vui lòng thử lại",
      });
    }

    res.status(200).json({
      addresses: data,
    });
  });
});

router.get("/:id", async (req, res) => {
  try {
    const addressId = req.params.id;

    const addressDoc = await Address.findOne({ _id: addressId });

    if (!addressDoc) {
      res.status(404).json({
        message: `Không tìm thấy địa chỉ: ${addressId}.`,
      });
    }

    res.status(200).json({
      address: addressDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Vui lòng thử lại",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const addressId = req.params.id;
    const update = req.body;
    const query = { _id: addressId };

    await Address.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Cập nhật địa chỉ thành công!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Vui lòng thử lại",
    });
  }
});

router.delete('/delete/:id', (req, res) => {
  Address.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Vui lòng thử lại",
      });
    }

    res.status(200).json({
      success: true,
      message: `Xóa địa chỉ thành công!`,
      address: data,
    });
  });
});

module.exports = router;
