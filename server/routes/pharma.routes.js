const PharmaController = require('../controllers/pharma.controller');
const ProductController = require('../controllers/product.controller');
const ContactController = require('../controllers/contact.controller')
const { authenticate } = require('../config/jwt.config');
const {
    productImages
  } = require('../utils/handleImageMulter');

module.exports = (app) => {
  //form
  app.post("/api/contactform", ContactController.sendform);
  //user
    app.post("/api/register", PharmaController.register);
    app.post("/api/login", PharmaController.login);
    app.post("/api/logout", PharmaController.logout);
    app.post("/api/logout/all", PharmaController.logoutAll);
    app.patch("/api/updateprofile/:id", authenticate,PharmaController.updateProfile);
    app.get("/api/users/:id", PharmaController.getProfile);
    app.post('/api/user/verify-email', authenticate, PharmaController.verifyEmail);
    app.post('/api/user/forgotpassword', PharmaController.ForgotPasswordToken);
    app.post('/api/user/forgotpassword/verifytoken', PharmaController.verifyToken);
    app.patch('/api/user/:id/passwordreset', PharmaController.updateUserPassword);
    //products
    app.post('/api/create-product', productImages(), authenticate,ProductController.createProduct);
    app.get('/api/products', ProductController.getAllProducts);
    app.get('/api/my-reviews/:id', authenticate, ProductController.myreviews);
    app.delete('/api/product/:id', authenticate, ProductController.deleteProduct);
    app.get('/api/product/:id', ProductController.getProduct);
    app.patch('/api/product/:id/edit', authenticate,ProductController.updateProduct);
    app.patch('/api/product/:id/add-review', authenticate,ProductController.reviewProduct);

    //graph
    app.get('/api/ratinggraph', ProductController.getGraph); 
    app.get('/api/reviewnumbergraph', ProductController.getReviewNumberGraphData);
    app.get('/api/pricegraph', ProductController.getPriceGraph);
}