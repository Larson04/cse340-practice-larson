import { courses } from '../model/catalog/catalog.js';
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', { title });
});
router.get('/about', (req, res) => {
    const title = 'About Me';
    res.render('about', { title });
});

router.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
});

export default router;

