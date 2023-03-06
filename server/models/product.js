const Mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const { Schema } = Mongoose;

const options = {
  separator: '-',
  lang: 'en',
  truncate: 120
};

Mongoose.plugin(slug, options);

// Product Schema
const ProductSchema = new Schema({
  slug: {
    type: String,
    slug: "name",
    unique: true,
  },
  productID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
    min: 0,
    max: 255,
  },
  description: {
    type: String,
    required: false,
    max: 1023,
    min: 0,
  },
  status: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  final_price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  photo: {
    type: String,
    required: false,
  },
  uom: {
    type: String,
    required: false,
  },
  type: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Type",
  },
  inventory: [
    {
      locator: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Locator",
      },
      imports: [
        {
          sku: String,
          date_manufacture: {
            type: Date,
            required: true,
          },
          date_expiration: {
            type: Date,
            required: true,
          },
          quantity: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  ],
});

module.exports = Mongoose.model('Product', ProductSchema);
