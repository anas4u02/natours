/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/user-routes');
const tourRouter = require('./routes/tour-routes');
const e = require('express');

const app = express();
app.use(express.static(`${__dirname}/public`));

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// The execution of code in nodejs is sequential, if the above part gets executed the code won't reach
// here. If all the above routes fails, then the routes are handled below.
app.all('*', (req, res, next)=> {
  // res.status(404).json({
  //   status: 'fail',
  //   message: "Can't find the requested route!"
  // });

  const err = new Error(`Can't find the requested ${req.originalUrl} route!`);
  err.status= 'fail';
  err.statusCode = 404;
  err.message= err.message;

  next(err);

});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status =  err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });

  next();

});

// START SERVER

module.exports = app;