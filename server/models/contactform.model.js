const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        }
    },
    firstname: {
        type: String,
        required: [true, "First name is required"]
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"]
    },
    phonenumber: {
        type: Number,
        required: [true, 'Number is required.'],
    },
    company: {
        type: String
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
    
});


const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
