const router = require('express').Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const addressRoutes = require('./address');
const newsletterRoutes = require('./newsletter');
const productRoutes = require('./product');
const categoryRoutes = require('./category');
const brandRoutes = require('./brand');
const contactRoutes = require('./contact');
const merchantRoutes = require('./merchant');
const cartRoutes = require('./cart');
const orderRoutes = require('./order');
const reviewRoutes = require('./review');
const wishlistRoutes = require('./wishlist');
const typeRoutes = require('./type');
const locatorRoutes = require('./locator');
const marketingRoutes = require("./marketing");

// auth routes
router.use("/auth", authRoutes);

// user routes
router.use("/user", userRoutes);

// address routes
router.use("/address", addressRoutes);

// newsletter routes
router.use("/newsletter", newsletterRoutes);

// product routes
router.use("/product", productRoutes);

// typeRoutes routes
router.use("/type", typeRoutes);

// category routes
router.use("/category", categoryRoutes);

// brand routes
router.use("/brand", brandRoutes);

// contact routes
router.use("/contact", contactRoutes);

// merchant routes
router.use("/merchant", merchantRoutes);

// cart routes
router.use("/cart", cartRoutes);

// order routes
router.use("/order", orderRoutes);

// Review routes
router.use("/review", reviewRoutes);

// locator routes
router.use("/locator", locatorRoutes);

// locator routes
router.use("/marketing", marketingRoutes);

module.exports = router;
