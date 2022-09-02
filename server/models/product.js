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
  // sku: {
  //   type: String
  // },
  // name: {
  //   type: String,
  //   trim: true
  // },
  slug: {
    type: String,
    slug: 'name',
    unique: true
  },
  // imageUrl: {
  //   type: String
  // },
  // imageKey: {
  //   type: String
  // },
  // description: {
  //   type: String,
  //   trim: true
  // },
  // quantity: {
  //   type: Number
  // },
  // price: {
  //   type: Number
  // },
  // taxable: {
  //   type: Boolean,
  //   default: false
  // },
  // isActive: {
  //   type: Boolean,
  //   default: true
  // },
  // brand: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Brand',
  //   default: null
  // },
  // updated: Date,
  // created: {
  //   type: Date,
  //   default: Date.now
  // }
  productID: {
    type: String,
    required: true
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
    required: true
},
price: {
    type: Number,
    required: true
},
compare_at_price: {
    type: Number
},
photo: {
    type: String,
    required: false
},
uom: {
    type: String,
    required: false
},
type: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Type'
},
inventory: [
    {
        locator: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'Locator'
        },
        imports: [
            {
                sku: String,
                date_manufacture: {
                    type: Date,
                    required: true
                },
                date_expiration: {
                    type: Date,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 0,
                },
            }
        ]

    }
]
});

module.exports = Mongoose.model('Product', ProductSchema);
