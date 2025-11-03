import { body, validationResult } from 'express-validator';
import { saveContactForm, getAllContactForms } from '../../models/forms/contact.js';

const addContactSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
};

/**
 * Validation rules for contact form submission
 */
export const contactValidation = [
    body('subject')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Subject must be at least 2 characters long'),

    body('message')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Message must be at least 10 characters long')
];

/**
 * Display the contact form
 */
export const showContactForm = (req, res) => {
    addContactSpecificStyles(res);
    res.render('forms/contact/form', {
        title: 'Contact Us'
    });
};

/**
 * Process contact form submission
 */
export const processContactForm = async (req, res) => {
    // Validate input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', 'Subject must be at least 2 characters long and message must be at least 10 characters long.');
        return res.redirect('/contact');
    }

    const { subject, message } = req.body;

    // Save to DB
    const savedForm = await saveContactForm(subject, message);

    if (!savedForm) {
        req.flash('error', 'Failed to save contact form.');
        return res.redirect('/contact');
    }

    req.flash('success', 'Contact form saved!');
    res.redirect('/contact');
};

/**
 * Display all contact form submissions
 */
export const showContactResponses = async (req, res) => {
    const contactForms = await getAllContactForms();

    res.render('forms/contact/responses', {
        title: 'Contact Form Submissions',
        contactForms: contactForms
    });
};
