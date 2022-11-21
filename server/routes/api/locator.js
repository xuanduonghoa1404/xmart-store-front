const express = require("express");
const router = express.Router();
const Locator = require("../../models/Locator");
//Getting All
router.get("/", async (req, res) => {
  try {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    const locator = await Locator.find()
      .sort({ createAt: -1 })
      .limit(limit)
      .skip(limit * page);
    res.json(locator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Getting one
router.get("/:id", getLocatorById, async (req, res) => {
  res.send(req.locator);
});

async function getLocatorById(req, res, next) {
  let locator;
  try {
    locator = await Locator.findById(req.params.id);
    if (locator == null) {
      return res.status(404).json({ message: "Can not find locator" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.locator = locator;
  next();
}

module.exports = router;
