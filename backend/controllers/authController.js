const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


const register = async (req, res) => {
    try {
        const { username, email, password, fullName, phone, location, preferences } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with preferences
        const user = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            phone,
            location,
            preferences: {
                eventTypes: preferences?.eventTypes || [],
                categories: preferences?.categories || [],
                maxDistance: preferences?.maxDistance || 50,
                notifications: {
                    email: preferences?.notifications?.email ?? true,
                    push: preferences?.notifications?.push ?? true
                }
            },
            role: 'user'
        });

        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.status(201).json({ 
            token, 
            user: { 
                id: user._id, 
                username, 
                email, 
                fullName,
                preferences: user.preferences,
                role: user.role 
            } 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create and send token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email,
                fullName: user.fullName,
                role: user.role 
            } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user by username and check if they are an admin
        const user = await User.findOne({ username, role: 'admin' });
        if (!user) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Create and send token with admin flag
        const token = jwt.sign(
            { 
                userId: user._id,
                role: 'admin'
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.json({ 
            token,
            user: { 
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            } 
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports = { register, login, getProfile, adminLogin }; 