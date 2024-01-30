const multer = require('multer');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  module.exports.upload = multer({
    storage: storage
  });
  
  
  module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token,process.env.secretKey, (err, user) => {
        if (err) {
          return res.status(403).json({message:err.message, status:false});
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json({message:'fdhdkf'});
    }
  };