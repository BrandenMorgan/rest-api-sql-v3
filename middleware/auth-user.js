'use-strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */

// Middleware to authenticate the request with Basic Authentication
exports.authenticateUser = async (req, res, next) => {
    let message; //Store message to display
    //Parse the users credentials from the Authorization header.
    const credentials = auth(req);

    // If the user's credentials are available
    if (credentials) {
        /*
            Attempt to retrieve the user from the data store by their
            email (i.e. the users "key" from the Authorization header)
        */
        const user = await User.findOne({ where: { emailAddress: credentials.name } });
        if (user) {
            /*
                If a user was successfully retrieved from the data store
                use the bcryptjs npm package to compare the user's password
                (from the Authorization header) to the user's password
                that was retrieved from the data store.
             */
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            console.log(`credentials.pass: ${credentials.pass} user.password: ${user.password}`);
            if (authenticated) {
                console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
                /*
                    Store the retrieved user object on the request object so any
                    middleware functions that follow this middleware function
                    will have access to the user's information.
                 */
                req.currentUser = user;
            } else {
                message = `Authentication failure for user: ${credentials.name}`;
            }
        } else {
            message = `User not found for user: ${credentials.name}`;
        }
    } else {
        message = `Auth header not found`;
    }

    // if user authentication failed...
    if (message) {
        console.warn(message);
        // Return a response with a 401 Unauthorized HTTP status code.
        res.status(401).json({ message: 'Access Denied' });
    } else {
        // If user authentication succeeded...
        // Call the next() method.
        next();
    }
};