import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { courseDetailPage, catalogPage } from './catalog/catalog.js';
import { homePage,aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyDetailPage, facultyListPage } from './faculty/faculty.js';
import { 
    showContactForm, processContactForm, showContactResponses, 
    contactValidation } from './forms/contact.js';
import { 
    showRegistrationForm, processRegistration, showAllUsers,  
    showEditAccountForm, processEditAccount, processDeleteAccount,
    registrationValidation, updateAccountValidation } from './forms/registration.js';
import { requireLogin, requireRole } from '../middleware/auth.js';
import { 
    showLoginForm, processLogin, processLogout, 
    showDashboard, loginValidation } from './forms/login.js';

// Create a new router instance
const router = Router();

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:courseSlug', courseDetailPage);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, demoPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

// Faculty routes
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultySlug', facultyDetailPage);

// Contact form routes
router.get('/contact', showContactForm);
router.post('/contact', contactValidation, processContactForm);
router.get('/contact/responses', showContactResponses);

// User registration routes
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
router.get('/users', showAllUsers);

// Account management routes
router.get('/users/:id/edit', requireLogin, showEditAccountForm);
router.post('/users/:id/update', requireLogin, updateAccountValidation, processEditAccount);
router.post('/users/:id/delete', requireRole('admin'), processDeleteAccount);

// Authentication routes
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);
router.get('/logout', processLogout);

// Protected routes (require authentication)
router.get('/dashboard', requireLogin, showDashboard);

export default router;