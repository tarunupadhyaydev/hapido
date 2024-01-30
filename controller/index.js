const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connection } = require('../config/config');
const db = connection.promise();
const moment = require('moment');
require('dotenv').config();
// app.use('/uploads', express.static('uploads'));
const { validationResult } = require('express-validator');

exports.signup = async (req, res) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ message: validationErrors.array({ onlyFirstError: true })[0].msg });
    }
  
    try {
      const { email, password, firstName, lastName } = req.body;
      const currentTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
      const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
  
      if (rows.length > 0) {
        return res.status(200).json({ message: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertResult = await db.query(
        'INSERT INTO Users (firstName, lastName, email, password, profileImage, created_at, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, req.file?.filename || null, currentTimestamp, "e"]
      );
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error.message);
      return res.status(500).json({ message: 'User creation failed' });
    }
  };  
  
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (!rows.length>0) {
        return res.status(401).json({ message: 'Wrong email' });
    }
    console.log(rows);
    const isPasswordValid = await bcrypt.compare(password, rows[0].password);
    if (isPasswordValid) {
        const token = jwt.sign({ email }, process.env.secretKey);
        res.status(200).json({ token, status: true });
    } else {
        res.status(401).json({ message: 'Authentication failed', status: false });
    }
};

exports.add_companies = async (req, res) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ message: validationErrors.array({ onlyFirstError: true })[0].msg });
    }
    try {
        const { company_name, company_size, company_type, industry, user_id } = req.body;

        const [row] = await db.query('SELECT * FROM Users_companies WHERE user_id = ?', [user_id]);
  
      if (row.length > 0) {
        return res.status(200).json({ message: 'User can not have more than one company' });
      }

        const insertCompanyResult = await db.query(
            'INSERT INTO Users_companies (company_name, size, type, industry, user_id) VALUES (?, ?, ?, ?, ?)',
          [company_name, company_size, company_type, industry, user_id]);
          
          const insertedCompanyId = await insertCompanyResult[0].insertId;

        const [rows] = await db.query('SELECT * FROM Users_companies WHERE company_id = ?', [insertedCompanyId]);

          await db.query(
            'UPDATE Users SET company_id = ?, user_type = ? WHERE user_id = ?',
            [rows[0].company_id, "C", user_id]
        );
          return res.status(201).json({ message: 'Company created successfully' });
    } catch (error) {
      console.error('Error creating user:', error.message);
      return res.status(500).json({ message: 'Company creation failed' });
    }
  };

  exports.connections = async (req, res) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ message: validationErrors.array({ onlyFirstError: true })[0].msg });
    }
    try {
        const { sender_company_id, receiver_company_id } = req.body;

        db.query(
          'INSERT INTO connections (sender_company_id, receiver_company_id, status) VALUES (?, ?, ?)',
          [sender_company_id, receiver_company_id, 'Pending']);
            return res.status(201).json({ message: 'Connection requested successfully' });      
    } catch (error) {
      console.error('Error creating user:', error.message);
      return res.status(500).json({ message: 'Connection request failed' });
    }
  };

  exports.UpdateConnectionStatus = async (req, res) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ message: validationErrors.array({ onlyFirstError: true })[0].msg });
    }
    try {
        const { connectionId } = req.params;
        const { status } = req.body;
        if (!connectionId) {
            return res.status(422).json({ message: "connection Id is required" });
        }
        db.query('UPDATE connections SET status = ? WHERE connection_id = ?', [status, connectionId]);
            return res.status(200).json({ message: 'Connection status updated successfully' });
    } catch (error) {
      console.error('Error creating user:', error.message);
      return res.status(500).json({ message: 'User creation failed' });
    }
  };

  exports.AddUserCompany = async (req, res) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ message: validationErrors.array({ onlyFirstError: true })[0].msg });
    }
    try {
        const { userId } = req.params;
        const { company_id } = req.body;
        if (!userId) {
            return res.status(422).json({ message: "User Id is required" });
        }
        const [rows] = await db.query('SELECT * FROM Users WHERE user_id = ?', [userId]);
        if(rows[0].user_type === "C" && rows[0].user_type !== "E" ){
            return res.status(422).json({ message: "User should not be an employer" });
        }
        db.query('UPDATE Users SET company_id = ? WHERE user_id = ?', [company_id, userId]);
            return res.status(200).json({ message: 'User added to company successfully' });
    } catch (error) {
      console.error('Error adding user to company:', error.message);
      return res.status(500).json({ message: 'Error adding user to company' });
    }
  };

  exports.UserSearch = async (req, res) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ message: validationErrors.array({ onlyFirstError: true })[0].msg });
    }
    console.log(req.query.email);
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(422).json({ message: "email is required" });
        }
        const [rows] = await db.query('SELECT user_id, company_id,firstName, lastName, email, profileImage FROM Users WHERE email = ?', [email]);
        return res.status(200).json(rows);
    } catch (error) {
      console.error('Error adding user to company:', error.message);
      return res.status(500).json({ message: 'Error adding user to company' });
    }
  };
