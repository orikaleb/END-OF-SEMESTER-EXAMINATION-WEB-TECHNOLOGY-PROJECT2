const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Admin credentials
        const adminData = {
            username: 'admin',
            email: 'admin@eventflow.com',
            password: 'admin123!@#',
            fullName: 'Admin User',
            role: 'admin'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin user
        const admin = new User({
            ...adminData,
            password: hashedPassword,
            preferences: {
                eventTypes: [],
                categories: [],
                maxDistance: 50,
                notifications: {
                    email: true,
                    push: true
                }
            }
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log('Username:', adminData.username);
        console.log('Password:', adminData.password);
        console.log('Please change these credentials after first login');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createAdminUser(); 