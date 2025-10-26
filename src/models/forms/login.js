import db from '../db.js';
import bcrypt from 'bcrypt';

/**
 * Find a user by email address for login verification
 * @param {string} email - Email address to search for
 * @returns {Promise<Object|null>} User object with password hash or null if not found
 */
export const findUserByEmail = async (email) => {
    const query = `
        SELECT id, name, email, password, created_at
        FROM users
        WHERE LOWER(email) = LOWER($1)
        LIMIT 1
    `;

    try {
        // TODO: Return the user object if found, null otherwise
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('DB Error in findUserByEmail:', error);
        return null;
    }
};

/**
 * Verify a plain text password against a stored bcrypt hash
 * @param {string} plainPassword - The password to verify
 * @param {string} hashedPassword - The stored password hash
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        // TODO: Use bcrypt.compare() to verify the password
        // Return the result (true/false)
        return await bcrypt.compare(plainPassword, hashedPassword);

    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
};
