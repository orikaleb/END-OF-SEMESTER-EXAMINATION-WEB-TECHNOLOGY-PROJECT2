const Event = require('../models/Event');

// Get upcoming events
const getUpcomingEvents = async (req, res) => {
    try {
        const upcomingEvents = await Event.find({
            date: { $gte: new Date() },
            status: 'active'
        }).sort({ date: 1 });

        res.json(upcomingEvents);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ message: 'Error fetching upcoming events' });
    }
};

// Create new event
const createEvent = async (req, res) => {
    try {
        const { title, date, startTime, endTime, location, type, maxParticipants, description } = req.body;

        const event = new Event({
            title,
            date,
            startTime,
            endTime,
            location,
            type,
            maxParticipants,
            description,
            createdBy: req.user.id
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is authorized to delete
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.remove();
        res.json({ message: 'Event removed' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
};

module.exports = {
    getUpcomingEvents,
    createEvent,
    deleteEvent,
    getAllEvents
}; 