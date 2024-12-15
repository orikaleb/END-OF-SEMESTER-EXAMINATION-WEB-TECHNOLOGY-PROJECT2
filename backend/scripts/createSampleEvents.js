const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

const createSampleEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Sample events data
        const events = [
            {
                title: 'Tech Innovation Summit 2024',
                date: new Date('2024-03-25'),
                startTime: '09:00',
                endTime: '17:00',
                location: 'Accra Digital Centre',
                description: 'Annual technology conference featuring the latest innovations',
                type: 'conference',
                maxParticipants: 200,
                participants: 150,
                status: 'active'
            },
            {
                title: 'Digital Marketing Workshop',
                date: new Date('2024-03-30'),
                startTime: '10:00',
                endTime: '15:00',
                location: 'Business Hub, Cantonments',
                description: 'Hands-on workshop on digital marketing strategies',
                type: 'workshop',
                maxParticipants: 50,
                participants: 30,
                status: 'active'
            },
            {
                title: 'Startup Networking Event',
                date: new Date('2024-04-05'),
                startTime: '18:00',
                endTime: '21:00',
                location: 'Impact Hub Accra',
                description: 'Connect with fellow entrepreneurs and investors',
                type: 'networking',
                maxParticipants: 100,
                participants: 75,
                status: 'active'
            }
        ];

        // First get the admin user
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('Please create an admin user first using createAdmin.js');
            return;
        }

        // Update the createdBy field with actual admin ID
        const eventsWithAdmin = events.map(event => ({
            ...event,
            createdBy: admin._id
        }));

        // Delete existing events
        await Event.deleteMany({});

        // Insert new events
        await Event.insertMany(eventsWithAdmin);

        console.log('Sample events created successfully');

    } catch (error) {
        console.error('Error creating sample events:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createSampleEvents(); 