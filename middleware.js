const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ msg: 'Token is not valid' });
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
