const Product = require('../models/product.model');
const User = require('../models/pharma.models');

exports.createProduct = async (req, res) => {
    const userId = req.body.userId;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(409).json({
          errors: {
            accounttype: {
              message: 'Please Log in to create products'
            }
          }
        });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(409).json({
          errors: {
            productImage: {
              message: 'Please upload at least one image'
            }
          }
        });
      }
  
      const images_url = req.files.map(image => image.path);
  
      const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        owner: userId,
        manufacturer: req.body.manufacturer,
        price: req.body.price,
        diseaseType: req.body.diseaseType,
        productImage: images_url
      });
  
      const product = await newProduct.save();
  
      res.status(200).json({
        message: 'Added Successfully',
        product
      });
    } catch (err) {
      res.status(500).json(err);
    }
  };

module.exports.getAllProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  Product.deleteOne({ _id: productId })
    .then((deleteConfirmation) => {
      if (deleteConfirmation.deletedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(deleteConfirmation);
    })
    .catch((err) => res.status(500).json(err));
};

module.exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  Product.findByIdAndUpdate(id, productData, { new: true, runValidators: true })
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(updatedProduct);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports.getProduct = (req, res) => {
    const productId = req.params.id;
  
    Product.findOne({ _id: productId })
      .populate('reviews.user', 'name') 
      .then((product) => {
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
      })
      .catch((err) => res.status(500).json(err));
  };
  
module.exports.reviewProduct = async (req, res) => {
  const productId = req.params.id; 
  const { rating, comment, userId } = req.body; 
  let reviewsLength;

  try {
    const product = await Product.findById(productId);
    reviewsLength = product ? product.reviews.length : 0;
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = {
      user: userId,
      rating,
      comment,
    };

    product.reviews.push(newReview);

    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();

    const populatedProduct = await Product.findById(productId).populate('reviews.user');

    return res.status(200).json({ message: 'Review added successfully', product: populatedProduct });
  } catch (err) {
    console.error(err);
    
    return res.status(500).json({ error: err, reviewsLength });
  }
};

module.exports.getGraph = (req, res) => {
  Product.find()
    .then((products) => {
      const dataForGraph = products.map((product) => ({
        name: product.name,
        averageRating: product.averageRating,
      }));

      res.status(200).json(dataForGraph);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports.getReviewNumberGraphData = async (req, res) => {
  try {
    const products = await Product.find({}).select('name reviews');

    const data = products.map((product) => ({
      name: product.name,
      reviews: product.reviews.length,
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.getPriceGraph = async (req, res) => {
  try {
    const products = await Product.find({}, 'name price');
    const priceGraphData = products.map((product) => ({
      name: product.name,
      price: product.price,
    }));

    res.status(200).json(priceGraphData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.myreviews = async (req, res) => {
  const userId = req.params.id;
  console.log(userId) 

  try {
    const userReviews = await Product.find({
      'reviews.user': userId,
    });

    const reviewsData = userReviews.map((product) =>
      product.reviews
        .filter((review) => review.user == userId)
        .map((review) => ({
          product: {
            name: product.name,
            _id: product._id,
            image : product.productImage[0],
          },
          rating: review.rating,
          comment: review.comment,
        }))
    ).flat();

    return res.status(200).json(reviewsData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};