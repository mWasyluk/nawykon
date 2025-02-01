import bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {string} - The hashed password.
 */
export const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

/**
 * Compares a plaintext password with a hashed password.
 * @param {string} password - The plaintext password.
 * @param {string} hash - The hashed password.
 * @returns {boolean} - True if the passwords match, false otherwise.
 */
export const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};
