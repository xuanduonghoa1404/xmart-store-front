const express = require("express");
const router = express.Router();
const Type = require("../../models/type");
//Getting All
router.get("/type", async (req, res) => {
  try {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    const type = await Type.find()
      // .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page);
    res.json(type);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Getting one
router.get("/type/:id", getTypeById, async (req, res) => {
  res.send(req.type);
});


async function getTypeById(req, res, next) {
  let type;
  try {
    type = await Type.findById(req.params.id);
    if (type == null) {
      return res.status(404).json({ message: "Can not find type" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  req.type = type;
  next();
}

module.exports = router;
