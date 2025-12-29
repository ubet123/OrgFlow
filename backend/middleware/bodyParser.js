const express = require('express');

const dynamicBodyParser = (req, res, next) => {
  if (req.headers['content-type'] && 
      req.headers['content-type'].startsWith('application/json')) {
    express.json({ limit: '50mb' })(req, res, next);
  } else if (req.headers['content-type'] && 
             req.headers['content-type'].startsWith('application/x-www-form-urlencoded')) {
    express.urlencoded({ extended: true, limit: '50mb' })(req, res, next);
  } else {
    next();
  }
};

module.exports = dynamicBodyParser;