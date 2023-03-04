const router = require('express').Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const addressRoutes = require("./address");
const productRoutes = require('./product');
const categoryRoutes = require("./category");
const contactRoutes = require("./contact");
const cartRoutes = require("./cart");
const orderRoutes = require("./order");
const typeRoutes = require("./type");
const locatorRoutes = require("./locator");
const marketingRoutes = require("./marketing");

// auth routes
router.use("/auth", authRoutes);

// user routes
router.use("/user", userRoutes);

// address routes
router.use("/address", addressRoutes);

// product routes
router.use("/product", productRoutes);

// typeRoutes routes
router.use("/type", typeRoutes);

// category routes
router.use("/category", categoryRoutes);

// contact routes
router.use("/contact", contactRoutes);

// cart routes
router.use("/cart", cartRoutes);

// order routes
router.use("/order", orderRoutes);

// locator routes
router.use("/locator", locatorRoutes);

// locator routes
router.use("/marketing", marketingRoutes);

module.exports = router;
