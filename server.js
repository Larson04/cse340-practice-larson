// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Define the port number the server will listen on
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT ||3000;

// Create an instance of an Express application
const app = express();
const name = process.env.NAME; 

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


// Define a route handler for the root URL ('/')
// app.get('/', (req, res) => {
//     res.send(`Hello, ${name}!`);
// });

/**
 * Routes
 */
app.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', { title });
});
app.get('/about', (req, res) => {
    const title = 'About Me';
    res.render('about', { title });
});
app.get('/products', (req, res) => {
    const title = 'Our Products';
    res.render('products', { title });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});