const Product = require('../models/product.model');

module.exports.createProduct = (req, res) => {
    const { name, description, price, createdBy } = req.body;
    
    const product = new Product({
        name,
        description,
        price,
        createdBy,
        
    });

    product.save()
        .then((savedProduct) => {
            res.status(201).json(savedProduct);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json(err);
        });
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
        .then(deleteConfirmation => {
            if (deleteConfirmation.deletedCount === 0) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.json(deleteConfirmation);
        })
        .catch(err => res.status(500).json(err));
}

module.exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const productData = req.body;    
        Product.findByIdAndUpdate(id, productData, { new: true, runValidators: true })
            .then(updatedProduct => {
              if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
              }
              res.status(200).json(updatedProduct);
            })
            .catch(err => {
              res.status(400).json(err);
            });
};

module.exports.getProduct = (req, res) => {
    const productId = req.params.id;

    Product.findOne({ _id: productId }) 
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.json(product);
        })
        .catch(err => res.status(500).json(err));
}