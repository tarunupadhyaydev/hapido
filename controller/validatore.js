const { body,param, query  } = require('express-validator');
module.exports.validateUser = [
    body('firstName').trim().isLength({ min: 1 }).withMessage("First name is required"),
    body('lastName').trim().isLength({ min: 1 }).withMessage("Last name is required"),
    body('email').trim().isEmail().withMessage("Valid email is required"),
    body('password').trim().isLength({ min: 1 }).withMessage("Password is required"),
  ];

  module.exports.validateLogin = [
    body('email').trim().isEmail().withMessage("Valid email is required"),
    body('password').trim().isLength({ min: 1 }).withMessage("Password is required"),
  ];

  module.exports.validateCompany = [
    body('company_name').trim().isLength({ min: 1 }).withMessage("company name is required"),
    body('company_size').trim().isLength({ min: 1 }).withMessage("company size is required"),
    body('company_type').trim().isLength({ min: 1 }).withMessage("company type is required"),
    body('industry').trim().isLength({ min: 1 }).withMessage("industry is required"),
    body('user_id').trim().isLength({ min: 1 }).withMessage("user id is required"),
  ];

  module.exports.validateConnections = [
    body('sender_company_id').trim().isLength({ min: 1 }).withMessage("sender company id is required"),
    body('receiver_company_id').trim().isLength({ min: 1 }).withMessage("receiver company id is required"),
  ];

  module.exports.validateConnectionStatus = [
    body('status').trim().isLength({ min: 1 }).withMessage("Status is required"),

  ];

  module.exports.validateAddUserToCompany = [
    body('company_id').trim().isLength({ min: 1 }).withMessage("Company Id is required"),
  ];

  module.exports.validateUserSearch = [
    query('email').trim().isLength({ min: 1 }).withMessage("Email is required"),
  ];