const PharmaController = require('../controllers/pharma.controller');
const ProductController = require('../controllers/product.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = (app) => {
    app.post("/api/register", PharmaController.register);
    app.post("/api/login", PharmaController.login);
    app.post("/api/logout", PharmaController.logout);

    app.post('/api/create-product',authenticate,ProductController.createProduct);
    app.get('/api/products', ProductController.getAllProducts); 
    app.get('/api/my-products', authenticate, ProductController.getAllProducts);
    app.delete('/api/product/:id', authenticate, ProductController.deleteProduct);
    app.get('/api/product/:id', ProductController.getProduct);
    app.patch('/api/product/:id/edit', authenticate,ProductController.updateProduct);
}