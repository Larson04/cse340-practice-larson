import { body, validationResult } from 'express-validator';
import { 
    emailExists, saveUser, getAllUsers, 
    getUserById, updateUser, deleteUser } from '../../models/forms/registration.js';

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
 * Validation rules for account updates
 */
export const updateAccountValidation = [
    body('name')
        .trim()
        .isLength({ min: 7 })
        .withMessage('Name must be at least 7 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
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

/**
 * Display the edit account form
 * Users can edit their own account, admins can edit any account
 */
export const showEditAccountForm = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // TODO: Retrieve the target user from the database using getUserById
    const targetUser = await getUserById(targetUserId);
    // TODO: Check if the target user exists
    // If not, set flash message and redirect to /users
    if(!targetUser) {
        req.flash('error', 'User not found.');
        return res.redirect('/users');
    }

    // TODO: Determine if current user can edit this account
    // Users can edit their own (currentUser.id === targetUserId)
    // Admins can edit anyone (currentUser.role_name === 'admin')
    // TODO: If current user cannot edit, set flash message and redirect
    if(currentUser.id !== targetUserId || currentUser.role_name !== 'admin') {
        req.flash('error', 'You do not have permission to edit this account.');
        return res.redirect('/users');
    }

    // TODO: Render the edit form, passing the target user data
    addRegistrationSpecificStyles(res);
    res.render('forms/registration/edit', {
        title: 'Edit Account',
        user: targetUser
    });
};

/**
 * Process account edit form submission
 */
export const processEditAccount = async (req, res) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
        req.session.flash = {
            type: 'error',
            message: 'Please correct the errors in the form.'
        };
        return res.redirect(`/users/${req.params.id}/edit`);
    }

    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const { name, email } = req.body;

    // TODO: Retrieve the target user to verify they exist
    // If not found, set flash message and redirect to /users
    const targetUser = await getUserById(targetUserId);
    if(!targetUser) {
        req.flash('error', 'User not found.');
        return res.redirect('/users');
    }

    // TODO: Check edit permissions (same as showEditAccountForm)
    // If cannot edit, set flash message and redirect
    if(currentUser.id !== targetUserId || currentUser.role_name !== 'admin') {
        req.flash('error', 'You do not have permission to edit this account.');
        return res.redirect('/users');
    }

    // TODO: Check if the new email already exists for a DIFFERENT user
    // Hint: You need to verify the email isn't taken by someone else,
    // but it's okay if it matches the target user's current email
    // If email is taken, set flash message and redirect back to edit form
    const newEmailExists = await emailExists(email);
    if(newEmailExists && targetUser.email !== email) {
        req.flash('warning', 'An account with this email already exists');
        return res.redirect(`/users/${targetUserId}/edit`);
    }

    // TODO: Update the user in the database using updateUser
    // If update fails, set flash message and redirect back to edit form
    const updatedUser = await updateUser(targetUserId, name, email);
    if(!updatedUser) {
        req.flash('error', 'Failed to update user');
        return res.redirect(`/users/${targetUserId}/edit`);
    }
    // TODO: If the current user edited their own account, update their session
    // Hint: Update req.session.user with the new name and email
    if(currentUser.id === targetUserId) {
        req.session.user.name = name;
        req.session.user.email = email;
    }

    // Success! Set flash message and redirect
    req.flash = {
        type: 'success',
        message: 'Account updated successfully.'
    };
    res.redirect('/users');
};

/**
 * Delete a user account (admin only)
 */
export const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // TODO: Verify current user is an admin
    // Only admins should be able to delete accounts
    // If not admin, set flash message and redirect
    if(currentUser.role_name !== 'admin') {
        req.flash('error', 'You do not have permission to delete accounts.');
        return res.redirect('/users');
    }

    // TODO: Prevent admins from deleting their own account
    // If targetUserId === currentUser.id, set flash message and redirect
    if(targetUserId === currentUser.id) {
        req.flash('error', 'You cannot delete your own account.');
        return res.redirect('/users');
    }

    // TODO: Delete the user using deleteUser function
    // If delete fails, set flash message and redirect
    const deletedUser = await deleteUser(targetUserId);
    if(!deletedUser) {
        req.flash('error', 'Failed to delete user.');
        return res.redirect('/users');
    }

    // Success! Set flash message and redirect
    req.session.flash = {
        type: 'success',
        message: 'Account deleted successfully.'
    };
    res.redirect('/users');
};