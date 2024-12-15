const User = require('../models/User');
const Event = require('../models/Event');

// Get admin dashboard statistics
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const activeEvents = await Event.countDocuments({ status: 'active' });
        const totalRegistrations = await Event.aggregate([
            { $group: { _id: null, total: { $sum: "$participants" } } }
        ]);

        res.json({
            totalUsers,
            activeEvents,
            totalRegistrations: totalRegistrations[0]?.total || 0
        });
    } catch (error) {
        console.error('Error getting admin stats:', error);
        res.status(500).json({ message: 'Error fetching admin statistics' });
    }
};

module.exports = {
    getStats
}; 