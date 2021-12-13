const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'product name must be provided'],
  },
  price: {
    type: Number,
    required: [true, 'product price must be provided'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  category: [{
    type: String,
    enum: {
      values: ['shirts', 'pants', 'hoodies', 'sweatsuits', 'car decals', 'home decor', 'beauty', 'drinkware'],
      message: '{VALUE} is not supported',
    },
  }],
  description: {
    type: String,
    required: [true, 'product description must be provided'],
  },
  dimensions: {
    type: String,
  },
  image: {
    data: Buffer,
    contentType: String
  }
})

module.exports = mongoose.model('Product', productSchema)
