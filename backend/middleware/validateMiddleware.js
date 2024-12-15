const { validationResult, check } = require('express-validator');

const validateEvent = [
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Event title is required')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long'),
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    check('type')
        .isIn(['academic', 'cultural', 'sports', 'technical'])
        .withMessage('Invalid event type'),
    check('date')
        .isDate()
        .withMessage('Invalid date format'),
    check('time')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Invalid time format (HH:MM)'),
    check('maxParticipants')
        .isInt({ min: 1 })
        .withMessage('Maximum participants must be at least 1'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUser = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    check('email')
        .isEmail()
        .withMessage('Invalid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateEvent,
    validateUser
}; 