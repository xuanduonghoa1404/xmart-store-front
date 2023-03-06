const express = require("express");
const router = express.Router();
const Shop = require("../../models/shop");
//Getting All
router.get("/shop", async (req, res) => {
  try {
    const shop = await Shop.find();
    if (shop && shop.length !== 0) {
      res.json({
        ...shop[0]._doc,
        imageBanner: shop[0].imageBanner.toString().replace(/,/g, "\n"),
        imageBannerSecondary: shop[0].imageBannerSecondary
          .toString()
          .replace(/,/g, "\n"),
      });
    } else {
      res.json({ message: "Không tìm thấy thông tin" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
