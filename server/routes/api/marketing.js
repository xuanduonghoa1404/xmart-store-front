const express = require("express");
const router = express.Router();
const Marketing = require("../../models/marketing");
//Getting All
router.get("/", async (req, res) => {
  try {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    const marketing = await Marketing.find()
      // .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page);
    let newMarketing = [];
    marketing.forEach(function (mkt) {
      if (mkt.discount_type === "PERCENT") {
        mkt._doc.discount = "-" + mkt.value + "%";
      } else if (mkt.discount_type === "FIX_AMOUNT") {
        mkt._doc.discount = "-" + mkt.value + "đ";
      } else if (mkt.discount_type === "FLAT") {
        mkt._doc.discount = "" + mkt.value + "đ";
      }
      if (mkt.condition === "QTY") {
        mkt._doc.condition_text = "Còn " + mkt.condition_value + " sản phẩm";
      } else if (mkt.condition === "DATE") {
        mkt._doc.condition_text = "Còn " + mkt.condition_value + " ngày";
      } else if (mkt.condition === "ALL") {
        mkt._doc.condition_text = "Tất cả";
      }
      newMarketing.push(mkt);
    });
    res.json(newMarketing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Getting one
router.get("/:id", getMarketingById, async (req, res) => {
  res.send(req.marketing);
});

async function getMarketingById(req, res, next) {
  let marketing;
  try {
    marketing = await Marketing.findById(req.params.id);
    if (marketing == null) {
      return res.status(404).json({ message: "Can not find marketing" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.marketing = marketing;
  next();
}

module.exports = router;
