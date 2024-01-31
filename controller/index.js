const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();
// app.use('/uploads', express.static('uploads'));
const { validationResult } = require('express-validator');
const Users = require('../Models/users')
const UsersCompanies = require('../Models/Users_companies')
const connections = require('../Models/connections')


exports.signup = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ status: false, message: validationErrors.array({ onlyFirstError: true })[0].msg });
  }

  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(200).json({ status: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const currentTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImage: req.file?.filename || null,
      created_at: currentTimestamp,
      user_type: 'E',
    });

    res.status(201).json({ status: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error.message);
    return res.status(500).json({ status: false, message: 'User creation failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Wrong email', status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ email }, process.env.secretKey);
      return res.status(200).json({ token, status: true });
    } else {
      return res.status(401).json({ message: 'Authentication failed', status: false });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({ message: 'Login failed', status: false });
  }
};


exports.add_companies = async (req, res) => {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ status: false, message: validationErrors.array({ onlyFirstError: true })[0].msg });
    }

    const { company_name, company_size, company_type, industry, user_id } = req.body;
    const currentTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    const existingCompany = await UsersCompanies.findOne({ where: { user_id } });
    if (existingCompany) {
      return res.status(200).json({ status: false, message: 'User can not have more than one company' });
    }

    const newCompany = await UsersCompanies.create({
      company_name,
      size: company_size,
      type: company_type,
      industry,
      user_id,
      created_at: currentTimestamp,
    });

    const insertedCompanyId = newCompany.company_id;

    await Users.update(
      { company_id: insertedCompanyId, user_type: 'C' },
      { where: { user_id } }
    );

    return res.status(201).json({ status: true, message: 'Company created successfully' });
  } catch (error) {
    console.error('Error creating company:', error.message);
    return res.status(500).json({ status: false, message: 'Company creation failed', error: error.message });
  }
};

exports.connections = async (req, res) => {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ status: false, message: validationErrors.array({ onlyFirstError: true })[0].msg });
    }

    const { sender_company_id, receiver_company_id } = req.body;
    const currentTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    await connections.create({
      sender_company_id,
      receiver_company_id,
      status: 'Pending',
      created_at: currentTimestamp,
    });

    return res.status(201).json({ status: true, message: 'Connection requested successfully' });
  } catch (error) {
    console.error('Error creating connection:', error.message);
    return res.status(500).json({ status: false, message: 'Connection request failed', error: error.message });
  }
};


exports.UpdateConnectionStatus = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ status: false, message: validationErrors.array({ onlyFirstError: true })[0].msg });
  }

  try {
    const { connectionId } = req.params;
    const { status } = req.body;
    const updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

    if (!connectionId) {
      return res.status(422).json({ status: false, message: "Connection Id is required" });
    }

    await connections.update({ status,updated_at }, { where: { connection_id: connectionId } });

    return res.status(200).json({ status: true, message: 'Connection status updated successfully' });
  } catch (error) {
    console.error('Error updating connection status:', error.message);
    return res.status(500).json({ status: false, message: 'Connection status update failed' });
  }
};

exports.AddUserCompany = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ status: false, message: validationErrors.array({ onlyFirstError: true })[0].msg });
  }

  try {
    const { userId } = req.params;
    const { company_id } = req.body;

    if (!userId) {
      return res.status(422).json({ status: false, message: "User Id is required" });
    }

    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.user_type === "C" && user.user_type !== "E") {
      return res.status(422).json({ status: false, message: "User should not be an employer" });
    }

    await Users.update({ company_id }, { where: { user_id: userId } });

    return res.status(200).json({ status: true, message: 'User added to company successfully' });
  } catch (error) {
    console.error('Error adding user to company:', error.message);
    return res.status(500).json({ status: false, message: 'Error adding user to company' });
  }
};


exports.UserSearch = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ status: false, message: validationErrors.array({ onlyFirstError: true })[0].msg });
  }

  try {
    const { email } = req.query;

    const user = await Users.findOne({
      attributes: ['user_id', 'company_id', 'firstName', 'lastName', 'email', 'profileImage'],
      where: { email: email }
    });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error searching for user:', error.message);
    return res.status(500).json({ status: false, message: 'Error searching for user' });
  }
};
