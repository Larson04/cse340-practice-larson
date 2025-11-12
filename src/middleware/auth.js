/**
 * Middleware to require authentication for protected routes
 * Redirects to login page if user is not authenticated
 * Sets res.locals.isLoggedIn = true for authenticated requests
 */
export const requireLogin = (req, res, next) => {
    // Check if user is logged in via session
    if (req.session && req.session.user) {
        // User is authenticated - set UI state and continue
        res.locals.isLoggedIn = true;
        next();
    } else {
        // User is not authenticated - redirect to login
        res.redirect('/login');
    }
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * Uses flash messages to communicate authorization failures
 * 
 * @param {string} roleName - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
export const requireRole = (roleName) => {
    return (req, res, next) => {
        // TODO: Check if user is logged in (req.session.user exists)
        if (!req.session.user) {
            // If not logged in, set flash message and redirect to /login
            req.flash('error', 'User not found');
            return res.redirect('/login');
        }

        // TODO: Check if user's role_name matches the required roleName
        // If roles don't match, set flash message and redirect to /
        if (req.session.user.rows[0].role_name !== roleName) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // TODO: If user has required role, call next() to continue
        if (req.session.user.rows[0].role_name === roleName) {
            next();
        }
    };
};