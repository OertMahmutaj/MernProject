const User = require('../models/pharma.models');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
require('dotenv').config();

module.exports.register = (request, response) => {
    const { email, profilePicture, ...userData } = request.body;
    
    const base64Regex = /^data:image\/(bmp|gif|ico|jpg|png|svg|webp|x-icon|svg\+xml)+;base64,[a-zA-Z0-9,+/]+={0,2}$/;

    if (profilePicture && !base64Regex.test(profilePicture)) {
        return response.status(413).json({ message: 'Invalid base64 format for profilePicture' });
    }

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return response.status(409).json({ message: 'Email already in use' });
            } else {
                User.create({ email, profilePicture, ...userData })
                    .then(user => {
                        const userToken = jwt.sign({ id: user._id }, process.env.FIRST_SECRET_KEY);

                        response.cookie("usertoken", userToken, { httpOnly: true }).json({
                            msg: "Success!",
                            userId: user._id
                        });
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
module.exports.login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if (user === null) {
        return res.status(404).json({
            errors: {
                email: {
                    message: "User does not exist"
                }
            }
        });
    }

    const correctPassword = await bcrypt.compare(req.body.password, user.password);

    if (!correctPassword) {
        return res.status(404).json({
            errors: {
                password: {
                    message: "Incorrect Password"
                }
            }
        });
    }
    const userToken = jwt.sign({
        id: user._id
    }, process.env.FIRST_SECRET_KEY);

    res
        .cookie("usertoken", userToken, {
            httpOnly: true
        })
        .json({
            msg: "success!",
            userId: user._id
        });
}

module.exports.getAllUsers = (req, res) => {
    User.find({}).sort({
            name: 'asc'
        })
        .then(users => {
            res.json(users);
        })
        .catch(err => {

            res.json(err)
        })
}
module.exports.deleteProfile = (req, res) => {

    User.findOne({
            _id: req.params.id
        })
        .then(user =>
            user.role == "teacher" ? User.deleteOne({
                _id: req.params.id
            })
            .then(deleteConfirmation => {
                return User.findOneAndUpdate({
                        role: "student"
                    }, {
                        role: "teacher"
                    }, {
                        new: true
                    })
                    .then(updatedPerson => res.json(updatedPerson))
                    .catch(err => res.json(err))
            })
            .catch(err => res.json(err)) :
            User.deleteOne({
                _id: req.params.id
            })
            .then(deleteConfirmation => res.json(deleteConfirmation))
            .catch(err => res.json(err)


            ))
        .catch(err => res.json(err));

}

module.exports.getProfile = (req, res) => {
    User.findOne({
            _id: req.params.id
        })
        .then(user => res.json(user))
        .catch(err => res.json(err));
}

module.exports.updateProfile = (req, res) => {
    const { id } = req.params;
    const { email, password, profilePicture, ...updateData } = req.body;
    
    const base64Regex = /^data:image\/(bmp|gif|ico|jpg|png|svg|webp|x-icon|svg\+xml)+;base64,[a-zA-Z0-9,+/]+={0,2}$/;

    if (profilePicture && !base64Regex.test(profilePicture)) {
        return res.status(400).json({ message: 'Invalid base64 format for profilePicture' });
    }

    if (password) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json(err);
            } 
            updateData.password = hashedPassword;
            updateUser();
        });
    } else {
        updateUser();
    }

    function updateUser() {
        User.findOne({ email, _id: { $ne: id } })
            .then(existingUser => {
                if (existingUser) {
                    return res.status(409).json({
                        message: 'Email already in use'
                    });
                } else {
                    User.findByIdAndUpdate(id, {updateData, profilePicture}, {
                        new: true,
                        runValidators: true
                    })
                        .then(updatedUser => {
                            if (!updatedUser) {
                                return res.status(404).json({
                                    message: 'User not found'
                                });
                            }
                            res.status(200).json(updatedUser);
                        })
                        .catch(err => {
                            res.status(400).json(err);
                        });
                }
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }
};
