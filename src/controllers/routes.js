import { Router } from 'express';
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { courseDetailPage, catalogPage } from './catalog/catalog.js';
import { homePage,aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyDetailPage, facultyListPage } from './faculty/faculty.js';
import { showContactForm, processContactForm, showContactResponses, contactValidation } from './forms/contact.js';

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

export default router;