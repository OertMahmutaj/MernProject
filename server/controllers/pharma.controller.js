const User = require('../models/pharma.models');
const jwt = require("jsonwebtoken");
const bcrypt= require("bcrypt")
require('dotenv').config();

module.exports.register = (request, response) => {
    User.findOne({ email: request.body.email })
      .then(existingUser => {
        if (existingUser) {
          return response.status(409).json({message: 'Email already in use' });
        } else {
          User.create(request.body)
            .then(user => {
              const userToken = jwt.sign({
                id: user._id
              }, process.env.FIRST_SECRET_KEY);
  
              response
                .cookie("usertoken", userToken, {
                  httpOnly: true
                })
                .json({ msg: "Success!", userId: user._id });
            })
            .catch(err => response.status(500).json(err));
        }
      })
      .catch(err => response.status(500).json(err));
  };

  module.exports.logout = async (req, res) => {
    try {
        res.clearCookie("usertoken");
        res.status(201).json({
            msg: "Logout Successful",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Logout Failed",
            success: false,
        });
    }
}
  module.exports.login = async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
 
    if(user === null) {
        return res.status(404).json({errors:{email:{message:"User does not exist"}}});
    }
 
    const correctPassword = await bcrypt.compare(req.body.password, user.password);
 
    if(!correctPassword) {
        return res.status(404).json({errors:{password:{message:"Incorrect Password"}}});
    }
    const userToken = jwt.sign({
        id: user._id
    }, process.env.FIRST_SECRET_KEY);
 
    res
        .cookie("usertoken", userToken, {
            httpOnly: true
        })
        .json({ msg: "success!", userId : user._id });
}

module.exports.getAllUsers = (req, res) => {
    User.find({}).sort({name:'asc'})
        .then(persons => {
            res.json(persons);
        })
        .catch(err => {

            res.json(err)
        })
}
module.exports.deletePerson = (req, res) => {

    User.findOne({_id:req.params.id})
        .then(person =>
            person.role=="teacher" ?  User.deleteOne({ _id: req.params.id }) 
            .then(deleteConfirmation => {
               return User.findOneAndUpdate({role: "student"}, {role:"teacher"}, {new:true})
            .then(updatedPerson => res.json(updatedPerson))
            .catch(err => res.json(err))
            })
            .catch(err => res.json(err)) :
            User.deleteOne({ _id: req.params.id }) 
        .then(deleteConfirmation => res.json(deleteConfirmation))
        .catch(err => res.json(err)

            
            ))
         .catch(err => res.json(err));
    
}

module.exports.getPerson = (req, res) => {
    User.findOne({_id:req.params.id})
        .then(person => res.json(person))
        .catch(err => res.json(err));
}

module.exports.updatePerson = (req, res) => {
    User.findOneAndUpdate({_id: req.params.id}, req.body, {new:true})
        .then(updatedPerson => res.json(updatedPerson))
        .catch(err => res.json(err))
}
