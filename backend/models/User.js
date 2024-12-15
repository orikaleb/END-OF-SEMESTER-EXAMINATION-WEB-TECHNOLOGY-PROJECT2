const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    preferences: {
        eventTypes: [{ type: String }], // Types of events user is interested in
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        },
        maxDistance: { type: Number, default: 50 }, // Maximum distance in km
        categories: [{ type: String }] 
    },
    role: { 
        type: String, 
        default: 'user',
        enum: ['user', 'admin']
    }
}); 

const User = mongoose.model('User', userSchema);
module.exports = User;