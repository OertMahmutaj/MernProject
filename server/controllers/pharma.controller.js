const User = require('../models/pharma.models');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
require('dotenv').config();
const VerificationToken = require('../models/verificationToken')
const {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
} = require('../utils/mail');
const {
  isValidObjectId
} = require('mongoose');
require('dotenv').config();
const {
  verifyRecaptcha
} = require('../utils/recaptcha');

module.exports.register = async (req, res) => {
  const {
    terms,
    profilePicture
  } = req.body;

  const base64Regex = /^data:image\/(bmp|gif|ico|jpg|png|svg|webp|x-icon|svg\+xml)+;base64,[a-zA-Z0-9,+/]+={0,2}$/;

  if (profilePicture && !base64Regex.test(profilePicture)) {
    return res.status(409).json({
      errors: {
        email: {
          message: 'Invalid image format'
        }
      }
    });
  }

  if (!terms) {
    return res.status(409).json({
      errors: {
        terms: {
          message: 'Please accept terms and conditions'
        }
      }
    });
  }

  try {
    const existingUser = await User.findOne({
      email: req.body.email
    });
    if (existingUser) {
      return res.status(409).json({
        errors: {
          email: {
            message: 'Email already in use'
          }
        }
      });
    }

    const OTP = generateOTP();
    const user = await User.create(req.body);

    const verificationToken = new VerificationToken({
      owner: user._id,
      token: OTP,
    });

    await verificationToken.save();

    const userToken = jwt.sign({
      id: user._id
    }, process.env.FIRST_SECRET_KEY);


    mailTransport().sendMail({
      from: 'emailverification@email.com',
      to: user.email,
      subject: "Verify your email",
      html: generateEmailTemplate(OTP),
    });

    res
      .cookie("usertoken", userToken, {
        httpOnly: true,
      })
      .json({
        msg: "success!",
        user,
        verificationToken,
        userId: user._id,
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie('usertoken');
  res.sendStatus(200);
}

module.exports.logoutAll = (req,res) => {
  res.clearCookie('usertoken');
  res.clearCookie('rememberMeToken');
  res.sendStatus(200);
}

module.exports.login = async (req, res) => {
  const recaptchaResponse = req.body.recaptchaValue;
  const {email, storedEmail, rememberMe} = req.body;

  if (storedEmail) {
    try {
      const user = await User.findOne({ email: storedEmail });

      if (!user) {
        return res.status(401).json({
          errors: {
            rememberMeToken: {
              message: "Invalid Remember Me Token",
            },
          },
        });
      }

      const userToken = jwt.sign({ id: user._id }, process.env.FIRST_SECRET_KEY);

      res.cookie("usertoken", userToken, {
        httpOnly: true,
      });

      const userData = {
        userId: user._id,
        name: user.name,
        email: user.email,
      };

      return res.status(200).json({
        msg: "Logged in using Remember Me token",
        userId: user._id,
        name: user.name,
        user: userData,
      });
    } catch (error) {
      return res.status(401).json({
        errors: {
          rememberMeToken: {
            message: "Invalid Remember Me Token",
          },
        },
      });
    }
  }

  if (rememberMe && storedEmail) {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        errors: {
          email: {
            message: "User Does Not Exist",
          },
        },
      });
    }

    const userToken = jwt.sign({ id: user._id }, process.env.FIRST_SECRET_KEY);

    res.cookie("usertoken", userToken, {
      httpOnly: true,
    });


    return res.status(200).json({
      msg: "Logged in using Remember Me",
      userId: user._id,
      name: user.name,
    });
  }
  const recaptchaVerification = await verifyRecaptcha(recaptchaResponse);

  if (!recaptchaVerification) {
    return res.status(401).json({
      errors: {
        reCaptcha: {
          message: "ReCaptcha Validation failed",
        },
      },
    });
  }

  const user = await User.findOne({
    email,
  });

  if (user === null) {
    return res.status(401).json({
      errors: {
        email: {
          message: "User Does Not Exist",
        },
      },
    });
  }

  const correctPassword = await bcrypt.compare(req.body.password, user.password);

  if (!correctPassword) {
    return res.status(401).json({
      errors: {
        password: {
          message: "Password is not correct",
        },
      },
    });
  }

  if (user.verified === false) {
    return res.status(401).json({
      errors: {
        email: {
          message: "Please verify your email first",
        },
      },
    });
  }

  const userToken = jwt.sign({ id: user._id }, process.env.FIRST_SECRET_KEY);

  res.cookie("usertoken", userToken, {
    httpOnly: true,
  });

  if(rememberMe) {
  userData = {
    userId: user._id,
    name: user.name,
    email: user.email,
  }} else {
    userData = {
      userId: user._id,
      name: user.name,
    }
  };

  res.status(200).json({
    msg: "success!",
    userId: user._id,
    name: user.name,
    user: userData,
  });
};

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
  const {
    id
  } = req.params;
  const {
    email,
    password,
    profilePicture,
    ...updateData
  } = req.body;

  const base64Regex = /^data:image\/(bmp|gif|ico|jpg|png|svg|webp|x-icon|svg\+xml)+;base64,[a-zA-Z0-9,+/]+={0,2}$/;

  if (profilePicture && !base64Regex.test(profilePicture)) {
    return res.status(400).json({
      message: 'Invalid base64 format for profilePicture'
    });
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
    User.findOne({
        email,
        _id: {
          $ne: id
        }
      })
      .then(existingUser => {
        if (existingUser) {
          return res.status(409).json({
            message: 'Email already in use'
          });
        } else {
          User.findByIdAndUpdate(id, {
              updateData,
              profilePicture
            }, {
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

module.exports.verifyEmail = async (req, res) => {
  const {
    userId,
    otp
  } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      msg: "Invalid user id"
    });
  }

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        msg: "Invalid user id"
      });
    }

    if (user.verified) {
      return res.status(400).json({
        msg: "Account already verified"
      });
    }

    const token = await VerificationToken.findOne({
      owner: user._id
    });

    if (!token) {
      return res.status(400).json({
        msg: "Token not found"
      });
    }

    const isMatched = await token.compareToken(otp);

    if (!isMatched) {
      return res.status(400).json({
        msg: "Please provide a valid token"
      });
    }

    user.verified = true;
    await User.updateOne({
      _id: user._id
    }, {
      $set: {
        verified: true
      }
    });

    await VerificationToken.findOneAndDelete(token._id);

    user = await User.findById(userId);

    res.status(200).json({
      msg: "Email verified",
      user,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      msg: "An error occurred",
      error
    });
  }
};

module.exports.verifyToken = async (req, res) => {
  const {
    userId,
    otp
  } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      message: "Invalid user id"
    });
  }

  try {
    let user = await (User.findById(userId));

    if (!user) {
      return res.status(400).json({
        message: "Invalid user id"
      });
    }

    if (user.verified) {
      return res.status(400).json({
        msg: "Account already verified"
      });
    }

    const token = await VerificationToken.findOne({
      owner: user._id
    });

    if (!token) {
      return res.status(400).json({
        message: "Token not found"
      });
    }

    const isMatched = await token.compareToken(otp);

    if (!isMatched) {
      return res.status(400).json({
        message: "Please provide a valid token"
      });
    }

    user.verified = true;
    await User.updateOne({
      _id: user._id
    }, {
      $set: {
        verified: true
      }
    });

    await VerificationToken.findOneAndDelete(token._id);

    user = await User.findById(userId);


    res.status(200).json({
      message: "Email verified",
      user,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error
    });
  }
};

module.exports.ForgotPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    let user;

    user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      });
    }

    const OTP = generateOTP();

    const verificationToken = new VerificationToken({
      owner: user._id,
      token: OTP,
    });

    await verificationToken.save();


    await User.findByIdAndUpdate(user._id, {
      $set: {
        verified: false
      }
    });


    const userToken = jwt.sign({
      id: user._id
    }, process.env.FIRST_SECRET_KEY);

    mailTransport().sendMail({
      from: 'emailverification@email.com',
      to: user.email,
      subject: "Reset Your Password",
      html: generateEmailTemplate(OTP),
    });

    res
      .cookie("usertoken", userToken, {
        httpOnly: true,
      })
      .json({
        msg: "Success! Reset password token sent.",
        userId: user._id,
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.updateUserPassword = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const {
      newPassword: password
    } = req.body;

    const {
      confirmPassword
    } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password and Confirm Password do not match'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      password: hashedPassword
    }, {
      new: true
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};