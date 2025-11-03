import { body, validationResult } from 'express-validator';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const addRegistrationSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
};

/** DeanJackson2004!
 * Comprehensive validation rules for user registration
 */
export const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 7 })
        .withMessage('Name must be at least 7 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('confirmEmail')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid confirmation email')
        .normalizeEmail()
        .custom((value, { req }) => {
            if (value !== req.body.email) {
                throw new Error('Email addresses do not match');
            }
            return true;
        }),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one number and one symbol (!@#$%^&*)'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

/**
 * Display the registration form
 */
export const showRegistrationForm = (req, res) => {
    // TODO: Add registration-specific styles using res.addStyle()
    // TODO: Render the registration form view (forms/registration/form)
    addRegistrationSpecificStyles(res);
    res.render('forms/registration/form.ejs', {
        title: 'Create Account'
    });
};

/**
 * Process user registration submission
 */
export const processRegistration = async (req, res) => {
    // TODO: Check for validation errors using validationResult(req)
    const errors = validationResult(req);
    // TODO: If errors exist, redirect back to registration form
    if (!errors.isEmpty()) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/register');
    }
    // TODO: Extract name, email, password from req.body
    const { name, email, password } = req.body;
    // TODO: Check if email already exists using emailExists()
    const existsEmail = await emailExists(email);
    // TODO: If email exists, log message and redirect back
    if (existsEmail) {
        req.flash('warning', 'An account with this email already exists');
        return res.redirect('/register');
    }
    // TODO: Save the user using saveUser()
    const user = await saveUser(name, email, password);
    // TODO: If save fails, log error and redirect back
    if (!user) {
        req.flash('error', 'Failed to save user');
        return res.redirect('/register');
    }
    // TODO: If successful, log success and redirect (maybe to users list?)
    req.flash('success', 'User saved:' + name);
    res.redirect('/register');
};

/**
 * Display all registered users
 */
export const showAllUsers = async (req, res) => {
    // TODO: Get all users using getAllUsers()
    const users = await getAllUsers();
    // TODO: Add registration-specific styles
    addRegistrationSpecificStyles(res);
    // TODO: Render the users list view (forms/registration/list) with the user data
    res.render('forms/registration/list.ejs', {
        title: 'Registered Users',
        users
    });
};
