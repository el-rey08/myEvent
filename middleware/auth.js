const jwt = require('jsonwebtoken')
require('dotenv').config()
const eventModel = require('../models/eventModel');

const authenticate = async (req, res, next) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) {
        return res.status(401).json({ message: "Authorization required" });
      }
  
      const token = auth.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
  
      next();
    } catch (error) {
      console.error(error.message)
      return res.status(401).json({ message: "please log-in again" });
    }
  };


const verifyGuest = (req, res, next) => {
  const { token } = req.query;

  if (req.user) {
    return next();
  }

  if (!token) return res.status(401).json({ error: 'Guest token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.guest) {
      req.guest = true;
      req.user = { userId: 'Guest' }; 
      next();
    } else {
      res.status(403).json({ error: 'Invalid guest token' });
    }
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired guest token' });
  }
};


const checkEventTiming = async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const currentTime = new Date();
    if (currentTime < event.startDateTime || currentTime > event.endDateTime) {
      return res.status(403).json({ error: 'Picture uploads are only allowed during the event time' });
    }

    req.event = event;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error checking event timing' });
  }
};

module.exports = {verifyGuest, checkEventTiming, authenticate};

