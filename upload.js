const express = require('express');
const Agent = require('../models/Agent');
const auth = require('../middleware/auth');
const router = express.Router();
// Add Agent (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ msg: 'All fields required' });
    }
    // Basic mobile validation (has country code, digits, optional dashes)
    if (!/^\+[1-9]\d{1,14}$/.test(mobile.replace(/[-\s]/g, ''))) {
      return res.status(400).json({ msg: 'Invalid mobile number format' });
    }
    let agent = await Agent.findOne({ email });
    if (agent) return res.status(400).json({ msg: 'Agent email already exists' });
    agent = new Agent({ name, email, mobile, password });
    await agent.save();
    res.json({ agent: { id: agent._id, name, email, mobile } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
// Get All Agents (protected)
router.get('/', auth, async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json({ agents });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;
