const eventModel = require('../models/eventModel');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

exports.createEvent = async (req, res) => {
  const { eventName, description, startDateTime, endDateTime } = req.body;
  const owner = req.user.userId;

  const event = new eventModel({
    eventName,
    description,
    startDateTime,
    endDateTime,
    owner,
  });

  try {
    await event.save();
    const guestToken = jwt.sign({ eventId: event._id, guest: true }, process.env.JWT_SECRET, { expiresIn: endDateTime });
    const eventUrl = `http://localhost:6575/api/events/${event._id}?token=${guestToken}`;
    event.qrCode = await QRCode.toDataURL(eventUrl);

    await event.save();
    res.status(201).json({ event, qrCode: event.qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};

exports.accessEvent = async (req, res) => {
    const { token } = req.query;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const event = await eventModel.findById(decoded.eventId);
  
      if (!event) return res.status(404).send('Event not found');
      return res.status(200).json({ event, message: `welcome to ${event.eventName} enjoy your stay and have fun` });
    } catch (error) {
      res.status(400).send('Invalid or expired token');
    }
  };
  
