const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken =  id => {
  return jwt.sign({id: id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  });

  const token = signToken(newUser._id);

  return res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // The password field is defined in the model to not be selected
  // But in this case we need the password for verification
  // For that instance we will use .select(+fieldName) to manually select it.

  const user = User.findOne({ email }).select('+password');
  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
